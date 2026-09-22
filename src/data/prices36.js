// 36 mm sales prices.
// Approved Opt 2 source: «Партнёрский прайс Hidden Doors 2026».
// Opt 1 business rule approved 21.09.2026: every Opt 2 price + 12.5%.
const PRICE36_WHOLESALE1_MARKUP=0.125;
const PRICE36_RETAIL_MARKUP=0.50;

function price36ApplyMarkup(value,markup=PRICE36_WHOLESALE1_MARKUP){
  const n=Number(value);
  return Number.isFinite(n)?Math.ceil(n*(1+markup)):null;
}

const SALES_PRICE_36_OPT2=Object.freeze({
  priceType:'wholesale2',
  priceTypeLabel:'Опт 2',
  source:'Hidden doors Партнерский Прайс продуктовой линейки',
  priceBookId:'partner-2026-v1',
  updated:'22.01.2026',
  doorLeaf:7705,
  doorKit:11730,
  trim:Object.freeze({
    box:814,
    casing:398,
    dobor100:655,
    dobor150:770,
    dobor200:989,
    rebate:499,
    connector:90
  })
});

function buildPrice36DerivedTier(base,{priceType,priceTypeLabel,priceBookId,markupRate,derivedFormula}){
  const marked=value=>price36ApplyMarkup(value,markupRate);
  return Object.freeze({
    ...base,
    priceType,
    priceTypeLabel,
    priceBookId,
    derivedFromPriceType:'wholesale2',
    derivedFormula,
    markupRate,
    doorLeaf:marked(base.doorLeaf),
    doorKit:marked(base.doorKit),
    trim:Object.freeze({
      box:marked(base.trim.box),
      casing:marked(base.trim.casing),
      dobor100:marked(base.trim.dobor100),
      dobor150:marked(base.trim.dobor150),
      dobor200:marked(base.trim.dobor200),
      rebate:marked(base.trim.rebate),
      connector:marked(base.trim.connector)
    })
  });
}
function buildPrice36Wholesale1(base=SALES_PRICE_36_OPT2){
  return buildPrice36DerivedTier(base,{
    priceType:'wholesale1',
    priceTypeLabel:'Опт 1',
    priceBookId:'partner-2026-v1-wholesale1',
    markupRate:PRICE36_WHOLESALE1_MARKUP,
    derivedFormula:'Опт 2 + 12,5%'
  });
}
function buildPrice36Retail(base=SALES_PRICE_36_OPT2){
  return buildPrice36DerivedTier(base,{
    priceType:'retail',
    priceTypeLabel:'Розница',
    priceBookId:'partner-2026-v1-retail',
    markupRate:PRICE36_RETAIL_MARKUP,
    derivedFormula:'Опт 2 + 50%'
  });
}

const SALES_PRICE_36=Object.freeze({
  retail:buildPrice36Retail(),
  wholesale1:buildPrice36Wholesale1(),
  wholesale2:SALES_PRICE_36_OPT2
});

// Temporary compatibility alias for old notes/tests. It points specifically to Opt 2.
const PARTNER_PRICE_36=SALES_PRICE_36.wholesale2;

function price36Book(priceType=activeSalesPriceType()){
  return SALES_PRICE_36[normalizeSalesPriceType(priceType)]||null;
}
function price36TypeLabel(priceType=activeSalesPriceType()){
  return salesPriceTypeLabel(priceType);
}
function price36SourceNote(book){
  if(!book)return '';
  const derived=book.derivedFormula?' · формула '+book.derivedFormula:'';
  return book.source+' · price book '+(book.priceBookId||'—')+' · тип цены '+price36TypeLabel(book.priceType)+' · обновлён '+book.updated+derived;
}
function formatRub(value){
  if(!Number.isFinite(Number(value)))return '—';
  return new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0}).format(Number(value))+' ₽';
}

