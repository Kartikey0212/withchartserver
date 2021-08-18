import express from "express";
const router = express.Router();
import { getIMGCtrl } from "../controllers/controlIMG";

router.post("/get_image", getIMGCtrl);

module.exports = router;
