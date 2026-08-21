import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validate, updateProfileSchema, updateRoleSchema } from '../validators/index.js';

const router = Router();

router.get('/', protect, authorize('admin'), userController.getAllUsers);
router.put('/:id/profile', protect, validate(updateProfileSchema), userController.updateProfile);
router.put('/:id/role', protect, authorize('admin'), validate(updateRoleSchema), userController.updateRole);

export default router;
