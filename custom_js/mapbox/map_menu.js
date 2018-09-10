jQuery(document).ready(function($) {
	$( "#map-menu" ).ready(function() {
		//$(".menu-edit > a").addClass("use-ajax").attr("data-dialog-type", "modal");
		//<a href="www.test.com?destination=current-path" class="edit-button use-ajax" data-dialog-type="dialog" data-dialog-renderer="off_canvas"  data-dialog-options="{&quot;width&quot;:400}">Edit</a>

		$('div#block-mapmenuscope').on('click', 'div.scope-icon-title', function(e) {
			selSettings.selIndicatorScope = $(this).find(".scope-title").text();
			//remove the active classes on all elements that didn't get clicked
			$('.menu-policy').find('.policy-hover').remove();
			$("div.scope-icon-title").not($(this)).removeClass('active-scope').next().hide();
			//check to see if any policies are open
			if ( $( ".active-policy" ).length ) {
				//hide the contents of any policies that are open
				$(".active-policy").next().hide();
				//remove active classes for nested policy menus.
				$(".active-policy").removeClass("active-policy");
				$(".menu-policy-effect").removeClass("menu-policy-effect");
			}
			$(this).toggleClass("active-scope");
			if ( $( ".active-scope" ).length ) {
				$("div#block-mapmenuscope").addClass("menu-block-effect");
				$(".scope-icon-title").addClass("active-scope-icon-title");
				//$(this).next().show('slide', { direction: 'right' });
				$(this).next().css( "display", 'flex' );
				//We run the fix (in mapbox.js) just in case the issue is present
				menuDivFix();
			} else {
				$("div#block-mapmenuscope").removeClass("menu-block-effect");
				$(".scope-icon-title").removeClass("active-scope-icon-title");
				$("div.scope-content").hide();
			}
		});
		$('div#block-mapmenuscope').on('click', 'div.policy-header', function(e) {
			selSettings.selIndicatorPolicy = $(this).find(".policy-title").first().text();
			//we hide the tooltip if this is a draft so it doesn't look so strange
			//$(this).parent().tooltip('hide');
			$('.menu-policy').find('.policy-hover').remove();
			
			$("div.policy-header").not($(this)).removeClass('active-policy').next().hide();
			$(this).toggleClass("active-policy");
			if ( $( ".active-policy" ).length ) {
				$(this).closest(".scope-content").addClass("menu-policy-effect");
				$(this).next().css( "display", 'flex' );
			} else {
				$(this).closest(".scope-content").removeClass("menu-policy-effect");
				$("div.policy-content").hide();
			}
		});
		$('div#block-mapmenuscope').on('click', 'div.views-row > div.goal-header', function(e) {
			selSettings.selIndicatorTarget = $(this).find(".field-content").text();
			$(".active-goal" ).removeClass( "active-goal" );
			if ($(this).hasClass( "ui-accordion-header-active" )){
				$(this).addClass("active-goal");
			} 
		});

/* 		$('div.views-row > div.policy-header').on('mouseenter', function () {
			$(".policy-hover").removeClass("policy-hover");
			if ($(this).hasClass( "active-policy" )){
				return;
			}else{
				$(this).find(".policy-wrapper").addClass("policy-hover");
			}
		  }, 
		  function () {
			if ($(this).hasClass( "active-policy" )){
				return;
			}else{
				$(".policy-hover").removeClass("policy-hover");
			}
		  }
		); */
		$('div#block-mapmenuscope').on('mouseenter', ".menu-policy-effect div.policy-wrapper", function () {
			if ($( "div.scope-content" ).hasClass( "menu-policy-effect" )){
				if ($(this).parent().parent().hasClass( "active-policy" )){
					return;
				}else{
					$('.menu-policy').find('.policy-hover').remove();
					var policyMenuLoc = $(this).closest('div.menu-policy').offset().top;
					var hoveredItem = $(this);
					var position = hoveredItem.offset().top - policyMenuLoc ;

					var cloneItem = $(this)
						.clone()
						.addClass('policy-hover')
						.css('top', position);
					$('.menu-policy').find('.policy-hover').remove();
					hoveredItem.before(cloneItem);
				}

			}
		});
		$('div#block-mapmenuscope').on('mouseleave', "div.policy-wrapper", function () {
			$('.menu-policy').find('.policy-hover').remove();
		});
		
	});
});