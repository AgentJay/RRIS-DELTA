var idOpen = 0;

(function ($, Drupal) {
  Drupal.behaviors.refreshView = {
	attach: function (context, settings) {
		var test = $( ".view-id-menu_level_1_policies_:visible" );
	  $('#drupal-off-canvas').find('form.node-policy-form .alert-success, form.node-policy-edit-form .alert-success').once('updated-view').each( function() {
			$( ".view-id-menu_level_1_policies_:visible" ).trigger('RefreshView')
	  });
	  $('#drupal-off-canvas').find('form.node-goal-target-form .alert-success, form.node-goal-target-edit-form .alert-success').once('updated-view').each( function() {
			$( ".menu-goals:visible" ).trigger('RefreshView');
	  });
	  $('#drupal-off-canvas').find('form.node-indicator-form .alert-success, form.node-indicator-edit-form .alert-success').once('updated-view').each( function() {
			$( ".menu-indicators:visible" ).trigger('RefreshView');
	  });	
 	$(".scope-content:visible").one('DOMSubtreeModified', ".view-menu-level-1-policies-", function() {
		//jQuery(jQuery("#yourElement").detach()).appendTo("body");
		$($(".view-id-menu_level_1_policies_:visible").detach()).appendTo("div.views-element-container.col-auto:visible");
		//$(  ).closest("div.views-element-container.col-auto")
	});
	}
  };
})(jQuery, Drupal);
function idEditor(){
	if (idOpen == 0){
    jQuery('.mapboxgl-ctrl.ajax-loader').toggle(true);
		idOpen = 1; 
		var center = thisMap.getCenter();
		var zoom = thisMap.getZoom();
	//	console.log(center.lng + "  " +  + "  " + zoom);
		var iFrameLink = '/id_demo/iD/#background=DigitalGlobe-Premium&disable_features=boundaries&map='+zoom+'/'+center.lat+'/'+center.lng;
		var ifrm = document.createElement('iframe');
		ifrm.setAttribute('id', 'iframe-container'); // assign an id
		var el = document.getElementById('map-container');
		el.parentNode.insertBefore(ifrm, el);
		var height = jQuery('.mapboxgl-canvas').outerHeight(true);
		var width = jQuery('.mapboxgl-canvas').outerWidth(true);
		jQuery('iframe#iframe-container').css('height', height-50);
		jQuery('iframe#iframe-container').css('width', width);
		jQuery('iframe#iframe-container').animate({left: 0},1000).queue(function() {
			jQuery('button#close-id-editor').toggle(true);
			jQuery( this ).dequeue();
		});

		ifrm.setAttribute('src', iFrameLink);
		//http://beta.biopama.org/id_demo/iD/#background=DigitalGlobe-Premium&disable_features=boundaries&map=16.05/-19.39773/23.04016
	} else {
		return;
	}	
}

