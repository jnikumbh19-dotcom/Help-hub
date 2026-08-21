import { Router } from 'express';
import { complaintController } from '../controllers/complaintController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validate, createComplaintSchema, updateComplaintStatusSchema } from '../validators/index.js';

const router = Router();

router.get('/', protect, complaintController.getAll);
router.post('/', protect, validate(createComplaintSchema), complaintController.create);
router.put('/:id/status', protect, authorize('admin'), validate(updateComplaintStatusSchema), complaintController.updateStatus);

export default router;
