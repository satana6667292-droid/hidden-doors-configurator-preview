const HARDWARE_MAP={'Петли':'Петли','Замки':'Замки','Ручки':'Ручки','Завертки':'Завертки','Цилиндры':'Цилиндровые механизмы','Стопоры':'Стопоры','Автоматические пороги':'Скрытый порог','Доводчики':'Доводчики','Системы открывания':'Системы открывания'};

const HARDWARE_CATALOG_MERGE_STORE='hd_v43_catalog_duplicate_merges';
function catalogDuplicateMergeKey(cat,value){
  const normalized=typeof normalizeHardwareName==='function'
    ?normalizeHardwareName(value)
    :String(value||'').toUpperCase().replace(/\s+/g,' ').trim();
  return String(cat||'')+'|'+normalized;
}
function catalogDuplicateMergeRules(){
  return typeof getStore==='function'?getStore(HARDWARE_CATALOG_MERGE_STORE,{}):{};
}
function saveCatalogDuplicateMergeRule(cat,value){
  const rules=catalogDuplicateMergeRules();
  const key=catalogDuplicateMergeKey(cat,value);
  rules[key]={category:String(cat||''),name:String(value||''),mergedAt:new Date().toISOString()};
  setStore(HARDWARE_CATALOG_MERGE_STORE,rules);
}
function catalogValues(cat){
  const raw=BITRIX_CATALOG[cat]||[];
  const rules=catalogDuplicateMergeRules();
  const seenMerged=new Set();
  return raw.filter(value=>{
    const key=catalogDuplicateMergeKey(cat,value);
    if(!rules[key])return true;
    if(seenMerged.has(key))return false;
    seenMerged.add(key);
    return true;
  });
}
function datalistHtml(id,vals){return `<datalist id="${id}">${vals.map(v=>`<option value="${escapeHtml(v)}"></option>`).join('')}</datalist>`}
function searchableCatalog(id,cat,placeholder='Не требуется — начните вводить'){
  const vals=catalogValues(cat);
  return `<input id="${id}" list="${id}List" placeholder="${escapeHtml(placeholder)}">${datalistHtml(id+'List',vals)}<div class="mini">${vals.length} позиций в текущей ревизии Bitrix24</div>`;
}
function simpleSelectWithNone(id,cat){
  const vals=['Не требуется',...catalogValues(cat)];
  return selectEl(id,vals,'Не требуется');
}
function doorHingeQtyField(){
  if(!['single42','single59'].includes(product()))return '';
  return field('Количество петель',
    `<input id="doorHingeQty" type="number" min="1" step="1">
     <div id="doorHingeQtyHint" class="mini"></div>`);
}

function doorOrderSections(){
  return section('Фурнитура',
    `<div class="catalog-note">Петля для 42/59 подставляется автоматически как рекомендация по системе двери, цвету профиля и стеклу/зеркалу, но поле остаётся обычным: модель можно заменить вручную. Количество считается по таблице Hidden Doors и также доступно для ручной корректировки.</div>`+
    `<div class="fields" style="margin-top:12px">`+
      field('Петли',searchableCatalog('doorHinges','Петли')+`<div id="doorHingePriceHint" class="mini hinge-price-hint"></div>`)+
      doorHingeQtyField()+
      field('Замок',searchableCatalog('doorLock','Замки')+`<div id="doorLockPriceHint" class="mini hinge-price-hint"></div>`)+
      field('Ручка',searchableCatalog('doorHandle','Ручки')+`<div id="doorHandlePriceHint" class="mini hinge-price-hint"></div>`)+
      field('Завертка',searchableCatalog('doorTurn','Завертки')+`<div id="doorTurnPriceHint" class="mini hinge-price-hint"></div>`)+
      `<div id="doorCylinderFieldWrap" class="hidden">${field('Цилиндр',searchableCatalog('doorCylinder','Цилиндровые механизмы')+`<div id="doorCylinderPriceHint" class="mini hinge-price-hint"></div><div class="mini">Обязательное поле для замков типа «Под цилиндр».</div>`)}</div>`+
      field('Стопор',searchableCatalog('doorStopper','Стопоры')+`<div id="doorStopperPriceHint" class="mini hinge-price-hint"></div>`)+
      field('Автоматический порог',searchableCatalog('doorThreshold','Скрытый порог')+`<div id="doorThresholdPriceHint" class="mini hinge-price-hint"></div>`)+
      field('Доводчик',searchableCatalog('doorCloser','Доводчики')+`<div id="doorCloserPriceHint" class="mini hinge-price-hint"></div>`)+
    `</div>`
  )+
  section('Дополнительные элементы двери',
    fields(
      field('Вентиляционная решётка',simpleSelectWithNone('doorVent','Вентиляционные решетки'))+
      field('Иллюминатор / декоративный элемент',searchableCatalog('doorExtra','Доп.фурнитура','Не требуется — начните вводить'),'full')
    )
  )+
  doorProcessingSection('swing');
}


const DOOR_PROCESSING_PRICES=Object.freeze({
  stopper:575,
  threshold:1840,
  porthole:1955,
  sliding:2875,
  petDoor:2875,
  skud:4025
});

function processingCheckboxRow(id,label,price,note=''){
  return `<div id="${id}Wrap" class="hidden full" data-active="0">
    <label class="check"><input id="${id}" type="checkbox"> <span><b>${escapeHtml(label)}</b> · +${formatRub(price)}${note?` · ${escapeHtml(note)}`:''}</span></label>
  </div>`;
}
function doorProcessingSection(mode='swing'){
  const rows=mode==='sliding'
    ?processingCheckboxRow('procSlidingMilling','Фрезеровка под откатную систему',DOOR_PROCESSING_PRICES.sliding)
    :[
      processingCheckboxRow('procStopperMilling','Фрезеровка под скрытый стопор',DOOR_PROCESSING_PRICES.stopper),
      processingCheckboxRow('procThresholdMilling','Фрезеровка под автопорог',DOOR_PROCESSING_PRICES.threshold),
      processingCheckboxRow('procPortholeCut','Врезка иллюминатора',DOOR_PROCESSING_PRICES.porthole),
      processingCheckboxRow('procPetDoorCut','Врезка дверцы для животного',DOOR_PROCESSING_PRICES.petDoor),
      processingCheckboxRow('procSkudLockCut','Врезка замка СКУД-системы',DOOR_PROCESSING_PRICES.skud,'цена в прайсе указана «от 4 025 ₽»')
    ].join('');
  return '<div id="doorProcessingSectionWrap" class="hidden">'+section('Дополнительные обработки',
    '<div class="catalog-note">Работа появляется автоматически при выборе связанной фурнитуры и включена по умолчанию. Галочку можно снять, если изделие нужно отдать без заводской обработки.</div>'+
    '<div class="fields" style="margin-top:12px">'+rows+'</div>'
  )+'</div>';
}
function isHiddenStopperForProcessing(name){
  return /скрыт|secret|fantom|stang/i.test(String(name||''));
}
function isSkudLockForProcessing(name){
  return /скуд|электромагнит|электромехан|svp\s*6000|антипаник/i.test(String(name||''));
}
function selectedDoorExtraProcessingKind(name){
  const s=String(name||'');
  if(/иллюминатор/i.test(s))return 'porthole';
  if(/дверц.*живот|животн.*дверц|pet\s*door/i.test(s))return 'petDoor';
  return '';
}
function syncProcessingCheckbox(id,active,sourceKey=''){
  const wrap=$(id+'Wrap'),box=$(id);
  if(!wrap||!box)return;
  const wasActive=wrap.dataset.active==='1';
  const previousSource=wrap.dataset.source||'';
  const nextSource=active?String(sourceKey||'active'):'';
  if(active&&(!wasActive||previousSource!==nextSource))box.checked=true;
  if(!active)box.checked=false;
  wrap.classList.toggle('hidden',!active);
  wrap.dataset.active=active?'1':'0';
  wrap.dataset.source=nextSource;
}
function syncDoorProcessingOptions(){
  if(product()==='sliding42'){
    const system=$('slidingSystem')?.value||'';
    const active=!!system&&system!=='Без системы';
    syncProcessingCheckbox('procSlidingMilling',active,system);
    $('doorProcessingSectionWrap')?.classList.toggle('hidden',!active);
    return;
  }
  if(!['single42','single59','double42'].includes(product()))return;
  const stopper=$('doorStopper')?.value?.trim()||'';
  const threshold=$('doorThreshold')?.value?.trim()||'';
  const lock=$('doorLock')?.value?.trim()||'';
  const extra=$('doorExtra')?.value?.trim()||'';
  const extraKind=selectedDoorExtraProcessingKind(extra);
  const stopperActive=!!stopper&&isHiddenStopperForProcessing(stopper);
  const thresholdActive=!!threshold;
  const portholeActive=extraKind==='porthole';
  const petDoorActive=extraKind==='petDoor';
  const skudActive=!!lock&&isSkudLockForProcessing(lock);
  syncProcessingCheckbox('procStopperMilling',stopperActive,stopper);
  syncProcessingCheckbox('procThresholdMilling',thresholdActive,threshold);
  syncProcessingCheckbox('procPortholeCut',portholeActive,extra);
  syncProcessingCheckbox('procPetDoorCut',petDoorActive,extra);
  syncProcessingCheckbox('procSkudLockCut',skudActive,lock);
  const anyActive=stopperActive||thresholdActive||portholeActive||petDoorActive||skudActive;
  $('doorProcessingSectionWrap')?.classList.toggle('hidden',!anyActive);
}