function closeIdEditor(){
	if (idOpen == 1){
    jQuery( "#iframe-container" ).hide( "fast", function() {
			var elem = document.querySelector('#iframe-container');
			elem.parentNode.removeChild(elem);
		});
		jQuery('.mapboxgl-ctrl.ajax-loader').toggle(false);
    jQuery('button#close-id-editor').toggle(false);
    idOpen = 0; 
	} else {
		return;
	}
}
jQuery(document).ready(function($) {
	var mapLoaded = false;
	var menuTriggerClick = 1;
	var contentTriggerClick = 0;
	var mapContainer = 'map-container';
	
  $( "<i class='fa fa-circle-o'></i>" ).one().insertBefore( "#ui-accordion-4-header-0 > a" );
  $( "<i class='fa fa-dot-circle-o'></i>" ).one().insertBefore( "#ui-accordion-4-header-1 > a" );
  $( "<i class='fa fa-bullseye'></i>" ).one().insertBefore( "#ui-accordion-4-header-2 > a" );

	var height = $(window).height();// - $('#admin-menu-wrapper').outerHeight(true) + $('#messages').outerHeight(true);

	if ($('#toolbar-item-administration-tray')[0]){
		var adminHeight = $('#toolbar-item-administration-tray').height() + $('#toolbar-bar').height();
		$('#map-container').css('top', adminHeight);
		height = height - adminHeight;
	}
	
	$('#map-container').css('height', height);
	//var mapWidth = $(window).width();
	//$('#'+mapContainer+', .mapboxgl-canvas').css("width", mapWidth);
	

	mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNkYXZ5IiwiYSI6ImNpenRuMmZ6OTAxMngzM25wNG81b2MwMTUifQ.A2YdXu17spFF-gl6yvHXaw';
	var map = new mapboxgl.Map({
		container: mapContainer,
		//style: 'mapbox://styles/jamesdavy/cja2k11r90tlz2rpd249k2gw6',// Natural Earth
		style: 'mapbox://styles/jamesdavy/cj977n9d117bl2rqe7z7clozd', //North Star
		attributionControl: true,
		renderWorldCopies: true,
		center: [0, -6.66],
        zoom: 1.5,
		//maxBounds: [[-175.078125,-57.891497], [242.226562,50.064192]],
	});
	thisMap = map;
	

  map.addControl(new mapboxgl.FullscreenControl());
	map.addControl(new mapboxgl.NavigationControl());
	map.addControl(new mapboxgl.ScaleControl({
		maxWidth: 150,
		unit: 'metric'
	}));
  
	class mapGenericControl {
		onAdd(map) {
			this._map = map;
			this._container = document.createElement('div');
			this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
			this._container.innerHTML = "<button class='mapboxgl-ctrl-icon mapboxgl-ctrl-iD' type='button' id='id-editor-link' title='Open iD editor' href='#' onclick='idEditor();return false;'><i class='fas fa-pencil-alt'></i></button>"+
        "<button class='mapboxgl-ctrl-icon mapboxgl-ctrl-sat' id='satellite-layer' type='button'><i class='fab fa-grav'></i></button>"+
        "<button class='mapboxgl-ctrl-icon mapboxgl-ctrl-flickr' id='flickr-images' type='button'><i class='far fa-images'></i></button>";
			return this._container;
		}
		onRemove() {
			this._container.parentNode.removeChild(this._container);
			this._map = undefined;
		}
	}
  
	class mapChart3DControl {
		onAdd(map) {
			this._map = map;
			this._container = document.createElement('div');
			this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
			this._container.innerHTML = "<button class='mapboxgl-ctrl-icon mapboxgl-ctrl-chart-3D disabled' type='button'></button>";
			return this._container;
		}
		onRemove() {
			this._container.parentNode.removeChild(this._container);
			this._map = undefined;
		}
	}
	
	//The loading function for the map
	class mapLoaderControl {
		onAdd(map) {
			this._map = map;
			this._container = document.createElement('div');
			this._container.className = 'mapboxgl-ctrl ajax-loader ajax-load';
			this._container.innerHTML = "<div id='map-loader-wrapper'>"+
        "<div id='map-loader'></div>"+
        "</div>";
			return this._container;
		}
		onRemove() {
			this._container.parentNode.removeChild(this._container);
			this._map = undefined;
		}
	}
 	class mapCountryPAHover {
		onAdd(map) {
			this._map = map;
			this._container = document.createElement('div');
			this._container.className = 'mapboxgl-ctrl map-country-pa-info-wrapper';
			this._container.innerHTML = "<div id='map-country-info'></div><div id='map-pa-info'></div><div id='map-indicator-info'></div>";
			return this._container;
		}

		onRemove() {
			this._container.parentNode.removeChild(this._container);
			this._map = undefined;
		}
	} 

	var mapLoader = new mapLoaderControl();
	var mapGeneric = new mapGenericControl();
	var map3D = new mapChart3DControl();
	var mapInfo = new mapCountryPAHover();
	map.addControl(mapLoader, 'top-left');	
	map.addControl(mapGeneric, 'top-right');	
	map.addControl(map3D, 'top-right');	
	map.addControl(mapInfo, 'bottom-right');	
	map.on('data', checkLoading);	
	$('input').each(function(i){
	  if(this.id){
		this.id = this.id+i;
		$(this).closest('form').addClass(this.id);
	  }
	});

	map.on('moveend', function (e) {
		checkCountryChanged()
		var currentBounds = map.getBounds()
		 $('input[data-drupal-selector=edit-top]').val(currentBounds._ne.lat);
		 $('input[data-drupal-selector=edit-bottom]').val(currentBounds._sw.lat);
		 $('input[data-drupal-selector=edit-left]').val(currentBounds._ne.lng);
		 $('input[data-drupal-selector=edit-right]').val(currentBounds._sw.lng);
		 $('div[data-drupal-selector=edit-actions]').find('input[type=submit]').click();
	});
  
	map.on('mousemove', function (e) {
		var countryFeatures = getMapCountry(e.point);
		var paFeatures = getPAsFeatures(e.point);
		
		if (typeof countryFeatures !== 'undefined'){
			document.getElementById('map-country-info').innerHTML = "Country: "+countryFeatures.properties.ADM0_NAME
		} else {
			document.getElementById('map-country-info').innerHTML = "";
		}
		if (typeof paFeatures !== 'undefined'){
			document.getElementById('map-pa-info').innerHTML = "Protected Area: "+paFeatures[0].properties.NAME;
		} else {
			document.getElementById('map-pa-info').innerHTML = "";
		}
	});
	
	function checkLoading() {
		var tilesLoaded = map.areTilesLoaded();
		$('.mapboxgl-ctrl.ajax-loader').toggle(true);
		if ( tilesLoaded ) {
			$('.mapboxgl-ctrl.ajax-loader').toggle(false);
	  }
	}
  
	map.on('load', function () {

		mapLoaded = true;

		var satSwitch = document.getElementById('satellite-layer');
		satSwitch.addEventListener("click", function(){
			if ($( "#satellite-layer" ).hasClass( "sat-on" )) {
				$('#satellite-layer').removeClass( "sat-on" );
				map.setLayoutProperty('satellite', 'visibility', 'none');
			} else {
				$('#satellite-layer').addClass( "sat-on" );
				map.setLayoutProperty('satellite', 'visibility', 'visible');
			}
		});
			
		//add the PA highlighter layer for charts
		map.addLayer({
			"id": "chartHover",
			"type": "fill",
			"source": 'composite',
			"source-layer": "ACP_Poly-ch9f72",
			"layout": {
				"visibility": "none"
			},
			'paint': {
				'fill-color':  "rgba(236, 230, 89, 0.5)",
				'fill-outline-color': "rgba(255,69,0, 1)",
			}
		});
		//add the Country masks layer for indicators
		map.addLayer({
			"id": "CountriesBadMask",
			"type": "fill",
			"source": 'composite',
			"source-layer": "Country_EEZ_simplified-2no7w4",
			"layout": {
				"visibility": "none"
			},
			'paint': {
				'fill-color':  "rgba(10,10,10, 0.5)",
				'fill-outline-color': "rgba(10,10,10, 1)",
			}
		}, 'CountryLabels');
		map.addLayer({
			"id": "CountriesGoodMask",
			"type": "fill",
			"source": 'composite',
			"source-layer": "Country_EEZ_simplified-2no7w4",
			"layout": {
				"visibility": "none"
			},
			'paint': {
				'fill-color':  "rgba(0,255,127, 0.1)",
				'fill-outline-color': "rgba(0,255,127, 0.5)",
			}
		}, 'CountryLabels');
		map.addLayer({
			"id": "selectedCountry",
			"type": "fill",
			"source": 'composite',
			"source-layer": "Country_EEZ_simplified-2no7w4",
			"layout": {
				"visibility": "none"
			},
			'paint': {
				'fill-color':  "rgba(255,255,255, 0)",
				'fill-outline-color': "rgba(255,255,255, 1)",
			}
		}, 'CountryLabels');
		map.addLayer({
			"id": "WDPADec2017Poly_high",
			"type": "fill",
			"source": 'composite',
			"source-layer": "ACP_Poly-ch9f72",
			"layout": {
				"visibility": "none"
			},
			'paint': {
				'fill-color':'rgba(255,102,0, 0.4)',
				'fill-outline-color': 'rgba(255,102,0, 0.6)'
			}
		}, 'country-eez');
		
		//WMS Test
		//http://geonode-rris.biopama.org/geoserver/wms?LAYERS=geonode%3Aprotected_area_congo_republic&TRANSPARENT=TRUE&REQUEST=GetMap&STYLES=&TILED=true&SRS=EPSG%3A900913&BBOX=1252344.27125,0,1878516.406875,626172.135625&WIDTH=256&HEIGHT=256
/* 		map.addLayer({
			'id': 'wms-test-layer',
			'type': 'raster',
			'source': {
				'type': 'raster',
				'tiles': [
'http://geonode-rris.biopama.org/geoserver/wms?&format=image/png&bbox={bbox-epsg-3857}&TRANSPARENT=TRUE&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=geonode:protected_area_congo_republic'
				],
				'tileSize': 256
			},
			'paint': {}
		}, 'WDPADec2017Poly'); */
    
		map.addLayer({
		  id: 'satellite',
		  source: {"type": "raster",  "url": "mapbox://mapbox.satellite", "tileSize": 256},
		  type: "raster",
		  "layout": {
					"visibility": "none"
				}
		}, 'WDPADec2017Poly');
    
		$('body').toggleClass('loaded').delay( 1000 ).queue(function() {
		  if (selSettings.selCoISO2 !== 'acp'){
			countryChanged = 1;
			//zoomToCountry(selSettings.selCoISO2);
			checkCountryChanged()
		  }
		  
		  $('#take-a-tour').popover("show");
		  $('.popover').attr('id', 'tourTip');
		  $( this ).dequeue();
		}).delay( 3000 ).queue(function() {
		  $('#take-a-tour').popover("hide");
		  $( this ).dequeue();
		});
	});
  
	$( ".menu-drag" ).click(function() {
		var mapWidth = $(window).width() - ($('div.panels-flexible-region-mapbox_panel-left').outerWidth(true) + $('div.panels-flexible-region-mapbox_panel-right').outerWidth(true) );
		var currentMenuWidth = $('div.panels-flexible-region-mapbox_panel-left').width();
	});
	$( ".menu-actions" ).click(function() {

	});
	
	$('.mapboxgl-ctrl-icon.mapboxgl-ctrl-chart-3D').on('click',function(event) {
		if ($(this).hasClass( "disabled" )){
			return false;
		} else {
			$(this).toggleClass( "active-3D" )
			chart3D = !chart3D;
			for (var key in selSettings.selIndicators) {
				//there should only ever be 1 active indicator, so when we find it we make the chart card
				if (selSettings.selIndicatorsActive[key] == 1) {
					mapTheIndicator(key);
				}
			}
		}
	});

	//we create watch rules on our global settings object this will trigger events if the settings change
	watch(selSettings, ["selPA"], function(){
		console.log("PA changed to "+selSettings.selPA);
	});

	watch(selSettings, ["selIndicators"], function(){
		console.log("indicator changed to "+selSettings.selIndicators);

	});
	$('.indicator-button').ready(function() {
		$('div#block-mapmenuscope').on( 'click', '.indicator-title-wrapper', function() {
			console.log("one");
			var indicatorTitle = $(this).find(".field--name-title").text().replace(/\s/g, "-").trim().toLowerCase();
			var indicatorURL = '/indicator/'+indicatorTitle;
			Drupal.ajax({ 
			  url: indicatorURL,
			  success: function(response) {			
				//console.log(response)
				var $countryDialogContents
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
							$countryDialogContents = $('<div>' + response[key].data + '</div>').appendTo('body');
						}
					}
				}
				$('#block-indicatorcard').empty();
				$countryDialogContents.appendTo('#block-indicatorcard');
				//var countryDialog = Drupal.dialog($countryDialogContents, {title: 'Country summary for ' + selSettings.selCoName, dialogClass: "country-summary-dialog", width: "80%", height: "80%"});
				//countryDialog.showModal();
			  }
			}).execute();
		});
	$('.indicator-button').on( 'click', function() {

		//this tells us that an indicator has been chosen and we don't need to show the help
		breadcrumbIndicator = 1;
		//if they followed the steps the indicator tip would need to be hidden.
		// if (tourSelectIndicator.isOpen())
		//  mapboxTour.next();
		//first remove the previously selected indicators class flag
		$(".activeSelection" ).removeClass( "activeSelection" );
		//then we add the active selection class to our current indicator
		$(this).prev().addClass( "activeSelection" );
		//We select ALL indicators to check each one
		$('.indicator-button').each(function(){
			//if the indicator is on but not the currently active one, we turn it off
			if ($(this).prev().is(":checked:not(.activeSelection)")){
				$(this).prev().prop( "checked", false);
	
				var indicatorClass = $.trim($(this).parent().prev().text()).replace(/\s/g, "-");
				var activeIndicator = $.inArray( indicatorClass, selSettings.selIndicators );
				removeIndicator(indicatorClass, activeIndicator);
			}
		});
		
		//as long as an indicator is active we can make it 3D
		if ( $( ".activeSelection" ).length ) {
			$(".mapboxgl-ctrl-icon.mapboxgl-ctrl-chart-3D").removeClass("disabled");
		}
		
		//we get the text from the button since the indicator URL is hidden with a class that matches this title We do these next steps to allow more then 1 button/indicator at a time
		var indicatorName = $.trim($(this).parent().prev().text());
		updateBreadIndicator(indicatorName)

		//we clean the title to match the class 100%
		var indicatorClass = indicatorName.replace(/\s/g, "-");
		
		//check if the indicator has been activated in the past by seeing if it's in the array of indicators
		var activeIndicator = $.inArray( indicatorClass, selSettings.selIndicators );
		
		if ($(this).prev().is(":checked")){
			updateBreadIndicator("NA");
			thisMap.setFilter("WDPADec2017Poly_high", ['==', 'ISO3', selSettings.selCoISO3]);
			removeIndicator(indicatorClass, activeIndicator);
			$(this).prev().removeClass( "activeSelection" );
			//as there are no charts we turn off the 3D toggle option
			$(".mapboxgl-ctrl-icon.mapboxgl-ctrl-chart-3D").addClass("disabled");
		}
		else{	
			//if it hasn't been activated yet, add it to the array
			if(activeIndicator == -1){
				//we add this indicators options/settings to the end of each array in our global settings file. 
				//this tells us that this indicator is active 
				selSettings.selIndicatorsActive.push(1);
				//we store the indicator class to be used where needed
				selSettings.selIndicators.push(indicatorClass);

				//this is to see if the results have been proccessed for the chart. This will happen the first time the chart is turned on. 
				selSettings.selIndicatorChartProc.push(false);
				//console.log(selSettings.selIndicatorChartProc);
				var indicatorWrapper = $(this).closest(".views-row");

				//for each of these we work our way up from the active url. then find the field we need. This is due to the way drupal views generates the table
				var indicatorRESTurl = $(indicatorWrapper).find( ".views-field-field-rest-service-url" ).text();
				selSettings.selIndicatorRESTurl.push(indicatorRESTurl);
				var indicatorMapLayer = $(indicatorWrapper).find( ".views-field-field-map-layer-field" ).text();
				selSettings.selIndicatorMapLayerField.push(indicatorMapLayer);
				var indicatorMap = $(indicatorWrapper).find( ".views-field-field-map-rest-field" ).text();
				selSettings.selIndicatorMappedField.push(indicatorMap);
				var indicatorXaxis = $(indicatorWrapper).find( ".chart-xaxis" ).text().trim();
				indicatorXaxis = JSON.parse(indicatorXaxis);
				selSettings.selIndicatorXaxis.push(indicatorXaxis);
				var indicatorYaxis = $(indicatorWrapper).find( ".chart-yaxis" ).text().trim();
				indicatorYaxis = JSON.parse(indicatorYaxis);
				selSettings.selIndicatorYaxis.push(indicatorYaxis);
				var indicatorSeries = $(indicatorWrapper).find( ".chart-series" ).text().trim();
				indicatorSeries = indicatorSeries.replace(/(}\s*\s)+/g, "}||").split("||");
				indicatorSeries.forEach(function(object, index){
					indicatorSeries[index] = JSON.parse(object);
				});
				selSettings.selIndicatorChartSeries.push(indicatorSeries);
				var indicatorCountries = $(indicatorWrapper).find( ".indicator-countries" ).text();
				var indicatorCountriesArray = indicatorCountries.split(", ");
				selSettings.selIndicatorCountries.push(indicatorCountriesArray);
				var indicatorImages = $(indicatorWrapper).find('img').attr('src');
				selSettings.selIndicatorImages.push(indicatorImages);
				
				//we also add the active country for this request so we can reduce rest requests if the user just wants to toggle indicators all day in the same country
				selSettings.selIndicatorResCo.push(selSettings.selCoISO2);
				//here we get the current location of this indicator within the array of indicators
				activeIndicator = $.inArray( indicatorClass, selSettings.selIndicators );
				//get the results from the REST service
				getRestResults(activeIndicator);
				return;
			}

			//if the country hasn't changed bring the map (the results/error will already be present.)
			if((selSettings.selIndicatorResCo[activeIndicator] == selSettings.selCoISO2)){
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
			}

		}				
	});
	});
});

