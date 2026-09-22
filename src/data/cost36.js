// v85: reference normative/factual cost model for 36 mm PVC door leaf.
// Model: purchase unit -> write-off unit -> unit cost -> norm -> technological waste -> normative cost -> factual write-off -> deviation.
const COST36_STORE='hd_v85_cost36_model';
const COST36_LEGACY_STORE='hd_v84_cost36_rules';

const COST36_DEFAULTS=Object.freeze({
  geometry:Object.freeze({width:800,height:2000,sideFrameWidth:45,ribWidth:28,ribGap:30,faceMdfDoorsPerSheet:1.5}),
  overhead:Object.freeze({
    rent:265000,electricity:50000,driver:75000,productionManager:75000,shopEmployees:450000,
    normalMonthlyDoors:0,actualMonthlyDoors:0
  }),
  operations:Object.freeze({piecework:0,external:0}),
  resources:Object.freeze([
    Object.freeze({id:'faceMdf',group:'materials',name:'МДФ 6 мм · щиты полотна',purchaseUnit:'лист',purchasePrice:1354,writeoffUnit:'лист',conversionQty:1,normMode:'face-mdf',norm:0,wastePct:0,actualQty:''}),
    Object.freeze({id:'frameMdf',group:'materials',name:'Каркас МДФ 8+16 мм',purchaseUnit:'комплект раскроя',purchasePrice:4783,writeoffUnit:'дет.',conversionQty:56,normMode:'fixed',norm:3,wastePct:0,actualQty:''}),
    Object.freeze({id:'ribs',group:'materials',name:'Рёбра жёсткости · МДФ 6 мм',purchaseUnit:'лист',purchasePrice:1354,writeoffUnit:'ребро',conversionQty:103,normMode:'ribs',norm:0,wastePct:0,actualQty:''}),
    Object.freeze({id:'pvc',group:'materials',name:'ПВХ-плёнка',purchaseUnit:'м²',purchasePrice:165,writeoffUnit:'м²',conversionQty:1,normMode:'fixed',norm:14,wastePct:0,actualQty:''}),
    Object.freeze({id:'pva',group:'consumables',name:'Клей ПВА',purchaseUnit:'ведро',purchasePrice:9100,writeoffUnit:'кг',conversionQty:30,normMode:'fixed',norm:0.3,wastePct:0,actualQty:''}),
    Object.freeze({id:'vacuumGlue',group:'consumables',name:'Клей вакуумного пресса',purchaseUnit:'ведро',purchasePrice:26450,writeoffUnit:'кг',conversionQty:30,normMode:'fixed',norm:0.2,wastePct:0,actualQty:''}),
    Object.freeze({id:'packFilm',group:'packaging',name:'ПЭ рукав упаковки полотна',purchaseUnit:'рулон 100 м',purchasePrice:4173.75,writeoffUnit:'м',conversionQty:100,normMode:'pack-film-height',norm:0,wastePct:0,actualQty:'',sourceNote:'ПЭ рукав (1500×2)×0,08, 100 п.м.; норма = высота полотна + 300 мм'}),
    Object.freeze({id:'cardboard',group:'packaging',name:'Картон упаковочный',purchaseUnit:'лист',purchasePrice:94,writeoffUnit:'дет.',conversionQty:12,normMode:'fixed',norm:6,wastePct:0,actualQty:''}),
    Object.freeze({id:'tape',group:'packaging',name:'Скотч упаковки полотна',purchaseUnit:'рулон 150 м',purchasePrice:100,writeoffUnit:'м',conversionQty:150,normMode:'pack-tape-wrap',norm:0,wastePct:0,actualQty:'',sourceNote:'5 полных витков вокруг полотна с картоном; норма зависит от ширины и толщины 36 мм'})
  ])
});
const COST36_GROUP_META=Object.freeze({
  materials:{label:'Материалы',order:1},
  components:{label:'Комплектующие',order:2},
  consumables:{label:'Расходники',order:3},
  packaging:{label:'Упаковка',order:4},
  operations:{label:'Работы',order:5}
});