function single59GlassSidesCount(){
  return ['SingleSide1Type','SingleSide2Type'].filter(id=>$(id)?.value==='Стекло/зеркало').length;
}
function recommendedHingeFamily(){
  if(product()==='single42')return 'K8060';
  if(product()==='single59')return single59GlassSidesCount()>0?'K2760':'K6360/38';
  return '';
}
function recommendedHingeQty(){
  const h=currentHeight();
  if(product()==='single42'){
    return h<=2300?2:null;
  }
  if(product()==='single59'){
    const glass=single59GlassSidesCount();
    if(glass===0)return h<=2400?2:3;
    if(glass===1)return h<=2200?2:3;
    return h<=2300?3:4;
  }
  return null;
}
function recommendedHingeColorTerms(){
  const edge=$('SingleEdgeColor')?.value||'';
  const family=recommendedHingeFamily();
  if(edge==='Черный анод'){
    if(family==='K6360/38')return ['цвет - черный','цвет черный',' nr'];
    return ['цвет - черный','цвет черный',' no '];
  }
  if(edge==='Серый анод')return ['матовый хром','хром мат',' cs ','мат хром'];
  if(edge==='Золотой анод')return ['матовое золото','мат. золото',' os ','сатинированное золото'];
  return [];
}
function itemMatchesHingeFamily(item,family){
  const s=(' '+String(item||'').toLowerCase()+' ');
  if(family==='K8060')return s.includes('k8060')||s.includes('к8060');
  if(family==='K6360/38')return s.includes('k6360/38')||s.includes('к6360/38');
  if(family==='K2760')return (s.includes('k2760')||s.includes('к2760'))&&!s.includes('аналог');
  return false;
}
function hardwarePricePresentation(category,name,qty=1){
  const meta=hardwareSalesPriceMeta(category,name,activeSalesPriceType());
  if(!meta)return '<span class="mini">Цена для этой позиции пока не подключена.</span>';
  if(meta.price===null||meta.suspicious)return '<span class="hinge-price-unset">Цена по запросу</span><span class="mini"> · исходная цена требует решения.</span>';
  const q=Math.max(1,Number(qty)||1);
  const activeLabel=typeof salesPriceTypeLabel==='function'?salesPriceTypeLabel(meta.priceType):(meta.priceType==='wholesale2'?'Опт 2':meta.priceType==='wholesale1'?'Опт 1':'Розница');
  let html='<b>'+formatRub(meta.price)+'/шт.</b>'+(q>1?' · '+q+' шт. = <b>'+formatRub(meta.price*q)+'</b>':'')+
    '<span class="mini"> · '+activeLabel+'</span>';
  if(meta.opt2Eligible){
    html+='<div class="mini">Опт 2 '+formatRub(meta.opt2Price)+'/шт. · Опт 1 '+formatRub(meta.opt1Price)+'/шт. · Розница '+formatRub(meta.retailPrice)+'/шт.</div>';
  }else{
    html+='<div class="mini">Отдельная Опт 2 цена пока не задана — используется розница.</div>';
  }
  return html;
}
function hingePriceHtml(name,qty=1){
  return hardwarePricePresentation('Петли',name,qty);
}
function hingeCardPriceText(name){
  const meta=hardwareSalesPriceMeta('Петли',name,activeSalesPriceType());
  if(!meta)return 'Цена пока не подключена';
  if(meta.price===null||meta.suspicious)return 'Цена по запросу';
  return meta.opt2Eligible
    ?salesPriceTypeLabel(meta.priceType)+' · '+formatRub(meta.price)+' / шт. · Опт 2 '+formatRub(meta.opt2Price)+' · Опт 1 '+formatRub(meta.opt1Price)+' · Розница '+formatRub(meta.retailPrice)
    :'Розница · '+formatRub(meta.retailPrice)+' / шт.';
}
function hingeCatalogPriceSummary(items){
  const metas=(items||[]).map(name=>hardwareBasePriceMeta('Петли',name));
  const prices=metas.map(x=>x?.price).filter(x=>Number.isFinite(Number(x))&&Number(x)>0).map(Number);
  const unresolved=metas.filter(x=>x&&x.price===null).length;
  const missing=metas.filter(x=>!x).length;
  const overrides=metas.filter(x=>x?.priceOverride).length;
  const suspicious=metas.filter(x=>x?.suspicious).length;
  return {
    priced:prices.length,
    unresolved,
    missing,
    overrides,
    suspicious,
    min:prices.length?Math.min(...prices):null,
    max:prices.length?Math.max(...prices):null
  };
}
function updateDoorHingePriceHint(){
  const box=$('doorHingePriceHint');if(!box)return;
  const name=$('doorHinges')?.value?.trim()||'';
  const qty=Number($('doorHingeQty')?.value||1);
  box.innerHTML=name?hingePriceHtml(name,qty):'Выберите петлю.';
}
function updateDoorLockPriceHint(){
  const box=$('doorLockPriceHint');if(!box)return;
  const name=$('doorLock')?.value?.trim()||'';
  if(!name){box.innerHTML='Выберите замок.';return}
  box.innerHTML=hardwarePricePresentation('Замки',name,1);
}
function updateDoorHandlePriceHint(){
  const box=$('doorHandlePriceHint');if(!box)return;
  const name=$('doorHandle')?.value?.trim()||'';
  if(!name){box.innerHTML='Выберите ручку.';return}
  box.innerHTML=hardwarePricePresentation('Ручки',name,1);
}
function updateDoorTurnPriceHint(){
  const box=$('doorTurnPriceHint');if(!box)return;
  const name=$('doorTurn')?.value?.trim()||'';
  if(!name){box.innerHTML='Выберите завертку.';return}
  box.innerHTML=hardwarePricePresentation('Завертки',name,1);
}
function updateDoorCylinderPriceHint(){
  const box=$('doorCylinderPriceHint');if(!box)return;
  const name=$('doorCylinder')?.value?.trim()||'';
  if(!name){box.innerHTML='Выберите цилиндр.';return}
  box.innerHTML=hardwarePricePresentation('Цилиндровые механизмы',name,1);
}
function updateDoorStopperPriceHint(){
  const box=$('doorStopperPriceHint');if(!box)return;
  const name=$('doorStopper')?.value?.trim()||'';
  if(!name){box.innerHTML='Выберите стопор.';return}
  box.innerHTML=hardwarePricePresentation('Стопоры',name,1);
}
function updateDoorThresholdPriceHint(){
  const box=$('doorThresholdPriceHint');if(!box)return;
  const name=$('doorThreshold')?.value?.trim()||'';
  if(!name){box.innerHTML='Выберите автоматический порог.';return}
  box.innerHTML=hardwarePricePresentation('Скрытый порог',name,1);
}
function updateDoorCloserPriceHint(){
  const box=$('doorCloserPriceHint');if(!box)return;
  const name=$('doorCloser')?.value?.trim()||'';
  if(!name){box.innerHTML='Выберите доводчик.';return}
  box.innerHTML=hardwarePricePresentation('Доводчики',name,1);
}
function updateSlidingHandlePriceHint(){
  const box=$('slidingHandlePriceHint');if(!box)return;
  const name=$('slidingHandle')?.value||'Без ручки';
  if(!name||name==='Без ручки'){box.innerHTML='Ручка не добавляется в заказ.';return}
  box.innerHTML=hardwarePricePresentation('Ручки',name,1);
}
function updateSlidingSystemPriceHint(){
  const box=$('slidingSystemPriceHint');if(!box)return;
  const selected=$('slidingSystem')?.value||'Без системы';
  if(!selected||selected==='Без системы'){box.innerHTML='Система открывания не добавляется в заказ.';return}
  box.innerHTML=hardwarePricePresentation('Системы открывания',openingSystemPriceName(selected),1);
}
function hardwareCategoryPriceSummary(category,items){
  const metas=(items||[]).map(name=>hardwareBasePriceMeta(category,name));
  const prices=metas.filter(x=>x&&!x.suspicious).map(x=>x.price).filter(x=>Number.isFinite(Number(x))&&Number(x)>0).map(Number);
  return {
    total:(items||[]).length,
    priced:prices.length,
    unresolved:metas.filter(x=>x&&(x.price===null||x.suspicious)).length,
    overrides:metas.filter(x=>x?.priceOverride).length,
    missing:metas.filter(x=>!x).length,
    min:prices.length?Math.min(...prices):null,
    max:prices.length?Math.max(...prices):null
  };
}
function renderHardwareCategoryPriceSummary(category,items){
  const box=$('hardwarePriceSummary');if(!box)return;
  if(!['Петли','Замки','Ручки','Завертки','Цилиндровые механизмы','Стопоры','Скрытый порог','Доводчики','Системы открывания'].includes(category)){box.classList.add('hidden');box.innerHTML='';return}
  const summary=hardwareCategoryPriceSummary(category,items);
  const opt2Count=(items||[]).filter(name=>hardwarePartnerOpt2Eligible(category,name)).length;
  box.classList.remove('hidden');
  box.className='hinge-price-summary';
  box.innerHTML='<div><b>Розничные цены</b> · '+summary.priced+' из '+summary.total+' позиций с рабочей ценой'+
    (summary.min!==null?' · диапазон <b>'+formatRub(summary.min)+' — '+formatRub(summary.max)+'</b>':'')+'</div>'+
    (opt2Count?'<div class="mini">Опт 2 / Опт 1 / Розница подключены для '+opt2Count+' согласованных позиций K8060 / K6360/38 / K2760 / Vantage.</div>':
      '<div class="mini">Для этой выборки отдельная Опт 2 цена пока не задана — действует розница.</div>');
}
function renderHardwareSelectedPrice(){
  const box=$('hardwareSelectedPrice');if(!box)return;
  const uiCategory=$('hardwareCategory')?.value||'';
  const category=HARDWARE_MAP[uiCategory]||uiCategory;
  const item=$('catalogItem')?.value||'';
  if(!['Петли','Замки','Ручки','Завертки','Цилиндровые механизмы','Стопоры','Скрытый порог','Доводчики','Системы открывания'].includes(category)){
    box.classList.add('hidden');box.innerHTML='';return;
  }
  const meta=hardwareSalesPriceMeta(category,item,activeSalesPriceType());
  box.classList.remove('hidden');
  if(!meta){
    box.className='status warn';
    box.innerHTML='<b>Цена пока не подключена.</b><br>Для этой позиции нет точного соответствия в текущем каталоге цен.';
    return;
  }
  if(meta.price===null||meta.suspicious){
    box.className='status warn';
    box.innerHTML='<b>Цена по запросу / проверить источник.</b><br><span class="mini">Исходная цена: '+(meta.sourceBase===null?'не заполнена':formatRub(meta.sourceBase))+' · Parent ID '+escapeHtml(meta.parentId)+'</span>';
    return;
  }
  box.className='status ok';
  if(meta.opt2Eligible){
    box.innerHTML='<b>'+salesPriceTypeLabel(meta.priceType)+': '+formatRub(meta.price)+'/шт.</b><br>'+
      '<span class="mini">Опт 2 '+formatRub(meta.opt2Price)+' · Опт 1 '+formatRub(meta.opt1Price)+' · Розница '+formatRub(meta.retailPrice)+'. Три типа цены действуют для K8060 / K6360/38 / K2760 и магнитных Vantage.</span>';
  }else{
    box.innerHTML='<b>Розница: '+formatRub(meta.retailPrice)+'/шт.</b><br><span class="mini">Отдельная Опт 2 цена для этой позиции пока не задана.</span>';
  }
}

function recommendedHingeItem(){
  const family=recommendedHingeFamily();
  const all=catalogValues('Петли');
  const familyItems=all.filter(x=>itemMatchesHingeFamily(x,family)&&!/колпач/i.test(x));
  const terms=recommendedHingeColorTerms();
  if(terms.length){
    const byColor=familyItems.find(item=>{
      const s=(' '+item.toLowerCase()+' ');
      return terms.some(t=>s.includes(t));
    });
    if(byColor)return byColor;
  }
  return familyItems[0]||'';
}
function syncRecommendedDoorHinge(forceItem=true,forceQty=true){
  if(!['single42','single59'].includes(product()))return;
  const hinge=$('doorHinges'),qty=$('doorHingeQty'),hint=$('doorHingeQtyHint');
  if(hinge&&forceItem){
    const rec=recommendedHingeItem();
    if(rec)hinge.value=rec;
  }
  if(qty&&forceQty){
    const q=recommendedHingeQty();
    qty.value=q==null?'':q;
  }
  if(hint){
    const family=recommendedHingeFamily();
    const q=recommendedHingeQty();
    if(product()==='single42' && q==null){
      hint.textContent=`Рекомендация: ${family}. Для выбранной высоты количество не задано.`;
    }else{
      hint.textContent=`Рекомендация: ${family}; количество по утверждённой таблице — ${q||'—'} шт.`;
    }
  }
  updateDoorHingePriceHint();
}
const HARDWARE_BRAND_RULES=[
  ['Armadillo',['armadillo','comfort-pro synchron soft','pro synchron soft']],
  ['Morelli',['morelli','lux-spindle','bridge r6','fiord-sm','180-twice','90-twice']],
  ['FUARO',['fuaro']],
  ['Puerto',['puerto']],
  ['Punto',['punto']],
  ['Rucetti',['rucetti','ruccetti','rucceti']],
  ['Vantage',['vantage']],
  ['Pallini',['pallini']],
  ['AGB',['agb','агб']],
  ['Krona Koblenz / KUBICA',['kubica','k8060','к8060','k6360/38','к6360/38','krona koblenz']],
  ['Renz',['renz','ренц']],
  ['Abriss',['abriss','abris r50.177']],
  ['Fantom',['fantom']],
  ['Ajax',['ajax','bk6.k.js51']],
  ['Vettore',['vettore','vеttore']],
  ['Guardian / Гардиан',['guardian','гардиан']],
  ['Avers',['avers']],
  ['GEZE',['geze']],
  ['GTV',['gtv']],
  ['NOTEDO',['notedo']],
  ['ABLOY',['abloy']],
  ['Profile Doors',['profiledoors','profile doors','система открывания pivot']],
  ['Крит',['крит']],
  ['Aprile',['aprile']],
  ['Code Deco',['code deco']],
  ['Formani',['formani']],
  ['Forme',['forme']],
  ['Porta di Parma',['porta di parma']],
  ['Sillur',['sillur']],
  ['Аллюр',['аллюр','аллур']],
  ['Archie',['archie']],
  ['ALeko',['aleko']],
  ['Aldeghi',['aldeghi']],
  ['Apecs',['apecs']],
  ['Pro Design',['pro design']],
  ['Bonaiti',['bonaiti']],
  ['Fratelli Cattini',['fratelli cattini']],
  ['Hafele',['hafele']],
  ['Sicma',['sicma']],
  ['B-Double',['b-double']],
  ['Eclisse',['eclisse']],
  ['STANG',['stang']],
  ['Venezia',['venezia']],
  ['FORTAUR',['fortaur']],
  ['НОРА-М',['нора-м','нора м']],
  ['Interta',['interta']],
  ['dormakaba',['svp 6000']],
  ['Болид',['болид']],
  ['HOME',['home']],
  ['Easy Block',['easy block']],
  ['STD',['std']]
];

