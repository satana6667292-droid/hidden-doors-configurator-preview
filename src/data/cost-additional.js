// v88: reference cost models + Production-compatible BOM audit for 42/59 mm.
const COST_ADMIN_MODEL_STORE='hd_v86_cost_admin_model';
const COST_DOBOR_WIDTH_STORE='hd_v86_cost_dobor_width';
const COST_DOBOR_FILM_STORE='hd_v86_cost_dobor_film';

const COST_ADMIN_MODELS=Object.freeze([
  Object.freeze({id:'leaf36',label:'36 · Полотно'}),
  Object.freeze({id:'dobor36',label:'36 · Доборы'}),
  Object.freeze({id:'ply42',label:'42 · Фанера'}),
  Object.freeze({id:'alu42',label:'42 · Алюминий'}),
  Object.freeze({id:'alu59',label:'59 · Алюминий'})
]);

const COST_GENERIC_GROUPS=Object.freeze({
  materials:'Материалы',
  consumables:'Расходники',
  packaging:'Упаковка',
  box:'Короб',
  hardware:'Фурнитура',
  works:'Работы'
});

function activeCostAdminModel(){
  const raw=typeof getStore==='function'?getStore(COST_ADMIN_MODEL_STORE,'leaf36'):'leaf36';
  if(raw==='box36')return 'leaf36';
  return COST_ADMIN_MODELS.some(x=>x.id===raw)?raw:'leaf36';
}
function setCostAdminModel(id){
  const next=COST_ADMIN_MODELS.some(x=>x.id===id)?id:'leaf36';
  if(typeof setStore==='function')setStore(COST_ADMIN_MODEL_STORE,next);
  renderPricingAdmin();
}
function costAdminModelNav(){
  const active=activeCostAdminModel();
  return '<div class="cost-model-nav">'+COST_ADMIN_MODELS.map(x=>
    '<button class="'+(x.id===active?'active':'')+'" onclick="setCostAdminModel(\''+x.id+'\')">'+escapeHtml(x.label)+'</button>'
  ).join('')+'</div>';
}
function renderCostAdmin(){
  const id=activeCostAdminModel();
  let body='';
  if(id==='leaf36'){
    const leaf=typeof renderCost36LeafAdmin==='function'?renderCost36LeafAdmin():renderCost36Admin();
    const box=typeof renderCost36BoxAdmin==='function'?renderCost36BoxAdmin():'';
    body=leaf+box;
  }
  if(id==='dobor36')body=renderCost36DoborAdmin();
  if(id==='ply42')body=renderCost42PlywoodAdmin();
  if(id==='alu42')body=renderCost42AluminumAdmin();
  if(id==='alu59')body=renderCost59AluminumAdmin();
  return costAdminModelNav()+body;
}