function cost36Clone(v){return JSON.parse(JSON.stringify(v))}
function cost36DefaultValues(){return cost36Clone(COST36_DEFAULTS)}
function cost36LegacyValues(){
  const legacy=typeof getStore==='function'?getStore(COST36_LEGACY_STORE,null):null;
  if(!legacy?.values)return null;
  const x=cost36DefaultValues(),v=legacy.values;
  x.geometry.width=Number(v.geometry?.width||x.geometry.width);
  x.geometry.height=Number(v.geometry?.height||x.geometry.height);
  x.geometry.sideFrameWidth=Number(v.geometry?.sideFrameWidth||x.geometry.sideFrameWidth);
  x.geometry.ribWidth=Number(v.geometry?.ribWidth||x.geometry.ribWidth);
  x.geometry.ribGap=Number(v.geometry?.ribGap||x.geometry.ribGap);
  x.geometry.faceMdfDoorsPerSheet=Number(v.faceMdf?.doorsPerSheet||x.geometry.faceMdfDoorsPerSheet);
  const patch=(id,data)=>{const r=x.resources.find(y=>y.id===id);if(r)Object.assign(r,data)};
  patch('faceMdf',{purchasePrice:Number(v.faceMdf?.sheetPrice||1354)});
  patch('frameMdf',{purchasePrice:Number(v.frameMdf?.materialPrice||4783),conversionQty:Number(v.frameMdf?.partsPerMaterial||56),norm:Number(v.frameMdf?.partsPerDoor||3)});
  patch('ribs',{purchasePrice:Number(v.ribs?.sheetPrice||1354),conversionQty:Number(v.ribs?.ribsPerSheet||103)});
  patch('pva',{purchasePrice:Number(v.pva?.packPrice||9100),conversionQty:Number(v.pva?.packKg||30),norm:Number(v.pva?.kgPerDoor||0.3)});
  patch('pvc',{purchasePrice:Number(v.pvc?.priceM2||165),norm:Number(v.pvc?.m2PerDoor||14)});
  patch('vacuumGlue',{purchasePrice:Number(v.vacuumGlue?.packPrice||26450),conversionQty:Number(v.vacuumGlue?.packKg||30),norm:Number(v.vacuumGlue?.kgPerDoor||0.2)});
  patch('packFilm',{purchasePrice:Number(v.packagingFilm?.rollPrice||13375),conversionQty:Number(v.packagingFilm?.rollMeters||1051.2),norm:Number(v.packagingFilm?.metersPerDoor||2.5)});
  patch('cardboard',{purchasePrice:Number(v.cardboard?.sheetPrice||94),conversionQty:Number(v.cardboard?.piecesPerSheet||12),norm:Number(v.cardboard?.piecesPerDoor||6)});
  patch('tape',{purchasePrice:Number(v.tape?.rollPrice||100),norm:Number(v.tape?.rollSharePerDoor||0.3)});
  Object.assign(x.overhead,{
    rent:Number(v.overhead?.rent||265000),electricity:Number(v.overhead?.electricity||50000),
    driver:Number(v.overhead?.driver||75000),productionManager:Number(v.overhead?.productionManager||75000),
    shopEmployees:Number(v.overhead?.shopEmployees||450000),normalMonthlyDoors:Number(v.overhead?.monthlyDoors||0)
  });
  return x;
}
const COST36_V93_PACKAGING_MIGRATION='hd_v93_cost36_packaging_migrated';
function cost36ApplyV93Packaging(values){
  const x=cost36Clone(values||cost36DefaultValues());
  const patch=(id,data)=>{const r=(x.resources||[]).find(y=>y.id===id);if(r)Object.assign(r,data)};
  patch('packFilm',{name:'ПЭ рукав упаковки полотна',purchaseUnit:'рулон 100 м',purchasePrice:4173.75,writeoffUnit:'м',conversionQty:100,normMode:'pack-film-height',norm:0,wastePct:0,sourceNote:'ПЭ рукав (1500×2)×0,08, 100 п.м.; норма = высота полотна + 300 мм'});
  patch('cardboard',{name:'Картон упаковочный',purchaseUnit:'лист 1050×2000',purchasePrice:94,writeoffUnit:'полоса 160×1000',conversionQty:12,normMode:'fixed',norm:6,wastePct:0,sourceNote:'12 полос из листа; 6 полос на полотно'});
  patch('tape',{name:'Скотч упаковки полотна',purchaseUnit:'рулон 150 м',purchasePrice:100,writeoffUnit:'м',conversionQty:150,normMode:'pack-tape-wrap',norm:0,wastePct:0,sourceNote:'5 полных витков вокруг полотна с картоном'});
  return x;
}
function cost36State(){
  const saved=typeof getStore==='function'?getStore(COST36_STORE,null):null;
  const migrated=typeof getStore==='function'?getStore(COST36_V93_PACKAGING_MIGRATION,false):false;
  if(saved?.values){
    if(migrated)return {values:saved.values,manualOverride:true,updatedAt:saved.updatedAt||''};
    const values=cost36ApplyV93Packaging(saved.values);
    if(typeof setStore==='function'){setStore(COST36_STORE,{...saved,values});setStore(COST36_V93_PACKAGING_MIGRATION,true)}
    return {values,manualOverride:true,updatedAt:saved.updatedAt||''};
  }
  const legacy=cost36LegacyValues();
  const values=cost36ApplyV93Packaging(legacy||cost36DefaultValues());
  if(typeof setStore==='function')setStore(COST36_V93_PACKAGING_MIGRATION,true);
  return {values,manualOverride:!!legacy,updatedAt:'',migratedLegacy:!!legacy};
}
function cost36Num(id,fallback=0){
  const el=typeof $==='function'?$(id):null;
  if(!el)return Number(fallback)||0;
  const n=Number(el.value);
  return Number.isFinite(n)?n:Number(fallback)||0;
}
function cost36Text(id,fallback=''){
  const el=typeof $==='function'?$(id):null;
  return el?String(el.value||''):String(fallback||'');
}
function cost36Actual(id){
  const el=typeof $==='function'?$(id):null;
  if(!el||String(el.value).trim()==='')return '';
  const n=Number(el.value);return Number.isFinite(n)&&n>=0?n:'';
}
function cost36Money(v){
  const n=Number(v||0);return new Intl.NumberFormat('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n)+' ₽';
}
function cost36Plain(v,d=3){
  const n=Number(v);return Number.isFinite(n)?new Intl.NumberFormat('ru-RU',{maximumFractionDigits:d}).format(n):'0';
}
function cost36RibGeometry(values){
  const g=values.geometry,inner=Math.max(0,Number(g.width)-2*Number(g.sideFrameWidth));
  const pitch=Math.max(0,Number(g.ribWidth)+Number(g.ribGap));
  const count=pitch>0?Math.max(0,Math.floor((inner+Number(g.ribGap))/pitch)):0;
  const occupied=count>0?count*Number(g.ribWidth)+(count-1)*Number(g.ribGap):0;
  const residual=Math.max(0,inner-occupied);
  return {inner,pitch,count,occupied,residual,edge:residual/2};
}
function cost36NormForResource(resource,values,rib){
  if(resource.normMode==='ribs')return rib.count;
  if(resource.normMode==='face-mdf')return Number(values.geometry.faceMdfDoorsPerSheet)>0?1/Number(values.geometry.faceMdfDoorsPerSheet):0;
  if(resource.normMode==='pack-film-height')return (Number(values.geometry.height||0)+HD93_PACKAGING.sleeve.allowanceMm)/1000;
  if(resource.normMode==='pack-tape-wrap')return hd93packagingCalc({system:'36',height:values.geometry.height,width:values.geometry.width,thickness:36,aluminumFrame:false}).rows.leafTape.qty;
  return Number(resource.norm||0);
}
function cost36ResourceCalc(resource,values,rib){
  const purchasePrice=Math.max(0,Number(resource.purchasePrice||0));
  const conversionQty=Math.max(0,Number(resource.conversionQty||0));
  const unitPrice=conversionQty>0?purchasePrice/conversionQty:0;
  const norm=Math.max(0,cost36NormForResource(resource,values,rib));
  const wastePct=Math.max(0,Number(resource.wastePct||0));
  const writeoffNorm=norm*(1+wastePct/100);
  const normativeCost=writeoffNorm*unitPrice;
  const actualRaw=resource.actualQty;
  const hasActual=actualRaw!==''&&actualRaw!==null&&actualRaw!==undefined&&Number.isFinite(Number(actualRaw));
  const actualQty=hasActual?Math.max(0,Number(actualRaw)):null;
  const actualCost=hasActual?actualQty*unitPrice:null;
  return {...resource,purchasePrice,conversionQty,unitPrice,norm,wastePct,writeoffNorm,normativeCost,hasActual,actualQty,actualCost,deviation:hasActual?actualCost-normativeCost:null};
}
function cost36FormValues(){
  const base=cost36State().values;
  const values=cost36Clone(base);
  values.geometry={
    width:cost36Num('cost36Width',base.geometry.width),
    height:cost36Num('cost36Height',base.geometry.height),
    sideFrameWidth:cost36Num('cost36SideFrameWidth',base.geometry.sideFrameWidth),
    ribWidth:cost36Num('cost36RibWidth',base.geometry.ribWidth),
    ribGap:cost36Num('cost36RibGap',base.geometry.ribGap),
    faceMdfDoorsPerSheet:cost36Num('cost36FaceYield',base.geometry.faceMdfDoorsPerSheet)
  };
  values.resources=(base.resources||[]).map((r,i)=>({
    ...r,
    purchaseUnit:cost36Text('cost36PurchaseUnit_'+i,r.purchaseUnit),
    purchasePrice:cost36Num('cost36PurchasePrice_'+i,r.purchasePrice),
    writeoffUnit:cost36Text('cost36WriteoffUnit_'+i,r.writeoffUnit),
    conversionQty:cost36Num('cost36Conversion_'+i,r.conversionQty),
    norm:r.normMode==='fixed'?cost36Num('cost36Norm_'+i,r.norm):Number(r.norm||0),
    wastePct:cost36Num('cost36Waste_'+i,r.wastePct),
    actualQty:cost36Actual('cost36Actual_'+i)
  }));
  values.operations={
    piecework:cost36Num('cost36Piecework',base.operations?.piecework||0),
    external:cost36Num('cost36External',base.operations?.external||0)
  };
  values.overhead={
    rent:cost36Num('cost36OverheadRent',base.overhead.rent),
    electricity:cost36Num('cost36OverheadElectricity',base.overhead.electricity),
    driver:cost36Num('cost36OverheadDriver',base.overhead.driver),
    productionManager:cost36Num('cost36OverheadManager',base.overhead.productionManager),
    shopEmployees:cost36Num('cost36OverheadEmployees',base.overhead.shopEmployees),
    normalMonthlyDoors:cost36Num('cost36NormalMonthlyDoors',base.overhead.normalMonthlyDoors),
    actualMonthlyDoors:cost36Num('cost36ActualMonthlyDoors',base.overhead.actualMonthlyDoors)
  };
  return values;
}
function calculateCost36(values){
  const rib=cost36RibGeometry(values);
  const rows=values.resources.map(r=>cost36ResourceCalc(r,values,rib));
  const sums={materials:0,components:0,consumables:0,packaging:0};
  rows.forEach(r=>{if(sums[r.group]!==undefined)sums[r.group]+=r.normativeCost});
  const operations=Number(values.operations.piecework||0)+Number(values.operations.external||0);
  const direct=sums.materials+sums.components+sums.consumables+sums.packaging+operations;
  const overheadMonth=['rent','electricity','driver','productionManager','shopEmployees'].reduce((s,k)=>s+Number(values.overhead[k]||0),0);
  const normalDoors=Number(values.overhead.normalMonthlyDoors||0);
  const actualDoors=Number(values.overhead.actualMonthlyDoors||0);
  const normativeOverhead=normalDoors>0?overheadMonth/normalDoors:null;
  const fullNormative=normativeOverhead===null?null:direct+normativeOverhead;
  const actualRows=rows.filter(r=>r.hasActual);
  const allActual=rows.length>0&&actualRows.length===rows.length;
  const actualResources=allActual?rows.reduce((s,r)=>s+Number(r.actualCost||0),0):null;
  const actualDirect=allActual?actualResources+operations:null;
  const actualOverhead=actualDoors>0?overheadMonth/actualDoors:null;
  const fullActual=actualDirect!==null&&actualOverhead!==null?actualDirect+actualOverhead:null;
  const deviation=fullActual!==null&&fullNormative!==null?fullActual-fullNormative:null;
  return {rib,rows,sums,operations,direct,overheadMonth,normativeOverhead,fullNormative,actualRowsCount:actualRows.length,allActual,actualDirect,actualOverhead,fullActual,deviation};
}
function cost36GroupLabel(id){return COST36_GROUP_META[id]?.label||id}
function cost36ResourceRow(resource,index,values,calc){
  const auto=resource.normMode!=='fixed';
  const normHelp=resource.normMode==='ribs'?'авто по геометрии':resource.normMode==='face-mdf'?'1 / выход дверей с листа':'норма на дверь';
  return '<tr>'+
    '<td><span class="cost36-group '+escapeHtml(resource.group)+'">'+escapeHtml(cost36GroupLabel(resource.group))+'</span></td>'+
    '<td><b>'+escapeHtml(resource.name)+'</b><div class="mini">'+escapeHtml(normHelp)+'</div></td>'+
    '<td><div class="cost36-inline-edit"><input id="cost36PurchaseUnit_'+index+'" value="'+escapeHtml(resource.purchaseUnit)+'" oninput="renderCost36Preview()"><input id="cost36PurchasePrice_'+index+'" type="number" min="0" step="0.01" value="'+escapeHtml(String(resource.purchasePrice))+'" oninput="renderCost36Preview()"><span>₽</span></div></td>'+
    '<td><div class="cost36-inline-edit"><input id="cost36WriteoffUnit_'+index+'" value="'+escapeHtml(resource.writeoffUnit)+'" oninput="renderCost36Preview()"><input id="cost36Conversion_'+index+'" type="number" min="0.0001" step="0.0001" value="'+escapeHtml(String(resource.conversionQty))+'" oninput="renderCost36Preview()"></div><div class="mini">1 '+escapeHtml(resource.purchaseUnit)+' = '+cost36Plain(resource.conversionQty)+' '+escapeHtml(resource.writeoffUnit)+'</div></td>'+
    '<td><b>'+cost36Money(calc.unitPrice)+'</b><div class="mini">за 1 '+escapeHtml(resource.writeoffUnit)+'</div></td>'+
    '<td><div class="cost36-inline-number"><input id="cost36Norm_'+index+'" type="number" min="0" step="0.001" value="'+escapeHtml(String(calc.norm))+'" '+(auto?'disabled':'')+' oninput="renderCost36Preview()"><span>'+escapeHtml(resource.writeoffUnit)+'</span></div></td>'+
    '<td><div class="cost36-inline-number"><input id="cost36Waste_'+index+'" type="number" min="0" step="0.1" value="'+escapeHtml(String(resource.wastePct||0))+'" oninput="renderCost36Preview()"><span>%</span></div></td>'+
    '<td><b>'+cost36Plain(calc.writeoffNorm)+'</b> '+escapeHtml(resource.writeoffUnit)+'</td>'+
    '<td><b>'+cost36Money(calc.normativeCost)+'</b></td>'+
    '<td><div class="cost36-inline-number"><input id="cost36Actual_'+index+'" type="number" min="0" step="0.001" value="'+(resource.actualQty===''?'':escapeHtml(String(resource.actualQty)))+'" placeholder="—" oninput="renderCost36Preview()"><span>'+escapeHtml(resource.writeoffUnit)+'</span></div></td>'+
    '<td class="cost36-deviation" data-dev="'+index+'">'+(calc.hasActual?cost36Money(calc.deviation):'—')+'</td>'+
  '</tr>';
}
function saveCost36AdminRules(){
  const values=cost36FormValues();
  if(values.geometry.width<=0||values.geometry.ribWidth<=0||values.geometry.faceMdfDoorsPerSheet<=0){
    const msg=$('cost36Message');if(msg){msg.className='pricing-admin-message error';msg.textContent='Проверьте геометрию и выход МДФ.'}return;
  }
  setStore(COST36_STORE,{values,updatedAt:new Date().toISOString()});
  renderPricingAdmin();
  const msg=$('cost36Message');if(msg){msg.className='pricing-admin-message success';msg.textContent='Эталонная модель 36 мм сохранена и применяется в этом браузере.'}
}
function resetCost36AdminRules(){
  if(!confirm('Вернуть исходные значения 36 мм из таблицы себестоимости?'))return;
  localStorage.removeItem(COST36_STORE);localStorage.removeItem(COST36_LEGACY_STORE);renderPricingAdmin();
}
function renderCost36Preview(){
  const values=cost36FormValues(),c=calculateCost36(values);
  const set=(id,val)=>{const el=$(id);if(el)el.innerHTML=val};
  set('cost36MaterialsTotal',cost36Money(c.sums.materials));
  set('cost36ConsumablesTotal',cost36Money(c.sums.consumables));
  set('cost36PackagingTotal',cost36Money(c.sums.packaging));
  set('cost36DirectTotal',cost36Money(c.direct));
  set('cost36NormOverhead',c.normativeOverhead===null?'Задайте нормальный выпуск':cost36Money(c.normativeOverhead));
  set('cost36FullNorm',c.fullNormative===null?'—':cost36Money(c.fullNormative));
  set('cost36ActualProgress',c.actualRowsCount+' / '+c.rows.length+' ресурсов');
  set('cost36FullActual',c.fullActual===null?'Не заполнен':cost36Money(c.fullActual));
  set('cost36Deviation',c.deviation===null?'—':(c.deviation>=0?'+':'')+cost36Money(c.deviation));
  set('cost36RibCount',String(c.rib.count));
  set('cost36InnerWidth',cost36Plain(c.rib.inner)+' мм');
  set('cost36RibPitch',cost36Plain(c.rib.pitch)+' мм');
  set('cost36RibEdge',cost36Plain(c.rib.edge)+' мм');
  const formula=$('cost36GeometryFormula');
  if(formula)formula.innerHTML='Рабочая ширина: <b>'+cost36Plain(values.geometry.width)+' − 2 × '+cost36Plain(values.geometry.sideFrameWidth)+' = '+cost36Plain(c.rib.inner)+' мм</b>. Рёбра: <b>'+c.rib.count+' шт.</b>, ширина '+cost36Plain(values.geometry.ribWidth)+' мм, чистый зазор '+cost36Plain(values.geometry.ribGap)+' мм.';
  c.rows.forEach((r,i)=>{
    const row=document.querySelector('[data-cost-row="'+i+'"]');
    if(!row)return;
    const cells=row.querySelectorAll('[data-live]');
    cells.forEach(el=>{
      const key=el.getAttribute('data-live');
      if(key==='unit')el.textContent=cost36Money(r.unitPrice);
      if(key==='norm')el.textContent=cost36Plain(r.norm);
      if(key==='writeoff')el.textContent=cost36Plain(r.writeoffNorm);
      if(key==='cost')el.textContent=cost36Money(r.normativeCost);
      if(key==='dev')el.textContent=r.hasActual?((r.deviation>=0?'+':'')+cost36Money(r.deviation)):'—';
    });
  });
  if(typeof renderCost36CombinedSummary==='function')renderCost36CombinedSummary();
}
function renderCost36LeafAdmin({embedded=false}={}){
  const state=cost36State(),v=state.values,rib=cost36RibGeometry(v),calc=calculateCost36(v);
  const mode=state.manualOverride?'Ручные настройки активны':'Исходные значения таблицы';
  const modeCls=state.manualOverride?'manual':'approved';
  const rows=(v.resources||[]).map((r,i)=>{
    const cr=cost36ResourceCalc(r,v,rib);
    return '<tr data-cost-row="'+i+'">'+
      '<td><span class="cost36-group '+escapeHtml(r.group)+'">'+escapeHtml(cost36GroupLabel(r.group))+'</span></td>'+
      '<td><b>'+escapeHtml(r.name)+'</b><div class="mini">'+(r.normMode==='ribs'?'Норма автоматически по геометрии':r.normMode==='face-mdf'?'Норма = 1 / выход дверей с листа':'Норма на изделие')+'</div></td>'+
      '<td><div class="cost36-inline-edit"><input id="cost36PurchaseUnit_'+i+'" value="'+escapeHtml(r.purchaseUnit)+'"><input id="cost36PurchasePrice_'+i+'" type="number" min="0" step="0.01" value="'+escapeHtml(String(r.purchasePrice))+'" oninput="renderCost36Preview()"><span>₽</span></div></td>'+
      '<td><div class="cost36-inline-edit"><input id="cost36WriteoffUnit_'+i+'" value="'+escapeHtml(r.writeoffUnit)+'"><input id="cost36Conversion_'+i+'" type="number" min="0.0001" step="0.0001" value="'+escapeHtml(String(r.conversionQty))+'" oninput="renderCost36Preview()"></div></td>'+
      '<td><b data-live="unit">'+cost36Money(cr.unitPrice)+'</b></td>'+
      '<td><div class="cost36-inline-number"><input id="cost36Norm_'+i+'" type="number" min="0" step="0.001" value="'+escapeHtml(String(cr.norm))+'" '+(r.normMode!=='fixed'?'disabled':'')+' oninput="renderCost36Preview()"><span>'+escapeHtml(r.writeoffUnit)+'</span></div></td>'+
      '<td><div class="cost36-inline-number"><input id="cost36Waste_'+i+'" type="number" min="0" step="0.1" value="'+escapeHtml(String(r.wastePct||0))+'" oninput="renderCost36Preview()"><span>%</span></div></td>'+
      '<td><b data-live="writeoff">'+cost36Plain(cr.writeoffNorm)+'</b> '+escapeHtml(r.writeoffUnit)+'</td>'+
      '<td><b data-live="cost">'+cost36Money(cr.normativeCost)+'</b></td>'+
      '<td><div class="cost36-inline-number"><input id="cost36Actual_'+i+'" type="number" min="0" step="0.001" value="'+(r.actualQty===''?'':escapeHtml(String(r.actualQty)))+'" placeholder="—" oninput="renderCost36Preview()"><span>'+escapeHtml(r.writeoffUnit)+'</span></div></td>'+
      '<td data-live="dev">'+(cr.hasActual?((cr.deviation>=0?'+':'')+cost36Money(cr.deviation)):'—')+'</td>'+
    '</tr>';
  }).join('');
  const num=(id,label,value,suffix,step='0.01')=>'<label class="cost36-field"><span>'+escapeHtml(label)+'</span><div class="pricing-rule-input-wrap"><input id="'+id+'" type="number" min="0" step="'+step+'" value="'+escapeHtml(String(value))+'" oninput="renderCost36Preview()"><em>'+escapeHtml(suffix)+'</em></div></label>';
  const leafHead=embedded
    ?'<div class="pricing-section-head cost36-combined-subhead"><div><div class="pricing-section-title">Полотно 36 мм</div><div class="mini">Каркасно-щитовая конструкция · материалы, расходники, упаковка, работы и накладные.</div></div><span class="pricing-section-badge">Полотно</span></div>'
    :pricingAdminSectionHeader('Себестоимость · 36 мм ПВХ','Эталонная схема: закупка → списание → норма → технологический отход → норматив → факт → отклонение.','v98 · комплект');
  return leafHead+
    '<div class="cost36-kpi-grid">'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Материалы</div><div id="cost36MaterialsTotal" class="pricing-admin-big">'+cost36Money(calc.sums.materials)+'</div></div>'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Расходники</div><div id="cost36ConsumablesTotal" class="pricing-admin-big">'+cost36Money(calc.sums.consumables)+'</div></div>'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Упаковка</div><div id="cost36PackagingTotal" class="pricing-admin-big">'+cost36Money(calc.sums.packaging)+'</div></div>'+
      '<div class="pricing-admin-card primary"><div class="pricing-admin-kicker">Прямая нормативная</div><div id="cost36DirectTotal" class="pricing-admin-big">'+cost36Money(calc.direct)+'</div><div class="mini">Материалы + расходники + упаковка + работы</div></div>'+
    '</div>'+
    '<div class="cost36-kpi-grid second">'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Накладные / дверь</div><div id="cost36NormOverhead" class="pricing-admin-big">'+(calc.normativeOverhead===null?'—':cost36Money(calc.normativeOverhead))+'</div><div class="mini">По нормальному выпуску</div></div>'+
      '<div class="pricing-admin-card primary"><div class="pricing-admin-kicker">Полная нормативная</div><div id="cost36FullNorm" class="pricing-admin-big">'+(calc.fullNormative===null?'—':cost36Money(calc.fullNormative))+'</div></div>'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Фактическая полная</div><div id="cost36FullActual" class="pricing-admin-big">'+(calc.fullActual===null?'Не заполнен':cost36Money(calc.fullActual))+'</div><div id="cost36ActualProgress" class="mini">'+calc.actualRowsCount+' / '+calc.rows.length+' ресурсов</div></div>'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Отклонение факт − норма</div><div id="cost36Deviation" class="pricing-admin-big">'+(calc.deviation===null?'—':(calc.deviation>=0?'+':'')+cost36Money(calc.deviation))+'</div></div>'+
    '</div>'+
    '<div class="section pricing-rule-editor">'+
      '<div class="pricing-rule-editor-head"><div><div class="section-title">1. Геометрия и нормативы изделия</div><div class="mini">Геометрия управляет автоматическими нормами. Здесь не храним «12 рёбер» константой — получаем их из конструкции.</div></div><span class="pricing-rule-mode '+modeCls+'">'+escapeHtml(mode)+'</span></div>'+
      '<div class="cost36-geometry"><div><div class="cost36-fields">'+
        num('cost36Width','Ширина полотна',v.geometry.width,'мм','10')+
        num('cost36Height','Высота полотна',v.geometry.height,'мм','10')+
        num('cost36SideFrameWidth','Боковой каркас',v.geometry.sideFrameWidth,'мм','1')+
        num('cost36RibWidth','Ширина ребра',v.geometry.ribWidth,'мм','1')+
        num('cost36RibGap','Чистый зазор',v.geometry.ribGap,'мм','1')+
        num('cost36FaceYield','Выход дверей с листа МДФ 6',v.geometry.faceMdfDoorsPerSheet,'двери','0.1')+
      '</div></div><div class="cost36-rib-card"><div class="pricing-rule-block-title">Автоматический конструктив</div><div class="cost36-rib-number"><b id="cost36RibCount">'+rib.count+'</b><span>рёбер жёсткости</span></div><div class="cost36-rib-metrics"><span>Внутри <b id="cost36InnerWidth">'+cost36Plain(rib.inner)+' мм</b></span><span>Шаг <b id="cost36RibPitch">'+cost36Plain(rib.pitch)+' мм</b></span><span>Край <b id="cost36RibEdge">'+cost36Plain(rib.edge)+' мм</b></span></div><div id="cost36GeometryFormula" class="mini cost36-geometry-formula"></div></div></div>'+
      '<div class="section-title cost36-subtitle">2. Ресурсы и правила списания</div>'+
      '<div class="cost36-reference-note"><b>Правило:</b> цена единицы списания = цена закупки ÷ количество единиц списания в закупочной единице. Норматив к списанию = норма × (1 + технологический отход %). Брак и переделка сюда не включаются — они должны идти отдельным фактическим отклонением.</div>'+
      '<div class="table-wrap"><table class="cost36-reference-table"><thead><tr><th>Группа</th><th>Ресурс</th><th>Закупка</th><th>Списание / конверсия</th><th>Цена ед.</th><th>Норма</th><th>Тех. отход</th><th>К списанию</th><th>Норм. стоимость</th><th>Факт</th><th>Отклонение</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
      '<div class="section-title cost36-subtitle">3. Работы</div><div class="cost36-material-grid"><div class="pricing-rule-block"><div class="cost36-fields two">'+
        num('cost36Piecework','Сдельные операции / дверь',v.operations?.piecework||0,'₽','1')+
        num('cost36External','Внешние работы / дверь',v.operations?.external||0,'₽','1')+
      '</div><div class="mini">Работы входят в прямую себестоимость. Когда появится пооперационный учёт, эти две строки можно заменить маршрутной картой.</div></div></div>'+
      '<div class="section-title cost36-subtitle">4. Производственные накладные</div>'+
      '<div class="cost36-overhead-wrap"><div class="pricing-rule-block"><div class="cost36-fields">'+
        num('cost36OverheadRent','Аренда / месяц',v.overhead.rent,'₽','1000')+
        num('cost36OverheadElectricity','Электричество / месяц',v.overhead.electricity,'₽','1000')+
        num('cost36OverheadDriver','Водитель / месяц',v.overhead.driver,'₽','1000')+
        num('cost36OverheadManager','Начальник производства / месяц',v.overhead.productionManager,'₽','1000')+
        num('cost36OverheadEmployees','Сотрудники цеха / месяц',v.overhead.shopEmployees,'₽','1000')+
        num('cost36NormalMonthlyDoors','Нормальный выпуск / месяц',v.overhead.normalMonthlyDoors,'дверей','1')+
        num('cost36ActualMonthlyDoors','Фактический выпуск / месяц',v.overhead.actualMonthlyDoors,'дверей','1')+
      '</div></div><div class="cost36-overhead-summary"><b>Почему два выпуска?</b><p><b>Нормальная мощность</b> используется для нормативной себестоимости и цены. <b>Фактический выпуск</b> — только для анализа периода. Так падение выпуска не искажает нормативную цену изделия.</p></div></div>'+
      '<div class="pricing-rule-actions"><button class="primary" onclick="saveCost36AdminRules()">Сохранить и применить</button><button class="secondary" onclick="resetCost36AdminRules()">Вернуть исходные значения</button><div id="cost36Message" class="pricing-admin-message"></div></div>'+
    '</div>';
}


// v86: 36 mm purchased box + in-house PVC lamination as a separate cost object.
const COST36_PRODUCT_STORE='hd_v86_cost36_product';
const COST36_BOX_STORE='hd_v86_cost36_box';

const COST36_BOX_DEFAULTS=Object.freeze({
  geometry:Object.freeze({
    sticksPerKit:3,
    stickLengthMm:2070,
    filmWrapWidthMm:0
  }),
  resources:Object.freeze([
    Object.freeze({id:'boxBlank',group:'components',name:'Заготовка короба 36 мм',purchaseUnit:'палка',purchasePrice:310,writeoffUnit:'палка',conversionQty:1,normMode:'fixed',norm:3,wastePct:0,actualQty:'',sourceNote:'Таблица: 275 ₽ палка + 35 ₽ доставка = 310 ₽'}),
    Object.freeze({id:'boxPvc',group:'materials',name:'ПВХ-плёнка для ламинации короба',purchaseUnit:'м²',purchasePrice:165,writeoffUnit:'м²',conversionQty:1,normMode:'box-film',norm:0,wastePct:0,actualQty:'',sourceNote:'Цена м² взята из того же листа 36 мм; норма считается по геометрии'}),
    Object.freeze({id:'seal',group:'components',name:'Уплотнительная резинка',purchaseUnit:'бухта',purchasePrice:3560,writeoffUnit:'м',conversionQty:250,normMode:'fixed',norm:6.2,wastePct:0,actualQty:'',sourceNote:'Таблица: 2 560 ₽ за 250 м + 1 000 ₽ доставка'}),
    Object.freeze({id:'boxCardboard',group:'packaging',name:'Картон упаковки короба',purchaseUnit:'лист 1050×2000',purchasePrice:94,writeoffUnit:'полоса 160×1000',conversionQty:12,normMode:'fixed',norm:2,wastePct:0,actualQty:'',sourceNote:'12 полос из листа; 2 полосы на короб'}),
    Object.freeze({id:'boxStretch',group:'packaging',name:'Стрейч упаковки короба',purchaseUnit:'рулон 2 кг ≈ 190 м',purchasePrice:550,writeoffUnit:'м',conversionQty:190,normMode:'fixed',norm:5,wastePct:0,actualQty:'',sourceNote:'500 мм × 23 мкм, 2 кг; 5 м на короб. 190 м — рабочая конверсия, в счёте метраж не указан'}),
    Object.freeze({id:'boxTape',group:'packaging',name:'Скотч упаковки короба',purchaseUnit:'рулон 150 м',purchasePrice:100,writeoffUnit:'м',conversionQty:150,normMode:'fixed',norm:6,wastePct:0,actualQty:'',sourceNote:'3 точки фиксации по 5 витков; рабочая норма 6 м на короб'})
  ]),
  operations:Object.freeze({lamination:0,other:0})
});

function cost36ActiveProduct(){
  const id=typeof getStore==='function'?getStore(COST36_PRODUCT_STORE,'leaf'):'leaf';
  return id==='box'?'box':'leaf';
}
function setCost36Product(id){
  if(typeof setStore==='function')setStore(COST36_PRODUCT_STORE,id==='box'?'box':'leaf');
  renderPricingAdmin();
}
function cost36ProductNavHtml(){
  const active=cost36ActiveProduct();
  return '<div class="cost36-product-nav">'+
    '<button class="'+(active==='leaf'?'active':'')+'" onclick="setCost36Product(\'leaf\')"><b>Полотно 36</b><span>Каркасно-щитовая конструкция</span></button>'+
    '<button class="'+(active==='box'?'active':'')+'" onclick="setCost36Product(\'box\')"><b>Короб 36</b><span>Покупная заготовка + ламинация ПВХ</span></button>'+
  '</div>';
}
function cost36BoxDefaultValues(){return cost36Clone(COST36_BOX_DEFAULTS)}
const COST36_BOX_V93_PACKAGING_MIGRATION='hd_v93_cost36_box_packaging_migrated';
function cost36BoxApplyV93Packaging(values){
  const x=cost36Clone(values||cost36BoxDefaultValues());
  const upsert=(id,data)=>{
    let r=(x.resources||[]).find(y=>y.id===id);
    if(r)Object.assign(r,data);
    else x.resources.push({id,group:'packaging',wastePct:0,actualQty:'',normMode:'fixed',...data});
  };
  upsert('boxCardboard',{name:'Картон упаковки короба',purchaseUnit:'лист 1050×2000',purchasePrice:94,writeoffUnit:'полоса 160×1000',conversionQty:12,norm:2,sourceNote:'12 полос из листа; 2 полосы на короб'});
  upsert('boxStretch',{name:'Стрейч упаковки короба',purchaseUnit:'рулон 2 кг ≈ 190 м',purchasePrice:550,writeoffUnit:'м',conversionQty:190,norm:5,sourceNote:'500 мм × 23 мкм, 2 кг; 5 м на короб. 190 м — рабочая конверсия, в счёте метраж не указан'});
  upsert('boxTape',{name:'Скотч упаковки короба',purchaseUnit:'рулон 150 м',purchasePrice:100,writeoffUnit:'м',conversionQty:150,norm:6,sourceNote:'3 точки фиксации по 5 витков; рабочая норма 6 м на короб'});
  return x;
}
function cost36BoxState(){
  const saved=typeof getStore==='function'?getStore(COST36_BOX_STORE,null):null;
  const migrated=typeof getStore==='function'?getStore(COST36_BOX_V93_PACKAGING_MIGRATION,false):false;
  if(saved?.values){
    if(migrated)return {values:saved.values,manualOverride:true,updatedAt:saved.updatedAt||''};
    const values=cost36BoxApplyV93Packaging(saved.values);
    if(typeof setStore==='function'){setStore(COST36_BOX_STORE,{...saved,values});setStore(COST36_BOX_V93_PACKAGING_MIGRATION,true)}
    return {values,manualOverride:true,updatedAt:saved.updatedAt||''};
  }
  if(typeof setStore==='function')setStore(COST36_BOX_V93_PACKAGING_MIGRATION,true);
  return {values:cost36BoxApplyV93Packaging(cost36BoxDefaultValues()),manualOverride:false,updatedAt:''};
}
function cost36BoxFilmNorm(values){
  const g=values.geometry||{};
  const sticks=Math.max(0,Number(g.sticksPerKit||0));
  const length=Math.max(0,Number(g.stickLengthMm||0));
  const width=Math.max(0,Number(g.filmWrapWidthMm||0));
  return sticks*length*width/1000000;
}
function cost36BoxNormForResource(resource,values){
  if(resource.normMode==='box-film')return cost36BoxFilmNorm(values);
  return Math.max(0,Number(resource.norm||0));
}
function cost36BoxResourceCalc(resource,values){
  const purchasePrice=Math.max(0,Number(resource.purchasePrice||0));
  const conversionQty=Math.max(0,Number(resource.conversionQty||0));
  const unitPrice=conversionQty>0?purchasePrice/conversionQty:0;
  const norm=cost36BoxNormForResource(resource,values);
  const wastePct=Math.max(0,Number(resource.wastePct||0));
  const writeoffNorm=norm*(1+wastePct/100);
  const normativeCost=unitPrice*writeoffNorm;
  const hasActual=resource.actualQty!==''&&resource.actualQty!==null&&resource.actualQty!==undefined&&Number.isFinite(Number(resource.actualQty));
  const actualQty=hasActual?Math.max(0,Number(resource.actualQty)):null;
  const actualCost=hasActual?actualQty*unitPrice:null;
  return {...resource,purchasePrice,conversionQty,unitPrice,norm,wastePct,writeoffNorm,normativeCost,hasActual,actualQty,actualCost,deviation:hasActual?actualCost-normativeCost:null};
}
function cost36BoxFormValues(){
  const base=cost36BoxState().values;
  const values=cost36Clone(base);
  values.geometry={
    sticksPerKit:cost36Num('cost36BoxSticks',base.geometry.sticksPerKit),
    stickLengthMm:cost36Num('cost36BoxLength',base.geometry.stickLengthMm),
    filmWrapWidthMm:cost36Num('cost36BoxFilmWidth',base.geometry.filmWrapWidthMm)
  };
  values.resources=(base.resources||[]).map((r,i)=>({
    ...r,
    purchaseUnit:cost36Text('cost36BoxPurchaseUnit_'+i,r.purchaseUnit),
    purchasePrice:cost36Num('cost36BoxPurchasePrice_'+i,r.purchasePrice),
    writeoffUnit:cost36Text('cost36BoxWriteoffUnit_'+i,r.writeoffUnit),
    conversionQty:cost36Num('cost36BoxConversion_'+i,r.conversionQty),
    norm:r.normMode==='fixed'?cost36Num('cost36BoxNorm_'+i,r.norm):Number(r.norm||0),
    wastePct:cost36Num('cost36BoxWaste_'+i,r.wastePct),
    actualQty:cost36Actual('cost36BoxActual_'+i)
  }));
  values.operations={
    lamination:cost36Num('cost36BoxLamination',base.operations?.lamination||0),
    other:cost36Num('cost36BoxOtherWork',base.operations?.other||0)
  };
  return values;
}
function calculateCost36Box(values){
  const rows=values.resources.map(r=>cost36BoxResourceCalc(r,values));
  const sums={materials:0,components:0,consumables:0,packaging:0};
  rows.forEach(r=>{if(sums[r.group]!==undefined)sums[r.group]+=r.normativeCost});
  const operations=Number(values.operations.lamination||0)+Number(values.operations.other||0);
  const direct=sums.materials+sums.components+sums.consumables+sums.packaging+operations;
  const actualRows=rows.filter(r=>r.hasActual);
  const allActual=rows.length>0&&actualRows.length===rows.length;
  const actualDirect=allActual?rows.reduce((s,r)=>s+Number(r.actualCost||0),0)+operations:null;
  const deviation=actualDirect===null?null:actualDirect-direct;
  const filmConfigured=Number(values.geometry.filmWrapWidthMm||0)>0;
  return {rows,sums,operations,direct,actualRowsCount:actualRows.length,allActual,actualDirect,deviation,filmConfigured,filmNorm:cost36BoxFilmNorm(values)};
}
function saveCost36BoxRules(){
  const values=cost36BoxFormValues();
  setStore(COST36_BOX_STORE,{values,updatedAt:new Date().toISOString()});
  renderPricingAdmin();
  const msg=$('cost36BoxMessage');if(msg){msg.className='pricing-admin-message success';msg.textContent='Себестоимость короба 36 сохранена.'}
}
function resetCost36BoxRules(){
  if(!confirm('Вернуть исходные значения короба 36 из таблицы?'))return;
  localStorage.removeItem(COST36_BOX_STORE);renderPricingAdmin();
}
function renderCost36BoxPreview(){
  const values=cost36BoxFormValues(),c=calculateCost36Box(values);
  const set=(id,val)=>{const el=$(id);if(el)el.innerHTML=val};
  set('cost36BoxComponents',cost36Money(c.sums.components));
  set('cost36BoxFilmCost',cost36Money(c.sums.materials));
  set('cost36BoxPackaging',cost36Money(c.sums.packaging));
  set('cost36BoxDirect',c.filmConfigured?cost36Money(c.direct):cost36Money(c.direct)+'*');
  set('cost36BoxActual',c.actualDirect===null?'Не заполнен':cost36Money(c.actualDirect));
  set('cost36BoxDeviation',c.deviation===null?'—':(c.deviation>=0?'+':'')+cost36Money(c.deviation));
  set('cost36BoxFilmNorm',c.filmConfigured?cost36Plain(c.filmNorm)+' м²':'Нужно задать ширину развёртки');
  const warn=$('cost36BoxFilmWarning');
  if(warn)warn.classList.toggle('hidden',c.filmConfigured);
  c.rows.forEach((r,i)=>{
    const row=document.querySelector('[data-box-cost-row="'+i+'"]');if(!row)return;
    row.querySelectorAll('[data-live]').forEach(el=>{
      const key=el.getAttribute('data-live');
      if(key==='unit')el.textContent=cost36Money(r.unitPrice);
      if(key==='writeoff')el.textContent=cost36Plain(r.writeoffNorm);
      if(key==='cost')el.textContent=cost36Money(r.normativeCost);
      if(key==='dev')el.textContent=r.hasActual?((r.deviation>=0?'+':'')+cost36Money(r.deviation)):'—';
      if(key==='norm')el.textContent=cost36Plain(r.norm);
    });
  });
  if(typeof renderCost36CombinedSummary==='function')renderCost36CombinedSummary();
}
function renderCost36BoxAdmin({embedded=false}={}){
  const state=cost36BoxState(),v=state.values,c=calculateCost36Box(v);
  const num=(id,label,value,suffix,step='0.01')=>'<label class="cost36-field"><span>'+escapeHtml(label)+'</span><div class="pricing-rule-input-wrap"><input id="'+id+'" type="number" min="0" step="'+step+'" value="'+escapeHtml(String(value))+'" oninput="renderCost36BoxPreview()"><em>'+escapeHtml(suffix)+'</em></div></label>';
  const rows=(v.resources||[]).map((r,i)=>{
    const cr=cost36BoxResourceCalc(r,v);
    return '<tr data-box-cost-row="'+i+'">'+
      '<td><span class="cost36-group '+escapeHtml(r.group)+'">'+escapeHtml(cost36GroupLabel(r.group))+'</span></td>'+
      '<td><b>'+escapeHtml(r.name)+'</b><div class="mini">'+escapeHtml(r.sourceNote||'')+'</div></td>'+
      '<td><div class="cost36-inline-edit"><input id="cost36BoxPurchaseUnit_'+i+'" value="'+escapeHtml(r.purchaseUnit)+'"><input id="cost36BoxPurchasePrice_'+i+'" type="number" min="0" step="0.01" value="'+escapeHtml(String(r.purchasePrice))+'" oninput="renderCost36BoxPreview()"><span>₽</span></div></td>'+
      '<td><div class="cost36-inline-edit"><input id="cost36BoxWriteoffUnit_'+i+'" value="'+escapeHtml(r.writeoffUnit)+'"><input id="cost36BoxConversion_'+i+'" type="number" min="0.0001" step="0.0001" value="'+escapeHtml(String(r.conversionQty))+'" oninput="renderCost36BoxPreview()"></div></td>'+
      '<td><b data-live="unit">'+cost36Money(cr.unitPrice)+'</b></td>'+
      '<td><div class="cost36-inline-number"><input id="cost36BoxNorm_'+i+'" type="number" min="0" step="0.001" value="'+escapeHtml(String(cr.norm))+'" '+(r.normMode!=='fixed'?'disabled':'')+' oninput="renderCost36BoxPreview()"><span>'+escapeHtml(r.writeoffUnit)+'</span></div></td>'+
      '<td><div class="cost36-inline-number"><input id="cost36BoxWaste_'+i+'" type="number" min="0" step="0.1" value="'+escapeHtml(String(r.wastePct||0))+'" oninput="renderCost36BoxPreview()"><span>%</span></div></td>'+
      '<td><b data-live="writeoff">'+cost36Plain(cr.writeoffNorm)+'</b> '+escapeHtml(r.writeoffUnit)+'</td>'+
      '<td><b data-live="cost">'+cost36Money(cr.normativeCost)+'</b></td>'+
      '<td><div class="cost36-inline-number"><input id="cost36BoxActual_'+i+'" type="number" min="0" step="0.001" value="'+(r.actualQty===''?'':escapeHtml(String(r.actualQty)))+'" placeholder="—" oninput="renderCost36BoxPreview()"><span>'+escapeHtml(r.writeoffUnit)+'</span></div></td>'+
      '<td data-live="dev">'+(cr.hasActual?((cr.deviation>=0?'+':'')+cost36Money(cr.deviation)):'—')+'</td>'+
    '</tr>';
  }).join('');
  const boxHead=embedded
    ?'<div class="pricing-section-head cost36-combined-subhead"><div><div class="pricing-section-title">Короб 36 мм</div><div class="mini">Покупные палки короба + ПВХ-ламинация + уплотнитель + упаковка.</div></div><span class="pricing-section-badge">Короб</span></div>'
    :pricingAdminSectionHeader('Себестоимость · короб 36 мм','Покупаем готовые палки короба, сами не производим. В цехе ламинируем ПВХ, добавляем уплотнитель и упаковку.','v98 · в составе комплекта');
  return boxHead+
    '<div class="cost36-kpi-grid">'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Покупные комплектующие</div><div id="cost36BoxComponents" class="pricing-admin-big">'+cost36Money(c.sums.components)+'</div><div class="mini">Короб + уплотнитель</div></div>'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">ПВХ-плёнка</div><div id="cost36BoxFilmCost" class="pricing-admin-big">'+cost36Money(c.sums.materials)+'</div><div id="cost36BoxFilmNorm" class="mini">'+(c.filmConfigured?cost36Plain(c.filmNorm)+' м²':'Нужно задать ширину развёртки')+'</div></div>'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Упаковка</div><div id="cost36BoxPackaging" class="pricing-admin-big">'+cost36Money(c.sums.packaging)+'</div></div>'+
      '<div class="pricing-admin-card primary"><div class="pricing-admin-kicker">Прямая нормативная</div><div id="cost36BoxDirect" class="pricing-admin-big">'+cost36Money(c.direct)+(c.filmConfigured?'':'*')+'</div><div class="mini">'+(c.filmConfigured?'Короб + ламинация + упаковка':'* Пока без декоративной ПВХ-плёнки')+'</div></div>'+
    '</div>'+
    '<div class="cost36-kpi-grid second">'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Фактическая прямая</div><div id="cost36BoxActual" class="pricing-admin-big">'+(c.actualDirect===null?'Не заполнен':cost36Money(c.actualDirect))+'</div></div>'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Отклонение факт − норма</div><div id="cost36BoxDeviation" class="pricing-admin-big">'+(c.deviation===null?'—':(c.deviation>=0?'+':'')+cost36Money(c.deviation))+'</div></div>'+
    '</div>'+
    '<div class="section pricing-rule-editor">'+
      '<div class="pricing-rule-editor-head"><div><div class="section-title">1. Геометрия комплекта и ламинации</div><div class="mini">Три готовые палки закупаем. ПВХ считается по фактической площади развёртки, а не фиксированной доплатой.</div></div><span class="pricing-rule-mode '+(state.manualOverride?'manual':'approved')+'">'+(state.manualOverride?'Ручные настройки активны':'Исходные значения таблицы')+'</span></div>'+
      '<div class="cost36-fields">'+
        num('cost36BoxSticks','Палок короба в комплекте',v.geometry.sticksPerKit,'шт.','1')+
        num('cost36BoxLength','Длина одной палки',v.geometry.stickLengthMm,'мм','1')+
        num('cost36BoxFilmWidth','Ширина развёртки ПВХ на палку',v.geometry.filmWrapWidthMm,'мм','1')+
      '</div>'+
      '<div id="cost36BoxFilmWarning" class="cost36-source-warning '+(c.filmConfigured?'hidden':'')+'"><b>Открытый параметр:</b> в исходной таблице нет ширины развёртки декоративной ПВХ-плёнки. Формула уже готова: 3 × длина палки × ширина развёртки. Нужно только один раз зафиксировать фактическую ширину раскроя плёнки.</div>'+
      '<div class="section-title cost36-subtitle">2. Ресурсы и списание</div>'+
      '<div class="table-wrap"><table class="cost36-reference-table"><thead><tr><th>Группа</th><th>Ресурс</th><th>Закупка</th><th>Списание / конверсия</th><th>Цена ед.</th><th>Норма</th><th>Тех. отход</th><th>К списанию</th><th>Норм. стоимость</th><th>Факт</th><th>Отклонение</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
      '<div class="section-title cost36-subtitle">3. Работы</div><div class="cost36-material-grid"><div class="pricing-rule-block"><div class="cost36-fields two">'+
        num('cost36BoxLamination','Ламинация короба / комплект',v.operations?.lamination||0,'₽','1')+
        num('cost36BoxOtherWork','Прочие работы / комплект',v.operations?.other||0,'₽','1')+
      '</div><div class="mini">Работа ламинации хранится отдельно от материала. Это позволит позже подключить сдельную оплату или норматив времени без изменения материальной части.</div></div></div>'+
      '<div class="pricing-rule-actions"><button class="primary" onclick="saveCost36BoxRules()">Сохранить и применить</button><button class="secondary" onclick="resetCost36BoxRules()">Вернуть исходные значения</button><div id="cost36BoxMessage" class="pricing-admin-message"></div></div>'+
    '</div>';
}
const COST36_CASING_STORE='hd_v98_cost36_casing';
const COST36_CASING_DEFAULTS=Object.freeze({
  size:'8×70×2150',
  purchaseUnit:'шт.',
  purchasePrice:346,
  writeoffUnit:'шт.',
  conversionQty:1,
  norm:5,
  wastePct:0,
  actualQty:''
});
function cost36CasingState(){
  const saved=typeof getStore==='function'?getStore(COST36_CASING_STORE,null):null;
  return {values:{...COST36_CASING_DEFAULTS,...(saved?.values||{})},manualOverride:!!saved,updatedAt:saved?.updatedAt||''};
}
function cost36CasingFormValues(){
  const base=cost36CasingState().values;
  return {
    ...base,
    purchasePrice:cost36Num('cost36CasingPurchasePrice',base.purchasePrice),
    conversionQty:cost36Num('cost36CasingConversion',base.conversionQty),
    norm:cost36Num('cost36CasingNorm',base.norm),
    wastePct:cost36Num('cost36CasingWaste',base.wastePct),
    actualQty:cost36Actual('cost36CasingActual')
  };
}
function calculateCost36Casing(values){
  const purchasePrice=Math.max(0,Number(values.purchasePrice||0));
  const conversionQty=Math.max(.000001,Number(values.conversionQty||1));
  const unitPrice=purchasePrice/conversionQty;
  const norm=Math.max(0,Number(values.norm||0));
  const wastePct=Math.max(0,Number(values.wastePct||0));
  const writeoffNorm=norm*(1+wastePct/100);
  const normativeCost=unitPrice*writeoffNorm;
  const hasActual=values.actualQty!==''&&values.actualQty!==null&&values.actualQty!==undefined&&Number.isFinite(Number(values.actualQty));
  const actualQty=hasActual?Math.max(0,Number(values.actualQty)):null;
  const actualCost=hasActual?actualQty*unitPrice:null;
  return {purchasePrice,conversionQty,unitPrice,norm,wastePct,writeoffNorm,normativeCost,hasActual,actualQty,actualCost,deviation:hasActual?actualCost-normativeCost:null};
}
function saveCost36CasingRules(){
  const values=cost36CasingFormValues();
  setStore(COST36_CASING_STORE,{values,updatedAt:new Date().toISOString()});
  renderPricingAdmin();
  const msg=$('cost36CasingMessage');if(msg){msg.className='pricing-admin-message success';msg.textContent='Данные наличника 36 сохранены.'}
}
function resetCost36CasingRules(){
  if(!confirm('Вернуть исходные данные наличника 36?'))return;
  localStorage.removeItem(COST36_CASING_STORE);
  renderPricingAdmin();
}
function renderCost36CasingPreview(){
  const c=calculateCost36Casing(cost36CasingFormValues());
  const set=(id,val)=>{const el=$(id);if(el)el.innerHTML=val};
  set('cost36CasingCardUnit',cost36Money(c.unitPrice));
  set('cost36CasingTableUnit',cost36Money(c.unitPrice));
  set('cost36CasingWriteoff',cost36Plain(c.writeoffNorm)+' шт.');
  set('cost36CasingTableCost',cost36Money(c.normativeCost));
  set('cost36CasingCardCost',cost36Money(c.normativeCost));
  set('cost36CasingTableDev',c.deviation===null?'—':(c.deviation>=0?'+':'')+cost36Money(c.deviation));
  set('cost36CasingCardDev',c.deviation===null?'—':(c.deviation>=0?'+':'')+cost36Money(c.deviation));
  if(typeof renderCost36CombinedSummary==='function')renderCost36CombinedSummary();
}
function renderCost36CasingAdmin(){
  const state=cost36CasingState(),v=state.values,c=calculateCost36Casing(v);
  return '<div class="pricing-section-head cost36-combined-subhead"><div><div class="pricing-section-title">Наличник 36 мм</div><div class="mini">Телескопический наличник '+escapeHtml(v.size)+' · в комплекте двери 5 шт.</div></div><span class="pricing-section-badge">Наличник</span></div>'+
    '<div class="cost36-kpi-grid">'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Цена / шт.</div><div id="cost36CasingCardUnit" class="pricing-admin-big">'+cost36Money(c.unitPrice)+'</div></div>'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Количество / дверь</div><div class="pricing-admin-big">'+cost36Plain(c.norm)+' шт.</div></div>'+
      '<div class="pricing-admin-card primary"><div class="pricing-admin-kicker">Нормативная стоимость</div><div id="cost36CasingCardCost" class="pricing-admin-big">'+cost36Money(c.normativeCost)+'</div><div class="mini">5 наличников на комплект двери</div></div>'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Отклонение факт − норма</div><div id="cost36CasingCardDev" class="pricing-admin-big">'+(c.deviation===null?'—':(c.deviation>=0?'+':'')+cost36Money(c.deviation))+'</div></div>'+
    '</div>'+
    '<div class="section pricing-rule-editor"><div class="section-title">Ресурс наличника</div>'+
      '<div class="cost36-reference-note"><b>Зафиксировано:</b> текущий размер каталога '+escapeHtml(v.size)+', ранее согласованная закупочная себестоимость 346 ₽/шт., количество на одну дверь — 5 шт.</div>'+
      '<div class="table-wrap"><table class="cost36-reference-table"><thead><tr><th>Группа</th><th>Ресурс</th><th>Закупка</th><th>Списание / конверсия</th><th>Цена ед.</th><th>Норма</th><th>Тех. отход</th><th>К списанию</th><th>Норм. стоимость</th><th>Факт</th><th>Отклонение</th></tr></thead><tbody>'+
        '<tr><td><span class="cost36-group components">Комплектующие</span></td><td><b>Наличник телескопический 36</b><div class="mini">'+escapeHtml(v.size)+'</div></td>'+
        '<td><div class="cost36-inline-edit"><input value="'+escapeHtml(v.purchaseUnit)+'" disabled><input id="cost36CasingPurchasePrice" type="number" min="0" step="0.01" value="'+escapeHtml(String(v.purchasePrice))+'" oninput="renderCost36CasingPreview()"><span>₽</span></div></td>'+
        '<td><div class="cost36-inline-edit"><input value="'+escapeHtml(v.writeoffUnit)+'" disabled><input id="cost36CasingConversion" type="number" min="0.0001" step="0.0001" value="'+escapeHtml(String(v.conversionQty))+'" oninput="renderCost36CasingPreview()"></div></td>'+
        '<td><b id="cost36CasingTableUnit">'+cost36Money(c.unitPrice)+'</b></td>'+
        '<td><div class="cost36-inline-number"><input id="cost36CasingNorm" type="number" min="0" step="1" value="'+escapeHtml(String(v.norm))+'" oninput="renderCost36CasingPreview()"><span>шт.</span></div></td>'+
        '<td><div class="cost36-inline-number"><input id="cost36CasingWaste" type="number" min="0" step="0.1" value="'+escapeHtml(String(v.wastePct||0))+'" oninput="renderCost36CasingPreview()"><span>%</span></div></td>'+
        '<td><b id="cost36CasingWriteoff">'+cost36Plain(c.writeoffNorm)+' шт.</b></td>'+
        '<td><b id="cost36CasingTableCost">'+cost36Money(c.normativeCost)+'</b></td>'+
        '<td><div class="cost36-inline-number"><input id="cost36CasingActual" type="number" min="0" step="0.001" value="'+(v.actualQty===''?'':escapeHtml(String(v.actualQty)))+'" placeholder="—" oninput="renderCost36CasingPreview()"><span>шт.</span></div></td>'+
        '<td id="cost36CasingTableDev">'+(c.deviation===null?'—':(c.deviation>=0?'+':'')+cost36Money(c.deviation))+'</td></tr>'+
      '</tbody></table></div>'+
      '<div class="pricing-rule-actions"><button class="primary" onclick="saveCost36CasingRules()">Сохранить и применить</button><button class="secondary" onclick="resetCost36CasingRules()">Вернуть исходные значения</button><div id="cost36CasingMessage" class="pricing-admin-message"></div></div>'+
    '</div>';
}
function cost36CombinedCurrent(){
  const leafValues=$('cost36Width')?cost36FormValues():cost36State().values;
  const boxValues=$('cost36BoxSticks')?cost36BoxFormValues():cost36BoxState().values;
  const casingValues=$('cost36CasingPurchasePrice')?cost36CasingFormValues():cost36CasingState().values;
  const leaf=calculateCost36(leafValues);
  const box=calculateCost36Box(boxValues);
  const casing=calculateCost36Casing(casingValues);
  const leafBoxDirect=leaf.direct+box.direct;
  const fullKitDirect=leafBoxDirect+casing.normativeCost;
  return {leaf,box,casing,leafBoxDirect,fullKitDirect,direct:fullKitDirect,incomplete:!box.filmConfigured};
}
function renderCost36CombinedSummary(){
  const c=cost36CombinedCurrent();
  const set=(id,val)=>{const el=$(id);if(el)el.innerHTML=val};
  set('cost36LeafBoxTotal',cost36Money(c.leafBoxDirect)+(c.incomplete?'*':''));
  const note=$('cost36LeafBoxNote');
  if(note)note.innerHTML=c.incomplete
    ?'<b>* Итог «Полотно + короб» пока без декоративной ПВХ-плёнки короба:</b> ширина развёртки ещё не задана.'
    :'Полотно и короб рассчитаны вместе по текущим нормативам.';
}
function cost36SplitEmbeddedBlock(html){
  const marker='<div class="section pricing-rule-editor">';
  const index=String(html||'').indexOf(marker);
  if(index<0)return {dashboard:String(html||''),details:''};
  return {dashboard:html.slice(0,index),details:html.slice(index)};
}
function renderCost36LeafBoxTotal(c){
  return '<div class="cost36-leaf-box-total">'+
    '<div class="pricing-admin-card primary">'+
      '<div class="pricing-admin-kicker">Итоговая себестоимость 36 мм</div>'+
      '<div class="cost36-leaf-box-total-row">'+
        '<div><div class="pricing-admin-title">Полотно + короб</div><div id="cost36LeafBoxNote" class="mini">'+
          (c.incomplete?'<b>* Пока без декоративной ПВХ-плёнки короба:</b> ширина развёртки ещё не задана.':'Полотно и короб рассчитаны вместе по текущим нормативам.')+
        '</div></div>'+
        '<div id="cost36LeafBoxTotal" class="pricing-admin-big">'+cost36Money(c.leafBoxDirect)+(c.incomplete?'*':'')+'</div>'+
      '</div>'+
    '</div>'+
  '</div>';
}
function renderCost36CombinedAdmin(){
  const c=cost36CombinedCurrent();
  const leaf=cost36SplitEmbeddedBlock(renderCost36LeafAdmin({embedded:true}));
  const box=cost36SplitEmbeddedBlock(renderCost36BoxAdmin({embedded:true}));
  return pricingAdminSectionHeader('Себестоимость · дверь 36 мм','Полотно, короб и наличник собраны в одной вкладке. Сначала видны ключевые показатели продукта, ниже — подробные расчёты и настройки.','v99 · единый продукт')+
    '<div class="cost36-dashboard-stack">'+
      '<div class="cost36-dashboard-section cost36-dashboard-leaf">'+leaf.dashboard+'</div>'+
      '<div class="cost36-dashboard-section cost36-dashboard-box">'+box.dashboard+'</div>'+
      renderCost36LeafBoxTotal(c)+
    '</div>'+
    '<div class="cost36-combined-block cost36-leaf-details">'+leaf.details+'</div>'+
    '<div class="cost36-combined-block cost36-box-details">'+box.details+'</div>'+
    '<div class="cost36-combined-block cost36-casing-details">'+renderCost36CasingAdmin()+'</div>';
}
function renderCost36Admin(){
  return renderCost36CombinedAdmin();
}
