 jQuery(document).ready(function($) {
	$( "h3" ).append( "<input style='margin-left: 20px;' type='checkbox' class='select-region'>" );
	
	$('input.select-region').click(function(e) {
	  $.each($('.form-checkbox', $(this).parent().next()), function(i,d) {
		  d.checked = !d.checked;
	  });
	});
});