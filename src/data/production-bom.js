// v89: approved workshop geometry for 42/59 mm doors.
// Physical part geometry only. Financial write-off and reusable remnants are modeled in cost-production-v89.js.
const HD_PRODUCTION_BOM_SOURCE=Object.freeze({
  repository:'satana6667292-droid/hidden-doors-configurator',
  path:'src/data/production-bom.js',
  checkedCommit:'approved-v89-2026-09-20',
  basis:'Approved current workshop rules captured 2026-09-20; legacy Production code remains a comparison source until synchronized.'
});

const HD_PRODUCTION_PROFILE_STOCK=Object.freeze({
  box:Object.freeze({stockLengthMm:5100,discardBelowMm:700,sawKerfMm:3,factoryAllowanceMm:'20–30'}),
  direct_edge:Object.freeze({stockLengthMm:6000,discardBelowMm:600,sawKerfMm:3}),
  revers_edge:Object.freeze({stockLengthMm:6000,discardBelowMm:600,sawKerfMm:3}),
  edge_59:Object.freeze({stockLengthMm:6000,discardBelowMm:600,sawKerfMm:3}),
  carcass:Object.freeze({stockLengthMm:6000,discardBelowMm:600,sawKerfMm:3})
});

function hdBomNumber(value){
  const n=Number(String(value??'').replace(',','.'));
  return Number.isFinite(n)?Math.max(0,Math.round(n)):0;
}
function hdBomRepeatCuts(cuts,quantity){
  const q=Math.max(0,Math.round(Number(quantity)||0));
  return Array.from({length:q},()=>cuts).flat();
}
function hdBomRequirement(role,cuts,quantity,note=''){
  const repeated=hdBomRepeatCuts(cuts,quantity);
  const profile=HD_PRODUCTION_PROFILE_STOCK[role]||{};
  return {
    role,
    cutsMm:repeated,
    requiredLengthMm:repeated.reduce((sum,cut)=>sum+cut,0),
    sawLossMm:repeated.length*Number(profile.sawKerfMm||0),
    stockLengthMm:profile.stockLengthMm||0,
    discardBelowMm:profile.discardBelowMm||0,
    sawKerfMm:profile.sawKerfMm||0,
    factoryAllowanceMm:profile.factoryAllowanceMm||'',
    note
  };
}
function hdBuildProductionCompatibleBom(input={}){
  const construction=String(input.construction)==='59'?'59':'42';
  const height=hdBomNumber(input.height);
  const width=hdBomNumber(input.width);
  const quantity=Math.max(0,Math.round(Number(input.quantity)||1));
  const frameType=String(input.frameType||'aluminum').toLowerCase();
  const opening=String(input.opening||'direct').toLowerCase();
  const requirements=[],issues=[],gaps=[];

  if(!height||!width||!quantity){
    return {construction,height,width,quantity,requirements,issues:['Для расчёта нужны высота, ширина и количество.'],gaps};
  }

  requirements.push(hdBomRequirement(
    'box',[height+100,height+100,width+100],quantity,
    'Короб: две стойки H+100 и верх W+100. Номинальный хлыст 5100 мм; заводские +20–30 мм покрывают пропилы и не считаются складским остатком.'
  ));

  if(construction==='42'){
    if(/revers|реверс|обрат/.test(opening)){
      requirements.push(hdBomRequirement('revers_edge',[height+20,height+20,width+20],quantity,'Revers: две стойки и верх +20 мм из профиля с четвертью.'));
      requirements.push(hdBomRequirement('direct_edge',[width+20],quantity,'Revers: нижняя деталь из прямого профиля, также +20 мм.'));
    }else{
      requirements.push(hdBomRequirement('direct_edge',[height+20,height+20,width+20,width+20],quantity,'Прямое открывание: четыре детали торца, каждая +20 мм под 45° и торцевание.'));
    }
  }else{
    requirements.push(hdBomRequirement('edge_59',[height+20,height+20,width+20,width+20],quantity,'59 мм: четыре детали торца, каждая +20 мм под 45° и торцевание.'));
  }

  if(/alu|алюм/.test(frameType)){
    requirements.push(hdBomRequirement('carcass',[height+20,height+20,width+20],quantity,'Алюминиевый каркас: две стойки H+20 и верх W+20. Нижняя деталь каркаса деревянная.'));
  }

  gaps.push('Финансовое списание профиля считается только после раскроя: торец/каркас — полезный остаток ≥600 мм, короб — ≥700 мм; остатки совместимы только по тому же профилю и цвету.');
  gaps.push('МДФ 4 мм, сотопанель и внутренний деревянный каркас считаются в рабочей модели себестоимости v89.');
  return {construction,height,width,quantity,requirements,issues,gaps};
}
function hdBomRole(plan,role){return (plan.requirements||[]).find(row=>row.role===role)||null}
function hdBomMetres(plan,roles){
  const roleSet=new Set(Array.isArray(roles)?roles:[roles]);
  return (plan.requirements||[]).filter(row=>roleSet.has(row.role)).reduce((sum,row)=>sum+row.requiredLengthMm,0)/1000;
}
function hdBomCutsText(requirement){
  if(!requirement||!requirement.cutsMm?.length)return '—';
  return requirement.cutsMm.map(x=>x+' мм').join(' + ');
}
