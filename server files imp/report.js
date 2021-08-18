var report;
(function (report) {
    var directives;
    (function (directives) {
        var ReportChart = /** @class */ (function () {
            function ReportChart($http, $translate, utilities, $window, $timeout, SharedService) {
                this.scope = {
                    chartTypeTabs: '=?', highchartsNg: '=?', highchartsMapNg: '=?', chartstates: '=?', rowList: "=?", valueList: "=?", columnList: "=?", reportName: "=?", reportFilters: "=?",
                    datasourceid: "=?", updateLoader: "&", toggleupdatephase: "&",
                    updateChart: "=?", activeChart: "=?", loadgraphdata: "&", issavedreport: "=?", reportObjDetails: "=?", resetRowElIndex: "=?", getWijmoConfigurationFormat: "&", showGridGraphView: "=?", legendCallback: "&", height: "=?", isRangeRedToGreenColor: "=?", columnCount: "=?", showGridlines: "=?",
                    pageSizes: "=?", fontSizes: "=?", selectedFontSize: "=?", refreshChart: '&', refreshChartforFondSize: '&', selectedPageSize: "<", showDataLabels: "=?", enableDataLabels: '&', manageDataLabels: '&', isMangaeDataLabelsActive: '=?', loadDataLabelPopUp: '&', hideheader: "=?", originalReportColors: "=?", modifiedReportColors: "=?", isColorPalletEnabled: "=?"
                };
                this.templateUrl = 'analytics/report/views/chart.html';
                ReportChart.prototype.link = function (scope, element, attrs) {
                    var masterJson = new Array();
                    scope.currentPageInfo = {};
                    var currentJson;
                    var currentRow;
                    var metricObjects = [];
                    var rowelIndex = 0;
                    scope.highchartsNg.series = [];
                    scope.highchartsNg.initChart = false;
                    scope.highchartsMapNg.series = [];
                    scope.chartstates = [];
                    var reportObjects = [];
                    var columnObjects = [];
                    var rowObjects = [];
                    var sortReportObject = new report.models.Data.SortReportObject();
                    var reportObjDetails = new report.models.Data.ReportDetails();
                    var updatePhaseCallback = scope.$eval(scope.toggleupdatephase);
                    var applyCallback = scope.$eval(scope.updateLoader);
                    var loadgraphdataCallback = scope.$eval(scope.loadgraphdata);
                    var legendCallback = scope.$eval(scope.legendCallback);
                    var message = scope.showGridGraphView ? $translate.instant('GridGraphLoadingPleaseWait') : $translate.instant('GraphLoadingPleaseWait');
                    var reportFilterList = angular.copy(scope.reportFilters);
                    var chartType = "";
                    var currentcategory = "";
                    var availableViewPort = $(window).height() - 357;
                    //#region colorpalet                              
                    var colorset = ['#3f67c5', '#cb4728', '#f19d39', '#459331', '#984830', '#8C2094'];
                    scope.popupCustomizeDataColor = false;
                    //#endregion
                    var getWijmoConfigurationFormatCallback = scope.$eval(scope.getWijmoConfigurationFormat);
                    var gaugeChartExportList = [];
                    var gaugeCount = 0;
                    scope.jumpToConfig = new report.models.Data.JumpToConfig;
                    scope.jumpToConfig.newModel();
                    scope.fontSizes = [9, 10, 11, 12];
                    scope.selectedFontSize = scope.$parent.vm.selectedFontSize;
                    //element.find('.chartColumn').height(availableViewPort > 445 ? availableViewPort : 445);
                    scope.graphDataLoaded = false;
                    scope.resetRowElIndex = true;
                    scope.height = scope.height ? scope.height : 0;
                    scope.chartHeight;
                    scope.showDataLabels = false;
                    scope.loadIframePlugin = false;
                    //enableJumpToForUser();
                    var setHeight = function () {
                        if (scope.$parent.vm.showGridGraphView) {
                            scope.chartHeight = scope.height - element.find('.reportChartTitle').innerHeight() - element.find('.chart-breadcrumb').innerHeight();
                            element.find('.chartColumn').height(scope.chartHeight);
                            scope.chartHeight = scope.chartHeight ? { 'height': scope.chartHeight + 'px' } : { 'height': '200px' };
                        }
                        else {
                            element.find('.chartColumn').height(availableViewPort);
                            scope.chartHeight = availableViewPort ? { 'height': availableViewPort + 'px' } : { 'height': '300px' };
                        }
                    };
                    $timeout(function () {
                        setHeight();
                    }, 100);
                    angular.element($window).resize(function () {
                        setHeight();
                    });
                    scope.$watch('hideheader', function (newVal, oldVal) {
                        if (scope.$parent.vm.pageByConfiguration.pageByListArray.length) {
                            if (newVal == true) {
                                document.getElementsByClassName('generated-data')[0].classList.add("marginTop55");
                            }
                            else {
                                document.getElementsByClassName('generated-data')[0].classList.remove("marginTop55");
                            }
                        }
                    });
                    //Whether to show or hide the jumpTo checkbok
                    if (scope.$parent.vm.selectedCube.select.dataSourceProperties != undefined && scope.$parent.vm.selectedCube.select.dataSourceProperties.hasOwnProperty('enableJumpToFeature')) {
                        if (scope.$parent.vm.selectedCube.select.dataSourceProperties.enableJumpToFeature.toLowerCase() == 'true') {
                            scope.jumpToConfig.enableJumpToFunction = true;
                        }
                        else
                            scope.jumpToConfig.enableJumpToFunction = false;
                    }
                    else {
                        scope.jumpToConfig.enableJumpToFunction = false;
                    }
                    //toggle header will change the height hence recalculating it//
                    scope.$watch('height', function () {
                        setHeight();
                    });
                    switch (scope.activeChart.name) {
                        case 'Column Chart': {
                            chartType = "column";
                            break;
                        }
                        case 'Line Chart': {
                            chartType = "spline";
                            break;
                        }
                        case 'Stacked Column Chart': {
                            chartType = "stColumn";
                            break;
                        }
                        case 'Pie Chart': {
                            chartType = "pie";
                            break;
                        }
                        case 'Tree Chart': {
                            chartType = "tree";
                            break;
                        }
                        case 'Multiple Axis Chart': {
                            chartType = "multi";
                            break;
                        }
                        case 'Pareto Chart': {
                            chartType = "pareto";
                            break;
                        }
                        case 'Bar Chart': {
                            chartType = "bar";
                            break;
                        }
                        case '100% Stacked Column Chart': {
                            chartType = "percentStColumn";
                            break;
                        }
                        case 'Stacked Bar Chart': {
                            chartType = "stBar";
                            break;
                        }
                        case '100% Stacked Bar Chart': {
                            chartType = "percentStBar";
                            break;
                        }
                        case 'Clustered Stacked Column Chart': {
                            chartType = "clusteredStackedColumnChart";
                            break;
                        }
                        case 'Bar Chart': {
                            chartType = "bar";
                            break;
                        }
                        case 'Donut Chart': {
                            chartType = "pie";
                            break;
                        }
                        case 'Column & Line Combination Chart': {
                            chartType = "columnLineCombinationChart";
                            break;
                        }
                        case 'Bar & Line Combination Chart': {
                            chartType = "barLineCombinationChart";
                            break;
                        }
                        case 'Bubble Chart': {
                            chartType = 'bubble';
                            break;
                        }
                        case 'Map Chart': {
                            chartType = 'map';
                            break;
                        }
                        case 'Waterfall Chart': {
                            chartType = 'waterFallChart';
                            break;
                        }
                        case 'Gauge Chart': {
                            chartType = 'solidgauge';
                            break;
                        }
                        case 'Histogram Chart': {
                            chartType = 'histogram';
                            break;
                        }
                        case 'Heat Map': {
                            chartType = 'heatmap';
                            break;
                        }
                    }
                    var updateSeries = function () {
                        columnObjects = currentJson[currentJson.length - 1].columnObject;
                        if (scope.rowList && scope.rowList.length > 0) {
                            switch (scope.rowList[0].filterType) {
                                case report.resources.FilterType.SingleSelect:
                                case report.resources.FilterType.MultiSelect:
                                case report.resources.FilterType.Measure:
                                case report.resources.FilterType.Number:
                                case report.resources.FilterType.Tree:
                                    columnObjects.sort();
                                    break;
                                default:
                                    break;
                            }
                        }
                        rowObjects = currentJson[currentJson.length - 1].rowObjects;
                        var seriesObject, tempSeries = scope.highchartsNg.series;
                        if ((columnObjects.length > 0 && rowObjects.length == 0
                            && (scope.activeChart.name == "Stacked Column Chart" || scope.activeChart.name == "Line Chart"))) {
                            seriesObject = columnObjects;
                        }
                        else if (rowObjects.length != 0)
                            seriesObject = columnObjects.length ? columnObjects : metricObjects;
                        else if (rowObjects.length == 0)
                            seriesObject = metricObjects;
                        for (var i = 0; i < seriesObject.length; i++) {
                            tempSeries[i].name = seriesObject[i];
                            tempSeries[i].data = createSeriesData(seriesObject, i);
                        }
                        scope.highchartsNg.series = tempSeries;
                    };
                    var updateXAxis = function () {
                        var newAxes = createXAxis();
                        if (!_(newAxes).isEqual(scope.highchartsNg.xAxis.categories)) {
                            scope.highchartsNg.xAxis.categories = newAxes;
                            if (columnObjects.length && rowObjects.length == 0)
                                scope.highchartsNg.xAxis.max = columnObjects.length - 1;
                            else if (rowObjects.length < 9)
                                scope.highchartsNg.xAxis.max = rowObjects.length - 1;
                            else
                                scope.highchartsNg.xAxis.max = 9;
                        }
                        scope.highchartsNg.init = true;
                        scope.highchartsNg.init = false;
                    };
                    var createVisionSavedSortObject = function (reportObjDetails, rowelIndex) {
                        var sortRepoObject = new report.models.Data.SortReportObject();
                        var sortReportObject = new report.models.Data.SortReportObject();
                        if (reportObjDetails.lstSortReportObject.length == 1 && scope.rowList.length > 0) {
                            // create sortReportObject for cross reports.
                            if (scope.columnList.length > 0) {
                                var layoutArea = reportObjDetails.lstSortReportObject[0].reportObject.layoutArea;
                                if (layoutArea == report.resources.ReportObjectLayoutArea.Values) {
                                    // When sorting is present for the metrics will add row object
                                    sortReportObject.reportObject = scope.rowList[rowelIndex];
                                    sortReportObject.sortOrder = 0;
                                    sortReportObject.sortType = report.resources.SortType.Desc;
                                    reportObjDetails.lstSortReportObject.push(sortReportObject);
                                }
                            }
                        }
                    };
                    var fillSortObject = function (repoObj) {
                        var sortRepoObject = new report.models.Data.SortReportObject();
                        var sortReportObject = new report.models.Data.SortReportObject();

                        if (repoObj && repoObj.hasOwnProperty('filterType')) {
                            switch (repoObj.filterType) {
                                case report.resources.FilterType.SingleSelect:
                                case report.resources.FilterType.MultiSelect:
                                case report.resources.FilterType.Measure:
                                case report.resources.FilterType.Number:
                                case report.resources.FilterType.Tree:
                                    if (reportObjDetails.lstSortReportObject.length == 0) {
                                        if (scope.valueList[0]) {
                                            sortReportObject.reportObject = scope.valueList[0];
                                            sortReportObject.sortOrder = 0;
                                            sortReportObject.sortType = report.resources.SortType.Desc;
                                            reportObjDetails.lstSortReportObject.push(sortReportObject);
                                        }
                                        sortRepoObject.reportObject = repoObj;
                                        sortRepoObject.sortOrder = 1;
                                        sortRepoObject.sortType = report.resources.SortType.Asc;
                                        reportObjDetails.lstSortReportObject.push(sortRepoObject);
                                    }
                                    break;
                                case report.resources.FilterType.MonthYear:
                                case report.resources.FilterType.Quarter:
                                case report.resources.FilterType.QuarterYear:
                                case report.resources.FilterType.Date:
                                case report.resources.FilterType.Month:
                                case report.resources.FilterType.Year:
                                    if (reportObjDetails.lstSortReportObject.length == 0) {
                                        // sortReportObject.newModel(repoObj,report.resources.SortType.Asc,0);
                                        if (scope.activeChart.name == 'Pareto Chart') {
                                            sortReportObject.reportObject = scope.valueList[0];
                                            ;
                                            sortReportObject.sortOrder = 0;
                                            sortReportObject.sortType = report.resources.SortType.Desc;
                                        }
                                        else {
                                            sortReportObject.reportObject = repoObj;
                                            sortReportObject.sortOrder = 1;
                                            sortReportObject.sortType = report.resources.SortType.Asc;
                                        }
                                        reportObjDetails.lstSortReportObject.push(sortReportObject);
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    };
                    var createGraphTitle = function (rowelIndex) {
                        var data = "";
                        for (var i = 0; i < scope.valueList.length; i++) {
                            data += i != scope.valueList.length - 1 ? (scope.valueList[i].displayName + " and ") : (scope.valueList[i].displayName);
                        }
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
                    var updateSortList = function () {
                        scope.listSortWith = [];
                        var rowListForSort = _.where(scope.reportObjDetails.lstReportObject, { layoutArea: report.resources.ReportObjectLayoutArea.Rows });
                        var columnListForSort = _.where(scope.reportObjDetails.lstReportObject, { layoutArea: report.resources.ReportObjectLayoutArea.Columns });
                        var valueListForSort = _.where(scope.reportObjDetails.lstReportObject, { layoutArea: report.resources.ReportObjectLayoutArea.Values });
                        if (columnListForSort.length > 0) {
                            if (scope.showGridGraphView) {
                                angular.forEach(rowListForSort, function (value) {
                                    scope.listSortWith.push({ 'reportObject': value, 'sortas': report.resources.ChartSortType.AscDesc });
                                });
                            }
                            else {
                                angular.forEach(rowListForSort.concat(valueListForSort), function (value) {
                                    scope.listSortWith.push({ 'reportObject': value, 'sortas': report.resources.ChartSortType.AscDesc });
                                });
                            }
                        }
                        else {
                            angular.forEach(rowListForSort.concat(valueListForSort), function (value) {
                                scope.listSortWith.push({ 'reportObject': value, 'sortas': report.resources.ChartSortType.AscDesc });
                            });
                        }
                        angular.forEach(scope.listSortWith, function (value, index) {
                            if (value.reportObject.displayName == scope.reportObjDetails.lstSortReportObject[0].reportObject.displayName) {
                                value.sortas = scope.reportObjDetails.lstSortReportObject[0].sortType == 0 ? report.resources.ChartSortType.ASC : report.resources.ChartSortType.DESC;
                                scope.selectedIndex = index;
                            }
                        });
                        masterJson[rowelIndex].preserveSortList = JSON.stringify(scope.listSortWith);
                    };
                    $(document).on('click', function (e) {
                        var manageLabelsELe = document.getElementById('manageLabelsPopup');
                        if (manageLabelsELe && $(e.target).parents("#manageLabelsPopup").length === 0 && !$(e.target).hasClass('manageLabelsPopup')) {
                            // $(document.getElementsByClassName('report-manage-fields-popup')[0]).css('display', 'none');
                            scope.isMangaeDataLabelsActive = false;
                            scope.$apply();
                        }
                    });
                    scope.loadDataLabelPopUp = function () {
                        scope.isMangaeDataLabelsActive = !scope.isMangaeDataLabelsActive;

                        $("#drpChartOptions").click();
                    };
                    scope.enableSortButton = true;
                    scope.itemClicked = function ($index) {
                        scope.enableSortButton = false;
                        scope.selectedIndex = $index;
                    };
                    scope.setSortAsicon = function (checkSortByicon) {
                        switch (checkSortByicon) {
                            case report.resources.ChartSortType.ASC:
                                return "#icon_SortAscending";
                            case report.resources.ChartSortType.DESC:
                                return "#icon_SortDescending";
                            case report.resources.ChartSortType.AscDesc:
                                return "#icon_Sort";
                        }
                    };
                    scope.manageDataLabels = function () {
                        generateGraph(reportObjDetails, "", function (totalRowCount, pageSize) {
                            if (scope.activeChart.name == 'Tree Chart')
                                getMapChartJson();
                            else if (scope.activeChart.name == 'Multiple Axis Chart')
                                createMultichart();
                            else if (scope.activeChart.name == 'Pareto Chart')
                                createParetoChart();
                            else if (scope.activeChart.name == 'Stacked Column Chart' || scope.activeChart.name == '100% Stacked Column Chart' || scope.activeChart.name == '100% Stacked Bar Chart' || scope.activeChart.name == 'Stacked Bar Chart' || scope.activeChart.name == 'Clustered Stacked Column Chart' || scope.activeChart.name == 'Bar Chart')
                                createStackedCollumnChart();
                            else if (scope.activeChart.name == 'Column & Line Combination Chart' || scope.activeChart.name == 'Bar & Line Combination Chart')
                                createCombinationChart();
                            else if (scope.activeChart.name == 'Bubble Chart')
                                createBubbleChart();
                            else if (scope.activeChart.name == 'Map Chart')
                                createMapChart();
                            else if (scope.activeChart.name == 'Waterfall Chart')
                                createWaterFallChart();
                            else if (scope.activeChart.name == 'Gauge Chart') {
                                createGaugeChart();
                            }
                            else if (scope.activeChart.name == 'Histogram Chart') {
                                getChartForHistogram();
                            }
                            else if (scope.activeChart.name == 'Heat Map') {
                                getHeatMapChart();
                            }
                            else if (scope.activeChart.name == 'Column Chart' || scope.activeChart.name == 'Pie Chart' || scope.activeChart.name == 'Donut Chart' || scope.activeChart.name == 'Line Chart') {
                                getChartJson();
                            }
                            // scope.highchartsNg = getChartJson();
                            masterJson[rowelIndex].pageInfo.pager(totalRowCount, pageSize - 1, 0);
                            enablePaging();
                            resizeChart();
                            initiateChart();
                            scope.graphDataLoaded = true;
                            scope.loadDataLabelPopUp();
                        });
                    };
                    scope.setToolTip = function (checkSortByicon) {
                        switch (checkSortByicon) {
                            case report.resources.ChartSortType.ASC:
                                return report.resources.SortToolTip.DESCENDING;
                            case report.resources.ChartSortType.DESC:
                                return report.resources.SortToolTip.ASCENDING;
                            case report.resources.ChartSortType.AscDesc:
                                return report.resources.SortToolTip.ASCENDING;
                        }
                    };
                    scope.ascDescToggler = function (getCount, currentItem) {
                        scope.enableSortButton = false;
                        var checkcurrentSortas = currentItem.sortas;
                        if (checkcurrentSortas == report.resources.ChartSortType.AscDesc) {
                            currentItem.sortas = report.resources.ChartSortType.ASC;
                        }
                        else if (checkcurrentSortas == report.resources.ChartSortType.ASC) {
                            currentItem.sortas = report.resources.ChartSortType.DESC;
                        }
                        else if (checkcurrentSortas == report.resources.ChartSortType.DESC) {
                            currentItem.sortas = report.resources.ChartSortType.ASC;
                        }
                        for (var i = 0; i < scope.listSortWith.length; i++) {
                            if (i != getCount) {
                                scope.listSortWith[i].sortas = report.resources.ChartSortType.AscDesc;
                            }
                        }
                    };
                    scope.applySort = function () {
                        masterJson[rowelIndex] = new report.models.Metadata.MasterJson();
                        scope.reportObjDetails.pageIndex = masterJson[rowelIndex].pageInfo.currentPage + 1;
                        var sortObject = new report.models.Data.SortReportObject(), sortOrderChart = 0;
                        scope.sortListForGraph = [];
                        scope.reportObjDetails.lstSortReportObject = [];
                        scope.jumpToConfig.newModel(enableJumpToFunction = scope.jumpToConfig.enableJumpToFunction);
                        sortObject.reportObject = scope.listSortWith[scope.selectedIndex].reportObject;
                        sortObject.sortOrder = sortOrderChart;
                        sortObject.sortType = scope.listSortWith[scope.selectedIndex].sortas == report.resources.ChartSortType.DESC ? report.resources.SortType.Desc : report.resources.SortType.Asc;
                        if (scope.showGridGraphView) {
                            scope.$parent.vm.clickedROforOlap[0] = sortObject;
                        }
                        scope.sortListForGraph.push(sortObject);
                        if (scope.listSortWith[scope.selectedIndex].reportObject.layoutArea == report.resources.ReportObjectLayoutArea.Values) {
                            var sortRepoObject = new report.models.Data.SortReportObject();
                            sortRepoObject.reportObject = scope.rowList[rowelIndex];
                            sortRepoObject.sortOrder = ++sortOrderChart;
                            sortRepoObject.sortType = report.resources.SortType.Asc;
                            scope.sortListForGraph.push(sortRepoObject);
                        }
                        if (scope.columnList.length > 0) {
                            var columnSortObj = new report.models.Data.SortReportObject();
                            columnSortObj.reportObject = scope.columnList[0];
                            columnSortObj.sortType = report.resources.SortType.Asc;
                            columnSortObj.sortOrder = scope.sortListForGraph.length;
                            reportObjDetails.lstSortReportObject.push(columnSortObj);
                        }
                        scope.reportObjDetails.lstSortReportObject = scope.sortListForGraph;
                        masterJson[rowelIndex].sortListForDrill = scope.sortListForGraph;
                        masterJson[rowelIndex].preserveSortList = JSON.stringify(scope.listSortWith);
                        if (rowelIndex == 0) {
                            scope.$parent.vm.sortListforGraph = scope.reportObjDetails.lstSortReportObject;
                        }
                        if (rowelIndex > 0) {
                            reportFilterList = updateReportFilterList();
                        }
                        else {
                            reportFilterList = angular.copy(scope.reportFilters);
                        }
                        reportObjects = scope.columnList.concat(scope.rowList[rowelIndex]).concat(scope.valueList);
                        reportObjDetails.newModel(scope.datasourceid, "", 0, reportObjects, scope.sortListForGraph, reportFilterList, -1, reportRequestKey + '_' + rowelIndex, false, false, true, 1);
                        generateGraph(reportObjDetails, "", function (totalRowCount, pageSize) {
                            masterJson[rowelIndex].pageInfo.pager(totalRowCount, pageSize - 1, 0);
                            if (scope.activeChart.name == 'Multiple Axis Chart')
                                createMultichart();
                            else if (scope.activeChart.name == 'Pareto Chart')
                                createParetoChart();
                            else if (scope.activeChart.name == 'Stacked Column Chart' || scope.activeChart.name == '100% Stacked Column Chart' || scope.activeChart.name == '100% Stacked Bar Chart' || scope.activeChart.name == 'Stacked Bar Chart' || scope.activeChart.name == 'Clustered Stacked Column Chart' || scope.activeChart.name == 'Bar Chart')
                                createStackedCollumnChart();
                            else if (scope.activeChart.name == 'Column & Line Combination Chart' || scope.activeChart.name == 'Bar & Line Combination Chart')
                                createCombinationChart();
                            else if (scope.activeChart.name == 'Bubble Chart')
                                createBubbleChart();
                            else if (scope.activeChart.name == 'Map Chart')
                                createMapChart();
                            else if (scope.activeChart.name == 'Waterfall Chart')
                                createWaterFallChart();
                            else if (scope.activeChart.name == 'Gauge Chart') {
                                createGaugeChart();
                            }
                            else if (scope.activeChart.name == 'Histogram Chart') {
                                getChartForHistogram();
                            }
                            else if (scope.activeChart.name == 'Heat Map') {
                                getHeatMapChart();
                            }
                            else if (scope.activeChart.name == 'Column Chart' || scope.activeChart.name == 'Pie Chart' || scope.activeChart.name == 'Donut Chart' || scope.activeChart.name == 'Line Chart') {
                                getChartJson();
                            }
                            else if (scope.activeChart.name == 'Tree Chart') {
                                getMapChartJson();
                            }

                            //else
                            //    scope.highchartsNg = getChartJson();
                            initiateChart();
                            resizeChart();
                        });
                    };

                    scope.pluginParameters = [
                        {
                            'ReportObjectId': 10,
                            'values': { 'key': 'vaule' }
                        }
                    ];

                    scope.openHideIframe = function () {
                        scope.loadIframePlugin = !scope.loadIframePlugin;
                    }

                    scope.closePopOver = function () {
                        if (masterJson[rowelIndex] != undefined && masterJson[rowelIndex].preserveSortList != undefined) {
                            scope.listSortWith = JSON.parse(masterJson[rowelIndex].preserveSortList);
                            angular.forEach(scope.listSortWith, function (value, index) {
                                if (value.sortas != report.resources.ChartSortType.AscDesc)
                                    scope.selectedIndex = index;
                            });
                        }
                    };
                    var generateGraph = function (reportObjDetails, category, callbackfun) {
                        scope.graphDataLoaded = false;
                        scope.isGaugeChartError = false;
                        scope.isGaugeChartErrorForSameValues = false;
                        scope.$parent.vm.isFlipRowColumnEnabled = scope.rowList.length == 1 && scope.columnList.length > 0;
                        reportObjDetails.filterExpression = scope.$parent.vm.filterExpression === undefined ? "" : scope.$parent.vm.filterExpression
                        applyCallback(true, message);
                        var sortValueListReportObject = new report.models.Data.SortReportObject();
                        if ((reportObjDetails.lstSortReportObject == undefined || reportObjDetails.lstSortReportObject.length == 0) && scope.valueList[0]) {
                            sortValueListReportObject.reportObject = scope.valueList[0];
                            sortValueListReportObject.sortOrder = 0;
                            sortValueListReportObject.sortType = report.resources.SortType.Desc;
                        }
                        if (rowelIndex == 0 && scope.$parent.vm.sortListforGraph.length > 0) {
                            reportObjDetails.lstSortReportObject = scope.$parent.vm.sortListforGraph;
                            if (scope.activeChart.name == 'Pareto Chart') {
                                reportObjDetails.lstSortReportObject[0].reportObject = scope.valueList[0];
                                reportObjDetails.lstSortReportObject[0].sortOrder = 0;
                                reportObjDetails.lstSortReportObject[0].sortType = report.resources.SortType.Desc;
                            }
                        }
                        if (reportObjDetails.lstSortReportObject.length == 0) {
                            if (scope.rowList.length)
                                fillSortObject(scope.rowList[rowelIndex]);
                            else
                                reportObjDetails.lstSortReportObject.push(sortValueListReportObject);
                            if (scope.columnList.length > 0 && scope.rowList.length == 0) {
                                fillSortObject(scope.columnList[0]);
                            }
                            if (scope.showGridGraphView && scope.valueList.length > 0 && scope.rowList.length > 0 && scope.columnList.length > 0) {
                                reportObjDetails.lstSortReportObject = [];
                                var columnSortObj = new report.models.Data.SortReportObject();
                                columnSortObj.reportObject = scope.rowList[rowelIndex];
                                columnSortObj.sortType = report.resources.SortType.Asc;
                                columnSortObj.sortOrder = reportObjDetails.lstSortReportObject.length;
                                if (scope.showGridGraphView) {
                                    scope.$parent.vm.clickedROforOlap[0] = columnSortObj;
                                }
                                reportObjDetails.lstSortReportObject.push(columnSortObj);
                            }
                        }
                        else {
                            // CLI-151026 :  when reportObjDetails.lstSortReportObject contains the vision dashboard applied and saved sorting objects.
                            createVisionSavedSortObject(reportObjDetails, rowelIndex);
                        }

                        if (scope.columnList.length > 0 && (_.filter(reportObjDetails.lstSortReportObject, function (sortRO, index) { return sortRO.reportObject.layoutArea == report.resources.ReportObjectLayoutArea.Columns; }).length == 0)) {
                            var columnSortReportObject = new report.models.Data.SortReportObject();
                            if (scope.columnList[0]) {
                                columnSortReportObject.reportObject = scope.columnList[0];
                                columnSortReportObject.sortOrder = 0;
                                columnSortReportObject.sortType = report.resources.SortType.Asc;
                                reportObjDetails.lstSortReportObject.push(columnSortReportObject);
                            }
                        }
                        if (category == "" && (scope.columnList.length > 0 || scope.rowList.length > 0)) {
                            category = scope.columnList.length && scope.rowList.length == 0 ? scope.columnList[rowelIndex].displayName : scope.rowList[rowelIndex].displayName;
                            currentcategory = category;
                        }
                        var currentPageIndex = masterJson[rowelIndex] == undefined ? 0 : masterJson[rowelIndex].pageInfo.currentPage;
                        //Set ReportDetailsId and ReportType to get canned Report core Query while fetching report Data
                        reportObjDetails.reportType = scope.$parent.vm.reportDetailsObj.reportType;
                        reportObjDetails.reportDetailObjectId = scope.$parent.vm.reportDetailsObj.reportDetailObjectId;
                        scope.reportObjDetails = reportObjDetails;
                        if (rowelIndex == 0) {
                            scope.$parent.vm.sortListforGraph = scope.reportObjDetails.lstSortReportObject;
                        }
                        loadgraphdataCallback(reportObjDetails, category, rowelIndex, scope.activeChart.name, currentPageIndex, function (obj, lastRec, totalRowCount, pageSize, minMaxYAxis) {
                            reportObjDetails.lstReportObject = _.compact(reportObjDetails.lstReportObject);
                            if (obj != null || obj != undefined) {
                                if (masterJson[rowelIndex] == undefined)
                                    masterJson[rowelIndex] = new report.models.Metadata.MasterJson();
                                masterJson[rowelIndex].pageData[masterJson[rowelIndex].pageInfo.currentPage] = obj;
                                masterJson[rowelIndex].sortListForDrill = reportObjDetails.lstSortReportObject;
                                updateSortList();
                                for (var k = 0; k < minMaxYAxis.minYaxis.length; k++) {
                                    if (scope.activeChart.name == report.resources.ChartType.MultiChart) {
                                        //chart is multi axes then push multiple Y-Axis values   
                                        masterJson[rowelIndex].minYAxis.push(minMaxYAxis.minYaxis[k]);
                                        masterJson[rowelIndex].maxYAxis.push(minMaxYAxis.maxYaxis[k]);
                                    }
                                    else {
                                        //assign single a Y-axis value for all other charts
                                        masterJson[rowelIndex].minYAxis[0] = minMaxYAxis.minYaxis[0];
                                        masterJson[rowelIndex].maxYAxis[0] = minMaxYAxis.maxYaxis[0];
                                    }
                                }
                                currentJson = masterJson[rowelIndex].pageData[masterJson[rowelIndex].pageInfo.currentPage];
                                if (scope.activeChart.name == 'Gauge Chart') {
                                    scope.valueList.filter(function (x) { return x.formatKey == report.resources.CommonConstants.Percent || (getWijmoConfigurationFormatCallback(x.configurationValue, x.filterType)[0] == 'p'); }).forEach(function (obj) {
                                        currentJson.map(function (y) { return y[obj['displayName']] = y[obj['displayName']] * 100; });
                                    });
                                }
                                currentRow = currentJson[currentJson.length - 1].item;
                                if (lastRec != 0)
                                    masterJson[rowelIndex].lastRecord = lastRec;
                                columnObjects = currentJson[currentJson.length - 1].columnObject;
                                //if (scope.rowList && scope.rowList.length > 0) {
                                //    switch (scope.rowList[0].filterType) {
                                //        case report.resources.FilterType.SingleSelect:
                                //        case report.resources.FilterType.MultiSelect:
                                //        case report.resources.FilterType.Number:
                                //        case report.resources.FilterType.Tree:
                                //            columnObjects.sort();
                                //            break;
                                //        default:
                                //            break;
                                //    }
                                //}
                                rowObjects = currentJson[currentJson.length - 1].rowObjects;
                                metricObjects = [];
                                for (var i = 0; i < scope.valueList.length; i++) {
                                    metricObjects.push(scope.valueList[i].reportObjectName);
                                }
                                //for colorpalet
                                if (isColorPaletEnabled()) {
                                    SharedService.GetDefaultColorConfigForAllCharts().then(function () {
                                        setDefaultColorsForChart();
                                        createLegendList();
                                    });
                                }
                                if (rowelIndex == 0) {
                                    scope.disableDrillup = true;
                                    if (scope.activeChart.name == 'Tree Chart')
                                        getMapChartJson();
                                    else if (scope.activeChart.name == 'Multiple Axis Chart')
                                        createMultichart();
                                    else if (scope.activeChart.name == 'Pareto Chart')
                                        createParetoChart();
                                    else if (scope.activeChart.name == 'Stacked Column Chart' || scope.activeChart.name == '100% Stacked Column Chart' || scope.activeChart.name == '100% Stacked Bar Chart' || scope.activeChart.name == 'Stacked Bar Chart' || scope.activeChart.name == 'Clustered Stacked Column Chart' || scope.activeChart.name == 'Bar Chart')
                                        createStackedCollumnChart();
                                    else if (scope.activeChart.name == 'Column & Line Combination Chart' || scope.activeChart.name == 'Bar & Line Combination Chart')
                                        createCombinationChart();
                                    else if (scope.activeChart.name == 'Bubble Chart')
                                        createBubbleChart();
                                    else if (scope.activeChart.name == 'Map Chart')
                                        createMapChart();
                                    else if (scope.activeChart.name == 'Waterfall Chart')
                                        createWaterFallChart();
                                    else if (scope.activeChart.name == 'Gauge Chart') {
                                        createGaugeChart();
                                    }
                                    else if (scope.activeChart.name == 'Histogram Chart') {
                                        getChartForHistogram();
                                    }
                                    else if (scope.activeChart.name == 'Heat Map') {
                                        getHeatMapChart();
                                    }
                                    else if (scope.activeChart.name == 'Column Chart' || scope.activeChart.name == 'Pie Chart' || scope.activeChart.name == 'Donut Chart' || scope.activeChart.name == 'Line Chart') {
                                        getChartJson();
                                    }
                                    //else {
                                    //    scope.highchartsNg = getChartJson();
                                    //}
                                }
                                else
                                    scope.disableDrillup = false;
                                callbackfun(totalRowCount, pageSize);
                                scope.issavedreport = false;
                                applyCallback(false, message);
                                //enable disable paging
                                enablePaging();
                                scope.graphDataLoaded = true;
                                scope.resetRowElIndex = false;
                            }
                            else {
                                //updateSeries();
                                //updateXAxis();
                                if (scope.activeChart.name == 'Tree Chart')
                                    getMapChartJson();
                                else if (scope.activeChart.name == 'Multiple Axis Chart')
                                    createMultichart();
                                else if (scope.activeChart.name == 'Pareto Chart')
                                    createParetoChart();
                                else if (scope.activeChart.name == 'Stacked Column Chart' || scope.activeChart.name == '100% Stacked Column Chart' || scope.activeChart.name == '100% Stacked Bar Chart' || scope.activeChart.name == 'Stacked Bar Chart' || scope.activeChart.name == 'Clustered Stacked Column Chart' || scope.activeChart.name == 'Bar Chart')
                                    createStackedCollumnChart();
                                else if (scope.activeChart.name == 'Column & Line Combination Chart' || scope.activeChart.name == 'Bar & Line Combination Chart') {
                                    createCombinationChart();
                                }
                                else if (scope.activeChart.name == 'Bubble Chart')
                                    createBubbleChart();
                                else if (scope.activeChart.name == 'Map Chart')
                                    createMapChart();
                                else if (scope.activeChart.name == 'Waterfall Chart')
                                    createWaterFallChart();
                                else if (scope.activeChart.name == 'Gauge Chart') {
                                    createGaugeChart();
                                }
                                else if (scope.activeChart.name == 'Histogram Chart') {
                                    getChartForHistogram();
                                }
                                else if (scope.activeChart.name == 'Heat Map') {
                                    getHeatMapChart();
                                }
                                else if (scope.activeChart.name == 'Column Chart' || scope.activeChart.name == 'Pie Chart' || scope.activeChart.name == 'Donut Chart' || scope.activeChart.name == 'Line Chart') {
                                    getChartJson();
                                }
                                //else
                                //    scope.highchartsNg = getChartJson();
                                enablePaging();
                                applyCallback(false, message);
                                scope.graphDataLoaded = true;
                                scope.resetRowElIndex = false;
                            }
                        });
                        // scope.reportObjDetails.lstReportObject = scope.columnList.concat(scope.rowList).concat(scope.valueList);
                    };
                    var updateMaster = function () {
                        var indexLength = Math.max(Math.max(scope.valueList.length, scope.rowList.length), scope.columnList.length);
                        for (var i = 0; i < indexLength; i++) {
                            if (scope.valueList[i] != undefined) {
                                scope.valueList[i].layoutArea = 2;
                                scope.valueList[i].currentDrop = $translate.instant('VALUE');
                                scope.valueList[i].isOnOrAfterTerm = "";
                            }
                            if (scope.rowList[i] != undefined) {
                                scope.rowList[i].layoutArea = 0;
                                scope.rowList[i].currentDrop = $translate.instant('ROW');
                                scope.rowList[i].isOnOrAfterTerm = "";
                            }
                            if (scope.columnList[i] != undefined) {
                                scope.columnList[i].layoutArea = 1;
                                scope.columnList[i].currentDrop = $translate.instant('COLUMN');
                                scope.columnList[i].isOnOrAfterTerm = "";
                            }
                        }
                        if (rowelIndex > 0)
                            scope.disableDrillup = false;
                        else
                            scope.disableDrillup = true;
                        if (scope.columnList.length && !scope.rowList.length)
                            reportObjects = scope.columnList.concat(scope.valueList);
                        else
                            reportObjects = scope.columnList.concat(scope.rowList[rowelIndex]).concat(scope.valueList);
                        if (scope.columnList.length && scope.rowList.length == 0 && scope.resetRowElIndex)
                            scope.chartstates = [{ "itemName": scope.columnList[rowelIndex].reportObjectName, "active": true }];
                        else if (scope.resetRowElIndex && scope.rowList.length > 0)
                            scope.chartstates = [{ "itemName": scope.rowList[rowelIndex].reportObjectName, "active": true }];
                        if (reportObjDetails.lstSortReportObject == undefined)
                            reportObjDetails.lstSortReportObject = [];
                        reportObjDetails.newModel(scope.datasourceid, "", 0, reportObjects, reportObjDetails.lstSortReportObject, reportFilterList, -1, reportRequestKey + '_' + rowelIndex, false, false, true, 1, scope.showGridGraphView, undefined, scope.isRangeRedToGreenColor);
                        reportObjDetails.lstReportObject = _.compact(reportObjDetails.lstReportObject);
                        generateGraph(reportObjDetails, "", function (totalRowCount, pageSize) {
                            if (scope.activeChart.name == 'Tree Chart')
                                getMapChartJson();
                            else if (scope.activeChart.name == 'Multiple Axis Chart')
                                createMultichart();
                            else if (scope.activeChart.name == 'Pareto Chart')
                                createParetoChart();
                            else if (scope.activeChart.name == 'Stacked Column Chart' || scope.activeChart.name == '100% Stacked Column Chart' || scope.activeChart.name == '100% Stacked Bar Chart' || scope.activeChart.name == 'Stacked Bar Chart' || scope.activeChart.name == 'Clustered Stacked Column Chart' || scope.activeChart.name == 'Bar Chart')
                                createStackedCollumnChart();
                            else if (scope.activeChart.name == 'Column & Line Combination Chart' || scope.activeChart.name == 'Bar & Line Combination Chart')
                                createCombinationChart();
                            else if (scope.activeChart.name == 'Bubble Chart')
                                createBubbleChart();
                            else if (scope.activeChart.name == 'Map Chart')
                                createMapChart();
                            else if (scope.activeChart.name == 'Waterfall Chart')
                                createWaterFallChart();
                            else if (scope.activeChart.name == 'Gauge Chart') {
                                createGaugeChart();
                            }
                            else if (scope.activeChart.name == 'Histogram Chart') {
                                getChartForHistogram();
                            }
                            else if (scope.activeChart.name == 'Heat Map') {
                                getHeatMapChart();
                            }
                            else if (scope.activeChart.name == 'Column Chart' || scope.activeChart.name == 'Pie Chart' || scope.activeChart.name == 'Donut Chart' || scope.activeChart.name == 'Line Chart') {
                                getChartJson();
                            }
                            //else
                            //    scope.highchartsNg = getChartJson();
                            masterJson[rowelIndex].pageInfo.pager(totalRowCount, pageSize - 1, 0);
                            enablePaging();
                            resizeChart();
                            initiateChart();
                            scope.graphDataLoaded = true;
                        });
                    };
                    var unbindactiveChart = scope.$watchCollection('activeChart', function (newVal, oldVal) {
                        if (newVal != oldVal && newVal.active) {
                            if (rowelIndex > 0) {
                                scope.disableDrillup = false;
                            }
                            else {
                                scope.disableDrillup = true;
                            }
                            switch (scope.activeChart.name) {
                                case 'Column Chart': {
                                    chartType = "column";
                                    break;
                                }
                                case 'Line Chart': {
                                    chartType = "spline";
                                    break;
                                }
                                case 'Stacked Column Chart': {
                                    chartType = "stColumn";
                                    break;
                                }
                                case 'Pie Chart': {
                                    chartType = "pie";
                                    break;
                                }
                                case 'Tree Chart': {
                                    chartType = "tree";
                                    break;
                                }
                                case 'Multiple Axis Chart': {
                                    chartType = "multi";
                                    break;
                                }
                                case 'Pareto Chart': {
                                    chartType = "pareto";
                                    break;
                                }
                                case 'Bar Chart': {
                                    chartType = "bar";
                                    break;
                                }
                                case '100% Stacked Column Chart': {
                                    chartType = "percentStColumn";
                                    break;
                                }
                                case 'Stacked Bar Chart': {
                                    chartType = "stBar";
                                    break;
                                }
                                case '100% Stacked Bar Chart': {
                                    chartType = "percentStBar";
                                    break;
                                }
                                case 'Clustered Stacked Column Chart': {
                                    chartType = 'clusteredStackedColumnChart';
                                    break;
                                }
                                case 'Donut Chart': {
                                    chartType = "pie";
                                    break;
                                }
                                case 'Column & Line Combination Chart': {
                                    chartType = "columnLineCombinationChart";
                                    break;
                                }
                                case 'Bar & Line Combination Chart': {
                                    chartType = "barLineCombinationCHart";
                                    break;
                                }
                                case 'Bubble Chart': {
                                    chartType = "bubble";
                                    break;
                                }
                                case 'Map Chart': {
                                    chartType = "map";
                                    break;
                                }
                                case 'Waterfall Chart': {
                                    chartType = "waterFallChart";
                                    break;
                                }
                                case 'Gauge Chart': {
                                    chartType = "solidgauge";
                                    break;
                                }
                                case 'Histogram Chart': {
                                    chartType = "histogram";
                                    break;
                                }
                                case 'Heat Map': {
                                    chartType = "heatmap";
                                    break;
                                }
                            }
                            ;
                            scope.updateChart = true;
                            if (scope.activeChart.name != 'Tree Chart' && scope.activeChart.name != 'Pie Chart' && scope.activeChart.name != 'Donut Chart' && scope.activeChart.name != 'Pareto Chart' && scope.activeChart.name != 'Bubble Chart' && scope.activeChart.name != 'Map Chart' && scope.activeChart.name != 'Waterfall Chart')
                                enablePaging();
                        }
                    });
                    scope.$watch('updateChart', function (newVal, oldVal) {
                        if (newVal) {
                            scope.enableJumpToForUser();
                            scope.graphDataLoaded = false;
                            if (rowelIndex > 0) {
                                scope.disableDrillup = false;
                            }
                            else {
                                scope.disableDrillup = true;
                            }
                            if ((_.filter(scope.valueList, function (value, key) { return value.reportObjectDataType == report.resources.ReportObjectDataType.String; })).length > 0) {
                                updatePhaseCallback(false, true);
                                scope.updateChart = false;
                                scope.graphDataLoaded = true;
                            }
                            else {
                                switch (chartType) {
                                    case "stColumn":
                                        {
                                            if ((scope.columnList.length == 1 && scope.valueList.length == 1)
                                                || (scope.columnList.length == 0 && scope.valueList.length >= 1 && scope.rowList.length >= 1)) {
                                                reportFilterList = angular.copy(scope.reportFilters);
                                                if (scope.resetRowElIndex)
                                                    rowelIndex = 0;
                                                masterJson = new report.models.Metadata.MasterJson();
                                                if (rowelIndex > 0)
                                                    reportFilterList = updateReportFilterList();
                                                else {
                                                    reportFilterList = angular.copy(scope.reportFilters);
                                                }
                                                updateMaster();
                                                updatePhaseCallback(true, false);
                                                scope.updateChart = false;
                                            }
                                            else {
                                                updatePhaseCallback(false, true);
                                                scope.updateChart = false;
                                                scope.graphDataLoaded = true;
                                            }
                                            break;
                                        }
                                    case "histogram":
                                        {
                                            if ((scope.valueList.length == 3 && ((scope.columnList.length == 1 && scope.rowList.length == 0) || (scope.columnList.length == 0 && scope.rowList.length == 1)))) {
                                                reportFilterList = angular.copy(scope.reportFilters);
                                                if (scope.resetRowElIndex)
                                                    rowelIndex = 0;
                                                masterJson = new report.models.Metadata.MasterJson();
                                                if (rowelIndex > 0)
                                                    reportFilterList = updateReportFilterList();
                                                else {
                                                    reportFilterList = angular.copy(scope.reportFilters);
                                                }
                                                updateMaster();
                                                updatePhaseCallback(true, false);
                                                scope.updateChart = false;
                                            }
                                            else {
                                                updatePhaseCallback(false, true);
                                                scope.updateChart = false;
                                                scope.graphDataLoaded = true;
                                            }
                                            break;
                                        }
                                    case "heatmap":
                                        {
                                            if ((scope.valueList.length == 1 && scope.columnList.length == 1) && scope.rowList.length >= 1) {
                                                if (scope.resetRowElIndex)
                                                    rowelIndex = 0;
                                                masterJson = new report.models.Metadata.MasterJson();
                                                if (rowelIndex > 0)
                                                    reportFilterList = updateReportFilterList();
                                                else {
                                                    reportFilterList = angular.copy(scope.reportFilters);
                                                }
                                                updateMaster();
                                                updatePhaseCallback(true, false);
                                                scope.updateChart = false;
                                            }
                                            else {
                                                updatePhaseCallback(false, true);
                                                scope.updateChart = false;
                                                scope.graphDataLoaded = true;
                                            }
                                            break;
                                        }
                                    case "pie":
                                        {
                                            if ((scope.rowList.length >= 1
                                                && (scope.valueList.length >= 1 && scope.valueList.length <= 4)
                                                && scope.columnList.length == 0 && scope.activeChart.name == 'Pie Chart') || (scope.rowList.length >= 1
                                                    && (scope.valueList.length >= 1 && scope.valueList.length == 1)
                                                    && scope.columnList.length == 0 && scope.activeChart.name == 'Donut Chart')) {
                                                reportFilterList = angular.copy(scope.reportFilters);
                                                if (scope.resetRowElIndex)
                                                    rowelIndex = 0;
                                                masterJson = new report.models.Metadata.MasterJson();
                                                if (rowelIndex > 0)
                                                    reportFilterList = updateReportFilterList();
                                                else {
                                                    reportFilterList = angular.copy(scope.reportFilters);
                                                }
                                                updateMaster();
                                                updatePhaseCallback(true, false);
                                                scope.updateChart = false;
                                            }
                                            else {
                                                updatePhaseCallback(false, true);
                                                scope.updateChart = false;
                                                scope.graphDataLoaded = true;
                                            }
                                            break;
                                        }
                                    case "tree":
                                        {
                                            if (scope.rowList.length >= 1
                                                && scope.valueList.length == 2 && scope.columnList.length == 0) {
                                                reportFilterList = angular.copy(scope.reportFilters);
                                                if (scope.resetRowElIndex)
                                                    rowelIndex = 0;
                                                masterJson = new report.models.Metadata.MasterJson();
                                                if (rowelIndex > 0)
                                                    reportFilterList = updateReportFilterList();
                                                else {
                                                    reportFilterList = angular.copy(scope.reportFilters);
                                                }
                                                updateMaster();
                                                updatePhaseCallback(true, false);
                                                scope.updateChart = false;
                                            }
                                            else {
                                                updatePhaseCallback(false, true);
                                                scope.updateChart = false;
                                                scope.graphDataLoaded = true;
                                            }
                                            break;
                                        }
                                    case "multi":
                                        {
                                            if ((scope.rowList.length >= 1
                                                && scope.valueList.length >= 2 && scope.valueList.length <= 5 && scope.columnList.length == 0) ||
                                                (scope.rowList.length >= 1 && (scope.valueList.length == 2 || scope.valueList.length == 3) && scope.columnList.length == 1)) {
                                                reportFilterList = angular.copy(scope.reportFilters);
                                                if (scope.resetRowElIndex)
                                                    rowelIndex = 0;
                                                masterJson = new report.models.Metadata.MasterJson();
                                                if (rowelIndex > 0)
                                                    reportFilterList = updateReportFilterList();
                                                else {
                                                    reportFilterList = angular.copy(scope.reportFilters);
                                                }
                                                updateMaster();
                                                updatePhaseCallback(true, false);
                                                scope.updateChart = false;
                                            }
                                            else {
                                                updatePhaseCallback(false, true);
                                                scope.updateChart = false;
                                                scope.graphDataLoaded = true;
                                            }
                                            break;
                                        }
                                    case "pareto":
                                        {
                                            if (scope.rowList.length >= 1
                                                && scope.valueList.length == 1
                                                && scope.columnList.length == 0) {
                                                reportFilterList = angular.copy(scope.reportFilters);
                                                if (scope.resetRowElIndex)
                                                    rowelIndex = 0;
                                                masterJson = new report.models.Metadata.MasterJson();
                                                if (rowelIndex > 0)
                                                    reportFilterList = updateReportFilterList();
                                                else {
                                                    reportFilterList = angular.copy(scope.reportFilters);
                                                }
                                                updateMaster();
                                                updatePhaseCallback(true, false);
                                                scope.updateChart = false;
                                            }
                                            else {
                                                updatePhaseCallback(false, true);
                                                scope.updateChart = false;
                                                scope.graphDataLoaded = true;
                                            }
                                            break;
                                        }
                                    case "percentStColumn":
                                        {
                                            if ((scope.columnList.length == 1
                                                && scope.valueList.length == 1) || (scope.columnList.length == 0
                                                    && scope.valueList.length >= 1 && scope.rowList.length >= 1)) {
                                                reportFilterList = angular.copy(scope.reportFilters);
                                                if (scope.resetRowElIndex)
                                                    rowelIndex = 0;
                                                masterJson = new report.models.Metadata.MasterJson();
                                                if (rowelIndex > 0)
                                                    reportFilterList = updateReportFilterList();
                                                else {
                                                    reportFilterList = angular.copy(scope.reportFilters);
                                                }
                                                updateMaster();
                                                updatePhaseCallback(true, false);
                                                scope.updateChart = false;
                                            }
                                            else {
                                                updatePhaseCallback(false, true);
                                                scope.updateChart = false;
                                                scope.graphDataLoaded = true;
                                            }
                                            break;
                                        }
                                    case "bubble":
                                        {
                                            if ((scope.columnList.length >= 1 && scope.valueList.length == 3 && scope.rowList.length == 0) ||
                                                (scope.columnList.length == 0 && scope.valueList.length == 3 && scope.rowList.length >= 1) ||
                                                (scope.columnList.length == 0 && scope.valueList.length == 2 && scope.rowList.length == 1) ||
                                                (scope.columnList.length == 0 && scope.valueList.length == 3 && scope.rowList.length == 0)) {
                                                reportFilterList = angular.copy(scope.reportFilters);
                                                if (scope.resetRowElIndex)
                                                    rowelIndex = 0;
                                                masterJson = new report.models.Metadata.MasterJson();
                                                if (rowelIndex > 0)
                                                    reportFilterList = updateReportFilterList();
                                                else {
                                                    reportFilterList = angular.copy(scope.reportFilters);
                                                }
                                                updateMaster();
                                                updatePhaseCallback(true, false);
                                                scope.updateChart = false;
                                            }
                                            else {
                                                updatePhaseCallback(false, true);
                                                scope.updateChart = false;
                                                scope.graphDataLoaded = true;
                                            }
                                            break;
                                        }
                                    case "map":
                                        {
                                            if ((scope.rowList.length >= 1) ||
                                                ((scope.rowList.length == 0 || scope.rowList.length == 1) &&
                                                    (scope.columnList.length == 0 || scope.columnList.length == 1) &&
                                                    scope.rowList.length >= 1)) {
                                                reportFilterList = angular.copy(scope.reportFilters);
                                                if (scope.resetRowElIndex)
                                                    rowelIndex = 0;
                                                masterJson = new report.models.Metadata.MasterJson();
                                                if (rowelIndex > 0)
                                                    reportFilterList = updateReportFilterList();
                                                else {
                                                    reportFilterList = angular.copy(scope.reportFilters);
                                                }
                                                updateMaster();
                                                updatePhaseCallback(true, false);
                                                scope.updateChart = false;
                                            }
                                            else {
                                                updatePhaseCallback(false, true);
                                                scope.updateChart = false;
                                                scope.graphDataLoaded = true;
                                            }
                                            break;
                                        }
                                    case "solidgauge":
                                        {
                                            if ((scope.rowList.length == 1 && scope.valueList.length == 2 && scope.columnList.length == 0)
                                                || (scope.rowList.length == 1 && scope.valueList.length == 3 && scope.columnList.length == 0)) {
                                                reportFilterList = angular.copy(scope.reportFilters);
                                                if (scope.resetRowElIndex)
                                                    rowelIndex = 0;
                                                masterJson = new report.models.Metadata.MasterJson();
                                                if (rowelIndex > 0)
                                                    reportFilterList = new report.models.Metadata.MasterJson();
                                                else
                                                    reportFilterList = angular.copy(scope.reportFilters);
                                                updateMaster();
                                                updatePhaseCallback(true, false);
                                                scope.updateChart = false;
                                            }
                                            else {
                                                updatePhaseCallback(false, true);
                                                scope.updateChart = false;
                                                scope.graphDataLoaded = true;
                                            }
                                            break;
                                        }
                                    case "waterFallChart":
                                        {
                                            if ((scope.columnList.length == 1 || scope.columnList.length == 0) && scope.valueList.length == 1 && scope.rowList.length >= 1) {
                                                if (scope.resetRowElIndex)
                                                    rowelIndex = 0;
                                                masterJson = new report.models.Metadata.MasterJson();
                                                if (rowelIndex > 0)
                                                    reportFilterList = updateReportFilterList();
                                                else {
                                                    reportFilterList = angular.copy(scope.reportFilters);
                                                }
                                                updateMaster();
                                                updatePhaseCallback(true, false);
                                                scope.updateChart = false;
                                            }
                                            else {
                                                updatePhaseCallback(false, true);
                                                scope.updateChart = false;
                                                scope.graphDataLoaded = true;
                                            }
                                            break;
                                        }
                                    default:
                                        {
                                            if ((scope.columnList.length == 0
                                                && scope.valueList.length > 0
                                                && scope.valueList.length <= 10)
                                                || (scope.columnList.length == 1
                                                    && scope.valueList.length == 1 && chartType != "pie")) {
                                                if (scope.resetRowElIndex)
                                                    rowelIndex = 0;
                                                masterJson = new report.models.Metadata.MasterJson();
                                                if (rowelIndex > 0)
                                                    reportFilterList = updateReportFilterList();
                                                else {
                                                    reportFilterList = angular.copy(scope.reportFilters);
                                                }
                                                updateMaster();
                                                updatePhaseCallback(true, false);
                                                scope.updateChart = false;
                                            }
                                            else {
                                                updatePhaseCallback(false, true);
                                                scope.updateChart = false;
                                                scope.graphDataLoaded = true;
                                            }
                                        }
                                }
                            }
                            //resizeChart();
                            scope.highchartsNg.resizeChart = false;
                            setTimeout(function () {
                                scope.highchartsNg.resizeChart = true;
                                scope.$digest();
                            }, 500);
                        }
                    });
                    updateMaster();
                    var getFormattedFilterValue = function (selectedRo, filterData) {
                        var values = new Array();
                        var selectedDate = new Date();
                        switch (selectedRo.filterType) {
                            case report.resources.FilterType.Date:
                                if (filterData.toLowerCase() != "invalid date") {
                                    selectedDate = new Date(filterData);
                                    values.push(selectedDate.getFullYear().toString() +
                                        ((selectedDate.getMonth() + 1).toString().length == 1
                                            ? "0" + (selectedDate.getMonth() + 1).toString()
                                            : (selectedDate.getMonth() + 1).toString()) +
                                        (selectedDate.getDate().toString().length == 1
                                            ? "0" + selectedDate.getDate().toString()
                                            : selectedDate.getDate().toString()));
                                }
                                else {
                                    values.push(null);
                                }
                                break;
                            case report.resources.FilterType.Month:
                                values.push((new Date(filterData + '-01-01').getMonth() + 1).toString());
                                break;
                            case report.resources.FilterType.Quarter:
                                values.push(filterData.substr(filterData.length - 1));
                                break;
                            case report.resources.FilterType.QuarterYear:
                                var qtrYearData_1 = filterData.split('-');
                                var tempQuarter = _.filter(selectedRo.quarterArray, function (value, key) {
                                    if (value[0] == qtrYearData_1[0].toString())
                                        return value;
                                });
                                var quarterName = tempQuarter.length > 0 ? tempQuarter[0][1] : "";
                                values.push(qtrYearData_1[1].toString() + quarterName.toString());
                                break;
                            case report.resources.FilterType.MonthYear:
                                var monYearData_1 = filterData.split('-');
                                var tempMonth = _.filter(selectedRo.monthArray, function (value, key) {
                                    if (value[0] == monYearData_1[0])
                                        return value;
                                });
                                var monthName = tempMonth.length > 0 ? tempMonth[0][1].length == 1 ? "0" + tempMonth[0][1] : tempMonth[0][1] : "";
                                selectedDate = new Date(monYearData_1[1] + '-' + monthName + '-01');
                                values.push(selectedDate.getFullYear().toString() + ((selectedDate.getMonth() + 1).toString().length == 1
                                    ? "0" + (selectedDate.getMonth() + 1).toString()
                                    : (selectedDate.getMonth() + 1).toString()));
                                break;
                            default:
                                values.push(filterData.toString());
                                break;
                        }
                        return values;
                    };
                    var jumpToState = function (category) {
                        if (category == " ") {
                            category = "";
                        }
                        if (scope.showGridGraphView) {
                            scope.$parent.vm.clickedROforOlap = [];
                        }
                        scope.sortListForGraph = [];
                        var filterObject = new report.models.Data.FilterReportObject();
                        var values = [];
                        scope.jumpToConfig.newModel(enableJumpToFunction = scope.jumpToConfig.enableJumpToFunction);
                        if (scope.chartstates.length < scope.rowList.length && scope.rowList[scope.chartstates.length - 1].derivedRoType !== report.resources.DerivedRoType.DerivedAttributeObject) {
                            rowelIndex = scope.chartstates.length;
                            //Commenting the below If condition as it is the same as the above If statement.
                            //if (rowelIndex < scope.rowList.length) {
                            reportObjDetails = new report.models.Data.ReportDetails();
                            //values.push(category);
                            values = getFormattedFilterValue(scope.rowList[rowelIndex - 1], category);
                            scope.rowList[rowelIndex - 1].isDrill = true;
                            scope.chartstates.push({ "itemName": category, "active": false });
                            for (var i = 0; i < scope.chartstates.length; i++) {
                                scope.chartstates[i].active = false;
                            }
                            scope.chartstates[scope.chartstates.length - 1].active = true;
                            if (rowelIndex > 0) {
                                reportFilterList = updateReportFilterList();
                            }
                            else {
                                reportFilterList = angular.copy(scope.reportFilters);
                            }
                            reportObjects = scope.columnList.concat(scope.rowList[rowelIndex]).concat(scope.valueList);
                            var indexLength = Math.max(Math.max(scope.valueList.length, scope.rowList.length), scope.columnList.length);
                            for (var i_1 = 0; i_1 < indexLength; i_1++) {
                                if (scope.valueList[i_1] != undefined) {
                                    scope.valueList[i_1].isOnOrAfterTerm = "";
                                }
                                if (scope.rowList[i_1] != undefined) {
                                    scope.rowList[i_1].isOnOrAfterTerm = "";
                                }
                                if (scope.columnList[i_1] != undefined) {
                                    scope.columnList[i_1].isOnOrAfterTerm = "";
                                }
                            }
                            reportObjDetails.newModel(scope.datasourceid, "", 0, reportObjects, [], reportFilterList, -1, reportRequestKey + '_' + rowelIndex, false, false, true, 1, undefined, undefined, scope.isRangeRedToGreenColor);
                            //empty previous drill level data before every drill
                            //if (masterJson[rowelIndex] == undefined)
                            masterJson[rowelIndex] = new report.models.Metadata.MasterJson();
                            masterJson[rowelIndex].pageData = [];
                            masterJson[rowelIndex].pageInfo.currentPage = 0;
                            // masterJson[rowelIndex].pageInfo = [];
                            generateGraph(reportObjDetails, category, function (totalRowCount, pageSize) {
                                if (totalRowCount > 0)
                                    masterJson[rowelIndex].pageInfo.pager(totalRowCount, pageSize - 1, 0);
                                if (scope.activeChart.name == 'Tree Chart') {
                                    scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                                    //scope.highchartsMapNg.title.text = '';
                                    //scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                                }
                                else if (scope.activeChart.name == 'Multiple Axis Chart') {
                                }
                                else if (scope.activeChart.name == 'Pareto Chart') {
                                }
                                else if (scope.activeChart.name == 'Stacked Column Chart' || scope.activeChart.name == '100% Stacked Column Chart' || scope.activeChart.name == '100% Stacked Bar Chart' || scope.activeChart.name == 'Stacked Bar Chart' || scope.activeChart.name == 'Bar Chart') {
                                }
                                else if (scope.activeChart.name == 'Column & Line Combination Chart' || scope.activeChart.name == 'Bar & Line Combination Chart') {
                                }
                                else if (scope.activeChart.name == 'Bubble Chart') {
                                    scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                                }
                                else if (scope.activeChart.name == 'Map Chart') {
                                    scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                                }
                                else if (scope.activeChart.name == 'Waterfall Chart') {
                                    scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                                }
                                else if (scope.activeChart.name == 'Gauge Chart') {
                                    scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                                }
                                else if (scope.activeChart.name == 'Histogram Chart') {
                                    scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                                }
                                else if (scope.activeChart.name == 'Heat Map') {
                                    scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                                }
                                else if (scope.activeChart.name == 'Column Chart' || scope.activeChart.name == 'Pie Chart' || scope.activeChart.name == 'Donut Chart' || scope.activeChart.name == 'Line Chart') {
                                    scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                                }
                                else {
                                    scope.highchartsNg.title.text = '';
                                    scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                                }
                                //updateSeries();
                                //updateXAxis();
                                if (scope.activeChart.name == 'Tree Chart')
                                    getMapChartJson();
                                else if (scope.activeChart.name == 'Multiple Axis Chart')
                                    createMultichart();
                                else if (scope.activeChart.name == 'Pareto Chart')
                                    createParetoChart();
                                else if (scope.activeChart.name == 'Stacked Column Chart' || scope.activeChart.name == '100% Stacked Column Chart' || scope.activeChart.name == '100% Stacked Bar Chart' || scope.activeChart.name == 'Stacked Bar Chart' || scope.activeChart.name == 'Clustered Stacked Column Chart' || scope.activeChart.name == 'Bar Chart')
                                    createStackedCollumnChart();
                                else if (scope.activeChart.name == 'Column & Line Combination Chart' || scope.activeChart.name == 'Bar & Line Combination Chart') {
                                    createCombinationChart();
                                }
                                else if (scope.activeChart.name == 'Bubble Chart')
                                    createBubbleChart();
                                else if (scope.activeChart.name == 'Map Chart')
                                    createMapChart();
                                else if (scope.activeChart.name == 'Waterfall Chart')
                                    createWaterFallChart();
                                else if (scope.activeChart.name == 'Gauge Chart') {
                                    createGaugeChart();
                                }
                                else if (scope.activeChart.name == 'Histogram Chart') {
                                    getChartForHistogram();
                                }
                                else if (scope.activeChart.name == 'Heat Map') {
                                    getHeatMapChart();
                                }
                                else if (scope.activeChart.name == 'Column Chart' || scope.activeChart.name == 'Pie Chart' || scope.activeChart.name == 'Donut Chart' || scope.activeChart.name == 'Line Chart') {
                                    getChartJson();
                                }
                                //else
                                //    scope.highchartsNg = getChartJson();
                                enablePaging();
                                currentcategory = category;
                            });
                        }
                        else {
                            scope.rowList[scope.chartstates.length - 1].derivedRoType !== report.resources.DerivedRoType.DerivedAttributeObject ? scope.$parent.vm.notificationService.toastMessage($translate.instant('vision_STRING_CANNOT_DRILL_FURTHER'), 3000) : scope.$parent.vm.notificationService.toastMessage($translate.instant('Insights_DrillNotSupported'), 3000);
                        }
                    };
                    var showMessage = function (repoObj) {
                        var data = "";
                        switch (repoObj.filterType) {
                            case report.resources.FilterType.SingleSelect:
                            case report.resources.FilterType.MultiSelect:
                            case report.resources.FilterType.Measure:
                            case report.resources.FilterType.Number:
                            case report.resources.FilterType.Tree:
                                data = scope.valueList[0].displayName;
                                break;
                            default:
                                break;
                        }
                        return data;
                    };
                    //---------------------------   CREATE X-AXIS and Y-AXIS  --------------------------------//
                    var createXAxis = function () {
                        var data = [];
                        if ((columnObjects.length > 0 && rowObjects.length == 0
                            && (scope.activeChart.name == "Stacked Column Chart" || scope.activeChart.name == "Stacked Bar Chart" || scope.activeChart.name == "Line Chart" || scope.activeChart.name == "100% Stacked Bar Chart" || scope.activeChart.name == "100% Stacked Column Chart"))) {
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
                        else {
                            angular.forEach(currentJson[currentJson.length - 1].rowObjects, function (value, key) {
                                data.push(value);
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
                                if (rowObjects.length > 0 && columnObjects.length > 0)
                                    temp[0].color = getSeriesColor(seriesObject[0], 0);
                                else
                                    temp[0].color = getSeriesColor(seriesObject[0], 0);
                                temp[0].data = getDataByIndex(0);
                                temp[0].pointPadding = 0.44,
                                    temp[0].pointPlacement = -0.15,
                                    temp[0].type = "column";
                            }
                            else if (i == 1) {
                                temp[1].cursor = 'pointer';
                                temp[1].type = chartType;
                                temp[1].name = seriesObject[1];
                                //temp[1].color = 'rgba(126,86,134,.9)';
                                if (rowObjects.length > 0 && columnObjects.length > 0)
                                    temp[1].color = getSeriesColor(seriesObject[1], 1);
                                else
                                    temp[1].color = getSeriesColor(seriesObject[1], 1);
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
                                if (rowObjects.length > 0 && columnObjects.length > 0)
                                    temp[2].color = getSeriesColor(seriesObject[2], 2);
                                else
                                    temp[2].color = getSeriesColor(seriesObject[2], 2);
                                temp[2].data = getDataByIndex(2);
                                temp[2].pointPadding = 0.3,
                                    temp[2].pointPlacement = -0.2,
                                    temp[2].type = "column";
                            }
                            var currentObj = void 0;
                            currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == seriesObject[i]; });
                            var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                            var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                            temp[i].tooltip = {
                                format: configFormat,
                                trigger: 'selection',
                                formatKey: currentObj.formatKey,
                                currenyBeforeAmount: currenyBeforeAmount,
                                headerFormat: '<span style="font-size:10px">{point.key}</span><table><br/>',
                                shared: true,
                                pointFormatter: function () {
                                    return getSeriesPointFormatter(this);
                                },
                                footerFormat: '</table>',
                            };
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
                                formatter: function () {
                                    if ((scope.showDataLabels)) {
                                        return (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey != report.resources.CommonConstants.Percent && this.series.userOptions.tooltip && this.series.userOptions.tooltip.format == "" ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "") +
                                            utilities.formatChartTooltip(this.y, configFormat) +
                                            (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey && this.series.userOptions.tooltip.format == "" && (this.series.userOptions.tooltip.formatKey == report.resources.CommonConstants.Percent || !this.series.userOptions.tooltip.currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "");
                                    }
                                }
                            };
                        };
                        for (var i = 0; i < seriesObject.length; i++) {
                            _loop_1();
                        }
                        return temp;
                    };
                    var getSeriesPointFormatter = function (thisRefSeries) {
                        var obj = "";
                        for (var i = 0; i < thisRefSeries.series.chart.series.length; i++) {
                            var histoSeriesInfo = thisRefSeries.series.chart.series;
                            obj += createSeriesPointFormatter({ series: histoSeriesInfo[i] }, histoSeriesInfo[i].data[thisRefSeries.index].y) + "<br/>";
                        }
                        return obj;
                    };
                    var createSeriesPointFormatter = function (seriesInfo, displayHighchartY) {
                        return '<table><tr><td style="padding:0">' + seriesInfo.series.name + ':</td>' +
                            (seriesInfo.series.userOptions.tooltip.formatKey != "" &&
                                seriesInfo.series.userOptions.tooltip.formatKey != null &&
                                seriesInfo.series.userOptions.tooltip.formatKey != report.resources.CommonConstants.Percent &&
                                seriesInfo.series.userOptions.tooltip && seriesInfo.series.userOptions.tooltip.format == "" ?
                                '<td><b>' + report.resources.FormatType[seriesInfo.series.userOptions.tooltip.formatKey] + '</b></td>' : "") +
                            '<td style="padding:0"><b>'
                            + utilities.formatChartTooltip(displayHighchartY, seriesInfo.series.userOptions.tooltip.format) + '</b></td></tr>' +
                            (seriesInfo.series.userOptions.tooltip.formatKey != "" &&
                                seriesInfo.series.userOptions.tooltip.formatKey != null &&
                                seriesInfo.series.userOptions.tooltip.formatKey && seriesInfo.series.userOptions.tooltip.format == ""
                                && (seriesInfo.series.userOptions.tooltip.formatKey == report.resources.CommonConstants.Percent ||
                                    !seriesInfo.series.userOptions.tooltip.currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[seriesInfo.series.userOptions.tooltip.formatKey] + '</b></td>' : "");
                    };
                    var getDataByIndex = function (i) {
                        var data = [];
                        var temp = [];
                        var seriesObject;
                        var reportObject = { configurationValue: "" };
                        seriesObject = columnObjects.length ? columnObjects : metricObjects;
                        if ((columnObjects.length > 0 && rowObjects.length == 0)) {
                            reportObject = _.find(scope.reportObjDetails.lstReportObject, { displayName: metricObjects[0] });
                        }
                        else {
                            reportObject = _.find(scope.reportObjDetails.lstReportObject, { displayName: seriesObject[i] });
                        }
                        for (var j = 0; j < currentJson.length - 1; j++) {
                            var obj = {};
                            obj["y"] = currentJson[j][metricObjects[i]];
                            data.push(obj);
                        }
                        var configVal = getWijmoConfigurationFormatCallback(reportObject.configurationValue, reportObject.filterType);
                        if ((configVal != undefined && configVal[0] == 'p') || reportObject.formatKey == report.resources.CommonConstants.Percent) {
                            angular.forEach(data, function (value, index) {
                                if (value != null) {
                                    if (value.hasOwnProperty('y')) {
                                        value.y = value.y * 100;
                                    }
                                    else {
                                        data[index] = value * 100;
                                    }
                                }
                            }, data);
                        }
                        return data;
                    };
                    var createSeriesData = function (seriesObject, i) {
                        {
                            var lstdata = [];
                            var data = [];
                            var reportObject = { configurationValue: "" };
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
                                data = lstdata;
                            }
                            else if ((columnObjects.length > 0 && rowObjects.length == 0
                                && (scope.activeChart.name == "Stacked Column Chart" || scope.activeChart.name == "Line Chart"))) {
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
                                reportObject = _.find(scope.reportObjDetails.lstReportObject, { displayName: seriesObject[i] });
                                for (var j_1 = 0; j_1 < currentJson.length - 1; j_1++) {
                                    var obj = {};
                                    if (scope.columnList.length) {
                                        obj["name"] = currentJson[currentJson.length - 1].columnObject[j_1];
                                        if (scope.activeChart.name == report.resources.ChartType.PieChart ||
                                            scope.activeChart.name == report.resources.ChartType.DonutChart)
                                            obj["color"] = getSeriesColor(obj["name"], j_1);
                                    }
                                    else {
                                        obj["name"] = currentJson[currentJson.length - 1].rowObjects[j_1];
                                        if (scope.activeChart.name == report.resources.ChartType.PieChart ||
                                            scope.activeChart.name == report.resources.ChartType.DonutChart)
                                            obj["color"] = getSeriesColor(obj["name"], j_1);
                                    }
                                    obj["y"] = currentJson[j_1][metricObjects[i]];
                                    data.push(obj);
                                }
                            }
                            if (scope.activeChart.name == report.resources.ChartType.PieChart) {
                                var totalSum_1 = 0;
                                _.each(data, function (obj) { totalSum_1 = totalSum_1 + obj.y; });
                                _.each(data, function (obj) { obj.name = obj.name + ': ' + ((obj.y / totalSum_1) * 100).toFixed(2) + '%'; });
                            }
                            var configVal = getWijmoConfigurationFormatCallback(reportObject.configurationValue, reportObject.filterType);
                            if ((configVal != undefined && configVal[0] == 'p') || reportObject.formatKey == report.resources.CommonConstants.Percent) {
                                angular.forEach(data, function (value, index) {
                                    if (value != null) {
                                        if (value.hasOwnProperty('y')) {
                                            value.y = value.y * 100;
                                        }
                                        else {
                                            data[index] = value * 100;
                                        }
                                    }
                                }, data);
                            }
                            return data;
                        }
                    };
                    var createMapSeriesData = function (attributeName) {
                        var data = [];
                        for (var j = 0; j < currentJson.length - 1; j++) {
                            var tempObject = {};
                            tempObject.name = currentJson[j][attributeName];
                            tempObject.value = currentJson[j][metricObjects[0]];
                            tempObject.colorValue = currentJson[j][metricObjects[0 + 1]];
                            // to handle data for config type PERCENT
                            var reportObject = _.find(scope.reportObjDetails.lstReportObject, { displayName: metricObjects[0] });
                            var configVal = getWijmoConfigurationFormatCallback(reportObject.configurationValue, reportObject.filterType);
                            var colorReportObject = _.find(scope.reportObjDetails.lstReportObject, { displayName: metricObjects[0 + 1] });
                            var colorConfigVal = getWijmoConfigurationFormatCallback(colorReportObject.configurationValue, colorReportObject.filterType);
                            if (configVal != undefined && configVal[0] == 'p') {
                                tempObject.value = tempObject.value * 100;
                            }
                            if (colorConfigVal != undefined && colorConfigVal[0] == 'p') {
                                tempObject.colorValue = tempObject.colorValue * 100;
                            }
                            data.push(tempObject);
                        }
                        return data;
                    };
                    var createHeatMapSeriesData = function (attributeName, columnList) {
                        if (columnList.length == 1) {
                            var columnName = scope.columnList[0].reportObjectName;
                        }
                        var reportObject = _.find(scope.reportObjDetails.lstReportObject, { displayName: metricObjects[0] });
                        var configVal = getWijmoConfigurationFormatCallback(reportObject.configurationValue, reportObject.filterType);
                        var heatMapSeriesData = [];
                        for (var j = 0; j < currentJson.length - 1; j++) {
                            var indexOfAttribute = rowObjects.indexOf(currentJson[j][attributeName]);
                            var indexOfColumnAttribute = columnObjects.indexOf(currentJson[j][columnName]);
                            var value = currentJson[j][metricObjects[0]];
                            if (value != undefined) {
                                if (configVal != undefined && configVal[0] == 'p' || reportObject.formatKey == report.resources.CommonConstants.Percent) {
                                    value = value * 100;
                                }
                                var item = [indexOfAttribute, indexOfColumnAttribute, value];
                                heatMapSeriesData.push(item);
                            }
                        }
                        return heatMapSeriesData;
                    };
                    var getChartForHistogram = function () {
                        scope.showDataLabels = scope.$parent.vm.showDataLabels;
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
                                    formatter: function () {
                                        if (typeof this.value === 'string') {
                                            return (this.value.length < report.resources.chartLabelSize) ? this.value : this.value.substring(0, report.resources.chartLabelSize - 1) + '...';
                                        }
                                        return this.value;
                                    }
                                }
                            },
                            yAxis: (function () {
                                return {
                                    max: masterJson[rowelIndex].maxYAxis.length ? masterJson[rowelIndex].maxYAxis[0] : null,
                                    min: masterJson[rowelIndex].minYAxis.length ? masterJson[rowelIndex].minYAxis[0] : null,
                                    labels: {
                                        formatter: function () {
                                            // Nine Zeroes for Billions
                                            return Math.abs(this.value) >= 1.0e+9
                                                ? utilities.globalizeNumber(Math.sign(this.value) * Math.abs(this.value) / 1.0e+9) + "B"
                                                : Math.abs(this.value) >= 1.0e+6
                                                    ? utilities.globalizeNumber(Math.sign(this.value) * Math.abs(this.value) / 1.0e+6) + "M"
                                                    : Math.abs(this.value) >= 1.0e+3
                                                        ? utilities.globalizeNumber(Math.sign(this.value) * Math.abs(this.value) / 1.0e+3) + "K"
                                                        : utilities.globalizeNumber(this.value);
                                        }
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
                            lang: {
                                decimalPoint: utilities.globalizeDecimalOptionsForChart(),
                                thousandsSep: utilities.globalizeThousandsSepOptionsForChart()
                            },
                            credits: {
                                enabled: false
                            }
                        };
                        if (!scope.renderOnPopup) {
                            scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                            legendCallback();
                            $('#histogram-chart-container').highcharts(_histogramConfig);
                        }
                        else {
                            $("#chart-container-popup").highcharts(_histogramConfig);
                        }
                    };
                    // This method is used to generate Heat-Map chart config
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
                        currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects; });
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
                                max: masterJson[rowelIndex].maxYAxis.length ? masterJson[rowelIndex].maxYAxis[0] : null,
                                min: masterJson[rowelIndex].minYAxis.length ? masterJson[rowelIndex].minYAxis[0] : null,
                                labels: {
                                    formatter: function () {
                                        // Nine Zeroes for Billions
                                        return Math.abs(this.value) >= 1.0e+9
                                            ? utilities.globalizeNumber(Math.sign(this.value) * Math.abs(this.value) / 1.0e+9) + "B"
                                            : Math.abs(this.value) >= 1.0e+6
                                                ? utilities.globalizeNumber(Math.sign(this.value) * Math.abs(this.value) / 1.0e+6) + "M"
                                                : Math.abs(this.value) >= 1.0e+3
                                                    ? utilities.globalizeNumber(Math.sign(this.value) * Math.abs(this.value) / 1.0e+3) + "K"
                                                    : utilities.globalizeNumber(this.value);
                                    }
                                },
                                stops: (scope.reportObjDetails.isRangeRedToGreenColor || scope.$parent.vm.isRangeRedToGreenColor) ? [
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
                            tooltip: {
                                headerFormat: (scope.rowList.length > 0 ? scope.rowList[rowelIndex].displayName : "") + ':',
                                format: getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType),
                                formatKey: scope.valueList[0].formatKey,
                                currenyBeforeAmount: utilities.getCurrencySymbolLocation(),
                                displayName: scope.valueList[0].displayName,
                                colordisplayName: scope.columnList[0].displayName,
                                colorFormatKey: scope.columnList[0].formatKey,
                                useHTML: true,
                                outside: true,
                                backgroundColor: "rgba(246, 246, 246, 1)",
                                style: { opacity: 1, background: "rgba(246, 246, 246, 1)" },
                                colorFormat: getWijmoConfigurationFormatCallback(scope.valueList[0].configurationValue, scope.valueList[0].filterType),
                                pointFormatter: function () {
                                    return (this.series.xAxis.categories[this.options.x] + '<br/>'
                                        + this.series.tooltipOptions.displayName + ':' + '<b>'
                                        + (this.series.tooltipOptions.formatKey != "" && this.series.tooltipOptions.formatKey != null && this.series.tooltipOptions.formatKey != report.resources.CommonConstants.Percent && this.series.tooltipOptions.currenyBeforeAmount && this.series.tooltipOptions.format == "" ? report.resources.FormatType[this.series.tooltipOptions.formatKey] : '')
                                        + utilities.formatChartTooltip(this.value, this.series.tooltipOptions.format)
                                        + (this.series.tooltipOptions.formatKey != "" && this.series.tooltipOptions.formatKey != null && this.series.tooltipOptions.format == "" && (this.series.tooltipOptions.formatKey == report.resources.CommonConstants.Percent || !this.series.tooltipOptions.currenyBeforeAmount) ? report.resources.FormatType[this.series.tooltipOptions.formatKey] : '')
                                        + '</b><br>' + this.series.tooltipOptions.colordisplayName + ':' + this.series.yAxis.categories[this.options.y]
                                        + '</b>');
                                }
                            },
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
                            lang: {
                                decimalPoint: utilities.globalizeDecimalOptionsForChart(),
                                thousandsSep: utilities.globalizeThousandsSepOptionsForChart()
                            },
                            credits: {
                                enabled: false
                            },
                            series: [{
                                borderWidth: 1,
                                events: {
                                    click: function (e) {
                                        this.update({ color: '#fe5800' }, true, false);
                                        var category = "";
                                        category = e.point.series.xAxis.categories[e.point.x];
                                        jumpToState(category);
                                        setTimeout(function () {
                                            scope.$digest();
                                        });
                                    }
                                },
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
                                    formatter: function () {
                                        if (this.point.options.value != null) {
                                            for (var i = 0; i < metricObjects.length; i++) {
                                                var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                                                var currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects[0]; });
                                                var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                                            }
                                            return (this.series.tooltipOptions.formatKey != "" && this.series.tooltipOptions.formatKey != null && this.series.tooltipOptions.formatKey != report.resources.CommonConstants.Percent && this.series.tooltipOptions.currenyBeforeAmount && this.series.tooltipOptions.format == "" ? '<td><b>' + report.resources.FormatType[this.series.tooltipOptions.formatKey] + '</b></td>' : "") +
                                                utilities.formatChartTooltip(this.point.value, configFormat) +
                                                (this.series.tooltipOptions.formatKey != "" && this.series.tooltipOptions.formatKey != null && this.series.tooltipOptions.formatKey && this.series.tooltipOptions.format == "" && (this.series.tooltipOptions.formatKey == report.resources.CommonConstants.Percent || !this.series.tooltipOptions.currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[this.series.tooltipOptions.formatKey] + '</b></td>' : "");
                                        }
                                    }
                                }
                            }]
                        };
                        if (!scope.renderOnPopup) {
                            scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                            legendCallback();
                            $('#heat-map-container').highcharts(_heatmapconfig);
                        }
                        else {
                            $("#chart-container-popup").highcharts(_heatmapconfig);
                        }
                    };

                    //this method will call in case of Column Chart, Line Chart, Pie Chart, Donut Chart
                    var getChartJson = function () {
                        scope.showDataLabels = scope.$parent.vm.showDataLabels;
                        if (scope.chartstates.length != 0)
                            rowelIndex = scope.chartstates.length - 1;
                        var x = {
                            xAxis: {
                                categories: createXAxis(),
                                crosshair: {
                                    color: "none"
                                },
                                labels: {
                                    formatter: function () {
                                        if (typeof this.value === 'string') {
                                            return (this.value.length < report.resources.chartLabelSize) ? this.value : this.value.substring(0, report.resources.chartLabelSize - 1) + '...';
                                        }
                                        return this.value;
                                    }
                                }
                            },
                            yAxis: (function () {
                                return {
                                    max: masterJson[rowelIndex].maxYAxis.length ? masterJson[rowelIndex].maxYAxis[0] : null,
                                    min: masterJson[rowelIndex].minYAxis.length ? masterJson[rowelIndex].minYAxis[0]  : null,
                                    labels: {
                                        formatter: function () {
                                            // Nine Zeroes for Billions
                                            return Math.abs(this.value) >= 1.0e+9
                                                ? utilities.globalizeNumber(Math.sign(this.value) * Math.abs(this.value) / 1.0e+9) + "B"
                                                : Math.abs(this.value) >= 1.0e+6
                                                    ? utilities.globalizeNumber(Math.sign(this.value) * Math.abs(this.value) / 1.0e+6) + "M"
                                                    : Math.abs(this.value) >= 1.0e+3
                                                        ? utilities.globalizeNumber(Math.sign(this.value) * Math.abs(this.value) / 1.0e+3) + "K"
                                                        : utilities.globalizeNumber(this.value);
                                        }
                                    }
                                };
                            }()),
                            scrollbar: { enabled: false, showFull: false },
                            title: {
                                align: 'left',
                                text: ''
                            },
                            chart: scope.activeChart.name == 'Pie Chart' || scope.activeChart.name == 'Donut Chart' ? {
                                type: 'pie',
                                zoomType: 'x',
                                allowPointSelect: true,
                                allowOverlap: true,
                                events: function () {
                                    if (scope.activeChart.name == 'Pie Chart' && !scope.renderOnPopup) {
                                        var chart_1 = this, yoyValue_1, x_1, y_1;
                                        chart_1.series[1].points.forEach(function (p, i) {
                                            if (chart_1['label' + i]) {
                                                chart_1['label' + i].destroy();
                                            }
                                            yoyValue_1 = Math.floor(((p.y - chart_1.series[0].points[i].y) / p.y) * 100);
                                            x_1 = p.dataLabel.translateX - (p.shapeArgs.end == 0 ? -40 : 30);
                                            y_1 = p.dataLabel.translateY;
                                            chart_1['label' + i] = chart_1.renderer.text(yoyValue_1 + '%', x_1, y_1).attr({
                                                zIndex: 100,
                                            }).css({
                                                fontWeight: 'bold',
                                                color: 'white',
                                                textOutline: '1px contrast'
                                            }).add();
                                        });
                                    }
                                }
                            } :
                                {
                                    type: 'spline',
                                    zoomType: 'xy',
                                    credits: {
                                        enabled: false
                                    }

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
                                labelFormatter: scope.activeChart.name == 'Pie Chart' ? function () {
                                    return this.name.slice(0, this.name.lastIndexOf(":"));
                                } : function () { return this.name; }
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
                                        style: {
                                            fontWeight: 'normal',
                                            textShadow: 'none',
                                            fontSize: scope.selectedFontSize + "px"
                                        },
                                    }
                                },
                                pie: getPieChartPlotOptions()
                            },
                            exporting: {
                                allowHTML: true,
                                enabled: false,
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
                            lang: {
                                decimalPoint: utilities.globalizeDecimalOptionsForChart(),
                                thousandsSep: utilities.globalizeThousandsSepOptionsForChart()
                            },
                            subtitle: {
                                text: (function () {
                                    var data = "";
                                    if (scope.activeChart.name == "Pie Chart" || scope.activeChart.name == "Donut Chart") {
                                        data = "";
                                    }
                                    else {
                                        if (scope.activeChart.name == "Line Chart") {
                                            if (scope.rowList && scope.rowList.length > 0)
                                                data = showMessage(scope.rowList[0]);
                                            if (data && (scope.columnList && scope.columnList.length > 0))
                                                data = showMessage(scope.columnList[0]);
                                        }
                                        else
                                            data = scope.valueList[0].displayName;
                                    }
                                    //var data = 'Currently Viewing : ';
                                    //angular.forEach(scope.chartstates, function (value, key) { data += value.itemName + ' > '; });
                                    return data;
                                }()),
                                align: 'left'
                            },
                            init: false,
                            series: (function () {
                                if (scope.activeChart.name == 'Pie Chart') {
                                    var innerSizeForPie = ['80%', '75%', '70%', '65%'];
                                    var sizeForPie = ['100%', '80%', '60%', '40%'];
                                }
                                var temp = [];
                                var seriesObject;
                                if ((columnObjects.length > 0 && rowObjects.length == 0
                                    && (scope.activeChart.name == "Stacked Column Chart" || scope.activeChart.name == "Line Chart"))) {
                                    seriesObject = columnObjects;
                                }
                                else if (rowObjects.length != 0)
                                    seriesObject = columnObjects.length ? columnObjects : metricObjects;
                                else if (rowObjects.length == 0)
                                    seriesObject = metricObjects;
                                var currentObj;
                                var _loop_2 = function () {
                                    if ((columnObjects.length > 0 && rowObjects.length == 0
                                        && (scope.activeChart.name == "Stacked Column Chart" || scope.activeChart.name == "Line Chart"))
                                        || scope.valueList.length == 1)
                                        currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects; });
                                    else
                                        currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == seriesObject[i]; });
                                    temp[i] = {};
                                    var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                                    var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                                    temp[i].tooltip = {
                                        headerFormat: '<span style="font-size:10px">' + (scope.columnList.length > 0 ? scope.columnList[0].reportObjectName + '<br/>' : "") + '<span style="font-size:10px">{point.key}<br/></span></span>',
                                        footerFormat: '</table>',
                                        shared: true,
                                        useHTML: true,
                                        format: configFormat,
                                        formatKey: currentObj.formatKey,
                                        currenyBeforeAmount: currenyBeforeAmount,
                                        pointFormatter: function () {
                                            return '<table><tr><td style="padding:0">' + this.series.name + ':</td>' +
                                                (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey != report.resources.CommonConstants.Percent && this.series.userOptions.tooltip && this.series.userOptions.tooltip.format == "" ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "") +
                                                '<td style="padding:0"><b>' + utilities.formatChartTooltip(this.y, this.series.userOptions.tooltip.format) + '</b></td></tr>' +
                                                (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey && this.series.userOptions.tooltip.format == "" && (this.series.userOptions.tooltip.formatKey == report.resources.CommonConstants.Percent || !this.series.userOptions.tooltip.currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "");
                                        }
                                    };
                                    temp[i].cursor = 'pointer';
                                    temp[i].type = chartType;
                                    if ((scope.activeChart.name == 'Line Chart') || (scope.activeChart.name == 'Column Chart')) {
                                        temp[i].dataLabels = {
                                            enabled: !scope.renderOnPopup ? scope.showDataLabels : false,
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
                                            formatter: function () {
                                                if ((scope.showDataLabels) && !scope.renderOnPopup) {
                                                    return (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey != report.resources.CommonConstants.Percent && this.series.userOptions.tooltip && this.series.userOptions.tooltip.format == "" ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "") +
                                                        utilities.formatChartTooltip(this.y, configFormat) +
                                                        (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey && this.series.userOptions.tooltip.format == "" && (this.series.userOptions.tooltip.formatKey == report.resources.CommonConstants.Percent || !this.series.userOptions.tooltip.currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "");
                                                }
                                            }
                                        };
                                    }
                                    else {
                                        temp[i].dataLabels = {
                                            enabled: true,
                                            distance: scope.activeChart.name == 'Pie Chart' ? getDistanceForPieChart(scope.valueList)[i] : 30,
                                            allowOverlap: true,
                                            crop: false,
                                            overflow: 'none',
                                            useHTML: true,
                                            formatter: function () {
                                                return scope.showDataLabels ? (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey != report.resources.CommonConstants.Percent && this.series.userOptions.tooltip && this.series.userOptions.tooltip.format == "" ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "") +
                                                    utilities.formatChartTooltip(this.y, configFormat) + (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey && this.series.userOptions.tooltip.format == "" && (this.series.userOptions.tooltip.formatKey == report.resources.CommonConstants.Percent || !this.series.userOptions.tooltip.currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "")
                                                    : (scope.activeChart.name == 'Donut Chart' ? this.percentage.toFixed(2) + "%" : this.key.substring(this.key.indexOf(":") + 1));
                                            }
                                        };
                                    }
                                    if (scope.activeChart.name == "Donut Chart") {
                                        temp[i].innerSize = '50%';
                                    }
                                    if (chartType == 'stColumn') {
                                        temp[i].type = "column";
                                        temp[i].stacking = 'normal';
                                    }
                                    if (chartType == "multi") {
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
                                    if (scope.activeChart.name != 'Pie Chart' && scope.activeChart.name != 'Donut Chart')
                                        temp[i].color = getSeriesColor(seriesObject[i], i);
                                    temp[i].data = createSeriesData(seriesObject, i);
                                    if (scope.activeChart.name == 'Pie Chart' || scope.activeChart.name == 'Donut Chart') {
                                        temp[0].showInLegend = true;
                                        if ((scope.rowList.length >= 1 && (scope.valueList.length > 1))) {
                                            temp[i].innerSize = innerSizeForPie[i];
                                            temp[i].size = sizeForPie[i];
                                        }
                                    }
                                    if (!scope.renderOnPopup) {
                                        temp[i].events = {
                                            click: function (e) {
                                                var category = "";
                                                if (scope.activeChart.name == "Pie Chart" || scope.activeChart.name == "Donut Chart") {
                                                    category = e.point.name.split(':')[0];
                                                }
                                                else {
                                                    category = e.point.category;
                                                }
                                                jumpToState(category);
                                                setTimeout(function () {
                                                    scope.$digest();
                                                });
                                            }
                                        };
                                    }
                                };
                                for (var i = 0; i < seriesObject.length; i++) {
                                    _loop_2();
                                }
                                return temp;
                            }())
                        }; //Modified By: Sumit Kumar, ModifiedDate: 03/06/2020, Modified Reason: CLI-151471 and Display Lengend full text value dynamically control by highchart only.
                        legendCallback();
                        if (!scope.renderOnPopup) {
                            scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                            $('#column-chart-container').highcharts(x);
                        }
                        else {
                            $("#chart-container-popup").highcharts(x);
                        }
                    }
                    //var getChartJson = function () {
                    //    scope.showDataLabels = scope.$parent.vm.showDataLabels;
                    //    if (scope.chartstates.length != 0)
                    //        rowelIndex = scope.chartstates.length - 1;
                    //    var x = {
                    //        xAxis: {
                    //            categories: createXAxis(),
                    //            crosshair: {
                    //                color: "none"
                    //            },
                    //            scrollbar: { enabled: ((scope.activeChart.name == "Pie Chart" || scope.activeChart.name == "Donut Chart") ? false : true), showFull: false },
                    //            labels: {
                    //                formatter: function () {
                    //                    if (typeof this.value === 'string') {
                    //                        return (this.value.length < report.resources.chartLabelSize) ? this.value : this.value.substring(0, report.resources.chartLabelSize - 1) + '...';
                    //                    }
                    //                    return this.value;
                    //                }
                    //            }
                    //        },
                    //        yAxis: (function () {
                    //            return {
                    //                max: masterJson[rowelIndex].maxYAxis.length ? masterJson[rowelIndex].maxYAxis[0] : null,
                    //                min: masterJson[rowelIndex].minYAxis.length ? (masterJson[rowelIndex].minYAxis[0] < 0 ? masterJson[rowelIndex].minYAxis[0] : 0) : null,
                    //                labels: {
                    //                    formatter: function () {
                    //                        // Nine Zeroes for Billions
                    //                        return Math.abs(this.value) >= 1.0e+9
                    //                            ? utilities.globalizeNumber(Math.sign(this.value) * Math.abs(this.value) / 1.0e+9) + "B"
                    //                            : Math.abs(this.value) >= 1.0e+6
                    //                                ? utilities.globalizeNumber(Math.sign(this.value) * Math.abs(this.value) / 1.0e+6) + "M"
                    //                                : Math.abs(this.value) >= 1.0e+3
                    //                                    ? utilities.globalizeNumber(Math.sign(this.value) * Math.abs(this.value) / 1.0e+3) + "K"
                    //                                    : utilities.globalizeNumber(this.value);
                    //                    }
                    //                }
                    //            };
                    //        }()),
                    //        scrollbar: { enabled: ((scope.activeChart.name == "Pie Chart" || scope.activeChart.name == "Donut Chart") ? false : true), showFull: false },
                    //        title: {
                    //            align: 'left',
                    //            text: ''
                    //        },
                    //        chart: {
                    //            type: 'pie',
                    //            zoomType: 'x',
                    //            allowPointSelect: true,
                    //            allowOverlap: true,
                    //            events: function () {
                    //                if (scope.activeChart.name == 'Pie Chart' && !scope.renderOnPopup) {
                    //                    var chart_1 = this, yoyValue_1, x_1, y_1;
                    //                    chart_1.series[1].points.forEach(function (p, i) {
                    //                        if (chart_1['label' + i]) {
                    //                            chart_1['label' + i].destroy();
                    //                        }
                    //                        yoyValue_1 = Math.floor(((p.y - chart_1.series[0].points[i].y) / p.y) * 100);
                    //                        x_1 = p.dataLabel.translateX - (p.shapeArgs.end == 0 ? -40 : 30);
                    //                        y_1 = p.dataLabel.translateY;
                    //                        chart_1['label' + i] = chart_1.renderer.text(yoyValue_1 + '%', x_1, y_1).attr({
                    //                            zIndex: 100,
                    //                        }).css({
                    //                            fontWeight: 'bold',
                    //                            color: 'white',
                    //                            textOutline: '1px contrast'
                    //                        }).add();
                    //                    });
                    //                }
                    //            }
                    //        },
                    //        initChart: false,
                    //        subtitle: {
                    //            text: (function () {
                    //                var data = "";
                    //                if (scope.activeChart.name == "Pie Chart" || scope.activeChart.name == "Donut Chart") {
                    //                    data = "";
                    //                }
                    //                else {
                    //                    if (scope.activeChart.name == "Line Chart") {
                    //                        if (scope.rowList && scope.rowList.length > 0)
                    //                            data = showMessage(scope.rowList[0]);
                    //                        if (data && (scope.columnList && scope.columnList.length > 0))
                    //                            data = showMessage(scope.columnList[0]);
                    //                    }
                    //                    else 
                    //                        data = scope.valueList[0].displayName;
                    //                }
                    //                //var data = 'Currently Viewing : ';
                    //                //angular.forEach(scope.chartstates, function (value, key) { data += value.itemName + ' > '; });
                    //                return data;
                    //            }()),
                    //            align: 'left'
                    //        },
                    //        init: false,
                    //        series: (function () {
                    //            if (scope.activeChart.name == 'Pie Chart') {
                    //                var innerSizeForPie = ['80%', '75%', '70%', '65%'];
                    //                var sizeForPie = ['100%', '80%', '60%', '40%'];
                    //            }
                    //            var temp = [];
                    //            var seriesObject;
                    //            if ((columnObjects.length > 0 && rowObjects.length == 0
                    //                && (scope.activeChart.name == "Stacked Column Chart" || scope.activeChart.name == "Line Chart"))
                    //            ) {
                    //                seriesObject = columnObjects;
                    //            }
                    //            else if (rowObjects.length != 0)
                    //                seriesObject = columnObjects.length ? columnObjects : metricObjects;
                    //            else if (rowObjects.length == 0)
                    //                seriesObject = metricObjects;
                    //           var currentObj;
                    //             var _loop_2 = function () {
                    //                if ((columnObjects.length > 0 && rowObjects.length == 0
                    //                    && (scope.activeChart.name == "Stacked Column Chart" || scope.activeChart.name == "Line Chart"))
                    //                    || scope.valueList.length == 1)
                    //                    currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects; });
                    //                else
                    //                    currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == seriesObject[i]; });
                    //                temp[i] = {};
                    //                var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                    //                var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                    //                temp[i].tooltip = {
                    //                    headerFormat: '<span style="font-size:10px">' + (scope.columnList.length > 0 ? scope.columnList[0].reportObjectName + '<br/>' : "") + '<span style="font-size:10px">{point.key}<br/></span></span>',
                    //                    footerFormat: '</table>',
                    //                    shared: true,
                    //                    useHTML: true,
                    //                    format: configFormat,
                    //                    formatKey: currentObj.formatKey,
                    //                    currenyBeforeAmount: currenyBeforeAmount,
                    //                    pointFormatter: function () {
                    //                        return '<table><tr><td style="padding:0">' + this.series.name + ':</td>' +
                    //                            (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey != report.resources.CommonConstants.Percent && this.series.userOptions.tooltip && this.series.userOptions.tooltip.format == "" ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "") +
                    //                            '<td style="padding:0"><b>' + utilities.formatChartTooltip(this.y, this.series.userOptions.tooltip.format) + '</b></td></tr>' +
                    //                            (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey && this.series.userOptions.tooltip.format == "" && (this.series.userOptions.tooltip.formatKey == report.resources.CommonConstants.Percent || !this.series.userOptions.tooltip.currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "");
                    //                    }
                    //                };
                    //                temp[i].cursor = 'pointer';
                    //                temp[i].type = chartType;
                    //                if ((scope.activeChart.name == 'Line Chart') || (scope.activeChart.name == 'Column Chart')) {
                    //                    temp[i].dataLabels = {
                    //                        enabled: !scope.renderOnPopup ? scope.showDataLabels : false,
                    //                        allowOverlap: true,
                    //                        crop: false,
                    //                        overflow: 'none',
                    //                        useHTML: true,
                    //                        color: '#000000',
                    //                        states: {
                    //                            inactive: {
                    //                                opacity: 1
                    //                            }
                    //                        },
                    //                        formatter: function () {
                    //                            if ((scope.showDataLabels) && !scope.renderOnPopup) {
                    //                                return (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey != report.resources.CommonConstants.Percent && this.series.userOptions.tooltip && this.series.userOptions.tooltip.format == "" ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "") +
                    //                                    utilities.formatChartTooltip(this.y, configFormat) +
                    //                                    (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey && this.series.userOptions.tooltip.format == "" && (this.series.userOptions.tooltip.formatKey == report.resources.CommonConstants.Percent || !this.series.userOptions.tooltip.currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "");
                    //                            }
                    //                        }
                    //                    }
                    //                }
                    //                else {
                    //                    temp[i].dataLabels = {
                    //                        enabled: true,
                    //                        distance: scope.activeChart.name == 'Pie Chart' ? getDistanceForPieChart(scope.valueList)[i] : 30,
                    //                        allowOverlap: true,
                    //                        crop: false,
                    //                        overflow: 'none',
                    //                        useHTML: true,
                    //                        formatter: function () {
                    //                            return scope.showDataLabels ? (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey != report.resources.CommonConstants.Percent && this.series.userOptions.tooltip && this.series.userOptions.tooltip.format == "" ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "") +
                    //                                utilities.formatChartTooltip(this.y, configFormat) + (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey && this.series.userOptions.tooltip.format == "" && (this.series.userOptions.tooltip.formatKey == report.resources.CommonConstants.Percent || !this.series.userOptions.tooltip.currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "")
                    //                                : (scope.activeChart.name == 'Donut Chart' ? this.key + " : " + this.percentage.toFixed(2) + "%" : this.key.substring(this.key.indexOf(":") + 1));
                    //                        }
                    //                    }
                    //                }
                    //                if (scope.activeChart.name == "Donut Chart") {
                    //                    temp[i].innerSize = '50%';
                    //                }
                    //                if (chartType == 'stColumn') {
                    //                    temp[i].type = "column";
                    //                    temp[i].stacking = 'normal';
                    //                }
                    //                if (chartType == "multi") {
                    //                    if (i < metricObjects.length) {
                    //                        temp[i].yAxis = i;
                    //                    }
                    //                    temp[i].type = "column";
                    //                    if (i > 0) {
                    //                        temp[i].type = "spline";
                    //                        temp[i].dashStyle = i > 1 ? 'shortdot' : "";
                    //                    }
                    //                }
                    //                temp[i].name = seriesObject[i];
                    //                if (scope.activeChart.name != 'Pie Chart' && scope.activeChart.name != 'Donut Chart')
                    //                    temp[i].color = getSeriesColor(seriesObject[i], i);
                    //                temp[i].data = createSeriesData(seriesObject, i);
                    //                if (scope.activeChart.name == 'Pie Chart') {
                    //                    temp[0].showInLegend = true;
                    //                    if ((scope.rowList.length >= 1 && (scope.valueList.length > 1))) {
                    //                        temp[i].innerSize = innerSizeForPie[i];
                    //                        temp[i].size = sizeForPie[i];
                    //                    }
                    //                }
                    //                if (!scope.renderOnPopup) {
                    //                    temp[i].events = {
                    //                        click: function (e) {
                    //                            var category = "";
                    //                            if (scope.activeChart.name == "Pie Chart" || scope.activeChart.name == "Donut Chart") {
                    //                                category = e.point.name.split(':')[0];
                    //                            }
                    //                            else {
                    //                                category = e.point.category;
                    //                            }
                    //                            jumpToState(category);
                    //                            setTimeout(function () {
                    //                                scope.$digest();
                    //                            });
                    //                        }
                    //                    }
                    //                }
                    //            }
                    //            return temp;
                    //        }())
                    //    }; //Modified By: Sumit Kumar, ModifiedDate: 03/06/2020, Modified Reason: CLI-151471 and Display Lengend full text value dynamically control by highchart only.
                    //    Highcharts.setOptions({
                    //        legend: {
                    //            //align: 'center',
                    //            //maxHeight: 40,
                    //            //verticalAlign: 'bottom',
                    //            //x: 0,
                    //            //y: 23,
                    //            //itemWidth: 140,
                    //            //layout: 'horizontal',
                    //            itemDistance: 8,
                    //            maxHeight: 40,
                    //            layout: 'horizontal',
                    //            alignColumns: false,
                    //            navigation: {
                    //                activeColor: '#3E576F',
                    //                animation: true,
                    //                arrowSize: 12,
                    //                inactiveColor: '#CCC',
                    //                style: {
                    //                    fontWeight: 'bold',
                    //                    color: '#333',
                    //                    fontSize: '12px'
                    //                }
                    //            },
                    //            labelFormatter: scope.activeChart.name == 'Pie Chart' ? function () {
                    //                return this.name.slice(0, this.name.lastIndexOf(":"));
                    //            } : function () { return this.name; }                                    
                    //        },
                    //        credits: {
                    //            enabled: false
                    //        },
                    //        chart: {
                    //            type: 'spline',
                    //            zoomType: 'xy',
                    //            credits: {
                    //                enabled: false
                    //            }
                    //        },
                    //        plotOptions: {
                    //            series: {
                    //                states: {
                    //                    inactive: {
                    //                        opacity: 1
                    //                    }
                    //                },
                    //                dataLabels:
                    //                {
                    //                    enabled: scope.showDataLabels,
                    //                    style: {
                    //                        fontWeight: 'normal',
                    //                        textShadow: 'none',
                    //                        fontSize: scope.selectedFontSize + "px"
                    //                    },
                    //                }
                    //            },
                    //            pie: getPieChartPlotOptions()
                    //        },
                    //        exporting: {
                    //            enabled: false,
                    //            chartOptions: {
                    //                title: {
                    //                    text: createGraphTitle(rowelIndex)
                    //                },
                    //                legend: {
                    //                    alignColumns: true
                    //                }
                    //            }
                    //        },
                    //        lang: {
                    //            decimalPoint: utilities.globalizeDecimalOptionsForChart(),
                    //            thousandsSep: utilities.globalizeThousandsSepOptionsForChart()
                    //        }
                    //    });
                    //    legendCallback();
                    //    if (!scope.renderOnPopup) {
                    //        scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                    //        return x;
                    //    }
                    //    else {
                    //        x.xAxis.scrollbar.enabled = false;
                    //        x.scrollbar.enabled = false;
                    //        $("#chart-container-popup").highcharts(x);
                    //    }
                    //};
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
                    //#region colorpalet 
                    var setDefaultColorsForChart = function () {
                        //Fetch default color set for the selected chart
                        var defaultColorSetForAllCharts = SharedService.defaultColourSet;
                        if (defaultColorSetForAllCharts != undefined && defaultColorSetForAllCharts.length > 0) {
                            var chartColorSet = _.find(defaultColorSetForAllCharts, function (element) { return element.ChartName == scope.activeChart.name; });
                            if (chartColorSet != undefined && chartColorSet != '')
                                colorset = angular.fromJson(chartColorSet.DefaultColorSet);
                        }
                    }
                    var createLegendList = function () {
                        var legendType;
                        //Row legend
                        if (scope.activeChart.name == "Pie Chart" || scope.activeChart.name == "Donut Chart") {
                            legendType = "row";
                            //remove the unwanted legends
                            if (scope.modifiedReportColors.length > 0) {
                                for (var i = scope.modifiedReportColors.length - 1; i >= 0; i--) {
                                    if (!scope.rowList.some(function (ro) { return ro.reportObjectId == scope.modifiedReportColors[i].reportObjectId; })) {
                                        //if(scope.modifiedReportColors[i].reportObjectId!=scope.rowList[rowelIndex].reportObjectId){
                                        scope.modifiedReportColors.splice(i, 1);
                                    }
                                }
                            }
                            rowObjects.forEach(function (rowValue, index) {
                                var appliedColor = '';
                                if (scope.originalReportColors.some(function (reportObj) { return reportObj.reportObjectId == scope.rowList[rowelIndex].reportObjectId && reportObj.legendName == rowValue; })) {
                                    appliedColor = _.find(scope.originalReportColors, function (reportObj) { return reportObj.reportObjectId == scope.rowList[rowelIndex].reportObjectId && reportObj.legendName == rowValue; }).appliedColor;
                                }
                                if (scope.modifiedReportColors.some(function (modifiedReportObject) { return modifiedReportObject.reportObjectId == scope.rowList[rowelIndex].reportObjectId && modifiedReportObject.legendName == rowValue; })) {
                                    var modifiedRO = _.find(scope.modifiedReportColors, function (reportObject) { return reportObject.reportObjectId == scope.rowList[rowelIndex].reportObjectId && reportObject.legendName == rowValue; });
                                    modifiedRO.defaultColor = colorset[index];
                                }
                                else {
                                    scope.modifiedReportColors.push({ 'legendName': rowValue, 'reportObjectId': scope.rowList[rowelIndex].reportObjectId, 'defaultColor': colorset[index], 'appliedColor': appliedColor });
                                }
                            });
                        }
                        else if (scope.activeChart.name == "Pareto Chart") {
                            var appliedColor = '';
                            if (scope.modifiedReportColors.length > 0) {
                                for (var i = scope.modifiedReportColors.length - 1; i >= 0; i--) {
                                    if (!scope.valueList.some(function (value) { return value.reportObjectId == scope.modifiedReportColors[i].reportObjectId; })) {
                                        if (scope.activeChart.name != "Pareto Chart" && scope.modifiedReportColors[i].legendName != "Cumulative Percentage")
                                            scope.modifiedReportColors.splice(i, 1);
                                    }
                                }
                            }
                            if (scope.originalReportColors.some(function (reportObj) { return reportObj.reportObjectId == '0' && reportObj.legendName == "Cumulative Percentage"; })) {
                                appliedColor = _.find(scope.originalReportColors, function (reportObj) { return reportObj.reportObjectId == '0' && reportObj.legendName == "Cumulative Percentage"; }).appliedColor;
                            }
                            if (scope.modifiedReportColors.some(function (ro) { return ro.legendName == "Cumulative Percentage"; })) {
                                var modifiedRO = _.find(scope.modifiedReportColors, function (reportObject) { return reportObject.reportObjectId == '0' && reportObject.legendName == "Cumulative Percentage"; });
                                modifiedRO.defaultColor = colorset[0];
                            }
                            else
                                scope.modifiedReportColors.push({ 'legendName': 'Cumulative Percentage', 'reportObjectId': '0', 'defaultColor': colorset[0], 'appliedColor': appliedColor });
                            appliedColor = '';
                            if (scope.originalReportColors.some(function (reportObj) { return reportObj.reportObjectId == scope.valueList[0].reportObjectId && reportObj.legendName == scope.valueList[0].displayName; })) {
                                appliedColor = _.find(scope.originalReportColors, function (reportObj) { return reportObj.reportObjectId == scope.valueList[0].reportObjectId && reportObj.legendName == scope.valueList[0].displayName; }).appliedColor;
                            }
                            if (scope.modifiedReportColors.some(function (ro) { return ro.reportObjectId == scope.valueList[0].reportObjectId; })) {
                                var modifiedRO = _.find(scope.modifiedReportColors, function (reportObject) { return reportObject.reportObjectId == scope.valueList[0].reportObjectId && reportObject.legendName == scope.valueList[0].displayName; });
                                modifiedRO.defaultColor = colorset[1];
                            }
                            else
                                scope.modifiedReportColors.push({ 'legendName': scope.valueList[0].displayName, 'reportObjectId': scope.valueList[0].reportObjectId, 'defaultColor': colorset[1], 'appliedColor': appliedColor });
                        }
                        //Column legend
                        else if ((scope.columnList.length > 0 && scope.valueList.length > 0 && scope.rowList.length > 0) || (scope.activeChart.name == "Bubble Chart")) {
                            legendType = "column";
                            //remove the unwanted legends
                            if (scope.modifiedReportColors.length > 0) {
                                for (var i = scope.modifiedReportColors.length - 1; i >= 0; i--) {
                                    if (scope.modifiedReportColors[i].reportObjectId != scope.columnList[0].reportObjectId) {
                                        scope.modifiedReportColors.splice(i, 1);
                                    }
                                }
                            }
                            columnObjects.forEach(function (colValue, index) {
                                var appliedColor = '';
                                if (scope.originalReportColors.some(function (reportObj) { return reportObj.reportObjectId == scope.columnList[0].reportObjectId && reportObj.legendName == colValue; })) {
                                    appliedColor = _.find(scope.originalReportColors, function (reportObj) { return reportObj.reportObjectId == scope.columnList[0].reportObjectId && reportObj.legendName == colValue; }).appliedColor;
                                }
                                if (scope.modifiedReportColors.some(function (modifiedReportObject) { return modifiedReportObject.reportObjectId == scope.columnList[0].reportObjectId && modifiedReportObject.legendName == colValue; })) {
                                    var modifiedRO = _.find(scope.modifiedReportColors, function (reportObject) { return reportObject.reportObjectId == scope.columnList[0].reportObjectId && reportObject.legendName == colValue; });
                                    modifiedRO.defaultColor = colorset[index];
                                }
                                else {
                                    scope.modifiedReportColors.push({ 'legendName': colValue, 'reportObjectId': scope.columnList[0].reportObjectId, 'defaultColor': colorset[index], 'appliedColor': appliedColor });
                                }
                            });
                        }
                        //Value legend
                        else if (scope.valueList.length > 0 && (scope.columnList.length == 0 || scope.rowList.length == 0)) {
                            legendType = "value";
                            //remove the unwanted legends
                            if (scope.modifiedReportColors.length > 0) {
                                for (var i = scope.modifiedReportColors.length - 1; i >= 0; i--) {
                                    if (!scope.valueList.some(function (value) { return value.reportObjectId == scope.modifiedReportColors[i].reportObjectId; })) {
                                        if (scope.activeChart.name != "Pareto Chart" && scope.modifiedReportColors[i].legendName != "Cumulative Percentage")
                                            scope.modifiedReportColors.splice(i, 1);
                                    }
                                }
                            }
                            scope.valueList.forEach(function (value, index) {
                                var appliedColor = '';
                                if (scope.originalReportColors.some(function (reportObj) { return reportObj.reportObjectId == value.reportObjectId && reportObj.legendName == value.displayName; })) {
                                    appliedColor = _.find(scope.originalReportColors, function (reportObj) { return reportObj.reportObjectId == value.reportObjectId && reportObj.legendName == value.displayName; }).appliedColor;
                                }
                                if (scope.modifiedReportColors.some(function (modifiedReportObject) { return modifiedReportObject.reportObjectId == value.reportObjectId; })) {
                                    var modifiedRO = _.find(scope.modifiedReportColors, function (reportObject) { return reportObject.reportObjectId == value.reportObjectId; });
                                    modifiedRO.defaultColor = colorset[index];
                                }
                                else {
                                    scope.modifiedReportColors.push({ 'legendName': value.displayName, 'reportObjectId': value.reportObjectId, 'defaultColor': colorset[index], 'appliedColor': appliedColor });
                                }
                            });
                        }
                    };
                    var getSeriesColor = function (legendName, legendIndex) {
                        var legendColor;
                        var reportObjectId;
                        reportObjectId = getLegendReportObjectId(legendIndex);
                        if (_.find(scope.modifiedReportColors, { 'legendName': legendName, 'reportObjectId': reportObjectId }) != undefined) {
                            legendColor = _.find(scope.modifiedReportColors, { 'legendName': legendName, 'reportObjectId': reportObjectId }).appliedColor;
                            if (legendColor != undefined && legendColor != "")
                                return legendColor;
                        }
                        if (_.find(scope.originalReportColors, { 'legendName': legendName, 'reportObjectId': reportObjectId })) {
                            legendColor = _.find(scope.originalReportColors, { 'legendName': legendName, 'reportObjectId': reportObjectId }).appliedColor;
                            if (legendColor != undefined && legendColor != "")
                                return legendColor;
                        }
                        if (scope.activeChart.name == "Waterfall Chart" && scope.columnList.length == 0)
                            return "#4caf50";
                        return colorset[legendIndex];
                    };
                    var getLegendReportObjectId = function (legendIndex) {
                        if (scope.activeChart.name == "Pie Chart" ||
                            scope.activeChart.name == "Donut Chart")
                            return scope.rowList[rowelIndex].reportObjectId;
                        else if (scope.activeChart.name == 'Pareto Chart' && legendIndex == 0)
                            return '0';
                        else if (scope.activeChart.name == 'Pareto Chart' && legendIndex == 1)
                            return scope.valueList[0].reportObjectId;
                        else if ((scope.columnList.length > 0 &&
                            scope.rowList.length > 0) || scope.activeChart.name == "Bubble Chart")
                            return scope.columnList[0].reportObjectId;
                        else if ((scope.columnList.length == 0 ||
                            scope.rowList.length == 0) && legendIndex < scope.valueList.length)
                            return scope.valueList[legendIndex].reportObjectId;
                    };
                    if (navigator.userAgent.indexOf("MSIE ") > -1 || navigator.userAgent.indexOf("Trident/") > -1) {
                        scope.isIEBrowser = true;
                    }
                    else {
                        scope.isIEBrowser = false;
                    }
                    //triggerColorPicker1
                    scope.CPColorPickerOnChange = function (legend) {
                        $(".evo-pointer, .evo-colorind").attr('style', '');
                        var series;
                        var chartConfig = $("#chart-container-popup").highcharts();
                        //For pie chart/donut chart the color of the data points need to be updated
                        if (scope.activeChart.name == "Pie Chart" ||
                            scope.activeChart.name == "Donut Chart") {
                            $("#chart-container-popup").highcharts().series.forEach(function (pieSeries) {
                                var dataPoint = _.find(pieSeries.data, function (p) {
                                    return p.name.split(':')[0] == legend.name;
                                });
                                dataPoint.color = legend.modifiedColor;
                                dataPoint.update();
                            });
                        }
                        else if (scope.activeChart.name == "Multiple Axis Chart" && scope.columnList.length > 0) {
                            series = $("#chart-container-popup").highcharts().series.filter(function (p) {
                                return p.name.split('-')[0] == legend.name;
                            });
                            series.forEach(function (ser) {
                                ser.userOptions.color = legend.modifiedColor;
                                ser.update();
                            });
                        }
                        else {
                            series = _.find($("#chart-container-popup").highcharts().series, function (p) {
                                return p.name == legend.name;
                            });
                            //For histogram set opacity of the color as the series is transparent
                            if (scope.activeChart.name == 'Histogram Chart') {
                                var opacity = utilities.getHistogramChartSeriesOpacityByIndex(series.index);
                                legend.modifiedColor = utilities.hexToRgbA(legend.modifiedColor, opacity);
                                series.userOptions.color = legend.modifiedColor;
                            }
                            else
                                series.userOptions.color = legend.modifiedColor;
                            //For waterfall chart upColor also needs to be updated
                            if (scope.activeChart.name == "Waterfall Chart") {
                                series.userOptions.upColor = legend.modifiedColor;
                            }
                            series.update();
                            //For multiaxis chart yAxis color also needs to be updated
                            if (scope.activeChart.name == "Multiple Axis Chart" && scope.columnList.length == 0) {
                                series.yAxis.userOptions.labels.style.color = legend.modifiedColor;
                                series.yAxis.userOptions.title.style.color = legend.modifiedColor;
                                series.yAxis.update();
                            }
                        }
                    };
                    scope.openCustomizeDataColorPopUp = function () {
                        $(".evo-pointer, .evo-colorind").attr('style', '');
                        var _this = this;
                        scope.popupCustomizeDataColor = true;
                        setTimeout(function () {
                            $(".colorPalletWrapper").click(function (event) {
                                if ($(event.target).hasClass('colorPalletWrapper')) {
                                    $(event.target).find('.colorPicker')[0].click();
                                }
                                else {
                                    $(event.target).parents('.colorPalletWrapper').find('.colorPicker')[0].click();
                                }
                            });
                        });
                        scope.popupLegendList = [];
                        CreateChartOnPopup();
                        var popupChartConfig = $("#chart-container-popup").highcharts();
                        //Fill legend list to display on left panel
                        if (scope.activeChart.name === "Stacked Column Chart" ||
                            scope.activeChart.name == "Column Chart" ||
                            scope.activeChart.name == "Line Chart" ||
                            (scope.activeChart.name == "Multiple Axis Chart" && scope.columnList.length == 0) ||
                            scope.activeChart.name == "Pareto Chart" ||
                            scope.activeChart.name == "Bar Chart" ||
                            scope.activeChart.name == "100% Stacked Column Chart" ||
                            scope.activeChart.name == "Stacked Bar Chart" ||
                            scope.activeChart.name == "100% Stacked Bar Chart" ||
                            scope.activeChart.name == "Column & Line Combination Chart" ||
                            scope.activeChart.name == "Bar & Line Combination Chart" ||
                            scope.activeChart.name == "Bubble Chart" ||
                            scope.activeChart.name == "Waterfall Chart" ||
                            scope.activeChart.name == "Histogram Chart") {
                            for (var i = 0; i < popupChartConfig.series.length; i++) {
                                scope.popupLegendList.push({
                                    'initialColor': popupChartConfig.series[i].color != undefined ? popupChartConfig.series[i].color : $("#chart-container-popup").highcharts().series[i].color,
                                    'defaultColor': colorset[i],
                                    'modifiedColor': popupChartConfig.series[i].color != undefined ? popupChartConfig.series[i].color : $("#chart-container-popup").highcharts().series[i].color,
                                    'name': $('#chart-container-popup').highcharts().series[i].name
                                });
                            }
                        }
                        else if (scope.activeChart.name == "Multiple Axis Chart" && scope.columnList.length > 0) {
                            for (var i = 0; i < columnObjects.length; i++) {
                                scope.popupLegendList.push({
                                    'initialColor': popupChartConfig.series[i].color != undefined ? popupChartConfig.series[i].color : $("#chart-container-popup").highcharts().series[i].color,
                                    'defaultColor': colorset[i],
                                    'modifiedColor': popupChartConfig.series[i].color != undefined ? popupChartConfig.series[i].color : $("#chart-container-popup").highcharts().series[i].color,
                                    'name': $('#chart-container-popup').highcharts().series[i].name.split('-')[0]
                                });
                            }
                        }
                        else if (scope.activeChart.name == "Pie Chart" ||
                            scope.activeChart.name == "Donut Chart") {
                            for (var i = 0; i < popupChartConfig.series[0].data.length; i++) {
                                scope.popupLegendList.push({
                                    'initialColor': popupChartConfig.series[0].data[i].color != undefined ? popupChartConfig.series[0].data[i].color : $("#chart-container-popup").highcharts().series[0].data[i].color,
                                    'defaultColor': colorset[i],
                                    'modifiedColor': popupChartConfig.series[0].data[i].color != undefined ? popupChartConfig.series[0].data[i].color : $("#chart-container-popup").highcharts().series[0].data[i].color,
                                    'name': $('#chart-container-popup').highcharts().series[0].data[i].name.split(':')[0]
                                });
                            }
                        }
                    };
                    scope.popupCustomizeDataColorHideCallback = function () {
                        scope.popupCustomizeDataColor = false;
                        scope.renderOnPopup = false;
                    };
                    scope.popupCustomizeDataColorDoneCallback = function () {
                        scope.renderOnPopup = false;
                        //update series color in parent chart config on done
                        var parentChartConfig = getHighchartConfiguration();
                        scope.popupLegendList.forEach(function (item, index) {
                            if (item.initialColor != item.modifiedColor) {
                                scope.isColorModified = true;
                                //For pie chart/donut chart the color of the data points need to be updated
                                if (scope.activeChart.name == "Pie Chart" ||
                                    scope.activeChart.name == "Donut Chart") {
                                    parentChartConfig.series.forEach(function (pieSeries, index) {

                                        var userDataPoint = _.find(pieSeries.userOptions.data, function (opt) {
                                            return opt.name.split(':')[0] == item.name;
                                        });

                                        if (userDataPoint != undefined)
                                            userDataPoint.color = item.modifiedColor;

                                        var dataPoint = _.find(pieSeries.data, function (point) {
                                            return point.name.split(':')[0] == item.name;
                                        });

                                        dataPoint.color = item.modifiedColor;
                                        dataPoint.update();

                                        if (scope.highchartsNg != undefined && scope.highchartsNg.series != undefined && scope.highchartsNg.series.length > 0) {
                                            dataPoint = _.find(scope.highchartsNg.series[index].data, function (point) {
                                                return point.name.split(':')[0] == item.name;
                                            });
                                            dataPoint.color = item.modifiedColor;
                                        }
                                        var objLegend = _.find(scope.modifiedReportColors, function (p) {
                                            return p.legendName == item.name;
                                        });
                                        if (objLegend != undefined)
                                            objLegend.appliedColor = item.modifiedColor;
                                    });
                                    setTimeout(function () {
                                        parentChartConfig.series.forEach(function (series) {
                                            series.update();
                                        });
                                    }, 200);
                                }
                                //For multiaxis with columns update all series with the current legend
                                else if (scope.activeChart.name == "Multiple Axis Chart" && scope.columnList.length > 0) {
                                    var series = parentChartConfig.series.filter(function (p) {
                                        return p.name.split('-')[0] == item.name;
                                    });
                                    series.forEach(function (ser) {
                                        ser.color = item.modifiedColor;
                                        ser.userOptions.color = item.modifiedColor;
                                        ser.update();
                                    });
                                    var objLegend = _.find(scope.modifiedReportColors, function (p) {
                                        return p.legendName == item.name;
                                    });
                                    if (objLegend != undefined)
                                        objLegend.appliedColor = item.modifiedColor;
                                }
                                else {
                                    var objseries = _.find(parentChartConfig.series, function (ser) {
                                        return ser.name == item.name;
                                    });
                                    objseries.color = item.modifiedColor;
                                    objseries.userOptions.color = item.modifiedColor;
                                    //For waterfall chart upColor also needs to be updated
                                    if (scope.activeChart.name == "Waterfall Chart") {
                                        objseries.userOptions.upColor = item.modifiedColor;
                                    }
                                    //For multiaxis chart yAxis color also needs to be updated
                                    if (scope.activeChart.name == "Multiple Axis Chart" && scope.columnList.length == 0) {
                                        objseries.yAxis.userOptions.labels.style.color = item.modifiedColor;
                                        objseries.yAxis.userOptions.title.style.color = item.modifiedColor;
                                        objseries.yAxis.update();
                                    }
                                    objseries.update();
                                    //Update the global config variable highchartsNg
                                    if (scope.highchartsNg != undefined && scope.highchartsNg.series != undefined && scope.highchartsNg.series.length > 0) {
                                        objseries = _.find(scope.highchartsNg.series, function (ser) {
                                            return ser.name == item.name;
                                        });
                                        if (objseries != undefined) {
                                            objseries.color = item.modifiedColor;
                                            if (scope.activeChart.name == "Waterfall Chart") {
                                                if (objseries.upColor != undefined)
                                                    objseries.upColor = item.modifiedColor;
                                            }
                                            scope.$parent.vm.reflowChart();
                                        }
                                    }
                                    //update the legend color in the modified json array
                                    var objLegend = _.find(scope.modifiedReportColors, function (p) {
                                        return p.legendName == item.name;
                                    });
                                    if (objLegend != undefined)
                                        objLegend.appliedColor = item.modifiedColor;
                                }
                            }
                        });
                    };
                    scope.CancelColorPalet = function () {
                        scope.popupCustomizeDataColor = false;
                        scope.renderOnPopup = false;
                    };
                    var getHighchartConfiguration = function () {
                        if (scope.activeChart.name == "Column Chart" ||
                            scope.activeChart.name == "Line Chart" ||
                            scope.activeChart.name == "Pie Chart" ||
                            scope.activeChart.name == "Donut Chart") {
                            return $("#column-chart-container").highcharts();
                        }
                        else if (scope.activeChart.name == "Stacked Column Chart" ||
                            scope.activeChart.name == "Bar Chart" ||
                            scope.activeChart.name == "100% Stacked Column Chart" ||
                            scope.activeChart.name == "Stacked Bar Chart" ||
                            scope.activeChart.name == "Clustered Stacked Column Chart" ||
                            scope.activeChart.name == "100% Stacked Bar Chart") {
                            return $("#stacked-chart-container").highcharts();
                        }
                        else if (scope.activeChart.name == "Pareto Chart") {
                            return $("#pareto-chart-container").highcharts();
                        }
                        else if (scope.activeChart.name == "Multiple Axis Chart") {
                            return $("#multi-chart-container").highcharts();
                        }
                        else if (scope.activeChart.name == "Column & Line Combination Chart" ||
                            scope.activeChart.name == "Bar & Line Combination Chart") {
                            return $("#combination-chart-container").highcharts();
                        }
                        else if (scope.activeChart.name == "Bubble Chart") {
                            return $("#bubble-chart-container").highcharts();
                        }
                        else if (scope.activeChart.name == "Waterfall Chart") {
                            return $("#waterfall-chart-container").highcharts();
                        }
                        else if (scope.activeChart.name == "Histogram Chart") {
                            return $("#histogram-chart-container").highcharts();
                        }
                    };
                    var CreateChartOnPopup = function () {
                        var chartConfig;
                        scope.renderOnPopup = true;
                        if (scope.activeChart.name == 'Multiple Axis Chart')
                            createMultichart();
                        else if (scope.activeChart.name == 'Pareto Chart')
                            createParetoChart();
                        else if (scope.activeChart.name == 'Stacked Column Chart' || scope.activeChart.name == '100% Stacked Column Chart' || scope.activeChart.name == '100% Stacked Bar Chart' || scope.activeChart.name == 'Stacked Bar Chart' || scope.activeChart.name == 'Clustered Stacked Column Chart' || scope.activeChart.name == 'Bar Chart')
                            createStackedCollumnChart();
                        else if (scope.activeChart.name == 'Column & Line Combination Chart' || scope.activeChart.name == 'Bar & Line Combination Chart')
                            createCombinationChart();
                        else if (scope.activeChart.name == 'Bubble Chart')
                            createBubbleChart();
                        else if (scope.activeChart.name == 'Waterfall Chart')
                            createWaterFallChart();
                        else if (scope.activeChart.name == 'Histogram Chart') {
                            getChartForHistogram();
                        }
                        else if (scope.activeChart.name == 'Column Chart' || scope.activeChart.name == 'Line Chart' || scope.activeChart.name == 'Pie Chart' || scope.activeChart.name == 'Donut Chart') {
                            getChartJson();
                        }
                        //else
                        //    getChartJson();
                    };
                    var isColorPaletEnabled = function () {
                        if (scope.activeChart.name == 'Column Chart' ||
                            scope.activeChart.name == 'Line Chart' ||
                            scope.activeChart.name == 'Multiple Axis Chart' ||
                            scope.activeChart.name == 'Stacked Column Chart' ||
                            scope.activeChart.name == 'Bar Chart' ||
                            scope.activeChart.name == '100% Stacked Column Chart' ||
                            scope.activeChart.name == 'Stacked Bar Chart' ||
                            scope.activeChart.name == '100% Stacked Bar Chart' ||
                            scope.activeChart.name == 'Column & Line Combination Chart' ||
                            scope.activeChart.name == 'Bar & Line Combination Chart' ||
                            scope.activeChart.name == 'Waterfall Chart' ||
                            scope.activeChart.name == 'Histogram Chart' ||
                            scope.activeChart.name == 'Pareto Chart' ||
                            scope.activeChart.name == 'Pie Chart' ||
                            scope.activeChart.name == 'Donut Chart' ||
                            (scope.activeChart.name == 'Bubble Chart' && scope.columnList != undefined && scope.columnList.length == 1)) {
                            scope.isColorPalletEnabled = true;
                            return true;
                        }
                        scope.isColorPalletEnabled = false;
                        return false;
                    };
                    scope.isDataLabelEnabled = function () {
                        if (scope.activeChart.name != 'Gauge Chart' && scope.activeChart.name != 'Map Chart' && scope.activeChart.name != 'Heat Map')
                            return true;
                    }
                    //#endregion
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
                        else if (scope.activeChart.name == 'Pie Chart') {
                            options = {
                                'startAngle': 0,
                                'endAngle': 360,
                                'center': centerPie,
                                point: {
                                    events: {
                                        legendItemClick: function () {
                                            var chart = this.series.chart;
                                            var series = chart.series;
                                            var actualPoint = this.x;
                                            series.forEach(function (series) {
                                                series.data.forEach(function (point) {
                                                    if (point.x === actualPoint) {
                                                        if (point.visible) {
                                                            point.setVisible(false);
                                                        }
                                                        else {
                                                            point.setVisible(true);
                                                        }
                                                    }
                                                });
                                            });
                                            return false;
                                        }
                                    }
                                },
                            };
                        }
                        return options;
                    };
                    var getStacking = function () {
                        var stacking = '';
                        if (chartType == 'stColumn' || chartType == 'stBar') {
                            stacking = 'normal';
                        }
                        else if (chartType == 'percentStColumn' || chartType == 'percentStBar') {
                            stacking = 'percent';
                        }
                        return stacking;
                    };
                    var getMaxValueForStackedCharts = function (_stackColumnChartConfig) {
                        if (scope.rowList.length != 0) {
                            var max = 100;
                            if (chartType == 'percentStColumn' || chartType == 'percentStBar') {
                                max = 100;
                            }
                            else {
                                max = masterJson[rowelIndex].maxYAxis.length ? masterJson[rowelIndex].maxYAxis[0] : null;
                            }
                            _stackColumnChartConfig.yAxis["max"] = max;
                        }
                    };
                    var getMinValueForStackedCharts = function (_stackColumnChartConfig) {
                        if (scope.rowList.length != 0) {
                            var min = 0;
                            if (chartType == 'percentStColumn' || chartType == 'percentStBar') {
                                min = 0;
                            }
                            else {
                                min = masterJson[rowelIndex].minYAxis.length ? masterJson[rowelIndex].minYAxis[0] : null;
                            }
                            _stackColumnChartConfig.yAxis["min"] = min;
                        }
                    };
                    var getPlotSetting = function () {
                        var settings = {};
                        settings = {
                            'dataLabels': {
                                'enabled': !scope.renderOnPopup ? scope.showDataLabels : false
                            },
                            'stacking': getStacking()
                        };
                        return settings;
                    };
                    var getStackChartType = function () {
                        var charttype = '';
                        if (chartType == 'stColumn' || chartType == 'percentStColumn' || chartType == 'columnLineCombinationChart') {
                            charttype = 'column';
                        }
                        else
                            charttype = 'bar';
                        return charttype;
                    };
                    var getDataLabelsSeriesData = function (data, name) {
                        var currenyBeforeAmount = utilities.getCurrencySymbolLocation(), currentObj, configFormat;
                        if (scope.rowList.length >= 1 && scope.valueList.length > 1) {
                            currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == name; });
                            configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                        }
                        else {
                            currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects[0]; });
                            configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                        }
                        var currencyFormatKey = currenyBeforeAmount && currentObj.formatKey != ""
                            && currentObj.formatKey != null
                            && currentObj.formatKey != report.resources.CommonConstants.Percent ?
                            report.resources.FormatType[currentObj.formatKey] : '';
                        if (chartType == 'percentStColumn' || chartType == 'percentStBar') {
                            return utilities.formatChartTooltip(data, configFormat);
                        }
                        else {
                            return (configFormat != '' ? (utilities.formatChartTooltip(data, configFormat)) :
                                ((currencyFormatKey + Highcharts.numberFormat(data, 0, '.', ','))));
                        }
                    };
                    var getStackSeriesData = function () {
                        var temp = [];
                        var clickCount = 0;
                        if (scope.valueList.length == 1 && scope.columnList.length == 1 && scope.rowList.length == 0) {
                            for (var i = 0; i < currentJson[currentJson.length - 1].columnObject.length; i++) {
                                temp.push({
                                    name: currentJson[i][currentJson[currentJson.length - 1].item],
                                    data: [currentJson[i][metricObjects[0]]],
                                    dataLabels: {
                                        formatter: function () {
                                            //return getDataLabelsSeriesData(this.y, this.series.name)
                                            if (chartType == 'percentStColumn' || chartType == 'percentStBar') {
                                                return getDataLabelsSeriesData(this.point.percentage.toFixed(2) + '%', this.series.name);
                                            }
                                            else {
                                                return getDataLabelsSeriesData(this.y, this.series.name);
                                            }
                                        }
                                    },
                                    color: getSeriesColor(currentJson[i][currentJson[currentJson.length - 1].item], i)
                                });
                            }
                            if (!scope.renderOnPopup) {
                                temp[0].events = {
                                    click: function (e) {
                                        clickCount += 1;
                                        if (clickCount == 1) {
                                            var category = "";
                                            category = e.point.category;
                                            jumpToState(category);
                                            setTimeout(function () {
                                                scope.$digest();
                                            });
                                        }
                                    }
                                };
                            }
                            temp[0].cursor = 'pointer';
                            return temp;
                        }
                        else if (scope.valueList.length == 1 && scope.columnList.length >= 1 && scope.rowList.length) {
                            if (scope.columnList.length == 2) {
                            }
                            else {
                                var seriesObject = currentJson[currentJson.length - 1].columnObject;
                                for (var i = 0; i < seriesObject.length; i++) {
                                    temp[i] = {};
                                    temp[i].name = seriesObject[i];
                                    temp[i].data = createSeriesData(seriesObject, i);
                                    temp[i].color = getSeriesColor(seriesObject[i], i);
                                    temp[i].cursor = 'pointer';
                                    if (!scope.renderOnPopup) {
                                        temp[i].events = {
                                            click: function (e) {
                                                clickCount += 1;
                                                if (clickCount == 1) {
                                                    var category = "";
                                                    category = e.point.category;
                                                    jumpToState(category);
                                                    setTimeout(function () {
                                                        scope.$digest();
                                                    });
                                                }
                                            }
                                        };
                                    }
                                    temp[i].dataLabels = {
                                        formatter: function () {
                                            //return getDataLabelsSeriesData(this.y, this.series.name)
                                            if (chartType == 'percentStColumn' || chartType == 'percentStBar') {
                                                return getDataLabelsSeriesData(this.point.percentage.toFixed(2) + '%', this.series.name);
                                            }
                                            else {
                                                return getDataLabelsSeriesData(this.y, this.series.name);
                                            }
                                        }
                                    };
                                }
                            }
                            return temp;
                        }
                        else if (scope.valueList.length >= 1 && scope.rowList.length) {
                            var seriesObject = columnObjects.length ? columnObjects : metricObjects;
                            var currentReportingObject = void 0;
                            for (var i = 0; i < metricObjects.length; i++) {
                                currentReportingObject = scope.columnList.length > 0 ? scope.columnList[0] : scope.valueList[i];
                                temp[i] = {};
                                temp[i].name = seriesObject[i];
                                temp[i].data = createSeriesData(seriesObject, i);
                                temp[i].color = getSeriesColor(seriesObject[i], i);
                                temp[i].cursor = 'pointer';
                                if (!scope.renderOnPopup) {
                                    temp[i].events = {
                                        click: function (e) {
                                            clickCount += 1;
                                            if (clickCount == 1) {
                                                var category = "";
                                                category = e.point.category;
                                                jumpToState(category);
                                                setTimeout(function () {
                                                    scope.$digest();
                                                });
                                            }
                                        }
                                    };
                                }
                                temp[i].dataLabels = {
                                    formatter: function () {
                                        if (chartType == 'percentStColumn' || chartType == 'percentStBar') {
                                            return getDataLabelsSeriesData(this.point.percentage.toFixed(2) + '%', this.series.name);
                                        }
                                        else {
                                            return getDataLabelsSeriesData(this.y, this.series.name);
                                        }
                                    }
                                };
                            }
                            return temp;
                        }
                    };
                    var createStackedCollumnChart = function () {
                        var clickCount = 0;
                        scope.showDataLabels = scope.$parent.vm.showDataLabels;
                        var _stackColumnChartConfig = {
                            chart: {
                                chart: {
                                    //type: 'percentStColumn' || 'percentStBar' || 'bar' || 'stColumn' || 'clusteredStackedColumnChart',
                                    zoomType: 'xy'
                                },
                                type: getStackChartType()
                            },
                            title: {
                                align: 'left',
                                text: '' //createGraphTitle(rowelIndex);
                            },
                            initChart: false,
                            subtitle: {
                                text: (function () {
                                    var data = "";
                                    if (scope.activeChart.name != "Pie Chart") {
                                        if (scope.activeChart.name == "Line Chart") {
                                            if (scope.rowList && scope.rowList.length > 0)
                                                data = showMessage(scope.rowList[0]);
                                            if (data && (scope.columnList && scope.columnList.length > 0))
                                                data = showMessage(scope.columnList[0]);
                                        }
                                        else
                                            data = scope.valueList[0].displayName;
                                    }
                                    //var data = 'Currently Viewing : ';
                                    //angular.forEach(scope.chartstates, function (value, key) { data += value.itemName + ' > '; });
                                    return data;
                                }()),
                                align: 'left'
                            },
                            xAxis: {
                                categories: createXAxis(),
                                title: {
                                    text: null
                                },
                                labels: {
                                    formatter: function () {
                                        if (typeof this.value === 'string') {
                                            return (this.value.length < report.resources.chartLabelSize) ? this.value : this.value.substring(0, report.resources.chartLabelSize - 1) + '...';
                                        }
                                        return this.value;
                                    }
                                }
                            },
                            yAxis: {
                                title: {
                                    text: '',
                                    align: 'high'
                                },
                                labels: {
                                    formatter: function () {
                                        return parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+9
                                            ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+9).toFixed(1))) + "B"
                                            : parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+6
                                                ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+6).toFixed(1))) + "M"
                                                : parseFloat(Math.abs(this.value).toFixed(2)) >= 1.0e+3
                                                    ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+3).toFixed(1))) + "K"
                                                    : utilities.globalizeNumber(this.value);
                                    }
                                }
                            },
                            tooltip: {
                                formatter: function () {
                                    var x = this.x;
                                    var y = this.y;
                                    if (chartType == 'percentStColumn' || chartType == 'percentStBar') {
                                        return this.series.name + '<br/>' +
                                            'Percentage ' + ': <b>' + this.point.percentage.toFixed(2) + '%' + '</b>';
                                    }
                                    else {
                                        if (scope.rowList.length >= 1 && scope.columnList.length == 0 && scope.valueList.length > 1) {
                                            for (var i = 0; i < metricObjects.length; i++) {
                                                var name = this.series.name;
                                                var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                                                var currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == name; });
                                                var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                                                var currencyFormatKey = ((currenyBeforeAmount && currentObj.formatKey != ""
                                                    && currentObj.formatKey != null
                                                    && currentObj.formatKey != report.resources.CommonConstants.Percent) ?
                                                    report.resources.FormatType[currentObj.formatKey] : '');
                                                return x + '<br/>' +
                                                    ((scope.columnList.length > 0 ?
                                                        (scope.columnList[0].reportObjectName + ':' + this.series.userOptions.name + '<br/>') : "") + this.series.name + ': <b>' +
                                                        (configFormat != '' ? (utilities.formatChartTooltip(y, configFormat) + '</b>') :
                                                            ("<b>" + (currencyFormatKey + Highcharts.numberFormat(y, 0, '.', ',')) + '</b>')));
                                            }
                                        }
                                        else {
                                            var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                                            var currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects[0]; });
                                            var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                                            var currencyFormatKey = ((currenyBeforeAmount && currentObj.formatKey != ""
                                                && currentObj.formatKey != null
                                                && currentObj.formatKey != report.resources.CommonConstants.Percent) ?
                                                report.resources.FormatType[currentObj.formatKey] : '');
                                            return x + '<br/>' +
                                                ((scope.columnList.length > 0 ?
                                                    (scope.columnList[0].reportObjectName + ':' + this.series.userOptions.name + '<br/>') : "") + metricObjects[0] + ': <b>' +
                                                    (configFormat != '' ? (utilities.formatChartTooltip(y, configFormat) + '</b>') :
                                                        ("<b>" + (currencyFormatKey + Highcharts.numberFormat(y, 0, '.', ',')) + '</b>')));
                                        }
                                    }
                                }
                            },
                            plotOptions: {
                                column: getPlotSetting(),
                                bar: getPlotSetting(),
                                series: {
                                    dataLabels: {
                                        useHTML: true,
                                        enabled: !scope.renderOnPopup ? scope.showDataLabels : false,
                                        allowOverlap: true,
                                        crop: false,
                                        overflow: 'none',
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
                                }
                            },
                            legend: {
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
                            },
                            credits: {
                                enabled: false
                            },
                            series: getStackSeriesData(),
                            exporting: {
                                allowHTML: true,
                                enabled: false,
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
                            }
                        };
                        getMaxValueForStackedCharts(_stackColumnChartConfig);
                        getMinValueForStackedCharts(_stackColumnChartConfig);
                        if (!scope.renderOnPopup) {
                            scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                            $('#stacked-chart-container').highcharts(_stackColumnChartConfig);
                        }
                        else {
                            $("#chart-container-popup").highcharts(_stackColumnChartConfig);
                        }
                    };
                    var createCombinationChart = function () {
                        scope.showDataLabels = scope.$parent.vm.showDataLabels;
                        var combinationChartConfig = {
                            title: {
                                text: ''
                            },
                            chart: {
                                type: 'columnLineCombinationChart' || 'barLineCombinationChart',
                                zoomType: 'xy'
                            },
                            subtitle: {
                                text: (function () {
                                    var data = "";
                                    if (scope.activeChart.name != "Pie Chart") {
                                        if (scope.activeChart.name == "Line Chart") {
                                            if (scope.rowList && scope.rowList.length > 0)
                                                data = showMessage(scope.rowList[0]);
                                            if (data && (scope.columnList && scope.columnList.length > 0))
                                                data = showMessage(scope.columnList[0]);
                                        }
                                        else
                                            data = scope.valueList[0].displayName;
                                    }
                                    return data;
                                }()),
                                align: 'left'
                            },
                            xAxis: {
                                categories: createXAxis(),
                                title: {
                                    text: null
                                }
                            },
                            yAxis: {
                                max: masterJson[rowelIndex].maxYAxis.length ? masterJson[rowelIndex].maxYAxis[0] : null,
                                min: masterJson[rowelIndex].minYAxis.length ? masterJson[rowelIndex].minYAxis[0] : null,
                                labels: {
                                    formatter: function () {
                                        return parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+9
                                            ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+9).toFixed(1))) + "B"
                                            : parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+6
                                                ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+6).toFixed(1))) + "M"
                                                : parseFloat(Math.abs(this.value).toFixed(2)) >= 1.0e+3
                                                    ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+3).toFixed(1))) + "K"
                                                    : utilities.globalizeNumber(this.value);
                                    }
                                }
                            },
                            series: getSeriesData(),
                            tooltip: {
                                formatter: function () {
                                    for (var i = 0; i < metricObjects.length; i++) {
                                        var name = this.series.name;
                                        var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                                        var currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == name; });
                                        var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                                        var currencyFormatKey = ((currenyBeforeAmount && currentObj.formatKey != ""
                                            && currentObj.formatKey != null
                                            && currentObj.formatKey != report.resources.CommonConstants.Percent) ?
                                            report.resources.FormatType[currentObj.formatKey] : '');
                                        var x = this.x;
                                        var y = this.y;
                                        return x + '<br/>' +
                                            ((scope.columnList.length > 0 ?
                                                (scope.columnList[0].reportObjectName + ':' + this.series.userOptions.name + '<br/>') : "") + this.series.name + ': <b>' +
                                                (configFormat != '' ? (utilities.formatChartTooltip(y, configFormat) + '</b>') :
                                                    ("<b>" + (currencyFormatKey + Highcharts.numberFormat(y, 0, '.', ',')) + '</b>')) +
                                                (currentObj.formatKey != "" && currentObj.formatKey != null && currentObj.formatKey && configFormat == "" && (currentObj.formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[currentObj.formatKey] + '</b></td>' : "")
                                            );
                                    }
                                }
                            },
                            exporting: {
                                enabled: false,
                                chartOptions: {
                                    title: {
                                        text: createGraphTitle(rowelIndex)
                                    },
                                    legend: {
                                        navigation: {
                                            enabled: false
                                        },
                                        alignColumns: true
                                    },
                                }
                            },
                            crosshair: {
                                color: "none"
                            },
                            plotOptions: {
                                series: {
                                    dataLabels: {
                                        enabled: !scope.renderOnPopup ? scope.showDataLabels : false,
                                        allowOverlap: true,
                                        crop: false,
                                        overflow: 'none',
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
                                        },
                                    },
                                }
                            },
                            credits: { enabled: false },
                        };
                        if (!scope.renderOnPopup) {
                            $('#combination-chart-container').highcharts(combinationChartConfig);
                            scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                        }
                        else
                            $("#chart-container-popup").highcharts(combinationChartConfig);
                    };
                    var createBubbleChart = function () {
                        var clickCount = 0;
                        var bubbleChartConfig;
                        scope.showGridlines = scope.$parent.vm.showGridLines || (scope.$parent.vm.reportDetailsObj.reportProperties && scope.$parent.vm.reportDetailsObj.reportProperties.gridLineWidth) || 0;
                        scope.$parent.vm.showGridLines = scope.showGridlines;
                        scope.showDataLabels = scope.$parent.vm.showDataLabels;
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
                                    events: {
                                        click: function (e) {
                                            if (!scope.renderOnPopup) {
                                                clickCount += 1;
                                                if (clickCount == 1) {
                                                    var category = '';
                                                    if (scope.rowList.length == 1 && scope.valueList.length == 2 && scope.columnList.length == 0)
                                                        category = e.point.category;
                                                    else if (scope.rowList.length == 0 && scope.valueList.length == 3 && scope.columnList.length >= 0)
                                                        category = e.point.series.name;
                                                    else if (scope.rowList.length >= 0 && scope.valueList.length == 3 && scope.columnList.length == 0)
                                                        category = e.point.options.header;
                                                    jumpToState(category);
                                                    setTimeout(function () {
                                                        scope.$digest();
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            tooltip: getBubbleChartTooltip(),
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
                        if (!scope.renderOnPopup) {
                            $('#bubble-chart-container').highcharts(bubbleChartConfig);
                            scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                        }
                        else {
                            $("#chart-container-popup").highcharts(bubbleChartConfig);
                        }
                    };
                    /**
                    *Global getSVG method that takes an array of charts as an argument. The SVG is returned as an argument in the callback.
                    */
                    Highcharts.getSVG = function (charts, chartOpts) {
                        var svgArr = [], top = 0, width = 0, endWidth = 0;
                        Highcharts.each(charts, function (chart) {
                            var container = $(chart.container);
                            var svg = chart.getSVG({
                                chart: {
                                    width: container.width()
                                },
                                plotOptions: {
                                    solidgauge: {
                                        dataLabels: {
                                            enabled: true
                                        },
                                    }
                                }
                            }), svgWidth = +svg.match(/^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/)[1], svgHeight = +svg.match(/^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/)[1];
                            svg = svg.replace('<svg', '<g transform="translate(' + width + ', ' + top + ')" ');
                            svg = svg.replace('</svg>', '</g>');
                            width += svgWidth;
                            endWidth = Math.max(endWidth, width);
                            if (charts.length >= 5) {
                                if (width === 3 * svgWidth) {
                                    width = 0;
                                    top += svgHeight;
                                }
                            }
                            else if (charts.length == 4) {
                                if (width === 2 * svgWidth) {
                                    width = 0;
                                    top += svgHeight;
                                }
                            }
                            svgArr.push(svg);
                        });
                        top += 200;
                        return '<svg height="' + top + '" width="' + endWidth +
                            '" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
                            svgArr.join('') + '</svg>';
                    };
                    /**
                     * Global exportCharts method that takes an array of charts as an argument,
                     * and exporting options as the second argument
                     */
                    Highcharts.exportCharts = function (charts, options) {
                        // Merge the options
                        options = Highcharts.merge(Highcharts.getOptions().exporting, options);
                        // Post to export server
                        Highcharts.post(options.url, {
                            filename: scope.reportName || 'chart',
                            type: options.type,
                            width: options.width,
                            svg: Highcharts.getSVG(charts),
                        });
                    };
                    var createGaugeChart = function () {
                        var gaugeData = {};
                        var gaugeChartEle;
                        gaugeChartExportList = [];
                        var node = document.getElementById("gauge-chart-container");
                        node.innerHTML = '';
                        gaugeCount = 0;
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
                        var currenyBeforeAmount = utilities.getCurrencySymbolLocation(), format, currencyFormatKey, displayName, isTwoMetrics;
                        if (scope.valueList.length == 2) {
                            isTwoMetrics = true;
                            format = getWijmoConfigurationFormatCallback(scope.valueList[0].configurationValue, scope.valueList[0].filterType);
                            currencyFormatKey = scope.valueList[0].formatKey;
                            displayName = scope.valueList[0].displayName;
                        }
                        else if (scope.valueList.length == 3) {
                            isTwoMetrics = false;
                            format = getWijmoConfigurationFormatCallback(scope.valueList[1].configurationValue, scope.valueList[1].filterType);
                            currencyFormatKey = scope.valueList[1].formatKey;
                            displayName = scope.valueList[1].displayName;
                        }
                        scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                        if ($("#report-gauge-chart-wrapper").parents("#gauge-chart-container").length == 0) {
                            $("#gauge-chart-container").append('<div class="col s12" id="report-gauge-chart-wrapper"></div>');
                        }
                        for (var property in gaugeData) {
                            var gaugeId = 'gauge' + gaugeCount;
                            var gaugeId = property.replace(/[^A-Z0-9]+/ig, "_");
                            if ($("#" + gaugeId).parents("#report-gauge-chart-wrapper").length == 0) {
                                if (Object.keys(gaugeData).length == 1) {
                                    $("#report-gauge-chart-wrapper").append('<div id="' + gaugeId + '" style="min-width: 446px; margin: 0px auto;height: 200px;overflow: hidden; margin-top:60px;"></div>');
                                }
                                else if (Object.keys(gaugeData).length == 2 || Object.keys(gaugeData).length == 4) {
                                    $("#report-gauge-chart-wrapper").append('<div  class="col s6" id="' + gaugeId + '" style="width: 426px; height: 200px; margin-top:60px;"></div>');
                                }
                                else if (Object.keys(gaugeData).length == 3) {
                                    $("#report-gauge-chart-wrapper").append('<div  class="col s6" id="' + gaugeId + '" style="width: 400px; height: 200px; float:left; margin-top:60px; margin-left:30px;"></div>');
                                }
                                else if (Object.keys(gaugeData).length >= 5) {
                                    $("#report-gauge-chart-wrapper").append('<div id="' + gaugeId + '" style="width: 400px; height: 200px;float:left;"></div>');
                                }
                            }
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
                            gaugeChartExportList[gaugeCount] = Highcharts.chart(document.getElementById(gaugeId), {
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
                                    stops: (scope.reportObjDetails.isRangeRedToGreenColor || scope.$parent.vm.isRangeRedToGreenColor) ? [
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
                                tooltip: {
                                    useHTML: true,
                                    headerFormat: '<span style="font-size:10px">',
                                    formatter: function () {
                                        return (displayName + ':' + '<b>'
                                            + (currencyFormatKey != "" && currencyFormatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && format == "" ? report.resources.FormatType[currencyFormatKey] : '')
                                            + utilities.formatChartTooltip(this.y, format)
                                            + (currencyFormatKey != "" && currencyFormatKey != null && format == "" && (currencyFormatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[currencyFormatKey] : '')
                                            + '</b><br>');
                                    },
                                    footerFormat: '</span>',
                                    positioner: function (labelWidth, labelHeight, point) {
                                        var tooltipX = point.plotX - 50;
                                        var tooltipY = point.plotY - 70;
                                        return {
                                            x: tooltipX,
                                            y: tooltipY
                                        };
                                    }
                                },
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
                            });
                            gaugeCount++;
                        }
                        ;
                    };
                    var getYaxisLabelsFormat = function () {
                        var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                        var format, colorFormat;
                        if (scope.valueList.length == 2) {
                            colorFormat = getWijmoConfigurationFormatCallback(scope.valueList[1].configurationValue, scope.valueList[1].filterType);
                            return {
                                y: 18,
                                align: 'center',
                                style: {
                                    fontSize: 12,
                                    color: 'black'
                                },
                                formatter: function () {
                                    return this.isFirst ? this.axis.min :
                                        ((scope.valueList[1].formatKey != "" && scope.valueList[1].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && colorFormat == "" ? report.resources.FormatType[scope.valueList[1].formatKey] : '')
                                            + '' + utilities.formatChartTooltip(this.axis.max, colorFormat)
                                            + (scope.valueList[1].formatKey != "" && scope.valueList[1].formatKey != null && colorFormat == "" && (scope.valueList[1].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[1].formatKey] : ''));
                                }
                            };
                        }
                        else {
                            format = getWijmoConfigurationFormatCallback(scope.valueList[0].configurationValue, scope.valueList[0].filterType);
                            colorFormat = getWijmoConfigurationFormatCallback(scope.valueList[2].configurationValue, scope.valueList[2].filterType);
                            return {
                                y: 18,
                                align: 'center',
                                style: {
                                    fontSize: 12,
                                    color: 'black'
                                },
                                formatter: function () {
                                    return this.isFirst ?
                                        ((scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && format == "" ? report.resources.FormatType[scope.valueList[0].formatKey] : '')
                                            + '' + utilities.formatChartTooltip(this.axis.min, format)
                                            + (scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != null && format == "" && (scope.valueList[0].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[0].formatKey] : ''))
                                        :
                                        ((scope.valueList[2].formatKey != "" && scope.valueList[2].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && colorFormat == "" ? report.resources.FormatType[scope.valueList[2].formatKey] : '')
                                            + '' + utilities.formatChartTooltip(this.axis.max, colorFormat)
                                            + (scope.valueList[2].formatKey != "" && scope.valueList[2].formatKey != null && colorFormat == "" && (scope.valueList[2].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[2].formatKey] : ''));
                                }
                            };
                        }
                    };
                    var getBubbleChartSeriesData = function (mode) {
                        var series = [];
                        var format = getWijmoConfigurationFormatCallback(scope.valueList[0].configurationValue, scope.valueList[0].filterType);
                        var currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects[0]; });
                        var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                        var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
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
                    var createWaterFallChart = function () {
                        scope.showDataLabels = scope.$parent.vm.showDataLabels;
                        var clickCount = 0;
                        var waterFallChartConfig;
                        if (scope.rowList.length >= 1 && scope.columnList.length == 0 && scope.valueList.length == 1) {
                            waterFallChartConfig = {
                                credits: false,
                                exporting: {
                                    enabled: false,
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
                                            text: createGraphTitle(rowelIndex)
                                        }
                                    }
                                },
                                chart: {
                                    type: 'waterfall',
                                    zoomType: 'xy'
                                },
                                title: {
                                    text: ''
                                },
                                xAxis: {
                                    categories: createXAxis(),
                                    title: {
                                        text: null
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text: metricObjects[0]
                                    },
                                    labels: {
                                        formatter: function () {
                                            return parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+9
                                                ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+9).toFixed(1))) + "B"
                                                : parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+6
                                                    ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+6).toFixed(1))) + "M"
                                                    : parseFloat(Math.abs(this.value).toFixed(2)) >= 1.0e+3
                                                        ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+3).toFixed(1))) + "K"
                                                        : utilities.globalizeNumber(this.value);
                                        }
                                    }
                                },
                                legend: {
                                    enabled: false
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
                                                fontSize: scope.selectedFontSize + "px",
                                                textOutline: 0
                                            },
                                            color: '#000000',
                                            states: {
                                                inactive: {
                                                    opacity: 1
                                                }
                                            },
                                        },
                                    }
                                },
                                tooltip: {
                                    formatter: function () {
                                        var x = this.x;
                                        var y = this.y;
                                        if (scope.rowList.length >= 1 && scope.columnList.length == 0 && scope.valueList.length == 1) {
                                            var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                                            var currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects[0]; });
                                            var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                                            var currencyFormatKey = ((currenyBeforeAmount && currentObj.formatKey != ""
                                                && currentObj.formatKey != null
                                                && currentObj.formatKey != report.resources.CommonConstants.Percent) ?
                                                report.resources.FormatType[currentObj.formatKey] : '');
                                            return x + '<br/>' + (scope.columnList.length > 0 ?
                                                (scope.columnList[0].reportObjectName + ':' + this.series.userOptions.name + '<br/>') : "") +
                                                (metricObjects[0] + ': <b>' +
                                                    (configFormat != '' ? (utilities.formatChartTooltip(y, configFormat) + '</b>') :
                                                        ("<b>" + (currencyFormatKey + Highcharts.numberFormat(y, 0, '.', ',')) + '</b>')));
                                        }
                                        else {
                                            var currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects[0]; });
                                            var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                                            var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                                            var currencyFormatKey = ((currenyBeforeAmount && currentObj.formatKey != ""
                                                && currentObj.formatKey != null
                                                && currentObj.formatKey != report.resources.CommonConstants.Percent) ?
                                                report.resources.FormatType[currentObj.formatKey] : '');
                                            return x + '<br/>' + (scope.columnList.length > 0 ?
                                                (scope.columnList[0].reportObjectName + ':' + this.series.userOptions.name + '<br/>') : "") +
                                                (metricObjects[0] + ': <b>' +
                                                    (configFormat != '' ? (utilities.formatChartTooltip(y, configFormat) + '</b>') :
                                                        ("<b>" + (currencyFormatKey + Highcharts.numberFormat(y, 0, '.', ',')) + '</b>')));
                                        }
                                    }
                                },
                                series: [{
                                    name: metricObjects[0],
                                    upColor: getSeriesColor(metricObjects[0], 0),
                                    color: getSeriesColor(metricObjects[0], 0),
                                    data: getWaterfallSeries(),
                                    dataLabels: {
                                        formatter: function () {
                                            var currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects[0]; });
                                            var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                                            var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                                            var currencyFormatKey = ((currenyBeforeAmount && currentObj.formatKey != ""
                                                && currentObj.formatKey != null
                                                && currentObj.formatKey != report.resources.CommonConstants.Percent) ?
                                                report.resources.FormatType[currentObj.formatKey] : '');
                                            return (configFormat != '' ? (utilities.formatChartTooltip(this.y, configFormat)) :
                                                ((currencyFormatKey + Highcharts.numberFormat(this.y, 0, '.', ','))));
                                            //return utilities.formatChartTooltip(this.y, configFormat)//this.series.userOptions.tooltip.format)
                                        }
                                    },
                                    events: {
                                        click: function (e) {
                                            if (!scope.renderOnPopup) {
                                                clickCount += 1;
                                                if (clickCount == 1) {
                                                    var category = "";
                                                    category = e.point.name;
                                                    jumpToState(category);
                                                    setTimeout(function () {
                                                        scope.$digest();
                                                    });
                                                }
                                            }
                                        }
                                    },
                                    pointPadding: 0
                                }]
                            };
                        }
                        else if (scope.valueList.length == 1 && scope.columnList.length == 1 && scope.rowList.length >= 1) {
                            waterFallChartConfig = {
                                credits: false,
                                exporting: {
                                    enabled: false,
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
                                            text: createGraphTitle(rowelIndex)
                                        }
                                    }
                                },
                                chart: {
                                    type: 'waterfall',
                                    zoomType: 'xy'
                                },
                                title: {
                                    text: ''
                                },
                                xAxis: {
                                    categories: createXAxis(),
                                    title: {
                                        text: null
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text: metricObjects[0]
                                    },
                                    labels: {
                                        formatter: function () {
                                            return parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+9
                                                ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+9).toFixed(1))) + "B"
                                                : parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+6
                                                    ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+6).toFixed(1))) + "M"
                                                    : parseFloat(Math.abs(this.value).toFixed(2)) >= 1.0e+3
                                                        ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+3).toFixed(1))) + "K"
                                                        : utilities.globalizeNumber(this.value);
                                        }
                                    }
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
                                            },
                                        },
                                        cursor: 'pointer',
                                        stacking: 'normal',
                                        events: {
                                            click: function (e) {
                                                if (!scope.renderOnPopup) {
                                                    clickCount += 1;
                                                    if (clickCount == 1) {
                                                        var category = "";
                                                        category = e.point.category;
                                                        jumpToState(category);
                                                        setTimeout(function () {
                                                            scope.$digest();
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                legend: {
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
                                },
                                series: getWaterfallSeriesColumn(),
                                tooltip: {
                                    formatter: function () {
                                        var x = this.x;
                                        var y = this.y;
                                        if (scope.rowList.length >= 1 && scope.columnList.length == 0 && scope.valueList.length == 1) {
                                            var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                                            var currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects[0]; });
                                            var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                                            var currencyFormatKey = ((currenyBeforeAmount && currentObj.formatKey != ""
                                                && currentObj.formatKey != null
                                                && currentObj.formatKey != report.resources.CommonConstants.Percent) ?
                                                report.resources.FormatType[currentObj.formatKey] : '');
                                            return x + '<br/>' + (scope.columnList.length > 0 ?
                                                (scope.columnList[0].reportObjectName + ':' + this.series.userOptions.name + '<br/>') : "") +
                                                (metricObjects[0] + ': <b>' +
                                                    (configFormat != '' ? (utilities.formatChartTooltip(y, configFormat) + '</b>') :
                                                        ("<b>" + (currencyFormatKey + Highcharts.numberFormat(y, 0, '.', ',')) + '</b>')));
                                        }
                                        else {
                                            var currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects[0]; });
                                            var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                                            var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                                            var currencyFormatKey = ((currenyBeforeAmount && currentObj.formatKey != ""
                                                && currentObj.formatKey != null
                                                && currentObj.formatKey != report.resources.CommonConstants.Percent) ?
                                                report.resources.FormatType[currentObj.formatKey] : '');
                                            return x + '<br/>' + (scope.columnList.length > 0 ?
                                                (scope.columnList[0].reportObjectName + ':' + this.series.userOptions.name + '<br/>') : "") +
                                                (metricObjects[0] + ': <b>' +
                                                    (configFormat != '' ? (utilities.formatChartTooltip(y, configFormat) + '</b>') :
                                                        ("<b>" + (currencyFormatKey + Highcharts.numberFormat(y, 0, '.', ',')) + '</b>')));
                                        }
                                    }
                                },
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
                                ]
                            };
                        }
                        if (!scope.renderOnPopup) {
                            $('#waterfall-chart-container').highcharts(waterFallChartConfig);
                            scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                        }
                        else {
                            $("#chart-container-popup").highcharts(waterFallChartConfig);
                        }
                    };
                    var getWaterfallSeries = function () {
                        var seriesData = [];
                        var totalObjects = {};
                        var reportObject = _.find(scope.reportObjDetails.lstReportObject, { displayName: metricObjects[0] });
                        var configVal = getWijmoConfigurationFormatCallback(reportObject.configurationValue, reportObject.filterType);
                        for (var i = 0; i < rowObjects.length; i++) {
                            var temp = {};
                            temp['name'] = rowObjects[i];
                            temp['y'] = parseFloat((currentJson[i][metricObjects[0]] == null ? 0 : currentJson[i][metricObjects[0]]).toFixed(2));
                            seriesData.push(temp);
                        }
                        //For handling multiplication of value by 100 when metric has percentage number formatting
                        if ((configVal != undefined && configVal[0] == 'p') || reportObject.formatKey == report.resources.CommonConstants.Percent) {
                            angular.forEach(seriesData, function (value, index) {
                                if (value != null) {
                                    if (value.hasOwnProperty('y')) {
                                        value.y = (value.y * 100);
                                    }
                                }
                            }, seriesData);
                        }
                        totalObjects['name'] = 'Total';
                        totalObjects['isSum'] = true;
                        totalObjects['color'] = "#0067b0";
                        seriesData.push(totalObjects);
                        return seriesData;
                    };
                    var getWaterfallSeriesColumn = function () {
                        var seriesData = [];
                        var reportObject = _.find(scope.reportObjDetails.lstReportObject, { displayName: metricObjects[0] });
                        var configVal = getWijmoConfigurationFormatCallback(reportObject.configurationValue, reportObject.filterType);
                        columnObjects.forEach(function (item, index) {
                            var key = scope.columnList[0].displayName;
                            var filtered_rows = _.where(currentJson, (_a = {}, _a[key] = item, _a));
                            var temp = { data: [], name: item };
                            rowObjects.forEach(function (itemColumnValue) {
                                var keyColumn = scope.rowList[rowelIndex].displayName;
                                var obj = _.find(filtered_rows, (_a = {}, _a[keyColumn] = itemColumnValue, _a));
                                // temp.data.push(obj != undefined ? obj[metricObjects[0]] : 0)
                                if ((configVal != undefined && configVal[0] == 'p') || reportObject.formatKey == report.resources.CommonConstants.Percent) {
                                    temp.data.push(obj != undefined ? parseFloat((obj[metricObjects[0]] == null ? 0 : 100 * obj[metricObjects[0]]).toFixed(2)) : 0);
                                }
                                else {
                                    temp.data.push(obj != undefined ? parseFloat((obj[metricObjects[0]] == null ? 0 : obj[metricObjects[0]])) : 0);
                                }
                                temp['dataLabels'] = {
                                    formatter: function () {
                                        var currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects[0]; });
                                        var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                                        var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                                        var currencyFormatKey = ((currenyBeforeAmount && currentObj.formatKey != ""
                                            && currentObj.formatKey != null
                                            && currentObj.formatKey != report.resources.CommonConstants.Percent) ?
                                            report.resources.FormatType[currentObj.formatKey] : '');
                                        return (configFormat != '' ? (utilities.formatChartTooltip(this.y, configVal)) : ((currencyFormatKey + Highcharts.numberFormat(this.y, 0, '.', ','))));
                                    }
                                };
                                var _a;
                            });
                            temp['data'].push({ isSum: true });
                            if (index != 0) {
                                temp['lineWidth'] = 0;
                            }
                            temp['color'] = getSeriesColor(item, index);
                            seriesData.push(temp);
                            var _a;
                        });
                        return seriesData;
                    };
                    var getSeriesData = function () {
                        var temp = [];
                        var clickCount = 0;
                        var seriesObject;
                        if ((columnObjects.length > 0 && rowObjects.length == 0
                            && (scope.activeChart.name == "Stacked Column Chart" || scope.activeChart.name == "Line Chart"))) {
                            seriesObject = columnObjects;
                        }
                        else if (rowObjects.length != 0)
                            seriesObject = columnObjects.length ? columnObjects : metricObjects;
                        else if (rowObjects.length == 0)
                            seriesObject = metricObjects;
                        if (scope.columnList.length == 0) {
                            for (var i = 0; i < seriesObject.length; i++) {
                                var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                                var currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects[i]; });
                                var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                                var currencyFormatKey = ((currenyBeforeAmount && currentObj.formatKey != ""
                                    && currentObj.formatKey != null
                                    && currentObj.formatKey != report.resources.CommonConstants.Percent) ?
                                    report.resources.FormatType[currentObj.formatKey] : '');
                                var data = {};
                                var tempData = [];
                                for (var j = 0; j < currentJson.length - 1; j++) {
                                    if ((configFormat != undefined && configFormat[0] == 'p') || currentObj.formatKey == report.resources.CommonConstants.Percent) {
                                        tempData.push(currentJson[j][seriesObject[i]] * 100);
                                    }
                                    else {
                                        tempData.push(currentJson[j][seriesObject[i]]);
                                    }
                                }
                                data = {
                                    'type': getType(i),
                                    'name': seriesObject[i],
                                    'data': tempData,
                                    'color': getSeriesColor(seriesObject[i], i),
                                    'cursor': 'pointer',
                                    'events': {
                                        click: function (e) {
                                            if (!scope.renderOnPopup) {
                                                clickCount += 1;
                                                if (clickCount == 1) {
                                                    var category = "";
                                                    category = e.point.category;
                                                    jumpToState(category);
                                                    setTimeout(function () {
                                                        scope.$digest();
                                                    });
                                                }
                                            }
                                        }
                                    }
                                };
                                temp.push(data);
                                temp[i].dataLabels =
                                {
                                    formatter: function () {
                                        for (var i = 0; i < metricObjects.length; i++) {
                                            var name = this.series.name;
                                            var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                                            var currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == name; });
                                            var configFormat_1 = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                                            var currencyFormatKey = ((currenyBeforeAmount && currentObj.formatKey != ""
                                                && currentObj.formatKey != null
                                                && currentObj.formatKey != report.resources.CommonConstants.Percent) ?
                                                report.resources.FormatType[currentObj.formatKey] : '');
                                            var y = this.y;
                                            return (configFormat_1 != '' ? (utilities.formatChartTooltip(y, configFormat_1)) :
                                                ((currencyFormatKey + Highcharts.numberFormat(y, 0, '.', ','))) +
                                                (currentObj.formatKey != "" && currentObj.formatKey != null && currentObj.formatKey && configFormat_1 == "" && (currentObj.formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[currentObj.formatKey] + '</b></td>' : ""));
                                        }
                                    }
                                };
                            }
                        }
                        return temp;
                    };
                    var getBubbleChartTooltip = function () {
                        var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                        var format = getWijmoConfigurationFormatCallback(scope.valueList[0].configurationValue, scope.valueList[0].filterType);
                        var colorFormat = getWijmoConfigurationFormatCallback(scope.valueList[1].configurationValue, scope.valueList[1].filterType);
                        var colorConfigFormat = (scope.valueList.length > 2) ? getWijmoConfigurationFormatCallback(scope.valueList[2].configurationValue, scope.valueList[2].filterType) : '';
                        if (scope.rowList.length == 1 && scope.valueList.length == 2 && scope.columnList.length == 0) {
                            return {
                                useHTML: true,
                                headerFormat: '<span style="font-size:10px">',
                                // pointFormat: metricObjects[0] + ' : <b>{point.y:,.2f}</b>' + '<br>' + metricObjects[1] + ' : <b>{point.z:,.2f}</b>',
                                pointFormatter: function () {
                                    return (scope.valueList[0].displayName + ':' + '<b>'
                                        + (scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != null && scope.valueList[0].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && format == "" ? report.resources.FormatType[scope.valueList[0].formatKey] : '')
                                        + utilities.formatChartTooltip(this.y, format)
                                        + (scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != null && format == "" && (scope.valueList[0].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[0].formatKey] : '')
                                        + '</b><br>'
                                        + (scope.valueList[1].displayName + ':'
                                            + ' <b> '
                                            + (scope.valueList[1].formatKey != "" && scope.valueList[1].formatKey != null && scope.valueList[1].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && colorFormat == "" ? report.resources.FormatType[scope.valueList[1].formatKey] : '')
                                            + '' + utilities.formatChartTooltip(this.z, colorFormat)
                                            + (scope.valueList[1].formatKey != "" && scope.valueList[1].formatKey != null && colorFormat == "" && (scope.valueList[1].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[1].formatKey] : '')
                                            + '</b>'));
                                },
                                footerFormat: '</span>'
                            };
                        }
                        else if (scope.rowList.length >= 1 && scope.valueList.length == 3 && scope.columnList.length == 0) {
                            return {
                                useHTML: true,
                                headerFormat: '<span style="font-size:10px">',
                                // pointFormat: '{point.header}' + '<br>' + metricObjects[0] + ' : <b>{point.x}</b>' + '<br>' + metricObjects[1] + ' : <b>{point.y}</b>' + '<br>' + metricObjects[2] + ' : <b>{point.z}</b>',
                                pointFormatter: function () {
                                    return (this.header + '<br>'
                                        + scope.valueList[0].displayName + ':' + '<b>'
                                        + (scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != null && scope.valueList[0].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && format == "" ? report.resources.FormatType[scope.valueList[0].formatKey] : '')
                                        + utilities.formatChartTooltip(this.x, format)
                                        + (scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != null && format == "" && (scope.valueList[0].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[0].formatKey] : '')
                                        + '</b><br>'
                                        + scope.valueList[1].displayName + ':'
                                        + ' <b> '
                                        + (scope.valueList[1].formatKey != "" && scope.valueList[1].formatKey != null && scope.valueList[1].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && colorFormat == "" ? report.resources.FormatType[scope.valueList[1].formatKey] : '')
                                        + '' + utilities.formatChartTooltip(this.y, colorFormat)
                                        + (scope.valueList[1].formatKey != "" && scope.valueList[1].formatKey != null && colorFormat == "" && (scope.valueList[1].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[1].formatKey] : '')
                                        + '</b><br>'
                                        + (scope.valueList[2].displayName + ':'
                                            + ' <b> '
                                            + (scope.valueList[2].formatKey != "" && scope.valueList[2].formatKey != null && scope.valueList[2].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && colorConfigFormat == "" ? report.resources.FormatType[scope.valueList[2].formatKey] : '')
                                            + '' + utilities.formatChartTooltip(this.z, colorConfigFormat)
                                            + (scope.valueList[2].formatKey != "" && scope.valueList[2].formatKey != null && colorConfigFormat == "" && (scope.valueList[2].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[2].formatKey] : '')
                                            + '</b>'));
                                },
                                footerFormat: '</span>'
                            };
                        }
                        else if (scope.rowList.length == 0 && scope.valueList.length == 3 && scope.columnList.length == 0) {
                            return {
                                useHTML: true,
                                headerFormat: '<span style="font-size:10px">',
                                // pointFormat: metricObjects[0] + ' : <b>{point.x:,.2f}</b>' + '<br>' + metricObjects[1] + ' : <b>{point.y:,.2f}</b>' + '<br>' + metricObjects[2] + ' : <b>{point.z:,.2f}</b>',
                                pointFormatter: function () {
                                    return (scope.valueList[0].displayName + ':' + '<b>'
                                        + (scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != null && scope.valueList[0].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && format == "" ? report.resources.FormatType[scope.valueList[0].formatKey] : '')
                                        + utilities.formatChartTooltip(this.x, format)
                                        + (scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != null && format == "" && (scope.valueList[0].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[0].formatKey] : '')
                                        + '</b><br>'
                                        + scope.valueList[1].displayName + ':'
                                        + ' <b> '
                                        + (scope.valueList[1].formatKey != "" && scope.valueList[1].formatKey != null && scope.valueList[1].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && colorFormat == "" ? report.resources.FormatType[scope.valueList[1].formatKey] : '')
                                        + '' + utilities.formatChartTooltip(this.y, colorFormat)
                                        + (scope.valueList[1].formatKey != "" && scope.valueList[1].formatKey != null && colorFormat == "" && (scope.valueList[1].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[1].formatKey] : '')
                                        + '</b><br>'
                                        + (scope.valueList[2].displayName + ':'
                                            + ' <b> '
                                            + (scope.valueList[2].formatKey != "" && scope.valueList[2].formatKey != null && scope.valueList[2].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && colorConfigFormat == "" ? report.resources.FormatType[scope.valueList[2].formatKey] : '')
                                            + '' + utilities.formatChartTooltip(this.z, colorConfigFormat)
                                            + (scope.valueList[2].formatKey != "" && scope.valueList[2].formatKey != null && colorConfigFormat == "" && (scope.valueList[2].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[2].formatKey] : '')
                                            + '</b>'));
                                },
                                footerFormat: '</span>'
                            };
                        }
                        else {
                            return {
                                headerFormat: '{series.name}',
                                // pointFormat: '<br>' + metricObjects[0] + ' : <b>{point.x:,.2f}</b>' + '<br>' + metricObjects[1] + ' : <b>{point.y:,.2f}</b>' + '<br>' + metricObjects[2] + ' : <b>{point.z:,.2f}</b>',
                                pointFormatter: function () {
                                    return ('<br>'
                                        + scope.valueList[0].displayName + ':' + '<b>'
                                        + (scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != null && scope.valueList[0].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && format == "" ? report.resources.FormatType[scope.valueList[0].formatKey] : '')
                                        + utilities.formatChartTooltip(this.x, format)
                                        + (scope.valueList[0].formatKey != "" && scope.valueList[0].formatKey != null && format == "" && (scope.valueList[0].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[0].formatKey] : '')
                                        + '</b><br>'
                                        + scope.valueList[1].displayName + ':'
                                        + ' <b> '
                                        + (scope.valueList[1].formatKey != "" && scope.valueList[1].formatKey != null && scope.valueList[1].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && colorFormat == "" ? report.resources.FormatType[scope.valueList[1].formatKey] : '')
                                        + '' + utilities.formatChartTooltip(this.y, colorFormat)
                                        + (scope.valueList[1].formatKey != "" && scope.valueList[1].formatKey != null && colorFormat == "" && (scope.valueList[1].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[1].formatKey] : '')
                                        + '</b><br>'
                                        + (scope.valueList[2].displayName + ':'
                                            + ' <b> '
                                            + (scope.valueList[2].formatKey != "" && scope.valueList[2].formatKey != null && scope.valueList[2].formatKey != report.resources.CommonConstants.Percent && currenyBeforeAmount && colorConfigFormat == "" ? report.resources.FormatType[scope.valueList[2].formatKey] : '')
                                            + '' + utilities.formatChartTooltip(this.z, colorConfigFormat)
                                            + (scope.valueList[2].formatKey != "" && scope.valueList[2].formatKey != null && colorConfigFormat == "" && (scope.valueList[2].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[2].formatKey] : '')
                                            + '</b>'));
                                }
                            };
                        }
                    };
                    var getType = function (i) {
                        var type = getStackChartType();
                        return i < scope.$parent.vm.columnCount ? type : 'spline';
                    };
                    var createMultichart = function () {
                        scope.showDataLabels = scope.$parent.vm.showDataLabels;
                        if (scope.chartstates.length != 0)
                            rowelIndex = scope.chartstates.length - 1;
                        var multiChartConfig = {
                            xAxis: {
                                categories: createXAxis(),
                                crosshair: {
                                    color: "none"
                                },
                            },
                            plotOptions: {
                                series: {
                                    dataLabels: {
                                        enabled: !scope.renderOnPopup ? scope.showDataLabels : false,
                                        allowOverlap: false,
                                        crop: false,
                                        overflow: 'none',
                                        cursor: 'pointer',
                                        style: {
                                            fontWeight: 'normal',
                                            textShadow: 'none',
                                            fontSize: scope.selectedFontSize + "px"
                                        },
                                        color: '#333',
                                        states: {
                                            inactive: {
                                                opacity: 1
                                            }
                                        }
                                    },
                                }
                            },
                            chart: {
                                type: 'multi',
                                zoomType: 'xy',
                                events: {
                                    render: function () {
                                        var series = this.series;
                                        //var data = [{}];
                                        var data = series[0].points;
                                        var data1 = series[1].points;
                                        if (series.length == 2) {
                                            series[0].points.forEach(function (point, index) {
                                                if (point.series.options.dataLabels.enabled == true) {
                                                    var first = (series[1].points[index].plotY < point.plotY ? (point.plotY - series[1].points[index].plotY) : (series[1].points[index].plotY - point.plotY));
                                                    if (Math.abs(first) < 1) {
                                                        if (point.dataLabel != undefined) {
                                                            point.dataLabel.attr({
                                                                translateY: point.dataLabel.y + 20
                                                            });
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        if (series.length == 3) {
                                            series[2].points.forEach(function (point, index) {
                                                if (point.series.options.dataLabels.enabled == true) {
                                                    var first = (series[1].points[index].plotY < point.plotY ? (point.plotY - series[1].points[index].plotY) : (series[1].points[index].plotY - point.plotY));
                                                    console.log("data", data);
                                                    if (Math.abs(first) < 1) {
                                                        if (point.dataLabel != undefined) {
                                                            point.dataLabel.attr({
                                                                translateY: point.dataLabel.y + 20
                                                            });
                                                        }
                                                    }
                                                    data.forEach(function (point, index) {
                                                        var second = (series[1].points[index].plotY < point.plotY ? (point.plotY - series[1].points[index].plotY) : (series[1].points[index].plotY - point.plotY));
                                                        if (Math.abs(second) < 1) {
                                                            if (point.dataLabel != undefined) {
                                                                point.dataLabel.attr({
                                                                    translateY: point.dataLabel.y - 10
                                                                });
                                                            } //point.dataLabel.attr({
                                                        }
                                                    });
                                                    data.forEach(function (point, index) {
                                                        var second = (series[2].points[index].plotY < point.plotY ? (point.plotY - series[2].points[index].plotY) : (series[2].points[index].plotY - point.plotY));
                                                        if (Math.abs(second) < 1) {
                                                            if (point.dataLabel != undefined) {
                                                                point.dataLabel.attr({
                                                                    translateY: point.dataLabel.y - 40
                                                                });
                                                            }
                                                        }
                                                    });
                                                    data1.forEach(function (point, index) {
                                                        var third = (series[0].points[index].plotY < point.plotY ? (point.plotY - series[1].points[index].plotY) : (series[1].points[index].plotY - point.plotY));
                                                        if (Math.abs(third) < 1) {
                                                            if (point.dataLabel != undefined) {
                                                                point.dataLabel.attr({
                                                                    translateY: point.dataLabel.y - 20
                                                                });
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        if (series.length == 4) {
                                            var data = series[2].points;
                                            var data1 = series[1].points;
                                            series[3].points.forEach(function (point, index) {
                                                if (point.series.options.dataLabels.enabled == true) {
                                                    var first = (series[1].points[index].plotY < point.plotY ? (point.plotY - series[1].points[index].plotY) : (series[1].points[index].plotY - point.plotY));
                                                    console.log("data", data);
                                                    if (Math.abs(first) < 1) {
                                                        if (point.dataLabel != undefined) {
                                                            point.dataLabel.attr({
                                                                translateY: point.dataLabel.y + 20
                                                            });
                                                        }
                                                    }
                                                    data.forEach(function (point, index) {
                                                        var second = (series[1].points[index].plotY < point.plotY ? (point.plotY - series[1].points[index].plotY) : (series[1].points[index].plotY - point.plotY));
                                                        if (Math.abs(second) < 1) {
                                                            if (point.dataLabel != undefined) {
                                                                point.dataLabel.attr({
                                                                    translateY: point.dataLabel.y - 10
                                                                });
                                                            } //point.dataLabel.attr({
                                                        }
                                                    });
                                                    data.forEach(function (point, index) {
                                                        var second = (series[2].points[index].plotY < point.plotY ? (point.plotY - series[2].points[index].plotY) : (series[2].points[index].plotY - point.plotY));
                                                        if (Math.abs(second) < 1) {
                                                            if (point.dataLabel != undefined) {
                                                                point.dataLabel.attr({
                                                                    translateY: point.dataLabel.y - 40
                                                                });
                                                            } //point.dataLabel.attr({
                                                        }
                                                    });
                                                    data1.forEach(function (point, index) {
                                                        var third = (series[0].points[index].plotY < point.plotY ? (point.plotY - series[1].points[index].plotY) : (series[1].points[index].plotY - point.plotY));
                                                        if (Math.abs(third) < 1) {
                                                            if (point.dataLabel != undefined) {
                                                                point.dataLabel.attr({
                                                                    translateY: point.dataLabel.y - 20
                                                                });
                                                            } //point.dataLabel.attr({
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        if (series.length == 5) {
                                            var data = series[3].points;
                                            var data1 = series[2].points;
                                            var data2 = series[0].points;
                                            series[4].points.forEach(function (point, index) {
                                                if (point.series.options.dataLabels.enabled == true) {
                                                    var first = (series[1].points[index].plotY < point.plotY ? (point.plotY - series[1].points[index].plotY) : (series[1].points[index].plotY - point.plotY));
                                                    console.log("data", data);
                                                    if (Math.abs(first) < 1) {
                                                        if (point.dataLabel != undefined) {
                                                            point.dataLabel.attr({
                                                                translateY: point.dataLabel.y + 20
                                                            });
                                                        } //point.dataLabel.attr({
                                                    }
                                                    data.forEach(function (point, index) {
                                                        var second = (series[1].points[index].plotY < point.plotY ? (point.plotY - series[1].points[index].plotY) : (series[1].points[index].plotY - point.plotY));
                                                        if (Math.abs(second) < 1) {
                                                            if (point.dataLabel != undefined) {
                                                                point.dataLabel.attr({
                                                                    translateY: point.dataLabel.y - 10
                                                                });
                                                            }
                                                        }
                                                    });
                                                    data.forEach(function (point, index) {
                                                        var second = (series[2].points[index].plotY < point.plotY ? (point.plotY - series[2].points[index].plotY) : (series[2].points[index].plotY - point.plotY));
                                                        if (Math.abs(second) < 1) {
                                                            if (point.dataLabel != undefined) {
                                                                point.dataLabel.attr({
                                                                    translateY: point.dataLabel.y - 10
                                                                });
                                                            }
                                                        }
                                                    });
                                                    data1.forEach(function (point, index) {
                                                        var third = (series[0].points[index].plotY < point.plotY ? (point.plotY - series[1].points[index].plotY) : (series[1].points[index].plotY - point.plotY));
                                                        if (Math.abs(third) < 1) {
                                                            if (point.dataLabel != undefined) {
                                                                point.dataLabel.attr({
                                                                    translateY: point.dataLabel.y - 20
                                                                });
                                                            }
                                                        }
                                                    });
                                                    data2.forEach(function (point, index) {
                                                        var third = (series[0].points[index].plotY < point.plotY ? (point.plotY - series[1].points[index].plotY) : (series[1].points[index].plotY - point.plotY));
                                                        if (Math.abs(third) < 1) {
                                                            if (point.dataLabel != undefined) {
                                                                point.dataLabel.attr({
                                                                    translateY: point.dataLabel.y + 40
                                                                });
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            credits: { enabled: false },
                            exporting: {
                                chartOptions: {
                                    chart: {
                                        height: 1000,
                                        width: 1000,
                                    },
                                    legend: {
                                        navigation: {
                                            enabled: false
                                        },
                                        alignColumns: true
                                    },
                                    title: {
                                        text: createGraphTitle(rowelIndex)
                                    }
                                },
                                enabled: false,
                            },
                            yAxis: (function () {
                                var temp = [];
                                var yAxis_color;
                                for (var i = 0; i < metricObjects.length; i++) {
                                    if (scope.columnList.length > 0) {
                                        yAxis_color = '#000000';
                                    }
                                    else
                                        yAxis_color = getSeriesColor(metricObjects[i], i);
                                    temp[i] = {};
                                    temp[i].max = masterJson[rowelIndex].maxYAxis.length ? masterJson[rowelIndex].maxYAxis[i] : null;
                                    temp[i].min = masterJson[rowelIndex].minYAxis.length ? masterJson[rowelIndex].minYAxis[i] : null;
                                    temp[i].labels = {
                                        style: {
                                            color: yAxis_color
                                        }
                                    };
                                    temp[i].labels.formatter = function () {
                                        return parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+9
                                            ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+9).toFixed(1))) + "B"
                                            : parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+6
                                                ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+6).toFixed(1))) + "M"
                                                : parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+3
                                                    ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+3).toFixed(1))) + "K"
                                                    : utilities.globalizeNumber(this.value);
                                    };
                                    temp[i].title = {
                                        text: metricObjects[i],
                                        style: {
                                            color: yAxis_color
                                        }
                                    };
                                    temp[i].opposite = i % 2;
                                }
                                return temp;
                            }()),
                            //scrollbar: { enabled: true, showFull: false },
                            title: {
                                align: 'left',
                                text: ''
                            },
                            init: false,
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
                            lang: {
                                decimalPoint: utilities.globalizeDecimalOptionsForChart(),
                                thousandsSep: utilities.globalizeThousandsSepOptionsForChart()
                            },
                            series: (function () {
                                var temp = [];
                                var seriesObject;
                                var clickCount = 0;
                                if ((columnObjects.length > 0 && rowObjects.length == 0
                                    && (scope.activeChart.name == "Stacked Column Chart" || scope.activeChart.name == "Line Chart"))) {
                                    seriesObject = columnObjects;
                                }
                                else if (rowObjects.length != 0)
                                    seriesObject = columnObjects.length ? columnObjects : metricObjects;
                                else if (rowObjects.length == 0)
                                    seriesObject = metricObjects;
                                var currentObj;
                                if (scope.activeChart.name == "Multiple Axis Chart" && scope.columnList.length > 0 && scope.valueList.length > 0) {
                                    var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                                    var rowName = scope.rowList[rowelIndex].displayName;
                                    var columnName = scope.columnList[0].displayName;
                                    var currentMetricObj = void 0;
                                    var currentColumnObject = void 0;
                                    var k = 0;
                                    for (var i = 0; i < metricObjects.length; i++) {
                                        currentMetricObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects[i]; });
                                        var configFormat = getWijmoConfigurationFormatCallback(currentMetricObj.configurationValue, currentMetricObj.filterType);
                                        var _loop_3 = function () {
                                            temp[k] = {};
                                            currentColumnObject = _.find(scope.columnList, function (item) { return item.reportObjectName == columnObjects[j]; });
                                            //Set tooltip
                                            temp[k].tooltip = {
                                                headerFormat: '<span style="font-size:10px">' + (scope.rowList.length > 0 ? scope.rowList[scope.chartstates.length > 0 ? scope.chartstates.length - 1 : 0].reportObjectName + '<br/>' : "") + '<span style="font-size:10px">{point.key}<br/></span></span>',
                                                format: configFormat,
                                                formatKey: currentMetricObj.formatKey,
                                                currenyBeforeAmount: currenyBeforeAmount,
                                                footerFormat: '</table>',
                                                shared: true,
                                                useHTML: true,
                                                pointFormatter: function () {
                                                    return '<table><tr><td style="padding:0">' + this.series.name + ':</td>' +
                                                        (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey != report.resources.CommonConstants.Percent && this.series.userOptions.tooltip && this.series.userOptions.tooltip.format == "" ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "") +
                                                        '<td style="padding:0"><b>' + utilities.formatChartTooltip(this.y, this.series.userOptions.tooltip.format) + '</b></td></tr>' +
                                                        (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey && this.series.userOptions.tooltip.format == "" && (this.series.userOptions.tooltip.formatKey == report.resources.CommonConstants.Percent || !this.series.userOptions.tooltip.currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "");
                                                }
                                            };
                                            //Data Label
                                            temp[k].dataLabels = {
                                                formatter: function () {
                                                    return '<span style="color: ' + this.color + '">' + (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey != report.resources.CommonConstants.Percent && this.series.userOptions.tooltip && this.series.userOptions.tooltip.format == "" ? report.resources.FormatType[this.series.userOptions.tooltip.formatKey] : "") +
                                                        utilities.formatChartTooltip(this.y, this.series.userOptions.tooltip.format) +
                                                        (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey && this.series.userOptions.tooltip.format == "" && (this.series.userOptions.tooltip.formatKey == report.resources.CommonConstants.Percent || !this.series.userOptions.tooltip.currenyBeforeAmount) ? report.resources.FormatType[this.series.userOptions.tooltip.formatKey] : "");
                                                    +'</span>';
                                                }
                                            },
                                                //Chart type
                                                temp[k].cursor = 'pointer';
                                            temp[k].type = chartType;
                                            if (chartType == 'stColumn') {
                                                temp[k].type = "column";
                                                temp[k].stacking = 'normal';
                                            }
                                            //Y AXIS
                                            if (i < metricObjects.length) {
                                                temp[k].yAxis = i;
                                            }
                                            //Series style
                                            temp[k].type = "column";
                                            if (i > 0) {
                                                temp[k].type = "spline";
                                                temp[k].dashStyle = i > 1 ? 'shortdot' : "";
                                            }
                                            //name and color
                                            temp[k].name = columnObjects[j] + "-" + metricObjects[i];
                                            temp[k].color = getSeriesColor(columnObjects[j], j);
                                            //data
                                            //Filter currentJson with current columnValue
                                            //and map the current metric value to dataArray
                                            var dataArr = [];
                                            for (var k_1 = 0; k_1 < rowObjects.length; k_1++) {
                                                var searchObject = {};
                                                searchObject[columnName] = columnObjects[j];
                                                searchObject[rowName] = rowObjects[k_1];
                                                var filteredcolumnJson = _.where(currentJson, searchObject);
                                                if (filteredcolumnJson.length > 0)
                                                    dataArr.push(filteredcolumnJson[0][metricObjects[i]]);
                                                else
                                                    dataArr.push(null);
                                            }
                                            if ((configFormat != undefined && configFormat[0] == 'p') || currentMetricObj.formatKey == report.resources.CommonConstants.Percent) {
                                                angular.forEach(dataArr, function (value, index) {
                                                    if (value != null) {
                                                        if (value.hasOwnProperty('y')) {
                                                            value.y = value.y * 100;
                                                        }
                                                        else {
                                                            dataArr[index] = value * 100;
                                                        }
                                                    }
                                                }, dataArr);
                                            }
                                            temp[k].data = dataArr;
                                            //events
                                            if (!scope.renderOnPopup) {
                                                temp[k].events = {
                                                    click: function (e) {
                                                        clickCount += 1;
                                                        var category = "";
                                                        if (clickCount == 1) {
                                                            if (scope.activeChart.name == "Pie Chart" || scope.activeChart.name == "Donut Chart") {
                                                                category = e.point.name.split(':')[0];
                                                            }
                                                            else {
                                                                category = e.point.category;
                                                            }
                                                            jumpToState(category);
                                                            setTimeout(function () {
                                                                scope.$digest();
                                                            });
                                                        }
                                                    }
                                                };
                                            }
                                            k++;
                                        };
                                        for (var j = 0; j < columnObjects.length; j++) {
                                            _loop_3();
                                        }
                                    }
                                }
                                else {
                                    for (var i = 0; i < seriesObject.length; i++) {
                                        if ((columnObjects.length > 0 && rowObjects.length == 0
                                            && (scope.activeChart.name == "Stacked Column Chart" || scope.activeChart.name == "Line Chart"))
                                            || scope.valueList.length == 1)
                                            currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects; });
                                        else
                                            currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == seriesObject[i]; });
                                        temp[i] = {};
                                        var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                                        var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                                        temp[i].tooltip = {
                                            headerFormat: '<span style="font-size:10px">' + (scope.rowList.length > 0 ? scope.rowList[scope.chartstates.length > 0 ? scope.chartstates.length - 1 : 0].reportObjectName + '<br/>' : "") + '<span style="font-size:10px">{point.key}<br/></span></span>',
                                            format: configFormat,
                                            formatKey: currentObj.formatKey,
                                            currenyBeforeAmount: currenyBeforeAmount,
                                            footerFormat: '</table>',
                                            shared: true,
                                            useHTML: true,
                                            pointFormatter: function () {
                                                return '<table><tr><td style="padding:0">' + this.series.name + ':</td>' +
                                                    (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey != report.resources.CommonConstants.Percent && this.series.userOptions.tooltip && this.series.userOptions.tooltip.format == "" ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "") +
                                                    '<td style="padding:0"><b>' + utilities.formatChartTooltip(this.y, this.series.userOptions.tooltip.format) + '</b></td></tr>' +
                                                    (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey && this.series.userOptions.tooltip.format == "" && (this.series.userOptions.tooltip.formatKey == report.resources.CommonConstants.Percent || !this.series.userOptions.tooltip.currenyBeforeAmount) ? '<td><b>' + report.resources.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "");
                                            }
                                        };
                                        temp[i].dataLabels = {
                                            formatter: function () {
                                                return (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey != report.resources.CommonConstants.Percent && this.series.userOptions.tooltip && this.series.userOptions.tooltip.format == "" ? report.resources.FormatType[this.series.userOptions.tooltip.formatKey] : "") +
                                                    utilities.formatChartTooltip(this.y, this.series.userOptions.tooltip.format) +
                                                    (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey && this.series.userOptions.tooltip.format == "" && (this.series.userOptions.tooltip.formatKey == report.resources.CommonConstants.Percent || !this.series.userOptions.tooltip.currenyBeforeAmount) ? report.resources.FormatType[this.series.userOptions.tooltip.formatKey] : "");
                                            }
                                        },
                                            temp[i].cursor = 'pointer';
                                        temp[i].type = chartType;
                                        if (chartType == 'stColumn') {
                                            temp[i].type = "column";
                                            temp[i].stacking = 'normal';
                                        }
                                        if (i < metricObjects.length) {
                                            temp[i].yAxis = i;
                                        }
                                        temp[i].type = "column";
                                        if (i > 0) {
                                            temp[i].type = "spline";
                                            temp[i].dashStyle = i > 1 ? 'shortdot' : "";
                                        }
                                        temp[i].name = seriesObject[i];
                                        temp[i].color = getSeriesColor(seriesObject[i], i);
                                        temp[i].data = createSeriesData(seriesObject, i);
                                        if (!scope.renderOnPopup) {
                                            temp[i].events = {
                                                click: function (e) {
                                                    var category = "";
                                                    if (scope.activeChart.name == "Pie Chart" || scope.activeChart.name == "Donut Chart") {
                                                        category = e.point.name.split(':')[0];
                                                    }
                                                    else {
                                                        category = e.point.category;
                                                    }
                                                    jumpToState(category);
                                                    setTimeout(function () {
                                                        scope.$digest();
                                                    });
                                                }
                                            };
                                        }
                                    }
                                }
                                return temp;
                            }())
                        };
                        if (!scope.renderOnPopup) {
                            $('#multi-chart-container').highcharts(multiChartConfig); //Modified By: Sumit Kumar, ModifiedDate: 03/06/2020, Modified Reason: CLI-151471 and Display Lengend full text value dynamically control by highchart only.
                            scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                        }
                        else {
                            $("#chart-container-popup").highcharts(multiChartConfig);
                        }
                    };
                    var createParetoChart = function () {
                        var clickCount = 0;
                        var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                        scope.showDataLabels = scope.$parent.vm.showDataLabels;
                        var currentObj = _.find(scope.valueList, function (item) { return item.reportObjectName == metricObjects; });
                        var configFormat = getWijmoConfigurationFormatCallback(currentObj.configurationValue, currentObj.filterType);
                        var currencyFormatKey = ((currenyBeforeAmount && currentObj.formatKey != ""
                            && currentObj.formatKey != null
                            && currentObj.formatKey != report.resources.CommonConstants.Percent) ?
                            report.resources.FormatType[currentObj.formatKey] : '');
                        var paretoChartConfig = {
                            title: {
                                text: ''
                            },
                            colors: ['#f44336', '#2196f3'],
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
                            tooltip: {
                                format: configFormat,
                                formatter: function () {
                                    var y = this.y.toFixed(2);
                                    var x = this.x;
                                    if (this.points[1] == undefined) {
                                        if (this.points[0].series.name == metricObjects) {
                                            return x + ("<br/>" + metricObjects + ":") + '<b>' + (this.y, this.points[0].series.tooltipOptions.format != '' ? utilities.formatChartTooltip(this.points[0].y, this.points[0].series.tooltipOptions.format) : (currencyFormatKey + Highcharts.numberFormat(this.points[0].y, 0, '.', ',')) + '</b>' + '</b>');
                                        }
                                        else {
                                            return x + '<br/>' + report.resources.ParetoChartConstants.CumulativePercentage + ': <b>' + this.points[0].y.toFixed(2) + '%' + '</b>';
                                        }
                                    }
                                    else {
                                        return x + '<br/>' +
                                            report.resources.ParetoChartConstants.CumulativePercentage + ': <b>' + y + '% </b>' +
                                            ("<br/>" + metricObjects + ": ") + '<b>' +
                                            //Highcharts.numberFormat(this.points[1].y, 0, '.', ',') + '</b>';
                                            (this.y, this.points[0].series.tooltipOptions.format != '' ? utilities.formatChartTooltip(this.points[1].y, this.points[0].series.tooltipOptions.format) : (currencyFormatKey + Highcharts.numberFormat(this.points[1].y, 0, '.', ',')) + '</b>' + '</b>');
                                    }
                                },
                                shared: true
                            },
                            credits: {
                                enabled: false
                            },
                            xAxis: [{
                                categories: createXAxis()
                            }],
                            yAxis: [{
                                title: {
                                    text: metricObjects[0]
                                },
                                labels: {
                                    formatter: function () {
                                        return parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+9
                                            ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+9).toFixed(1))) + "B"
                                            : parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+6
                                                ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+6).toFixed(1))) + "M"
                                                : parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+3
                                                    ? utilities.globalizeNumber(parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+3).toFixed(1))) + "K"
                                                    : utilities.globalizeNumber(this.value);
                                    }
                                }
                            }, {
                                title: {
                                    text: report.resources.ParetoChartConstants.CumulativePercentage
                                },
                                minPadding: 0,
                                maxPadding: 0,
                                max: 100+1,
                                min: 0,
                                opposite: true,
                                startOnTick: false,
                                labels: {
                                    format: "{value}%"
                                },
                            }],
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
                                        },
                                    },
                                    cursor: 'pointer',
                                    events: {
                                        click: function (e) {
                                            if (!scope.renderOnPopup) {
                                                clickCount += 1;
                                                if (clickCount == 1) {
                                                    var category = "";
                                                    category = e.point.category;
                                                    jumpToState(category);
                                                    setTimeout(function () {
                                                        scope.$digest();
                                                    });
                                                }
                                            }
                                        },
                                        legendItemClick: function (event) {
                                            if (!scope.renderOnPopup) {
                                                if (this.visible && this.name === metricObjects) {
                                                    this.chart.yAxis[0].update({
                                                        opposite: true,
                                                        title: {
                                                            text: ''
                                                        }
                                                    });
                                                    this.chart.yAxis[1].update({
                                                        opposite: false
                                                    });
                                                }
                                                else if (!this.visible && this.name === metricObjects) {
                                                    this.chart.yAxis[0].update({
                                                        opposite: false,
                                                        title: {
                                                            text: metricObjects
                                                        }
                                                    });
                                                    this.chart.yAxis[1].update({
                                                        opposite: true
                                                    });
                                                }
                                            }
                                        }
                                    },
                                    states: {
                                        inactive: {
                                            opacity: 1
                                        }
                                    },
                                    exporting: {
                                        enabled: false
                                    }
                                }
                            },
                            chart: {
                                type: 'pareto',
                                zoomType: 'xy'
                            },
                            series: [{
                                type: 'pareto',
                                name: report.resources.ParetoChartConstants.CumulativePercentage,
                                yAxis: 1,
                                zIndex: 10,
                                baseSeries: 1,
                                dataLabels: {
                                    formatter: function () {
                                        return (this.y.toFixed(2) + '%');
                                    }
                                },
                                color: getSeriesColor(report.resources.ParetoChartConstants.CumulativePercentage, 0)
                            }, {
                                name: metricObjects[0],
                                type: 'column',
                                zIndex: 2,
                                data: getDataForPareto(),
                                dataLabels: {
                                    formatter: function () {
                                        return (this.point.series.tooltipOptions.format != '' ? utilities.formatChartTooltip(this.point.y, this.point.series.tooltipOptions.format) : (currencyFormatKey + Highcharts.numberFormat(this.point.y, 0, '.', ',')));
                                    }
                                },
                                color: getSeriesColor(metricObjects[0], 1)
                            }]
                        };
                        if (!scope.renderOnPopup) {
                            $('#pareto-chart-container').highcharts(paretoChartConfig);
                            scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                        }
                        else {
                            $("#chart-container-popup").highcharts(paretoChartConfig);
                        }
                    };
                    var getDataForPareto = function () {
                        var yAxisData = [];
                        for (var i = 0; i < currentJson.length - 1; i++) {
                            yAxisData.push(currentJson[i][metricObjects[0]]);
                        }
                        return yAxisData;
                    };
                    var getMapChartJson = function () {
                        if (scope.chartstates.length != 0)
                            rowelIndex = scope.chartstates.length - 1;
                        var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                        scope.showDataLabels = scope.$parent.vm.showDataLabels;
                        var configFormat = getWijmoConfigurationFormatCallback(scope.valueList[0].configurationValue, scope.valueList[0].filterType);
                        var colorConfigFormat = getWijmoConfigurationFormatCallback(scope.valueList[1].configurationValue, scope.valueList[1].filterType);
                        var x = {
                            colorAxis: {
                                stops: (scope.reportObjDetails.isRangeRedToGreenColor) ? [
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
                            tooltip: {
                                headerFormat: '<span style="font-size:10px">' + (scope.rowList.length > 0 ? scope.rowList[rowelIndex].displayName + '<br/>' : "") + '<span style="font-size:10px">{point.key}<br/></span></span>',
                                format: configFormat,
                                formatKey: scope.valueList[0].formatKey,
                                currenyBeforeAmount: currenyBeforeAmount,
                                displayName: scope.valueList[0].displayName,
                                colordisplayName: scope.valueList[1].displayName,
                                colorFormatKey: scope.valueList[1].formatKey,
                                colorFormat: colorConfigFormat,
                                pointFormatter: function () {
                                    return (this.series.tooltipOptions.displayName + ':' + '<b>'
                                        + (this.series.tooltipOptions.formatKey != "" && this.series.tooltipOptions.formatKey != null && this.series.tooltipOptions.formatKey != report.resources.CommonConstants.Percent && this.series.tooltipOptions.currenyBeforeAmount && this.series.tooltipOptions.format == "" ? report.resources.FormatType[this.series.tooltipOptions.formatKey] : '')
                                        + utilities.formatChartTooltip(this.value, this.series.tooltipOptions.format)
                                        + (this.series.tooltipOptions.formatKey != "" && this.series.tooltipOptions.formatKey != null && this.series.tooltipOptions.format == "" && (this.series.tooltipOptions.formatKey == report.resources.CommonConstants.Percent || !this.series.tooltipOptions.currenyBeforeAmount) ? report.resources.FormatType[this.series.tooltipOptions.formatKey] : '')
                                        + '</b><br>'
                                        + this.series.tooltipOptions.colordisplayName + ':'
                                        + ' <b> '
                                        + (this.series.tooltipOptions.colorFormatKey != "" && this.series.tooltipOptions.colorFormatKey != null && this.series.tooltipOptions.colorFormatKey != report.resources.CommonConstants.Percent && this.series.tooltipOptions.currenyBeforeAmount && this.series.tooltipOptions.colorFormat == "" ? report.resources.FormatType[this.series.tooltipOptions.colorFormatKey] : '')
                                        + '' + utilities.formatChartTooltip(this.colorValue, this.series.tooltipOptions.colorFormat)
                                        + (this.series.tooltipOptions.colorFormatKey != "" && this.series.tooltipOptions.colorFormatKey != null && this.series.tooltipOptions.colorFormat == "" && (this.series.tooltipOptions.colorFormatKey == report.resources.CommonConstants.Percent || !this.series.tooltipOptions.currenyBeforeAmount) ? report.resources.FormatType[this.series.tooltipOptions.colorFormatKey] : '')
                                        + '</b>');
                                }
                            },
                            credits: { enabled: false },
                            series: [{
                                type: 'treemap',
                                layoutAlgorithm: 'squarified',
                                events: {
                                    click: function (e) {
                                        var category = "";
                                        category = e.point.name;
                                        jumpToState(category);
                                        setTimeout(function () {
                                            scope.$digest();
                                        });
                                    }
                                },
                                cursor: 'pointer',
                                data: createMapSeriesData(scope.rowList[rowelIndex].displayName),
                                dataLabels: {
                                    enabled: true,
                                    style: {
                                        fontWeight: 'normal',
                                        textShadow: 'none',
                                        fontSize: scope.selectedFontSize + "px"
                                    },
                                    formatter: function () {
                                        if (scope.showDataLabels) {
                                            return (this.series.tooltipOptions.formatKey != "" && this.series.tooltipOptions.formatKey != null && this.series.tooltipOptions.formatKey != report.resources.CommonConstants.Percent && this.series.tooltipOptions.currenyBeforeAmount && this.series.tooltipOptions.format == "" ? report.resources.FormatType[this.series.tooltipOptions.formatKey] : '')
                                                + utilities.formatChartTooltip(this.point.value, configFormat);
                                            +(this.series.tooltipOptions.formatKey != "" && this.series.tooltipOptions.formatKey != null && this.series.tooltipOptions.format == "" && (this.series.tooltipOptions.formatKey == report.resources.CommonConstants.Percent || !this.series.tooltipOptions.currenyBeforeAmount) ? report.resources.FormatType[this.series.tooltipOptions.formatKey] : '');
                                        }
                                        else {
                                            return utilities.formatChartTooltip(this.point.name, configFormat);
                                        }
                                    }
                                },
                            }],
                            title: {
                                align: 'left',
                                text: ''
                            },
                            lang: {
                                decimalPoint: utilities.globalizeDecimalOptionsForChart(),
                                thousandsSep: utilities.globalizeThousandsSepOptionsForChart()
                            },
                            plotOptions: {
                                dataLabels: {
                                    enabled: scope.showDataLabels,
                                    allowOverlap: true,
                                    crop: false,
                                    overflow: 'none',
                                    style: {
                                        fontWeight: 'normal',
                                        textShadow: 'none',
                                        fontSize: scope.selectedFontSize + "px"
                                    },
                                    //color: '#000000',
                                    states: {
                                        inactive: {
                                            opacity: 1
                                        }
                                    },
                                }
                            },
                            exporting: {
                                allowHTML: true,
                                enabled: false,
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
                            legend: {
                                //align: 'center',
                                //maxHeight: 40,
                                //verticalAlign: 'bottom',
                                //x: 0,
                                //y: 23,
                                //itemWidth: 140,
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
                                },
                                labelFormatter: scope.activeChart.name == 'Pie Chart' ? function () {
                                    return this.name.slice(0, this.name.lastIndexOf(":"));
                                } : function () { return this.name; }
                            }
                        };
                        if (!scope.renderOnPopup) {
                            $('#tree-chart-container').highcharts(x);
                            scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                        }
                        else {
                            $("#chart-container-popup").highcharts(x);
                        }
                    };
                    //<================================ Map Chart Code Implementation=========================================>
                    var map, azureSearchService, azureDataSource, azurePopup;
                    var mapChartData = [];
                    var chartOptions = {
                        columnChartConfig: {
                            maxHeight: 2,
                            barWidth: 5,
                        },
                        pieChartConfig: {
                            minRadius: 5,
                            maxRadius: 65,
                        },
                        colors: ['#2196f3', '#f44336', '#ff9800', '#4caf50', '#9c27b0', '#3f51b5', '#00bcd4', '#e91e63', '#8bc34a', '#c62828', '#ef6c00', '#795548', '#9e9e9e', '#607d8b', '#1565c0', '#ad1457', '#4527a0', '#00838f', '#4e342e', '#37474f'],
                        legend: [],
                        strokeThickness: 1,
                        strokeColor: '#666666'
                    };
                    var masterMapChartRecords = [];
                    scope.plotBingMaps = function () {

                        var i, maxValue = 0;
                        //Loop through the mock data and calculate the max total value so that pushpins can be scaled relatively.
                        if (scope.valueList.length != 0) {
                            for (i = 0; i < mapChartData.length; i++) {
                                var val = mapChartData[i].values.reduce(function (sum, value) {
                                    return sum + value;
                                });
                                //While we are at it, lets cache the total value of each group for faster calculations later.
                                mapChartData[i].total = val;
                                if (val > maxValue) {
                                    maxValue = val;
                                }
                            }
                        }
                        //Loop through the mock data and create data points
                        for (i = 0; i < mapChartData.length; i++) {
                            if (mapChartData[i].loc) {
                                if (scope.columnList.length == 0 && scope.valueList.length == 0) {
                                    addSimplePointToDataSource(mapChartData[i], maxValue);
                                }
                                else {
                                    if (this.activeChart.dirtyRangeValue == "2") //column
                                        addColumnChartPointToDataSource(mapChartData[i], i, maxValue);
                                    else
                                        addPieChartPointToDataSource(mapChartData[i], i, maxValue);
                                }
                            }
                        }
                        var layer = new atlas.layer.SymbolLayer(azureDataSource, 'map-chart-symbol-layer', {
                            iconOptions: {
                                image: ['get', 'image-reference']
                            }
                        });

                        map.layers.add(layer);

                        // Close Popup once mouse moves on the map
                        map.events.add('mousemove', closePopup);
                        // Display Popup once mouse moves on a symbol
                        map.events.add('mousemove', layer, displayPopupOnMouseOver);
                        map.events.add('touchstart', layer, displayPopupOnMouseOver);
                        map.events.add('click', layer, displayInfoboxClick);
                        map.events.add('dblclick', layer, displayInfoboxDoubleClick);

                        function getRandomArbitrary(min, max) {
                            min = Math.ceil(min);
                            max = Math.floor(max);
                            return Math.floor(Math.random() * (max - min + 1)) + min;
                        }
                        function getCountOfNonNullIndices(data) {
                            var __validEleCount = 0;
                            data.values.forEach(function (_datValue, _datKey) {
                                if (_datValue != undefined && _datValue != null && _datValue != "") {
                                    __validEleCount++;
                                }
                            });
                            return __validEleCount > 1 && data.values.length > 1;
                        }
                        function addSimplePointToDataSource(data, maxValue) {
                            var dataPoint = new atlas.data.Feature(new atlas.data.Point([data.loc.longitude, data.loc.latitude]), {
                                'image-reference': 'simple-point',
                                'metadata': data
                            });

                            azureDataSource.add(dataPoint);
                        }
                        function addPieChartPointToDataSource(data, id, maxValue) {
                            var startAngle = 0, angle = 0;
                            var radius = Math.round(Math.max(data.total / maxValue * chartOptions.pieChartConfig.maxRadius, chartOptions.pieChartConfig.minRadius));
                            var diameter = 2 * (radius + chartOptions.strokeThickness);
                            var svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="', diameter, 'px" height="', diameter, 'px">'];
                            var cx = radius + chartOptions.strokeThickness, cy = radius + chartOptions.strokeThickness;
                            if (scope.columnList.length != 0 && getCountOfNonNullIndices(data)) {
                                for (var i = 0; i < data.values.length; i++) {
                                    angle = (Math.PI * 2 * (data.values[i] / data.total));
                                    svg.push(createArc(cx, cy, radius, startAngle, angle, chartOptions.colors[i]));
                                    startAngle += angle;
                                }
                            }
                            else {
                                for (var i = 0; i < data.values.length; i++) {
                                    svg.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" fill="' + chartOptions.colors[getRandomArbitrary(0, chartOptions.colors.length - 1)] + '" />');
                                }
                            }
                            svg.push('</svg>');

                            map.imageSprite.add("reference-" + id, svg.join('')).then(function () {
                                var dataPoint = new atlas.data.Feature(new atlas.data.Point([data.loc.longitude, data.loc.latitude]), {
                                    'image-reference': "reference-" + id,
                                    'metadata': data
                                });

                                azureDataSource.add(dataPoint);
                            });
                        }
                        function addColumnChartPointToDataSource(data, id, maxValue) {
                            chartOptions.columnChartConfig.maxHeight = 300;
                            var width = data.values.length * chartOptions.columnChartConfig.barWidth;
                            var svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="', width, 'px" height="', chartOptions.columnChartConfig.maxHeight, 'px">'];
                            var x, y, h;
                            for (var i = 0; i < data.values.length; i++) {
                                //Calculate the height of the bar in pixels.
                                h = Math.min(data.values[i] / maxValue * chartOptions.columnChartConfig.maxHeight, chartOptions.columnChartConfig.maxHeight);
                                //Calculate the x offset of the bar.
                                x = i * chartOptions.columnChartConfig.barWidth;
                                //Calculate the y offset of the bar such that the bottom aligns correctly.
                                y = chartOptions.columnChartConfig.maxHeight - h;
                                if (data.values.length == 1) {
                                    i = getRandomArbitrary(0, chartOptions.colors.length - 1);
                                }
                                svg.push('<rect x="', x, 'px" y="', y, 'px" width="', chartOptions.columnChartConfig.barWidth, 'px" height="', h, 'px" fill="', chartOptions.colors[i], '"/>');
                            }
                            svg.push('</svg>');

                            map.imageSprite.add("reference-" + id, svg.join('')).then(function () {
                                var dataPoint = new atlas.data.Feature(new atlas.data.Point([data.loc.longitude, data.loc.latitude]), {
                                    'image-reference': "reference-" + id,
                                    'metadata': data
                                });

                                azureDataSource.add(dataPoint);
                            });
                        }
                        function createArc(cx, cy, r, startAngle, angle, fillColor) {
                            var x1 = cx + r * Math.sin(startAngle);
                            var y1 = cy - r * Math.cos(startAngle);
                            var x2 = cx + r * Math.sin(startAngle + angle);
                            var y2 = cy - r * Math.cos(startAngle + angle);
                            //Flag for when arcs are larger than 180 degrees in radians.
                            var big = 0;
                            if (angle > Math.PI) {
                                big = 1;
                            }
                            var path = ['<path d="M ', cx, ' ', cy, ' L ', x1, ' ', y1, ' A ', r, ',', r, ' 0 ', big, ' 1 ', x2, ' ', y2,
                                ' Z" style="fill:', fillColor,
                                ';stroke:', chartOptions.strokeColor,
                                ';stroke-width:', chartOptions.strokeThickness,
                                'px;"'];
                            path.push('/>');
                            return path.join('');
                        }
                        function closePopup(e) {
                            azurePopup.close();
                        }
                        function displayPopupOnMouseOver(e) {
                            if (e.shapes[0] instanceof atlas.Shape && e.shapes[0].getType() === 'Point') {
                                var data = e.shapes[0].getProperties().metadata;
                                var description = [''];
                                var minHieght = data.values ? data.values.length >= 2 ? '100px' : '65px' : '45px';
                                var infoboxTemplate = '<div id="infoboxText" style="background-color:White; border-style:solid; border-width:medium; border-color:DarkOrange; min-height:' + minHieght + '; width: 240px; border-width:2px;border-radius:5px;">' +
                                    '<b id="infoboxTitle" style="position: absolute; top: 10px; left: 10px; width: 220px;">{title}</b>' +
                                    '<a id="infoboxDescription" style="height: calc(100% - 40px); overflow: auto; position: absolute; top: 30px; left: 16px; width: 220px;">{description}</a></div>';

                                if (data.values) {
                                    var currenyBeforeAmount = utilities.getCurrencySymbolLocation();
                                    var configFormat = getWijmoConfigurationFormatCallback(scope.valueList[0].configurationValue, scope.valueList[0].filterType);
                                    for (var i = 0; i < data.values.length; i++) {
                                        var formatedValue = (
                                            scope.valueList[0].formatKey != "" &&
                                                scope.valueList[0].formatKey != report.resources.CommonConstants.Percent &&
                                                currenyBeforeAmount && configFormat == "" ?
                                                report.resources.FormatType[scope.valueList[0].formatKey] : ''
                                        )
                                            + ''
                                            + utilities.formatChartTooltip(data.values[i], configFormat)
                                            + (
                                                scope.valueList[0].formatKey != "" &&
                                                    configFormat == "" &&
                                                    (
                                                        scope.valueList[0].formatKey == report.resources.CommonConstants.Percent || !currenyBeforeAmount) ? report.resources.FormatType[scope.valueList[0].formatKey] : ''
                                            );
                                        description.push('<span style="font-weight:bold;font-size: 8pt;color:', chartOptions.colors[i], '">', data.legends[i], '</span><span style="font-size: 8pt;font-weight:bold;color:black;"> : ', formatedValue, '<span></br>');
                                    }
                                }
                                // description.push('</table>');
                                if (azurePopup.getOptions().position !== e.shapes[0].getCoordinates()) {
                                    azurePopup.setOptions({
                                        position: e.shapes[0].getCoordinates(),
                                        content: infoboxTemplate.replace('{title}', data.name).replace('{description}', description.join('')),
                                        closeButton: true,
                                        showPointer: false,
                                        pixelOffset: [0, -20]
                                    });
                                    azurePopup.open(map);
                                }
                            }
                        }
                        function displayInfoboxDoubleClick(e) {
                            // if (e.type == "dblclick") {
                            //    jumpToState(e.shapes[0].getProperties().metadata.mainName);
                            // }
                        }
                        function displayInfoboxClick(e) {
                            if (e.type == "click") {
                                jumpToState(e.shapes[0].getProperties().metadata.mainName);
                            }
                        }
                    };
                    var createMapChart = function () {
                        var serviceCallCount = 0;
                        var plotingLocations = [];
                        //Map Object Inilization
                        if (map)
                            map.dispose();

                        scope.$parent.vm.ReportService.getAzureMapKey().then(function (data) {
                            if (data) {
                                map = new atlas.Map("map-chart-container", {
                                    view: 'Auto',
                                    authOptions: {
                                        authType: 'subscriptionKey',
                                        subscriptionKey: data
                                    }
                                });
        
                                map.events.add('ready', function (event) {
        
                                    map.imageSprite.createFromTemplate('simple-point', 'pin-round', 'blue', '#fff').then(function () {
        
                                        map.controls.add(
                                            [
                                                new atlas.control.StyleControl({
                                                    mapStyles: ['road', 'satellite', 'grayscale_light']
                                                }),
                                                new atlas.control.ZoomControl()
                                            ], {
                                            position: 'top-right'
                                        });
        
                                        //Use MapControlCredential to share authentication between a map control and the service module.
                                        var pipeline = atlas.service.MapsURL.newPipeline(new atlas.service.MapControlCredential(map));
        
                                        azurePopup = new atlas.Popup();
        
                                        azureDataSource = new atlas.source.DataSource();
        
                                        map.sources.add(azureDataSource);
        
                                        //Create an instance of the SearchURL client.
                                        azureSearchService = new atlas.service.SearchURL(pipeline);
        
                                        var getSuccessBoundaryForCharts = function (response, value) {
                                            serviceCallCount++;
                                            plottingCall(response, value).then(function (response) {
                                                if (response) {
                                                    if (serviceCallCount == plotingLocations.length) {
                                                        //console.log('Success Resolved Request');
                                                        scope.plotBingMaps();
                                                    }
                                                }
                                            });
                                        };
                                        var getErrorBoundaryForCharts = function () {
                                            serviceCallCount++;
                                            if (serviceCallCount == plotingLocations.length) {
                                                //console.log('Error Resolved Request');
                                                scope.plotBingMaps();
                                            }
                                        };
                                        var plottingCall = function (response, value) {
                                            return new Promise(function (resolve, reject) {
                                                if (response.results.length == 0) reject();
                                                var _locationInfo = response.results[0].position;
                                                mapChartData.map(function (mapChartRecValue, key) {
                                                    if (mapChartRecValue.name.toLowerCase() == value.toLowerCase()) {
                                                        mapChartData[key]['loc'] = { latitude: _locationInfo.lat, longitude: _locationInfo.lon };
                                                        resolve(true);
                                                    }
                                                });
                                            });
                                        };
        
                                        var MapChartSeriesDataPerpation = function () {
                                            masterMapChartRecords = [];
                                            currentJson[currentJson.length - 1].rowObjects.map(function (value, key) {
                                                if (scope.columnList.length == 0 && scope.valueList.length == 0) {
                                                    masterMapChartRecords.push({
                                                        name: value,
                                                        legend: [scope.rowList[rowelIndex].reportObjectName]
                                                    });
                                                }
                                                else if (scope.columnList.length == 0 && scope.rowList.length != 0 && scope.valueList.length != 0) {
                                                    masterMapChartRecords.push({
                                                        name: value,
                                                        values: [currentJson[key][scope.valueList[0].reportObjectName]],
                                                        legend: [scope.valueList[0].reportObjectName]
                                                    });
                                                }
                                                else if (scope.columnList.length != 0 && scope.rowList.length != 0 && scope.valueList.length != 0) {
                                                    var findAll = _.filter(currentJson, (_a = {}, _a[scope.rowList[rowelIndex].reportObjectName] = value, _a));
                                                    masterMapChartRecords.push({
                                                        name: value,
                                                        values: [],
                                                        legend: []
                                                    });
                                                    if (findAll) {
                                                        findAll.forEach(function (_searchValue1, _searchKey1) {
                                                            var metricValue = _searchValue1[scope.valueList[0].reportObjectName];
                                                            var columnValue = _searchValue1[scope.columnList[0].reportObjectName];
                                                            masterMapChartRecords[masterMapChartRecords.length - 1].values.push(metricValue);
                                                            masterMapChartRecords[masterMapChartRecords.length - 1].legend.push(columnValue);
                                                        });
                                                    }
                                                }
                                            });
                                        };
        
                                        var prepareDataAndPlot = function () {
                                            //'Italy', 'Maharashtra', 'nepal', 'iraq', 'Africa', 'Australia', 'karachi', 'Hyderabad', 'Chile', 'North America', 'Russia', 'Hubei', 'South Africa'
                                            plotingLocations = [];
                                            mapChartData = [];
                                            chartOptions.legend = [];
                                            masterMapChartRecords.map(function (value) {
                                                if (chartOptions.legend.length == 0 && value.legend) {
                                                    chartOptions.legend = value.legend;
                                                }
                                                plotingLocations.push(value.name);
                                                mapChartData.push({
                                                    name: value.name,
                                                    mainName: value.name,
                                                    values: value.values,
                                                    legends: value.legend
                                                });
                                            });
                                            plotingLocations.forEach(function (location) {
                                                if (location && location.trim() != '') {
                                                    azureSearchService.searchAddress(atlas.service.Aborter.timeout(10000), location)
                                                        .then(function (response) {
                                                            if (response.results.length != 0) {
                                                                getSuccessBoundaryForCharts(response, location);
                                                            } else {
                                                                getErrorBoundaryForCharts();
                                                            }
                                                        });
                                                } else {
                                                    getErrorBoundaryForCharts();
                                                }
                                            });
                                        };
        
                                        MapChartSeriesDataPerpation();
                                        prepareDataAndPlot();
                                    });
                                });
        
                                if (scope.columnList.length == 0 && scope.valueList.length == 0) {
                                    scope.highchartsNgTitle = scope.rowList[rowelIndex].reportObjectName;
                                }
                                else {
                                    scope.highchartsNgTitle = createGraphTitle(rowelIndex);
                                }
                            }
                        });
                    };

                    //<======================================================================================================>
                    scope.exportChart = function (exportType) {
                        if (scope.activeChart.name == 'Multiple Axis Chart')
                            var chart = $('#multi-chart-container').highcharts();
                        else if (scope.activeChart.name == 'Pareto Chart')
                            var chart = $('#pareto-chart-container').highcharts();
                        else if (scope.activeChart.name == 'Stacked Column Chart' || scope.activeChart.name == '100% Stacked Column Chart' || scope.activeChart.name == '100% Stacked Bar Chart' || scope.activeChart.name == 'Stacked Bar Chart' || scope.activeChart.name == 'Bar Chart')
                            var chart = $('#stacked-chart-container').highcharts();
                        else if (scope.activeChart.name == 'Column & Line Combination Chart' || scope.activeChart.name == 'Bar & Line Combination Chart') {
                            var chart = $('#combination-chart-container').highcharts();
                        }
                        else if (scope.activeChart.name == 'Bubble Chart')
                            var chart = $('#bubble-chart-container').highcharts();
                        else if (scope.activeChart.name == 'Waterfall Chart')
                            var chart = $('#waterfall-chart-container').highcharts();
                        else if (scope.activeChart.name == 'Gauge Chart')
                            var chart = $('#gauge-chart-container').highcharts();
                        else if (scope.activeChart.name == 'Histogram Chart')
                            var chart = $('#histogram-chart-container').highcharts();
                        else if (scope.activeChart.name == 'Heat Map')
                            var chart = $('#heat-map-container').highcharts();
                        else if (scope.activeChart.name == 'Column Chart' || scope.activeChart.name == 'Pie Chart' || scope.activeChart.name == 'Donut Chart' || scope.activeChart.name == 'Line Chart')
                            var chart = $('#column-chart-container').highcharts();
                        else if (scope.activeChart.name == 'Tree Chart')
                            var chart = $('#tree-chart-container').highcharts();
                        else
                            var chart = $('.chartColumn').highcharts();
                        if (exportType != 'Excel' && (scope.activeChart.name != 'Gauge Chart' && scope.activeChart.name != 'Pie Chart' && scope.activeChart.name != 'Donut Chart')) {
                            chart.exportChart({
                                type: exportType,
                                filename: scope.reportName,
                                scale: 2
                            });
                        }
                        else if (exportType != 'Excel' && (scope.activeChart.name == 'Pie Chart' || scope.activeChart.name == 'Donut Chart')) {
                            chart.exportChart({
                                type: exportType,
                                filename: scope.reportName,
                                scale: 2,
                                sourceWidth: 4000,
                                sourceHeight: 1000
                            });
                        }
                        else if (exportType != 'Excel' && scope.activeChart.name == 'Gauge Chart') {
                            setTimeout(function () {
                                if (exportType == 'application/pdf')
                                    Highcharts.exportCharts(gaugeChartExportList, {
                                        type: 'application/pdf'
                                    });
                                else {
                                    Highcharts.exportCharts(gaugeChartExportList);
                                }
                            }, 300);
                        }
                        else if (exportType == 'Excel' && scope.activeChart.name == 'Gauge Chart') {
                            var svgImage;
                            var render_width = 1000, render_height;
                            if (gaugeChartExportList.length == 1) {
                                chart = chart = $('#' + gaugeChartExportList[0].renderTo.id).highcharts();
                                chart.chartHeight = 183;
                                chart.chartWidth = 1336;
                                svgImage = chart.getSVG({
                                    exporting: {
                                        sourceWidth: chart.chartWidth,
                                        sourceHeight: chart.chartHeight
                                    }
                                });
                                render_height = render_width * chart.chartHeight / chart.chartWidth;
                            }
                            else {
                                var svgArr = [], top = 0, width = 0, endWidth = 0;
                                Highcharts.each(gaugeChartExportList, function (chart) {
                                    var chartOpts = {
                                        plotOptions: {
                                            solidgauge: {
                                                dataLabels: {
                                                    enabled: true
                                                }
                                            }
                                        },
                                        exporting: {
                                            sourceWidth: chart.chartWidth,
                                            sourceHeight: chart.chartHeight
                                        }
                                    };
                                    var svg = chart.getSVG(chartOpts),
                                        // Get width/height of SVG for export
                                        svgWidth = +svg.match(/^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/)[1], svgHeight = +svg.match(/^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/)[1];
                                    svg = svg.replace('<svg', '<g transform="translate(' + width + ', ' + top + ')" ');
                                    svg = svg.replace('</svg>', '</g>');
                                    width += svgWidth;
                                    endWidth = Math.max(endWidth, width);
                                    if (gaugeChartExportList.length >= 5) {
                                        if (width === 3 * svgWidth) {
                                            width = 0;
                                            top += svgHeight;
                                        }
                                    }
                                    else if (gaugeChartExportList.length == 4) {
                                        if (width === 2 * svgWidth) {
                                            width = 0;
                                            top += svgHeight;
                                        }
                                    }
                                    svgArr.push(svg);
                                });
                                top += 200;
                                if (gaugeChartExportList.length <= 3) {
                                    top = 200;
                                }
                                else if (gaugeChartExportList.length >= 4) {
                                    top = 400;
                                }
                                svgImage = '<svg height="' + top + '" width="' + endWidth +
                                    '" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
                                    svgArr.join('') + '</svg>';
                                render_height = render_width * top / endWidth;
                            }
                            var canvas = document.createElement('canvas');
                            canvas.height = render_height;
                            canvas.width = render_width;
                            var image = new Image;
                            image.onload = function () {
                                canvas.getContext('2d').drawImage(this, 0, 0, render_width, render_height);
                                var data = canvas.toDataURL("image/png");
                                var res = data.replace("data:image/png;base64,", "");
                                scope.$parent.vm.exportGridwithChart(res);
                            };
                            image.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgImage)));
                        }
                        else {
                            //If Excel than call exportChart 
                            var render_width = 1000;
                            var render_height = render_width * chart.chartHeight / chart.chartWidth;
                            var svg = chart.getSVG({
                                exporting: {
                                    sourceWidth: chart.chartWidth,
                                    sourceHeight: chart.chartHeight
                                }
                            });
                            var canvas = document.createElement('canvas');
                            canvas.height = render_height;
                            canvas.width = render_width;
                            var image = new Image;
                            image.onload = function () {
                                canvas.getContext('2d').drawImage(this, 0, 0, render_width, render_height);
                                var data = canvas.toDataURL("image/png");
                                var res = data.replace("data:image/png;base64,", "");
                                scope.$parent.vm.exportGridwithChart(res);
                            };
                            image.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
                        }
                    };
                    scope.jumpToBreadCrumbState = function (breadcrumbObj, index, drillUp) {
                        var self = this;
                        var titleLen = -1;
                        for (var i = 0; i < this.chartstates.length; i++) {
                            this.chartstates[i].active = false;
                            if (i >= index && !drillUp) {
                                this.rowList[i].isDrill = false;
                            }
                        }
                        var bredcumLength = self.chartstates.length;
                        scope.jumpToConfig.newModel(enableJumpToFunction = scope.jumpToConfig.enableJumpToFunction);
                        if (drillUp) {
                            self.chartstates.length = self.chartstates.length - 1;
                            this.rowList[self.chartstates.length - 1].isDrill = false;
                        }
                        else {
                            self.chartstates.length = index + 1;
                            titleLen = bredcumLength - self.chartstates.length;
                        }
                        rowelIndex = self.chartstates.length - 1;
                        //if(masterJson[rowelIndex]!=undefined){
                        //    // update category in master json 
                        //    currentJson = masterJson[rowelIndex].pageData[masterJson[rowelIndex].pageInfo.currentPage];
                        //    rowObjects = currentJson[currentJson.length - 1].rowObjects;
                        //    columnObjects = currentJson[currentJson.length - 1].columnObject;
                        //    currentRow = currentJson[currentJson.length - 1].item;
                        //    //Update Filter list when user drills Up 
                        //    if (rowelIndex > 0) {
                        //        reportObjDetails.lstFilterReportObject = updateReportFilterList();
                        //    }
                        //    else {
                        //        reportObjDetails.lstFilterReportObject = angular.copy(scope.reportFilters);
                        //    }
                        //breadcrumbObj.active = true;
                        ////reportFilterList.splice(titleLen == -1 ? reportFilterList.length - 1 : reportFilterList.length - titleLen, bredcumLength - self.chartstates.length);
                        //if (scope.activeChart.name == 'Tree Chart') {
                        //    scope.highchartsMapNg.title.text = '';
                        //    scope.highchartsNgTitle = createGraphTitle(self.chartstates.length - 1);
                        //}
                        //else if (scope.activeChart.name == 'Multiple Axis Chart') {
                        //    // Add title code
                        //}
                        //else {
                        //    scope.highchartsNg.title.text = '';
                        //    scope.highchartsNgTitle = createGraphTitle(self.chartstates.length - 1);
                        //}
                        //    //updateSeries();
                        //    //updateXAxis();
                        //    if (scope.activeChart.name == 'Tree Chart')
                        //        scope.highchartsMapNg = getMapChartJson();
                        //    else if (scope.activeChart.name == 'Multiple Axis Chart')
                        //        createMultichart();
                        //    else
                        //        scope.highchartsNg = getChartJson();
                        //    initiateChart();
                        //    enablePaging();
                        //    if (self.chartstates.length <= 1)
                        //        scope.disableDrillup = true;
                        //    scope.listSortWith = JSON.parse(masterJson[rowelIndex].preserveSortList);
                        //    angular.forEach(scope.listSortWith, function (value, index) {
                        //        if (value.sortas != report.resources.ChartSortType.AscDesc)
                        //            scope.selectedIndex = index;
                        //    });
                        //}
                        //else{
                        if (scope.rowList.length)
                            reportObjects = scope.columnList.concat(scope.rowList[rowelIndex]).concat(scope.valueList);
                        else
                            reportObjects = scope.columnList.concat(scope.valueList);
                        if (rowelIndex > 0) {
                            reportFilterList = updateReportFilterList();
                        }
                        else {
                            reportFilterList = angular.copy(scope.reportFilters);
                        }
                        reportObjDetails.newModel(scope.datasourceid, "", 0, reportObjects, [], reportFilterList, -1, reportRequestKey + '_' + rowelIndex, false, false, true, 1, undefined, undefined, scope.isRangeRedToGreenColor);
                        if (masterJson[rowelIndex] != undefined) {
                            reportObjDetails.lstSortReportObject = masterJson[rowelIndex].sortListForDrill;
                            scope.$parent.vm.clickedROforOlap[0] = masterJson[rowelIndex].sortListForDrill[0];
                            masterJson[rowelIndex].pageInfo = new report.models.Metadata.PageInfo;
                        }
                        else
                            scope.$parent.vm.clickedROforOlap = [];
                        generateGraph(reportObjDetails, self.chartstates[rowelIndex].itemName, function (totalRowCount, pageSize) {
                            if (totalRowCount > 0)
                                masterJson[rowelIndex].pageInfo.pager(totalRowCount, pageSize - 1, masterJson[rowelIndex].pageInfo.currentPage);
                            if (scope.activeChart.name == 'Tree Chart')
                                getMapChartJson();
                            else if (scope.activeChart.name == 'Multiple Axis Chart')
                                createMultichart();
                            else if (scope.activeChart.name == 'Pareto Chart')
                                createParetoChart();
                            else if (scope.activeChart.name == 'Stacked Column Chart' || scope.activeChart.name == '100% Stacked Column Chart' || scope.activeChart.name == '100% Stacked Bar Chart' || scope.activeChart.name == 'Stacked Bar Chart' || scope.activeChart.name == 'Clustered Stacked Column Chart' || scope.activeChart.name == 'Bar Chart')
                                createStackedCollumnChart();
                            else if (scope.activeChart.name == 'Column & Line Combination Chart' || scope.activeChart.name == 'Bar & Line Combination Chart')
                                createCombinationChart();
                            else if (scope.activeChart.name == 'Bubble Chart')
                                createBubbleChart();
                            else if (scope.activeChart.name == 'Map Chart')
                                createMapChart();
                            else if (scope.activeChart.name == 'Waterfall Chart')
                                createWaterFallChart();
                            else if (scope.activeChart.name == 'Gauge Chart')
                                createGaugeChart();
                            else if (scope.activeChart.name == 'Histogram Chart')
                                getChartForHistogram();
                            else if (scope.activeChart.name == 'Heat Map')
                                getHeatMapChart();
                            else if (scope.activeChart.name == 'Column Chart' || scope.activeChart.name == 'Pie Chart' || scope.activeChart.name == 'Donut Chart' || scope.activeChart.name == 'Line Chart')
                                getChartJson();
                            //else
                            //    scope.highchartsNg = getChartJson();
                            breadcrumbObj.active = true;
                            initiateChart();
                            enablePaging();
                            if (rowelIndex > 0)
                                scope.disableDrillup = false;
                            else
                                scope.disableDrillup = true;
                        });
                    };
                    scope.drillup = function () {
                        scope.jumpToBreadCrumbState(this.chartstates[this.chartstates.length - 2], 0, true);
                        scope.disableDrillup = false;
                        if (this.chartstates.length <= 1)
                            scope.disableDrillup = true;
                    };
                    scope.next = function () {
                        this.refreshChart('next');
                    };
                    scope.navigateToPage = function (page) {
                        this.refreshChart(page);
                    };
                    //let getUpdateChartForFontSize = function (chart: any) {
                    //    if (chart != undefined) {
                    //        chart.update({
                    //            plotOptions:
                    //            {
                    //                series: {
                    //                    dataLabels: {
                    //                        style:
                    //                        {
                    //                            fontSize: scope.selectedFontSize + "px"
                    //                        }
                    //                    }
                    //                }
                    //            }
                    //        })
                    //    }
                    //}
                    var getUpdateChartForFontSize = function (chart) {
                        if (chart != undefined && chart.plotoptions != undefined) {
                            chart.update({
                                plotoptions: {
                                    series: {
                                        datalabels: {
                                            style: {
                                                fontSize: scope.selectedFontSize + "px"
                                            }
                                        }
                                    }
                                }
                            });
                        }
                        else if (chart != undefined && chart.series != undefined && chart.update != undefined) {
                            if (Array.isArray(chart.series)) {
                                if (scope.activeChart.name == "Tree Chart") {
                                    scope.highchartsMapNg = getMapChartJson();
                                    chart.series.map(function (s) {
                                        return s.update({
                                            dataLabels: {
                                                style: {
                                                    fontSize: scope.selectedFontSize + "px"
                                                }
                                            }
                                        });
                                    });
                                }
                                else {
                                    chart.series.map(function (s) {
                                        return s.update({
                                            dataLabels: {
                                                style: {
                                                    fontSize: scope.selectedFontSize + "px"
                                                }
                                            }
                                        });
                                    });
                                }
                            }
                            else {
                                chart.update({
                                    series: {
                                        datalabels: {
                                            style: {
                                                fontSize: scope.selectedFontSize + "px"
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    };
                    scope.refreshChartforFondSize = function (size) {
                        scope.selectedFontSize = size;
                        scope.$parent.vm.selectedFontSize = size;
                        var chart;
                        switch (scope.activeChart.name) {
                            case 'Bar Chart':
                            case 'Stacked Column Chart':
                            case '100% Stacked Column Chart':
                            case 'Stacked Bar Chart':
                            case '100% Stacked Bar Chart':
                            case 'Clustered Stacked Column Chart':
                            case 'Bar Chart':
                                {
                                    chart = $('#stacked-chart-container').highcharts();
                                    break;
                                }
                            case 'Multiple Axis Chart':
                                {
                                    chart = $('#multi-chart-container').highcharts();
                                    break;
                                }
                            case 'Pareto Chart':
                                {
                                    chart = $('#pareto-chart-container').highcharts();
                                    break;
                                }
                            case 'Column & Line Combination Chart':
                            case 'Bar & Line Combination Chart':
                                {
                                    chart = $('#combination-chart-container').highcharts();
                                    break;
                                }
                            case 'Waterfall Chart':
                                {
                                    chart = $('#waterfall-chart-container').highcharts();
                                    break;
                                }
                            case 'Gauge Chart':
                                {
                                    chart = $('#gauge-chart-container').highcharts();
                                    break;
                                }
                            case 'Bubble Chart': {
                                chart = $('#bubble-chart-container').highcharts();
                                //size = scope.selectedFontSize + "px";
                                break;
                            }
                            case 'Histogram Chart': {
                                chart = $('#histogram-chart-container').highcharts();
                                //size = scope.selectedFontSize + "px";
                                break;
                            }
                            case 'Heat Map': {
                                chart = $('#heat-map-container').highcharts();
                                //size = scope.selectedFontSize + "px";
                                break;
                            }
                            case 'Pie Chart':
                            case 'Donut Chart':
                            case 'Line Chart':
                            case 'Column Chart': {
                                chart = $('#column-chart-container').highcharts();
                                //size = scope.selectedFontSize + "px";
                                break;
                            }
                            case 'Tree Chart':
                                {
                                    chart = $('#tree-chart-container').highcharts();
                                }
                            default:
                                chart = $('.chartColumn').highcharts();
                                break;
                        }
                        getUpdateChartForFontSize(chart);
                    };
                    scope.refreshChart = function (eventName, size) {
                        if (scope.rowList.length)
                            reportObjects = scope.columnList.concat(scope.rowList[rowelIndex]).concat(scope.valueList);
                        else
                            reportObjects = scope.columnList.concat(scope.valueList);
                        if (rowelIndex > 0)
                            reportFilterList = updateReportFilterList();
                        else
                            reportFilterList = angular.copy(scope.reportFilters);
                        reportObjDetails.newModel(scope.datasourceid, "", 0, reportObjects, [], reportFilterList, -1, reportRequestKey + '_' + rowelIndex, false, false, true, 1);
                        // let ro = reportObjects.filter((element, index) => element["reportObjectId"] === scope.rowList[rowelIndex].reportObjectId);
                        // if (ro != undefined) {
                        // get the last record of current row object 
                        //ro[0].isOnOrAfterTerm = masterJson[rowelIndex]["lastRecord"][ro[0].reportObjectName];
                        switch (eventName) {
                            case 'next':
                                masterJson[rowelIndex].pageInfo.currentPage++;
                                break;
                            case 'prev':
                                masterJson[rowelIndex].pageInfo.currentPage--;
                                break;
                            case 'pageChange':
                                scope.jumpToConfig.newModel(enableJumpToFunction = scope.jumpToConfig.enableJumpToFunction);
                                masterJson[rowelIndex].pageInfo.currentPage = 0;
                                reportObjDetails.pageSize = size + 1;
                                masterJson[rowelIndex].pageInfo.pageSize = size + 1;
                                scope.$parent.vm.selectedPageSize = size + 1;
                                break;
                            case 'lastPage':
                                masterJson[rowelIndex].pageInfo.currentPage = masterJson[rowelIndex].pageInfo.endPage - 1;
                                break;
                            case 'firstPage':
                                masterJson[rowelIndex].pageInfo.currentPage = 0;
                                break;
                            case 'userEnteredPage':
                                masterJson[rowelIndex].pageInfo.currentPage = size - 1;
                                break;
                        }
                        reportObjDetails.pageIndex = masterJson[rowelIndex].pageInfo.currentPage + 1;
                        scope.jumpToConfig.userEnteredPage = angular.copy(reportObjDetails.pageIndex);
                        reportObjDetails.lstSortReportObject = masterJson[rowelIndex].sortListForDrill;
                        generateGraph(reportObjDetails, currentcategory, function (totalRowCount, pageSize) {
                            if (totalRowCount > 0)
                                masterJson[rowelIndex].pageInfo.pager(totalRowCount, pageSize - 1, masterJson[rowelIndex].pageInfo.currentPage);
                            //updateSeries();
                            //updateXAxis();
                            if (scope.activeChart.name == 'Tree Chart')
                                getMapChartJson();
                            else if (scope.activeChart.name == 'Multiple Axis Chart')
                                createMultichart();
                            else if (scope.activeChart.name == 'Pareto Chart')
                                createParetoChart();
                            else if (scope.activeChart.name == 'Stacked Column Chart' || scope.activeChart.name == '100% Stacked Column Chart' || scope.activeChart.name == '100% Stacked Bar Chart' || scope.activeChart.name == 'Stacked Bar Chart' || scope.activeChart.name == 'Clustered Stacked Column Chart' || scope.activeChart.name == 'Bar Chart')
                                createStackedCollumnChart();
                            else if (scope.activeChart.name == 'Column & Line Combination Chart' || scope.activeChart.name == 'Bar & Line Combination Chart') {
                                createCombinationChart();
                            }
                            else if (scope.activeChart.name == 'Bubble Chart')
                                createBubbleChart();
                            else if (scope.activeChart.name == 'Map Chart')
                                createMapChart();
                            else if (scope.activeChart.name == 'Waterfall Chart')
                                createWaterFallChart();
                            else if (scope.activeChart.name == 'Gauge Chart') {
                                createGaugeChart();
                            }
                            else if (scope.activeChart.name == 'Histogram Chart')
                                getChartForHistogram();
                            else if (scope.activeChart.name == 'Heat Map')
                                getHeatMapChart();
                            else if (scope.activeChart.name == 'Column Chart' || scope.activeChart.name == 'Pie Chart' || scope.activeChart.name == 'Donut Chart' || scope.activeChart.name == 'Line Chart')
                                getChartJson();
                            //else
                            //    scope.highchartsNg = getChartJson();
                            enablePaging();
                            if (rowelIndex > 0)
                                scope.disableDrillup = false;
                            else
                                scope.disableDrillup = true;
                        });
                    };
                    scope.prev = function () {
                        //if (masterJson[rowelIndex].pageInfo.currentPage > 0) {
                        //    masterJson[rowelIndex].pageInfo.currentPage--;
                        //    currentJson = masterJson[rowelIndex].pageData[masterJson[rowelIndex].pageInfo.currentPage];
                        //    rowObjects = currentJson[currentJson.length - 1].rowObjects;
                        //    columnObjects = currentJson[currentJson.length - 1].columnObject;
                        //    currentRow = currentJson[currentJson.length - 1].item;
                        //    //updateSeries();
                        //    //updateXAxis();
                        //    // gg start
                        //    if (scope.showGridGraphView) {
                        //        reportObjDetails.pageIndex = masterJson[rowelIndex].pageInfo.currentPage + 1;
                        //        scope.$parent.vm.generateOlapForGG = false;
                        //        scope.$parent.vm.reoportObjectForOlap(reportObjDetails, rowelIndex);
                        //        scope.$parent.vm.generateOlapForGG = true;
                        //    }
                        //    // gg end
                        //    if (scope.activeChart.name == 'Tree Chart')
                        //        scope.highchartsMapNg = getMapChartJson();
                        //    else if (scope.activeChart.name == 'Multiple Axis Chart')
                        //        createMultichart();
                        //    else
                        //        scope.highchartsNg = getChartJson();
                        //    initiateChart();
                        //    enablePaging();
                        //    if (rowelIndex > 0)
                        //        scope.disableDrillup = false;
                        //    else
                        //        scope.disableDrillup = true;
                        //}   
                        if (scope.rowList.length)
                            reportObjects = scope.columnList.concat(scope.rowList[rowelIndex]).concat(scope.valueList);
                        else
                            reportObjects = scope.columnList.concat(scope.valueList);
                        if (rowelIndex > 0)
                            reportFilterList = updateReportFilterList();
                        else
                            reportFilterList = angular.copy(scope.reportFilters);
                        reportObjDetails.newModel(scope.datasourceid, "", 0, reportObjects, [], reportFilterList, -1, reportRequestKey + '_' + rowelIndex, false, false, true, 1);
                        // let ro = reportObjects.filter((element, index) => element["reportObjectId"] === scope.rowList[rowelIndex].reportObjectId);
                        // if (ro != undefined) {
                        // get the last record of current row object 
                        //ro[0].isOnOrAfterTerm = masterJson[rowelIndex]["lastRecord"][ro[0].reportObjectName];
                        masterJson[rowelIndex].pageInfo.currentPage--;
                        reportObjDetails.pageIndex = masterJson[rowelIndex].pageInfo.currentPage + 1;
                        scope.jumpToConfig.userEnteredPage = angular.copy(reportObjDetails.pageIndex);
                        reportObjDetails.lstSortReportObject = masterJson[rowelIndex].sortListForDrill;
                        generateGraph(reportObjDetails, currentcategory, function (totalRowCount, pageSize) {
                            if (totalRowCount > 0)
                                masterJson[rowelIndex].pageInfo.pager(totalRowCount, pageSize - 1, masterJson[rowelIndex].pageInfo.currentPage);
                            //updateSeries();
                            //updateXAxis();
                            if (scope.activeChart.name == 'Tree Chart')
                                getMapChartJson();
                            else if (scope.activeChart.name == 'Multiple Axis Chart')
                                createMultichart();
                            else if (scope.activeChart.name == 'Pareto Chart')
                                createParetoChart();
                            else if (scope.activeChart.name == 'Stacked Column Chart' || scope.activeChart.name == '100% Stacked Column Chart' || scope.activeChart.name == '100% Stacked Bar Chart' || scope.activeChart.name == 'Stacked Bar Chart' || scope.activeChart.name == 'Clustered Stacked Column Chart' || scope.activeChart.name == 'Bar Chart')
                                createStackedCollumnChart();
                            else if (scope.activeChart.name == 'Column & Line Combination Chart' || scope.activeChart.name == 'Bar & Line Combination Chart') {
                                createCombinationChart();
                            }
                            else if (scope.activeChart.name == 'Bubble Chart')
                                createBubbleChart();
                            else if (scope.activeChart.name == 'Map Chart')
                                createMapChart();
                            else if (scope.activeChart.name == 'Waterfall Chart')
                                createWaterFallChart();
                            else if (scope.activeChart.name == 'Gauge Chart')
                                createGaugeChart();
                            else if (scope.activeChart.name == 'Histogram Chart')
                                getChartForHistogram();
                            else if (scope.activeChart.name == 'Heat Map')
                                getHeatMapChart();
                            else if (scope.activeChart.name == 'Column Chart' || scope.activeChart.name == 'Pie Chart' || scope.activeChart.name == 'Donut Chart' || scope.activeChart.name == 'Line Chart')
                                getChartJson();
                            //else
                            //    scope.highchartsNg = getChartJson();
                            enablePaging();
                            if (rowelIndex > 0)
                                scope.disableDrillup = false;
                            else
                                scope.disableDrillup = true;
                        });
                    };
                    var initiateChart = function () {
                        document.body.scroll = "no";
                        document.body.style.overflow = 'hidden';
                        scope.highchartsNg.initChart = true;
                        setTimeout(function () {
                            scope.highchartsNg.initChart = false;
                            scope.$digest();
                        }, 100);
                    };
                    // enable disable prev next
                    var enablePaging = function () {
                        scope.currentPageInfo.currentPage = masterJson[rowelIndex].pageInfo.currentPage + 1;
                        if (masterJson[rowelIndex].pageInfo.totalPages > 0)
                            scope.currentPageInfo.totalPages = masterJson[rowelIndex].pageInfo.totalPages;
                        if (scope.currentPageInfo.currentPage >= scope.currentPageInfo.totalPages)
                            scope.currentPageInfo.isNext = true;
                        else
                            scope.currentPageInfo.isNext = false;
                        if (scope.currentPageInfo.currentPage > 1)
                            scope.currentPageInfo.isPrev = false;
                        else
                            scope.currentPageInfo.isPrev = true;
                    };
                    var resizeChart = function () {
                        var chart = $('#tree-chart-container').highcharts();
                        if (chart != undefined && chart.reflow() != undefined)
                            chart.reflow();
                        else
                            initiateChart();
                        setTimeout(function () {
                            if (scope.activeChart.name == 'Tree Chart') {
                                var chart = $('#tree-chart-container').highcharts();
                                if (chart != undefined && chart.reflow() != undefined)
                                    chart.reflow();
                            }
                            else if (scope.activeChart.name == 'Multiple Axis Chart') {
                                var chart = $('#multi-chart-container').highcharts();
                                if (chart != undefined && chart.reflow() != undefined)
                                    chart.reflow();
                            }
                            else if (scope.activeChart.name == 'Pareto Chart') {
                                var chart = $('#pareto-chart-container').highcharts();
                                if (chart != undefined && chart.reflow() != undefined)
                                    chart.reflow();
                            }
                            else if (scope.activeChart.name == 'Bubble Chart') {
                                var chart = $('#bubble-chart-container').highcharts();
                                if (chart != undefined && chart.reflow() != undefined)
                                    chart.reflow();
                            }
                            else if (scope.activeChart.name == 'Waterfall Chart') {
                                var chart = $('#waterfall-chart-container').highcharts();
                                if (chart != undefined && chart.reflow() != undefined)
                                    chart.reflow();
                            }
                            else if (scope.activeChart.name == 'Histogram Chart') {
                                var chart = $('#histogram-chart-container').highcharts();
                                if (chart != undefined && chart.reflow() != undefined)
                                    chart.reflow();
                            }
                            else if (scope.activeChart.name == 'Heat Map') {
                                var chart = $('#heat-map-container').highcharts();
                                if (chart != undefined && chart.reflow() != undefined)
                                    chart.reflow();
                            }
                            else if (scope.activeChart.name == 'Column Chart' || scope.activeChart.name == 'Line Chart' || scope.activeChart.name == 'Pie Chart' || scope.activeChart.name == 'Donut Chart') {
                                var chart = $('#column-chart-container').highcharts();
                                if (chart != undefined && chart.reflow() != undefined)
                                    chart.reflow();
                            }
                            else if (scope.activeChart.name == 'Gauge Chart') {
                                var div = document.getElementById('gauge-chart-container');
                                var elements = [];
                                for (var i = 0; i < div.childNodes.length; i++) {
                                    var child = div.childNodes[i];
                                    if (child.nodeType == 1) {
                                        elements.push(child);
                                    }
                                }
                                elements.forEach(function (obj) {
                                    chart = $("#" + obj.id).highcharts();
                                });
                                if (chart != undefined && chart.reflow() != undefined)
                                    chart.reflow();
                            }
                        }, 500);
                    };
                    var setNestedFilter = function (reportFilterObject, drillValue) {
                        var nestedDrillFilter = new report.models.Data.FilterReportObject;
                        nestedDrillFilter.newModel(null, report.resources.ReportObjectOperators.Is, scope.rowList[rowelIndex - 1].filterType, drillValue, report.resources.ConditionalOperator.AND, null);
                        //this will move the page by filters in the NestedReportFilterObject of the reportFilterObject's NestedReportFilterObject if there is page by filter applied.
                        nestedDrillFilter.NestedReportFilterObject = reportFilterObject.NestedReportFilterObject;
                        reportFilterObject.NestedReportFilterObject = nestedDrillFilter;
                        reportFilterObject.SetConditionalOperator = report.resources.ConditionalOperator.AND;
                        return reportFilterObject;
                    };
                    //scope.enableDataLabels = (newVal) => { scope.showDataLabel = newVal; scope.$parent.vm.showDataLabel = newVal }
                    var updateReportFilterList = function () {
                        var reportFilters = angular.copy(scope.reportFilters);
                        var counter = 0;
                        while (counter < rowelIndex) {
                            var tempfilterObject = _.find(reportFilters, function (f) { return f.ReportObject.reportObjectId == scope.rowList[counter].reportObjectId; });
                            if (tempfilterObject)
                                reportFilters[reportFilters.indexOf(tempfilterObject)] = setNestedFilter(tempfilterObject, getFormattedFilterValue(scope.rowList[counter], scope.chartstates[counter + 1].itemName));
                            else {
                                var filterObject = new report.models.Data.FilterReportObject();
                                filterObject.newModel(scope.rowList[counter], report.resources.ReportObjectOperators.Is, scope.rowList[counter].filterType, getFormattedFilterValue(scope.rowList[counter], scope.chartstates[counter + 1].itemName), report.resources.ConditionalOperator.Nan, null);
                                reportFilters.push(filterObject);
                            }
                            counter++;
                        }
                        return reportFilters;
                    };
                    var validateNumber = function (value) {
                        return parseFloat((((value != undefined && value != null && value !== "") && typeof value === "number") ? value : 0).toFixed(2));
                    };
                    var getUpdateChartForEnableDataLabel = function (chart) {
                        if (chart != undefined && chart.plotOptions != undefined) {
                            chart.update({
                                plotOptions: {
                                    series: {
                                        dataLabels: {
                                            enabled: scope.showDataLabels
                                        }
                                    }
                                }
                            });
                        }
                        else if (chart != undefined && chart.series != undefined && chart.update != undefined) {
                            if (Array.isArray(chart.series)) {
                                if (scope.activeChart.name == 'Tree Chart') {
                                    getMapChartJson();
                                    chart.series.map(function (s) {
                                        return s.update({
                                            dataLabels: {
                                                enabled: true
                                            }
                                        });
                                    });
                                }
                                else if (Array.isArray(chart.series)) {
                                    chart.series.map(function (s) {
                                        return s.update({
                                            dataLabels: {
                                                enabled: scope.activeChart.name != "Pie Chart" && scope.activeChart.name != "Donut Chart" ? scope.showDataLabels : true
                                            }
                                        });
                                    });
                                    if (scope.highchartsNg != undefined) {
                                        scope.highchartsNg.series.map(function (s) {
                                            if (s.dataLabels != undefined) {
                                                s.dataLabels.enabled = scope.activeChart.name != "Pie Chart" && scope.activeChart.name != "Donut Chart" ? scope.showDataLabels : true;
                                            }
                                        });
                                    }
                                }
                            }
                            else {
                                chart.update({
                                    series: {
                                        dataLabels: {
                                            enabled: scope.showDataLabels
                                        }
                                    }
                                });
                            }
                        }
                    };
                    scope.enableDataLabels = function (newVal) {
                        scope.showDataLabels = newVal;
                        scope.$parent.vm.showDataLabels = newVal;
                        var chart;
                        switch (scope.activeChart.name) {
                            case 'Bar Chart':
                            case 'Stacked Column Chart':
                            case '100% Stacked Column Chart':
                            case 'Stacked Bar Chart':
                            case '100% Stacked Bar Chart':
                            case 'Clustered Stacked Column Chart':
                            case 'Bar Chart':
                                {
                                    chart = $('#stacked-chart-container').highcharts();
                                    break;
                                }
                            case 'Multiple Axis Chart':
                                {
                                    chart = $('#multi-chart-container').highcharts();
                                    break;
                                }
                            case 'Pareto Chart':
                                {
                                    chart = $('#pareto-chart-container').highcharts();
                                    break;
                                }
                            case 'Column & Line Combination Chart':
                            case 'Bar & Line Combination Chart':
                                {
                                    chart = $('#combination-chart-container').highcharts();
                                    break;
                                }
                            case 'Waterfall Chart':
                                {
                                    chart = $('#waterfall-chart-container').highcharts();
                                    break;
                                }
                            case 'Gauge Chart':
                                {
                                    chart = $('#gauge-chart-container').highcharts();
                                    break;
                                }
                            case 'Bubble Chart':
                                {
                                    chart = $('#bubble-chart-container').highcharts();
                                    break;
                                }
                            case 'Histogram Chart':
                                {
                                    chart = $('#histogram-chart-container').highcharts();
                                    break;
                                }
                            case 'Heat Map':
                                {
                                    chart = $('#heat-map-container').highcharts();
                                    break;
                                }
                            case 'Pie Chart':
                            case 'Donut Chart':
                            case 'Line Chart':
                            case 'Column Chart':
                                {
                                    chart = $('#column-chart-container').highcharts();
                                    break;
                                }
                            case 'Tree Chart':
                                {
                                    chart = $('#tree-chart-container').highcharts();
                                    break;
                                }
                            default:
                                chart = $('.chartColumn').highcharts();
                                break;
                        }
                        getUpdateChartForEnableDataLabel(chart);
                    };
                    //On toggling the checkbox the service call to get and set the pagination data will be executed.
                    scope.onEnableJumpToCallback = function () {
                        if (scope.jumpToConfig.toogleJumpToFunction) {
                            scope.getAndSetPaginationData();
                        }
                        else {
                            scope.jumpToConfig.newModel(enableJumpToFunction = scope.jumpToConfig.enableJumpToFunction, userEnteredPage = scope.jumpToConfig.userEnteredPage);
                        }
                    };
                    // This function is used to excute the service call to get and set the pagination data.
                    scope.getAndSetPaginationData = function () {
                        if (!scope.$parent.vm.reportObjDetails.isGNG &&
                            scope.$parent.vm.selectedCube.select.productType === report.resources.productType.Reports) {
                            scope.jumpToConfig.showJumpToNavigation = true;
                            scope.jumpToConfig.showPaginationLoader = true;
                            var rptObjDetails = angular.copy(scope.$parent.reportNewCtrl.reportObjDetails);
                            rptObjDetails.isJumpToState = true;
                            if (scope.$parent.vm.selectedPageSize > 0) {
                                rptObjDetails.pageSize = scope.$parent.vm.selectedPageSize;
                            }
                            else if (scope.$parent.vm.selectedCube && scope.$parent.vm.selectedCube.select) {
                                var pageSize = scope.$parent.vm.selectedCube.select.dataSourceProperties[report.resources.ReportViewType[scope.reportObjDetails.reportViewType]];
                                rptObjDetails.pageSize = rptObjDetails.pageSize != undefined ? (rptObjDetails.pageSize) : '51';
                            }
                            rptObjDetails.isLazyLoadingRequired = false;
                            rptObjDetails.reportViewType = utilities.getReportViewTypeBasedOnChartType(scope.activeChart.name);
                            if (rptObjDetails.reportViewType === report.resources.ReportViewType.GaugeChart) {
                                rptObjDetails.pageSize = '7';
                            }
                            if (rptObjDetails.reportDetailObjectId == '') {
                                rptObjDetails.reportDetailObjectId = "00000000-0000-0000-0000-000000000000";
                            }
                            scope.$parent.vm.ReportService.getAndSetDataForPagination(rptObjDetails, scope.$parent.vm.defer = scope.$parent.vm.$q.defer()).then(function (obj) {
                                scope.jumpToConfig.showPaginationLoader = false;
                                if (obj && obj.toLowerCase() == 'true') {
                                    scope.jumpToConfig.enableJumpTo = true;
                                }
                                else {
                                    scope.$parent.vm.notificationService.toastMessage($translate.instant('jumpToError'), 3000);
                                    var toastMessageContainer = document.getElementById('toast-container');
                                    if (toastMessageContainer) {
                                        toastMessageContainer.style.maxWidth = "450px";
                                    }
                                    scope.jumpToConfig.toogleJumpToFunction = false;
                                }
                            });
                        }
                    };
                    scope.enableJumpToForUser = function () {
                        scope.jumpToConfig.toogleJumpToFunction = false;
                        scope.jumpToConfig.newModel();
                        //Whether to show or hide the jumpTo checkbok
                        if (scope.$parent.vm.selectedCube.select.dataSourceProperties != undefined && scope.$parent.vm.selectedCube.select.dataSourceProperties.hasOwnProperty('enableJumpToFeature')) {
                            if (scope.$parent.vm.selectedCube.select.dataSourceProperties.enableJumpToFeature.toLowerCase() == 'true') {
                                scope.jumpToConfig.enableJumpToFunction = true;
                            }
                            else
                                scope.jumpToConfig.enableJumpToFunction = false;
                        }
                        else {
                            scope.jumpToConfig.enableJumpToFunction = false;
                        }
                    };
                    scope.validatePageNumber = function () {
                        if (scope.jumpToConfig.userEnteredPage > masterJson[rowelIndex].pageInfo.endPage ||
                            scope.jumpToConfig.userEnteredPage < 1 ||
                            isNaN(scope.jumpToConfig.userEnteredPage)) {
                            document.querySelector('.navToPageInputWrapper input').classList.add('redBorder');
                        }
                        else {
                            document.querySelector('.navToPageInputWrapper input').classList.remove('redBorder');
                        }
                    };
                    scope.navigateToPage = function (eventName) {
                        if (!(scope.jumpToConfig.userEnteredPage > masterJson[rowelIndex].pageInfo.endPage ||
                            scope.jumpToConfig.userEnteredPage < 1 ||
                            isNaN(scope.jumpToConfig.userEnteredPage))) {
                            scope.refreshChart(eventName, parseInt(scope.jumpToConfig.userEnteredPage));
                        }
                    };
                };
            }
            ReportChart.Factory = function () {
                var directive = function ($http, $translate, utilities, $window, $timeout, SharedService) {
                    return new ReportChart($http, $translate, utilities, $window, $timeout, SharedService);
                };
                directive['$inject'] = ['$http', '$translate', 'common.utilitiesService', '$window', '$timeout', 'SharedService'];
                return directive;
            };
            return ReportChart;
        }());
        directives.ReportChart = ReportChart;
        angular.module('reportApp.reportchart', ['common.utilitiesService'])
            .directive('reportchart', ReportChart.Factory());
    })(directives = report.directives || (report.directives = {}));
})(report || (report = {}));
