import { Router } from 'express';
import { providerController } from '../controllers/providerController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validate, createProviderSchema, updateProviderSchema } from '../validators/index.js';

const router = Router();

// Public
router.get('/', providerController.getAll);
router.get('/:id', providerController.getById);

// Protected
router.post('/', protect, authorize('business', 'admin'), validate(createProviderSchema), providerController.create);
router.put('/:id', protect, authorize('business', 'admin'), validate(updateProviderSchema), providerController.update);
router.delete('/:id', protect, authorize('admin'), providerController.delete);

// Admin actions
router.put('/:id/verify', protect, authorize('admin'), providerController.verify);
router.put('/:id/approve', protect, authorize('admin'), providerController.approve);
router.put('/:id/reject', protect, authorize('admin'), providerController.reject);
router.put('/:id/toggle-active', protect, authorize('admin', 'business'), providerController.toggleActive);

export default router;
