import express from "express";
const router = express.Router();
import { getPDFCtrl } from "../controllers/controlPDF";

router.post("/get_pdf", getPDFCtrl);

module.exports = router;