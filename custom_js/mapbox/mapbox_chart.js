var indicatorChart;

//initiates the chart building
function getChart(indicator, error){
	//now we cycle through the indicators
	//there should only ever be 1 active indicator, so when we find it we make the chart card
	//console.log(selSettings.selIndicators);
	if (selSettings.selIndicatorsActive == 1) {
		jQuery( ".rest-error-container" ).empty();
		if (error == 0 ){
			indicatorChart = echarts.init(document.getElementById('indicator-chart'));
			//console.log(indicatorChart);
			var chartSettings = checkChartData();
			makeCharts(chartSettings);
		} else {
			chartError(error)
		}
		
	}
}

function chartError(error){
	if(error == 2){
		jQuery( ".rest-error-container" ).html("<div class='alert alert-info'>No results for <b>"+selSettings.selIndicators+"</b> in <b>" + selSettings.selCoName + "</b>.</div>");
		
	} else {
		jQuery( ".rest-error-container" ).html("<div class='alert alert-warning'>There was an error.</div>");
	}
}
function closeIndicatorCard(){
	jQuery('#block-indicatorcard').hide();
	var indicatorName = jQuery("div.indicator-row.activeSelection").find('.field--name-title').text();
	var indicatorClass = indicatorName.replace(/\s/g, "-");
	updateBreadIndicator("NA");
	thisMap.setFilter("WDPADec2017Poly_high", ['==', 'ISO3', selSettings.selCoISO3]);
	removeIndicator(indicatorClass);
	jQuery(".activeSelection" ).prev().remove();
	jQuery(".activeSelection" ).removeClass( "activeSelection" );
	//as there are no charts we turn off the 3D toggle option
	jQuery(".mapboxgl-ctrl-icon.mapboxgl-ctrl-chart-3D").addClass("disabled");
}
function minimizeChart(){
  jQuery( ".activeSelection").first().next().trigger( "click" );
  //updateBreadIndicator("NA");
}
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
function checkChartData(){
		//we take the REST results and put it into a new variable, this ensures the original results are stored unmodified.
		var indicatorResults = selSettings.selIndicatorRes;

		var xAxis = jQuery.extend( true, {}, selSettings.selIndicatorXaxis );
		//sort the xaxis data by year
		sortByKey(indicatorResults,xAxis['data']);
		//here we replace the x axis data placeholder with the array of values from the rest service. We only do this if they have assigned a vlaue to that axis.
		if (typeof xAxis['data'] !== 'undefined'){
			var xAxisData = [], testDate, fullDate;
			indicatorResults.forEach(function(object){
				//get the date - it could be a simple year, e.g. 2012 or more complex, e.g. 2016/04/16
				// testDate = object[xAxis['data']];
				// if (testDate.length === 4){ //assumption is that if the test date is 4 characters long then it is a year
				//   fullDate = new Date(testDate, 11, 31); //month index and date
				// }else{
				//   fullDate = new Date(testDate);
				// }
				// xAxisData.push(fullDate.toLocaleString());
				xAxisData.push(object[xAxis['data']]);
			});
			xAxis['data'] = xAxisData;
		}

		var yAxis = jQuery.extend( true, {}, selSettings.selIndicatorYaxis );
		//here we replace the y axis data placeholder with the array of values from the rest service. We only do this if they have assigned a vlaue to that axis.
		if (typeof yAxis['data'] !== 'undefined'){
			var yAxisData = [];
			indicatorResults.forEach(function(object){
				yAxisData.push(object[yAxis['data']]);
			});
			yAxis['data'] = yAxisData;
		}
		
		var mappedField = [];
		var wdpaIDs = [];
		indicatorResults.forEach(function(object){
			wdpaIDs.push(object['wdpa_id']);
			mappedField.push(object[selSettings.selIndicatorMappedField]);
		});
		
		//first we get the list of all data series defined in the indicator content type
		//we push these to the chartSeries array
		var chartSeries = [];
		
		//had a killer time trying to figure out why this damn thing wasn't cloning using other methods. Just leave it like this
		var data = JSON.parse(JSON.stringify(selSettings.selIndicatorChartSeries));
		for (var key2 in data) {
			// skip loop if the property is from prototype
			if (!data.hasOwnProperty(key2)) continue;
			var obj = data[key2];
			for (var prop in obj) {
				// skip loop if the property is from prototype
				if(!obj.hasOwnProperty(prop)) continue;
				if (prop=='data'){
					//replace the placeholder of the series map with the actual array from the rest service 
					//obj[prop] = indicatorResults[obj[prop]];
					chartSeries.push(obj[prop])
					//console.log(prop + " = " + obj[prop]);
				}
			}
		}
		
		//here we exchange the field labels in the array with arrays of the field values. 
		chartSeries.forEach(function(object, index){
			var chartData = [];
			indicatorResults.forEach(function(object2){
				chartData.push(object2[chartSeries[index]]);
			});
			chartSeries[index]=chartData;
		});
		
		//Now we got back into the original results and replace the series data with the arrays 
		//we push these to the chartSeries array
		for (var key2 in data) {
			// skip loop if the property is from prototype
			if (!data.hasOwnProperty(key2)) continue;
			var obj = data[key2];
			for (var prop in obj) {
				// skip loop if the property is from prototype
				if(!obj.hasOwnProperty(prop)) continue;
				if (prop=='data'){
					//replace the placeholder of the series map with the actual array from the rest service 
					obj[prop] = chartSeries[key2];
					//console.log(prop + " = " + obj[prop]);
				}
			}
			//data[key2]['wdpa'] = wdpaIDs;
			data[key2]['mapFeature'] = mappedField;
		}
		//var wdpa = {type:"bar", data:wdpaIDs, name:"WDPA"};
		selSettings.selIndicatorChartProc = true;
		var chartSettings = new Object();
		chartSettings['xAxis'] = xAxis;
		chartSettings['yAxis'] = yAxis;
		chartSettings['data'] = data;
		//chartSettings['radar'] = radarSettings;
		return chartSettings;
}

