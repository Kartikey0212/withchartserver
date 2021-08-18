// import all chart type files 
import { rcvChartJson } from "./chart_types/rcvChartJson.js";
import { rcvSettingsHistogram } from "./chart_types/histogramDirective.js";
import { rcvSettingsHeatmap } from "./chart_types/heatmapDirective.js";
import { rcvSettingsGauge } from "./chart_types/gaugeDirective.js";
import { rcvSettingsBubble } from "./chart_types/bubbleDirective.js";
// this is an interface 
export const getExportSettings = (rcvdPacket)=>{
    var chartType = rcvdPacket.chartType;
    var exportSettings = {
        type : "jpeg",
        scale : 2,
        options : {},
        useHTML : true,
        height : 200
    }
    rcvdPacket["reportObjDetails"] = JSON.parse(rcvdPacket["reportObjDetails"]);
    if(chartType == "pie" || chartType == "Donut Chart" || chartType == "line" || chartType == "column"){
        exportSettings.options = rcvChartJson(rcvdPacket);
    }
    else if(chartType == "histogram"){
        exportSettings.options = rcvSettingsHistogram(rcvdPacket);
    }
    else if(chartType == "heatmap"){
        exportSettings.options = rcvSettingsHeatmap(rcvdPacket);
    }
    else if(chartType == "gauge"){
        exportSettings.options = rcvSettingsGauge(rcvdPacket);
    }
    else if(chartType == "bubble"){
        exportSettings.options = rcvSettingsBubble(rcvdPacket);
    }
    return exportSettings;
}
