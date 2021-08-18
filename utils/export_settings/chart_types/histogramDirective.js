var DATA_RCVD = {};
var rowObjects = [];
var currentJson = [];
var columnObjects = [];
var metricObjects = [];
var rowelIndex = null;
var scope = {};
var chartType = null;
export const rcvSettingsHistogram = (rcvdPacket)=>{
    DATA_RCVD = rcvdPacket;
    rowObjects = getRowObjects();
    columnObjects = getColumnObjects();
    currentJson = getCurrentJson();
    metricObjects = getMetrcObjects();
    rowelIndex = 0;
    scope = setScope();
    chartType = rcvdPacket["chartType"];
    return getChartForHistogram();
}



const getRowObjects = () => {
    var rowObjects = [];
    var nameToFindInData = "";
    for (let x of DATA_RCVD.reportObjDetails["lstReportObject"]) {
        if (x["currentDrop"] == "ROW") {
            nameToFindInData = x["reportObjectName"];
            // if(DATA_RCVD.chartType == "line")
            //     continue;
            break;
        }
    }
    for (let x of DATA_RCVD.data["Data"]) {
        rowObjects.push(x[nameToFindInData]);
    }
    return rowObjects;
}

const getColumnObjects = () => {
    var colObjects = [];
    var nameToFindInData = "";
    for (let x of DATA_RCVD.reportObjDetails["lstReportObject"]) {
        if (x["currentDrop"] == "COLUMN") {
            nameToFindInData = x["reportObjectName"]
            break;
        }
    }
    for (let x of DATA_RCVD.data["Data"]) {
        colObjects.push(x[nameToFindInData]);
    }
    return colObjects;
}

const getCurrentJson = ()=>{
    var currentJson = DATA_RCVD.data["Data"];
    var nameToFindInData = "";
    for (let x of DATA_RCVD.reportObjDetails["lstReportObject"]) {
        if (x["currentDrop"] == "ROW") {
            nameToFindInData = x["reportObjectName"]
            break;
        }
    }
    var obj = {
        columnObjects,
        item : nameToFindInData,
        rowObjects
    }
    currentJson.push(obj);
    // console.log(currentJson);
    return currentJson;
}

const getMetrcObjects = ()=>{
    var metricObjects = [];
    
    for (let x of DATA_RCVD.reportObjDetails["lstReportObject"]) {
        if (x["currentDrop"] == "VALUE") {
            metricObjects.push(x["reportObjectName"]);
        }
    }
    // console.log(metricObjects.length)
    return metricObjects;
}

const setScope = ()=>{
    var scope = {
        showDataLabels : true,
        // shayad this stores array of rows shayad 
        chartstates : (function getchartStates(){
            var rowObjects = [];
            var nameToFindInData = "";
            for (let x of DATA_RCVD.reportObjDetails["lstReportObject"]) {
                if (x["currentDrop"] == "ROW") {
                    nameToFindInData = x["reportObjectName"];
                    
                    break;
                }
            }
            for (let x of DATA_RCVD.data["Data"]) {
                rowObjects.push(x[nameToFindInData]);
            }
            return rowObjects;
        }()), 
        activeChart : {
            name : DATA_RCVD.chartType
        },
        valueList : (function getValueList(){
            var valueList = [];
            
            for (let x of DATA_RCVD.reportObjDetails["lstSortReportObject"]) {
                if (x["reportObject"]["currentDrop"] == "VALUE") {
                    var obj = {
                        reportObject : x["reportObject"]
                    }
                    valueList.push(x["reportObject"]);
                }
            }
            return valueList;
        }()),
        rowList : (function getRowList(){
            var rowList = [];
            
            for (let x of DATA_RCVD.reportObjDetails["lstSortReportObject"]) {
                if (x["reportObject"]["currentDrop"] == "ROW") {
                    rowList.push(x["reportObject"]);
                }
            }
            return rowList;
        }()),
        columnList : (function getColList(){
            var colList = [];
            
            for (let x of DATA_RCVD.reportObjDetails["lstSortReportObject"]) {
                if (x["reportObject"]["currentDrop"] == "COLUMN") {
                    colList.push(x["reportObject"]);
                }
            }
            return colList;
        }())
    
    }
    return scope;
}

