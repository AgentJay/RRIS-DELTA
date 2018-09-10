
jQuery(document).ready(function($) {
	//alternative interesting events 'boxzoomend', 'zoomend', 'touchend'
	thisMap.on('click', getFeatureInfo);
  
	function checkViewScope(){
		var mapZoom = thisMap.getZoom();
		var mapCenter = thisMap.getCenter().toArray();
		//console.log(mapCenter);
		//var features = thisMap.queryRenderedFeatures(mapCenter);

	}
	function getFeatureInfo(e){
		//Global Function to get the Country feature (returns first in array if there's an overlap)
		var country = getMapCountry(e.point);
		
// 		var bbox = [[country.properties.MINX,country.properties.MINY], 
// 			[country.properties.MAXX,country.properties.MAXY]];
// 		thisMap.fitBounds(bbox);

		//FIRST check if we are in a country
		if (typeof country !== 'undefined') {
			
			//SECOND Check if we are in the SAME country we already selected
			if (selSettings.selCoISO2 != country.properties.ISO2){
			  selSettings.selCoISO2 = country.properties.ISO2;
			  countryChanged = 1;
			  checkCountryChanged();
			} else {
				
				//THIRD We know the country is the same, check if a PA has been selected.
				var PAs = getPAsFeatures(e.point);
				if (typeof PAs !== 'undefined') {
					console.log(PAs);
					var paLinks = "";
					for (var key in PAs) {
					  paLinks = paLinks + "<div class='pop-pa-wrapper'>" + 
					  "<div class='pop-pa-name'>" + PAs[key].properties.NAME + "</div>" +
					  "<div class='pop-pa-iucn'>(IUCN Cat: " + PAs[key].properties.IUCN_CAT + ")</div>" +
					  "<span class='pa-link pop-pa-summary-link'>Protected Area Summary</span>   " + "<span class='pa-link pop-pa-progress-link'>Progress against targets</span>" +
					  "<div class='pop-paid hidden'>" + PAs[key].properties.WDPA_PID + "</div>" +
					  "</div>";
					}
					
					paPopupContent = "<div class='pop-wrapper'>" +
					"<div class='pop-country'>" + country.properties.ADM0_NAME + "</div>" +
					paLinks +
					"</div>";
					
					new mapboxgl.Popup()
						.setLngLat(e.lngLat)
						.setHTML(paPopupContent)
						.addTo(thisMap);
				}
			}
		}
	}
	$('div#map-container').on('click', 'span.pop-pa-summary-link', function(e) {
	  var popWDPAID = $(this).closest(".pop-pa-wrapper").find(".pop-paid").text().trim();
	  var popWDPAname = $(this).closest(".pop-pa-wrapper").find(".pop-pa-name").text().trim();
	  selSettings.selPA = popWDPAname;
 	  var paURL = '/pa/'+popWDPAID;
	  Drupal.ajax({ 
		  url: paURL,
		  success: function(response) {			
			var $paDialogContents
			for (var key in response) {
				// skip loop if the property is from prototype
				if (!response.hasOwnProperty(key)) continue;
				var obj = response[key];
				for (var prop in obj) {
					// skip loop if the property is from prototype
					if(!obj.hasOwnProperty(prop)) continue;
					//console.log(prop + " = " + obj[prop]);
					if(prop == "data"){
						//console.log(prop + " = " + obj[prop]);
						$paDialogContents = $('<div>' + response[key].data + '</div>').appendTo('body');
					}
				}
			}
			var paDialog = Drupal.dialog($paDialogContents, {title: 'Protected Area summary for ' + selSettings.selPA, dialogClass: "country-summary-dialog", width: "80%", height: "80%"});
			paDialog.showModal();
		  }
	  }).execute(); 
	  
	});
	$.address.wrap(true);
	$.address.change(function(event) {
		// Selects the current anchor
		
		//console.log(event.value);
		if(event.value !== '/'){
			var parts = event.value.split("/");
			//console.log(parts);
			selSettings.selCoISO2 = parts[2];
			countryChanged = 1;
			zoomToCountry(selSettings.selCoISO2);
		}
		//if ((parts[0] != "") && (firstVisit == 1)) {
/* 		if (parts[1] != "") {
		  //console.log(parts)
		  selSettings.selCoISO2 = parts[0];
		  countryChanged = 1;
		  zoomToCountry(selSettings.selCoISO2);
		} */
	});
});
function zoomToCountry(iso2){
  var result;
  if(iso2 === 'FJ'){
    thisMap.fitBounds([[166.61,-26.39], [192.01,-9.62]], {
          padding: {top: 100, bottom:10, left: 350, right: 10}
        });
  } else if (iso2 === 'TV'){
    thisMap.fitBounds([[168.58,-13.60], [191.48,-3.88]], {
          padding: {top: 100, bottom:10, left: 350, right: 10}
        });
  } else if (iso2 === 'KI'){
    thisMap.fitBounds([[-201.57,-15.70], [-136.18,10.31]], {
          padding: {top: 100, bottom:10, left: 350, right: 10}
        });
  } else {
    jQuery.ajax({
      //
      url: "https://rest-services.jrc.ec.europa.eu/services/d6biopamarest/administrative_units/get_country_extent_by_iso?a_iso="+iso2+"&format=json",
      dataType: 'json',
      success: function(d) {

        thisMap.fitBounds(jQuery.parseJSON(d.records[0].extent), {
          padding: {top: 100, bottom:10, left: 350, right: 10}
        });
        //checkCountryChanged();
      },
      error: function() {
        //TODO Make error
      }
    });
  }
}