function hardwareBrandForItem(item){
  const s=String(item||'').toLowerCase();
  for(const [brand,needles] of HARDWARE_BRAND_RULES){
    if(needles.some(x=>s.includes(x)))return brand;
  }
  return 'Не определено';
}

const HARDWARE_TYPE_ORDER={
  'Петли':['Скрытые','Барные / маятниковые','Ввертные','Карточные / универсальные / бабочки (в т.ч. 36 мм)','Комплектующие к петлям','Прочие / проверить'],
  'Замки':['Сантехнические / WC / межкомнатные защёлки','Под цилиндр','Задвижки / ригели','Специальные системы / СКУД / антипаника','Комплектующие к замкам','Прочие / проверить'],
  'Ручки':['Основные / для распашных дверей','Для откатных / раздвижных дверей','Скрытые / интегрированные','Ручки-скобы','Ручки-защёлки / специальные','Прочие / проверить'],
  'Завертки':['Сантехнические завертки / WC','Накладки под цилиндр','Вставки / вертушки на шток','Прочие / проверить'],
  'Цилиндры':['Ключ / ключ','Ключ / вертушка','Прочие / проверить'],
  'Стопоры':['Магнитные','Обычные / механические'],
  'Автоматические пороги':['Автоматические пороги'],
  'Доводчики':['Скрытые / врезные','Накладные со скользящей тягой','Накладные / прочие'],
  'Системы открывания':['Раздвижные / скрытые','Складные','Рото','Pivot','Прочие системы']
};

function hardwareTypeForItem(category,item){
  const s=String(item||'').toLowerCase();

  if(category==='Петли'){
    if(/колпач/.test(s))return 'Комплектующие к петлям';
    if(/скрыт|eclipse|kubica|atomika|u3d3000|morelli ch-0[12]/.test(s))return 'Скрытые';
    if(/барн|двусторонн|aldeghi code 87/.test(s))return 'Барные / маятниковые';
    if(/вверт|ввинт/.test(s))return 'Ввертные';
    return 'Карточные / универсальные / бабочки (в т.ч. 36 мм)';
  }

  if(category==='Замки'){
    if(/ответная планка/.test(s))return 'Комплектующие к замкам';
    if(/электромагнит|электромехан|антипаник|скуд|svp 6000/.test(s))return 'Специальные системы / СКУД / антипаника';
    if(/задвиж/.test(s))return 'Задвижки / ригели';
    if(/mc85|мс85/.test(s))return 'Сантехнические / WC / межкомнатные защёлки';
    if(/под (ключевой )?цилиндр|m1885|mediana polaris|plastlp85|minilock|без цм/.test(s))return 'Под цилиндр';
    if(/m1895|mc96|мс96|km 003|ip wc|soft 1 ?m|с\/у шар|сант|touch|защел|защёл|lp6-45/.test(s))return 'Сантехнические / WC / межкомнатные защёлки';
    return 'Прочие / проверить';
  }

  if(category==='Ручки'){
    if(/раздвиж|откат/.test(s))return 'Для откатных / раздвижных дверей';
    if(/agb zero|скрытая дверная ручка|скрытая ручка/.test(s))return 'Скрытые / интегрированные';
    if(/ручка-скоба|ручка скоба/.test(s))return 'Ручки-скобы';
    if(/ручка-защел|ручка-защёл/.test(s))return 'Ручки-защёлки / специальные';
    return 'Основные / для распашных дверей';
  }

  if(category==='Завертки'){
    if(/накладк.*цилиндр|накладка на (?:евро|ключевой )?цилиндр/.test(s))return 'Накладки под цилиндр';
    if(/вставк.*шток|вертуш.*шток/.test(s))return 'Вставки / вертушки на шток';
    if(/зав[её]рт|wc[- .]|сантех.*фиксатор/.test(s))return 'Сантехнические завертки / WC';
    return 'Прочие / проверить';
  }

  if(category==='Цилиндры'){
    if(/ключ\/верт|ключ\/повор|ключ\/бараш|ck\b|zc\b|knob/i.test(s))return 'Ключ / вертушка';
    if(/ключ\/ключ|key\b|\bc\b/i.test(s))return 'Ключ / ключ';
    return 'Прочие / проверить';
  }

  if(category==='Стопоры'){
    return /магнит/.test(s)?'Магнитные':'Обычные / механические';
  }

  if(category==='Автоматические пороги'){
    return 'Автоматические пороги';
  }

  if(category==='Доводчики'){
    if(/скрыт|врезн|boxer|aktivstop|dc80/i.test(s))return 'Скрытые / врезные';
    if(/скольз/.test(s))return 'Накладные со скользящей тягой';
    return 'Накладные / прочие';
  }

  if(category==='Системы открывания'){
    if(/pivot|пивот/.test(s))return 'Pivot';
    if(/рото|roto/.test(s))return 'Рото';
    if(/склад|compack|book|книж/.test(s))return 'Складные';
    if(/раздвиж|пенал|кассет|hidden|invisible|magic|slid|pocket/.test(s))return 'Раздвижные / скрытые';
    return 'Прочие системы';
  }

  return 'Все позиции';
}

function selectedDoorLockType(){
  const lock=$('doorLock')?.value?.trim()||'';
  if(!lock)return '';
  return hardwareTypeForItem('Замки',lock);
}
function doorLockRequiresCylinder(){
  return ['single42','single59'].includes(product()) && selectedDoorLockType()==='Под цилиндр';
}
function updateDoorCylinderField(){
  if(!['single42','single59'].includes(product()))return;
  const wrap=$('doorCylinderFieldWrap');
  const cylinder=$('doorCylinder');
  const required=doorLockRequiresCylinder();
  wrap?.classList.toggle('hidden',!required);
  if(cylinder){
    cylinder.required=required;
    if(!required)cylinder.value='';
  }
}

function hardwareTypeGroups(){
  const c=$('hardwareCategory'); if(!c)return [];
  const category=c.value;
  const vals=catalogValues(HARDWARE_MAP[category]);
  const groups={};
  vals.forEach(item=>{
    const type=hardwareTypeForItem(category,item);
    (groups[type]||(groups[type]=[])).push(item);
  });
  const order=HARDWARE_TYPE_ORDER[category]||['Все позиции'];
  return Object.entries(groups)
    .map(([type,items])=>({type,items}))
    .sort((a,b)=>{
      const ai=order.indexOf(a.type),bi=order.indexOf(b.type);
      if(ai!==-1||bi!==-1)return (ai===-1?999:ai)-(bi===-1?999:bi);
      return b.items.length-a.items.length||a.type.localeCompare(b.type,'ru');
    });
}


const HINGE_IMAGE_LIBRARY={
  kronaK8060:{
    image:'https://www.kronakoblenz.com/products/imports/koblenz/Cerniere/atomika/8060/image-thumb__8556__productGalleryItem/dettaglio-atomika-k8060-01.webp',
    source:'Krona Koblenz',status:'model'
  },
  kronaK6360:{
    image:'https://www.kronakoblenz.com/products/imports/koblenz/Cerniere/kubica/6360-38/image-thumb__10184__productGalleryItem/dettagli-kubica-k6360-38.webp',
    source:'Krona Koblenz',status:'model'
  },
  kronaK2760:{
    image:'https://www.kronakoblenz.com/products/imports/koblenz/Cerniere/kubica/2760/image-thumb__8604__productGalleryItem/dettagli-kubica-k2760.webp',
    source:'Krona Koblenz',status:'model'
  },
  kronaK1019:{
    image:'https://www.kronakoblenz.com/products/imports/koblenz/Cerniere/kombi/1019/image-thumb__6881__productDetailImage/tec1-kombi-k1019.webp',
    source:'Krona Koblenz',status:'model'
  },
  armadilloU3D_AB:{
    image:'https://www.chameleon-doors.ru/images/furnitura/dvernye-petli/49119_01.jpg',
    source:'Armadillo / дилер',status:'exact'
  },
  armadilloU3D_BL:{
    image:'https://www.chameleon-doors.ru/images/furnitura/dvernye-petli/48927_01.jpg',
    source:'Armadillo / дилер',status:'exact'
  },
  armadilloU3D_FSG:{
    image:'https://www.chameleon-doors.ru/images/furnitura/dvernye-petli/49215_01.jpg',
    source:'Armadillo / дилер',status:'exact'
  },
  armadilloU3D_SC:{
    image:'https://www.chameleon-doors.ru/images/furnitura/dvernye-petli/49117_01.jpg',
    source:'Armadillo / дилер',status:'exact'
  },
  armadilloU3D_WH:{
    image:'https://www.chameleon-doors.ru/images/furnitura/dvernye-petli/48929_01.jpg',
    source:'Armadillo / дилер',status:'exact'
  },
  morelliCH01_BL:{
    image:'https://www.chameleon-doors.ru/images/furnitura/dvernye-petli/morelli_ch01_black.jpg',
    source:'Morelli / дилер',status:'exact'
  },
  morelliCH01_SC:{
    image:'https://www.chameleon-doors.ru/images/furnitura/dvernye-petli/morelli_ch01_chrome.jpg',
    source:'Morelli / дилер',status:'exact'
  },
  morelliCH01_GOLD:{
    image:'https://www.chameleon-doors.ru/images/furnitura/dvernye-petli/morelli_ch01_gold.jpg',
    source:'Morelli / дилер',status:'model'
  },
  agbEclipse3_SC:{
    image:'https://www.chameleon-doors.ru/images/furnitura/dvernye-petli/35565_01.jpg',
    source:'AGB / дилер',status:'exact'
  },
  agbEclipse3_BL:{
    image:'https://www.chameleon-doors.ru/images/furnitura/dvernye-petli/39671_01.jpg',
    source:'AGB / дилер',status:'exact'
  },
  agbEclipse2_WHITE:{
    image:'https://static.wixstatic.com/media/0ccf67_69589b47b82a4cc6ac8c594fefc82bbb~mv2.jpg/v1/fill/w_980%2Ch_980%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/0ccf67_69589b47b82a4cc6ac8c594fefc82bbb~mv2.jpg',
    source:'AGB / дилер',status:'exact'
  },
  agbEclipse2_BRONZE:{
    image:'https://www.tuttoferramenta.it/image_product/AL015583-188930/cerniera-eclipse-2-0-agb-a-scomparsa-regolabile-porta-filo-colore-bronzato-verniciato.jpg',
    source:'AGB / дилер',status:'exact'
  },
  agbScrew3D:{
    image:'https://palladium.ru/upload/medialibrary/ae5/3D_regulirovka-vvertnye-petli.jpg',
    source:'Техническое изображение',status:'family'
  },
  apecsCardChrome:{
    image:'https://cdn.vseinstrumenti.ru/images/goods/krepezh/metizy/707934/1000x1000/72374144.jpg',
    source:'Apecs / дилер',status:'exact'
  },
  fuaroIN4400_SSG:{
    image:'https://www.tlock.ru/photo_bank/46349_01.jpg',
    source:'FUARO / дилер',status:'exact'
  },
  aldeghiCode87:{
    image:'https://zamkitut.com/upload/medialibrary/1b0/1b0801457b42c06f34f52951354ccd81.png.webp',
    source:'Техническое изображение',status:'family'
  }
};

