(function () {
    'use strict';
    var $ = window.jQuery;
    if ($ && $.fn.owlCarousel) {
        var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        $('.hero-carousel').owlCarousel({
            items:1,
            loop:true,
            autoplay:!reduceMotion,
            autoplayTimeout:6000,
            autoplaySpeed:reduceMotion?0:1400,
            smartSpeed:reduceMotion?0:1400,
            animateOut:reduceMotion?false:'fadeOut',
            animateIn:reduceMotion?false:'fadeIn',
            nav:false,
            dots:false,
            autoplayHoverPause:false
        });
    }

    // Reveal sections only as they enter view, with a graceful fallback.
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) { if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);} });
        }, {threshold:.12});
        reveals.forEach(function(el){revealObserver.observe(el);});
    } else { reveals.forEach(function(el){el.classList.add('is-visible');}); }

    // Animate the company figures supplied for the homepage.
    var counters=document.querySelectorAll('.counter');
    if ('IntersectionObserver' in window) {
        var counterObserver=new IntersectionObserver(function(entries,observer){entries.forEach(function(entry){if(entry.isIntersecting){var node=entry.target;var target=Number(node.dataset.target||0);var suffix=node.dataset.suffix||'';var current=0;var steps=60;var timer=setInterval(function(){current++;node.textContent=Math.round(target*current/steps).toLocaleString()+suffix;if(current>=steps){clearInterval(timer);node.textContent=target.toLocaleString()+suffix;}},35);observer.unobserve(node);}});},{threshold:.6});
        counters.forEach(function(counter){counterObserver.observe(counter);});
    }

    // Project category filtering.
    var filterButtons=document.querySelectorAll('.filter-btn');
    filterButtons.forEach(function(button){button.addEventListener('click',function(){filterButtons.forEach(function(item){item.classList.remove('active');});button.classList.add('active');var filter=button.dataset.filter;document.querySelectorAll('.project-card').forEach(function(card){card.classList.toggle('is-hidden',filter!=='all'&&card.dataset.category!==filter);});});});

    // Savings estimate uses only values entered on the page and a clearly labeled offset assumption.
    var calculator=document.getElementById('savingsCalculator');
    var bill=document.getElementById('monthlyBill');var rate=document.getElementById('offsetRate');
    function updateEstimate(){if(!bill||!rate)return;var amount=Math.max(0,Number(bill.value)||0);var pct=Number(rate.value)||0;var monthly=Math.round(amount*pct/100);document.getElementById('offsetLabel').textContent=pct+'%';document.getElementById('monthlySaving').textContent='₹'+monthly.toLocaleString('en-IN');document.getElementById('annualSaving').textContent='₹'+(monthly*12).toLocaleString('en-IN');}
    if(calculator){calculator.addEventListener('input',updateEstimate);calculator.addEventListener('submit',function(event){event.preventDefault();updateEstimate();});updateEstimate();}

    // Accessible FAQ accordion.
    document.querySelectorAll('.faq-question').forEach(function(button){button.addEventListener('click',function(){var item=button.closest('.faq-item');var list=button.closest('.faq-list');var open=!item.classList.contains('open');if(list){list.querySelectorAll('.faq-item.open').forEach(function(openItem){openItem.classList.remove('open');var openButton=openItem.querySelector('.faq-question');if(openButton)openButton.setAttribute('aria-expanded','false');});}if(open){item.classList.add('open');button.setAttribute('aria-expanded','true');}});});

    // Enquiry form validates locally and prepares a mailto message; no backend is configured.
    var enquiry=document.getElementById('enquiryForm');
    if(enquiry){enquiry.addEventListener('submit',function(event){event.preventDefault();if(!enquiry.reportValidity())return;var data=new FormData(enquiry);var subject='Solar enquiry from '+data.get('name');var body=['Name: '+data.get('name'),'Phone: '+data.get('phone'),'Email: '+data.get('email'),'Interested in: '+data.get('interest'),'Project details: '+(data.get('message')||'Not provided')].join('\n');document.getElementById('formStatus').textContent='Your email app is opening with the enquiry details.';window.location.href='mailto:info@mossolar.in?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);});}

    var topButton=document.querySelector('.back-to-top');function toggleTopButton(){topButton.classList.toggle('visible',window.scrollY>450);}window.addEventListener('scroll',toggleTopButton,{passive:true});toggleTopButton();topButton.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
    var year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
})();
