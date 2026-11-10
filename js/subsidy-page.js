(function(){
  'use strict';
  var form=document.getElementById('subsidyCalculator');
  if(!form)return;
  var get=function(id){return document.getElementById(id)};
  var ids=['monthlyBill','tariff','generation','costPerKw','subsidyAmount'];
  function val(id){var n=Number(get(id).value);return Number.isFinite(n)&&n>=0?n:0;}
  function money(n){return '₹'+Math.round(n).toLocaleString('en-IN');}
  function update(){
    var bill=val('monthlyBill'),tariff=val('tariff'),generation=Math.max(val('generation'),0.01),costPerKw=val('costPerKw'),enteredSubsidy=val('subsidyAmount');
    var monthlyUnits=tariff>0?bill/tariff:0;
    var capacity=monthlyUnits/generation;
    var cost=capacity*costPerKw;
    var subsidy=Math.min(enteredSubsidy,cost);
    var investment=Math.max(0,cost-subsidy);
    var monthlyOffset=Math.min(bill,capacity*generation*tariff);
    var annualOffset=monthlyOffset*12;
    var payback=annualOffset>0?investment/annualOffset:null;
    get('capacityResult').textContent=capacity.toFixed(1)+' kW';
    get('costResult').textContent=money(cost);
    get('subsidyResult').textContent=money(subsidy);
    get('investmentResult').textContent=money(investment);
    get('monthlySavings').textContent=money(monthlyOffset);
    get('annualSavings').textContent=money(annualOffset);
    get('paybackResult').textContent=payback===null?'—':payback.toFixed(1)+' years';
    var scale=Math.max(cost,annualOffset,1);
    get('investmentBar').style.width=Math.max(2,Math.min(100,investment/scale*100))+'%';
    get('savingsBar').style.width=Math.max(2,Math.min(100,annualOffset/scale*100))+'%';
  }
  ids.forEach(function(id){get(id).addEventListener('input',update);});
  form.addEventListener('submit',function(e){e.preventDefault();update();});
  update();
})();
