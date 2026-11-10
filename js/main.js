(function ($) {
    "use strict";

    // Hide the optional page loader once the document is ready.
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) $('#spinner').removeClass('show');
        }, 1);
    };
    spinner();

    // Legacy template pages still use WOW and Owl Carousel. Premium MOS pages
    // initialize only the controls present in their own markup.
    if (window.WOW && document.querySelector('.wow')) new WOW().init();

    // Keep the original sticky reveal behavior on template pages.
    if (!document.body.classList.contains('mos-home')) {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 300) $('.sticky-top').addClass('shadow-sm').css('top', '0px');
            else $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        });
        $(window).scroll(function () {
            if ($(this).scrollTop() > 300) $('.back-to-top').fadeIn('slow');
            else $('.back-to-top').fadeOut('slow');
        });
        $('.back-to-top').click(function () {
            $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
            return false;
        });
    }

    if ($('.header-carousel').length && $.fn.owlCarousel) {
        $('.header-carousel').owlCarousel({autoplay:true,smartSpeed:1500,loop:true,nav:false,dots:true,items:1,dotsData:true});
    }
})(window.jQuery);
