import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import customerRoutes from './routes/customerRoutes.js';

if (!process.env.JWT_SECRET) {
  console.error('Falta JWT_SECRET en .env');
  process.exit(1);
}

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/api/health', (_, res) => res.json({ ok: true, service: 'Bordados Gricel API' }));
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`API lista en http://localhost:${port}`));
