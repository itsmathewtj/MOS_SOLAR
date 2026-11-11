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

// Keep the footer consistent across every page.
(function () {
    var footer = document.querySelector('footer.mos-footer');
    if (!footer) return;
    var template = document.createElement('template');
    template.innerHTML = '<footer class="mos-footer"><div class="container footer-main"><div class="footer-brand"><a href="index.html" class="navbar-brand mos-brand"><img class="brand-logo" src="img/Logo.png" alt="MOS Solar"></a><p>Thoughtful solar solutions for homes, businesses and industry across Kerala.</p><div class="footer-social-links" aria-label="Contact MOS Solar"><a href="https://www.instagram.com/mossolar/" aria-label="Instagram"><i class="fab fa-instagram"></i></a><a href="https://wa.me/919656003990" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a><a href="tel:+919656003990" aria-label="Call MOS Solar"><i class="fas fa-phone-alt"></i></a><a href="mailto:info@mossolar.in" aria-label="Email MOS Solar"><i class="fas fa-envelope"></i></a></div></div><div><h3>Explore</h3><a href="about.html">About MOS Solar</a><a href="solutions.html">Solar solutions</a><a href="projects.html">Projects</a><a href="blog.html">Stories &amp; FAQs</a></div><div><h3>Solutions</h3><a href="solutions.html">Residential solar</a><a href="solutions.html">Commercial solar</a><a href="solutions.html">Industrial solar</a><a href="products.html">Solar products</a></div><div><h3>Get in touch</h3><a href="tel:+919656003990">+91 96560 03990</a><a href="mailto:info@mossolar.in">info@mossolar.in</a><span>B 1305, JLN Stadium,<br>Kaloor, Ernakulam, Kerala 682017</span><a href="contact.html">Contact MOS Solar <i class="fa fa-arrow-right"></i></a></div></div><div class="container footer-bottom"><span>© <span id="year"></span> MOS Solar. Clean energy for Kerala.</span><a href="index.html#top">Back to top</a><span>Designed by <a href="https://itsmathewtj.github.io/TWODLE_MEDIA/" target="_blank" rel="noopener noreferrer">twodle media</a></span></div></footer>';
    var replacement = template.content.firstElementChild;
    var footerLogo = replacement.querySelector('.brand-logo');
    if (footerLogo && document.currentScript) footerLogo.src = new URL('../img/Logo.png', document.currentScript.src).href;
    footer.replaceWith(replacement);
    var year = replacement.querySelector('#year');
    if (year) year.textContent = new Date().getFullYear();
})();

// Group social and direct contact icons at the right end of the top contact bar.
(function () {
    var bar = document.querySelector('.announcement-inner');
    if (!bar || bar.querySelector('.announcement-actions')) return;
    var instagram = bar.querySelector('.announcement-social');
    if (!instagram) return;
    var actions = document.createElement('div');
    actions.className = 'announcement-actions';
    actions.appendChild(instagram);
    var contacts = [
        ['https://wa.me/919656003990', 'fab fa-whatsapp', 'WhatsApp MOS Solar'],
        ['tel:+919656003990', 'fas fa-phone-alt', 'Call MOS Solar'],
        ['mailto:info@mossolar.in', 'fas fa-envelope', 'Email MOS Solar']
    ];
    contacts.forEach(function (item) {
        var link = document.createElement('a');
        link.href = item[0];
        link.className = 'announcement-icon-link';
        link.setAttribute('aria-label', item[2]);
        if (item[0].indexOf('https://') === 0) {
            link.target = '_blank';
            link.rel = 'noopener';
        }
        var icon = document.createElement('i');
        icon.className = item[1];
        link.appendChild(icon);
        actions.appendChild(link);
    });
    bar.appendChild(actions);
})();
