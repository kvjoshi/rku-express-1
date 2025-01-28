import express from "express";
import { userProtectBearer, userProtectCookie } from "../middlewares/userProtect";

import { createUser,listUsers, getUser, loginUser } from "../controllers/userController";

const router = express.Router();

router.post("/login", loginUser);

router.get("/users", userProtectBearer, listUsers);
router.get("/me" ,userProtectBearer, getUser);

export default router;