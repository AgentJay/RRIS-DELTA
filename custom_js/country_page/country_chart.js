var countryCharts = [];

var CountrySettings = {
	selIndicators: [],
	selIndicatorMapLayerField: [],
	selIndicatorMappedField: [],
	selIndicatorChartType: [],
	selIndicatorRESTurl: [],
	selIndicatorRESTFields: [],
	selIndicatorRESTFieldLabels: [],
	selIndicatorChartProc: [],
	selIndicatorXaxis: [],
	selIndicatorYaxis: [],
	selIndicatorChartSeries: [],
	selIndicatorChartRadarSeries: [],
	selIndicatorChartRadarSettings: [],
	selIndicatorCountries: [],
	selIndicatorTooltip: [],
	selIndicatorsActive: [],
	selIndicatorResCo: [],
	selIndicatorRes: [],
	selIndicatorImages: []
};

jQuery(".country-summary-dialog").ready(function($) {
	//views-field-field-bar-line-chart
	$(".views-col").each(function(index) {
		var indicatorName = $.trim($(this).find(".field--name-title").text());
		//console.log(indicatorName)
		var indicatorClass = indicatorName.replace(/\s/g, "-");
		var indicatorID = $.trim($(this).find(".views-field-nid").text());
		var activeIndicator = $.inArray(indicatorID, CountrySettings.selIndicators);

		if (activeIndicator == -1) {
			CountrySettings.selIndicators.push(indicatorID);
			var indicatorWrapper = $(this);
			//for each of these we work our way up from the active url. then find the field we need. This is due to the way drupal views generates the table
			var indicatorRESTurl = $(indicatorWrapper).find(".views-field-field-rest-service-url").text();
			CountrySettings.selIndicatorRESTurl.push(indicatorRESTurl);
			var indicatorMapLayer = $(indicatorWrapper).find(".views-field-field-map-layer-field").text();
			CountrySettings.selIndicatorMapLayerField.push(indicatorMapLayer);
			var indicatorMap = $(indicatorWrapper).find(".views-field-field-map-rest-field").text();
			CountrySettings.selIndicatorMappedField.push(indicatorMap);
			var indicatorXaxis = $(indicatorWrapper).find(".chart-xaxis").text().trim();
			indicatorXaxis = JSON.parse(indicatorXaxis);
			CountrySettings.selIndicatorXaxis.push(indicatorXaxis);
			var indicatorYaxis = $(indicatorWrapper).find(".chart-yaxis").text().trim();
			indicatorYaxis = JSON.parse(indicatorYaxis);
			CountrySettings.selIndicatorYaxis.push(indicatorYaxis);
			var indicatorSeries = $(indicatorWrapper).find(".chart-series").text().trim();
			indicatorSeries = indicatorSeries.replace(/(}\s*\s)+/g, "}||").split("||");
			indicatorSeries.forEach(function(object, index) {
				indicatorSeries[index] = JSON.parse(object);
			});
			CountrySettings.selIndicatorChartSeries.push(indicatorSeries);
			var indicatorCountries = $(indicatorWrapper).find(".indicator-countries").text();
			var indicatorCountriesArray = indicatorCountries.split(", ");
			CountrySettings.selIndicatorCountries.push(indicatorCountriesArray);
			var indicatorImages = $(indicatorWrapper).find('img').attr('src');
			CountrySettings.selIndicatorImages.push(indicatorImages);
		}
		activeIndicator = $.inArray(indicatorID, CountrySettings.selIndicators);
		getCountryRestResults(activeIndicator);
		$(this).append("<div class='country-chart' id='country-chart-" + indicatorID + "-wrapper'></div>");
	});

	function getCountryRestResults(activeIndicator) {
		console.log(activeIndicator)
		//we get the indicator name as a class
		var indicator = CountrySettings.selIndicators[activeIndicator];
		//we pass the class to our generate url function to keep the finished product 
		var indicatorURL = generateCountryRestURL(activeIndicator);
		jQuery.ajax({
			url: indicatorURL,
			dataType: 'json',
			success: function(d) {
				CountrySettings.selIndicatorRes[activeIndicator] = d;
				/* 				if (d.metadata.recordCount == 0) {
									//we create a card, but tell it that the response was empty (error 2)
									getCountryChart(activeIndicator, indicator, 2);
								} else {
									//create the map
									//mapTheIndicator(activeIndicator);
									//the 0 means there was no error
									getCountryChart(activeIndicator, indicator, 0);
								} */
				if (d.hasOwnProperty("records")) { //from a JRC REST Service
					selSettings.selIndicatorRes = d.records;
					if (d.metadata.recordCount == 0) {
						//we create a card, but tell it that the response was empty (error 2)
						getCountryChart(activeIndicator, indicator, 2);
					}
					else {
						//create the map
						//mapTheIndicator(activeMapIndicator);
						//the 0 means there was no error
						getCountryChart(activeIndicator, indicator, 0);
					}
				}
				if (d.hasOwnProperty("dimensions")) { //from an UN Stats SDG REST Service
					selSettings.selIndicatorRes = d.dimensions;
					getCountryChart(activeIndicator, indicator, 0);
				}
			},
			error: function() {
				//we create a card, but tell it that there was a general error (error 1)
				//todo - expand error codes to tell user what went wrong.
				getCountryChart(activeIndicator, indicator, 1);
			}
		});
	}

	function generateCountryRestURL(activeIndicator) {
		//we get the url from the hidden fields in the indicator menu
		var indicatorURL = CountrySettings.selIndicatorRESTurl[activeIndicator]
		//our URL should contain some tokens as placeholders. So here we switch those out with the real values
		indicatorURL = indicatorURL.replace("NUM", selSettings.selCoNUM)
			.replace("ISO2", selSettings.selCoISO2)
			.replace("ISO3", selSettings.selCoISO3)
			.replace("WDPAID", selSettings.selPA);
		return indicatorURL;
	}

	function getCountryChart(key, indicator, error) {
		console.log(indicator + "error " + error);
		//we look to see if the chart div has been created already
		//if it's not there, make it, if it is there, turn it on
		if (jQuery('#country-chart-' + CountrySettings.selIndicators[key]).length == 0) {
			if ((indicator == CountrySettings.selIndicators[key]) && (error > 0)) {
				chartCountryError(key, error)
			}
			else {
				jQuery("div#country-chart-" + CountrySettings.selIndicators[key] + "-wrapper").append("<div class='country-chart-inner' id='country-chart-" + CountrySettings.selIndicators[key] + "'>" +
					"</div>");
			}
		}
		else {
			jQuery('#country-chart-' + CountrySettings.selIndicators[key]).show("fast");
		}

		//we initialize e-charts and attach it to the chart div 
		if (error == 0) {
			countryCharts[key] = echarts.init(document.getElementById('country-chart-' + CountrySettings.selIndicators[key]));
			var chartSettings = checkCountryChartData(key);
			makeCountryCharts(key, chartSettings);
		}
	}

	function chartCountryError(key, error) {
		var errorContainer = $('#country-chart-' + CountrySettings.selIndicators[key] + "-wrapper").closest(".views-col").find(".rest-error-container");
		if (error == 2) {
			errorContainer.html("<div class='alert alert-info'>No results for <b>" + CountrySettings.selIndicators[key] + "</b> in <b>" + selSettings.selCoName + "</b>.</div>");
		}
		else {
			errorContainer.html("<div class='alert alert-warning'>There was an error.</div>");
		}
	}

	function sortByKey(array, key) {
		return array.sort(function(a, b) {
			var x = a[key];
			var y = b[key];
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	}

	function checkCountryChartData(indicator) {
		//we take the REST results and put it into a new variable, this ensures the original results are stored unmodified.
		if (CountrySettings.selIndicatorRes[indicator].hasOwnProperty("dimensions")) {
			var indicatorResults = CountrySettings.selIndicatorRes[indicator].dimensions;
			console.log("good");
		}
		else {
			var indicatorResults = CountrySettings.selIndicatorRes[indicator].records;
		}

		//var indicatorResults = (CountrySettings.selIndicatorRes[indicator].hasOwnProperty("data")) ? CountrySettings.selIndicatorRes[indicator].data : CountrySettings.selIndicatorRes[indicator].records.slice(0);
		console.log(indicatorResults);
		var xAxis = jQuery.extend(true, {}, CountrySettings.selIndicatorXaxis[indicator]);
		//sort the xaxis data by year
		sortByKey(indicatorResults, xAxis['data']);

		//here we replace the x axis data placeholder with the array of values from the rest service. We only do this if they have assigned a vlaue to that axis.
		if (typeof xAxis['data'] !== 'undefined') {
			var xAxisData = [],
				testDate, fullDate;
			indicatorResults.forEach(function(object) {
				// 	//get the date - it could be a simple year, e.g. 2012 or more complex, e.g. 2016/04/16
				// 	testDate = object[xAxis['data']];
				// 	if (testDate.length === 4){ //assumption is that if the test date is 4 characters long then it is a year
				// 	  fullDate = new Date(testDate, 11, 31); //month index and date
				// 	}else{
				// 	  fullDate = new Date(testDate); 
				// 	}
				// 	xAxisData.push(fullDate.toLocaleString());
				xAxisData.push(object[xAxis['data']]);
			});
			xAxis['data'] = xAxisData;

		}

		var yAxis = jQuery.extend(true, {}, CountrySettings.selIndicatorYaxis[indicator]);
		//here we replace the y axis data placeholder with the array of values from the rest service. We only do this if they have assigned a vlaue to that axis.
		if (typeof yAxis['data'] !== 'undefined') {
			var yAxisData = [];
			indicatorResults.forEach(function(object) {
				yAxisData.push(object[yAxis['data']]);
			});
			yAxis['data'] = yAxisData;
		}

		var mappedField = [];
		var wdpaIDs = [];
		indicatorResults.forEach(function(object) {
			wdpaIDs.push(object['wdpa_id']);
			mappedField.push(object[CountrySettings.selIndicatorMappedField[indicator]]);
		});

		//first we get the list of all data series defined in the indicator content type
		//we push these to the chartSeries array
		var chartSeries = [];

		//had a killer time trying to figure out why this damn thing wasn't cloning using other methods. Just leave it like this
		var data = JSON.parse(JSON.stringify(CountrySettings.selIndicatorChartSeries[indicator]));
		for (var key2 in data) {
			// skip loop if the property is from prototype
			if (!data.hasOwnProperty(key2)) continue;
			var obj = data[key2];
			for (var prop in obj) {
				// skip loop if the property is from prototype
				if (!obj.hasOwnProperty(prop)) continue;
				if (prop == 'data') {
					//replace the placeholder of the series map with the actual array from the rest service 
					//obj[prop] = indicatorResults[obj[prop]];
					chartSeries.push(obj[prop])
					//console.log(prop + " = " + obj[prop]);
				}
			}
		}

		//here we exchange the field labels in the array with arrays of the field values. 
		chartSeries.forEach(function(object, index) {
			var chartData = [];
			indicatorResults.forEach(function(object2) {
				chartData.push(object2[chartSeries[index]]);
			});
			chartSeries[index] = chartData;
		});

		//Now we got back into the original results and replace the series data with the arrays 
		//we push these to the chartSeries array
		for (var key2 in data) {
			// skip loop if the property is from prototype
			if (!data.hasOwnProperty(key2)) continue;
			var obj = data[key2];
			for (var prop in obj) {
				// skip loop if the property is from prototype
				if (!obj.hasOwnProperty(prop)) continue;
				if (prop == 'data') {
					//replace the placeholder of the series map with the actual array from the rest service 
					obj[prop] = chartSeries[key2];
					//console.log(prop + " = " + obj[prop]);
				}
			}
			//data[key2]['wdpa'] = wdpaIDs;
			data[key2]['mapFeature'] = mappedField;
		}
		//var wdpa = {type:"bar", data:wdpaIDs, name:"WDPA"};
		CountrySettings.selIndicatorChartProc[indicator] = true;
		var chartSettings = new Object();
		chartSettings['xAxis'] = xAxis;
		chartSettings['yAxis'] = yAxis;
		chartSettings['data'] = data;
		//chartSettings['radar'] = radarSettings;
		return chartSettings;
	}

	function makeCountryCharts(key, chartSettings) {
		var option = {
			title: {
				text: CountrySettings.selIndicators[key] + " for \n" + selSettings.selCoName,
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
						name: CountrySettings.selIndicators[key] + " for " + selSettings.selCoName
					}
				}
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow', // 'line' | 'shadow'
				},
				confine: true
			},
			xAxis: chartSettings.xAxis,
			yAxis: chartSettings.yAxis,
			dataZoom: [{ // This dataZoom component controls x-axis by dafault
				type: 'slider', // this dataZoom component is dataZoom component of slider
			}],
			series: chartSettings.data
		};
		countryCharts[key].setOption(option);
		var option2 = countryCharts[key].getOption();
		return;
	}

});