var createXAxis = function () {
    var data = [];
    if ((columnObjects.length > 0 && rowObjects.length == 0
        && (scope.activeChart.name == "Stacked Column Chart" || scope.activeChart.name == "Stacked Bar Chart" || scope.activeChart.name == "line" || scope.activeChart.name == "100% Stacked Bar Chart" || scope.activeChart.name == "100% Stacked Column Chart"))) {
        data.push("");
    }
    else if (columnObjects.length) {
        if (rowObjects.length == 0) {
            for (var i = 0; i < columnObjects.length; i++) {
                data.push(columnObjects[i]);
            }
        }
        else {
            for (var i = 0; i < rowObjects.length; i++) {
                data.push(rowObjects[i]);
            }
            if (scope.activeChart.name == "Waterfall Chart") {
                data.push("Total");
            }
        }
    }
    // this runs-> 
    else {
        currentJson[currentJson.length - 1].rowObjects.forEach(function (value, key) {
            data.push(value);

            // data contains all the labels in form of array 
            // 0: "CORPORATE SERVICES"
            // 1: "BUILDING MATERIALS & PRODUCTS"
            // 2: "METALS".....
        });
        if (scope.activeChart.name == "Waterfall Chart") {
            data.push("Total");
        }
    }
    return data;
};

var createGraphTitle = function (rowelIndex) {
    var data = "";
    // scope.valueList.length => number of report objects in reportDetailsObj with currentDrop as VALUE
    for (var i = 0; i < scope.valueList.length; i++) {
        data += i != scope.valueList.length - 1 ? (scope.valueList[i].displayName + " and ") : (scope.valueList[i].displayName);
    }

    // scope.rowList => number of report objects in reportDetailsObj with currentDrop as ROW
    // scope.columnList.length 0 as column list does not exist in pie 
    if (scope.rowList.length > 0 || scope.columnList.length > 0)
        data += ' by ';
    if (scope.rowList.length)
        data += scope.rowList[rowelIndex].displayName;
    if (scope.columnList[0])
        if (scope.rowList.length == 0)
            data += (scope.columnList[0].displayName);
        else
            data += (' and ' + scope.columnList[0].displayName);
    return data;
};

var getDataByIndex = function (i) {
    var data = [];
    var temp = [];
    var seriesObject;
    var reportObject = { configurationValue: "" };
    seriesObject = columnObjects.length ? columnObjects : metricObjects;
    // if ((columnObjects.length > 0 && rowObjects.length == 0)) {
    //     reportObject = _.find(scope.reportObjDetails.lstReportObject, { displayName: metricObjects[0] });
    // }
    // else {
    //     reportObject = _.find(scope.reportObjDetails.lstReportObject, { displayName: seriesObject[i] });
    // }
    for (var j = 0; j < currentJson.length - 1; j++) {
        var obj = {};
        obj["y"] = currentJson[j][metricObjects[i]];
        data.push(obj);
    }
    // var configVal = getWijmoConfigurationFormatCallback(reportObject.configurationValue, reportObject.filterType);
    // if ((configVal != undefined && configVal[0] == 'p') || reportObject.formatKey == report.resources.CommonConstants.Percent) {
    //     angular.forEach(data, function (value, index) {
    //         if (value != null) {
    //             if (value.hasOwnProperty('y')) {
    //                 value.y = value.y * 100;
    //             }
    //             else {
    //                 data[index] = value * 100;
    //             }
    //         }
    //     }, data);
    // }
    return data;
};