function checkCountryChanged() {
	if (countryChanged == 1){
    showBreadcrumbs();
		//Our Protected areas layer does not have the ISO2 country codes, it only has ISO3 codes.
		//The mapbox geocoder only has ISO2 codes (in lower case)...
		//We use our country layer, which has both, as a lookup table
		var relatedFeatures = thisMap.querySourceFeatures('composite',{
			sourceLayer:'Country_EEZ_simplified-2no7w4',
			filter: ['==', 'ISO2', selSettings.selCoISO2]
		});
		//Here we update all of our global settings by getting them from the EEZ/Country layer
		selSettings.selCoISO3 = relatedFeatures[0].properties.ISO3;
		selSettings.selCoNUM = relatedFeatures[0].properties.ISO3NUM;
    var region = relatedFeatures[0].properties.AWS_Group;
    switch(region) {
    case "ACP - ES Africa":
        region = "East/South Africa";
        break;
    case "ACP - CW Africa":
        region = "Central/West Africa";
        break;
    default:
        region = region;
    }
    if (selSettings.selRegion !== region){
        selSettings.selRegion = region;
        updateBreadRegion();
    }
    if (selSettings.selCoName !== relatedFeatures[0].properties.ADM0_NAME){
      selSettings.selCoName = relatedFeatures[0].properties.ADM0_NAME;
        updateBreadCountry();
    }

   jQuery(".select-country").css("padding", 0).css("height", 0).fadeOut("fast");
   //jQuery( "div.map-menu" ).show("slow").css('display', 'flex').queue(function() {
     // jQuery( this ).dequeue();
      //if (tourSelectCountry.isOpen())
       // mapboxTour.next()
   // });
    
//    jQuery("div.map-menu")
//     .on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
//      function(e){
//         if ((tourSelectCountry.isOpen()) && (jQuery("div.map-menu")))
//           mapboxTour.next();
//      });
    
		//Now we paint all the Protected areas in the selected country based on their IUCN category

		countryChanged = 0;
		//zoomToCountry(selSettings.selCoISO2);
		//we clear the chart proccessed flag for all charts as now we are working with a different country
/* 		for (var key in selSettings.selIndicators) {
			selSettings.selIndicatorChartProc = false;
		} */
		selSettings.selIndicatorChartProc = false;
		//console.log(selSettings.selIndicatorChartProc)
		//we delete all the charts that have been made as they were from a previous country
/* 		for (var key in myCharts) {
			myCharts[key] = {};
		} */
		indicatorChart = '';
		//we check to see if the currently selected indicator is turned on. If it is, then we add it to the newly selected country
		removeLayers(selSettings.selIndicators);
		getRestResults();
	}
}

watch(selSettings, ["selCoName"], function(){
	thisMap.querySourceFeatures('composite',{
		sourceLayer:'country-eez',
		filter: ['==', 'ISO2', selSettings.selCoISO2]
	});
	thisMap.setFilter('WDPADec2017Labels', ['==', 'ISO3', selSettings.selCoISO3]);
	thisMap.setLayoutProperty("selectedCountry", 'visibility', 'visible');
	thisMap.setFilter('selectedCountry', ['==', 'ISO3', selSettings.selCoISO3]);
	thisMap.setLayoutProperty("WDPADec2017Poly_high", 'visibility', 'visible');
	thisMap.setFilter('WDPADec2017Poly_high', ['==', 'ISO3', selSettings.selCoISO3]);
	console.log("country changed to "+selSettings.selCoISO2);
});