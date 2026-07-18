import { Router } from "express";
import { createCheckout } from "../controllers/checkoutController";

const router: Router = Router();

router.post("/", createCheckout);

export default router;
