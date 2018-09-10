function loadingAjax(ajaxPanelTarget){
	jQuery( ajaxPanelTarget ).parent().append("<div class='lds-css ng-scope' style='width: 100px; height: 100px;'><div style='width:100%;height:100%' class='lds-wedges'><div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div></div>");
	jQuery('button').prop('disabled', true);
	jQuery(ajaxPanelTarget).toggleClass("ajax-target-fade");
}

function finishedAjax(ajaxPanelTarget){
	jQuery("div.ajax-loader.ajax-load").remove();;
	jQuery(ajaxPanelTarget).toggleClass("ajax-target-fade");
	jQuery('button').prop('disabled', false);
}