function hingeModelFromName(item){
  const s=String(item||'');
  if(/колпач/i.test(s)&&/[КK]8060/i.test(s))return 'Колпачки K8060';
  if(/Eclipse 2\.0/i.test(s))return 'Eclipse 2.0';
  if(/Eclipse 3\.0/i.test(s))return 'Eclipse 3.0';
  if(/3-D серия/i.test(s))return 'AGB 3-D';
  if(/CODE 87/i.test(s))return 'CODE 87 AO 155-50';
  if(/115\*23-3D-Z-BLM/i.test(s))return '115×23-3D-Z-BLM';
  if(/100\*70-B4-Steel/i.test(s))return '100×70-B4-Steel';
  if(/ALH\.125\.5/i.test(s))return 'ALH.125.5';
  if(/U3D3000\.VPG/i.test(s))return 'U3D3000.VPG';
  if(/IN4500W-BL/i.test(s))return 'IN4500W-BL';
  if(/IN4400U/i.test(s))return 'IN4400U';
  if(/IN4200U/i.test(s))return 'IN4200U';
  if(/[КK]8060/i.test(s))return 'K8060';
  if(/[КK]6360\/38/i.test(s))return 'K6360/38';
  if(/[КK]1019/i.test(s))return 'K1019';
  if(/[КK]2760/i.test(s))return 'K2760';
  if(/CH-01/i.test(s))return 'CH-01';
  if(/CH-02/i.test(s))return 'CH-02';
  if(/IN4100U/i.test(s))return 'IN4100U';
  return hardwareBrandForItem(s);
}
function hingeColorFromName(item){
  const s=String(item||'').toLowerCase();
  if(/черн|nero/.test(s))return 'Чёрный';
  if(/бел|white|\bwh\b/.test(s))return 'Белый';
  if(/флор.*золот|fsg/.test(s))return 'Флорентийское золото';
  if(/итал.*мат.*золот|ftg/.test(s))return 'Итальянское матовое золото';
  if(/мат.*сатин.*золот|msg/.test(s))return 'Матовое сатинированное золото';
  if(/сатин.*золот|сатинирован.*золот|\bssg\b|\bav\b/.test(s))return 'Сатинированное золото';
  if(/матов.*золот|мат.*золот|матово золото|\bos\b|\bsb\b/.test(s))return 'Матовое золото';
  if(/глянец золото|глянц.*золот|\bol\b/.test(s))return 'Глянцевое золото';
  if(/мат.*хром|хром мат|\bsc\b|\bcs\b/.test(s))return 'Матовый хром';
  if(/хром|\bcp\b/.test(s))return 'Хром';
  if(/мат.*никел|никел.*мат|\bsn\b|\bns\b|\bpn\b/.test(s))return 'Матовый никель';
  if(/бронз|\bab\b/.test(s))return 'Бронза';
  if(/мед|\bac\b/.test(s))return 'Медь';
  if(/латун|\bpb\b/.test(s))return 'Латунь';
  if(/бихром/.test(s))return 'Бихром';
  return 'Цвет по карточке';
}
function hingeColorChip(color){
  return ({
    'Чёрный':'#202124','Белый':'#f5f5f2','Матовый хром':'#c8cbd0','Хром':'#dde1e5',
    'Матовый никель':'#b7b2a7','Сатинированное золото':'#c1a55e','Матовое золото':'#bba15d',
    'Глянцевое золото':'#d3b33f','Флорентийское золото':'#c8a05a',
    'Итальянское матовое золото':'#bca365','Матовое сатинированное золото':'#b9a261',
    'Бронза':'#8c6846','Медь':'#a96d4d','Латунь':'#c3a05c','Бихром':'#b2a478'
  })[color]||'#d1d5db';
}
function hingeUseCase(item){
  const type=hardwareTypeForItem('Петли',item);
  const s=String(item||'');
  if(/колпач/i.test(s)&&/[КK]8060/i.test(s))return 'Комплектующие K8060 · 42 мм';
  if(/[КK]8060/i.test(s))return '42 мм';
  if(/[КK]6360\/38/i.test(s))return '59 мм';
  if(/[КK]2760/i.test(s))return '59 мм + стекло/зеркало';
  if(/CH-01/i.test(s))return '59 мм + стекло/зеркало · аналог K2760';
  if(/CH-02/i.test(s))return '59 мм · аналог K6360';
  if(type==='Барные / маятниковые')return 'Барная / маятниковая';
  if(type==='Ввертные')return 'Ввертная';
  if(type==='Карточные / универсальные / бабочки (в т.ч. 36 мм)')return 'Карточная / универсальная';
  if(type==='Комплектующие к петлям')return 'Комплектующие';
  return 'Скрытая · ручной выбор';
}
function hingePlaceholderSvg(model,type){
  const label=encodeURIComponent((model||'Петля').slice(0,30));
  const sub=encodeURIComponent((type||'Фото уточняется').slice(0,34));
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="100%" height="100%" fill="#f7f7f8"/><rect x="130" y="120" width="540" height="560" rx="42" fill="#fff" stroke="#d1d5db" stroke-width="4"/><circle cx="400" cy="330" r="82" fill="#e5e7eb"/><path d="M330 500h140M300 545h200" stroke="#9ca3af" stroke-width="20" stroke-linecap="round"/><text x="400" y="620" text-anchor="middle" font-family="Arial" font-size="30" font-weight="700" fill="#374151">'+decodeURIComponent(label)+'</text><text x="400" y="660" text-anchor="middle" font-family="Arial" font-size="21" fill="#6b7280">'+decodeURIComponent(sub)+'</text></svg>';
  return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
}
function hingePhotoMeta(item){
  const s=String(item||'');
  const low=s.toLowerCase();
  const model=hingeModelFromName(s);
  let p=null;

  if(/[КK]8060/i.test(s) && !/колпач/i.test(s))p=HINGE_IMAGE_LIBRARY.kronaK8060;
  else if(/[КK]6360\/38/i.test(s))p=HINGE_IMAGE_LIBRARY.kronaK6360;
  else if(/[КK]2760/i.test(s))p=HINGE_IMAGE_LIBRARY.kronaK2760;
  else if(/[КK]1019/i.test(s))p=HINGE_IMAGE_LIBRARY.kronaK1019;
  else if(/U3D3000\.VPG/i.test(s)){
    if(/\bAB\b/i.test(s))p=HINGE_IMAGE_LIBRARY.armadilloU3D_AB;
    else if(/\bBL\b/i.test(s))p=HINGE_IMAGE_LIBRARY.armadilloU3D_BL;
    else if(/\bFSG\b/i.test(s))p=HINGE_IMAGE_LIBRARY.armadilloU3D_FSG;
    else if(/\bSC\b/i.test(s))p=HINGE_IMAGE_LIBRARY.armadilloU3D_SC;
    else if(/\bWH\b/i.test(s))p=HINGE_IMAGE_LIBRARY.armadilloU3D_WH;
  }
  else if(/CH-01/i.test(s)){
    if(/\bB\b/i.test(s))p=HINGE_IMAGE_LIBRARY.morelliCH01_BL;
    else if(/\bSC\b/i.test(s))p=HINGE_IMAGE_LIBRARY.morelliCH01_SC;
    else p=HINGE_IMAGE_LIBRARY.morelliCH01_GOLD;
  }
  else if(/Eclipse 3\.0/i.test(s))p=/черн/i.test(s)?HINGE_IMAGE_LIBRARY.agbEclipse3_BL:HINGE_IMAGE_LIBRARY.agbEclipse3_SC;
  else if(/Eclipse 2\.0/i.test(s)){
    if(/бел/i.test(s))p=HINGE_IMAGE_LIBRARY.agbEclipse2_WHITE;
    else if(/бронз/i.test(s))p=HINGE_IMAGE_LIBRARY.agbEclipse2_BRONZE;
    else p={...HINGE_IMAGE_LIBRARY.agbEclipse2_WHITE,status:'model'};
  }
  else if(/3-D серия/i.test(s))p=HINGE_IMAGE_LIBRARY.agbScrew3D;
  else if(/100\*70-B4-Steel/i.test(s))p=HINGE_IMAGE_LIBRARY.apecsCardChrome;
  else if(/IN4400U/i.test(s) && /SSG/i.test(s))p=HINGE_IMAGE_LIBRARY.fuaroIN4400_SSG;
  else if(/IN4400U/i.test(s))p={...HINGE_IMAGE_LIBRARY.fuaroIN4400_SSG,status:'model'};
  else if(/CODE 87/i.test(s))p=HINGE_IMAGE_LIBRARY.aldeghiCode87;
  else if(/колпач/i.test(s)&&/[КK]8060/i.test(s))p={...HINGE_IMAGE_LIBRARY.kronaK8060,status:'family'};

  if(!p){
    return {image:hingePlaceholderSvg(model,'Фото уточняется'),source:'Фото уточняется',status:'pending'};
  }
  return p;
}

function kronaHiddenStrictActive(){
  return $('hardwareCategory')?.value==='Петли'
    && $('hardwareType')?.value==='Скрытые'
    && $('hardwareBrand')?.value==='Krona Koblenz / KUBICA';
}

