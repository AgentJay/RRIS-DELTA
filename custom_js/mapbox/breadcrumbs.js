var breadcrumbs = 0;
var breadcrumbIndicator = 0;
var breadColor = "#90c14f"

function showBreadcrumbs(){
    if (breadcrumbs === 0){
      breadcrumbs = 1;
      jQuery('#indicator-breadcrumbs').css('display', 'flex');

      //this hides the select country tip text. Done when first country is selected
      jQuery('.country-tip').hide( 'slow' )
      //then we need to see if the user has already chosen an indicator.
      if (breadcrumbIndicator === 0){
        jQuery('.indicator-tip').show( 'slow' )
      }
    }
}
function updateBreadCountry(){
  jQuery("#bread-country").text(selSettings.selCoName).one().effect( "highlight", {color: breadColor}, 500);
  var addressCountry = selSettings.selCoName.replace(/\s|\//g, '_').toLowerCase();
  var addressRegion = selSettings.selRegion.replace(/\s|\//g, '_').toLowerCase();
   
  //Here we update the URL (address) to allow deep linking
  var addressCountry = selSettings.selCoISO2;
  jQuery.address.value(addressRegion + "/" + addressCountry);  
  //jQuery.address.value(addressCountry);  
  jQuery.address.title(selSettings.selRegion + ' | ' + selSettings.selCoName);
  
  //we change the submenu links to open the correct country page
  //$(".menu-edit > a").addClass("use-ajax").attr("data-dialog-type", "modal");
  jQuery(".bread-country-menu-content ul.nav li:first").html("<div class='bread-menu-link'>Summary for "+selSettings.selCoName+"</div>")

  
}
function updateBreadRegion(){
  jQuery("#bread-region").text(selSettings.selRegion).one().effect( "highlight", {color: breadColor}, 500);
}
function updateBreadPA(){
  jQuery("#quicktabs-tab-map_page_breadcrumbs-2").text("Protected Area: "+selSettings.selCoName);
}
function updateBreadIndicator(indicatorName){
  jQuery("#bread-indicator").text(indicatorName).one().effect( "highlight", {color: breadColor}, 500);
}