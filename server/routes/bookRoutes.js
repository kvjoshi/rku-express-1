import express from "express";
import * as bookController from "../controllers/bookController.js";
import { userProtectBearer } from "../middlewares/userProtect.js";


const router = express.Router();

router.get("/",userProtectBearer, bookController.listBooks);
router.post("/create",userProtectBearer, bookController.createBook);
router.get("/find/:id",userProtectBearer, bookController.getBook);
router.get("/user/", userProtectBearer,bookController.booksByUser);

export default router;
