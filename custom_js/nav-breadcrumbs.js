jQuery(document).ready(function($) {
	$( ".region-we-mega-menu" ).ready(function() {
		$('.region-we-mega-menu').show();
	});
	$( "#block-mainnavigation" ).ready(function() {
		$('.bread-parent-wrapper').on('click', function(e) {
			//remove the active classes on all elements that didn't get clicked
			$("div.bread-parent-wrapper").not($(this)).removeClass('active-bread').next().hide();
			$(this).toggleClass("active-bread");
			if ( $( ".active-bread" ).length ) {
				$(this).next().show('slide', { direction: 'up' });
			} else {
				$("div.bread-menu-content").hide();
			}
		});
		
		$('.bread-country-menu-content li:first').on('click', function(e) {
			var countryURL = '/country/'+selSettings.selCoISO2;
			  Drupal.ajax({ 
				  url: countryURL,
				  success: function(response) {			
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

					var countryDialog = Drupal.dialog($countryDialogContents, {title: 'Country summary for ' + selSettings.selCoName, dialogClass: "country-summary-dialog", width: "80%", height: "80%"});
					countryDialog.showModal();
				  }
			  }).execute();
			  
		});
		//dialog:aftercreate
/* 		$( ".country-summary-dialog" ).on( "aftercreate", function( event, ui ) {
			console.log("boom2");
		} ); */
		//$('.bread-indicator').on('click', function(e) {
		//});

	});
	
	Drupal.behaviors.indicatorSearch = {
		attach: function (context, settings) {
			//we remove the links from the results as it's the links that the FAC events are tied to. It also prevents any chance of navigating away from this page.
			//$("a", context).contents().unwrap();
			//$("article header").append("<a href='#' onclick='return false;'>&nbsp</a>");
			//attach the function that opens the indicator
			$("article.indicator-search-item", context).on('click', function(e) {
				//I remove any deault activities just in case. FAC has event handlers attaced still, even thought they shoulnd't do anything without links <a> (removed above). 
				e.preventDefault();
				var nodeID = e.currentTarget.attributes[0].nodeValue; 
				var indicatorURL = '/node/'+nodeID;
				Drupal.ajax({ 
				  url: indicatorURL,
				  success: function(response) {			
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
								$('#block-indicatorcard').show();
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
			$("article.country-search-item", context).on('click', function(e) {
				e.preventDefault();
				var iso2 = $("div.country-iso", e.currentTarget).text().trim();
				selSettings.selCoISO2 = iso2;
				countryChanged = 1;
				zoomToCountry(iso2);
			});	
			$("article.pa-search-item", context).on('click', function(e) {
				e.preventDefault();
				var nodeID = e.currentTarget.attributes[0].nodeValue; 
				var iso2 = $("div.country-iso", e.currentTarget).text().trim();
				selSettings.selCoISO2 = iso2;
				countryChanged = 1;
				zoomToCountry(iso2);
			});	
		}
	};
});