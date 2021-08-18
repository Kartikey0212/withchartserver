var DATA_RCVD = {};
var rowObjects = [];
var currentJson = [];
var columnObjects = [];
var metricObjects = [];
var rowelIndex = null;
var scope = {};
var chartType = null;
export const rcvSettingsHeatmap = (rcvdPacket)=>{
    DATA_RCVD = rcvdPacket;
    rowObjects = getRowObjects();
    columnObjects = getColumnObjects();
    currentJson = getCurrentJson();
    metricObjects = getMetrcObjects();
    rowelIndex = 0;
    scope = setScope();
    chartType = rcvdPacket["chartType"];
    return getHeatMapChart();
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
        columnList : (function getRowList(){
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

var createYAxis = function () {
    var data = [];
    if ((columnObjects.length >= 1 && rowObjects.length >= 1
        && (scope.activeChart.name == "Heat Map"))) {
        for (var i = 0; i < columnObjects.length; i++) {
            data.push(columnObjects[i]);
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

var createHeatMapSeriesData = function (attributeName, columnList) {
    if (columnList.length == 1) {
        var columnName = scope.columnList[0].reportObjectName;
        // console.log(columnName)
    }
    // var reportObject = _.find(scope.reportObjDetails.lstReportObject, { displayName: metricObjects[0] });
    // var configVal = getWijmoConfigurationFormatCallback(reportObject.configurationValue, reportObject.filterType);
    var heatMapSeriesData = [];
    for (var j = 0; j < currentJson.length - 1; j++) {
        var indexOfAttribute = rowObjects.indexOf(currentJson[j][attributeName]);
        var indexOfColumnAttribute = columnObjects.indexOf(currentJson[j][columnName]);
        var value = currentJson[j][metricObjects[0]];
        if (value != undefined) {
            // if (configVal != undefined && configVal[0] == 'p' || reportObject.formatKey == report.resources.CommonConstants.Percent) {
            //     value = value * 100;
            // }
            var item = [indexOfAttribute, indexOfColumnAttribute, value];
            heatMapSeriesData.push(item);
        }
    }
    return heatMapSeriesData;
};

var getHeatMapChart = function () {
    var seriesObject;
    if (columnObjects.length > 0 && rowObjects.length == 0) {
        seriesObject = columnObjects;
    }
    else if (rowObjects.length != 0)
        seriesObject = columnObjects.length ? columnObjects : metricObjects;
    else if (rowObjects.length == 0)
        seriesObject = metricObjects;
    var currentObj;
    // currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects; });
    var _heatmapconfig = {
        chart: {
            type: 'heatmap',
            plotBorderWidth: 1,
        },
        plotOptions: {
            series: {
                turboThreshold: 0,
                dataLabels: {
                    overflow: 'none',
                    crop: true,
                    useHTML: true,
                    enabled: true,
                    style: {
                        fontWeight: 'normal'
                    },
                    color: '#000000',
                    states: {
                        inactive: {
                            opacity: 1
                        }
                    }
                }
            }
        },
        title: {
            text: ''
        },
        legend: {
            align: 'right',
            useHTML: true,
            layout: 'vertical',
            itemStyle: {
                textOverflow: 'clip'
            },
            verticalAlign: 'top',
            margin: -50,
            padding: 50,
            y: -30,
            symbolHeight: 150
        },
        xAxis: {
            startOnTick: false,
            endOnTick: false,
            categories: createXAxis(),
            title: null
        },
        yAxis: {
            startOnTick: false,
            endOnTick: false,
            categories: createYAxis(),
            title: null,
            min: 0,
            max: columnObjects.length > 5 ? 5 : columnObjects.length - 1,
            scrollbar: {
                enabled: columnObjects.length > 6 ? true : false
            }
        },
        colorAxis: {
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
            },
            stops: (false) ? [
                [0, '#8B0707'],
                [0.1, '#ac5200'],
                [0.2, '#b96f00'],
                [0.3, '#e67300'],
                [0.4, '#d58100'],
                [0.5, '#ce9e00'],
                [0.6, '#af9700'],
                [0.7, '#9b9f00'],
                [0.8, '#659c00'],
                [0.9, '#109618']
            ] : [
                [0, '#109618'],
                [0.1, '#659c00'],
                [0.2, '#9b9f00'],
                [0.3, '#af9700'],
                [0.4, '#ce9e00'],
                [0.5, '#d58100'],
                [0.6, '#e67300'],
                [0.7, '#b96f00'],
                [0.8, '#ac5200'],
                [0.9, '#8B0707']
            ],
        },
        // tooltip: {
        //     headerFormat: (scope.rowList.length > 0 ? scope.rowList[rowelIndex].displayName : "") + ':',
        //     format: getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType),
        //     formatKey: scope.valueList[0].formatKey,
        //     currenyBeforeAmount: utilities.getCurrencySymbolLocation(),
        //     displayName: scope.valueList[0].displayName,
        //     colordisplayName: scope.columnList[0].displayName,
        //     colorFormatKey: scope.columnList[0].formatKey,
        //     useHTML: true,
        //     outside: true,
        //     backgroundColor: "rgba(246, 246, 246, 1)",
        //     style: { opacity: 1, background: "rgba(246, 246, 246, 1)" },
        //     colorFormat: getWijmoConfigurationFormatCallback(scope.valueList[0].configurationValue, scope.valueList[0].filterType),
        //     pointFormatter: function () {
        //         return (this.series.xAxis.categories[this.options.x] + '<br/>'
        //             + this.series.tooltipOptions.displayName + ':' + '<b>'
        //             + (this.series.tooltipOptions.formatKey != "" && this.series.tooltipOptions.formatKey != null && this.series.tooltipOptions.formatKey != report.resources.CommonConstants.Percent && this.series.tooltipOptions.currenyBeforeAmount && this.series.tooltipOptions.format == "" ? report.resources.FormatType[this.series.tooltipOptions.formatKey] : '')
        //             + utilities.formatChartTooltip(this.value, this.series.tooltipOptions.format)
        //             + (this.series.tooltipOptions.formatKey != "" && this.series.tooltipOptions.formatKey != null && this.series.tooltipOptions.format == "" && (this.series.tooltipOptions.formatKey == report.resources.CommonConstants.Percent || !this.series.tooltipOptions.currenyBeforeAmount) ? report.resources.FormatType[this.series.tooltipOptions.formatKey] : '')
        //             + '</b><br>' + this.series.tooltipOptions.colordisplayName + ':' + this.series.yAxis.categories[this.options.y]
        //             + '</b>');
        //     }
        // },
        exporting: {
            enabled: false,
            sourceWidth: 1200,
            sourceHeight: 1000,
            plotOptions: {
                series: {
                    turboThreshold: 0,
                }
            },
            chartOptions: {
                xAxis: [{
                    categories: createXAxis(),
                    min: 0,
                    max: rowObjects.length - 1,
                    startOnTick: false,
                    endOnTick: false
                }],
                yAxis: [{
                    categories: createYAxis(),
                    min: 0,
                    max: columnObjects.length - 1,
                    startOnTick: false,
                    endOnTick: false
                }],
                title: {
                    text: createGraphTitle(rowelIndex)
                },
                legend: {
                    alignColumns: true,
                    align: 'right',
                    useHTML: true,
                    layout: 'vertical',
                    itemStyle: {
                        textOverflow: 'clip'
                    },
                    verticalAlign: 'top',
                    margin: -30,
                    padding: 50,
                    y: -10,
                    symbolHeight: 800
                },
            }
        },
        // lang: {
        //     decimalPoint: utilities.globalizeDecimalOptionsForChart(),
        //     thousandsSep: utilities.globalizeThousandsSepOptionsForChart()
        // },
        credits: {
            enabled: false
        },
        series: [{
            borderWidth: 1,
            // events: {
            //     click: function (e) {
            //         this.update({ color: '#fe5800' }, true, false);
            //         var category = "";
            //         category = e.point.series.xAxis.categories[e.point.x];
            //         jumpToState(category);
            //         setTimeout(function () {
            //             scope.$digest();
            //         });
            //     }
            // },
            cursor: 'pointer',
            data: createHeatMapSeriesData(scope.rowList[rowelIndex].displayName, scope.columnList),
            dataLabels: {
                useHTML: true,
                color: '#000000',
                style: {
                    textOutline: 0,
                    fontSize: '10px'
                },
                states: {
                    inactive: {
                        opacity: 1
                    }
                },
                // formatter: function () {
                //     if (this.point.options.value != null) {
                //         for (var i = 0; i < metricObjects.length; i++) {
                //             var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                //             var currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects[0]; });
                //             var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                //         }
                //         return (this.series.tooltipOptions.formatKey != "" && this.series.tooltipOptions.formatKey != null && this.series.tooltipOptions.formatKey != report.resources.CommonConstants.Percent && this.series.tooltipOptions.currenyBeforeAmount && this.series.tooltipOptions.format == "" ? '<td><b>' + report.resources.FormatType[this.series.tooltipOptions.formatKey] + '</b></td>' : "") +
                //             utilities.formatChartTooltip(this.point.value, configFormat) +
                //             (this.series.tooltipOptions.formatKey != "" && this.series.tooltipOptions.formatKey != null && this.series.tooltipOptions.formatKey && this.series.tooltipOptions.format == "" && (this.series.tooltipOptions.formatKey == report.resources.CommonConstants.Percent || !this.series.tooltipOptions.currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[this.series.tooltipOptions.formatKey] + '</b></td>' : "");
                //     }
                // }
            }
        }]
    };
    return _heatmapconfig;
};