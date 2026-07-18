import { Router } from "express";
import {
  cancelOrder,
  createStreamChannel,
  createVideoInvite,
  getOrder,
  listOrders,
} from "../controllers/orderController";

const router: Router = Router();

router.get("/", listOrders);
router.get("/:id", getOrder);
router.patch("/:id/cancel", cancelOrder);
router.post("/:id/stream-channel", createStreamChannel);
router.post("/:id/video-invite", createVideoInvite);

export default router;
