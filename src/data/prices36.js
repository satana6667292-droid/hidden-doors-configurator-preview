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

// v186: non-standard 36 mm telescopic extension price by approved piecewise-linear formula.
// Control Opt 2 points remain exact: 100 mm = 655 ₽, 150 mm = 770 ₽, 200 mm = 989 ₽.
// Range follows the existing configurator limit: 50–500 mm.
function price36DoborOpt2(width){
  const w=Number(width);
  if(!Number.isFinite(w)||w<50||w>500)return null;
  const p100=SALES_PRICE_36_OPT2.trim.dobor100;
  const p150=SALES_PRICE_36_OPT2.trim.dobor150;
  const p200=SALES_PRICE_36_OPT2.trim.dobor200;
  const raw=w<=150
    ?p100+(w-100)*((p150-p100)/50)
    :p150+(w-150)*((p200-p150)/50);
  return Math.ceil(raw);
}
function price36DoborUnitPrice(width,priceType=activeSalesPriceType()){
  const opt2=price36DoborOpt2(width);
  if(opt2===null)return null;
  const type=normalizeSalesPriceType(priceType);
  if(type==='wholesale2')return opt2;
  if(type==='wholesale1')return price36ApplyMarkup(opt2,PRICE36_WHOLESALE1_MARKUP);
  if(type==='retail')return price36ApplyMarkup(opt2,PRICE36_RETAIL_MARKUP);
  return null;
}

const PRICE36_GROUND_DISCOUNT=2000;
const PRICE36_GROUND_FACTOR=9730/11730;
function price36GroundOpt2FromPvc(value){
  const n=Number(value);
  return Number.isFinite(n)?Math.ceil(n*PRICE36_GROUND_FACTOR):null;
}
const PRICE36_GROUND_OPT2=Object.freeze({
  leaf:6391,
  box:675.20,
  casing:330.20
});
function price36GroundComponentUnitPrice(kind,priceType=activeSalesPriceType()){
  const base=Number(PRICE36_GROUND_OPT2[kind]);
  if(!Number.isFinite(base))return null;
  const type=normalizeSalesPriceType(priceType);
  if(type==='wholesale2')return base;
  if(type==='wholesale1')return price36ApplyMarkup(base,PRICE36_WHOLESALE1_MARKUP);
  if(type==='retail')return price36ApplyMarkup(base,PRICE36_RETAIL_MARKUP);
  return null;
}
function price36LeafUnitPrice(cover,priceType=activeSalesPriceType()){
  const book=price36Book(priceType);
  if(!book)return null;
  return cover==='Грунт под покраску'
    ?price36GroundComponentUnitPrice('leaf',priceType)
    :Number(book.doorLeaf);
}