var getSeriesDataForHistogram = function () {
    var temp = [];
    var seriesObject;
    if (rowObjects.length != 0)
        seriesObject = columnObjects.length ? columnObjects : metricObjects;
    else if (rowObjects.length == 0 && columnObjects.length != 0)
        seriesObject = metricObjects;
    var _loop_1 = function () {
        temp[i] = {};
        if (i == 0) {
            temp[0].cursor = 'pointer';
            temp[0].type = chartType;
            temp[0].name = seriesObject[0];
            //temp[0].color = 'rgba(165,170,217,1)';
            // if (rowObjects.length > 0 && columnObjects.length > 0)
            //     temp[0].color = getSeriesColor(seriesObject[0], 0);
            // else
            //     temp[0].color = getSeriesColor(seriesObject[0], 0);
            temp[0].data = getDataByIndex(0);
            temp[0].pointPadding = 0.44,
                temp[0].pointPlacement = -0.15,
                temp[0].type = "column";
        }
        else if (i == 1) {
            temp[1].cursor = 'pointer';
            temp[1].type = chartType;
            temp[1].name = seriesObject[1];
            // //temp[1].color = 'rgba(126,86,134,.9)';
            // if (rowObjects.length > 0 && columnObjects.length > 0)
            //     temp[1].color = getSeriesColor(seriesObject[1], 1);
            // else
            //     temp[1].color = getSeriesColor(seriesObject[1], 1);
            temp[1].data = getDataByIndex(1);
            temp[1].pointPadding = 0.44,
                temp[1].pointPlacement = -0.25,
                temp[1].type = "column";
        }
        else if (i == 2) {
            temp[2].cursor = 'pointer';
            temp[2].type = chartType;
            temp[2].name = seriesObject[2];
            //temp[2].color = 'rgba(255,165,0,.5)';
            // if (rowObjects.length > 0 && columnObjects.length > 0)
            //     temp[2].color = getSeriesColor(seriesObject[2], 2);
            // else
            //     temp[2].color = getSeriesColor(seriesObject[2], 2);
            temp[2].data = getDataByIndex(2);
            temp[2].pointPadding = 0.3,
                temp[2].pointPlacement = -0.2,
                temp[2].type = "column";
        }
        var currentObj = void 0;
        // currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == seriesObject[i]; });
        // var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
        // var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
        // temp[i].tooltip = {
        //     format: configFormat,
        //     trigger: 'selection',
        //     formatKey: currentObj.formatKey,
        //     currenyBeforeAmount: currenyBeforeAmount,
        //     headerFormat: '<span style="font-size:10px">{point.key}</span><table><br/>',
        //     shared: true,
        //     pointFormatter: function () {
        //         return getSeriesPointFormatter(this);
        //     },
        //     footerFormat: '</table>',
        // };
        temp[i].dataLabels = {
            enabled: scope.showDataLabels,
            allowOverlap: true,
            crop: false,
            overflow: 'none',
            useHTML: true,
            color: '#000000',
            style: {
                fontWeight: 'normal',
                textShadow: 'none',
                fontSize: scope.selectedFontSize + "px"
            },
            states: {
                inactive: {
                    opacity: 1
                }
            },
            // formatter: function () {
            //     if ((scope.showDataLabels)) {
            //         return (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey != report.resources.CommonConstants.Percent && this.series.userOptions.tooltip && this.series.userOptions.tooltip.format == "" ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "") +
            //             utilities.formatChartTooltip(this.y, configFormat) +
            //             (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey && this.series.userOptions.tooltip.format == "" && (this.series.userOptions.tooltip.formatKey == report.resources.CommonConstants.Percent || !this.series.userOptions.tooltip.currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "");
            //     }
            // }
        };
    };
    for (var i = 0; i < seriesObject.length; i++) {
        _loop_1();
    }
    return temp;
};

const getChartForHistogram = function () {
    scope.showDataLabels = false;
    var _histogramConfig = {
        chart: {
            zoomType: 'xy'
        },
        title: {
            align: 'left',
            text: ''
        },
        initChart: false,
        xAxis: {
            categories: createXAxis(),
            crosshair: {
                color: "none"
            },
            labels: {
                // formatter: function () {
                //     if (typeof this.value === 'string') {
                //         return (this.value.length < report.resources.chartLabelSize) ? this.value : this.value.substring(0, report.resources.chartLabelSize - 1) + '...';
                //     }
                //     return this.value;
                // }
            }
        },
        yAxis: (function () {
            return {
                max: null,
                min: null,
                labels: {
                    // formatter: function () {
                    //     // Nine Zeroes for Billions
                    //     return Math.abs(this.value) >= 1.0e+9
                    //         ? utilities.globalizeNumber(Math.sign(this.value) * Math.abs(this.value) / 1.0e+9) + "B"
                    //         : Math.abs(this.value) >= 1.0e+6
                    //             ? utilities.globalizeNumber(Math.sign(this.value) * Math.abs(this.value) / 1.0e+6) + "M"
                    //             : Math.abs(this.value) >= 1.0e+3
                    //                 ? utilities.globalizeNumber(Math.sign(this.value) * Math.abs(this.value) / 1.0e+3) + "K"
                    //                 : utilities.globalizeNumber(this.value);
                    // }
                }
            };
        }()),
        plotOptions: {
            column: {
                grouping: false,
                shadow: false,
                borderWidth: 0
            }
        },
        legend: {
            itemDistance: 8,
            maxHeight: 40,
            layout: 'horizontal',
            alignColumns: false,
            navigation: {
                activeColor: '#3E576F',
                animation: true,
                arrowSize: 12,
                inactiveColor: '#CCC',
                style: {
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: '12px'
                }
            }
        },
        series: getSeriesDataForHistogram(),
        exporting: {
            enabled: false,
            chartOptions: {
                title: {
                    text: createGraphTitle(rowelIndex)
                },
                legend: {
                    alignColumns: true
                }
            }
        },
        // lang: {
        //     decimalPoint: utilities.globalizeDecimalOptionsForChart(),
        //     thousandsSep: utilities.globalizeThousandsSepOptionsForChart()
        // },
        credits: {
            enabled: false
        }
    };
    // if (!scope.renderOnPopup) {
    //     scope.highchartsNgTitle = createGraphTitle(rowelIndex);
    //     legendCallback();
    //     $('#histogram-chart-container').highcharts(_histogramConfig);
    // }
    // else {
    //     $("#chart-container-popup").highcharts(_histogramConfig);
    // }
    return _histogramConfig;
};