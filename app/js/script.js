/* Alpha Hotel: HTML Template by Klaye Morrison (http://klayemorrison.com) */



/******************** Document Ready ********************/

$(document).ready(function () {

	'use strict';

	// Desktop Detection - Applies '.hover' class to document if non-touch browser

	if (!('ontouchstart' in document.documentElement)) { document.documentElement.className += 'hover'; }



	/******************** Header ********************/



	/******************** Sections ********************/

    // // Background Image Replace
    //
    // $('.back').each(function() {
    //     var attr = $(this).attr('data-image');
    //         if (typeof attr !== typeof undefined && attr !== false) {
    //         $(this).css('background-image', 'url('+attr+')');
    //     }
    // });

	// Photo Panel

	$('.hover .panel .item .panel-button a').hover(
		function () {
			$(this).parent().parent().parent().addClass('over');
		},
		function () {
			$(this).parent().parent().parent().removeClass('over');
		}
	);

	$('.hover .panel .item.feature .button').hover(
		function () {
			$(this).parent().parent().parent().addClass('over');
		},
		function () {
			$(this).parent().parent().parent().removeClass('over');
		}
	);

	$('.section.panel.hero .slider').carouFredSel({
		height: 'variable',
		swipe: true,
		responsive: true,
		scroll: {
			pauseOnHover: true,
			duration: 600,
			fx: 'crossfade'
		},
		items: {
			visible: 1,
			height: 'variable'
		},
		auto: { timeoutDuration: 4000 },
		prev: { button: '.section.panel .prev' },
		next: { button: '.section.panel .next' }
	});

	// Carousel

		$('.section.carousel.horizontal .slider').carouFredSel({
			width: '100%',
			height: 'variable',
			swipe: true,
			align: false,
			scroll: {
				items: 1,
				pauseOnHover: true,
				easing: 'easeInOutQuart',
				duration: 600
			},
			items: {
				visible: 'variable'
			},
			auto: { timeoutDuration: 4000 },
			prev: { button: '.section.carousel.horizontal .prev' },
			next: { button: '.section.carousel.horizontal .next' }
		});

		$('.section.carousel:not(.horizontal) .slider').carouFredSel({
			height: 'variable',
			swipe: true,
			responsive: true,
			scroll: {
				pauseOnHover: true,
				duration: 600,
				fx: 'crossfade'
			},
			items: {
				visible: 1,
				height: 'variable'
			},
			auto: { timeoutDuration: 4000 },
			prev: { button: '.section.carousel:not(.horizontal) .prev' },
			next: { button: '.section.carousel:not(.horizontal) .next' }
		});

	// Gallery

	var $container = $('.gallery'),
	colWidth = function () {
		var w = $container.width(),
		columnNum = 4,
		columnWidth = 0,
		sizeVar = 0;
		if (w > 1100) { columnNum  = 4; }
		else { columnNum  = 2; }
		columnWidth = Math.floor(w/columnNum);
		function columnSize() {
			if (w < 340) { sizeVar = 25; }
			else if (w < 500) { sizeVar = 40; }
			else if (w < 640) { sizeVar = 50; }
			else if (w < 770) { sizeVar = 60; }
			else if (w < 1024) { sizeVar = 50; }
			else { sizeVar = 64; }
			$container.find('figure').each(function() {
				var $item = $(this),
				multiplier_w = $item.attr('class').match(/item-w(\d)/),
				multiplier_h = $item.attr('class').match(/item-h(\d)/),
				width = multiplier_w ? columnWidth*multiplier_w[1] : columnWidth,
				height = multiplier_h ? columnWidth*multiplier_h[1]*0.72-sizeVar : columnWidth*0.72-(sizeVar/2);
				$item.css({
					width: width,
					height: height
				});
			});
		}
		columnSize();
		return columnWidth;
	};

	function runisotope() {
		$container.isotope({
			layoutMode: 'packery',
			itemSelector: 'figure',
			transitionDuration: '0',
			resizable: false,
			masonry: {
				columnWidth: colWidth()
			}
		});
	}

	runisotope();

	$(window).resize(function() {
		runisotope();
    });

	function featherOpen() { $('.featherlight-content').addClass('pop'); }
	function featherClose() { $('.featherlight-content').removeClass('pop'); }

	$('.gallery figure img').lazyload({
    	effect: 'fadeIn',
    	failure_limit: 10,
    	effectspeed: 300
    });

	$('.gallery figure a').featherlightGallery({
		gallery: {
			fadeIn: 300,
			fadeOut: 300
		},
		openSpeed: 300,
		closeSpeed: 300,
		galleryFadeIn: 0,
		galleryFadeOut: 0,
		afterOpen: featherOpen,
		beforeClose: featherClose
	});

	// Boxes

	$('.hover .boxes .item .button').hover(
		function () {
			$(this).parent().parent().parent().addClass('over');
		},
		function () {
			$(this).parent().parent().parent().removeClass('over');
		}
	);

	// $('.hover .boxes .item .thumb a').hover(
	// 	function () {
	// 		$(this).parent().parent().addClass('over');
	// 	},
	// 	function () {
	// 		$(this).parent().parent().removeClass('over');
	// 	}
	// );

	if ( $('.boxes .center').children().length > 1 ) {
		$('.boxes .center').wrecker({
			itemSelector : '.col-3',
			maxColumns : 3,
			responsiveColumns : [
				{500 : 1}
			]
		});
	}

	// Services

	$('.services .item').hover(
		function () {
			$(this).parent().addClass('over');
		},
		function () {
			$(this).parent().removeClass('over');
		}
	);

	// Features

	$('.features .item .button').hover(
		function () {
			$(this).parent().parent().parent().addClass('over');
		},
		function () {
			$(this).parent().parent().parent().removeClass('over');
		}
	);

	$('.hover .features .item .thumb a').hover(
		function () {
			$(this).parent().parent().parent().addClass('over');
		},
		function () {
			$(this).parent().parent().parent().removeClass('over');
		}
	);

	// Timeline

	$('.timeline .item .button').hover(
		function () {
			$(this).parent().parent().parent().addClass('over');
		},
		function () {
			$(this).parent().parent().parent().removeClass('over');
		}
	);

	$('.timeline .item .thumb a').hover(
		function () {
			$(this).parent().parent().addClass('over');
		},
		function () {
			$(this).parent().parent().removeClass('over');
		}
	);

    // Accordion

    $('.accordion .question').click(function () {
		$(this).parent().stop().toggleClass('reveal');
        $(this).parent().find('.answer').stop().toggle(300, 'easeInOutQuart');
    });

	// Instagram

	// Get your Instagram user ID and access token from http://www.pinceladasdaweb.com.br/instagram/access-token/
	$.ajax({
		type: 'GET',
		dataType: 'jsonp',
		cache: false,
		url: 'https://api.instagram.com/v1/users/XXXXXX/media/recent/?access_token=XXXXXX',
		success: function(data) {
			for (var i = 0; i < 10; i++) {
				$('.instagram-feed').append("<a href='" + data.data[i].link +"' target='_blank'><img src='" + data.data[i].images.standard_resolution.url +"'></a>");
			}
		}
	});
});

