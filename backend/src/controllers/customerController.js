import { prisma } from '../db.js';

export async function allCustomers(req, res) {
  const customers = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    select: { id: true, name: true, email: true, phone: true, whatsapp: true, company: true, nit: true, address: true, createdAt: true, _count: { select: { orders: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(customers);
}