function makeCharts(chartSettings){
	//we update the Country Name in the card
	jQuery("span.indicator-country").text(selSettings.selCoName)
	
	var option = {
 		title: {
			text: selSettings.selIndicators + " for \n" + selSettings.selCoName,
			show: false
		}, 
		legend: {
				show: true,
				orient: 'horizontal',
				align: 'left',
				top: '2%',
				left: '5%',
				width: '80%',
				itemGap: 4,
				itemHeight: 7,
				itemWidth: 15,
				padding: 1,
			},
		toolbox: {
			show: true,
			feature: {
				restore: {
					title: 'Restore'
				},
				saveAsImage: {
					title: 'Image',
					name: selSettings.selIndicators + " for " + selSettings.selCoName
				}
			}
		},
		tooltip: {
			trigger: 'axis',
			axisPointer : {            
				type : 'shadow',        // 'line' | 'shadow'
			},
			confine: true
		},
		xAxis: chartSettings.xAxis,
		yAxis: chartSettings.yAxis,
		dataZoom: [
			{   // This dataZoom component controls x-axis by dafault
				type: 'slider', // this dataZoom component is dataZoom component of slider
			}
		],
		series: chartSettings.data
	}; 
	indicatorChart.setOption(option); 
	//console.log(option);
	var option2 = indicatorChart.getOption();
	
	mapTheIndicator();

	indicatorChart.on('click', function (params) {
		if (params.componentType === 'series'){
			//var wdpa = option2.series[params.seriesIndex].wdpa[params.dataIndex];
			var mapFeature = option2.series[params.seriesIndex].mapFeature[params.dataIndex];
			if (typeof mapFeature !== "undefined"){
				var country = thisMap.querySourceFeatures('composite',{
					sourceLayer:'Country_EEZ_simplified-2no7w4',
					filter: ['==', 'ISO2', selSettings.selCoISO2]
				});
				var bbox = 	[[country[0].properties.MINX,country[0].properties.MINY], 
							[country[0].properties.MAXX,country[0].properties.MAXY]];
				thisMap.fitBounds(bbox);
			
			
				thisMap.once('moveend', function() {
					setTimeout(function(){
					var protectedArea = thisMap.querySourceFeatures('composite',{
						sourceLayer:'ACP_Poly-ch9f72',
						filter: ['==', selSettings.selIndicatorMapLayerField, mapFeature]
					});
					bbox = 	[[protectedArea[0].properties.MINX,protectedArea[0].properties.MINY], 
								[protectedArea[0].properties.MAXX,protectedArea[0].properties.MAXY]];
					thisMap.fitBounds(bbox, {
						padding: 50
					});
					}, 10);
				});
			}
			
		}
	});
	indicatorChart.on('mouseover', function (params) {
		if (params.componentType === 'series'){
			//var wdpa = option2.series[params.seriesIndex].wdpa[params.dataIndex];
			var mapFeature = option2.series[params.seriesIndex].mapFeature[params.dataIndex];
			if (mapFeature){
				thisMap.setFilter('chartHover', [ "all", ['==', selSettings.selIndicatorMapLayerField, mapFeature], ['==', 'ISO3', selSettings.selCoISO3] ]);
				//thisMap.setFilter("chartHover", buildFilter(wdpa, '==', 'WDPAID'));
				thisMap.setLayoutProperty("chartHover", 'visibility', 'visible');
			}
		} 
	});
	indicatorChart.on('mouseout', function (params) {
		if (params.componentType === 'series'){
			thisMap.setLayoutProperty("chartHover", 'visibility', 'none');
		}
	});
	indicatorChart.on('dataZoom', function (params) {
		mapTheIndicator();
	});
	return;
}
function getChartMappedFields(chart, dataSeries){
	var option = chart.getOption();
	
	if (dataSeries == 1){
		var MappedSeriesArray = option.series[0].data;
		var MappedSeriesZoom = MappedSeriesArray.slice(option.dataZoom[0].startValue, option.dataZoom[0].endValue);
		return MappedSeriesZoom;
	} else {
		var MappedFieldsArray = option.series[0].mapFeature;
		var MappedFieldsZoom = MappedFieldsArray.slice(option.dataZoom[0].startValue, option.dataZoom[0].endValue);
		return MappedFieldsZoom;
	}
}

