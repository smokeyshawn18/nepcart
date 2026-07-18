import { Router } from "express";
import { createStreamToken } from "../controllers/streamController";

const router: Router = Router();

router.post("/token", createStreamToken);

export default router;
