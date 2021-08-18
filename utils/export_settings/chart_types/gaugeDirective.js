var DATA_RCVD = {};
var rowObjects = [];
var currentJson = [];
var columnObjects = [];
var metricObjects = [];
var rowelIndex = null;
var scope = {};
var chartType = null;
export const rcvSettingsGauge = (rcvdPacket)=>{
    DATA_RCVD = rcvdPacket;
    rowObjects = getRowObjects();
    columnObjects = getColumnObjects();
    currentJson = getCurrentJson();
    metricObjects = getMetrcObjects();
    rowelIndex = 0;
    scope = setScope();
    chartType = rcvdPacket["chartType"];
    return createGaugeChart();
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

var getYaxisLabelsFormat = function () {
    // var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
    var format, colorFormat;
    if (scope.valueList.length == 2) {
        // colorFormat = getWijmoConfigurationFormatCallback(scope.valueList[1].configurationValue, scope.valueList[1].filterType);
        return {
            y: 18,
            align: 'center',
            style: {
                fontSize: 12,
                color: 'black'
            },
            // formatter: function () {
            //     return this.isFirst ? this.axis.min :
            //         ((scope.valueList[1].formatKey != "" && scope.valueList[1].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && colorFormat == "" ? report.resources.FormatType[scope.valueList[1].formatKey] : '')
            //             + '' + utilities.formatChartTooltip(this.axis.max, colorFormat)
            //             + (scope.valueList[1].formatKey != "" && scope.valueList[1].formatKey != null && colorFormat == "" && (scope.valueList[1].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[1].formatKey] : ''));
            // }
        };
    }
    else {
        // format = getWijmoConfigurationFormatCallback(scope.valueList[0].configurationValue, scope.valueList[0].filterType);
        // colorFormat = getWijmoConfigurationFormatCallback(scope.valueList[2].configurationValue, scope.valueList[2].filterType);
        return {
            y: 18,
            align: 'center',
            style: {
                fontSize: 12,
                color: 'black'
            },
            // formatter: function () {
            //     return this.isFirst ?
            //         ((scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && format == "" ? report.resources.FormatType[scope.valueList[0].formatKey] : '')
            //             + '' + utilities.formatChartTooltip(this.axis.min, format)
            //             + (scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != null && format == "" && (scope.valueList[0].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[0].formatKey] : ''))
            //         :
            //         ((scope.valueList[2].formatKey != "" && scope.valueList[2].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && colorFormat == "" ? report.resources.FormatType[scope.valueList[2].formatKey] : '')
            //             + '' + utilities.formatChartTooltip(this.axis.max, colorFormat)
            //             + (scope.valueList[2].formatKey != "" && scope.valueList[2].formatKey != null && colorFormat == "" && (scope.valueList[2].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[2].formatKey] : ''));
            // }
        };
    }
};

var createGaugeChart = function () {
    var gaugeData = {};
    var gaugeChartEle;
    var gaugeChartExportList = [];
    // var node = document.getElementById("gauge-chart-container");
    // node.innerHTML = '';
    var gaugeCount = 0;
    currentJson.forEach(function (y) {
        if (y[scope.rowList[0]["displayName"]] != undefined)
            gaugeData[y[scope.rowList[0]["displayName"]]] =
            {
                'value': (scope.valueList.length == 2) ? y[metricObjects[0]] : y[metricObjects[1]],
                'min': (scope.valueList.length == 2) ? 0 : y[metricObjects[0]],
                'max': (scope.valueList.length == 2) ? y[metricObjects[1]] : y[metricObjects[2]],
                'isValid': (scope.valueList.length == 2) ? true : ((y[metricObjects[0]] < y[metricObjects[2]]) || (y[metricObjects[0]] == y[metricObjects[2]]))
            };
    });
    // var currenyBeforeAmount = utilities.getCurrencySymbolLocation(), format, currencyFormatKey, displayName, isTwoMetrics;
    if (scope.valueList.length == 2) {
        isTwoMetrics = true;
        // format = getWijmoConfigurationFormatCallback(scope.valueList[0].configurationValue, scope.valueList[0].filterType);
        currencyFormatKey = scope.valueList[0].formatKey;
        displayName = scope.valueList[0].displayName;
    }
    else if (scope.valueList.length == 3) {
        isTwoMetrics = false;
        // format = getWijmoConfigurationFormatCallback(scope.valueList[1].configurationValue, scope.valueList[1].filterType);
        currencyFormatKey = scope.valueList[1].formatKey;
        displayName = scope.valueList[1].displayName;
    }
    scope.highchartsNgTitle = createGraphTitle(rowelIndex);
    // if ($("#report-gauge-chart-wrapper").parents("#gauge-chart-container").length == 0) {
    //     $("#gauge-chart-container").append('<div class="col s12" id="report-gauge-chart-wrapper"></div>');
    // }
    for (var property in gaugeData) {
        var gaugeId = 'gauge' + gaugeCount;
        var gaugeId = property.replace(/[^A-Z0-9]+/ig, "_");
        // if ($("#" + gaugeId).parents("#report-gauge-chart-wrapper").length == 0) {
        //     if (Object.keys(gaugeData).length == 1) {
        //         $("#report-gauge-chart-wrapper").append('<div id="' + gaugeId + '" style="min-width: 446px; margin: 0px auto;height: 200px;overflow: hidden; margin-top:60px;"></div>');
        //     }
        //     else if (Object.keys(gaugeData).length == 2 || Object.keys(gaugeData).length == 4) {
        //         $("#report-gauge-chart-wrapper").append('<div  class="col s6" id="' + gaugeId + '" style="width: 426px; height: 200px; margin-top:60px;"></div>');
        //     }
        //     else if (Object.keys(gaugeData).length == 3) {
        //         $("#report-gauge-chart-wrapper").append('<div  class="col s6" id="' + gaugeId + '" style="width: 400px; height: 200px; float:left; margin-top:60px; margin-left:30px;"></div>');
        //     }
        //     else if (Object.keys(gaugeData).length >= 5) {
        //         $("#report-gauge-chart-wrapper").append('<div id="' + gaugeId + '" style="width: 400px; height: 200px;float:left;"></div>');
        //     }
        // }
        if (gaugeData[property].min > gaugeData[property].max) {
            var chartDiv = document.getElementById(gaugeId);
            var gaugeList = _.filter(gaugeData, function (a) { return a.isValid; });
            if (gaugeList.length == 0) {
                scope.isGaugeChartError = true;
                break;
            }
            else {
                chartDiv.classList.add('borderAll');
                chartDiv.innerHTML = '<div class=" marginTop70 fontSize15 aCenter">' + $translate.instant('Insights_GaugeErrorMessage') + '</div>';
            }
            continue;
        }
        else if (gaugeData[property].min == gaugeData[property].max) {
            var chartDiv = document.getElementById(gaugeId);
            var gaugeList = _.filter(gaugeData, function (a) { return a.isValid; });
            if (gaugeList.length == 0) {
                scope.isGaugeChartErrorForSameValues = true;
                break;
            }
            else {
                chartDiv.classList.add('borderAll');
                chartDiv.innerHTML = '<div class=" marginTop70 fontSize15 aCenter">' + $translate.instant('Insights_GaugeErrorMessageMinMaxSame') + '</div>';
            }
            continue;
        }
        gaugeChartExportList[gaugeCount] = {
            chart: {
                type: 'solidgauge'
            },
            title: {
                align: 'left',
                text: '',
                margin: 30,
                style: {
                    fontSize: '10px'
                }
            },
            pane: {
                size: '140%',
                center: ['50%', '85%'],
                startAngle: -90,
                endAngle: 90,
                background: {
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            scrollbar: { enabled: false, showFull: false },
            init: false,
            yAxis: {
                stops: (false) ? [
                    [0.1, '#8B0707'],
                    [0.49, '#8B0707'],
                    [0.5, '#55BF3B'],
                    [0.9, '#55BF3B']
                ] : [
                    [0.1, '#55BF3B'],
                    [0.49, '#55BF3B'],
                    [0.5, '#8B0707'],
                    [0.9, '#8B0707']
                ],
                title: {
                    text: property,
                    y: -70
                },
                min: gaugeData[property].min,
                max: gaugeData[property].max,
                labels: getYaxisLabelsFormat(),
                tickPositioner: function () {
                    return [
                        this.min, this.max
                    ];
                },
                lineWidth: 0,
                minorTickInterval: null,
                tickAmount: 2
            },
            plotOptions: {
                series: {
                    cursor: 'pointer'
                },
                solidgauge: {
                    dataLabels: {
                        enabled: true,
                        y: -40,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            },
            // tooltip: {
            //     useHTML: true,
            //     headerFormat: '<span style="font-size:10px">',
            //     formatter: function () {
            //         return (displayName + ':' + '<b>'
            //             + (currencyFormatKey != "" && currencyFormatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && format == "" ? report.resources.FormatType[currencyFormatKey] : '')
            //             + utilities.formatChartTooltip(this.y, format)
            //             + (currencyFormatKey != "" && currencyFormatKey != null && format == "" && (currencyFormatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[currencyFormatKey] : '')
            //             + '</b><br>');
            //     },
            //     footerFormat: '</span>',
            //     positioner: function (labelWidth, labelHeight, point) {
            //         var tooltipX = point.plotX - 50;
            //         var tooltipY = point.plotY - 70;
            //         return {
            //             x: tooltipX,
            //             y: tooltipY
            //         };
            //     }
            // },
            series: [{
                name: property,
                data: [gaugeData[property]['value']],
                dataLabels: {
                    formatter: function () {
                        return '<div style="text-align:center;margin-top: -17%;">'
                            + '<span style="font-size:14px">'
                            + (isTwoMetrics ? ((this.y / this.series.yAxis.max) * 100).toFixed(2) : (((this.y - this.series.yAxis.min) / (this.series.yAxis.max - this.series.yAxis.min)) * 100).toFixed(2))
                            + '%</span>'
                            + '<br/>'
                            + '<div style="font-size:10px;padding-top: 3%;font-weight: normal">'
                            + (currencyFormatKey != "" && currencyFormatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && format == "" ? report.resources.FormatType[currencyFormatKey] : '')
                            + utilities.formatChartTooltip(this.y, format)
                            + (currencyFormatKey != "" && currencyFormatKey != null && format == "" && (currencyFormatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[currencyFormatKey] : '')
                            + '</div>'
                            + '</div>';
                    }
                }
            }]
        };
        gaugeCount++;
    }
    ;
    return gaugeChartExportList[0];
};