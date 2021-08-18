import { fork } from "child_process";
import express from "express";
const router = express.Router();
import { getPPTCtrl } from "../controllers/controlPPT";

router.post("/get_ppt", getPPTCtrl);

module.exports = router;