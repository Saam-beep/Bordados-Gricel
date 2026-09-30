import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../db.js';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  company: z.string().optional(),
  nit: z.string().optional(),
  address: z.string().optional()
});

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '8h' });
}

export async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() });

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (exists) return res.status(409).json({ message: 'El correo ya está registrado' });

  const { password, ...profile } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { ...profile, email: profile.email.toLowerCase(), passwordHash },
    select: { id: true, name: true, email: true, role: true, phone: true, whatsapp: true, company: true }
  });

  res.status(201).json({ user, token: createToken(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email: String(email || '').toLowerCase() } });
  if (!user || !(await bcrypt.compare(String(password || ''), user.passwordHash))) {
    return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
  }
  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, whatsapp: user.whatsapp, company: user.company };
  res.json({ user: safeUser, token: createToken(user) });
}
