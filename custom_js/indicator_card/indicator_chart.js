jQuery(document).ready(function($) {
	$("span.indicator-country").text(selSettings.selCoName)
	$("div.indicator-breadcrumbs").html(selSettings.selIndicatorScope + " / " + selSettings.selIndicatorPolicy + " / " + selSettings.selIndicatorTarget )
	//This is attached to a view in the card. We know the card is finished loding if the view is attached. So this will only run after the card is done.
	//We start by showing the card.
	
	//as long as an indicator map field has been defined we can make it 3D
	if ( $( ".field--name-field-map-rest-field" ).text().length ) {
		$(".mapboxgl-ctrl-icon.mapboxgl-ctrl-chart-3D").removeClass("disabled");
	}
	
	var indicatorName = jQuery("div.indicator-row.activeSelection").find('.field--name-title').text();
	updateBreadIndicator(indicatorName);
	var indicatorClass = indicatorName.replace(/\s/g, "-");
	//check if the indicator has been activated in the past by seeing if it's in the array of indicators
	activeIndicator = $.inArray( indicatorClass, selSettings.selIndicators );
	
	//if it hasn't been activated yet, add it to the array
	//if(activeIndicator == -1){
		//we add this indicators options/settings to the end of each array in our global settings file. 
		//this tells us that this indicator is active 
		selSettings.selIndicatorsActive = 1;
		//we store the indicator class to be used where needed
		selSettings.selIndicators = indicatorClass;

		//this is to see if the results have been proccessed for the chart. This will happen the first time the chart is turned on. 
		selSettings.selIndicatorChartProc = false;
		var indicatorWrapper = $(".indicator-hidden-content");
		var cardError = '';

		//for each of these we work our way up from the active url. then find the field we need. This is due to the way drupal views generates the table
		if ($( ".field--name-field-rest-service-url" ).length){
			var indicatorRESTurl = $(indicatorWrapper).find( ".field--name-field-rest-service-url" ).text();
			selSettings.selIndicatorRESTurl = indicatorRESTurl;
		} else {
			selSettings.selIndicatorRESTurl = "";
			cardError = cardError + "No REST URL has been defined<br>"
		}
		if ($( ".field--name-field-map-layer-field" ).length){
			var indicatorMapLayer = $(indicatorWrapper).find( ".field--name-field-map-layer-field" ).text();
			selSettings.selIndicatorMapLayerField = indicatorMapLayer;
			var indicatorMap = $(indicatorWrapper).find( ".field--name-field-map-rest-field" ).text();
			selSettings.selIndicatorMappedField = indicatorMap;
		}
		if ($( ".chart-xaxis" ).length){
			var indicatorXaxis = $(indicatorWrapper).find( ".chart-xaxis" ).text().trim();
			try {
				indicatorXaxis = JSON.parse(indicatorXaxis);
			} catch (e) {
				cardError = cardError + "The X Axis is not setup correctly<br>";
				indicatorXaxis = '{}';
			}
			selSettings.selIndicatorXaxis = indicatorXaxis;
		}
		if ($( ".chart-yaxis" ).length){
			var indicatorYaxis = $(indicatorWrapper).find( ".chart-yaxis" ).text().trim();
			try {
				indicatorYaxis = JSON.parse(indicatorYaxis);
			} catch (e) {
				cardError = cardError + "The Y Axis is not setup correctly<br>";
				indicatorYaxis = '{}';
			}			
			selSettings.selIndicatorYaxis = indicatorYaxis;
		}
		if ($( ".chart-series" ).length){
			var indicatorSeries = $(indicatorWrapper).find( ".chart-series" ).text().trim();
			indicatorSeries = indicatorSeries.replace(/(}\s*\s)+/g, "}||").split("||");
			indicatorSeries.forEach(function(object, index){
				try {
					indicatorSeries[index] = JSON.parse(object);
				} catch (e) {
					cardError = cardError + "Series "+ index +" is not setup correctly<br>";
					indicatorSeries = '{}';
				}	
			});		
			selSettings.selIndicatorChartSeries = indicatorSeries;
		}
		//check if there's any assigned countries to mask out the others....
		var indicatorCountriesArray = [];
		if ($( ".field--name-field-countries" ).length){
			$(indicatorWrapper).find( ".field--name-field-countries" ).children().each(function () {
				indicatorCountriesArray.push($(this).text().trim())
			});
			selSettings.selIndicatorCountries = indicatorCountriesArray;
		}
/* 		if ($( ".field--name-field-countries" ).length){
			console.log("test");
 			$(indicatorWrapper).find( ".field--name-field-countries" ).children().each(function () {
				indicatorCountriesArray.push($(this).text().trim())
			}); 
			selSettings.selIndicatorCountries = indicatorCountriesArray;
		} */
		var indicatorImages = $(indicatorWrapper).find('img').attr('src');
		selSettings.selIndicatorImages = indicatorImages;
		
		//we also add the active country for this request so we can reduce rest requests if the user just wants to toggle indicators all day in the same country
		selSettings.selIndicatorResCo = selSettings.selCoISO2;
		//here we get the current location of this indicator within the array of indicators
		activeIndicator = indicatorClass;
		//get the results from the REST service
		
		getRestResults(activeIndicator);
		return;
	//}
/* 	//if the country hasn't changed bring the map (the results/error will already be present.)
	if((selSettings.selIndicatorResCo[activeIndicator] == selSettings.selCoISO2)){
		console.log("asd")
		//ensure the indicator is set as active 
		selSettings.selIndicatorsActive[activeIndicator] = 1;
		mapTheIndicator(activeIndicator); //this both shows the card and makes the map
		return;
	}
	//if the country no longer matches with what we have recorded for this indicator, change the country and run the rest request
	if(selSettings.selIndicatorResCo[activeIndicator] != selSettings.selCoISO2){
		selSettings.selIndicatorResCo[activeIndicator] = selSettings.selCoISO2;
		selSettings.selIndicatorsActive[activeIndicator] = 1;
		getRestResults(activeIndicator);
	} */
});

jQuery(window).resize(function(){
    resizeChart();
    if(jQuery(".indicator-chart")){
      myCharts.forEach(function(object, index){
        myCharts[index].resize();
      })
    }
});
function resizeChart(){
  var chartWidth;
  if(jQuery(".indicator-wrapper")){
    chartWidth = jQuery('.map-menu').outerWidth();
    //chartWidth = document.getElementById(id).clientWidth;
    jQuery('.indicator-chart').css('width', chartWidth);
  }
}