function costGenericClone(v){return JSON.parse(JSON.stringify(v))}
function costGenericStoreKey(id){return 'hd_v86_cost_model_'+id}
function costGenericV93PackagingKey(id){return 'hd_v93_packaging_generic_'+id+'_migrated'}
function costGenericV93PackagingResources(id){
  const system=id==='alu59'?'59':'42';
  const thickness=system==='59'?59:42;
  const aluminumFrame=id==='alu42'||id==='alu59';
  const p=hd93packagingCalc({system,height:2000,width:800,thickness,aluminumFrame,hasLock:true});
  const rows=[
    {group:'packaging',name:'Скотч упаковки полотна',purchaseUnit:'рулон 150 м',purchasePrice:100,writeoffUnit:'м',conversionQty:150,norm:p.rows.leafTape.qty,wastePct:0,actualQty:'',note:'5 полных витков вокруг полотна с картоном; стандарт 2000×800. В рабочем блоке 42/59 алюминия норма считается от ширины.'},
    {group:'packaging',name:'ПЭ рукав упаковки полотна',purchaseUnit:'рулон 100 м',purchasePrice:4173.75,writeoffUnit:'м',conversionQty:100,norm:p.rows.sleeve.qty,wastePct:0,actualQty:'',note:'ПЭ рукав (1500×2)×0,08; норма = H + 300 мм.'},
    {group:'packaging',name:'Картон упаковки полотна',purchaseUnit:'лист 1050×2000',purchasePrice:94,writeoffUnit:'полоса 160×1000',conversionQty:12,norm:6,wastePct:0,actualQty:'',note:'12 полос из листа; 6 полос на полотно.'},
    {group:'packaging',name:'Картон упаковки короба',purchaseUnit:'лист 1050×2000',purchasePrice:94,writeoffUnit:'полоса 160×1000',conversionQty:12,norm:2,wastePct:0,actualQty:'',note:'12 полос из листа; 2 полосы на короб.'},
    {group:'packaging',name:'Стрейч упаковки короба',purchaseUnit:'рулон 2 кг ≈ 190 м',purchasePrice:550,writeoffUnit:'м',conversionQty:190,norm:5,wastePct:0,actualQty:'',note:'500 мм × 23 мкм, 2 кг; 5 м на короб. 190 м — рабочая конверсия, в счёте метраж не указан.'},
    {group:'packaging',name:'Скотч упаковки короба',purchaseUnit:'рулон 150 м',purchasePrice:100,writeoffUnit:'м',conversionQty:150,norm:6,wastePct:0,actualQty:'',note:'3 точки фиксации по 5 витков; рабочая норма 6 м на короб.'}
  ];
  if(aluminumFrame)rows.push({group:'packaging',name:'Синий скотч фрезеровки полотна',purchaseUnit:'рулон 25 м',purchasePrice:195,writeoffUnit:'м',conversionQty:25,norm:p.rows.blueTape.qty,wastePct:0,actualQty:'',note:'Только алюминиевый каркас. Замок: 196+20 мм. Петля: длина фрезеровки +20 мм × количество.'});
  return rows;
}
function costGenericApplyV93Packaging(id,values){
  if(!['ply42','alu42','alu59'].includes(id))return costGenericClone(values);
  const x=costGenericClone(values);
  x.resources=(x.resources||[]).filter(r=>r.group!=='packaging').concat(costGenericV93PackagingResources(id));
  return x;
}
function costGenericState(id,defaults){
  const saved=typeof getStore==='function'?getStore(costGenericStoreKey(id),null):null;
  const supported=['ply42','alu42','alu59'].includes(id);
  const migrated=supported&&typeof getStore==='function'?getStore(costGenericV93PackagingKey(id),false):true;
  if(saved?.values){
    if(!supported||migrated)return {values:saved.values,manualOverride:true,updatedAt:saved.updatedAt||''};
    const values=costGenericApplyV93Packaging(id,saved.values);
    if(typeof setStore==='function'){setStore(costGenericStoreKey(id),{...saved,values});setStore(costGenericV93PackagingKey(id),true)}
    return {values,manualOverride:true,updatedAt:saved.updatedAt||''};
  }
  const values=supported?costGenericApplyV93Packaging(id,defaults):costGenericClone(defaults);
  if(supported&&typeof setStore==='function')setStore(costGenericV93PackagingKey(id),true);
  return {values,manualOverride:false,updatedAt:''};
}
function costGenericActualValue(v){
  return v===''||v===null||v===undefined?null:(Number.isFinite(Number(v))?Math.max(0,Number(v)):null);
}
function costGenericCalc(values){
  const rows=(values.resources||[]).map(r=>{
    const purchasePrice=Math.max(0,Number(r.purchasePrice||0));
    const conversionQty=Math.max(0,Number(r.conversionQty||0));
    const unitPrice=conversionQty>0?purchasePrice/conversionQty:0;
    const norm=Math.max(0,Number(r.norm||0));
    const wastePct=Math.max(0,Number(r.wastePct||0));
    const writeoffNorm=norm*(1+wastePct/100);
    const normativeCost=writeoffNorm*unitPrice;
    const actualQty=costGenericActualValue(r.actualQty);
    const actualCost=actualQty===null?null:actualQty*unitPrice;
    return {...r,purchasePrice,conversionQty,unitPrice,norm,wastePct,writeoffNorm,normativeCost,actualQty,actualCost,deviation:actualCost===null?null:actualCost-normativeCost};
  });
  const byGroup={};
  rows.forEach(r=>byGroup[r.group]=(byGroup[r.group]||0)+r.normativeCost);
  const works=Number(values.works?.piecework||0)+Number(values.works?.external||0);
  if(works)byGroup.works=works;
  const direct=rows.reduce((s,r)=>s+r.normativeCost,0)+works;
  const actualRows=rows.filter(r=>r.actualQty!==null);
  const allActual=rows.length>0&&actualRows.length===rows.length;
  const actualDirect=allActual?rows.reduce((s,r)=>s+Number(r.actualCost||0),0)+works:null;
  let normativeOverhead=null,actualOverhead=null;
  if(values.includeSharedOverhead&&typeof cost36State==='function'){
    const ov=cost36State().values.overhead||{};
    const month=['rent','electricity','driver','productionManager','shopEmployees'].reduce((s,k)=>s+Number(ov[k]||0),0);
    if(Number(ov.normalMonthlyDoors)>0)normativeOverhead=month/Number(ov.normalMonthlyDoors);
    if(Number(ov.actualMonthlyDoors)>0)actualOverhead=month/Number(ov.actualMonthlyDoors);
  }
  const fullNormative=normativeOverhead===null?direct:direct+normativeOverhead;
  const fullActual=actualDirect===null?null:(actualOverhead===null?actualDirect:actualDirect+actualOverhead);
  return {rows,byGroup,works,direct,actualRowsCount:actualRows.length,allActual,actualDirect,normativeOverhead,actualOverhead,fullNormative,fullActual,deviation:fullActual===null?null:fullActual-fullNormative};
}
function costGenericId(modelId,field,index){return 'cg_'+modelId+'_'+field+'_'+index}
function costGenericFormValues(modelId,defaults){
  const state=costGenericState(modelId,defaults),values=costGenericClone(state.values);
  values.resources=(values.resources||[]).map((r,i)=>({
    ...r,
    purchaseUnit:String($(costGenericId(modelId,'pu',i))?.value??r.purchaseUnit),
    purchasePrice:Number($(costGenericId(modelId,'pp',i))?.value??r.purchasePrice)||0,
    writeoffUnit:String($(costGenericId(modelId,'wu',i))?.value??r.writeoffUnit),
    conversionQty:Number($(costGenericId(modelId,'conv',i))?.value??r.conversionQty)||0,
    norm:Number($(costGenericId(modelId,'norm',i))?.value??r.norm)||0,
    wastePct:Number($(costGenericId(modelId,'waste',i))?.value??r.wastePct)||0,
    actualQty:(()=>{const el=$(costGenericId(modelId,'actual',i));return !el||String(el.value).trim()===''?'':Number(el.value)})()
  }));
  values.works={
    piecework:Number($('cg_'+modelId+'_piecework')?.value??values.works?.piecework??0)||0,
    external:Number($('cg_'+modelId+'_external')?.value??values.works?.external??0)||0
  };
  return values;
}
function saveGenericCostModel(modelId,defaults){
  const values=costGenericFormValues(modelId,defaults);
  setStore(costGenericStoreKey(modelId),{values,updatedAt:new Date().toISOString()});
  renderPricingAdmin();
}
function resetGenericCostModel(modelId){
  if(!confirm('Вернуть исходные значения этого расчёта из таблицы себестоимости?'))return;
  localStorage.removeItem(costGenericStoreKey(modelId));renderPricingAdmin();
}
function renderGenericCostPreview(modelId,defaults){
  const c=costGenericCalc(costGenericFormValues(modelId,defaults));
  const set=(id,v)=>{const el=$(id);if(el)el.textContent=v};
  set('cg_'+modelId+'_direct',cost36Money(c.direct));
  set('cg_'+modelId+'_fullNorm',cost36Money(c.fullNormative));
  set('cg_'+modelId+'_actual',c.fullActual===null?'Не заполнен':cost36Money(c.fullActual));
  set('cg_'+modelId+'_deviation',c.deviation===null?'—':(c.deviation>=0?'+':'')+cost36Money(c.deviation));
  set('cg_'+modelId+'_progress',c.actualRowsCount+' / '+c.rows.length+' ресурсов');
  Object.entries(c.byGroup).forEach(([g,v])=>set('cg_'+modelId+'_group_'+g,cost36Money(v)));
  c.rows.forEach((r,i)=>{
    set(costGenericId(modelId,'liveUnit',i),cost36Money(r.unitPrice));
    set(costGenericId(modelId,'liveWriteoff',i),cost36Plain(r.writeoffNorm));
    set(costGenericId(modelId,'liveCost',i),cost36Money(r.normativeCost));
    set(costGenericId(modelId,'liveDev',i),r.deviation===null?'—':(r.deviation>=0?'+':'')+cost36Money(r.deviation));
  });
  const source=$('cg_'+modelId+'_sourceDelta');
  if(source&&Number.isFinite(Number(defaults.sourceTotal))){
    const delta=c.direct-Number(defaults.sourceTotal);
    source.textContent='Текущий расчёт '+cost36Money(c.direct)+' · исходная таблица '+cost36Money(defaults.sourceTotal)+' · разница '+(delta>=0?'+':'')+cost36Money(delta);
  }
}
function genericCostResourceRow(modelId,r,i,c){
  const note=r.note?'<div class="mini cost-source-note">'+escapeHtml(r.note)+'</div>':'';
  return '<tr>'+
    '<td><span class="cost36-group '+escapeHtml(r.group)+'">'+escapeHtml(COST_GENERIC_GROUPS[r.group]||r.group)+'</span></td>'+
    '<td><b>'+escapeHtml(r.name)+'</b>'+note+'</td>'+
    '<td><div class="cost36-inline-edit"><input id="'+costGenericId(modelId,'pu',i)+'" value="'+escapeHtml(r.purchaseUnit)+'"><input id="'+costGenericId(modelId,'pp',i)+'" type="number" min="0" step="0.01" value="'+escapeHtml(String(r.purchasePrice))+'" oninput="renderGenericCostPreview(\''+modelId+'\',costModelDefaults(\''+modelId+'\'))"><span>₽</span></div></td>'+
    '<td><div class="cost36-inline-edit"><input id="'+costGenericId(modelId,'wu',i)+'" value="'+escapeHtml(r.writeoffUnit)+'"><input id="'+costGenericId(modelId,'conv',i)+'" type="number" min="0.0001" step="0.0001" value="'+escapeHtml(String(r.conversionQty))+'" oninput="renderGenericCostPreview(\''+modelId+'\',costModelDefaults(\''+modelId+'\'))"></div></td>'+
    '<td><b id="'+costGenericId(modelId,'liveUnit',i)+'">'+cost36Money(c.unitPrice)+'</b></td>'+
    '<td><div class="cost36-inline-number"><input id="'+costGenericId(modelId,'norm',i)+'" type="number" min="0" step="0.001" value="'+escapeHtml(String(r.norm))+'" oninput="renderGenericCostPreview(\''+modelId+'\',costModelDefaults(\''+modelId+'\'))"><span>'+escapeHtml(r.writeoffUnit)+'</span></div></td>'+
    '<td><div class="cost36-inline-number"><input id="'+costGenericId(modelId,'waste',i)+'" type="number" min="0" step="0.1" value="'+escapeHtml(String(r.wastePct||0))+'" oninput="renderGenericCostPreview(\''+modelId+'\',costModelDefaults(\''+modelId+'\'))"><span>%</span></div></td>'+
    '<td><b id="'+costGenericId(modelId,'liveWriteoff',i)+'">'+cost36Plain(c.writeoffNorm)+'</b> '+escapeHtml(r.writeoffUnit)+'</td>'+
    '<td><b id="'+costGenericId(modelId,'liveCost',i)+'">'+cost36Money(c.normativeCost)+'</b></td>'+
    '<td><div class="cost36-inline-number"><input id="'+costGenericId(modelId,'actual',i)+'" type="number" min="0" step="0.001" value="'+(r.actualQty===''?'':escapeHtml(String(r.actualQty)))+'" placeholder="—" oninput="renderGenericCostPreview(\''+modelId+'\',costModelDefaults(\''+modelId+'\'))"><span>'+escapeHtml(r.writeoffUnit)+'</span></div></td>'+
    '<td id="'+costGenericId(modelId,'liveDev',i)+'">'+(c.deviation===null?'—':(c.deviation>=0?'+':'')+cost36Money(c.deviation))+'</td>'+
  '</tr>';
}
function renderGenericCostModel(modelId,defaults,{title,subtitle,badge='Эталонная модель',extraTop='',footerNote=''}={}){
  const state=costGenericState(modelId,defaults),v=state.values,c=costGenericCalc(v);
  const groups=[...new Set((v.resources||[]).map(r=>r.group))];
  const cards=groups.map(g=>'<div class="pricing-admin-card"><div class="pricing-admin-kicker">'+escapeHtml(COST_GENERIC_GROUPS[g]||g)+'</div><div id="cg_'+modelId+'_group_'+g+'" class="pricing-admin-big">'+cost36Money(c.byGroup[g]||0)+'</div></div>').join('');
  const rows=c.rows.map((r,i)=>genericCostResourceRow(modelId,v.resources[i],i,r)).join('');
  const source=Number.isFinite(Number(defaults.sourceTotal))?'<div id="cg_'+modelId+'_sourceDelta" class="cost-source-compare">Исходная таблица: '+cost36Money(defaults.sourceTotal)+'</div>':'';
  const overheadNote=defaults.includeSharedOverhead?'<div class="mini cost-shared-overhead">Полная нормативная использует общие производственные накладные из модели 36 мм, если там задан «Нормальный выпуск / месяц». Это единый производственный параметр, а не отдельная копия расходов для каждой модели.</div>':'';
  return pricingAdminSectionHeader(title,subtitle,badge)+extraTop+
    '<div class="cost-generic-kpis">'+cards+
      '<div class="pricing-admin-card primary"><div class="pricing-admin-kicker">Прямая нормативная</div><div id="cg_'+modelId+'_direct" class="pricing-admin-big">'+cost36Money(c.direct)+'</div></div>'+
      '<div class="pricing-admin-card primary"><div class="pricing-admin-kicker">Полная нормативная</div><div id="cg_'+modelId+'_fullNorm" class="pricing-admin-big">'+cost36Money(c.fullNormative)+'</div></div>'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Фактическая</div><div id="cg_'+modelId+'_actual" class="pricing-admin-big">'+(c.fullActual===null?'Не заполнен':cost36Money(c.fullActual))+'</div><div id="cg_'+modelId+'_progress" class="mini">'+c.actualRowsCount+' / '+c.rows.length+' ресурсов</div></div>'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Отклонение факт − норма</div><div id="cg_'+modelId+'_deviation" class="pricing-admin-big">'+(c.deviation===null?'—':(c.deviation>=0?'+':'')+cost36Money(c.deviation))+'</div></div>'+
    '</div>'+
    source+overheadNote+
    '<div class="section pricing-rule-editor"><div class="section-title">Ресурсы и правила списания</div>'+
      '<div class="cost36-reference-note"><b>Единая логика:</b> закупочная единица → единица списания → цена единицы → норматив → технологический отход → нормативная стоимость → фактическое списание → отклонение.</div>'+
      '<div class="table-wrap"><table class="cost36-reference-table"><thead><tr><th>Группа</th><th>Ресурс</th><th>Закупка</th><th>Списание / конверсия</th><th>Цена ед.</th><th>Норма</th><th>Тех. отход</th><th>К списанию</th><th>Норм. стоимость</th><th>Факт</th><th>Отклонение</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
      '<div class="section-title cost36-subtitle">Работы</div><div class="cost36-material-grid"><div class="pricing-rule-block"><div class="cost36-fields two">'+
        '<label class="cost36-field"><span>Сдельные операции / изделие</span><div class="pricing-rule-input-wrap"><input id="cg_'+modelId+'_piecework" type="number" min="0" step="1" value="'+escapeHtml(String(v.works?.piecework||0))+'" oninput="renderGenericCostPreview(\''+modelId+'\',costModelDefaults(\''+modelId+'\'))"><em>₽</em></div></label>'+
        '<label class="cost36-field"><span>Внешние работы / изделие</span><div class="pricing-rule-input-wrap"><input id="cg_'+modelId+'_external" type="number" min="0" step="1" value="'+escapeHtml(String(v.works?.external||0))+'" oninput="renderGenericCostPreview(\''+modelId+'\',costModelDefaults(\''+modelId+'\'))"><em>₽</em></div></label>'+
      '</div></div></div>'+
      (footerNote?'<div class="cost36-reference-note">'+footerNote+'</div>':'')+
      '<div class="pricing-rule-actions"><button class="primary" onclick="saveGenericCostModel(\''+modelId+'\',costModelDefaults(\''+modelId+'\'))">Сохранить и применить</button><button class="secondary" onclick="resetGenericCostModel(\''+modelId+'\')">Вернуть исходные значения</button></div>'+
    '</div>';
}

