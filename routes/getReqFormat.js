import express from "express";
const router = express.Router();

const reqFormat = {
    "title": "HIGHCHARTS CUSTOM EXPORT SERVER WITH PPT/PDF SUPPORT!",
    "toUse": "make POST request using sample format to api/get_ppt or api/get_pdf or api/get_image",
    "sample format": {
      "chartType": "type",
      "reportObjDetails": "details",
      "data": "data"
    }
  };
  
router.post("/", (req, res) => {
    res.json(reqFormat);
});

router.get("/", (req, res) => {
    res.json(reqFormat);
});

module.exports = router;