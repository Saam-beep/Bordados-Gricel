import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No autorizado' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Sesión inválida o expirada' });
  }
}

export function requireAdmin(req, res, next) {
  if (!['ADMIN', 'SALES', 'PRODUCTION'].includes(req.user?.role)) {
    return res.status(403).json({ message: 'No tienes permisos para esta acción' });
  }
  next();
}
