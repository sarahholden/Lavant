window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Slate ================*/
// =require slate/a11y.js
// =require slate/cart.js
// =require slate/utils.js
// =require slate/rte.js
// =require slate/sections.js
// =require slate/currency.js
// =require slate/images.js
// =require slate/variants.js

/*================ Sections ================*/
// =require sections/product.js

/*================ Templates ================*/
// =require templates/customers-addresses.js
// =require templates/customers-login.js

$(document).ready(function() {
  console.log('Shopify developer: Sarah Holden 🏄🏻‍♀️');
  console.log('https://saraheholden.com/');

  var sections = new slate.Sections();
  sections.register('product', theme.Product);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = '.rte table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }
});



$(document).ready(function() {
  /* ---------------------------------------------
  HAMBURGER MENU
  ------------------------------------------------ */
  let lastScrollPosition = 0;

  $('.hamburger').on('click', function(e) {
    e.preventDefault();

    if ($('body').hasClass('open-mobile-nav')) {
      $('body').removeClass('open-mobile-nav');
      // Once the body is unfixed, scroll to the last position
      $(window).scrollTop(lastScrollPosition);
    } else {
      // Record last scroll position (for fixed body)
      lastScrollPosition = $(window).scrollTop();
      $('body').addClass('open-mobile-nav');
    }
  });


  /* ---------------------------------------------
    SPLIT TEXT
  ------------------------------------------------ */
  var controller = new ScrollMagic.Controller();
  var tl = gsap.timeline();

  document.fonts.ready.then(function () {
    var splitText = new SplitText('[data-reveal="lines"]', {type:"lines", linesClass: 'split-line-++'});
    var splitTextMasked = new SplitText('[data-reveal="lines-masked"]', {type:"lines", linesClass: 'split-line-child'});
    var splitTextMaskedInner = new SplitText('[data-reveal="lines-masked"]', {type:"lines", linesClass: 'split-line-++'});
    new SplitText('[data-reveal="lines-masked-desc"] p', {type:"lines", linesClass: 'split-line-child'});
    new SplitText('[data-reveal="lines-masked-desc"] p', {type:"lines", linesClass: 'split-line-++'});

  $('[data-reveal="lines-masked"]').addClass('loaded');
  $('[data-reveal="lines-masked-desc"]').addClass('loaded');

    // resize function
    $(window).resize(function() {
      tl.progress(1);
      splitText.revert();
      splitTextMasked.revert();
      splitTextMaskedInner.revert();
    });

    $('.list-animation-wrapper').each(function() {
      var scrollOffset = $(this).data('offset') || 0;
      var $thisWrapper = $(this);
      new ScrollMagic.Scene({triggerElement: this, triggerHook: .9, offset: scrollOffset})
        .setClassToggle(this, "scrolled") // add class toggle
        .reverse(false)

        .addTo(controller)
        .on("enter", function (e) {
          if ($thisWrapper.find('.animate-item').length > 0) {
            $listItems = $thisWrapper.find('.animate-item');
          }
          if ($listItems) {
            $listItems.each(function(i) {
              var delay = i * 100;
              var self = this;
              setTimeout(function() {
                $(self).addClass('fade-in');
              }, delay);
            });
          }
        });
    });

    $('.js-preload').each(function() {
      var scrollOffset = $(this).data('offset') || 0;
      var $thisWrapper = $(this);
      new ScrollMagic.Scene({triggerElement: this, triggerHook: .9, offset: scrollOffset})
        // .setClassToggle(this, "preload") // add class toggle
        .reverse(false)
        .addTo(controller)
        .on("enter", function (e) {
          $thisWrapper.removeClass('js-preload');
          setTimeout(function () {
            $thisWrapper.removeClass('js-loading');
          }, 1000);
        });
    });

  // END OF FONT LOADING
  });


  /* ---------------------------------------------
    PARALLAX & SCROLLING ZOOM EFFECTS
  ------------------------------------------------ */
  document.fonts.ready.then(function () {
    $('[data-trigger="scroll"], [data-anim="scroll"]').each(function() {
      var scrollWrapper = this;
      var scrollOffset = $(this).data('offset') || 0;
      new ScrollMagic.Scene(
        {
          triggerElement: this,
          offset: scrollOffset,
          triggerHook: .85
        })
        .setClassToggle(this, "js-animate") // add class toggle
        // .addIndicators('classAdd')
        .reverse(false)
        .addTo(controller);


        // SCALE IMAGE UP OR DOWN
        var $imageToScale = $(this).find('[data-anim="scale"]')
        if ($imageToScale.length > 0) {
          var scaleFrom = $imageToScale.data('scale-from') != undefined ? parseFloat($imageToScale.data('scale-from')) : 1;
          var scaleTo = $imageToScale.data('scale-to') != undefined ? parseFloat($imageToScale.data('scale-to')) : 1.09;
          var pointToTrigger = $imageToScale.data('trigger-hook') != undefined ? parseFloat($imageToScale.data('trigger-hook')) : 0.4;
          var dataDuration = $(this).data('duration') != undefined ? $(this).data('duration') : '100%';

          var timelineScale = new TimelineMax();
          var imageToAnimate = $imageToScale;
          timelineScale.fromTo(imageToAnimate, 1, {scale: scaleFrom}, {scale: scaleTo});

          var scaleScene = new ScrollMagic.Scene({
            triggerElement: scrollWrapper,
            triggerHook: pointToTrigger,
            duration: dataDuration
          })
          .setTween(timelineScale)
          .addTo(controller);
        }

        if ($(window).innerWidth() > 768) {
          // PARALLAX EFFECT
          var $itemToTranslate = $(this).find('[data-anim="parallax"]');
          if ($itemToTranslate.length > 0) {
            $itemToTranslate.each(function() {
              var timelineParallax = new TimelineMax();
              var translateFrom = $(this).data('translate-from') != undefined ? parseFloat($(this).data('translate-from')) : 40;
              var translateTo = $(this).data('translate-to') != undefined ? parseFloat($(this).data('translate-to')) : -40;
              var dataDuration = $(this).data('duration') != undefined ? $(this).data('duration') : '100%';
              timelineParallax.fromTo($(this), 1, {y: translateFrom}, {y: translateTo});

              var scene = new ScrollMagic.Scene({
                triggerElement: scrollWrapper,
                triggerHook: 0.4,
                duration: dataDuration
              })
              .setTween(timelineParallax)
              .addTo(controller);
            });
          }
        }

    });

  // END OF FONT LOADING
  });


  /* ---------------------------------------------
    NAV FIXED WHEN SCROLLING UP
  ------------------------------------------------ */
  var navbarHeight = $('.nav-wrapper').innerHeight();
  $('.nav-wrapper-placeholder').css('height', navbarHeight + 'px');
  $('.nav-wrapper').addClass('loaded');

  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 20) {
      $('.nav-wrapper').addClass('scrolled');
    } else {
      $('.nav-wrapper').removeClass('scrolled');

    }

  });

  $(window).on('resize', function () {
    navbarHeight = $('.nav-wrapper').innerHeight();
    $('.nav-wrapper-placeholder').css('height', navbarHeight + 'px');
  });

  /* ---------------------------------------------
    DROPDOWN NAV
  ------------------------------------------------ */
  var navTimeout;
  function hideNavOnLeave () {
    navTimeout = setTimeout(function () {
      $('body').removeClass('open-dropdown-nav');
      $('.dropdown-navigation').removeClass('js-animate');
    }, 500);
  }

  $('.left-nav .js-show-nav-dropdown').on('mouseenter', function () {
    $('body').addClass('open-dropdown-nav');
    setTimeout(function () {
      $('.dropdown-navigation').addClass('js-animate');
    }, 100);
  });

  $('.left-nav .js-show-nav-dropdown, .dropdown-navigation').on('mouseleave', function () {
    hideNavOnLeave();
  });

  $('.left-nav .js-show-nav-dropdown, .dropdown-navigation').on('mouseenter', function () {
    clearTimeout(navTimeout);
  });








  // if ($(window).scrollTop() < 30) {
  //   $('.nav-wrapper').addClass('loaded');
  // }
  //
  // $('.nav-wrapper').addClass('fade-in');
  //
  // // Hide Header on on scroll down
  // var didScroll;
  // var lastScrollTop = 0;
  // var delta = 5;
  // var navbarHeight = $('.nav-wrapper').outerHeight();
  //
  // $(window).scroll(function(event){
  //     didScroll = true;
  // });
  //
  // setInterval(function() {
  //     if (didScroll) {
  //         hasScrolled();
  //         didScroll = false;
  //     }
  // }, 250);
  //
  // function hasScrolled() {
  //     var distanceScrolled = $(this).scrollTop();
  //
  //     // Make sure they scroll more than delta (throttle scroll)
  //     if(Math.abs(lastScrollTop - distanceScrolled) <= delta)
  //         return;
  //
  //
  //
  //     // If they scrolled down and are past the navbar, add class .nav-up.
  //     // This is necessary so you never see what is "behind" the navbar.
  //     if (distanceScrolled > lastScrollTop && distanceScrolled > 30){
  //         // Scroll Down
  //         $('.nav-wrapper').removeClass('nav-down').addClass('nav-up');
  //     } else {
  //         // Scroll Up
  //         if(distanceScrolled + $(window).height() < $(document).height()) {
  //             $('.nav-wrapper').removeClass('nav-up').addClass('nav-down');
  //         }
  //     }
  //     if (distanceScrolled > $(window).height() || distanceScrolled > 30 && $(window).width() <= 768) {
  //       $('.nav-wrapper').addClass('scrolled-bg');
  //     } else {
  //       $('.nav-wrapper').removeClass('scrolled-bg');
  //     }
  //
  //     lastScrollTop = distanceScrolled;
  // }
  //
  // hasScrolled();

  /* ---------------------------------------------
    SWIPER
  ------------------------------------------------ */
  // const swiper = new Swiper('.swiper-container-myclass', {
  //   pagination: {
  //     el: '.swiper-pagination',
  //     clickable: 'true'
  //   },
  //   speed: 600,
  //   allowTouchMove: true,
  //   loop: true,
  //   effect: 'fade',
  //   fadeEffect: {
  //     crossFade: true
  //   },
  //   autoplay: {
  //     delay: 10000,
  //     disableOnInteraction: true
  //   }
  // });


  /* ---------------------------------------------
  Accordion
  ------------------------------------------------ */
  $('.accordion').on('click', '.accordion-toggle', function() {
    var $accordionPanel = $(this).closest('.accordion-panel');
    $accordionPanel.toggleClass('expanded');
    $accordionPanel.find('.accordion-text').slideToggle(300);

    // TOGGLE ARIA-EXPANDED FOR ADA
    $accordionPanel.attr('aria-expanded', function (i, attr) {
      return attr == 'true' ? 'false' : 'true';
    });

  });


  /* ---------------------------------------------
  VIEW CART
  ------------------------------------------------ */
  $('.js-view-cart').on('click', function(e) {
    e.preventDefault();
    $('body').addClass('open-cart');
  });

  $('.js-close-cart').on('click', function(e) {
    e.preventDefault();
    $('body').removeClass('open-cart');
  });

  if (window.location.hash && window.location.hash == '#view-cart') {
    $('body').addClass('open-cart');
  }

  /* ---------------------------------------------
  SELECTRIC
  ------------------------------------------------ */
  $('.styled-select').selectric();


  /* ---------------------------------------------
  BLOG CATEGORIES
  ------------------------------------------------ */
  $('.js-dropdown-trigger').on('click', function () {
    $(this).closest('.tags-row').toggleClass('active-tags');
    $(this).closest('.tags-row').find('.tags-list').slideToggle(350);
  });


  /* ---------------------------------------------
  TEXT EFFECT WRAPPER
  ------------------------------------------------ */
  // $('.js-animation-wrapper').scrollClass();

  /* ---------------------------------------------
  SMOOTH SCROLL
  ------------------------------------------------ */
  // $('.scroll-to').on('click', function(e) {
  //   e.preventDefault();
  //
  //   var thisTarget = $(this).attr('href');
  //
  //   if (thisTarget == '#bottom') {
  //     var targetOffset = $('#top').offset().top + $('#top').outerHeight() - $(window).height();
  //   } else {
  //     var targetOffset = $(thisTarget).offset().top;
  //   }
  //
  //   $('html, body').animate({
  //     scrollTop: targetOffset
  //   }, 600);
  // });

  /* ---------------------------------------------
  PROMO POPUP
  ------------------------------------------------ */

  // MAILCHIMP =========================
  // function getCookie(name) {
  //   const dc = document.cookie;
  //   const prefix = `${name}=`;
  //   let begin = dc.indexOf(`; ${prefix}`);
  //   if (begin == -1) {
  //     begin = dc.indexOf(prefix);
  //     if (begin != 0) return null;
  //   } else {
  //     begin += 2;
  //     var end = document.cookie.indexOf(';', begin);
  //     if (end == -1) {
  //       end = dc.length;
  //     }
  //   }
  //   // because unescape has been deprecated, replaced with decodeURI
  //   // return unescape(dc.substring(begin + prefix.length, end));
  //   return decodeURI(dc.substring(begin + prefix.length, end));
  // }
  //
  // const urlParams = new URLSearchParams(window.location.search);
  // // const isPreview = urlParams.get('preview'); // FOR TESTING
  //
  // const hasVisited = getCookie('show-email-popup');
  // // var hasVisited = null; // FOR TESTING
  //
  // // if (true) {
  // if (hasVisited === null) {
  //   $('#email-popup').addClass('popped-up');
  //
  //   // Set a cookie so the popup only shows once every 30 days
  //   const date = new Date();
  //   const days = 30;
  //
  //   // Get unix milliseconds at current time plus number of days
  //   date.setTime(+date + days * 86400000); // 24 * 60 * 60 * 1000
  //   window.document.cookie = `${'show-email-popup' +
  //     '=' +
  //     'no' +
  //     '; expires='}${date.toGMTString()}; path=/`;
  // }
  // // }
  //
  // $('.close-email-popup').on('click', function(e) {
  //   e.preventDefault();
  //   $('#email-popup').removeClass('popped-up');
  // });
  //
  // $('#email-popup form').on('submit', function(e) {
  //   e.preventDefault();
  //   $('#email-popup').removeClass('popped-up');
  // });


  /* ---------------------------------------------
  PROMO POPUP
  ------------------------------------------------ */
  // KLAVIYO ==================
  // function getCookie(name) {
  //   const dc = document.cookie;
  //   const prefix = `${name}=`;
  //   let begin = dc.indexOf(`; ${prefix}`);
  //   if (begin == -1) {
  //     begin = dc.indexOf(prefix);
  //     if (begin != 0) return null;
  //   } else {
  //     begin += 2;
  //     var end = document.cookie.indexOf(';', begin);
  //     if (end == -1) {
  //       end = dc.length;
  //     }
  //   }
  //   // because unescape has been deprecated, replaced with decodeURI
  //   // return unescape(dc.substring(begin + prefix.length, end));
  //   return decodeURI(dc.substring(begin + prefix.length, end));
  // }
  //
  // const urlParams = new URLSearchParams(window.location.search);
  // // const isPreview = urlParams.get('preview'); // FOR TESTING
  //
  // // const hasVisited = getCookie('show-email-popup');
  // var hasVisited = null; // FOR TESTING
  //
  // // if (true) {
  // if (hasVisited === null) {
  //   setTimeout(function () {
  //     $('body').addClass('show-email-popup');
  //     $('.email-popup-form-wrapper').addClass('js-animate');
  //   }, 10000);
  // }
  // // }
  //
  // // CLOSE EMAIL POPUP (CONTINUE WITHOUT ENTERING EMAIL)
  // $('.js-close-email-popup').on('click', function() {
  //   $('body').removeClass('show-email-popup');
  // });

  // SUCCESSFULL KLAVIYO SUBMISSION
  // window.addEventListener("klaviyoForms", function(e) {
  //   if (e.detail.type == 'submit') {
  //
  //     // Add any styles for successfull submission
  //     $('body').addClass('email-submitted');
  //
  //     // Briefly show success message, then hide popup
  //     setTimeout(function () {
  //       $('body').removeClass('show-email-popup email-submitted');
  //
  //       // Set a cookie so the popup only shows once every 30 days
  //       const date = new Date();
  //       const days = 30;
  //
  //       // Get unix milliseconds at current time plus number of days
  //       date.setTime(+date + days * 86400000); // 24 * 60 * 60 * 1000
  //       window.document.cookie = `${'show-email-popup' +
  //         '=' +
  //         'no' +
  //         '; expires='}${date.toGMTString()}; path=/`;
  //     }, 2000);
  //   }
  // });



  // /* ---------------------------------------------
  // CURSOR
  // ------------------------------------------------ */
  //
  // // var cursorsInitiated = false;
  // function initCursor () {
  //
  //
  //
  //   var mouseOverElements = document.querySelectorAll(".js-cursor");
  //   var followers = [];
  //
  //   for (var i = 0; i < mouseOverElements.length; i++) {
  //     followers.push(createFollower(mouseOverElements[i]));
  //   }
  //
  //   window.addEventListener("resize", invalidateFollowers);
  //   window.addEventListener("scroll", invalidateFollowers);
  //
  //   function invalidateFollowers() {
  //     for (var i = 0; i < followers.length; i++) {
  //       followers[i].bounds = null;
  //     }
  //   }
  //
  //   function createFollower(parent) {
  //
  //     var requestId = null;
  //
  //     var follower = parent.querySelector(".follower");
  //
  //     var mouse = {
  //       bounds: null,
  //       x: 0,
  //       y: 0
  //     };
  //
  //     TweenLite.set(follower, {
  //       xPercent: -50,
  //       yPercent: -50
  //     });
  //
  //     parent.addEventListener("mousemove", onMouseMove);
  //     parent.addEventListener("mouseenter", onMouseEnter);
  //     parent.addEventListener("mouseleave", onMouseLeave);
  //     parent.addEventListener("mousedown", onMouseDown);
  //     parent.addEventListener("mouseup", onMouseUp);
  //
  //     if ($(parent).hasClass('js-has-click-targets')) {
  //       $(parent).find('a').on('mouseenter', onMouseEnterAnchor);
  //       $(parent).find('button').on('mouseenter', onMouseEnterAnchor);
  //       $(parent).find('a').on('mouseleave', onMouseLeaveAnchor);
  //       $(parent).find('button').on('mouseleave', onMouseLeaveAnchor);
  //     }
  //
  //     function onMouseMove(event) {
  //
  //       if (mouse.bounds == null) {
  //         mouse.bounds = parent.getBoundingClientRect();
  //       }
  //
  //       mouse.x = event.clientX - mouse.bounds.left;
  //       mouse.y = event.clientY - mouse.bounds.top;
  //
  //       if (!requestId) {
  //         requestId = requestAnimationFrame(updateFollower);
  //       }
  //     }
  //
  //     function onMouseDown () {
  //       $(this).find('.follower').addClass('mousedown');
  //     }
  //
  //     function onMouseUp () {
  //       $(this).find('.follower').removeClass('mousedown');
  //     }
  //
  //     function onMouseEnter () {
  //       $(this).find('.follower').addClass('animate');
  //     }
  //
  //     function onMouseLeave () {
  //       $(this).find('.follower').removeClass('animate');
  //     }
  //
  //     function onMouseEnterAnchor () {
  //       $(this).closest('.js-cursor').find('.follower').addClass('is-click');
  //     }
  //
  //     function onMouseLeaveAnchor () {
  //       $(this).closest('.js-cursor').find('.follower').removeClass('is-click');
  //     }
  //
  //     function updateFollower() {
  //
  //       TweenLite.to(follower, 0.3, {
  //         x: mouse.x,
  //         y: mouse.y
  //       });
  //
  //       requestId = null;
  //     }
  //
  //     return mouse;
  //   }
  //
  // }
  // initCursor();
  //
  // // USE THIS CODE TO INITIATE ONLY ON CERTAIN PAGES
  // // if ($('.template-index').length > 0) {
  // //   if (!cursorsInitiated) {
  // //     initCursor();
  // //   }
  // // }

  // // SLIDER FOR USE WITH GRAB ICON

  // productSlider ();
  //
  //
  // /*Slider function [It is recommended to place a function in a separate JS file, such as "functions.js"]*/
  // function productSlider () {
  //   $('#full-product-list').slick({
  //     dots: false,
  //     arrows: false,
  //     infinite: true,
  //     speed: 300,
  //     slidesToShow: 4,
  //     slidesToScroll: 4,
  //     responsive: [{
  //       breakpoint: 1200,
  //       settings: {
  //         slidesToShow: 4,
  //         slidesToScroll: 4,
  //         infinite: true,
  //         dots: true
  //       }
  //     }, {
  //       breakpoint: 992,
  //       settings: {
  //         slidesToShow: 3,
  //         slidesToScroll: 3
  //       }
  //     }, {
  //       breakpoint: 768,
  //       settings: {
  //         slidesToShow: 3,
  //         slidesToScroll: 3
  //       }
  //     }, {
  //       breakpoint: 480,
  //       settings: {
  //         slidesToShow: 2,
  //         slidesToScroll: 2
  //       }
  //     }]
  //   });
  // }




});