const DOBOR36_SOURCE=Object.freeze({
  100:Object.freeze({mdf:56,glueNorm:0.2,filmNorm:0.385,source138:139.13,source280:193.8}),
  150:Object.freeze({mdf:84,glueNorm:0.3,filmNorm:0.52,source138:200.76,source280:274.6}),
  200:Object.freeze({mdf:115,glueNorm:0.4,filmNorm:0.77,source138:281.26,source280:390.6})
});
function activeDobor36Width(){
  const raw=Number(getStore(COST_DOBOR_WIDTH_STORE,100));return DOBOR36_SOURCE[raw]?raw:100;
}
function activeDobor36Film(){
  const raw=Number(getStore(COST_DOBOR_FILM_STORE,138));return raw===280?280:138;
}
function setDobor36Width(v){setStore(COST_DOBOR_WIDTH_STORE,Number(v));renderPricingAdmin()}
function setDobor36Film(v){setStore(COST_DOBOR_FILM_STORE,Number(v));renderPricingAdmin()}
function dobor36Defaults(width=activeDobor36Width(),film=activeDobor36Film()){
  const x=DOBOR36_SOURCE[width]||DOBOR36_SOURCE[100];
  return {
    sourceTotal:film===280?x.source280:x.source138,includeSharedOverhead:false,works:{piecework:0,external:0},
    resources:[
      {group:'materials',name:'МДФ · добор '+width+' мм',purchaseUnit:'заготовка',purchasePrice:x.mdf,writeoffUnit:'шт.',conversionQty:1,norm:1,wastePct:0,actualQty:'',note:'Стоимость МДФ на 1 добор из исходной таблицы.'},
      {group:'consumables',name:'Клей ламинации',purchaseUnit:'м² нанесения',purchasePrice:150,writeoffUnit:'м²',conversionQty:1,norm:x.glueNorm,wastePct:0,actualQty:'',note:'Цена 150 ₽/м² восстановлена из строк таблицы: 30/0,2 = 45/0,3 = 60/0,4.'},
      {group:'materials',name:'ПВХ-плёнка',purchaseUnit:'м²',purchasePrice:film,writeoffUnit:'м²',conversionQty:1,norm:x.filmNorm,wastePct:0,actualQty:'',note:'В таблице присутствуют два расчётных блока плёнки: 138 и 280 ₽/м².'}
    ]
  };
}
function activeDobor36ModelId(){return 'dobor36_'+activeDobor36Width()+'_'+activeDobor36Film()}

