import { Router } from 'express';
import { cityController } from '../controllers/cityController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validate, createCitySchema } from '../validators/index.js';

const router = Router();

// Public
router.get('/', cityController.getAll);

// Admin only
router.post('/', protect, authorize('admin'), validate(createCitySchema), cityController.create);
router.put('/:id/toggle', protect, authorize('admin'), cityController.toggleActive);

export default router;
