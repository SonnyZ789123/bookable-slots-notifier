import { Router } from "express";
import { startDaemon, stopDaemon } from "../controllers/daemonController.js";

const router = Router();

router.post("/start", startDaemon);
router.post("/stop", stopDaemon);

export default router;