const COST42_PLY_DEFAULTS=Object.freeze({
  sourceTotal:10823.764013,includeSharedOverhead:true,works:Object.freeze({piecework:0,external:0}),
  resources:Object.freeze([
    Object.freeze({group:'materials',name:'МДФ 6 мм · щиты',purchaseUnit:'лист',purchasePrice:1354,writeoffUnit:'лист',conversionQty:1,norm:2/3,wastePct:0,actualQty:'',note:'Исходная логика: лист даёт примерно 1,5 двери.'}),
    Object.freeze({group:'materials',name:'Фанера · каркас',purchaseUnit:'комплект листов',purchasePrice:6260,writeoffUnit:'дет.',conversionQty:36,norm:3,wastePct:0,actualQty:'',note:'Таблица считает 6 260 / 36 × 3.'}),
    Object.freeze({group:'materials',name:'Рёбра жёсткости',purchaseUnit:'лист МДФ 6',purchasePrice:1354,writeoffUnit:'ребро',conversionQty:103,norm:9,wastePct:0,actualQty:'',note:'Пока сохранена исходная норма 9 шт. Геометрию 42 мм отдельно не утверждали.'}),
    Object.freeze({group:'consumables',name:'Клей ПВА',purchaseUnit:'ведро 30 кг',purchasePrice:9100,writeoffUnit:'кг',conversionQty:30,norm:0.3,wastePct:0,actualQty:''}),
    Object.freeze({group:'consumables',name:'Грунт',purchaseUnit:'тара 25 кг',purchasePrice:9840,writeoffUnit:'кг',conversionQty:25,norm:0.4138,wastePct:0,actualQty:''}),
    Object.freeze({group:'consumables',name:'Растворитель',purchaseUnit:'канистра 30 л',purchasePrice:3947,writeoffUnit:'л',conversionQty:30,norm:0.0621,wastePct:0,actualQty:''}),
    Object.freeze({group:'consumables',name:'Отвердитель',purchaseUnit:'тара 12,5 л',purchasePrice:6980,writeoffUnit:'л',conversionQty:12.5,norm:0.1241,wastePct:0,actualQty:''}),
    Object.freeze({group:'materials',name:'Алюминиевая кромка',purchaseUnit:'хлыст 6 м',purchasePrice:1816,writeoffUnit:'м',conversionQty:6,norm:6,wastePct:0,actualQty:''}),
    Object.freeze({group:'consumables',name:'Клей ПУР',purchaseUnit:'кг',purchasePrice:1000,writeoffUnit:'кг',conversionQty:1,norm:0.1,wastePct:0,actualQty:''}),
    Object.freeze({group:'box',name:'Короб 42 · комплект профиля 5,1 м',purchaseUnit:'комплект',purchasePrice:4038,writeoffUnit:'комплект',conversionQty:1,norm:1,wastePct:0,actualQty:''}),
    Object.freeze({group:'box',name:'Уплотнительная резинка',purchaseUnit:'бухта 700 м',purchasePrice:8820,writeoffUnit:'м',conversionQty:700,norm:5.1,wastePct:0,actualQty:''}),
    Object.freeze({group:'packaging',name:'Скотч',purchaseUnit:'рулон',purchasePrice:100,writeoffUnit:'рулон',conversionQty:1,norm:0.3,wastePct:0,actualQty:''}),
    Object.freeze({group:'packaging',name:'Плёнка упаковки полотна',purchaseUnit:'рулон 1051,2 м',purchasePrice:13375,writeoffUnit:'м',conversionQty:1051.2,norm:2.5,wastePct:0,actualQty:''}),
    Object.freeze({group:'packaging',name:'Картон упаковки полотна',purchaseUnit:'лист',purchasePrice:94,writeoffUnit:'дет.',conversionQty:12,norm:6,wastePct:0,actualQty:''}),
    Object.freeze({group:'packaging',name:'Картон упаковки короба',purchaseUnit:'лист',purchasePrice:94,writeoffUnit:'дет.',conversionQty:12,norm:3,wastePct:0,actualQty:''}),
    Object.freeze({group:'packaging',name:'Стрейч короба',purchaseUnit:'рулон 2 кг',purchasePrice:550,writeoffUnit:'доля рулона',conversionQty:10,norm:1,wastePct:0,actualQty:'',note:'Исходная таблица фиксирует 55 ₽/комплект.'}),
    Object.freeze({group:'hardware',name:'Петля K8060',purchaseUnit:'шт.',purchasePrice:1171,writeoffUnit:'шт.',conversionQty:1,norm:2,wastePct:0,actualQty:''}),
    Object.freeze({group:'hardware',name:'Замок',purchaseUnit:'шт.',purchasePrice:402,writeoffUnit:'шт.',conversionQty:1,norm:1,wastePct:0,actualQty:''})
  ])
});