function mapTheIndicator(activeChartIndicator){
	removeLayers(selSettings.selIndicators[activeChartIndicator]);
	var MappedFieldsZoom = getChartMappedFields(indicatorChart);
	var MappedSeriesZoom = getChartMappedFields(indicatorChart, 1);
	var filter = buildFilter(MappedFieldsZoom, 'in', selSettings.selIndicatorMapLayerField);
	
	if (chart3D == true){
		map3D(MappedFieldsZoom, MappedSeriesZoom)
	} else {
		map2D(filter)
	}
}

function map2D(filter){
	//filter the map based on the user defined field in the indicator (filter) and the selected country
	thisMap.setFilter("WDPADec2017Poly_high", [ "all", filter, ['==', 'ISO3', selSettings.selCoISO3] ]);
}
function map3D(MappedFieldsZoom, MappedSeriesZoom){
	
	//make the map
	//loop through all the records in the response and create a layer that shows the feature.
	jQuery(MappedFieldsZoom).each(function(i, data) {
		thisMap.addLayer({
			"id": "indilayer3D"+selSettings.selIndicators+i,
			"type": "fill-extrusion",
			"source": 'composite',
			'filter': ["all",
			['==', 'ISO3', selSettings.selCoISO3],
			['==', 'WDPAID', data]],
			"source-layer": "ACP_Poly-ch9f72",
			"layout": {
				"visibility": "visible"
			},
			'paint': {
				'fill-extrusion-color':  '#aaa',
				'fill-extrusion-height': MappedSeriesZoom[i]*5000,
				'fill-extrusion-base': 0,
				'fill-extrusion-opacity': 0.5
			}
		}, 'CountryLabels');
	});
}