import { Router } from "express";
import UserController from "../controllers/user.controller";
import authMiddleware from "../middleware/auth.middleware";

const routes = () => {
  const router = Router();
  const controller = new UserController();

  router.get("/", controller.list);
  router.get("/:id", controller.show);
  // router.put("/:id", controller.update);
  router.post("/", controller.create);
  // router.delete("/:id", controller.delete);
  return router;
};

export default routes;