const COST42_ALU_DEFAULTS=Object.freeze({
  sourceTotal:14420.96,includeSharedOverhead:true,works:Object.freeze({piecework:0,external:0}),
  resources:Object.freeze([
    Object.freeze({group:'materials',name:'МДФ 4 мм · щиты',purchaseUnit:'лист',purchasePrice:1200,writeoffUnit:'лист',conversionQty:1,norm:2/3,wastePct:0,actualQty:''}),
    Object.freeze({group:'materials',name:'Брус внутреннего каркаса',purchaseUnit:'нормокомплект',purchasePrice:231,writeoffUnit:'комплект',conversionQty:1,norm:1,wastePct:0,actualQty:'',note:'В источнике количество = 3 и комментарий про брус 692 ₽, но итог строки = 231 ₽. Сохраняем именно подтверждённый итог, не исправляя противоречие молча.'}),
    Object.freeze({group:'materials',name:'Алюминиевый каркас',purchaseUnit:'комплект',purchasePrice:3586,writeoffUnit:'комплект',conversionQty:1,norm:1,wastePct:0,actualQty:''}),
    Object.freeze({group:'materials',name:'Сотовая панель',purchaseUnit:'м²',purchasePrice:311,writeoffUnit:'м²',conversionQty:1,norm:1.6,wastePct:0,actualQty:''}),
    Object.freeze({group:'consumables',name:'Клей ПУР · сборка',purchaseUnit:'кг',purchasePrice:1000,writeoffUnit:'кг',conversionQty:1,norm:0.1,wastePct:0,actualQty:''}),
    Object.freeze({group:'consumables',name:'Грунт',purchaseUnit:'тара 25 кг',purchasePrice:9840,writeoffUnit:'кг',conversionQty:25,norm:0.4138,wastePct:0,actualQty:''}),
    Object.freeze({group:'consumables',name:'Растворитель',purchaseUnit:'канистра 30 л',purchasePrice:3947,writeoffUnit:'л',conversionQty:30,norm:0.0621,wastePct:0,actualQty:''}),
    Object.freeze({group:'consumables',name:'Отвердитель',purchaseUnit:'тара 12,5 л',purchasePrice:6980,writeoffUnit:'л',conversionQty:12.5,norm:0.1241,wastePct:0,actualQty:''}),
    Object.freeze({group:'materials',name:'Алюминиевая кромка',purchaseUnit:'хлыст 6 м',purchasePrice:1816,writeoffUnit:'м',conversionQty:6,norm:6,wastePct:0,actualQty:''}),
    Object.freeze({group:'consumables',name:'Клей ПУР · кромка',purchaseUnit:'кг',purchasePrice:1000,writeoffUnit:'кг',conversionQty:1,norm:0.1,wastePct:0,actualQty:''}),
    Object.freeze({group:'box',name:'Короб 42 · комплект профиля 5,1 м',purchaseUnit:'комплект',purchasePrice:4038,writeoffUnit:'комплект',conversionQty:1,norm:1,wastePct:0,actualQty:''}),
    Object.freeze({group:'box',name:'Уплотнительная резинка',purchaseUnit:'бухта 700 м',purchasePrice:8820,writeoffUnit:'м',conversionQty:700,norm:5.1,wastePct:0,actualQty:''}),
    Object.freeze({group:'packaging',name:'Скотч',purchaseUnit:'рулон',purchasePrice:100,writeoffUnit:'рулон',conversionQty:1,norm:0.3,wastePct:0,actualQty:''}),
    Object.freeze({group:'packaging',name:'Плёнка упаковки полотна',purchaseUnit:'рулон 1051,2 м',purchasePrice:13375,writeoffUnit:'м',conversionQty:1051.2,norm:2.5,wastePct:0,actualQty:''}),
    Object.freeze({group:'packaging',name:'Картон упаковки полотна',purchaseUnit:'лист',purchasePrice:94,writeoffUnit:'дет.',conversionQty:12,norm:6,wastePct:0,actualQty:''}),
    Object.freeze({group:'packaging',name:'Картон упаковки короба',purchaseUnit:'лист',purchasePrice:94,writeoffUnit:'дет.',conversionQty:12,norm:3,wastePct:0,actualQty:''}),
    Object.freeze({group:'packaging',name:'Стрейч короба',purchaseUnit:'рулон 2 кг',purchasePrice:550,writeoffUnit:'доля рулона',conversionQty:10,norm:1,wastePct:0,actualQty:''}),
    Object.freeze({group:'hardware',name:'Петля K8060',purchaseUnit:'шт.',purchasePrice:1171,writeoffUnit:'шт.',conversionQty:1,norm:2,wastePct:0,actualQty:''}),
    Object.freeze({group:'hardware',name:'Замок',purchaseUnit:'шт.',purchasePrice:402,writeoffUnit:'шт.',conversionQty:1,norm:1,wastePct:0,actualQty:''}),
    Object.freeze({group:'hardware',name:'Саморезы',purchaseUnit:'кг',purchasePrice:444,writeoffUnit:'кг',conversionQty:1,norm:10/444,wastePct:0,actualQty:'',note:'Норма восстановлена из зафиксированной в таблице стоимости 10 ₽ при цене 444 ₽/кг.'}),
    Object.freeze({group:'hardware',name:'Уголки',purchaseUnit:'шт.',purchasePrice:6.24,writeoffUnit:'шт.',conversionQty:1,norm:1,wastePct:0,actualQty:''})
  ])
});


