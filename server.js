import express from "express";
import { getChartJson } from "./getData";
const PORT = 3000;
var app = express();
app.post("/", (req, res)=>{
    var result = getChartJson(req.body);
    console.log(result);
})
app.listen(PORT);