(function(){
  'use strict';
  var form=document.getElementById('contactEnquiryForm');
  if(!form)return;
  var status=document.getElementById('formStatus');
  var phone=form.elements.phone;
  var digitsOnly=function(value){return value.replace(/\D/g,'');};
  function validatePhone(){
    var digits=digitsOnly(phone.value);
    var valid=digits.length>=8&&digits.length<=15;
    phone.setCustomValidity(valid?'':'Enter a valid phone number with 8 to 15 digits.');
    phone.setAttribute('aria-invalid',String(!valid));
    return valid;
  }
  function validateField(field){
    if(field.name==='phone')validatePhone();
    field.setAttribute('aria-invalid',String(!field.validity.valid));
  }
  Array.prototype.forEach.call(form.querySelectorAll('input,select,textarea'),function(field){
    field.addEventListener('blur',function(){validateField(field);});
    field.addEventListener('input',function(){
      validateField(field);
      if(status){status.classList.remove('status-error','status-success');}
    });
    field.addEventListener('change',function(){validateField(field);});
  });
  function dataObject(data){
    return {name:data.get('name').trim(),phone:data.get('phone').trim(),email:data.get('email').trim(),district:data.get('district'),propertyType:data.get('propertyType'),service:data.get('service'),message:data.get('message').trim()};
  }
  function buildEmail(payload){
    var subject='Solar enquiry from '+payload.name;
    var body=['Name: '+payload.name,'Phone: '+payload.phone,'Email: '+payload.email,'District: '+payload.district,'Property type: '+payload.propertyType,'Service required: '+payload.service,'Message: '+payload.message].join('\n');
    return 'mailto:info@mossolar.in?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  }
  form.addEventListener('submit',function(event){
    event.preventDefault();
    validatePhone();
    if(!form.reportValidity()){
      form.querySelector(':invalid')?.focus();
      status.textContent='Please check the highlighted fields and try again.';
      status.classList.add('status-error');
      return;
    }
    var payload=dataObject(new FormData(form));
    var endpoint=(form.dataset.apiEndpoint||'').trim();
    var button=document.getElementById('submitEnquiry');
    if(endpoint){
      button.disabled=true;button.setAttribute('aria-busy','true');
      status.textContent='Sending your enquiry…';status.classList.remove('status-error','status-success');
      fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)})
        .then(function(response){if(!response.ok)throw new Error('Request failed');return response;})
        .then(function(){status.textContent='Thank you. Your enquiry has been sent to MOS Solar.';status.classList.add('status-success');form.reset();form.querySelectorAll('[aria-invalid]').forEach(function(field){field.removeAttribute('aria-invalid');});})
        .catch(function(){status.textContent='We could not send your enquiry right now. Please call or WhatsApp MOS Solar, or try again later.';status.classList.add('status-error');})
        .finally(function(){button.disabled=false;button.removeAttribute('aria-busy');});
      return;
    }
    status.textContent='Your email app is opening with your enquiry. Review it and press Send to contact MOS Solar.';
    status.classList.remove('status-error','status-success');
    window.location.href=buildEmail(payload);
  });
  document.querySelectorAll('[data-service]').forEach(function(link){link.addEventListener('click',function(){var service=form.elements.service;var option=Array.prototype.find.call(service.options,function(item){return item.text.toLowerCase().indexOf(link.dataset.service.toLowerCase())!==-1;});if(option)service.value=option.value;});});
})();