function kronaHiddenFinishAudit(item){
  const s=String(item||'');
  const pending=(code,note='')=>({
    makerCode:code||'—',
    image:hingePlaceholderSvg(hingeModelFromName(s),'Точное фото ещё не утверждено'),
    source:'Ожидает точного фото',
    photoStatus:'pending',
    reviewStatus:note?'warning':'pending',
    note
  });
  const exact=(code,image,source='KoblenzPetli · фото конкретного цвета',note='')=>({
    makerCode:code,image,source,photoStatus:'exact',reviewStatus:note?'warning':'ok',note
  });

  if(/K8060|К8060/i.test(s)){
    if(/цвет белый/i.test(s))return exact(
      'K8060 BI HD',
      'https://www.koblenzpetli.ru/atomika-k8060-bi.jpg',
      'KoblenzPetli · K8060 BI',
      'В нашей номенклатуре указан код BL, а актуальный код белого у производителя — BI. Нужно согласовать переименование кода.'
    );
    if(/CS HD/i.test(s))return exact('K8060 CS HD','https://www.koblenzpetli.ru/atomika-k8060-cs.jpg');
    if(/NO HD/i.test(s))return exact('K8060 NO HD','https://www.koblenzpetli.ru/atomika-k8060-no.jpg');
    if(/NS HD/i.test(s))return exact('K8060 NS HD','https://www.koblenzpetli.ru/atomika-k8060-ns.jpg');
    if(/OL HD/i.test(s))return exact('K8060 OL HD','https://www.koblenzpetli.ru/atomika-k8060-ol.jpg');
    if(/OS HD/i.test(s))return pending('K8060 OS HD','Код и цвет подтверждены как матовое золото; нужен проверенный packshot именно OS достаточного качества.');
  }

  if(/K6360\/38|К6360\/38|к6360\/38/i.test(s)){
    if(/\bBI\b/i.test(s))return exact(
      'K6360/38 BI',
      'https://krona-koblenz.ru/images/detailed/113/K6360_38_BI.jpg',
      'Krona-Koblenz.ru · согласованное точное фото белого'
    );
    if(/\bCS\b/i.test(s))return exact(
      'K6360/38 CS',
      'https://todoor.ru/shop-photos/kubica-hybrid-k6360-38-cm-crsat-petlja-skrytaja-universalnaja-asimmetrichnaja-cvet-matovyj-hrom-60kg.jpg',
      'ToDoor · согласованное точное фото матового хрома'
    );
    if(/\bNR\b/i.test(s))return pending('K6360/38 NR','Код NR подтверждён производителем для чёрного; нужен качественный packshot конкретного цвета.');
    if(/глянец/i.test(s))return pending('K6360/38 OL','Актуальный код производителя для глянцевого золота — OL; нужен точный packshot.');
    if(/\bOS\b/i.test(s))return pending('K6360/38 OS','Актуальный код производителя для матового/сатинированного золота — OS; нужен точный packshot.');
    if(/\bAV\b/i.test(s))return pending('K6360/38 AV','Код AV есть в нашей номенклатуре, но в актуальной таблице отделок производителя для K6360/38 используется OS. Нужна сверка: старое исполнение или дубль.');
  }

  if(/K2760|К2760/i.test(s)){
    if(/\bCS\b/i.test(s))return exact('K2760 CS','https://www.koblenzpetli.ru/kubica-k2760-cs.jpg');
    if(/\bNO\b/i.test(s))return exact('K2760 NO','https://www.koblenzpetli.ru/kubica-k2760-no.jpg');
    if(/\bBI\b/i.test(s))return exact('K2760 BI','https://www.koblenzpetli.ru/kubica-k2760-bi.jpg');
    if(/\bOS\s*CM\b/i.test(s))return pending(
      'K2760 OS CM',
      'Номенклатура исправлена по актуальному каталогу Krona Koblenz: матовое/сатинированное золото = K2760 OS CM. Точное предметное фото этого исполнения на официальном сайте пока не найдено.'
    );
    if(/\bOS\b/i.test(s))return exact(
      'K2760 OS',
      'https://krona-koblenz.ru/images/detailed/113/K2760_OS.jpg',
      'Krona-Koblenz.ru · согласованное точное фото K2760 OS'
    );
  }

  if(/K1019|К1019/i.test(s)){
    if(/мат\. хром|матовый хром|\bCS\b/i.test(s))return exact('K1019 CS','https://www.koblenzpetli.ru/kombi-k1019-cs.jpg');
    if(/\bOS\b/i.test(s))return exact('K1019 OS','https://www.koblenzpetli.ru/kombi-k1019-os.jpg');
  }

  return pending('—','Для этой позиции ещё не создана строгая карта отделки.');
}

function kronaAuditSummary(items){
  const audits=items.map(kronaHiddenFinishAudit);
  return {
    exact:audits.filter(x=>x.photoStatus==='exact').length,
    pending:audits.filter(x=>x.photoStatus!=='exact').length,
    warnings:audits.filter(x=>x.reviewStatus==='warning').length
  };
}

function hingePhotoStatusText(status){
  return status==='manual'?'Загружено вручную':status==='exact'?'Точное фото':status==='model'?'Фото модели':status==='family'?'Фото семейства / тех.':'Фото уточняется';
}
function hingeCurrentItems(){
  if($('hardwareCategory')?.value!=='Петли')return [];
  const brand=$('hardwareBrand')?.value||'';
  const group=hardwareBrandGroups().find(g=>g.brand===brand);
  return group?.items||[];
}
function renderHingeCatalogCards(){
  const wrap=$('hingeCatalogWrap'),grid=$('hingeCatalogGrid');
  if(!wrap||!grid)return;
  const visible=$('hardwareCategory')?.value==='Петли';
  wrap.classList.toggle('hidden',!visible);
  if(!visible){grid.innerHTML='';return}
  const selected=$('catalogItem')?.value||'';
  const items=hingeCurrentItems();
  const strict=kronaHiddenStrictActive();
  if($('hingeCatalogCount')){
    if(strict){
      const s=kronaAuditSummary(items);
      $('hingeCatalogCount').textContent=items.length+' позиций · '+s.exact+' точных фото · '+s.pending+' требуют фото · '+s.warnings+' требуют сверки номенклатуры';
    }else{
      $('hingeCatalogCount').textContent=items.length+' карточек в выбранном бренде/типе · 64 позиции в категории';
    }
  }
  const priceSummary=hingeCatalogPriceSummary(items);
  const priceBanner=items.length
    ?'<div class="hinge-price-summary"><div><b>Розничные цены</b> · '+priceSummary.priced+' из '+items.length+' позиций с рабочей ценой'+
      (priceSummary.min!==null?' · диапазон <b>'+formatRub(priceSummary.min)+' — '+formatRub(priceSummary.max)+'</b>':'')+
      '</div>'+
      ((priceSummary.unresolved||priceSummary.missing||priceSummary.suspicious||priceSummary.overrides)
        ?'<div class="mini">Контроль: проверить BASE — '+(priceSummary.unresolved+priceSummary.suspicious)+' · ручных корректировок — '+priceSummary.overrides+(priceSummary.missing?' · без привязки — '+priceSummary.missing:'')+'</div>'
        :'<div class="mini">Все позиции текущей выборки имеют рабочую розничную цену.</div>')+
      '</div>'
    :'';
  const banner=(strict?'<div class="krona-review-banner"><b>Эталонная ревизия Krona Koblenz / KUBICA → Скрытые.</b><br>Здесь запрещены приблизительные фотографии другого цвета. Карточка получает изображение только если подтверждён конкретный вариант отделки; иначе показывается честный placeholder. Код производителя и спорные места вынесены прямо в карточку.</div>':'')+priceBanner;
  grid.innerHTML=banner+items.map((item,i)=>{
    const model=hingeModelFromName(item);
    const color=hingeColorFromName(item);
    const type=hardwareTypeForItem('Петли',item);
    const useCase=hingeUseCase(item);
    const audit=strict?kronaHiddenFinishAudit(item):null;
    const manualPhoto=hardwareUserImageMeta('Петли',item);
    const photo=manualPhoto||(audit?{image:audit.image,source:audit.source,status:audit.photoStatus}:hingePhotoMeta(item));
    const auditHtml=audit?`<div class="krona-audit-row">
      <span class="krona-code">Код производителя: ${escapeHtml(audit.makerCode)}</span>
      ${audit.reviewStatus==='ok'?'<span class="krona-ok">Номенклатура сверена</span>':audit.reviewStatus==='warning'?'<span class="krona-warn">Проверить код / цвет</span>':'<span class="krona-pending">Фото / данные на проверке</span>'}
    </div>${audit.note?`<div class="krona-note">${escapeHtml(audit.note)}</div>`:''}`:'';
    const priceMeta=hardwareBasePriceMeta('Петли',item);
    const priceFlagHtml=priceMeta?.priceOverride
      ?'<div class="hinge-price-flag override">Ручная цена · исходный BASE '+formatRub(priceMeta.sourceBase)+'</div>'
      :(priceMeta&&(priceMeta.price===null||priceMeta.suspicious)
        ?'<div class="hinge-price-flag warning">Проверить цену · '+(priceMeta.sourceBase===null?'не заполнен':formatRub(priceMeta.sourceBase))+'</div>'
        :'');
    return `
      <button type="button" class="hinge-card ${item===selected?'active':''}" onclick="selectHingeCatalogCard(${i})" title="${escapeHtml(item)}">
        <div class="hinge-card-image">
          <img src="${escapeHtml(photo.image)}" alt="${escapeHtml(model+' — '+color)}" loading="lazy"
               onerror="this.src=hingePlaceholderSvg('${escapeHtml(model).replace(/'/g,"&#39;")}','Фото недоступно');this.onerror=null">
          ${catalogImageEditControl('hinge',i)}
        </div>
        <div class="hinge-card-body">
          <div class="hinge-card-model">${escapeHtml(model)}</div>
          <div class="hinge-card-price ${priceMeta&&(priceMeta.price===null||priceMeta.suspicious)?'unpriced':priceMeta?.priceOverride?'override':''}">${escapeHtml(hingeCardPriceText(item))}</div>
          ${priceFlagHtml}
          <div class="hinge-card-color-row"><span class="hinge-color-chip" style="background:${hingeColorChip(color)}"></span>${escapeHtml(color)}</div>
          <div class="hinge-card-use">${escapeHtml(useCase)}</div>
          ${auditHtml}
          <div class="hinge-card-meta">
            <span class="hinge-photo-status ${photo.status==='model'?'model':photo.status==='family'?'family':photo.status==='pending'?'pending':''}">${escapeHtml(hingePhotoStatusText(photo.status))}</span>
            <span class="hinge-type-tag">${escapeHtml(type)}</span>
          </div>
          <div class="hinge-card-name">${escapeHtml(item)}</div>
          <div class="hinge-card-source">${escapeHtml(photo.source)}</div>
        </div>
      </button>`;
  }).join('');
  grid.querySelectorAll('[data-image-edit-kind="hinge"]').forEach(control=>{
    const trigger=e=>{e.preventDefault();e.stopPropagation();const item=hingeCurrentItems()[Number(control.dataset.imageEditIndex)];if(item)openHardwareImageReplace('Петли',item)};
    control.addEventListener('click',trigger);
    control.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')trigger(e)});
  });
}
function selectHingeCatalogCard(index){
  const item=hingeCurrentItems()[index];
  if(!item)return;
  if($('catalogItem'))$('catalogItem').value=item;
  renderHingeCatalogCards();
  renderHardwareCatalogCards();
  renderHardwareSelectedPrice();
  render();
}

function renderHardwareTypeTiles(){
  const wrap=$('hardwareTypeWrap'),box=$('hardwareTypeTiles');
  if(!wrap||!box)return;
  const groups=hardwareTypeGroups();
  const selected=$('hardwareType')?.value||'';
  const onlyAll=groups.length===1&&groups[0].type==='Все позиции';
  wrap.classList.toggle('hidden',onlyAll);
  box.innerHTML=onlyAll?'':groups.map(g=>`
    <button type="button" class="hardware-type ${g.type===selected?'active':''}" onclick="selectHardwareType('${escapeHtml(g.type).replace(/'/g,"&#39;")}')">
      <span class="brand-name">${escapeHtml(g.type)}</span>
      <span class="brand-count">${g.items.length} поз.</span>
    </button>`).join('');
}

