import { Router } from "express";
import {
  createCheckout,
  verifyEsewaCheckout,
} from "../controllers/checkoutController";

const router: Router = Router();

router.post("/", createCheckout);
router.get("/esewa/verify", verifyEsewaCheckout);

export default router;
