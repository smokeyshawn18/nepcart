import { Router } from "express";
import {
  createAdminProduct,
  deleteAdminProduct,
  getImageKitAuth,
  listAdminProducts,
  requireAdmin,
  updateAdminOrder,
  updateAdminProduct,
} from "../controllers/adminController";

const router: Router = Router();

router.use(requireAdmin);

router.get("/imagekit/auth", getImageKitAuth);

router.get("/products", listAdminProducts);
router.post("/products", createAdminProduct);
router.patch("/products/:id", updateAdminProduct);
router.patch("/orders/:id", updateAdminOrder);
router.delete("/products/:id", deleteAdminProduct);

export default router;