function hardwareBrandGroups(){
  const c=$('hardwareCategory'); if(!c)return [];
  const type=$('hardwareType')?.value||'Все позиции';
  const typeGroup=hardwareTypeGroups().find(g=>g.type===type);
  const vals=typeGroup?.items||[];
  const groups={};
  vals.forEach(item=>{
    const brand=hardwareBrandForItem(item);
    (groups[brand]||(groups[brand]=[])).push(item);
  });
  return Object.entries(groups)
    .map(([brand,items])=>({brand,items}))
    .sort((a,b)=>{
      if(a.brand==='Не определено')return 1;
      if(b.brand==='Не определено')return -1;
      return b.items.length-a.items.length || a.brand.localeCompare(b.brand,'ru');
    });
}
function renderHardwareBrandTiles(){
  const box=$('hardwareBrandTiles'); if(!box)return;
  const selected=$('hardwareBrand')?.value||'';
  const groups=hardwareBrandGroups();
  box.innerHTML=groups.map(g=>`
    <button type="button" class="hardware-brand ${g.brand===selected?'active':''}" onclick="selectHardwareBrand('${escapeHtml(g.brand).replace(/'/g,"&#39;")}')">
      <span class="brand-name">${escapeHtml(g.brand==='Не определено'?'Без бренда / проверить':g.brand)}</span>
      <span class="brand-count">${g.items.length} поз.</span>
    </button>`).join('');
}
function handleCurrentItems(){
  if($('hardwareCategory')?.value!=='Ручки')return [];
  const brand=$('hardwareBrand')?.value||'';
  const group=hardwareBrandGroups().find(g=>g.brand===brand);
  return group?.items||[];
}
function handleShortLabel(item){
  const name=String(item||'').replace(/^Дверная ручка\s*/i,'').replace(/^Ручка дверная\s*/i,'').replace(/^Ручку\s*/i,'').trim();
  return name.length>92?name.slice(0,89)+'…':name;
}
function handlePriceText(item){
  const meta=hardwareSalesPriceMeta('Ручки',item,activeSalesPriceType());
  if(!meta)return 'Цена не подключена';
  if(meta.price===null||meta.suspicious)return 'Цена по запросу';
  return 'Розница · '+formatRub(meta.retailPrice)+' / шт.';
}
function renderHandleCatalogCards(){
  const wrap=$('handleCatalogWrap'),grid=$('handleCatalogGrid');
  if(!wrap||!grid)return;
  const visible=$('hardwareCategory')?.value==='Ручки';
  wrap.classList.toggle('hidden',!visible);
  if(!visible){grid.innerHTML='';return}
  const selected=$('catalogItem')?.value||'';
  const items=handleCurrentItems();
  if($('handleCatalogCount'))$('handleCatalogCount').textContent=items.length+' позиций выбранного бренда/типа · 286 ручек в категории';
  const summary=hardwareCategoryPriceSummary('Ручки',items);
  const banner='<div class="hinge-price-summary"><div><b>Розничные цены</b> · '+summary.priced+' из '+items.length+' позиций с рабочей ценой'+
    (summary.min!==null?' · диапазон <b>'+formatRub(summary.min)+' — '+formatRub(summary.max)+'</b>':'')+'</div>'+
    ((summary.unresolved||summary.missing||summary.overrides)
      ?'<div class="mini">Контроль: требуют решения — '+summary.unresolved+' · ручных корректировок — '+summary.overrides+(summary.missing?' · без привязки — '+summary.missing:'')+'</div>'
      :'<div class="mini">Все позиции текущей выборки имеют рабочую розничную цену.</div>')+'</div>';
  grid.innerHTML=banner+items.map((item,i)=>{
    const meta=hardwareBasePriceMeta('Ручки',item);
    const problem=meta&&(meta.price===null||meta.suspicious);
    return `<button type="button" class="handle-price-card ${item===selected?'active':''}" onclick="selectHandleCatalogCard(${i})" title="${escapeHtml(item)}">
      <div class="handle-price-card-top">
        <span class="handle-brand">${escapeHtml(hardwareBrandForItem(item)==='Не определено'?'Без бренда / проверить':hardwareBrandForItem(item))}</span>
        <span class="hinge-type-tag">${escapeHtml(hardwareTypeForItem('Ручки',item))}</span>
      </div>
      <div class="handle-price-name">${escapeHtml(handleShortLabel(item))}</div>
      <div class="hinge-card-price ${problem?'unpriced':''}">${escapeHtml(handlePriceText(item))}</div>
      ${problem?'<div class="hinge-price-flag warning">Проверить цену · '+(meta?.sourceBase===null?'не заполнен':formatRub(meta?.sourceBase))+'</div>':''}
    </button>`;
  }).join('');
}
function selectHandleCatalogCard(index){
  const item=handleCurrentItems()[index];if(!item)return;
  if($('catalogItem'))$('catalogItem').value=item;
  renderHandleCatalogCards();
  renderHardwareSelectedPrice();
  render();
}

function hardwareCurrentItems(){
  const category=$('hardwareCategory')?.value||'';
  if(!category)return [];
  const brand=$('hardwareBrand')?.value||'';
  const group=hardwareBrandGroups().find(g=>g.brand===brand);
  return group?.items||[];
}
function hardwareCardShortLabel(item){
  let name=String(item||'')
    .replace(/^Дверная\s+/i,'')
    .replace(/^Дверной\s+/i,'')
    .replace(/^Дверное\s+/i,'')
    .replace(/^Цилиндровый механизм\s*/i,'')
    .replace(/^Магнитный скрытый\s*/i,'')
    .replace(/^Автоматический\s*/i,'')
    .replace(/^Скрытый дверной\s*/i,'')
    .trim();
  return name.length>88?name.slice(0,85)+'…':name;
}
function hardwareCardPlaceholderSvg(category,item){
  const cat=String(category||'Фурнитура').slice(0,28);
  const label=hardwareCardShortLabel(item).slice(0,42);
  const brand=(hardwareBrandForItem(item)==='Не определено'?'Фото уточняется':hardwareBrandForItem(item)).slice(0,28);
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900">'+
    '<rect width="100%" height="100%" fill="#f7f3ed"/>'+
    '<rect x="115" y="105" width="670" height="690" rx="44" fill="#fffdfa" stroke="#ded4c8" stroke-width="4"/>'+
    '<circle cx="450" cy="330" r="112" fill="#ede5da"/>'+
    '<path d="M385 330h130M450 265v130" stroke="#ae9270" stroke-width="22" stroke-linecap="round"/>'+
    '<text x="450" y="535" text-anchor="middle" font-family="Arial" font-size="30" font-weight="700" fill="#3c342c">'+escapeHtml(cat)+'</text>'+
    '<text x="450" y="585" text-anchor="middle" font-family="Arial" font-size="24" fill="#6b5d50">'+escapeHtml(brand)+'</text>'+
    '<foreignObject x="165" y="620" width="570" height="115"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial;font-size:21px;line-height:1.25;text-align:center;color:#77695b">'+escapeHtml(label)+'</div></foreignObject>'+
    '</svg>';
  return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
}
const HARDWARE_IMAGE_OVERRIDES=Object.freeze({});
function hardwareCardPhotoMeta(category,item){
  const sourceCategory=HARDWARE_MAP[category]||category;
  const manual=hardwareUserImageMeta(sourceCategory,item);
  if(manual)return manual;
  const exact=HARDWARE_IMAGE_OVERRIDES[item];
  if(exact)return {image:exact,source:'Точное фото товара',status:'exact'};
  return {
    image:hardwareCardPlaceholderSvg(category,item),
    source:'Фото товара из Bitrix ещё не подключено к публичному preview',
    status:'pending'
  };
}
function hardwareCardPriceText(category,item){
  const meta=hardwareSalesPriceMeta(category,item,activeSalesPriceType());
  if(!meta)return 'Цена пока не подключена';
  if(meta.price===null||meta.suspicious)return 'Цена по запросу';
  if(meta.opt2Eligible){
    return meta.priceType==='wholesale2'
      ?'Опт 2 · '+formatRub(meta.price)+' / шт. · Розница '+formatRub(meta.retailPrice)
      :'Розница · '+formatRub(meta.retailPrice)+' / шт. · Опт 2 −33%';
  }
  return 'Розница · '+formatRub(meta.retailPrice)+' / шт.';
}

function renderHardwareCatalogCards(){
  const wrap=$('hardwareCatalogWrap'),grid=$('hardwareCatalogGrid');
  if(!wrap||!grid)return;
  const uiCategory=$('hardwareCategory')?.value||'';
  const visible=!!uiCategory && uiCategory!=='Петли';
  wrap.classList.toggle('hidden',!visible);
  if(!visible){grid.innerHTML='';return}
  const sourceCategory=HARDWARE_MAP[uiCategory]||uiCategory;
  const selected=$('catalogItem')?.value||'';
  const items=hardwareCurrentItems();
  const brand=$('hardwareBrand')?.value||'';
  const type=$('hardwareType')?.value||'';
  if($('hardwareCatalogTitle'))$('hardwareCatalogTitle').textContent='Каталог: '+uiCategory;
  if($('hardwareCatalogCount'))$('hardwareCatalogCount').textContent=
    items.length+' карточек · '+(type==='Все позиции'?'все типы':type)+' · '+(brand==='Не определено'?'без бренда / проверить':brand);
  const summary=hardwareCategoryPriceSummary(sourceCategory,items);
  const opt2Count=items.filter(item=>hardwarePartnerOpt2Eligible(sourceCategory,item)).length;
  const banner=items.length?'<div class="hinge-price-summary"><div><b>Розничные цены</b> · '+summary.priced+' из '+items.length+' позиций с рабочей ценой'+
    (summary.min!==null?' · диапазон <b>'+formatRub(summary.min)+' — '+formatRub(summary.max)+'</b>':'')+'</div>'+
    ((summary.unresolved||summary.missing||summary.overrides)
      ?'<div class="mini">Контроль: требуют решения — '+summary.unresolved+' · ручных корректировок — '+summary.overrides+(summary.missing?' · без привязки — '+summary.missing:'')+'</div>'
      :'<div class="mini">Все позиции текущей выборки имеют рабочую розничную цену.</div>')+
    (opt2Count?'<div class="mini">Опт 2 −33% подключён: '+opt2Count+' поз.</div>':'')+'</div>':'';
  grid.innerHTML=banner+items.map((item,i)=>{
    const photo=hardwareCardPhotoMeta(uiCategory,item);
    const meta=hardwareBasePriceMeta(sourceCategory,item);
    const problem=meta&&(meta.price===null||meta.suspicious);
    const brandName=hardwareBrandForItem(item);
    const typeName=hardwareTypeForItem(uiCategory,item);
    return '<button type="button" class="hinge-card hardware-catalog-card '+(item===selected?'active':'')+'" onclick="selectHardwareCatalogCard('+i+')" title="'+escapeHtml(item)+'">'+
      '<div class="hinge-card-image"><img src="'+escapeHtml(photo.image)+'" alt="'+escapeHtml(hardwareCardShortLabel(item))+'" loading="lazy">'+catalogImageEditControl('hardware',i)+'</div>'+
      '<div class="hinge-card-body">'+
        '<div class="hardware-card-topline"><span class="handle-brand">'+escapeHtml(brandName==='Не определено'?'Без бренда / проверить':brandName)+'</span><span class="hinge-type-tag">'+escapeHtml(typeName)+'</span></div>'+
        '<div class="hinge-card-model hardware-card-title">'+escapeHtml(hardwareCardShortLabel(item))+'</div>'+
        '<div class="hinge-card-price '+(problem?'unpriced':meta?.priceOverride?'override':'')+'">'+escapeHtml(hardwareCardPriceText(sourceCategory,item))+'</div>'+
        (problem?'<div class="hinge-price-flag warning">Проверить цену · '+(meta?.sourceBase===null?'не заполнен':formatRub(meta?.sourceBase))+'</div>':'')+
        '<div class="hinge-card-meta"><span class="hinge-photo-status '+(photo.status==='manual'?'':'pending')+'">'+(photo.status==='manual'?'Загружено вручную':'Фото из Bitrix: подключение следующим слоем')+'</span></div>'+
        '<div class="hinge-card-name">'+escapeHtml(item)+'</div>'+
        '<div class="hinge-card-source">'+escapeHtml(photo.source)+'</div>'+
      '</div></button>';
  }).join('');
  grid.querySelectorAll('[data-image-edit-kind="hardware"]').forEach(control=>{
    const trigger=e=>{e.preventDefault();e.stopPropagation();const item=hardwareCurrentItems()[Number(control.dataset.imageEditIndex)];if(item)openHardwareImageReplace(sourceCategory,item)};
    control.addEventListener('click',trigger);
    control.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')trigger(e)});
  });
}
function selectHardwareCatalogCard(index){
  const item=hardwareCurrentItems()[index];if(!item)return;
  if($('catalogItem'))$('catalogItem').value=item;
  renderHardwareCatalogCards();
  renderHardwareSelectedPrice();
  render();
}

