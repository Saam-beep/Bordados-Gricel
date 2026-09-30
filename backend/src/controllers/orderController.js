import { prisma } from '../db.js';

function nextOrderNumber(id) {
  return `BG-${String(id).padStart(6, '0')}`;
}

export async function createOrder(req, res) {
  const customerId = req.user.id;
  const { serviceType, product, quantity, sizes, colors, notes, requestedDate } = req.body;
  if (!serviceType || !product || !quantity) return res.status(400).json({ message: 'Servicio, producto y cantidad son obligatorios' });

  const temp = await prisma.order.create({
    data: {
      orderNumber: `TMP-${Date.now()}-${customerId}`,
      customerId,
      serviceType,
      product,
      quantity: Number(quantity),
      sizes: sizes || undefined,
      colors: colors || null,
      notes: notes || null,
      requestedDate: requestedDate ? new Date(requestedDate) : null,
      history: { create: { status: 'RECEIVED', note: 'Pedido recibido desde el portal web' } }
    }
  });

  const order = await prisma.order.update({
    where: { id: temp.id },
    data: { orderNumber: nextOrderNumber(temp.id) },
    include: { customer: true, files: true, history: true }
  });

  res.status(201).json(order);
}

export async function myOrders(req, res) {
  const orders = await prisma.order.findMany({
    where: { customerId: req.user.id },
    include: { files: true, history: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
}

export async function getOrder(req, res) {
  const order = await prisma.order.findUnique({
    where: { id: Number(req.params.id) },
    include: { customer: { select: { id: true, name: true, email: true, phone: true, whatsapp: true, company: true } }, files: true, history: { orderBy: { createdAt: 'asc' } } }
  });
  if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
  if (req.user.role === 'CLIENT' && order.customerId !== req.user.id) return res.status(403).json({ message: 'Sin acceso' });
  res.json(order);
}

export async function allOrders(req, res) {
  const orders = await prisma.order.findMany({
    include: { customer: { select: { id: true, name: true, email: true, phone: true, company: true } }, files: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
}

export async function updateOrderStatus(req, res) {
  const { status, note, confirmedDate, total, deposit } = req.body;
  const current = await prisma.order.findUnique({ where: { id: Number(req.params.id) } });
  if (!current) return res.status(404).json({ message: 'Pedido no encontrado' });

  const parsedTotal = total !== undefined && total !== '' ? Number(total) : undefined;
  const parsedDeposit = deposit !== undefined && deposit !== '' ? Number(deposit) : undefined;
  const effectiveTotal = parsedTotal ?? (current.total ? Number(current.total) : undefined);
  const effectiveDeposit = parsedDeposit ?? (current.deposit ? Number(current.deposit) : 0);

  const order = await prisma.order.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(status && { status }),
      ...(confirmedDate !== undefined && { confirmedDate: confirmedDate ? new Date(confirmedDate) : null }),
      ...(parsedTotal !== undefined && { total: parsedTotal }),
      ...(parsedDeposit !== undefined && { deposit: parsedDeposit }),
      ...(effectiveTotal !== undefined && { balance: effectiveTotal - effectiveDeposit }),
      ...(status && { history: { create: { status, note: note || 'Estado actualizado por administración' } } })
    },
    include: { customer: true, files: true, history: { orderBy: { createdAt: 'asc' } } }
  });
  res.json(order);
}

export async function uploadOrderFiles(req, res) {
  const orderId = Number(req.params.id);
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
  if (req.user.role === 'CLIENT' && order.customerId !== req.user.id) return res.status(403).json({ message: 'Sin acceso' });

  const data = (req.files || []).map(file => ({ orderId, fileName: file.originalname, filePath: `/uploads/${file.filename}`, mimeType: file.mimetype }));
  if (data.length) await prisma.orderFile.createMany({ data });
  const files = await prisma.orderFile.findMany({ where: { orderId }, orderBy: { createdAt: 'desc' } });
  res.json(files);
}

export async function dashboardStats(req, res) {
  const [orders, clients, byStatus] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CLIENT' } }),
    prisma.order.groupBy({ by: ['status'], _count: { status: true } })
  ]);
  const totalSales = await prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' } } });
  res.json({ orders, clients, totalSales: Number(totalSales._sum.total || 0), byStatus });
}