function trim36PartnerUnitPrice(priceType=activeSalesPriceType()){
  const book=price36Book(priceType);
  const type=$('trimType')?.value||'';
  if(!book)return {price:null,label:type||'Погонаж 36',missingTier:true};
  if(type==='Короб телескопический')return {price:book.trim.box,label:'Короб телескопический'};
  if(type==='Наличник телескопический')return {price:book.trim.casing,label:'Наличник телескопический'};
  if(type==='Притворная планка')return {price:book.trim.rebate,label:'Притворная планка'};
  if(type==='Соединительная планка для стыковки доборов')return {price:book.trim.connector,label:'Соединительная планка'};
  if(type==='Добор телескопический'){
    const width=doborWidth();
    const map={100:book.trim.dobor100,150:book.trim.dobor150,200:book.trim.dobor200};
    return {price:map[width]??null,label:'Добор телескопический '+width+' мм',custom:!Object.prototype.hasOwnProperty.call(map,width)};
  }
  return {price:null,label:type||'Погонаж 36'};
}

function partnerPrice36Snapshot(){
  const type=activeSalesPriceType();
  const typeLabel=price36TypeLabel(type);
  const book=price36Book(type);
  if(!['leaf36','trim36'].includes(product()))return {visible:false};

  if(!book){
    return {
      visible:true,available:false,title:'Цена не заполнена',
      note:'Тип цены «'+typeLabel+'» создан, но цены 36 мм для него пока не заполнены. Текущий утверждённый прайс 36 мм находится в типе «Опт 2».',
      priceType:type
    };
  }

  if(product()==='leaf36'){
    if($('cover36')?.value!=='ПВХ-пленка'){
      return {visible:true,available:false,title:'Цена по запросу',note:'Для типа цены «'+typeLabel+'» цена 36 мм зафиксирована для исполнения в ПВХ-плёнке.',priceType:type};
    }
    const leaf=book.doorLeaf;
    const included=includeBox();
    const boxQty=included?Number($('bundle36BoxQty')?.value||0):0;
    const casingQty=included?Number($('bundle36TrimQty')?.value||0):0;
    const boxSum=boxQty*book.trim.box;
    const casingSum=casingQty*book.trim.casing;
    const total=leaf+boxSum+casingSum;
    const defaultKit=included&&boxQty===2.5&&casingQty===5&&Math.abs(total-book.doorKit)<0.01;
    const lines=[
      '<div><b>Полотно:</b> '+formatRub(leaf)+'</div>',
      included?'<div>Короб: '+boxQty+' × '+formatRub(book.trim.box)+' = <b>'+formatRub(boxSum)+'</b></div>':'',
      included?'<div>Наличник: '+casingQty+' × '+formatRub(book.trim.casing)+' = <b>'+formatRub(casingSum)+'</b></div>':'',
      '<div style="margin-top:6px"><b>'+(defaultKit?'Комплект':'Итого')+': '+formatRub(total)+'</b></div>'
    ].filter(Boolean);
    return {
      visible:true,available:true,title:formatRub(total),html:lines.join(''),priceType:type,
      note:price36SourceNote(book)+(defaultKit?' · базовый комплект совпадает с прайсом '+formatRub(book.doorKit):'')
    };
  }

  const item=trim36PartnerUnitPrice(type);
  const connector=$('trimType')?.value==='Соединительная планка для стыковки доборов';
  if(!connector && $('trimCover')?.value!=='ПВХ-пленка'){
    return {visible:true,available:false,title:'Цена по запросу',note:'Для типа цены «'+typeLabel+'» цена этого погонажа зафиксирована для исполнения в ПВХ-плёнке.',priceType:type};
  }
  if(item.price===null){
    return {
      visible:true,available:false,title:item.missingTier?'Цена не заполнена':'Цена по запросу',priceType:type,
      note:item.missingTier
        ?'Тип цены «'+typeLabel+'» создан, но цены 36 мм для него пока не заполнены.'
        :(item.custom?'В прайсе «'+typeLabel+'» зафиксированы доборы 100, 150 и 200 мм. Для другой ширины цену нужно согласовать.':'Цена для выбранной позиции не найдена в типе цены «'+typeLabel+'».')
    };
  }
  return {
    visible:true,available:true,title:formatRub(item.price),priceType:type,
    html:'<div><b>'+escapeHtml(item.label)+': '+formatRub(item.price)+'/шт.</b></div>',
    note:price36SourceNote(book)
  };
}

