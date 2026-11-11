(function(){
  'use strict';
  var form=document.getElementById('solarCalculator');if(!form)return;
  var $=function(id){return document.getElementById(id);};
  var chart=null;
  var defaults={bill:'5000',tariff:'8',roofArea:'500',costPerKw:'55000',subsidy:'0',generation:'120',areaPerKw:'100'};
  function number(id){var field=$(id),value=Number(field.value);return Number.isFinite(value)?value:NaN;}
  function formatMoney(value){return '₹'+Math.round(value).toLocaleString('en-IN');}
  function update(){
    var ids=['bill','tariff','roofArea','costPerKw','subsidy','generation','areaPerKw'];
    var valid=true;
    ids.forEach(function(id){var field=$(id),v=number(id),min=Number(field.min),max=Number(field.max);var bad=!Number.isFinite(v)||v<min||(Number.isFinite(max)&&v>max);field.setAttribute('aria-invalid',String(bad));if(bad)valid=false;});
    if(!valid){$('inputError').textContent='Please enter valid positive values in each field. Check the highlighted assumptions.';return;}
    $('inputError').textContent='';
    var bill=number('bill'),tariff=number('tariff'),roofArea=number('roofArea'),costPerKw=number('costPerKw'),enteredSubsidy=number('subsidy'),generation=number('generation'),areaPerKw=number('areaPerKw');
    var systemType=$('systemType').value,property=$('propertyType').value;
    var consumption=bill/tariff;
    var billCapacity=consumption/generation;
    var roofCapacity=roofArea/areaPerKw;
    var capacity=Math.max(0,Math.min(billCapacity,roofCapacity));
    var monthlyGeneration=capacity*generation;
    var installation=capacity*costPerKw;
    var subsidy=Math.min(enteredSubsidy,installation);
    var investment=Math.max(0,installation-subsidy);
    var monthlySavings=Math.min(bill,monthlyGeneration*tariff);
    var annualSavings=monthlySavings*12;
    var payback=annualSavings>0?investment/annualSavings:null;
    // Approximate avoided emissions using 0.716 kg CO2 per generated kWh; editable model assumption.
    var co2Tonnes=monthlyGeneration*12*0.716/1000;
    $('consumptionResult').textContent=Math.round(consumption).toLocaleString('en-IN')+' units';
    $('capacityResult').textContent=capacity.toFixed(1)+' kW';
    $('systemSummary').textContent=systemType+' · '+property+' · '+Math.round(roofCapacity*10)/10+' kW roof-area limit';
    $('generationResult').textContent=Math.round(monthlyGeneration).toLocaleString('en-IN')+' units / month';
    $('costResult').textContent=formatMoney(installation);
    $('subsidyResult').textContent=formatMoney(subsidy);
    $('investmentResult').textContent=formatMoney(investment);
    $('monthlySavings').textContent=formatMoney(monthlySavings);
    $('annualSavings').textContent=formatMoney(annualSavings);
    $('paybackResult').textContent=payback===null?'Not estimated':payback.toFixed(1)+' years';
    $('environmentResult').textContent='~'+co2Tonnes.toFixed(1)+' t CO₂ avoided per year';
    updateChart(investment,annualSavings);
  }
  function updateChart(investment,annualSavings){
    if(!window.Chart)return;
    var canvas=document.getElementById('savingsChart');if(!canvas)return;var ctx=canvas.getContext('2d');
    var data={labels:['Net investment','Annual bill offset'],datasets:[{data:[Math.round(investment),Math.round(annualSavings)],backgroundColor:['#E8B94F','#7EBB70'],borderWidth:0,borderRadius:4,maxBarThickness:36}]};
    if(chart){chart.data=data;chart.update();return;}
    chart=new Chart(ctx,{type:'bar',data:data,options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:function(context){return ' '+formatMoney(context.raw);}}}},scales:{x:{beginAtZero:true,grid:{color:'rgba(16,28,44,.08)'},ticks:{callback:function(value){return '₹'+Number(value).toLocaleString('en-IN');},font:{family:'Inter',size:9}}},y:{grid:{display:false},ticks:{font:{family:'Inter',size:10}}}}}});
  }
  form.addEventListener('input',update);
  form.addEventListener('change',update);
  form.addEventListener('submit',function(event){event.preventDefault();update();var errorNode=document.getElementById('inputError');var panel=document.getElementById('resultsPanel');if(errorNode&&!errorNode.textContent&&panel)panel.scrollIntoView({behavior:'smooth',block:'nearest'});});
  form.addEventListener('reset',function(){window.setTimeout(function(){Object.keys(defaults).forEach(function(id){$(id).value=defaults[id];});$('propertyType').value='Residential';$('systemType').value='On-grid';$('advancedAssumption').hidden=true;$('toggleAdvanced').setAttribute('aria-expanded','false');update();},0);});
  $('toggleAdvanced').addEventListener('click',function(){var advanced=$('advancedAssumption'),open=advanced.hidden;advanced.hidden=!open;this.setAttribute('aria-expanded',String(open));this.textContent=open?'Hide':'Adjust';});
  $('downloadSummary').addEventListener('click',function(){update();if($('inputError').textContent)return;var lines=['MOS SOLAR - ILLUSTRATIVE SOLAR SAVINGS ESTIMATE','', 'Property: '+$('propertyType').value,'Preferred system: '+$('systemType').value,'Monthly electricity bill: '+formatMoney(number('bill')),'Electricity tariff: Rs '+number('tariff').toFixed(2)+' / unit','Available roof area: '+number('roofArea')+' sq ft','Estimated monthly consumption: '+$('consumptionResult').textContent,'Suggested system capacity: '+$('capacityResult').textContent,'Estimated generation: '+$('generationResult').textContent,'Estimated installation cost: '+$('costResult').textContent,'Entered subsidy (not verified): '+$('subsidyResult').textContent,'Estimated net investment: '+$('investmentResult').textContent,'Estimated monthly savings: '+$('monthlySavings').textContent,'Estimated annual savings: '+$('annualSavings').textContent,'Estimated simple payback: '+$('paybackResult').textContent,'Illustrative annual CO2 impact: '+$('environmentResult').textContent,'','This estimate is illustrative, not a quote or guarantee. Actual results depend on site conditions, usage, tariff, regulations, system design and subsidy eligibility.'];var blob=new Blob(['\ufeff'+lines.join('\r\n')],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='mos-solar-estimate.txt';document.body.appendChild(link);link.click();link.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);});
  var printButton=$('printSummary');if(printButton)printButton.addEventListener('click',function(){update();if(!$('inputError').textContent)window.print();});
  var enquiry=$('consultationForm');if(enquiry){enquiry.addEventListener('submit',function(event){event.preventDefault();if(!enquiry.reportValidity())return;var data=new FormData(enquiry);var body=['Name: '+data.get('name'),'Phone: '+data.get('phone'),'Email: '+data.get('email'),'Property: '+data.get('property'),'Monthly bill: '+$('monthlySavings').textContent,'Estimated system: '+$('capacityResult').textContent,'Project details: '+(data.get('message')||'Not provided')].join('\n');$('consultationStatus').textContent='Your email app is opening with the consultation details.';window.location.href='mailto:info@mossolar.in?subject='+encodeURIComponent('Solar consultation request from '+data.get('name'))+'&body='+encodeURIComponent(body);});}
  update();
})();