// Section Fade

if ($(window).width() > 1024) {

	var timer;
	function fader() {

		'use strict';

		// Visible Items

		var visibleitems = function() {
			$('.fade').each(function() {
				if ($(this).visible(true)) {
					$(this).addClass('visible');
				}
			});
		};
		visibleitems();

		$(window).scroll(function () {
			visibleitems();
		});
	}

	setTimeout(function(){

		'use strict';

		$(window).off('load.fader');
		fader();
	},3000);

}



// /******************** Window Load ********************/
//
// $(window).load(function () {
//
// 	'use strict';
//
// 	// Testimonials
//
// 	$('.testimonials .center').isotope({
// 		layoutMode: 'packery',
// 		itemSelector: '.item',
// 		transitionDuration: '0',
// 		resizable: false
// 	});
//
// 	// Refreshes browser when resizing between desktop and tablet. Not necessary, but handy for responsive testing as different JS is being loaded.
//
// 	if ($(window).width() > 1024) { var browsersize = 'desktop'; }
// 	else { var browsersize = 'tablet'; }
// 	$(window).resize(function() {
// 		if ($(window).width() > 1024) {
// 			if (browsersize == 'tablet') { location.href = location.href }
// 		}
// 		else {
// 			if (browsersize == 'desktop') { location.href = location.href }
// 		}
// 	});
//
// 	// Fixes slider loading issues in some browsers
//
// 	$(window).trigger('resize');
//
// 	// Section Fade
//
// 	clearTimeout(timer);
//     fader();
// //
// });