function renderPartnerPrice36(){
  const wrap=$('price36ResultWrap'),caption=$('price36Caption'),value=$('price36Result'),details=$('price36Details'),note=$('price36Note');
  if(!wrap||!value||!details||!note)return;
  const snapshot=partnerPrice36Snapshot();
  wrap.classList.toggle('hidden',!snapshot.visible);
  if(!snapshot.visible)return;
  if(caption)caption.textContent='Цена · '+price36TypeLabel(snapshot.priceType||activeSalesPriceType());
  value.textContent=snapshot.title||'—';
  details.innerHTML=snapshot.html||'';
  note.textContent=snapshot.note||'';
}

function configured36CartUnitPrice(priceType=activeSalesPriceType()){
  const book=price36Book(priceType);
  if(!book)return null;
  if(product()==='leaf36'){
    if($('cover36')?.value!=='ПВХ-пленка')return null;
    return book.doorLeaf;
  }
  if(product()==='trim36'){
    const connector=$('trimType')?.value==='Соединительная планка для стыковки доборов';
    if(!connector && $('trimCover')?.value!=='ПВХ-пленка')return null;
    return trim36PartnerUnitPrice(priceType).price;
  }
  return null;
}
function companion36UnitPrice(item,priceType=activeSalesPriceType()){
  const book=price36Book(priceType);
  if(!book)return null;
  const key=String(item?.baseKey||item?.key||'');
  if(key==='BUNDLE-P36-BOX')return book.trim.box;
  if(key==='BUNDLE-P36-TRIM')return book.trim.casing;
  return null;
}
function cart36FallbackUnitPrice(item,priceType=item?.priceType||activeSalesPriceType()){
  if(!item)return null;
  const book=price36Book(priceType);
  if(!book)return null;
  const category=String(item.category||'');
  const name=String(item.name||'');
  const sku=String(item.sku||'');
  const baseKey=String(item.baseKey||'');
  if(category==='Погонаж 36'&&/Соединительная планка/i.test(name))return book.trim.connector;
  if(/Грунт под покраску/i.test(name))return null;
  if(baseKey==='BUNDLE-P36-BOX'||sku.startsWith('BUNDLE-P36-BOX-')||/Короб телескопический 36/i.test(name))return book.trim.box;
  if(baseKey==='BUNDLE-P36-TRIM'||sku.startsWith('BUNDLE-P36-TRIM-')||/Наличник телескопический 36/i.test(name))return book.trim.casing;
  if(category==='Дверь 36'||/Дверь\s*\/\s*36 мм/i.test(name))return book.doorLeaf;
  if(category==='Погонаж 36'){
    if(/Короб телескопический/i.test(name))return book.trim.box;
    if(/Наличник телескопический/i.test(name))return book.trim.casing;
    if(/Притворная планка/i.test(name))return book.trim.rebate;
    if(/Соединительная планка/i.test(name))return book.trim.connector;
    if(/Добор/i.test(name)){
      const m=name.match(/(?:\b|×)(100|150|200)(?:\b|×)/);
      if(m)return {100:book.trim.dobor100,150:book.trim.dobor150,200:book.trim.dobor200}[Number(m[1])]||null;
    }
  }
  return null;
}
function is36SalesCatalogItem(item){
  if(!item)return false;
  const category=String(item.category||'');
  const name=String(item.name||'');
  const baseKey=String(item.baseKey||item.key||'');
  return category==='Дверь 36'||category==='Погонаж 36'||/Дверь\s*\/\s*36 мм/i.test(name)||
    /^BUNDLE-P36-/.test(baseKey)||/телескопический 36|планка.*36/i.test(name);
}
function configuredSalesPriceType(){
  if(['leaf36','trim36','single42','single59'].includes(product()))return activeSalesPriceType();
  if(product()==='hardware'&&typeof hardwareSalesPriceType==='function'){
    const uiCategory=$('hardwareCategory')?.value||'';
    const category=(typeof HARDWARE_MAP!=='undefined'?(HARDWARE_MAP[uiCategory]||uiCategory):uiCategory);
    return hardwareSalesPriceType(category,$('catalogItem')?.value||'',activeSalesPriceType());
  }
  if(product()==='openingSystem')return 'retail';
  return null;
}
function companionSalesPriceType(item){
  const key=String(item?.baseKey||item?.key||'');
  if(/^BUNDLE-P36-/.test(key))return activeSalesPriceType();
  if(key==='BUNDLE-P42-BOX'||key==='BUNDLE-P59-BOX')return activeSalesPriceType();
  if(key==='POWDER-COAT-42')return activeSalesPriceType();
  if(/^BOX-MITER45-/.test(key))return activeSalesPriceType();
  if(/^PROCESS-/.test(key))return activeSalesPriceType();
  if(typeof hardwareSalesPriceType==='function'){
    const category=String(item?.priceCategory||'');
    if(category)return hardwareSalesPriceType(category,item?.name||'',activeSalesPriceType());
  }
  return null;
}
function stockSalesPriceType(item){
  if(is36SalesCatalogItem(item))return activeSalesPriceType();
  if(typeof is42StandardLeafCatalogItem==='function'&&is42StandardLeafCatalogItem(item))return activeSalesPriceType();
  if(typeof hardwareSalesPriceType==='function'){
    const category=String(item?.category||'');
    const name=String(item?.name||'');
    if(/петл/i.test(category))return hardwareSalesPriceType('Петли',name,activeSalesPriceType());
    if(/замк|защел|задвиж|ответн.*планк|корпус.*замк/i.test(category+' '+name))return hardwareSalesPriceType('Замки',name,activeSalesPriceType());
    if(/ручк/i.test(category+' '+name))return 'retail';
    if(/заверт/i.test(category))return 'retail';
    if(/цилиндр/i.test(category+' '+name))return 'retail';
    if(/стоп|упор|ограничител/i.test(category+' '+name))return 'retail';
    if(/порог/i.test(category+' '+name))return 'retail';
    if(/доводчик/i.test(category+' '+name))return 'retail';
    if(category==='Системы открывания')return 'retail';
  }
  return null;
}
function cartStoredPriceType(item){
  if(item?.priceType)return normalizeSalesPriceType(item.priceType);
  if(is36SalesCatalogItem(item))return 'wholesale2';
  if(typeof is42StandardLeafCatalogItem==='function'&&is42StandardLeafCatalogItem(item))return 'wholesale2';
  return null;
}

function cartItemUnitPrice(item){
  const stored=item?.unitPrice;
  if(stored!==null&&stored!==undefined&&stored!==''&&Number.isFinite(Number(stored)))return Number(stored);
  return typeof genericCatalogItemPrice==='function'?genericCatalogItemPrice(item):cart36FallbackUnitPrice(item);
}
function cartItemLineTotal(item){
  const price=cartItemUnitPrice(item);
  const qty=Number(item?.qty||0);
  return price===null||!Number.isFinite(price)||!Number.isFinite(qty)?null:price*qty;
}
function cartPriceSummary(cart){
  let total=0,priced=0,unpriced=0;
  for(const item of cart||[]){
    const line=cartItemLineTotal(item);
    if(line===null)unpriced++;
    else {total+=line;priced++}
  }
  return {total,priced,unpriced,complete:unpriced===0};
}
