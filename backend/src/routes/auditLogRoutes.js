import { Router } from 'express';
import { auditLogController } from '../controllers/auditLogController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', protect, authorize('admin'), auditLogController.getAll);

export default router;
