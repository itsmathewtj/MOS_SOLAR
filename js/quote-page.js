(function(){
  'use strict';
  var form=document.getElementById('quoteEnquiryForm');
  if(!form)return;
  var steps=Array.prototype.slice.call(form.querySelectorAll('.quote-step'));
  var indicators=Array.prototype.slice.call(document.querySelectorAll('[data-indicator]'));
  var previous=document.getElementById('previousStep');
  var next=document.getElementById('nextStep');
  var submit=document.getElementById('submitQuote');
  var stepLabel=document.getElementById('stepLabel');
  var stepTitle=document.getElementById('stepTitle');
  var progress=document.getElementById('progressBar');
  var progressTrack=document.querySelector('.quote-progress-track');
  var status=document.getElementById('submissionStatus');
  var success=document.getElementById('quoteSuccess');
  var current=0;
  var names=['Customer information','Property information','Solar requirements','Review and confirmation'];
  var phone=form.elements.phone;
  function digits(value){return value.replace(/\D/g,'');}
  function validatePhone(){
    var count=digits(phone.value).length;
    phone.setCustomValidity(count>=8&&count<=15?'':'Enter a valid phone number with 8 to 15 digits.');
  }
  function showStep(index){
    current=Math.max(0,Math.min(index,steps.length-1));
    steps.forEach(function(step,i){step.hidden=i!==current;step.classList.toggle('is-active',i===current);});
    indicators.forEach(function(item,i){item.classList.toggle('is-current',i===current);item.classList.toggle('is-complete',i<current);if(i===current)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');});
    stepLabel.textContent='Step '+(current+1)+' of '+steps.length;
    stepTitle.textContent=names[current];
    progress.style.width=((current+1)/steps.length*100)+'%';
    progressTrack.setAttribute('aria-valuenow',String(current+1));
    previous.hidden=current===0;
    next.hidden=current===steps.length-1;
    submit.hidden=current!==steps.length-1;
    var error=steps[current].querySelector('.step-error');if(error)error.textContent='';
    if(current===3)renderReview();
  }
  function validateCurrent(){
    var active=steps[current];
    var fields=Array.prototype.slice.call(active.querySelectorAll('input,select,textarea'));
    if(fields.some(function(field){return field.name==='phone';}))validatePhone();
    var invalid=fields.filter(function(field){return !field.checkValidity();});
    var error=active.querySelector('.step-error');
    if(invalid.length){
      if(error)error.textContent='Please complete the required fields and check the highlighted information.';
      invalid.forEach(function(field){field.setAttribute('aria-invalid','true');});
      invalid[0].reportValidity();invalid[0].focus();return false;
    }
    fields.forEach(function(field){field.removeAttribute('aria-invalid');});
    if(error)error.textContent='';
    return true;
  }
  function value(name){var field=form.elements[name];return field?String(field.value||'').trim():'';}
  function display(name){
    var field=form.elements[name];if(!field)return '—';
    if(field.tagName==='SELECT')return field.selectedOptions.length?field.selectedOptions[0].text:'—';
    var raw=String(field.value||'').trim();return raw||'—';
  }
  function renderReview(){
    var rows=[['Full name',display('name')],['Mobile number',display('phone')],['Email address',display('email')],['District',display('district')],['Town / location',display('location')],['Property type',display('propertyType')],['Ownership status',display('ownership')],['Monthly electricity bill',value('monthlyBill')?new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number(value('monthlyBill'))):'—'],['Preferred system',display('system')],['Rooftop area',value('roofArea')?value('roofArea')+' sq ft':'Not provided'],['Preferred timeline',display('timeline')]];
    var list=document.getElementById('quoteReview');list.replaceChildren();
    rows.forEach(function(row){var wrapper=document.createElement('div'),term=document.createElement('dt'),description=document.createElement('dd');term.textContent=row[0];description.textContent=row[1];wrapper.append(term,description);list.appendChild(wrapper);});
  }
  function payload(){return {name:value('name'),phone:value('phone'),email:value('email'),district:value('district'),location:value('location'),propertyType:value('propertyType'),ownership:value('ownership'),monthlyBill:Number(value('monthlyBill')),preferredSystem:value('system'),roofArea:value('roofArea')?Number(value('roofArea')):null,installationTimeline:value('timeline'),additionalRequirements:value('requirements'),contactConsent:form.elements.consent.checked};}
  function prepareEmail(data){
    var subject='Free solar quote enquiry from '+data.name;
    var body=['Name: '+data.name,'Mobile: '+data.phone,'Email: '+data.email,'District: '+data.district,'Location: '+data.location,'Property: '+data.propertyType,'Ownership: '+data.ownership,'Average monthly bill: INR '+data.monthlyBill,'Preferred system: '+data.preferredSystem,'Available roof area: '+(data.roofArea===null?'Not provided':data.roofArea+' sq ft'),'Preferred timeline: '+data.installationTimeline,'Additional requirements: '+(data.additionalRequirements||'None provided')].join('\n');
    return 'mailto:info@mossolar.in?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  }
  next.addEventListener('click',function(){if(!validateCurrent())return;if(current===2)renderReview();showStep(current+1);});
  previous.addEventListener('click',function(){showStep(current-1);});
  form.addEventListener('input',function(event){var field=event.target;if(field.matches('input,select,textarea')){field.removeAttribute('aria-invalid');var message=steps[current].querySelector('.step-error');if(message)message.textContent='';if(status)status.classList.remove('status-error');}});
  form.addEventListener('change',function(event){if(event.target.name==='phone')validatePhone();});
  form.addEventListener('submit',function(event){
    event.preventDefault();
    if(current!==3){if(validateCurrent())showStep(current+1);return;}
    validatePhone();
    if(!validateCurrent())return;
    var data=payload(),endpoint=(form.dataset.apiEndpoint||'').trim();
    if(endpoint){
      submit.disabled=true;submit.setAttribute('aria-busy','true');status.textContent='Sending your enquiry...';status.classList.remove('status-error','status-success');
      fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(function(response){if(!response.ok)throw new Error('Enquiry request failed');return response;})
        .then(function(){form.hidden=true;success.hidden=false;document.getElementById('successMessage').textContent='Your enquiry has been sent to MOS Solar. The team can follow up using the contact details you provided.';success.focus();})
        .catch(function(){status.textContent='We could not send your enquiry. Please try again or contact MOS Solar by phone or WhatsApp.';status.classList.add('status-error');})
        .finally(function(){submit.disabled=false;submit.removeAttribute('aria-busy');});
      return;
    }
    status.textContent='Your email app is opening with the enquiry. Review the message and press Send to contact MOS Solar.';status.classList.remove('status-error','status-success');
    window.location.href=prepareEmail(data);
  });
  showStep(0);
})();
