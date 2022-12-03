var DEOTHEMES = DEOTHEMES || {};

(function($){
	"use strict";

	// Detect Browser Width
	(function () {
		if (Modernizr.mq('(min-width: 0px)')) {
			// Browsers that support media queries
			minWidth = function (width) {
				return Modernizr.mq('(min-width: ' + width + 'px)');
			};
		}
		else {
			// Fallback for browsers that does not support media queries
			minWidth = function (width) {
				return $window.width() >= width;
			};
		}
	})();

	DEOTHEMES.initialize = {

		init: function() {
			DEOTHEMES.initialize.scrollTo();
			DEOTHEMES.initialize.onepageNav();
			DEOTHEMES.initialize.scrollToTop();
			DEOTHEMES.initialize.slickSlider();
			DEOTHEMES.initialize.isotope();
			DEOTHEMES.initialize.mobileNavigation();
			DEOTHEMES.initialize.serviceLinks();
			DEOTHEMES.initialize.stickyFooter();
			DEOTHEMES.initialize.animateOnScroll();		
			DEOTHEMES.initialize.animeJS();		
			DEOTHEMES.initialize.contactForm();
			DEOTHEMES.initialize.detectMobile();
			DEOTHEMES.initialize.detectIE();
		},

		preloader: function() {
			$('.loader-bar span').css({
				width: '100%',
			});

			$('.loader').delay(400).fadeOut('slow');

			$('.loader-mask').delay(800).animate({
				height: 0
			}).fadeOut('slow').addClass('preloader--loaded');
		},

		triggerResize: function() {
			$window.trigger("resize");
		},

		onepageNav: function() {
			$('#onepage-nav').on('click', 'li > a', function() {
				$("#navbar-collapse").collapse('hide');
				$('.nav__icon-toggle').removeClass('nav__icon-toggle--is-opened');
			});
		},

		scrollTo: function() {
			$('.local-scroll').localScroll({
				//offset: { top: -59 },
				duration: 700,
				easing: 'swing'
			});
		},

		scrollToTopScroll: function() {
			var scroll = $window.scrollTop();
			if (scroll >= 50) {
				$backToTop.addClass("show");
			} else {
				$backToTop.removeClass("show");
			}
		},

		scrollToTop: function() {
			$backToTop.on('click',function(){
				$('html, body').animate({scrollTop: 0}, 750 );
				return false;
			});
		},		

		slickSlider: function() {
			var $blogSlider = $('.blog-slider');
			if ( $blogSlider.length ) {
				$blogSlider.slick({
					infinite: true,
					speed: 300,
					centerMode: true,
					centerPadding: '172px',
					slidesToShow: 3,
					slidesToScroll: 3,
					responsive: [
						{
							breakpoint: 1440,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2,
								centerMode: true,
							}
						},
						{
							breakpoint: 1024,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2,
								centerMode: false,
							}
						},
						{
							breakpoint: 768,
							settings: {
								slidesToShow: 1,
								slidesToScroll: 1,
								centerMode: false,
							}
						}
					]

				});
			}
		},

		cookies: function() {
			if ( 'on' === $body.data('cookies') ) {
				window.cookieconsent.initialise({
					content: {
						header: 'Cookies used on the website!',
						message: 'We are using cookies to personalize content and ads to make our site easier for you to use.',
						dismiss: 'Confirm',
						allow: 'Allow cookies',
						deny: 'Decline',
						link: 'Learn more',
						href: 'http://cookiesandyou.com',
						close: '&#x274c;',
					},
					cookie: {
						expiryDays: 365
					},
					position: 'bottom'
				});
				$(".cc-banner").wrapInner("<div class='cc-container container'></div>");
			}

			return false;			
		},
		

		stickyNavbar: function() {

			var doc = document.documentElement;

			var prevScroll = $window.scrollY || doc.scrollTop;
			var curScroll;
			var direction = 0;
			var prevDirection = 0;

			var header = document.getElementById('nav--sticky');
			var headerHeight = header.offsetHeight;			

			var checkScroll = function() {

				curScroll = $window.scrollY || doc.scrollTop;
				if (curScroll > prevScroll) { 
					direction = 2;
				}
				else if (curScroll < prevScroll) { 
					direction = 1;
				}

				if (direction !== prevDirection) {
					toggleHeader(direction, curScroll);
				}

				prevScroll = curScroll;
			};

			var toggleHeader = function(direction, curScroll) {
				// Down
				if (direction === 2 && curScroll > headerHeight) {

					header.classList.add('nav--sticky--is-sticky');
					header.classList.remove('nav--sticky--is-scrolling');							
					prevDirection = direction;
				}
				// Up
				else if (direction === 1) {
					header.classList.remove('nav--sticky--is-sticky');
					header.classList.add('nav--sticky--is-scrolling');				
					prevDirection = direction;
				}

				// Top
				if (direction === 1 && curScroll === 0 ) {
					header.classList.remove('nav--sticky--is-scrolling');
				}
			};

			window.addEventListener('scroll', checkScroll);
		},

		mobileNavigation: function() {
			var $navDropdown = $('.nav__dropdown');
			var $navDropdownMenu = $('.nav__dropdown-menu');
			var $navIconToggle = $('.nav__icon-toggle');

			$navIconToggle.on('click', function() {
				$(this).toggleClass('nav__icon-toggle--is-opened')
			});

			$('.nav__dropdown-trigger').on('click', function() {
				var $this = $(this);
				$this.toggleClass('nav__dropdown-trigger--is-open');
				$this.next($navDropdownMenu).slideToggle();
				$this.attr('aria-expanded', function(index, attr){
					return attr == 'true' ? 'false' : 'true';
				});
			});

			if ( $html.hasClass('mobile') ) {
				$body.on('click',function() {
					$navDropdownMenu.addClass('hide-dropdown');
				});

				$navDropdown.on('click', '> a', function(e) {
					e.preventDefault();
				});

				$navDropdown.on('click',function(e) {
					e.stopPropagation();
					$navDropdownMenu.removeClass('hide-dropdown');
				});
			}
		},

		isotope: function () {
			let $grid = $('#project-grid');
			$grid.imagesLoaded( function() {
				$grid.isotope({
					itemSelector: '.grid-item',
					layoutMode: 'masonry',
					percentPosition: true,
					//filter: '.featured'
				});
			});
		},

		serviceLinks: function() {
			var $services = $('.js-services-01');
			var $servicesListItem = $services.find('.services-list__item');
			var $servicesContentItem = $services.find('.services-content__item');

			$servicesListItem.on('click', function() {
				var $this = $(this);
				var index = $this.index();

				$servicesContentItem.removeClass('services-content__item--is-active').eq(index).addClass('services-content__item--is-active');
				$this.siblings().removeClass('services-list__item--is-active');
				$this.addClass('services-list__item--is-active');
			});

		},

		stickyFooter: function() {
			var $footer = $('.footer'),
					$footerPlaceholder = $('.footer-placeholder'),
					footerHeight = $footer.height();

			if ( ! minWidth(mobileBreakpoint + 1) ) {
				$footerPlaceholder.height(0);
				return;
			}		
			
			$footerPlaceholder.height(footerHeight);			
		},

		animateOnScroll: function() {
			var $animate = $('.animate');
			$animate.wrapInner("<div class='animate-container'></div>");

			$animate.appear(function () {
				$(this).addClass('animate--animated');
			}, { accY: -100 });
		},

		animeJS: function() {

			let tl = anime.timeline({
				duration: 1600,
				easing: 'cubicBezier(.25,.74,.22,.99)'
			});

			tl.add({
				targets: '.hero__img',
				opacity: [0, 1],
				translateX: [50, 0],
				duration: 1600,
				delay: 1300
			})

			tl.add({
				targets: '.hero__title',
				opacity: [0,1],
				translateX: [-50, 0],
				duration: 1400,	
			}, '-=1600' )

			tl.add({
				targets: '.hero__subtitle',
				opacity: [0,1],
				translateX: [-50, 0],
				duration: 1400,	
			}, '-=1600' )

			tl.add({
				targets: '.nav__holder',
				opacity: [0,1],
				duration: 1600,
				translateY: [-100, 0],
				complete: function(anim) {
					document.querySelector('.nav__holder').style.removeProperty('transform');
				}
			}, '-=1200')

			tl.add({
				targets: '.hero__bottom-row',
				opacity: [0,1],
				duration: 1600,
				translateY: [100, 0],	
			}, '-=1400')

			var $animateLetters = $('.animate-letters');	
			$animateLetters.lettering('words').children('span').lettering();

			$animateLetters
				.mouseenter(function() {
					$(this).addClass('animate-letters--is-animating');
					anime.timeline({
						targets: '.animate-letters--is-animating > span > span'
					})
					.add({
						translateY: [0, -10],
						opacity: [1, 0],
						duration: 300,
						easing: 'easeInExpo',
						delay: (el, i) => 30 * i,
					})
					.add({
						translateY: [20, 0],
						opacity: [0, 1],
						duration: 700,
						easing: 'easeOutExpo',
						delay: (el, i) => 30 * i,
					}, '-=250')
				})
				.mouseleave(function() {
					$(this).removeClass('animate-letters--is-animating')
				});			


			(function() {
				var num = 1;
				var len = 3;
				var $svg = $('.hero__img-svg');
				var $img = $svg.find('image');
				var speed = $svg.data('image-flick-speed');

				setInterval(() => {					
					$img.attr('xlink:href', 'img/hero/hero_img-' + num + '.jpg');
					num = (num === len) ? 1 : ++num;					
				}, speed);
			})();

		},

		contactForm: function() {
			var message = $('#contact-form__message');

			$('#contact-form__submit').on('click', function(e){
				e.preventDefault();

				var $this = $(this);

				$.ajax({
					type: "POST",
					url: 'contact.php',
					dataType: 'json',
					cache: false,
					data: $('#contact-form').serialize(),
					success: function(data) {

						if(data.info !== 'error'){
							$this.parents('form').find('input[type=text],input[type=email],textarea,select').filter(':visible').val('');
							message.hide().removeClass('success').removeClass('error').addClass('success').html(data.msg).fadeIn('slow').delay(5000).fadeOut('slow');
						} else {
							message.hide().removeClass('success').removeClass('error').addClass('error').html(data.msg).fadeIn('slow').delay(5000).fadeOut('slow');
						}
					}
				});
			});
		},		

		detectMobile: function() {
			if (/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent || navigator.vendor || window.opera)) {
				$html.addClass("mobile");
			}
			else {
				$html.removeClass("mobile");
			}
		},

		detectIE: function() {
			if (Function('/*@cc_on return document.documentMode===10@*/')()) { $html.addClass("ie"); }
		}
	};

	DEOTHEMES.documentOnReady = {

		init: function() {
			DEOTHEMES.initialize.init();
		}

	};

	DEOTHEMES.windowOnLoad = {

		init: function() {			
			DEOTHEMES.initialize.preloader();		
			DEOTHEMES.initialize.triggerResize();
			DEOTHEMES.initialize.isotope();
			DEOTHEMES.initialize.cookies();
		}

	};

	DEOTHEMES.windowOnResize = {

		init: function() {
			DEOTHEMES.initialize.stickyFooter();
		}

	}

	DEOTHEMES.windowOnScroll = {

		init: function() {
			DEOTHEMES.initialize.scrollToTopScroll();
			DEOTHEMES.initialize.stickyNavbar();
		}

	}

	// Global vars
	var $window = $(window),
			$html = $('html'),
			$body = $('body'),
			$backToTop = $('#back-to-top'),
			mobileBreakpoint = 1024,
			minWidth;

	$(document).ready(DEOTHEMES.documentOnReady.init);
	document.addEventListener('DOMContentLoaded', DEOTHEMES.windowOnLoad.init, false);
	$window.on('resize', DEOTHEMES.windowOnResize.init);
	$window.on('scroll', DEOTHEMES.windowOnScroll.init);

})(jQuery);