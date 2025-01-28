import express from "express";


const router = express.Router();

router.get("/", (req, res) => {
    res.send("API is working");
});
router.get("/1", (_req, res) => {
    res.send("API is working");
});


export default router;
