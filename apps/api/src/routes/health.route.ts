import { Router } from 'express';
import { getHealth } from "../controllers/health.controller.js";
import { asyncHandler } from "../types/async-handler.js";

const router = Router();
// router.get('/', (_req, res) => {
//   res.status(200).json({
//     status: 'ok',
//     service: "sprintHub API"
//   });
// });

router.get('/', asyncHandler(getHealth));

export default router;