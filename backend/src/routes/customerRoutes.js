import { Router } from 'express';
import { allCustomers } from '../controllers/customerController.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
const router = Router();
router.use(requireAuth, requireAdmin);
router.get('/', allCustomers);
export default router;
