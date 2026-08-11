import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { register, login, me, refresh } from "../controllers/auth.controller.js";
import { validate } from '../middlewares/validate.middleware.js';
import { Router } from 'express';
import { authentication } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post("/refresh", refresh);



router.get("/me", authentication, me);

router.get("/admin", authentication, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" })
})



export default router;