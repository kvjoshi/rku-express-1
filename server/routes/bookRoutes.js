import express from "express";
import * as bookController from "../controllers/bookController.js";

const router = express.Router();

router.get("/", bookController.listBooks);
router.post("/create", bookController.createBook);
router.get("/:id", bookController.getBook);

export default router;