//this is to help generate the filter we use in our mapbox layers, it allows us to create a filter based on an array
function removeIndicator(indicatorClass, activeIndicator) {
	//get rid of any styles attached to the indicator masks. These will be changed and re-added if needed. 
	thisMap.setLayoutProperty("CountriesGoodMask", 'visibility', 'none');
	thisMap.setLayoutProperty("CountriesBadMask", 'visibility', 'none');	
	//If the indicator has been turned on already, we hide the card (hiding so we don't have to make the REST query again if the user turns it on again)
	jQuery('#wrapper-'+indicatorClass).hide("fast");
	//and the layer is removed since this is easy to recreate (no REST call)
	removeLayers(indicatorClass);
	//then we record this indicator as inactive (so the most recent query is saved) -- this is from the previous design to compare multiple indicators. 
	selSettings.selIndicatorsActive[activeIndicator] = 0;
}

//this removes the indicator layers
function removeLayers(indicatorClass = null){
	var currentLayers = thisMap.style._layers;
	for (var key in currentLayers) {
		if ((currentLayers[key].id.indexOf('indilayer2D'+indicatorClass) != -1)||(currentLayers[key].id.indexOf('indilayer3D'+indicatorClass) != -1)) {
			thisMap.removeLayer(currentLayers[key].id);
		} 
	}
}