function updateHardwareDatalist(resetBrand=false,resetType=false){
  const c=$('hardwareCategory'); if(!c)return;
  const typeGroups=hardwareTypeGroups();
  const typeInput=$('hardwareType');
  let type=typeInput?.value||'';
  if(resetType || !typeGroups.some(g=>g.type===type)) type=typeGroups[0]?.type||'Все позиции';
  if(typeInput)typeInput.value=type;

  const groups=hardwareBrandGroups();
  const brandInput=$('hardwareBrand');
  let brand=brandInput?.value||'';
  if(resetBrand || !groups.some(g=>g.brand===brand)) brand=groups[0]?.brand||'';
  if(brandInput)brandInput.value=brand;
  const group=groups.find(g=>g.brand===brand);
  const vals=group?.items||[];

  const sourceCategory=HARDWARE_MAP[c.value]||c.value;
  const list=$('catalogItemList'); if(list)list.innerHTML=vals.map(v=>{
    const meta=hardwareBasePriceMeta(sourceCategory,v);
    const label=meta?(meta.price===null||meta.suspicious?'Цена по запросу':'Розница '+formatRub(meta.price)):'';
    return `<option value="${escapeHtml(v)}"${label?` label="${escapeHtml(label)}"`:''}></option>`;
  }).join('');
  if($('catalogItem') && !vals.includes($('catalogItem').value)) $('catalogItem').value=vals[0]||'';
  if($('hardwarePath'))$('hardwarePath').textContent=[c.value,type==='Все позиции'?'':type,brand==='Не определено'?'Без бренда / проверить':brand].filter(Boolean).join(' → ');
  if($('hardwarePositionCount'))$('hardwarePositionCount').textContent=vals.length+` позиций выбранного бренда`;
  renderHardwareCategoryPriceSummary(sourceCategory,vals);
  renderHardwareTypeTiles();
  renderHardwareBrandTiles();
  renderHingeCatalogCards();
  renderHardwareCatalogCards();
  renderHardwareSelectedPrice();
}
function selectHardwareType(type){
  if($('hardwareType'))$('hardwareType').value=type;
  updateHardwareDatalist(true,false);
  render();
}
function selectHardwareBrand(brand){
  if($('hardwareBrand'))$('hardwareBrand').value=brand;
  updateHardwareDatalist(false,false);
  render();
}
function renderHardware(){
  const cats=Object.keys(HARDWARE_MAP);
  $('form').innerHTML=
    section('Фурнитура',
      fields(
        field('Категория',selectEl('hardwareCategory',cats,cats[0]),'full')
      )+
      `<input id="hardwareType" type="hidden">
       <input id="hardwareBrand" type="hidden">
       <div id="hardwareTypeWrap" style="margin-top:14px">
         <label>Тип / назначение</label>
         <div class="mini">Сначала уточняем тип фурнитуры, затем производителя.</div>
         <div id="hardwareTypeTiles" class="hardware-type-grid"></div>
       </div>
       <div style="margin-top:14px">
         <label>Бренд</label>
         <div class="mini">Показываются только бренды, у которых есть позиции выбранного типа.</div>
         <div id="hardwareBrandTiles" class="hardware-brand-grid"></div>
       </div>
       <div class="hardware-position" style="margin-top:14px">
         <div id="hardwarePath" class="hardware-path"></div>
         <label>Позиция</label>
         <input id="catalogItem" list="catalogItemList" placeholder="Начните вводить название или модель">
         <datalist id="catalogItemList"></datalist>
         <div id="hardwarePositionCount" class="mini"></div>
         <div id="hardwarePriceSummary" class="hinge-price-summary hidden" style="margin-top:10px"></div>
         <div id="hardwareSelectedPrice" class="status info hidden" style="margin-top:10px"></div>
       </div>
       <div id="hingeCatalogWrap" class="hinge-pilot hidden">
         <div class="hinge-pilot-head">
           <div>
             <div class="hinge-pilot-title">Визуальный каталог петель</div>
             <div id="hingeCatalogCount" class="mini"></div>
           </div>
           <div class="hinge-pilot-note">Карточка всегда связана с реальной позицией номенклатуры. Статус изображения показывает, насколько фото соответствует конкретному SKU: точное фото, фото модели/семейства или фото ещё уточняется.</div>
         </div>
         <div id="hingeCatalogGrid" class="hinge-card-grid"></div>
       </div>
       <div id="hardwareCatalogWrap" class="hinge-pilot hidden">
         <div class="hinge-pilot-head">
           <div>
             <div id="hardwareCatalogTitle" class="hinge-pilot-title">Каталог фурнитуры</div>
             <div id="hardwareCatalogCount" class="mini"></div>
           </div>
           <div class="hinge-pilot-note">Карточка связана с реальной номенклатурой и рабочей розничной ценой. Там, где публичное фото ещё не подключено, показывается нейтральный placeholder — без подмены товара похожей картинкой.</div>
         </div>
         <div id="hardwareCatalogGrid" class="hinge-card-grid"></div>
       </div>`
    )+
    section('Структура каталога',`<div class="note">В v24 начата строгая по-SKU ревизия изображений. Первый эталонный раздел: <b>Петли → Скрытые → Krona Koblenz / KUBICA</b>. В нём отображается код отделки производителя, запрещены приблизительные фото другого цвета, а спорные коды/цвета помечаются для согласования. Остальные разделы пока сохраняют режим v23.</div>`);
  updateHardwareDatalist(true,true);
}
function renderOpeningSystemPrice(){
  const vals=catalogValues('Системы открывания');
  const summary=hardwareCategoryPriceSummary('Системы открывания',vals);
  const summaryBox=$('openingSystemPriceSummary');
  if(summaryBox){
    summaryBox.innerHTML='<div><b>Розничные цены</b> · '+summary.priced+' из '+summary.total+' позиций с рабочей ценой'+
      (summary.min!==null?' · диапазон <b>'+formatRub(summary.min)+' — '+formatRub(summary.max)+'</b>':'')+'</div>'+
      ((summary.unresolved||summary.missing)
        ?'<div class="mini">Требуют решения — '+summary.unresolved+(summary.missing?' · без привязки — '+summary.missing:'')+'</div>'
        :'<div class="mini">Все системы текущего каталога имеют рабочую розничную цену.</div>');
  }
  const box=$('openingSystemSelectedPrice');if(!box)return;
  const name=$('catalogItem')?.value||'';
  const meta=hardwareBasePriceMeta('Системы открывания',name);
  if(!meta){
    box.className='status warn';
    box.innerHTML='<b>Цена пока не подключена.</b><br>Для этой системы не найдено точного соответствия в текущем каталоге цен.';
    return;
  }
  if(meta.price===null||meta.suspicious){
    box.className='status warn';
    box.innerHTML='<b>Цена по запросу / проверить цену.</b><br><span class="mini">Исходная цена Bitrix24: '+(meta.sourceBase===null?'не заполнен':formatRub(meta.sourceBase))+'</span>';
    return;
  }
  box.className='status ok';
  box.innerHTML='<b>Розница: '+formatRub(meta.price)+'/шт.</b><br><span class="mini">Источник цены: Bitrix24 · Parent ID '+escapeHtml(meta.parentId)+(meta.offerId?' · Offer ID '+escapeHtml(meta.offerId):'')+'</span>';
}
function openingSystemAllItems(){
  return catalogValues('Системы открывания');
}
function openingSystemTypeGroups(){
  const groups={};
  openingSystemAllItems().forEach(item=>{
    const type=hardwareTypeForItem('Системы открывания',item);
    (groups[type]||(groups[type]=[])).push(item);
  });
  const order=HARDWARE_TYPE_ORDER['Системы открывания']||[];
  return Object.entries(groups)
    .map(([type,items])=>({type,items}))
    .sort((a,b)=>{
      const ai=order.indexOf(a.type),bi=order.indexOf(b.type);
      return (ai===-1?999:ai)-(bi===-1?999:bi)||a.type.localeCompare(b.type,'ru');
    });
}
function openingSystemSelectedTypeItems(){
  const type=$('openingSystemType')?.value||openingSystemTypeGroups()[0]?.type||'';
  return openingSystemAllItems().filter(item=>hardwareTypeForItem('Системы открывания',item)===type);
}
function openingSystemBrandGroups(){
  const groups={};
  openingSystemSelectedTypeItems().forEach(item=>{
    const brand=hardwareBrandForItem(item);
    (groups[brand]||(groups[brand]=[])).push(item);
  });
  return Object.entries(groups)
    .map(([brand,items])=>({brand,items}))
    .sort((a,b)=>(b.items.length-a.items.length)||a.brand.localeCompare(b.brand,'ru'));
}
function openingSystemCurrentItems(){
  const brand=$('openingSystemBrand')?.value||openingSystemBrandGroups()[0]?.brand||'';
  return openingSystemSelectedTypeItems().filter(item=>hardwareBrandForItem(item)===brand);
}
function openingSystemDiagramSvg(type,item){
  const title=String(type||'Система открывания').slice(0,28);
  const brand=(hardwareBrandForItem(item)==='Не определено'?'Hidden Doors':hardwareBrandForItem(item)).slice(0,24);
  let art='';
  if(type==='Раздвижные / скрытые'){
    art='<path d="M180 165h540" stroke="#ad916e" stroke-width="12" stroke-linecap="round"/>'+
      '<rect x="215" y="205" width="290" height="430" rx="10" fill="#fffdfa" stroke="#9e876b" stroke-width="10"/>'+
      '<rect x="440" y="205" width="245" height="430" rx="10" fill="#f1e8dc" stroke="#b6a087" stroke-width="8"/>'+
      '<path d="M520 420h120M610 380l45 40-45 40" fill="none" stroke="#a77f4d" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>';
  }else if(type==='Складные'){
    art='<rect x="235" y="190" width="205" height="445" rx="10" fill="#fffdfa" stroke="#9e876b" stroke-width="10"/>'+
      '<path d="M440 190 620 255v380L440 635Z" fill="#f2e9dd" stroke="#ad967a" stroke-width="10"/>'+
      '<path d="M440 190v445M435 410h15" stroke="#a77f4d" stroke-width="12" stroke-linecap="round"/>';
  }else if(type==='Рото'){
    art='<rect x="280" y="185" width="330" height="455" rx="10" fill="#fffdfa" stroke="#9e876b" stroke-width="10"/>'+
      '<path d="M445 155v515" stroke="#b89d79" stroke-width="10" stroke-dasharray="18 16"/>'+
      '<path d="M630 315c80 40 80 150 0 190" fill="none" stroke="#a77f4d" stroke-width="14" stroke-linecap="round"/>'+
      '<path d="m655 492-35 13 12-36" fill="none" stroke="#a77f4d" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>';
  }else if(type==='Pivot'){
    art='<rect x="290" y="180" width="300" height="465" rx="10" fill="#fffdfa" stroke="#9e876b" stroke-width="10"/>'+
      '<circle cx="440" cy="210" r="14" fill="#a77f4d"/><circle cx="440" cy="615" r="14" fill="#a77f4d"/>'+
      '<path d="M625 285c95 55 95 215 0 270" fill="none" stroke="#a77f4d" stroke-width="14" stroke-linecap="round"/>'+
      '<path d="m650 542-37 13 15-37" fill="none" stroke="#a77f4d" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>';
  }else{
    art='<rect x="245" y="210" width="410" height="390" rx="26" fill="#fffdfa" stroke="#a18a70" stroke-width="10"/>'+
      '<path d="M315 330h270M315 410h220M315 490h170" stroke="#b3936d" stroke-width="18" stroke-linecap="round"/>';
  }
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="900" height="760" viewBox="0 0 900 760">'+
    '<rect width="900" height="760" fill="#f7f3ed"/>'+
    '<rect x="50" y="45" width="800" height="670" rx="40" fill="#fffdfa" stroke="#e1d6c8" stroke-width="5"/>'+
    art+
    '<text x="450" y="690" text-anchor="middle" font-family="Arial" font-size="28" font-weight="700" fill="#3b332b">'+escapeHtml(title)+'</text>'+
    '<text x="450" y="725" text-anchor="middle" font-family="Arial" font-size="20" fill="#8b7966">'+escapeHtml(brand)+'</text>'+
    '</svg>';
  return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
}
function renderOpeningSystemTypeTiles(){
  const box=$('openingSystemTypeTiles');if(!box)return;
  const selected=$('openingSystemType')?.value||'';
  box.innerHTML=openingSystemTypeGroups().map((g,i)=>
    '<button type="button" class="hardware-type '+(g.type===selected?'active':'')+'" data-opening-type-index="'+i+'">'+
      '<span class="brand-name">'+escapeHtml(g.type)+'</span>'+
      '<span class="brand-count">'+g.items.length+' поз.</span>'+
    '</button>'
  ).join('');
  box.querySelectorAll('[data-opening-type-index]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const group=openingSystemTypeGroups()[Number(btn.dataset.openingTypeIndex)];
      if(group)selectOpeningSystemType(group.type);
    });
  });
}
function renderOpeningSystemBrandTiles(){
  const box=$('openingSystemBrandTiles');if(!box)return;
  const selected=$('openingSystemBrand')?.value||'';
  box.innerHTML=openingSystemBrandGroups().map((g,i)=>
    '<button type="button" class="hardware-brand '+(g.brand===selected?'active':'')+'" data-opening-brand-index="'+i+'">'+
      '<span class="brand-name">'+escapeHtml(g.brand==='Не определено'?'Без бренда / проверить':g.brand)+'</span>'+
      '<span class="brand-count">'+g.items.length+' поз.</span>'+
    '</button>'
  ).join('');
  box.querySelectorAll('[data-opening-brand-index]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const group=openingSystemBrandGroups()[Number(btn.dataset.openingBrandIndex)];
      if(group)selectOpeningSystemBrand(group.brand);
    });
  });
}
function renderOpeningSystemCards(){
  const grid=$('openingSystemCardGrid');if(!grid)return;
  const items=openingSystemCurrentItems();
  const selected=$('catalogItem')?.value||'';
  const type=$('openingSystemType')?.value||'';
  const summary=hardwareCategoryPriceSummary('Системы открывания',items);
  if($('openingSystemCardCount'))$('openingSystemCardCount').textContent=
    items.length+' карточек · '+type+' · '+($('openingSystemBrand')?.value||'');
  const banner=items.length?'<div class="hinge-price-summary"><div><b>Розничные цены</b> · '+summary.priced+' из '+items.length+' позиций с рабочей ценой'+
    (summary.min!==null?' · диапазон <b>'+formatRub(summary.min)+' — '+formatRub(summary.max)+'</b>':'')+'</div>'+
    '<div class="mini">Иллюстрация показывает тип механики и не подменяет точное фото SKU. Точные фото будем подключать по мере ревизии.</div></div>':'';
  grid.innerHTML=banner+items.map((item,i)=>{
    const meta=hardwareBasePriceMeta('Системы открывания',item);
    const problem=meta&&(meta.price===null||meta.suspicious);
    const itemType=hardwareTypeForItem('Системы открывания',item);
    const brand=hardwareBrandForItem(item);
    const manualPhoto=hardwareUserImageMeta('Системы открывания',item);
    const image=manualPhoto?.image||openingSystemDiagramSvg(itemType,item);
    return '<button type="button" class="hinge-card hardware-catalog-card opening-system-card '+(item===selected?'active':'')+'" data-opening-card-index="'+i+'" title="'+escapeHtml(item)+'">'+
      '<div class="hinge-card-image"><img src="'+escapeHtml(image)+'" alt="'+escapeHtml(itemType)+'" loading="lazy">'+catalogImageEditControl('opening',i)+'</div>'+
      '<div class="hinge-card-body">'+
        '<div class="hardware-card-topline"><span class="handle-brand">'+escapeHtml(brand==='Не определено'?'Без бренда / проверить':brand)+'</span><span class="hinge-type-tag">'+escapeHtml(itemType)+'</span></div>'+
        '<div class="hinge-card-model hardware-card-title">'+escapeHtml(hardwareCardShortLabel(item))+'</div>'+
        '<div class="hinge-card-price '+(problem?'unpriced':meta?.priceOverride?'override':'')+'">'+escapeHtml(hardwareCardPriceText('Системы открывания',item))+'</div>'+
        '<div class="hinge-card-meta"><span class="hinge-photo-status '+(manualPhoto?'':'model')+'">'+(manualPhoto?'Загружено вручную':'Схема типа системы')+'</span></div>'+
        '<div class="hinge-card-name">'+escapeHtml(item)+'</div>'+
      '</div></button>';
  }).join('');
  grid.querySelectorAll('[data-opening-card-index]').forEach(btn=>{
    btn.addEventListener('click',()=>selectOpeningSystemCard(Number(btn.dataset.openingCardIndex)));
  });
  grid.querySelectorAll('[data-image-edit-kind="opening"]').forEach(control=>{
    const trigger=e=>{e.preventDefault();e.stopPropagation();const item=openingSystemCurrentItems()[Number(control.dataset.imageEditIndex)];if(item)openHardwareImageReplace('Системы открывания',item)};
    control.addEventListener('click',trigger);
    control.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')trigger(e)});
  });
}
function updateOpeningSystemCatalog(resetType=false,resetBrand=false){
  const types=openingSystemTypeGroups();
  const typeInput=$('openingSystemType');
  let type=typeInput?.value||'';
  if(resetType||!types.some(g=>g.type===type))type=types[0]?.type||'';
  if(typeInput)typeInput.value=type;

  const brands=openingSystemBrandGroups();
  const brandInput=$('openingSystemBrand');
  let brand=brandInput?.value||'';
  if(resetBrand||!brands.some(g=>g.brand===brand))brand=brands[0]?.brand||'';
  if(brandInput)brandInput.value=brand;

  const items=openingSystemCurrentItems();
  if($('catalogItem')&&!items.includes($('catalogItem').value))$('catalogItem').value=items[0]||'';

  renderOpeningSystemTypeTiles();
  renderOpeningSystemBrandTiles();
  renderOpeningSystemCards();
  renderOpeningSystemPrice();
}
function selectOpeningSystemType(type){
  if($('openingSystemType'))$('openingSystemType').value=type;
  updateOpeningSystemCatalog(false,true);
  render();
}
function selectOpeningSystemBrand(brand){
  if($('openingSystemBrand'))$('openingSystemBrand').value=brand;
  updateOpeningSystemCatalog(false,false);
  render();
}
function selectOpeningSystemCard(index){
  const item=openingSystemCurrentItems()[index];if(!item)return;
  if($('catalogItem'))$('catalogItem').value=item;
  renderOpeningSystemCards();
  renderOpeningSystemPrice();
  render();
}
function renderOpeningSystem(){
  $('form').innerHTML=
    section('Системы и механизмы открывания',
      '<input id="openingSystemType" type="hidden">'+
      '<input id="openingSystemBrand" type="hidden">'+
      '<input id="catalogItem" type="hidden">'+
      '<div class="opening-system-picker">'+
        '<div>'+
          '<label>Тип системы</label>'+
          '<div class="mini">Выберите принцип открывания — после этого покажем доступные бренды и комплекты.</div>'+
          '<div id="openingSystemTypeTiles" class="hardware-type-grid"></div>'+
        '</div>'+
        '<div style="margin-top:14px">'+
          '<label>Бренд</label>'+
          '<div id="openingSystemBrandTiles" class="hardware-brand-grid"></div>'+
        '</div>'+
        '<div id="openingSystemPriceSummary" class="hinge-price-summary" style="margin-top:14px"></div>'+
        '<div id="openingSystemSelectedPrice" class="status info" style="margin-top:10px"></div>'+
        '<div class="hinge-pilot opening-system-catalog">'+
          '<div class="hinge-pilot-head">'+
            '<div><div class="hinge-pilot-title">Визуальный каталог систем открывания</div><div id="openingSystemCardCount" class="mini"></div></div>'+
            '<div class="hinge-pilot-note">Карточка выбирается кликом. Визуальная схема показывает тип механики; точные фото конкретных SKU будем добавлять только после проверки источника.</div>'+
          '</div>'+
          '<div id="openingSystemCardGrid" class="hinge-card-grid opening-system-card-grid"></div>'+
        '</div>'+
      '</div>'
    )+
    section('Структура','<div class="note">Пенальные, раздвижные вдоль стены, складные, рото и Pivot-системы хранятся отдельно от основной дверной фурнитуры. Компоненты одной системы можно объединять в комплект на уровне заказа.</div>');
  updateOpeningSystemCatalog(true,true);
}

