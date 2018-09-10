jQuery(document).ready(function($) {
	var tipTemplate = '<div class="tooltip biopama-tip" role="tooltip"><div class="arrow biopama-arrow"></div><div class="tooltip-inner biopama-tip-inner"></div></div>';
	$( "#map-menu" ).ready(function() {
		$( "div.Draft" ).tooltip({
			trigger:"hover",
			placement: "right",
			title:"Draft Policy",
			delay: 200,
			template: tipTemplate
		});
		$( "a.edit-policy" ).tooltip({
			trigger:"hover",
			placement: "right",
			title:"Edit Policy",
			delay: 200,
			template: tipTemplate
		});
		$( "a.edit-target" ).tooltip({
			trigger:"hover",
			placement: "right",
			title:"Edit Target",
			delay: 200,
			template: tipTemplate
		});
		$( "a.edit-indicator" ).tooltip({
			trigger:"hover",
			placement: "right",
			title:"Edit Indicator",
			delay: 200,
			template: tipTemplate
		});
	});
})