const COST59_ALU_DEFAULTS=Object.freeze({
  sourceTotal:17290.12,includeSharedOverhead:true,works:Object.freeze({piecework:0,external:0}),
  resources:Object.freeze([
    Object.freeze({group:'materials',name:'МДФ 4 мм · щиты',purchaseUnit:'лист',purchasePrice:1200,writeoffUnit:'лист',conversionQty:1,norm:2/3,wastePct:0,actualQty:'',note:'Исходная строка: 2 детали 2020×820; лист даёт 3 детали, поэтому на полотно списывается 2/3 листа = 800 ₽.'}),
    Object.freeze({group:'materials',name:'Алюминиевый каркас 59 мм',purchaseUnit:'хлыст 6 м',purchasePrice:3841,writeoffUnit:'м',conversionQty:6,norm:6,wastePct:0,actualQty:'',note:'3 841 ₽ за 6-метровый хлыст с доставкой; исходная строка списывает полный хлыст на полотно.'}),
    Object.freeze({group:'materials',name:'Сотовая панель 47 мм',purchaseUnit:'м²',purchasePrice:351,writeoffUnit:'м²',conversionQty:1,norm:1.6,wastePct:0,actualQty:'',note:'Источник указывает 1,6 м² × 351 ₽ и округляет стоимость строки до 562 ₽; точная арифметика модели = 561,60 ₽.'}),
    Object.freeze({group:'materials',name:'Закладной брус',purchaseUnit:'нормокомплект',purchasePrice:231,writeoffUnit:'комплект',conversionQty:1,norm:1,wastePct:0,actualQty:'',note:'В источнике количество = 3 и комментарий про брус 692 ₽, но итог строки = 231 ₽. Как и в 42 мм, сохраняем подтверждённый итог строки как нормокомплект и не исправляем противоречие молча.'}),
    Object.freeze({group:'hardware',name:'Саморезы · сборка каркаса',purchaseUnit:'кг',purchasePrice:444,writeoffUnit:'кг',conversionQty:1,norm:36/444,wastePct:0,actualQty:'',note:'Норма восстановлена из исходной стоимости 36 ₽ при цене 444 ₽/кг.'}),
    Object.freeze({group:'hardware',name:'Уголки · сборка каркаса',purchaseUnit:'нормокомплект 8 шт.',purchasePrice:40,writeoffUnit:'комплект',conversionQty:1,norm:1,wastePct:0,actualQty:'',note:'Источник одновременно указывает 8 шт. × 6,24 ₽ (= 49,92 ₽) и итог строки 40 ₽. Сохраняем итог строки 40 ₽ как исходный нормокомплект; конфликт виден в примечании.'}),
    Object.freeze({group:'consumables',name:'Клей ПУР · сборка',purchaseUnit:'кг',purchasePrice:1000,writeoffUnit:'кг',conversionQty:1,norm:0.3,wastePct:0,actualQty:'',note:'Исходная норма: 300 г на полотно.'}),
    Object.freeze({group:'consumables',name:'Грунт',purchaseUnit:'тара 25 кг',purchasePrice:9840,writeoffUnit:'кг',conversionQty:25,norm:0.4138,wastePct:0,actualQty:''}),
    Object.freeze({group:'consumables',name:'Растворитель',purchaseUnit:'канистра 30 л',purchasePrice:3947,writeoffUnit:'л',conversionQty:30,norm:0.0621,wastePct:0,actualQty:''}),
    Object.freeze({group:'consumables',name:'Отвердитель',purchaseUnit:'тара 12,5 л',purchasePrice:6980,writeoffUnit:'л',conversionQty:12.5,norm:0.1241,wastePct:0,actualQty:''}),
    Object.freeze({group:'materials',name:'Алюминиевая кромка 59 мм',purchaseUnit:'хлыст 6 м',purchasePrice:2392,writeoffUnit:'м',conversionQty:6,norm:6,wastePct:0,actualQty:'',note:'2 392 ₽ за 6-метровый хлыст с доставкой.'}),
    Object.freeze({group:'box',name:'Короб 59 · комплект профиля 5,1 м',purchaseUnit:'комплект',purchasePrice:5068,writeoffUnit:'комплект',conversionQty:1,norm:1,wastePct:0,actualQty:'',note:'В исходном листе количество повреждено форматом даты; стоимость строки подтверждает один комплект 5 068 ₽.'}),
    Object.freeze({group:'box',name:'Уплотнительная резинка',purchaseUnit:'бухта 700 м',purchasePrice:8820,writeoffUnit:'м',conversionQty:700,norm:5.1,wastePct:0,actualQty:'',note:'Норма 5,1 м восстановлена из стоимости строки 64,26 ₽ и совпадает с моделью коробов 42 мм.'}),
    Object.freeze({group:'packaging',name:'Скотч',purchaseUnit:'рулон',purchasePrice:100,writeoffUnit:'рулон',conversionQty:1,norm:0.3,wastePct:0,actualQty:''}),
    Object.freeze({group:'packaging',name:'Плёнка упаковки полотна',purchaseUnit:'рулон 1051,2 м',purchasePrice:13375,writeoffUnit:'м',conversionQty:1051.2,norm:2.5,wastePct:0,actualQty:'',note:'Источник округляет строку до 32 ₽; модель считает по фактической длине рулона.'}),
    Object.freeze({group:'packaging',name:'Картон упаковки полотна',purchaseUnit:'лист',purchasePrice:94,writeoffUnit:'дет.',conversionQty:12,norm:6,wastePct:0,actualQty:''}),
    Object.freeze({group:'packaging',name:'Картон упаковки короба',purchaseUnit:'лист',purchasePrice:94,writeoffUnit:'дет.',conversionQty:12,norm:3,wastePct:0,actualQty:''}),
    Object.freeze({group:'packaging',name:'Стрейч короба',purchaseUnit:'рулон 2 кг',purchasePrice:550,writeoffUnit:'доля рулона',conversionQty:10,norm:1,wastePct:0,actualQty:'',note:'Исходная таблица фиксирует 55 ₽ на комплект.'}),
    Object.freeze({group:'hardware',name:'Петля K6360/38',purchaseUnit:'шт.',purchasePrice:1545,writeoffUnit:'шт.',conversionQty:1,norm:2,wastePct:0,actualQty:'',note:'Источник: 1 545 ₽/шт., цена зависит от курса.'}),
    Object.freeze({group:'hardware',name:'Замок',purchaseUnit:'шт.',purchasePrice:402,writeoffUnit:'шт.',conversionQty:1,norm:1,wastePct:0,actualQty:'',note:'Исходная строка: чёрный замок, 402 ₽.'}),
    Object.freeze({group:'hardware',name:'Уголки монтажные',purchaseUnit:'нормокомплект 4 шт.',purchasePrice:20,writeoffUnit:'комплект',conversionQty:1,norm:1,wastePct:0,actualQty:'',note:'Источник одновременно указывает 4 шт. × 6,24 ₽ (= 24,96 ₽) и итог строки 20 ₽. Сохраняем итог строки 20 ₽ как исходный нормокомплект.'}),
    Object.freeze({group:'hardware',name:'Саморезы · монтаж',purchaseUnit:'кг',purchasePrice:444,writeoffUnit:'кг',conversionQty:1,norm:16/444,wastePct:0,actualQty:'',note:'Норма восстановлена из исходной стоимости 16 ₽ при цене 444 ₽/кг.'})
  ])
});

