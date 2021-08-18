var DATA_RCVD = {};
var rowObjects = [];
var currentJson = [];
var columnObjects = [];
var metricObjects = [];
var rowelIndex = null;
var scope = {};
export const rcvChartJson = (rcvdPacket)=>{
    DATA_RCVD = rcvdPacket;
    rowObjects = getRowObjects();
    columnObjects = getColumnObjects();
    currentJson = getCurrentJson();
    metricObjects = getMetrcObjects();
    rowelIndex = 0;
    scope = setScope();
    // chartType = rcvdPacket["chartType"];
    return getChartJson();
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
        columnList : []
    
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

var getPieChartPlotOptions = function () {
    var options = {};
    var centerDonut = ['50%', '75%'];
    var centerPie = ['50%', '50%'];
    if (scope.activeChart.name == 'Donut Chart') {
        options = {
            'startAngle': -90,
            'endAngle': 90,
            'center': centerDonut,
        };
    }
    else if (scope.activeChart.name == "pie") {
        options = {
            'startAngle': 0,
            'endAngle': 360,
            'center': centerPie,
            point: {
                // events: {
                //     legendItemClick: function () {
                //         var chart = this.series.chart;
                //         var series = chart.series;
                //         var actualPoint = this.x;
                //         series.forEach(function (series) {
                //             series.data.forEach(function (point) {
                //                 if (point.x === actualPoint) {
                //                     if (point.visible) {
                //                         point.setVisible(false);
                //                     }
                //                     else {
                //                         point.setVisible(true);
                //                     }
                //                 }
                //             });
                //         });
                //         return false;
                //     }
                // }
            },
        };
    }
    return options;
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

var getDistanceForPieChart = function (valulist) {
    var distance = [];
    switch (valulist.length) {
        case 1:
            {
                return distance = ['30%'];
            }
        case 2:
            {
                return distance = ['50%', '30%'];
            }
        case 3:
            {
                return distance = ['70%', '50%', '30%'];
            }
        case 4:
            {
                return distance = ['90%', '70%', '50%', '30%'];
            }
    }
};

var createSeriesData = function (seriesObject, i) {
    {
        var lstdata = [];
        var data = [];
        // var reportObject = { configurationValue: "" };
        if (scope.columnList.length && scope.rowList.length) {
            reportObject = _.find(scope.reportObjDetails.lstReportObject, { displayName: scope.valueList[0].reportObjectName });
            for (var j = 0; j < currentJson.length - 1; j++) {
                if (currentJson[j][scope.columnList[0].reportObjectName] == seriesObject[i]) {
                    for (var x = 0; x < currentJson[currentJson.length - 1].rowObjects.length; x++) {
                        if (lstdata.length < currentJson[currentJson.length - 1].rowObjects.length)
                            lstdata.push(null);
                        if (currentJson[currentJson.length - 1].rowObjects[x] == currentJson[j][scope.rowList[rowelIndex].reportObjectName]) {
                            lstdata[x] = (currentJson[j][scope.valueList[0].reportObjectName]);
                        }
                    }
                }
            }
            // console.log("here")
            data = lstdata;
        }
        else if ((columnObjects.length > 0 && rowObjects.length == 0
            && (scope.activeChart.name == "Stacked Column Chart" || scope.activeChart.name == "line"))) {
            data.push(currentJson[i][metricObjects[0]]);
            reportObject = _.find(scope.reportObjDetails.lstReportObject, { displayName: metricObjects[0] });
        }
        else if (scope.activeChart.name == "Multiple Axis Chart") {
            for (var j = 0; j < currentJson.length - 1; j++) {
                data.push(currentJson[j][metricObjects[i]]);
            }
            reportObject = _.find(scope.reportObjDetails.lstReportObject, { displayName: metricObjects[i] });
        }
        else {

            // report object as of now is not neede 

            // reportObject = _.find(scope.reportObjDetails.lstReportObject, { displayName: seriesObject[i] });
           
           
            
            for (var j_1 = 0; j_1 < currentJson.length - 1; j_1++) {
                var obj = {};
                if (scope.columnList.length) {
                    obj["name"] = currentJson[currentJson.length - 1].columnObject[j_1];

                    // no need to specify color as of noww 

                    // if (scope.activeChart.name == report.resources.ChartType.PieChart ||
                    //     scope.activeChart.name == report.resources.ChartType.DonutChart)
                    //     obj["color"] = getSeriesColor(obj["name"], j_1);
                }
                else {
                    obj["name"] = currentJson[currentJson.length - 1].rowObjects[j_1];
                    // if (scope.activeChart.name == report.resources.ChartType.PieChart ||
                    //     scope.activeChart.name == report.resources.ChartType.DonutChart)
                    //     obj["color"] = getSeriesColor(obj["name"], j_1);
                }
                obj["y"] = currentJson[j_1][metricObjects[i]];
                data.push(obj);
            }
        }
        // report.resources.ChartType.PieChart = "pie"
        if (scope.activeChart.name == "pie") {
            var totalSum_1 = 0;
            data.map(function (obj) { totalSum_1 = totalSum_1 + obj.y; });
            data.map(function (obj) { obj.name = obj.name + ': ' + ((obj.y / totalSum_1) * 100).toFixed(2) + '%'; });
            // _.each(data, function (obj) { totalSum_1 = totalSum_1 + obj.y; });
            // _.each(data, function (obj) { obj.name = obj.name + ': ' + ((obj.y / totalSum_1) * 100).toFixed(2) + '%'; });
        }
        // var configVal = getWijmoConfigurationFormatCallback(reportObject.configurationValue, reportObject.filterType);
        var configVal = ""
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
    }
};



var getChartJson = function () {
    scope.showDataLabels = false; // false 
    
    // scope.chartstates.length = 1
    if (scope.chartstates.length != 0)
        rowelIndex = scope.chartstates.length - 1; // rowelIndex
    
    rowelIndex = 0    
    var x = {
        height : 200,
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
                // max: masterJson[rowelIndex].maxYAxis.length ? masterJson[rowelIndex].maxYAxis[0] : null, // null
                // min: masterJson[rowelIndex].minYAxis.length ? masterJson[rowelIndex].minYAxis[0]  : null,  // null
                max: 3000000,
                min: 0,
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
        scrollbar: { enabled: false, showFull: false },
        title: {
            align: 'left',
            text: ''
        },
        chart: {
            type: 'pie',
            zoomType: 'x',
            allowPointSelect: true,
            allowOverlap: true,
        },

        initChart: false,
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
            },

            // yeh check karlena ki zaroorat hai ya nahi

            // labelFormatter: scope.activeChart.name == "pie" ? function () {
            //     return this.name.slice(0, this.name.lastIndexOf(":"));
            // } : function () { return this.name; }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                states: {
                    inactive: {
                        opacity: 1
                    }
                },
                dataLabels: {
                    enabled: scope.showDataLabels,
                    // enabled : false,
                    style: {
                        fontWeight: 'normal',
                        textShadow: 'none',
                        // fontSize: scope.selectedFontSize + "px"
                        fontSize: '12px'
                    },
                }
            },
            pie: getPieChartPlotOptions()
        },
        exporting: {
            allowHTML: true,
            enabled: true,
            chartOptions: {
                chart: {
                    height: 1000,
                    width: 1000
                },
                legend: {
                    navigation: {
                        enabled: false
                    },
                    alignColumns: true
                },
                title: {
                    text: createGraphTitle(rowelIndex),
                }
            }
        },
        // lang: {
        //     decimalPoint: utilities.globalizeDecimalOptionsForChart(),
        //     thousandsSep: utilities.globalizeThousandsSepOptionsForChart()
        // },
        subtitle: {
            text: (function () {
                var data = "";
                if (scope.activeChart.name == "pie" || scope.activeChart.name == "Donut") {
                    data = "";
                }
                
                //var data = 'Currently Viewing : ';
                //angular.forEach(scope.chartstates, function (value, key) { data += value.itemName + ' > '; });
                return data;
            }()),
            align: 'left'
        },
        init: false,
        series: (function () {
            if (scope.activeChart.name == 'pie') {
                var innerSizeForPie = ['80%', '75%', '70%', '65%'];
                var sizeForPie = ['100%', '80%', '60%', '40%'];
            }
            var temp = [];
            var seriesObject;
            if ((columnObjects.length > 0 && rowObjects.length == 0
                && (scope.activeChart.name == "Stacked Column Chart" || scope.activeChart.name == "line"))) {
                seriesObject = columnObjects;
            }
            else if (rowObjects.length != 0)
                seriesObject = columnObjects.length ? columnObjects : metricObjects;
            else if (rowObjects.length == 0)
                seriesObject = metricObjects;
            // console.log(seriesObject)
            var currentObj;
            var _loop_2 = function () {
                // if ((columnObjects.length > 0 && rowObjects.length == 0
                //     && (scope.activeChart.name == "Stacked Column Chart" || scope.activeChart.name == "line"))
                //     || scope.valueList.length == 1)
                //     currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects; });
                // else
                //     currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == seriesObject[i]; });
                temp[i] = {};
                // var currenyBeforeAmount = utilities.getCurrencySymbolLocation();  true hoga
                // var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                // temp[i].tooltip = {
                //     headerFormat: '<span style="font-size:10px">' + (scope.columnList.length > 0 ? scope.columnList[0].reportObjectName + '<br/>' : "") + '<span style="font-size:10px">{point.key}<br/></span></span>',
                //     footerFormat: '</table>',
                //     shared: true,
                //     useHTML: true,
                //     format: configFormat,
                //     formatKey: currentObj.formatKey,
                //     currenyBeforeAmount: currenyBeforeAmount,
                //     pointFormatter: function () {
                //         return '<table><tr><td style="padding:0">' + this.series.name + ':</td>' +
                //             (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey != report.resources.CommonConstants.Percent && this.series.userOptions.tooltip && this.series.userOptions.tooltip.format == "" ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "") +
                //             '<td style="padding:0"><b>' + utilities.formatChartTooltip(this.y, this.series.userOptions.tooltip.format) + '</b></td></tr>' +
                //             (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey && this.series.userOptions.tooltip.format == "" && (this.series.userOptions.tooltip.formatKey == report.resources.CommonConstants.Percent || !this.series.userOptions.tooltip.currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "");
                //     }
                // };
                temp[i].cursor = 'pointer';
                temp[i].type = scope.activeChart.name;
                if ((scope.activeChart.name == 'line') || (scope.activeChart.name == 'column')) {
                    temp[i].dataLabels = {
                        enabled: scope.showDataLabels,
                        allowOverlap: true,
                        crop: false,
                        overflow: 'none',
                        useHTML: true,
                        color: '#000000',
                        states: {
                            inactive: {
                                opacity: 1
                            }
                        },
                        // formatter: function () {
                        //     if ((scope.showDataLabels) && !scope.renderOnPopup) {
                        //         return (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey != report.resources.CommonConstants.Percent && this.series.userOptions.tooltip && this.series.userOptions.tooltip.format == "" ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "") +
                        //             utilities.formatChartTooltip(this.y, configFormat) +
                        //             (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey && this.series.userOptions.tooltip.format == "" && (this.series.userOptions.tooltip.formatKey == report.resources.CommonConstants.Percent || !this.series.userOptions.tooltip.currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "");
                        //     }
                        // }
                    };
                }
                else {
                    temp[i].dataLabels = {
                        enabled: true,
                        distance: scope.activeChart.name == "pie" ? getDistanceForPieChart(scope.valueList)[i] : 30,
                        allowOverlap: true,
                        crop: false,
                        overflow: 'none',
                        useHTML: true,
                        // formatter: function () {
                        //     return scope.showDataLabels ? (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey != report.resources.CommonConstants.Percent && this.series.userOptions.tooltip && this.series.userOptions.tooltip.format == "" ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "") +
                        //         utilities.formatChartTooltip(this.y, configFormat) + (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey && this.series.userOptions.tooltip.format == "" && (this.series.userOptions.tooltip.formatKey == report.resources.CommonConstants.Percent || !this.series.userOptions.tooltip.currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "")
                        //         : (scope.activeChart.name == 'Donut Chart' ? this.percentage.toFixed(2) + "%" : this.key.substring(this.key.indexOf(":") + 1));
                        // }
                    };
                }
                if (scope.activeChart.name == "Donut Chart") {
                    temp[i].innerSize = '50%';
                }
                if (scope.activeChart.name == 'stColumn') {
                    temp[i].type = "column";
                    temp[i].stacking = 'normal';
                }
                if (scope.activeChart.name == "multi") {
                    if (i < metricObjects.length) {
                        temp[i].yAxis = i;
                    }
                    temp[i].type = "column";
                    if (i > 0) {
                        temp[i].type = "spline";
                        temp[i].dashStyle = i > 1 ? 'shortdot' : "";
                    }
                }
                temp[i].name = seriesObject[i];
                // if (scope.activeChart.name != "pie" && scope.activeChart.name != 'Donut Chart')
                //     temp[i].color = getSeriesColor(seriesObject[i], i);
                // console.log(seriesObject)
                temp[i].data = createSeriesData(seriesObject, i);
                // console.log(temp[i].data)
                if (scope.activeChart.name == "pie" || scope.activeChart.name == 'Donut Chart') {
                    temp[0].showInLegend = true;
                    if ((scope.rowList.length >= 1 && (scope.valueList.length > 1))) {
                        temp[i].innerSize = innerSizeForPie[i];
                        temp[i].size = sizeForPie[i];
                    }
                }
                // if (!scope.renderOnPopup) {
                //     temp[i].events = {
                //         click: function (e) {
                //             var category = "";
                //             if (scope.activeChart.name == "pie" || scope.activeChart.name == "Donut Chart") {
                //                 category = e.point.name.split(':')[0];
                //             }
                //             else {
                //                 category = e.point.category;
                //             }
                //             jumpToState(category);
                //             setTimeout(function () {
                //                 scope.$digest();
                //             });
                //         }
                //     };
                // }
            };
            for (var i = 0; i < seriesObject.length; i++) {
                _loop_2();
            }
            // console.log(temp[0].data);
            return temp;
        }())
    }; 

    // console.log(x);
    return x;
}


