(function(){'use strict';
var buttons=document.querySelectorAll('.project-filter');var items=document.querySelectorAll('.masonry-item');
function setFilter(filter){buttons.forEach(function(button){button.classList.toggle('active',button.dataset.filter===filter)});items.forEach(function(item){item.classList.toggle('is-hidden',filter!=='all'&&item.dataset.category!==filter)});}
buttons.forEach(function(button){button.addEventListener('click',function(){setFilter(button.dataset.filter)});});document.querySelectorAll('[data-jump-filter]').forEach(function(link){link.addEventListener('click',function(){setFilter(link.dataset.jumpFilter)});});
if(window.GLightbox){GLightbox({selector:'.glightbox',touchNavigation:true,loop:true,autoplayVideos:false});}
var range=document.querySelector('.ba-range');var panel=document.querySelector('.ba-panel');if(range&&panel){range.addEventListener('input',function(){panel.style.setProperty('--split',range.value+'%')});}
})();