function costModelDefaults(modelId){
  if(modelId.startsWith('dobor36_'))return dobor36Defaults();
  if(modelId==='ply42')return COST42_PLY_DEFAULTS;
  if(modelId==='alu42')return COST42_ALU_DEFAULTS;
  if(modelId==='alu59')return COST59_ALU_DEFAULTS;
  return COST36_BOX_DEFAULTS;
}
function renderCost36DoborAdmin(){
  const width=activeDobor36Width(),film=activeDobor36Film(),id=activeDobor36ModelId(),defs=dobor36Defaults(width,film);
  const top='<div class="cost-variant-bar"><div><span>Ширина добора</span><select onchange="setDobor36Width(this.value)">'+[100,150,200].map(x=>'<option value="'+x+'" '+(x===width?'selected':'')+'>'+x+' мм</option>').join('')+'</select></div>'+
    '<div><span>Плёнка из таблицы</span><select onchange="setDobor36Film(this.value)"><option value="138" '+(film===138?'selected':'')+'>138 ₽/м²</option><option value="280" '+(film===280?'selected':'')+'>280 ₽/м²</option></select></div></div>';
  const one=costGenericCalc(costGenericState(id,defs).values).direct;
  const extra=top+'<div class="cost-dobor-kit"><span>Себестоимость 1 шт.</span><b>'+cost36Money(one)+'</b><span>Комплект 2,5 шт.</span><b>'+cost36Money(one*2.5)+'</b></div>';
  return renderGenericCostModel(id,defs,{title:'Себестоимость · доборы 36 мм',subtitle:'100 / 150 / 200 мм. МДФ + клей + ПВХ-плёнка; оба ценовых блока плёнки из исходной таблицы сохранены.',badge:'36 мм · доборы',extraTop:extra});
}
function costBomFmtM(value){
  const n=Number(value);
  return Number.isFinite(n)?n.toLocaleString('ru-RU',{minimumFractionDigits:0,maximumFractionDigits:3})+' м':'—';
}
function costBomCurrentResource(modelId,pattern){
  const defs=costModelDefaults(modelId);
  const values=costGenericState(modelId,defs).values;
  return (values.resources||[]).find(r=>pattern.test(String(r.name||'')))||null;
}
function costBomMeterNorm(row,{kitMetres=0}={}){
  if(!row)return null;
  const norm=Math.max(0,Number(row.norm||0))*(1+Math.max(0,Number(row.wastePct||0))/100);
  if(String(row.writeoffUnit||'').toLowerCase().includes('м'))return norm;
  return kitMetres>0?norm*kitMetres:null;
}
function costBomCompare(prod,current){
  if(current===null||current===undefined)return '<b>⚠ Нужна нормализация</b>';
  const delta=Number(current)-Number(prod);
  if(Math.abs(delta)<0.001)return '<b>✓ Совпадает</b>';
  return '<b>⚠ '+(delta>0?'текущая норма выше на ':'текущая норма ниже на ')+costBomFmtM(Math.abs(delta))+'</b>';
}
function costBomAuditBody(modelId,height=2000,width=800,opening='direct'){
  const construction=modelId==='alu59'?'59':'42';
  const frameType=modelId==='ply42'?'wood':'aluminum';
  const plan=hdBuildProductionCompatibleBom({construction,height,width,quantity:1,frameType,opening});
  if(plan.issues?.length)return '<div class="cost36-reference-note"><b>Не удалось рассчитать:</b> '+plan.issues.map(escapeHtml).join('; ')+'</div>';

  const box=hdBomRole(plan,'box');
  const direct=hdBomRole(plan,'direct_edge');
  const revers=hdBomRole(plan,'revers_edge');
  const edge59=hdBomRole(plan,'edge_59');
  const carcass=hdBomRole(plan,'carcass');
  const boxProd=hdBomMetres(plan,'box');
  const edgeProd=construction==='42'?hdBomMetres(plan,['direct_edge','revers_edge']):hdBomMetres(plan,'edge_59');
  const carcassProd=hdBomMetres(plan,'carcass');

  const boxRow=costBomCurrentResource(modelId,/Короб (42|59)/i);
  const edgeRow=costBomCurrentResource(modelId,/Алюминиевая кромка/i);
  const carcassRow=costBomCurrentResource(modelId,/Алюминиевый каркас/i);
  const timberRow=costBomCurrentResource(modelId,/Брус внутреннего каркаса|Закладной брус/i);
  const boxCurrent=costBomMeterNorm(boxRow,{kitMetres:5.1});
  const edgeCurrent=costBomMeterNorm(edgeRow);
  const carcassCurrent=costBomMeterNorm(carcassRow);

  const edgeDetail=construction==='42'
    ? (revers
      ? 'Revers: '+costBomFmtM((revers.requiredLengthMm||0)/1000)+' ['+escapeHtml(hdBomCutsText(revers))+']; прямой низ: '+costBomFmtM((direct?.requiredLengthMm||0)/1000)+' ['+escapeHtml(hdBomCutsText(direct))+']'
      : 'Прямой профиль: '+costBomFmtM((direct?.requiredLengthMm||0)/1000)+' ['+escapeHtml(hdBomCutsText(direct))+']')
    : '59 мм: '+costBomFmtM((edge59?.requiredLengthMm||0)/1000)+' ['+escapeHtml(hdBomCutsText(edge59))+']';

  const carcassCurrentText=carcassRow
    ? (carcassCurrent===null
      ? escapeHtml(String(carcassRow.norm||0))+' '+escapeHtml(carcassRow.writeoffUnit||'')+'; метраж в себестоимости не задан'
      : costBomFmtM(carcassCurrent))
    : 'Не применяется';

  const rows=[
    '<tr><td><b>Короб</b><div class="mini">'+escapeHtml(hdBomCutsText(box))+'</div></td><td>'+costBomFmtM(boxProd)+'</td><td>'+costBomFmtM(boxCurrent)+'</td><td>'+costBomCompare(boxProd,boxCurrent)+'</td></tr>',
    '<tr><td><b>Алюминиевый торец</b><div class="mini">'+edgeDetail+'</div></td><td>'+costBomFmtM(edgeProd)+'</td><td>'+costBomFmtM(edgeCurrent)+'</td><td>'+costBomCompare(edgeProd,edgeCurrent)+(construction==='42'&&revers?'<div class="mini">Текущая себестоимость хранит одну общую «кромку» и не разделяет Revers/прямой профиль.</div>':'')+'</td></tr>'
  ];
  if(frameType==='aluminum'){
    rows.push('<tr><td><b>Алюминиевый каркас</b><div class="mini">'+escapeHtml(hdBomCutsText(carcass))+'; низ каркаса деревянный</div></td><td>'+costBomFmtM(carcassProd)+'</td><td>'+carcassCurrentText+'</td><td>'+costBomCompare(carcassProd,carcassCurrent)+'</td></tr>');
    rows.push('<tr><td><b>Нижний деревянный брус</b><div class="mini">Production исключает алюминиевый низ, но пока не выдаёт отдельную длину бруса.</div></td><td>Конструктивно есть</td><td>'+(timberRow?escapeHtml(String(timberRow.norm||0))+' '+escapeHtml(timberRow.writeoffUnit||''):'Нет отдельной строки')+'</td><td><b>⚠ Открытый норматив длины</b></td></tr>');
  }
  rows.push('<tr><td><b>ПВХ-плёнка полотна</b><div class="mini">В Production общий расчёт плёнки сейчас реализован для 36 мм и погонажа; ветки door_42 / door_59 отсутствуют.</div></td><td>Не определено</td><td>Не связываем автоматически</td><td><b>⚠ Сначала утвердить единое правило</b></td></tr>');

  return '<div class="table-wrap"><table class="cost36-reference-table"><thead><tr><th>Узел</th><th>Production-норма</th><th>Текущая себестоимость</th><th>Сверка</th></tr></thead><tbody>'+rows.join('')+'</tbody></table></div>'+
    '<div class="cost36-reference-note"><b>Режим сверки:</b> этот блок пока не меняет денежный расчёт ниже. Он показывает, где исходная таблица себестоимости уже совпадает с Production, а где нормы нужно перевести на единый BOM. Источник правил: <code>'+escapeHtml(HD_PRODUCTION_BOM_SOURCE.path)+'</code>, commit <code>'+escapeHtml(HD_PRODUCTION_BOM_SOURCE.checkedCommit.slice(0,7))+'</code>.</div>'+
    (plan.gaps?.length?'<div class="cost36-reference-note"><b>Открытые стыки:</b> '+plan.gaps.map(escapeHtml).join(' ')+'</div>':'');
}
function updateCostBomAudit(modelId){
  const h=Number($('cost_bom_h_'+modelId)?.value||2000);
  const w=Number($('cost_bom_w_'+modelId)?.value||800);
  const opening=String($('cost_bom_open_'+modelId)?.value||'direct');
  const target=$('cost_bom_body_'+modelId);
  if(target)target.innerHTML=costBomAuditBody(modelId,h,w,opening);
}
function renderCostBomAudit(modelId){
  const is42=modelId!=='alu59';
  return '<div class="section pricing-rule-editor">'+
    '<div class="section-title">Сверка с нормами Production</div>'+
    '<div class="cost36-reference-note"><b>Цель:</b> одна геометрия конструкции для Production и себестоимости. На этом этапе только сравниваем нормы — существующие цены и итоговая себестоимость не переписываются автоматически.</div>'+
    '<div class="cost36-material-grid"><div class="pricing-rule-block"><div class="cost36-fields '+(is42?'three':'two')+'">'+
      '<label class="cost36-field"><span>Высота полотна</span><div class="pricing-rule-input-wrap"><input id="cost_bom_h_'+modelId+'" type="number" min="1700" max="2950" step="50" value="2000" oninput="updateCostBomAudit(\''+modelId+'\')"><em>мм</em></div></label>'+
      '<label class="cost36-field"><span>Ширина полотна</span><div class="pricing-rule-input-wrap"><input id="cost_bom_w_'+modelId+'" type="number" min="400" max="1200" step="50" value="800" oninput="updateCostBomAudit(\''+modelId+'\')"><em>мм</em></div></label>'+
      (is42?'<label class="cost36-field"><span>Открывание 42 мм</span><select id="cost_bom_open_'+modelId+'" onchange="updateCostBomAudit(\''+modelId+'\')"><option value="direct">На себя / прямое</option><option value="revers">Revers</option></select></label>':'')+
    '</div></div></div>'+
    '<div id="cost_bom_body_'+modelId+'">'+costBomAuditBody(modelId,2000,800,'direct')+'</div>'+
  '</div>';
}

