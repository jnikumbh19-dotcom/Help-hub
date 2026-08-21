import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { validate, registerSchema, loginSchema } from '../validators/index.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', protect, authController.getMe);

export default router;
