import { Router } from "express";
import { authentication } from "../middlewares/auth.middleware.js";
import { profile } from "console";

const router = Router();

router.get("/profile", authentication, profile);

export default router;