function renderCost42PlywoodAdmin(){
  return renderGenericCostModel('ply42',COST42_PLY_DEFAULTS,{
    title:'Себестоимость · 42 мм · фанерный каркас',
    subtitle:'Стандарт 2000×800 из листа «42 мм полотно стандарт фанера». Вся строка материалов, короб, упаковка и фурнитура перенесены в единый нормативно-фактический расчёт.',
    badge:'42 мм · фанера',
    extraTop:renderCostBomAudit('ply42')
  });
}
function renderCost42AluminumAdmin(){
  return renderGenericCostModel('alu42',COST42_ALU_DEFAULTS,{
    title:'Себестоимость · 42 мм · алюминиевый каркас',
    subtitle:'Стандарт 2000×800 из листа «42 мм полотно стандарт на алюминие». Противоречивые места источника не исправлены молча — они помечены прямо в ресурсе.',
    badge:'42 мм · алюминий',
    extraTop:renderCostBomAudit('alu42')
  });
}

function renderCost59AluminumAdmin(){
  return renderGenericCostModel('alu59',COST59_ALU_DEFAULTS,{
    title:'Себестоимость · 59 мм · алюминиевый каркас',
    subtitle:'Стандарт 2000×800 из листа «59 мм полотно стандарт». Материалы, короб, упаковка, K6360/38, замок и крепёж перенесены в единый нормативно-фактический расчёт.',
    badge:'59 мм · алюминий',
    extraTop:renderCostBomAudit('alu59'),
    footerNote:'<b>Контроль источника:</b> исходная себестоимость — 17 290,12 ₽. Несовпадения арифметики строк (уголки) сохранены как исходные нормокомплекты с пояснениями; копеечные отличия по сотовой панели и упаковке показываются сравнением с исходной таблицей, а не скрытой балансирующей строкой.'
  });
}