//this preforms the ajax request for the REST service 
function getRestResults(activeIndicator){
	//if the chosen indicator has countries attached to it we highlight them, and mask the ones not included.
	if (selSettings.selIndicatorCountries[activeIndicator] != ''){
		thisMap.setFilter("CountriesBadMask", buildFilter(selSettings.selIndicatorCountries[activeIndicator], '!in', 'ISO3'));
		thisMap.setFilter("CountriesGoodMask", buildFilter(selSettings.selIndicatorCountries[activeIndicator], 'in', 'ISO3'));
		thisMap.setLayoutProperty("CountriesGoodMask", 'visibility', 'visible');
		thisMap.setLayoutProperty("CountriesBadMask", 'visibility', 'visible');
	}
	//we get the indicator name as a class
	var indicator = selSettings.selIndicators[activeIndicator];
	//we pass the class to our generate url function to keep the finished product 
	var indicatorURL = generateRestURL(activeIndicator);	
	jQuery.ajax({
		url: indicatorURL,
		dataType: 'json',
		success: function(d) {
			selSettings.selIndicatorRes[activeIndicator] = d;
			if (d.metadata.recordCount == 0) {
				//we create a card, but tell it that the response was empty (error 2)
				getChart(indicator, 2);
			} else {
				//create the map
				//mapTheIndicator(activeIndicator);
				//the 0 means there was no error
				getChart(indicator, 0);
			}
		},
		error: function() {
			//we create a card, but tell it that there was a general error (error 1)
			//todo - expand error codes to tell user what went wrong.
			getChart(indicator, 1);
		}
	});
}
function generateRestURL(indicator){
	//we get the url from the hidden fields in the indicator menu
	var indicatorURL = selSettings.selIndicatorRESTurl[indicator]
	//our URL should contain some tokens as placeholders. So here we switch those out with the real values
	indicatorURL = indicatorURL.replace("NUM", selSettings.selCoNUM)
	.replace("ISO2", selSettings.selCoISO2)
	.replace("ISO3", selSettings.selCoISO3)
	.replace("WDPAID", selSettings.selPA);	
	return indicatorURL;
}	