import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { register, login } from "../controllers/auth.controller.js";
import { validate } from '../middlewares/validate.middleware.js';
import { Router } from 'express';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;