function additionalItems(type){
  if(type==='Вентиляционные решётки') return catalogValues('Вентиляционные решетки');
  const all=catalogValues('Доп.фурнитура');
  if(type==='Иллюминаторы') return all.filter(x=>/иллюминатор/i.test(x));
  if(type==='Декоративные накладки') return all.filter(x=>/наклад/i.test(x));
  return all;
}
function renderAdditionalElement(){
  const types=['Вентиляционные решётки','Иллюминаторы','Декоративные накладки','Прочие дополнительные элементы'];
  $('form').innerHTML=
    section('Дополнительные элементы двери',fields(
      field('Тип',selectEl('additionalType',types,types[0]))+
      field('Позиция',`<input id="catalogItem" list="additionalList">${datalistHtml('additionalList',additionalItems(types[0]))}`,'full')
    ))+
    section('Правило',`<div class="note">Эти позиции являются опциями/элементами полотна и не должны смешиваться с петлями, замками и ручками.</div>`);
  updateAdditionalDatalist();
}
function updateAdditionalDatalist(){
  const type=$('additionalType'); if(!type)return;
  const vals=additionalItems(type.value);
  if($('additionalList'))$('additionalList').innerHTML=vals.map(v=>`<option value="${escapeHtml(v)}"></option>`).join('');
  if($('catalogItem') && !vals.includes($('catalogItem').value))$('catalogItem').value=vals[0]||'';
}
function renderInstallation(){
  const vals=catalogValues('Всё для монтажа');
  $('form').innerHTML=
    section('Монтаж и комплектующие',fields(
      field('Позиция',`<input id="catalogItem" list="installList" value="${escapeHtml(vals[0]||'')}">${datalistHtml('installList',vals)}`,'full')
    ))+
    section('Правило',`<div class="note">Монтажные комплекты 42/59 и сухари остаются в этом разделе. Гибкий переход ABLOY EA281 позже будет вынесен в отдельную электромеханику / кабельные переходы.</div>`);
}
function renderPlinth(){
  const vals=catalogValues('Плинтус');
  $('form').innerHTML=
    section('Плинтус',fields(
      field('Позиция',`<input id="catalogItem" list="plinthList" value="${escapeHtml(vals[0]||'')}">${datalistHtml('plinthList',vals)}`,'full')
    ))+
    section('Правило',`<div class="note">Плинтус — самостоятельная товарная группа и не относится к дверной фурнитуре.</div>`);
}
