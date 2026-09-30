import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { allOrders, createOrder, dashboardStats, getOrder, myOrders, updateOrderStatus, uploadOrderFiles } from '../controllers/orderController.js';

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.resolve('uploads')),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });
const router = Router();

router.use(requireAuth);
router.post('/', createOrder);
router.get('/mine', myOrders);
router.get('/admin/all', requireAdmin, allOrders);
router.get('/admin/stats', requireAdmin, dashboardStats);
router.get('/:id', getOrder);
router.patch('/:id/status', requireAdmin, updateOrderStatus);
router.post('/:id/files', upload.array('files', 8), uploadOrderFiles);
export default router;