function trim36PartnerUnitPrice(priceType=activeSalesPriceType()){
  const book=price36Book(priceType);
  const type=$('trimType')?.value||'';
  if(!book)return {price:null,label:type||'Погонаж 36',missingTier:true};
  const ground=$('trimCover')?.value==='Грунт под покраску';
  if(type==='Короб телескопический')return {price:ground?price36GroundComponentUnitPrice('box',priceType):book.trim.box,label:'Короб телескопический'};
  if(type==='Наличник телескопический')return {price:ground?price36GroundComponentUnitPrice('casing',priceType):book.trim.casing,label:'Наличник телескопический'};
  if(type==='Притворная планка'){
    const opt2=ground?price36GroundOpt2FromPvc(SALES_PRICE_36_OPT2.trim.rebate):SALES_PRICE_36_OPT2.trim.rebate;
    const price=ground
      ?(normalizeSalesPriceType(priceType)==='wholesale2'?opt2:price36ApplyMarkup(opt2,normalizeSalesPriceType(priceType)==='wholesale1'?PRICE36_WHOLESALE1_MARKUP:PRICE36_RETAIL_MARKUP))
      :book.trim.rebate;
    return {price,label:'Притворная планка'};
  }
  if(type==='Соединительная планка для стыковки доборов')return {price:book.trim.connector,label:'Соединительная планка'};
  if(type==='Добор телескопический'){
    const width=doborWidth();
    const standard=[100,150,200].includes(width);
    const pvcOpt2=price36DoborOpt2(width);
    const groundOpt2=ground?price36GroundOpt2FromPvc(pvcOpt2):pvcOpt2;
    const normalized=normalizeSalesPriceType(priceType);
    const price=ground
      ?(normalized==='wholesale2'?groundOpt2:price36ApplyMarkup(groundOpt2,normalized==='wholesale1'?PRICE36_WHOLESALE1_MARKUP:PRICE36_RETAIL_MARKUP))
      :price36DoborUnitPrice(width,priceType);
    return {
      price,
      label:'Добор телескопический '+width+' мм',
      custom:!standard,
      width
    };
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
    const cover=$('cover36')?.value||'ПВХ-пленка';
    const ground=cover==='Грунт под покраску';
    const leaf=price36LeafUnitPrice(cover,type);
    const included=includeBox();
    const boxQty=included?Number($('bundle36BoxQty')?.value||0):0;
    const casingQty=included?Number($('bundle36TrimQty')?.value||0):0;
    const boxUnit=ground?price36GroundComponentUnitPrice('box',type):book.trim.box;
    const casingUnit=ground?price36GroundComponentUnitPrice('casing',type):book.trim.casing;
    const boxSum=boxQty*boxUnit;
    const casingSum=casingQty*casingUnit;
    const total=leaf+boxSum+casingSum;
    const defaultKit=included&&boxQty===2.5&&casingQty===5;
    const lines=[
      '<div><b>Полотно:</b> '+formatRub(leaf)+'</div>',
      included?'<div>Короб: '+boxQty+' × '+formatRub(boxUnit)+' = <b>'+formatRub(boxSum)+'</b></div>':'',
      included?'<div>Наличник: '+casingQty+' × '+formatRub(casingUnit)+' = <b>'+formatRub(casingSum)+'</b></div>':'',
      '<div style="margin-top:6px"><b>'+(defaultKit?'Комплект':'Итого')+': '+formatRub(total)+'</b></div>'
    ].filter(Boolean);
    return {
      visible:true,available:true,title:formatRub(total),html:lines.join(''),priceType:type,
      note:price36SourceNote(book)
        +(ground?' · грунт под покраску: скидка 2 000 ₽ распределена пропорционально между полотном, 2,5 палками короба и 5 наличниками':'')
        +(defaultKit&&!ground?' · базовый комплект совпадает с прайсом '+formatRub(book.doorKit):'')
        +(defaultKit&&ground&&type==='wholesale2'?' · базовый комплект в грунте '+formatRub(9730):'')
    };
  }

  const item=trim36PartnerUnitPrice(type);
  const trimType=$('trimType')?.value||'';
  const connector=trimType==='Соединительная планка для стыковки доборов';
  const groundTrim=$('trimCover')?.value==='Грунт под покраску';
  const groundPriced=['Короб телескопический','Наличник телескопический','Добор телескопический','Притворная планка'].includes(trimType);
  if(!connector && groundTrim && !groundPriced){
    return {visible:true,available:false,title:'Цена по запросу',note:'Для грунта автоматически рассчитаны только короб и наличник из состава стандартного комплекта. Для этой позиции цена пока не утверждена.',priceType:type};
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
    note:price36SourceNote(book)+(item.custom
      ?' · нестандартный добор '+item.width+' мм рассчитан по утверждённой кусочно-линейной формуле от контрольных точек 100 / 150 / 200 мм'
      :'')
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
    return price36LeafUnitPrice($('cover36')?.value||'ПВХ-пленка',priceType);
  }
  if(product()==='trim36'){
    const trimType=$('trimType')?.value||'';
    const connector=trimType==='Соединительная планка для стыковки доборов';
    const ground=$('trimCover')?.value==='Грунт под покраску';
    const groundPriced=['Короб телескопический','Наличник телескопический','Добор телескопический','Притворная планка'].includes(trimType);
    if(!connector && ground && !groundPriced)return null;
    return trim36PartnerUnitPrice(priceType).price;
  }
  return null;
}
function companion36UnitPrice(item,priceType=activeSalesPriceType()){
  const book=price36Book(priceType);
  if(!book)return null;
  const key=String(item?.baseKey||item?.key||'');
  const ground=/Грунт под покраску/i.test(String(item?.name||''));
  if(key==='BUNDLE-P36-BOX')return ground?price36GroundComponentUnitPrice('box',priceType):book.trim.box;
  if(key==='BUNDLE-P36-TRIM')return ground?price36GroundComponentUnitPrice('casing',priceType):book.trim.casing;
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
  if(baseKey==='BUNDLE-P36-BOX'||sku.startsWith('BUNDLE-P36-BOX-')||/Короб телескопический 36/i.test(name)){
    return /Грунт под покраску/i.test(name)?price36GroundComponentUnitPrice('box',priceType):book.trim.box;
  }
  if(baseKey==='BUNDLE-P36-TRIM'||sku.startsWith('BUNDLE-P36-TRIM-')||/Наличник телескопический 36/i.test(name)){
    return /Грунт под покраску/i.test(name)?price36GroundComponentUnitPrice('casing',priceType):book.trim.casing;
  }
  if(category==='Дверь 36'||/Дверь\s*\/\s*36 мм/i.test(name)){
    return price36LeafUnitPrice(/Грунт под покраску/i.test(name)?'Грунт под покраску':'ПВХ-пленка',priceType);
  }
  if(category==='Погонаж 36'){
    const ground=/Грунт под покраску/i.test(name);
    if(/Короб телескопический/i.test(name))return ground?price36GroundComponentUnitPrice('box',priceType):book.trim.box;
    if(/Наличник телескопический/i.test(name))return ground?price36GroundComponentUnitPrice('casing',priceType):book.trim.casing;
    if(/Притворная планка/i.test(name)){
      if(!ground)return book.trim.rebate;
      const opt2=price36GroundOpt2FromPvc(SALES_PRICE_36_OPT2.trim.rebate);
      const normalized=normalizeSalesPriceType(priceType);
      return normalized==='wholesale2'?opt2:price36ApplyMarkup(opt2,normalized==='wholesale1'?PRICE36_WHOLESALE1_MARKUP:PRICE36_RETAIL_MARKUP);
    }
    if(/Соединительная планка/i.test(name))return book.trim.connector;
    if(/Добор/i.test(name)){
      const sizeMatch=name.match(/10\s*[×xX]\s*(\d{2,3})\s*[×xX]\s*2070/i);
      const widthMatch=name.match(/Добор[^\d]{0,40}(\d{2,3})\s*мм/i);
      const legacyMatch=name.match(/(?:\b|×)(100|150|200)(?:\b|×)/);
      const width=sizeMatch?Number(sizeMatch[1]):widthMatch?Number(widthMatch[1]):legacyMatch?Number(legacyMatch[1]):null;
      if(width!==null){
        if(!ground)return price36DoborUnitPrice(width,priceType);
        const opt2=price36GroundOpt2FromPvc(price36DoborOpt2(width));
        const normalized=normalizeSalesPriceType(priceType);
        return normalized==='wholesale2'?opt2:price36ApplyMarkup(opt2,normalized==='wholesale1'?PRICE36_WHOLESALE1_MARKUP:PRICE36_RETAIL_MARKUP);
      }
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
  if(['leaf36','trim36','trim42','trim59','single42','sliding42','single59','double42'].includes(product()))return activeSalesPriceType();
  if(product()==='hardware'&&typeof hardwareSalesPriceType==='function'){
    const uiCategory=$('hardwareCategory')?.value||'';
    const category=(typeof HARDWARE_MAP!=='undefined'?(HARDWARE_MAP[uiCategory]||uiCategory):uiCategory);
    return hardwareSalesPriceType(category,$('catalogItem')?.value||'',activeSalesPriceType());
  }
  if(product()==='openingSystem')return 'retail';
  if(product()==='installation')return 'retail';
  if(product()==='additionalElement'){
    const type=$('additionalType')?.value||'';
    const name=$('catalogItem')?.value||'';
    if(type==='Вентиляционные решётки')return 'retail';
    if(typeof hardwareSalesPrice==='function'&&hardwareSalesPrice('Доп.фурнитура',name,'retail')!==null)return 'retail';
  }
  return null;
}
function companionSalesPriceType(item){
  const key=String(item?.baseKey||item?.key||'');
  if(/^BUNDLE-P36-/.test(key))return activeSalesPriceType();
  if(key==='BUNDLE-P42-BOX'||key==='BUNDLE-P59-BOX')return activeSalesPriceType();
  if(/^BUNDLE-P42-DOUBLE-/.test(key))return activeSalesPriceType();
  if(key==='DOUBLE42-BOLT')return activeSalesPriceType();
  if(key==='POWDER-COAT-42'||key==='POWDER-COAT-59')return activeSalesPriceType();
  if(/^BOX-MITER45-/.test(key))return activeSalesPriceType();
  if(/^PROCESS-/.test(key))return activeSalesPriceType();
  if(key==='DOOR-VENT-GRILLE'||key==='DOOR-ADDITIONAL-ELEMENT')return 'retail';
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
