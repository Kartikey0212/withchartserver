var DATA_RCVD = {};
var rowObjects = [];
var currentJson = [];
var columnObjects = [];
var metricObjects = [];
var rowelIndex = null;
var scope = {};
var chartType = null;
export const rcvSettingsBubble = (rcvdPacket)=>{
    DATA_RCVD = rcvdPacket;
    rowObjects = getRowObjects();
    columnObjects = getColumnObjects();
    currentJson = getCurrentJson();
    metricObjects = getMetrcObjects();
    rowelIndex = 0;
    scope = setScope();
    chartType = rcvdPacket["chartType"];
    return createBubbleChart();
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

var getBubbleChartSeriesData = function (mode) {
    var series = [];
    // var format = getWijmoConfigurationFormatCallback(scope.valueList[0].configurationValue, scope.valueList[0].filterType);
    // var currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects[0]; });
    // var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
    // var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
    var configFormatArray = {};
    scope.valueList.forEach(function (valueRO, valueRoIndex) {
        configFormatArray[valueRO.reportObjectName] = { formatKey: valueRO.formatKey, configurationValue: getWijmoConfigurationFormatCallback(valueRO.configurationValue, valueRO.filterType) };
    });
    switch (mode) {
        case 'SingleSeries':
            {
                series[0] = {};
                var temp_1 = [];
                for (var i = 0; i < rowObjects.length; i++) {
                    var temp2 = {};
                    temp2['x'] = (configFormatArray[metricObjects[0]].formatKey == report.resources.CommonConstants.Percent || (configFormatArray[metricObjects[0]].configurationValue != undefined && configFormatArray[metricObjects[0]].configurationValue[0] == 'p')) ? currentJson[i][metricObjects[0]] * 100 : validateNumber(currentJson[i][metricObjects[0]] == null ? 0 : currentJson[i][metricObjects[0]]);
                    temp2['y'] = (configFormatArray[metricObjects[1]].formatKey == report.resources.CommonConstants.Percent || (configFormatArray[metricObjects[1]].configurationValue != undefined && configFormatArray[metricObjects[1]].configurationValue[0] == 'p')) ? currentJson[i][metricObjects[1]] * 100 : validateNumber(currentJson[i][metricObjects[1]] == null ? 0 : currentJson[i][metricObjects[1]]);
                    temp2['z'] = (configFormatArray[metricObjects[2]].formatKey == report.resources.CommonConstants.Percent || (configFormatArray[metricObjects[2]].configurationValue != undefined && configFormatArray[metricObjects[2]].configurationValue[0] == 'p')) ? currentJson[i][metricObjects[2]] * 100 : validateNumber(currentJson[i][metricObjects[2]] == null ? 0 : currentJson[i][metricObjects[2]]);
                    temp2['header'] = rowObjects[i];
                    temp_1.push(temp2);
                }
                series[0].data = temp_1;
                series[0].marker = {
                    fillColor: {
                        radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                        stops: [
                            [0, '#7fb2d7']
                        ]
                    }
                };
                series[0].dataLabels =
                {
                    formatter: function () {
                        return (scope.valueList[1].formatKey != "" && scope.valueList[1].formatKey != null && scope.valueList[1].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && format == "" ? report.resources.FormatType[scope.valueList[1].formatKey] : '') +
                            utilities.formatChartTooltip(this.y, configFormat) +
                            (scope.valueList[1].formatKey != "" && scope.valueList[1].formatKey != null && format == "" && (scope.valueList[1].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[1].formatKey] : '');
                    }
                },
                    series[0].name = metricObjects[0];
            }
            ;
            break;
        case 'SingleBubble':
            {
                series[0] = {};
                var temp_2 = [];
                var temp2_1 = [];
                var seriesValue = 0;
                for (var i_2 = 0; i_2 < metricObjects.length; i_2++) {
                    seriesValue = validateNumber(currentJson[0][metricObjects[i_2]] == null ? 0 : currentJson[0][metricObjects[i_2]]);
                    if (configFormatArray[metricObjects[i_2]].formatKey == report.resources.CommonConstants.Percent || (configFormatArray[metricObjects[i_2]].configurationValue != undefined && configFormatArray[metricObjects[i_2]].configurationValue[0] == 'p'))
                        seriesValue = currentJson[i_2][metricObjects[i_2]] * 100;
                    temp2_1.push(seriesValue);
                }
                temp_2.push(temp2_1);
                series[0].data = temp_2;
                series[0].marker = {
                    fillColor: {
                        radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                        stops: [
                            [0, '#7fb2d7']
                        ]
                    }
                };
                series[0].dataLabels =
                {
                    formatter: function () {
                        return (scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != null && scope.valueList[0].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && format == "" ? report.resources.FormatType[scope.valueList[0].formatKey] : '') +
                            utilities.formatChartTooltip(this.y, configFormat) +
                            (scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != null && format == "" && (scope.valueList[0].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[0].formatKey] : '');
                    }
                },
                    series[0].name = metricObjects[metricObjects.length - 1];
            }
            ;
            break;
        case 'GroupedBubbles':
            {
                series[0] = {};
                var temp = [];
                for (var i = 0; i < rowObjects.length; i++) {
                    var b = [];
                    var seriesValue = 0;
                    b.push(rowObjects.indexOf(rowObjects[i]));
                    for (var j = 0; j < metricObjects.length; j++) {
                        seriesValue = validateNumber(currentJson[i][metricObjects[j]] == null ? 0 : currentJson[i][metricObjects[j]]);
                        if (configFormatArray[metricObjects[j]].formatKey == report.resources.CommonConstants.Percent || (configFormatArray[metricObjects[j]].configurationValue != undefined && configFormatArray[metricObjects[j]].configurationValue[0] == 'p'))
                            seriesValue = currentJson[i][metricObjects[j]] * 100;
                        b.push(seriesValue);
                    }
                    temp.push(b);
                }
                series[0].data = temp;
                series[0].marker = {
                    fillColor: {
                        radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                        stops: [
                            [0, '#7fb2d7']
                        ]
                    }
                };
                series[0].dataLabels =
                {
                    formatter: function () {
                        return (scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != null && scope.valueList[0].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && format == "" ? report.resources.FormatType[scope.valueList[0].formatKey] : '') +
                            utilities.formatChartTooltip(this.y, configFormat) +
                            (scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != null && format == "" && (scope.valueList[0].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[0].formatKey] : '');
                    }
                },
                    series[0].name = scope.rowList[0].displayName;
            }
            break;
        case 'MultiSeries':
            {
                for (var i = 0; i < currentJson.length - 1; i++) {
                    var temp_3 = [];
                    series[i] = {};
                    series[i].data = [];
                    series[i].dataLabels =
                    {
                        formatter: function () {
                            return (scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != null && scope.valueList[0].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && format == "" ? report.resources.FormatType[scope.valueList[0].formatKey] : '') +
                                utilities.formatChartTooltip(this.y, configFormat) +
                                (scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != null && format == "" && (scope.valueList[0].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[0].formatKey] : '');
                        }
                    },
                        temp_3.push((configFormatArray[metricObjects[0]].formatKey == report.resources.CommonConstants.Percent || (configFormatArray[metricObjects[0]].configurationValue != undefined && configFormatArray[metricObjects[0]].configurationValue[0] == 'p')) ? currentJson[i][metricObjects[0]] * 100 : validateNumber(currentJson[i][metricObjects[0]] == null ? 0 : currentJson[i][metricObjects[0]]));
                    temp_3.push((configFormatArray[metricObjects[1]].formatKey == report.resources.CommonConstants.Percent || (configFormatArray[metricObjects[1]].configurationValue != undefined && configFormatArray[metricObjects[0]].configurationValue[0] == 'p')) ? currentJson[i][metricObjects[1]] * 100 : validateNumber(currentJson[i][metricObjects[1]] == null ? 0 : currentJson[i][metricObjects[1]]));
                    temp_3.push((configFormatArray[metricObjects[2]].formatKey == report.resources.CommonConstants.Percent || (configFormatArray[metricObjects[2]].configurationValue != undefined && configFormatArray[metricObjects[0]].configurationValue[0] == 'p')) ? currentJson[i][metricObjects[2]] * 100 : validateNumber(currentJson[i][metricObjects[2]] == null ? 0 : currentJson[i][metricObjects[2]]));
                    series[i].data.push(temp_3);
                    series[i]['name'] = currentJson[i][scope.columnList[0].displayName] == undefined ? 'NULL' : currentJson[i][scope.columnList[0].displayName];
                    series[i]['color'] = getSeriesColor(series[i]['name'], i);
                }
            }
            break;
    }
    return series;
};



var createBubbleChart = function () {
    var clickCount = 0;
    var bubbleChartConfig;
    // scope.showGridlines = scope.$parent.vm.showGridLines || (scope.$parent.vm.reportDetailsObj.reportProperties && scope.$parent.vm.reportDetailsObj.reportProperties.gridLineWidth) || 0;
    // scope.$parent.vm.showGridLines = scope.showGridlines;
    // scope.showDataLabels = scope.$parent.vm.showDataLabels;
    var mode = '';
    if (scope.rowList.length == 0 && scope.valueList.length == 3 && scope.columnList.length == 0)
        mode = 'SingleBubble';
    else if (scope.rowList.length == 1 && scope.valueList.length == 2 && scope.columnList.length == 0)
        mode = 'GroupedBubbles';
    else if (scope.rowList.length == 0 && scope.valueList.length == 3 && scope.columnList.length == 1)
        mode = 'MultiSeries';
    else if (scope.rowList.length >= 0 && scope.valueList.length == 3 && scope.columnList.length == 0)
        mode = 'SingleSeries';
    bubbleChartConfig = {
        credits: false,
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
        chart: {
            type: 'bubble',
            zoomType: 'xy'
        },
        title: {
            text: ''
        },
        xAxis: {
            gridLineWidth: (scope.showGridlines) ? 1 : 0,
            title: {
                text: (mode === 'GroupedBubbles') ? '' : metricObjects[0]
            },
            categories: (mode === 'GroupedBubbles') ? rowObjects : undefined,
            tickWidth: 1,
            tickmarkPlacement: 'on'
        },
        yAxis: {
            gridLineWidth: (scope.showGridlines) ? 1 : 0,
            title: {
                text: (mode === 'GroupedBubbles') ? metricObjects[0] : metricObjects[1],
            },
            startOnTick: false,
            endOnTick: false
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: !scope.renderOnPopup ? scope.showDataLabels : false,
                    allowOverlap: true,
                    crop: false,
                    overflow: 'none',
                    cursor: 'pointer',
                    style: {
                        fontWeight: 'normal',
                        textShadow: 'none',
                        fontSize: scope.selectedFontSize + "px"
                    },
                    color: '#000000',
                    states: {
                        inactive: {
                            opacity: 1
                        }
                    }
                },
            },
            bubble: {
                // events: {
                //     click: function (e) {
                //         if (!scope.renderOnPopup) {
                //             clickCount += 1;
                //             if (clickCount == 1) {
                //                 var category = '';
                //                 if (scope.rowList.length == 1 && scope.valueList.length == 2 && scope.columnList.length == 0)
                //                     category = e.point.category;
                //                 else if (scope.rowList.length == 0 && scope.valueList.length == 3 && scope.columnList.length >= 0)
                //                     category = e.point.series.name;
                //                 else if (scope.rowList.length >= 0 && scope.valueList.length == 3 && scope.columnList.length == 0)
                //                     category = e.point.options.header;
                //                 jumpToState(category);
                //                 setTimeout(function () {
                //                     scope.$digest();
                //                 });
                //             }
                //         }
                //     }
                // }
            }
        },
        // use tootltip functions to generate labels 

        // tooltip: getBubbleChartTooltip(),
        series: getBubbleChartSeriesData(mode),
        colors: [
            "#2196f3",
            "#f44336",
            "#ff9800",
            "#4caf50",
            "#9c27b0",
            "#3f51b5",
            "#00bcd4",
            "#e91e63",
            "#8bc34a",
            "#c62828",
            "#ef6c00",
            "#795548",
            "#9e9e9e",
            "#607d8b",
            "#1565c0",
            "#ad1457",
            "#4527a0",
            "#00838f",
            "#4e342e",
            "#37474f"
        ],
        legend: (mode == 'SingleBubble' || mode == 'GroupedBubbles' || mode == 'SingleSeries') ? { enabled: false } :
            {
                //align: 'center',
                //maxHeight: 40,
                //verticalAlign: 'bottom',
                //x: 0,
                //y: 23,
                //itemWidth: 120,
                //layout: 'horizontal',
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
            }
    };
    // if (!scope.renderOnPopup) {
    //     $('#bubble-chart-container').highcharts(bubbleChartConfig);
    //     scope.highchartsNgTitle = createGraphTitle(rowelIndex);
    // }
    // else {
    //     $("#chart-container-popup").highcharts(bubbleChartConfig);
    // }
};
