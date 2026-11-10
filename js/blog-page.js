(function(){
  'use strict';
  var cards=Array.prototype.slice.call(document.querySelectorAll('.blog-card'));
  var activeCategory='all';
  var activePage=1;
  var perPage=3;
  var search=document.getElementById('searchArticles');
  var empty=document.getElementById('emptyResults');
  function filter(){
    if(!cards.length)return;
    var term=(search?search.value:'').trim().toLowerCase();
    var matches=[];
    cards.forEach(function(card){
      var categoryMatch=activeCategory==='all'||card.dataset.category===activeCategory;
      var haystack=(card.dataset.search+' '+card.textContent).toLowerCase();
      if(categoryMatch&&(!term||haystack.indexOf(term)!==-1))matches.push(card);
    });
    var pages=Math.max(1,Math.ceil(matches.length/perPage));
    if(activePage>pages)activePage=pages;
    cards.forEach(function(card){card.hidden=true;});
    matches.slice((activePage-1)*perPage,activePage*perPage).forEach(function(card){card.hidden=false;});
    if(empty)empty.hidden=matches.length!==0;
    var status=document.getElementById('paginationStatus');
    if(status)status.textContent=matches.length?'Showing sample articles '+((activePage-1)*perPage+1)+' to '+Math.min(activePage*perPage,matches.length)+' of '+matches.length:'No matching articles';
    document.querySelectorAll('.page-button').forEach(function(button){
      var page=button.dataset.page;
      if(page==='prev'){button.disabled=activePage===1;return;}
      if(page==='next'){button.disabled=activePage===pages;return;}
      var current=Number(page)===activePage;
      button.classList.toggle('active',current);
      if(current)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
      button.hidden=Number(page)>pages;
    });
  }
  document.querySelectorAll('.category-filter').forEach(function(button){
    button.addEventListener('click',function(){
      document.querySelectorAll('.category-filter').forEach(function(item){item.classList.remove('active');item.setAttribute('aria-pressed','false');});
      button.classList.add('active');button.setAttribute('aria-pressed','true');activeCategory=button.dataset.category;activePage=1;filter();
    });
    button.setAttribute('aria-pressed',button.classList.contains('active')?'true':'false');
  });
  document.querySelectorAll('.page-button').forEach(function(button){button.addEventListener('click',function(){var page=button.dataset.page;if(page==='prev')activePage--;else if(page==='next')activePage++;else activePage=Number(page);filter();});});
  var searchForm=document.getElementById('articleSearch');
  if(search)search.addEventListener('input',function(){activePage=1;filter();});
  if(searchForm)searchForm.addEventListener('submit',function(event){event.preventDefault();activePage=1;filter();});
  var newsletter=document.getElementById('newsletterForm');
  if(newsletter)newsletter.addEventListener('submit',function(event){event.preventDefault();if(!newsletter.reportValidity())return;document.getElementById('newsletterStatus').textContent='Thanks. This sample form is not connected to a mailing service yet.';newsletter.reset();});
  filter();
})();

