import { Router } from "express";
import {
  getCategories,
  getProductBySlug,
  getProductsByIds,
  listFeaturedProducts,
  listProducts,
} from "../controllers/productController";

const router: Router = Router();

router.get("/", listProducts);
router.get("/featured", listFeaturedProducts);
router.get("/categories", getCategories);
router.post("/by-ids", getProductsByIds);
router.get("/:slug", getProductBySlug);

export default router;
