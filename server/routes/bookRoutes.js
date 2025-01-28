import express from "express";
import * as bookController from "../controllers/bookController.js";
import { userProtectBearer } from "../middlewares/userProtect.js";

const router = express.Router();

router.get("/", bookController.listBooks);
router.post("/create", bookController.createBook);
router.get("/:id", bookController.getBook);
router.get("/user", userProtectBearer,bookController.booksByUser);

export default router;
