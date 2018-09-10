
//initiates the chart building
function getChart(indicator, error){
	if(typeof(selSettings) != "undefined" && variable !== null) {
		//now we cycle through the indicators
		for (var key in selSettings.selIndicators) {
			//there should only ever be 1 active indicator, so when we find it we make the chart card
			if (selSettings.selIndicatorsActive[key] == 1) {
				//make sure the chart(s) have a place to go
				//Make sure the information from the REST service is in the format the chart requires
				updateChartArea(key, chartSettings, indicator, error);
				var chartSettings = checkChartData(key);
				makeCharts(key, chartSettings);
			}
		} 
	} else {
		console.log("boom");
	}
}
