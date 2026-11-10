(function(){'use strict';
var buttons=document.querySelectorAll('.catalogue-filter');var cards=document.querySelectorAll('.catalogue-card');
function setFilter(filter){buttons.forEach(function(button){button.classList.toggle('active',button.dataset.filter===filter)});cards.forEach(function(card){card.classList.toggle('is-hidden',filter!=='all'&&card.dataset.category!==filter)});}
buttons.forEach(function(button){button.addEventListener('click',function(){setFilter(button.dataset.filter);});});
document.querySelectorAll('[data-jump-filter]').forEach(function(link){link.addEventListener('click',function(){setFilter(link.dataset.jumpFilter);});});
document.querySelectorAll('.view-details').forEach(function(button){button.addEventListener('click',function(){var card=button.closest('.catalogue-card');var open=card.classList.toggle('details-open');button.setAttribute('aria-expanded',String(open));});});
})();
