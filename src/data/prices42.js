// 42 mm sales prices.
// Source: approved «Партнёрский прайс Hidden Doors 2026» plus approved coefficient rules.
// Opt 2 is calculated from the 2000 mm base price. Opening direction/reverse does not change price.
const SALES_PRICE_42_STANDARD=Object.freeze({
  retail:null,
  wholesale1:null,
  wholesale2:Object.freeze({
    priceType:'wholesale2',
    priceTypeLabel:'Опт 2',
    source:'Hidden doors Партнерский Прайс продуктовой линейки',
    sourceFileId:'10fH0RYUWVd5UWXJT6t7U8Iu1gJbI4LPpQWGPeQMF7mc',
    priceBookId:'partner-2026-v1',
    updated:'22.01.2026',
    standardHeight:2000,
    standardWidth:900,
    dimensionFormula:'linear-height-width',
    base:Object.freeze({
      plywood:Object.freeze({gray:9856,black:10293}),
      aluminum:Object.freeze({gray:14916,black:15353})
    }),
    // Compatibility alias for older standard-2000 code paths.
    leaf:Object.freeze({gray:9856,black:10293}),
    limits:Object.freeze({
      plywood:Object.freeze({minHeight:1700,maxHeight:2200}),
      aluminum:Object.freeze({minHeight:1700,maxHeight:2300}),
      minWidth:450,
      maxWidth:1000
    }),
    heightRules:Object.freeze([
      Object.freeze({min:1700,max:1995,factor:1.2,label:'1700–1995 · нестандарт вниз'}),
      Object.freeze({min:2000,max:2000,factor:1,label:'2000 · база'}),
      Object.freeze({min:2005,max:2050,factor:1.05,label:'2005–2050 → цена 2050'}),
      Object.freeze({min:2055,max:2100,factor:1.10,label:'2055–2100 → цена 2100'}),
      Object.freeze({min:2105,max:2150,factor:1.15,label:'2105–2150 → цена 2150'}),
      Object.freeze({min:2155,max:2200,factor:1.20,label:'2155–2200 → цена 2200'}),
      Object.freeze({min:2205,max:2250,factor:1.25,label:'2205–2250 → цена 2250'}),
      Object.freeze({min:2255,max:2300,factor:1.30,label:'2255–2300 → цена 2300'})
    ]),
    widthRule:Object.freeze({above:900,factor:1.2}),
    heightAnchors:Object.freeze({
      plywood:Object.freeze({
        gray:Object.freeze({2000:9856,2100:10842,2200:11827}),
        black:Object.freeze({2000:10293,2100:11322,2200:12352})
      }),
      aluminum:Object.freeze({
        gray:Object.freeze({2000:14916,2300:19391}),
        black:Object.freeze({2000:15353,2300:19959})
      })
    })
  })
});

const PRICE42_WHOLESALE1_MARKUP=0.125;
const PRICE42_RETAIL_MARKUP=0.50;

const SALES_PRICE_42_BOX_OPT2=Object.freeze({
  baseHeight:2000,
  minHeight:1700,
  maxHeight:2300,
  minWidth:450,
  maxWidth:1000,
  base:Object.freeze({gray:5594,black:6514}),
  heightAnchors:Object.freeze({
    gray:Object.freeze({2000:5594,2100:6154,2200:6713,2300:7272}),
    black:Object.freeze({2000:6514,2100:7166,2200:7817,2300:8468})
  }),
  source:'Hidden doors Партнерский Прайс продуктовой линейки',
  updated:'22.01.2026'
});

function price42BoxColorKey(color=''){
  const s=String(color||'');
  if(/ч[её]рн/i.test(s))return 'black';
  if(/сер|хром/i.test(s))return 'gray';
  if(/полимер|порош/i.test(s))return 'gray';
  return '';
}
function price42BoxPriceHeight(height){
  const h=Number(height);
  if(!Number.isFinite(h))return null;
  if(h<=SALES_PRICE_42_BOX_OPT2.baseHeight)return SALES_PRICE_42_BOX_OPT2.baseHeight;
  return Math.ceil(h/50)*50;
}
function price42BoxOpt2AtHeight(height,colorKey){
  const priceHeight=price42BoxPriceHeight(height);
  if(priceHeight===null)return null;
  const anchor=Number(SALES_PRICE_42_BOX_OPT2.heightAnchors?.[colorKey]?.[priceHeight]);
  if(Number.isFinite(anchor))return anchor;
  const base=Number(SALES_PRICE_42_BOX_OPT2.base?.[colorKey]);
  if(!Number.isFinite(base))return null;
  const factor=1+Math.max(0,priceHeight-SALES_PRICE_42_BOX_OPT2.baseHeight)/1000;
  return Math.ceil(base*factor);
}
function price42BoxCalculation({height,width,colorKey,color}={},priceType=activeSalesPriceType()){
  const h=Number(height),w=Number(width);
  const key=colorKey||price42BoxColorKey(color);
  if(!['gray','black'].includes(key))return {ok:false,reason:'Для выбранного цвета короба цена пока не зафиксирована.'};
  if(!Number.isFinite(h)||h<SALES_PRICE_42_BOX_OPT2.minHeight||h>SALES_PRICE_42_BOX_OPT2.maxHeight){
    return {ok:false,reason:'Для короба 42 цена утверждена для высоты 1700–2300 мм.'};
  }
  if(h%5!==0)return {ok:false,reason:'Высота короба 42 должна быть кратна 5 мм.'};
  if(!Number.isFinite(w)||w<SALES_PRICE_42_BOX_OPT2.minWidth||w>SALES_PRICE_42_BOX_OPT2.maxWidth){
    return {ok:false,reason:'Ширина вне текущего диапазона конфигуратора 450–1000 мм.'};
  }
  const priceHeight=price42BoxPriceHeight(h);
  const opt2Price=price42BoxOpt2AtHeight(h,key);
  if(!Number.isFinite(opt2Price))return {ok:false,reason:'Цена короба для выбранной высоты не рассчитана.'};
  const type=normalizeSalesPriceType(priceType);
  const heightFactor=priceHeight<=2000?1:1+(priceHeight-2000)/1000;
  return {
    ok:true,
    priceType:type,
    colorKey:key,
    height:h,
    width:w,
    priceHeight,
    heightFactor,
    widthFactor:1,
    opt2Price,
    price:price42ApplySalesTier(opt2Price,type),
    formula:priceHeight<=2000
      ?'Цена короба 2000 мм; ширина без доплаты'
      :'Ценовая высота '+priceHeight+' мм; +5% за каждые 50 мм; ширина без доплаты'+(type==='wholesale2'?'':' · '+price42TierFormula(type))
  };
}
function price42BoxCompanionUnitPrice(item,priceType=activeSalesPriceType()){
  const key=String(item?.baseKey||item?.key||'');
  if(key!=='BUNDLE-P42-BOX')return null;
  const calc=price42BoxCalculation({
    height:item?.boxHeight,
    width:item?.boxWidth,
    colorKey:item?.boxColorKey,
    color:item?.boxColor
  },priceType);
  return calc.ok?calc.price:null;
}

const PRICE42_POWDER_COAT_RATE_PER_M=460;
const PRICE42_POWDER_COAT_RESERVE_FACTOR=1.10;
const PRICE42_BOX_MITER45_FIXED_PRICE=1100;

function price42IsPowderColor(value=''){
  return /полимер|порош/i.test(String(value||''));
}
function price42RoundLength(value){
  const n=Number(value);
  return Number.isFinite(n)?Math.round(n*10000)/10000:null;
}
function price42PowderCoatCalculation({height,width,edgeColor,boxColor,includeBox:withBox=false}={}){
  const h=Number(height),w=Number(width);
  if(!Number.isFinite(h)||h<=0||!Number.isFinite(w)||w<=0){
    return {active:false,edgeMeters:0,boxMeters:0,rawMeters:0,billableMeters:0,total:0};
  }
  const edgePainted=price42IsPowderColor(edgeColor);
  const boxPainted=!!withBox&&price42IsPowderColor(boxColor);
  const edgeMm=edgePainted?(2*(h+20)+2*(w+20)):0;
  const boxMm=boxPainted?(2*(h+100)+(w+100)):0;
  const rawMeters=price42RoundLength((edgeMm+boxMm)/1000)||0;
  const billableMeters=price42RoundLength(rawMeters*PRICE42_POWDER_COAT_RESERVE_FACTOR)||0;
  return {
    active:edgePainted||boxPainted,
    edgePainted,boxPainted,
    edgeMeters:price42RoundLength(edgeMm/1000)||0,
    boxMeters:price42RoundLength(boxMm/1000)||0,
    rawMeters,billableMeters,
    ratePerMeter:PRICE42_POWDER_COAT_RATE_PER_M,
    reservePercent:10,
    total:Math.ceil(billableMeters*PRICE42_POWDER_COAT_RATE_PER_M)
  };
}
function price42CurrentPowderCoatItem(){
  if(product()!=='single42')return null;
  const edgeColor=$('SingleEdgeColor')?.value||'';
  const boxColor=$('bundle42Color')?.value||'';
  const calc=price42PowderCoatCalculation({
    height:currentHeight(),
    width:currentWidth(),
    edgeColor,
    boxColor,
    includeBox:includeBox()
  });
  if(!calc.active||calc.billableMeters<=0)return null;
  const edgeRal=$('SingleEdgeRal')?.value||'';
  const boxRal=$('bundle42Ral')?.value||'';
  const ralParts=[];
  if(calc.edgePainted)ralParts.push('торец '+(edgeRal||'RAL'));
  if(calc.boxPainted)ralParts.push('короб '+(boxRal||edgeRal||'RAL'));
  const noteParts=[];
  if(calc.boxPainted)noteParts.push('короб '+String(calc.boxMeters).replace('.',',')+' м');
  if(calc.edgePainted)noteParts.push('алюминиевые торцы '+String(calc.edgeMeters).replace('.',',')+' м');
  return {
    key:'POWDER-COAT-42',
    baseKey:'POWDER-COAT-42',
    type:'Услуги / Полимерно-порошковая покраска',
    qty:calc.billableMeters,
    unit:'м.п.',
    step:0.0005,
    kind:'service',
    fixedUnitPrice:PRICE42_POWDER_COAT_RATE_PER_M,
    priceNote:noteParts.join(' + ')+' = '+String(calc.rawMeters).replace('.',',')+' м; +10% запас = '+String(calc.billableMeters).replace('.',',')+' м.',
    name:'Полимерно-порошковая покраска профиля 42 / '+ralParts.join(' / ')+' / '+String(calc.billableMeters).replace('.',',')+' м.п. × '+PRICE42_POWDER_COAT_RATE_PER_M+' ₽'
  };
}

const PRICE42_PVC_RATE_PER_HEIGHT_M_PER_SIDE=1725;
const PRICE42_GENERAL_FILM_SURCHARGE_PER_DOOR=2300;
const PRICE42_ENAMEL_RATE_PER_SQM_PER_SIDE=4000;
const PRICE42_AUTO_FINISH_TYPES=Object.freeze(['Грунт под покраску','ПВХ-пленка','Эмаль']);
const PRICE42_QUOTE_FINISH_TYPES=Object.freeze(['Шпон','HPL']);

function price42RoundMoney(value){
  const n=Number(value);
  return Number.isFinite(n)?Math.round(n*100)/100:null;
}

function price42TierMarkup(priceType='wholesale2'){
  const type=normalizeSalesPriceType(priceType);
  if(type==='wholesale1')return PRICE42_WHOLESALE1_MARKUP;
  if(type==='retail')return PRICE42_RETAIL_MARKUP;
  return 0;
}
function price42TierFormula(priceType='wholesale2'){
  const type=normalizeSalesPriceType(priceType);
  if(type==='wholesale1')return 'Опт 2 + 12,5%';
  if(type==='retail')return 'Опт 2 + 50%';
  return '';
}
function price42ApplySalesTier(value,priceType='wholesale2'){
  const n=Number(value);
  if(!Number.isFinite(n))return null;
  return Math.ceil(n*(1+price42TierMarkup(priceType)));
}
function price42BookWithTierMeta(base,priceType='wholesale2'){
  if(!base)return null;
  const type=normalizeSalesPriceType(priceType);
  if(type==='wholesale2')return base;
  return {
    ...base,
    priceType:type,
    priceTypeLabel:salesPriceTypeLabel(type),
    priceBookId:type==='wholesale1'?'partner-2026-v1-wholesale1':'partner-2026-v1-retail',
    source:'Расчёт от «Партнёрский прайс Hidden Doors 2026»',
    derivedFromPriceType:'wholesale2',
    derivedFormula:price42TierFormula(type),
    markupRate:price42TierMarkup(type)
  };
}

const PRICE42_MANUAL_RULE_STORE='hd_v82_price42_manual_rules';

function price42ApprovedBook(priceType=activeSalesPriceType()){
  return price42BookWithTierMeta(SALES_PRICE_42_STANDARD.wholesale2,priceType);
}
function price42ManualOverrides(){
  if(typeof getStore!=='function')return null;
  const raw=getStore(PRICE42_MANUAL_RULE_STORE,null);
  return raw&&typeof raw==='object'?raw:null;
}
function price42SafePositiveNumber(value,fallback){
  const n=Number(value);
  return Number.isFinite(n)&&n>0?n:fallback;
}
function price42Book(priceType=activeSalesPriceType()){
  const type=normalizeSalesPriceType(priceType);
  const approved=SALES_PRICE_42_STANDARD.wholesale2;
  if(!approved)return null;
  const manual=price42ManualOverrides();
  let effectiveOpt2=approved;
  if(manual){
    const approvedBase=approved.base||{};
    const approvedRules=approved.heightRules||[];
    effectiveOpt2={
      ...approved,
      manualOverride:true,
      manualUpdatedAt:manual.updatedAt||'',
      base:{
        plywood:{
          gray:price42SafePositiveNumber(manual.base?.plywood?.gray,approvedBase.plywood?.gray),
          black:price42SafePositiveNumber(manual.base?.plywood?.black,approvedBase.plywood?.black)
        },
        aluminum:{
          gray:price42SafePositiveNumber(manual.base?.aluminum?.gray,approvedBase.aluminum?.gray),
          black:price42SafePositiveNumber(manual.base?.aluminum?.black,approvedBase.aluminum?.black)
        }
      },
      standardHeight:2000,
      standardWidth:900,
      dimensionFormula:'linear-height-width'
    };
  }
  return price42BookWithTierMeta(effectiveOpt2,type);
}
function price42AdminRuleValues(){
  const book=price42Book('wholesale2');
  return {
    base:{
      plywood:{gray:book?.base?.plywood?.gray??'',black:book?.base?.plywood?.black??''},
      aluminum:{gray:book?.base?.aluminum?.gray??'',black:book?.base?.aluminum?.black??''}
    },
    standardHeight:Number(book?.standardHeight||2000),
    standardWidth:Number(book?.standardWidth||900),
    manualOverride:!!book?.manualOverride,
    manualUpdatedAt:book?.manualUpdatedAt||''
  };
}
function savePrice42AdminRules(values){
  const approved=price42ApprovedBook('wholesale2');
  if(!approved)return {ok:false,error:'Активный прайс Опт 2 не найден.'};
  const next={
    base:{
      plywood:{
        gray:Number(values?.base?.plywood?.gray),
        black:Number(values?.base?.plywood?.black)
      },
      aluminum:{
        gray:Number(values?.base?.aluminum?.gray),
        black:Number(values?.base?.aluminum?.black)
      }
    },
    standardHeight:2000,
    standardWidth:900,
    dimensionFormula:'linear-height-width',
    updatedAt:new Date().toISOString()
  };
  const nums=[next.base.plywood.gray,next.base.plywood.black,next.base.aluminum.gray,next.base.aluminum.black];
  if(nums.some(x=>!Number.isFinite(x)||x<=0)){
    return {ok:false,error:'Все базовые цены должны быть положительными числами.'};
  }
  if(typeof setStore!=='function')return {ok:false,error:'Локальное хранилище недоступно.'};
  setStore(PRICE42_MANUAL_RULE_STORE,next);
  return {ok:true};
}
function resetPrice42AdminRules(){
  try{localStorage.removeItem(PRICE42_MANUAL_RULE_STORE)}catch(e){}
}
function price42HasManualRules(){return !!price42ManualOverrides()}
function price42RuleCalculation({height,width,frameKey,edgeKey},priceType='wholesale2'){
  const type=normalizeSalesPriceType(priceType);
  const book=price42Book(type);
  const opt2Book=price42Book('wholesale2');
  const h=Number(height),w=Number(width);
  if(!book||!opt2Book)return {ok:false,reason:'Нет активного прайса.'};
  const limits=opt2Book.limits?.[frameKey];
  if(!limits)return {ok:false,reason:'Неизвестный тип каркаса.'};
  if(!Number.isFinite(h)||h<limits.minHeight||h>limits.maxHeight)return {ok:false,reason:'Высота вне допустимого диапазона.'};
  if(!Number.isFinite(w)||w<opt2Book.limits.minWidth||w>opt2Book.limits.maxWidth)return {ok:false,reason:'Ширина вне допустимого диапазона.'};
  if(h%5!==0||w%5!==0)return {ok:false,reason:'Высота и ширина должны быть кратны 5 мм.'};
  const opt2BasePrice=Number(opt2Book.base?.[frameKey]?.[edgeKey]);
  if(!Number.isFinite(opt2BasePrice))return {ok:false,reason:'Базовая цена не найдена.'};
  const heightFactor=price42HeightFactor(h,opt2Book);
  const widthFactor=price42WidthFactor(w,opt2Book);
  if(heightFactor===null||widthFactor===null)return {ok:false,reason:'Не найден коэффициент.'};
  const appliedFactor=Number(heightFactor)*Number(widthFactor);
  const priceHeight=price42PriceHeight(h);
  const opt2Price=Math.ceil(opt2BasePrice*appliedFactor);
  const price=price42ApplySalesTier(opt2Price,type);
  const basePrice=price42ApplySalesTier(opt2BasePrice,type);
  return {
    ok:true,price,basePrice,opt2Price,opt2BasePrice,
    heightFactor,widthFactor,appliedFactor,priceHeight,
    height:h,width:w,frameKey,edgeKey,
    priceType:type,markupRate:price42TierMarkup(type),
    derivedFormula:price42TierFormula(type),
    manualOverride:!!opt2Book.manualOverride
  };
}
function price42TypeLabel(priceType=activeSalesPriceType()){
  return salesPriceTypeLabel(priceType);
}
function price42EdgeKey(edge=$('SingleEdgeColor')?.value||''){
  if(edge==='Серый анод')return 'gray';
  if(edge==='Черный анод')return 'black';
  if(edge==='Полимерно-порошковая покраска')return 'gray';
  return '';
}
function price42FrameKey(frame=$('frame')?.value||''){
  if(frame==='Каркас из фанеры')return 'plywood';
  if(frame==='Алюминиевый каркас')return 'aluminum';
  return '';
}
function price42FrameLabel(frameKey){
  return frameKey==='aluminum'?'алюминиевый каркас':'каркас из фанеры';
}
function price42HeightFactor(height,book=price42Book()){
  const h=Number(height);
  const base=Number(book?.standardHeight||2000);
  return Number.isFinite(h)&&h>0&&Number.isFinite(base)&&base>0?h/base:null;
}
function price42WidthFactor(width,book=price42Book()){
  const w=Number(width);
  const base=Number(book?.standardWidth||900);
  if(!Number.isFinite(w)||w<=0||!Number.isFinite(base)||base<=0)return null;
  return w<=base?1:w/base;
}
function price42PriceHeight(height){
  const h=Number(height);
  return Number.isFinite(h)&&h>0?h:null;
}
function price42HeightAnchor(){return null}

function price42FinishCalculation(config={},priceType='wholesale2'){
  const type=normalizeSalesPriceType(priceType);
  const h=Number(config.height),w=Number(config.width);
  const side1Type=String(config.side1Type||'Грунт под покраску');
  const side2Type=String(config.side2Type||'Грунт под покраску');
  const types=[side1Type,side2Type];
  const quoteTypes=[...new Set(types.filter(x=>PRICE42_QUOTE_FINISH_TYPES.includes(x)))];
  const unsupported=[...new Set(types.filter(x=>!PRICE42_AUTO_FINISH_TYPES.includes(x)&&!PRICE42_QUOTE_FINISH_TYPES.includes(x)))];

  if(quoteTypes.length){
    return {
      ok:true,priceOnRequest:true,quoteTypes,
      reason:quoteTypes.join(' / ')+' — цена после согласования.'
    };
  }
  if(unsupported.length){
    return {
      ok:true,priceOnRequest:true,quoteTypes:[],
      reason:'Для покрытия «'+unsupported.join(' / ')+'» автоматическая цена пока не согласована.'
    };
  }
  if(!Number.isFinite(h)||h<=0||!Number.isFinite(w)||w<=0){
    return {ok:false,priceOnRequest:false,reason:'Некорректный размер полотна для расчёта покрытия.'};
  }

  const pvcSides=types.filter(x=>x==='ПВХ-пленка').length;
  const side1Catalog=String(config.side1Catalog||'Hidden Doors');
  const side2Catalog=String(config.side2Catalog||'Hidden Doors');
  const generalCatalogSelected=
    (side1Type==='ПВХ-пленка'&&side1Catalog==='Общий каталог')||
    (side2Type==='ПВХ-пленка'&&side2Catalog==='Общий каталог');

  const pvcOpt2=price42RoundMoney((h/1000)*PRICE42_PVC_RATE_PER_HEIGHT_M_PER_SIDE*pvcSides)||0;
  const generalCatalogOpt2=generalCatalogSelected?PRICE42_GENERAL_FILM_SURCHARGE_PER_DOOR:0;
  const pvcPrice=price42ApplySalesTier(pvcOpt2,type)||0;
  const generalCatalogPrice=price42ApplySalesTier(generalCatalogOpt2,type)||0;

  const enamelSides=types.filter(x=>x==='Эмаль').length;
  const areaPerSide=price42RoundMoney((h/1000)*(w/1000))||0;
  const enamelPrice=price42RoundMoney(areaPerSide*PRICE42_ENAMEL_RATE_PER_SQM_PER_SIDE*enamelSides)||0;

  return {
    ok:true,priceOnRequest:false,quoteTypes:[],
    pvcSides,pvcOpt2,pvcPrice,
    generalCatalogSelected,generalCatalogOpt2,generalCatalogPrice,
    enamelSides,areaPerSide,enamelPrice,
    opt2Price:price42RoundMoney(pvcOpt2+generalCatalogOpt2+enamelPrice)||0,
    price:price42RoundMoney(pvcPrice+generalCatalogPrice+enamelPrice)||0,
    priceType:type
  };
}
function price42CurrentFinishConfig(){
  return {
    height:currentHeight(),
    width:currentWidth(),
    side1Type:$('SingleSide1Type')?.value||'Грунт под покраску',
    side2Type:$('SingleSide2Type')?.value||'Грунт под покраску',
    side1Catalog:$('SingleSide1FilmCatalog')?.value||'Hidden Doors',
    side2Catalog:$('SingleSide2FilmCatalog')?.value||'Hidden Doors'
  };
}

function standard42PriceEligibility(priceType=activeSalesPriceType()){
  if(product()!=='single42')return {eligible:false,reason:'not42'};
  const book=price42Book(priceType);
  const height=currentHeight(),width=currentWidth();
  const frame=$('frame')?.value||'',frameKey=price42FrameKey(frame);
  const side1=$('SingleSide1Type')?.value||'',side2=$('SingleSide2Type')?.value||'';
  const edge=$('SingleEdgeColor')?.value||'',edgeKey=price42EdgeKey(edge);
  const finish=price42FinishCalculation(price42CurrentFinishConfig(),priceType);
  const reasons=[];
  if(!book)reasons.push('для выбранного типа цены нет активной книги цен');
  if(!frameKey)reasons.push('неизвестная конструкция полотна');
  const limits=frameKey&&book?.limits?.[frameKey];
  if(limits&&(height<limits.minHeight||height>limits.maxHeight))reasons.push('высота вне диапазона '+limits.minHeight+'–'+limits.maxHeight+' мм для выбранного каркаса');
  if(!limits)reasons.push('для выбранного каркаса не задан диапазон высот');
  if(width<Number(book?.limits?.minWidth||450)||width>Number(book?.limits?.maxWidth||1000))reasons.push('ширина вне утверждённого диапазона 450–1000 мм');
  if(Number.isFinite(height)&&height%5!==0)reasons.push('высота должна быть кратна 5 мм');
  if(Number.isFinite(width)&&width%5!==0)reasons.push('ширина должна быть кратна 5 мм');
  if(!edgeKey)reasons.push('торец должен быть серый/чёрный анод или полимерно-порошковый RAL');
  const heightFactor=price42HeightFactor(height,book);
  if(heightFactor===null)reasons.push('для этой высоты нет утверждённого коэффициента');
  const widthFactor=price42WidthFactor(width,book);
  if(!finish.ok||finish.priceOnRequest)reasons.push(finish.reason||'покрытие требует согласования цены');
  return {
    eligible:reasons.length===0,reasons,height,width,frame,frameKey,side1,side2,edge,edgeKey,heightFactor,widthFactor,
    finish,priceOnRequest:!!finish.priceOnRequest
  };
}

function price42Calculation(priceType=activeSalesPriceType()){
  const type=normalizeSalesPriceType(priceType);
  const book=price42Book(type);
  const e=standard42PriceEligibility(type);
  if(!book||!e.eligible)return {...e,price:null,basePrice:null,priceType:type};
  const ruleCalc=price42RuleCalculation({height:e.height,width:e.width,frameKey:e.frameKey,edgeKey:e.edgeKey},type);
  if(!ruleCalc.ok)return {...e,eligible:false,reasons:[...(e.reasons||[]),ruleCalc.reason||'цена не рассчитана'],price:null,basePrice:null,priceType:type};
  const finish=e.finish||price42FinishCalculation(price42CurrentFinishConfig(),type);
  if(!finish.ok||finish.priceOnRequest)return {...e,eligible:false,priceOnRequest:!!finish.priceOnRequest,price:null,basePrice:null,priceType:type,finish};
  const leafPrice=Number(ruleCalc.price);
  const opt2LeafPrice=Number(ruleCalc.opt2Price);
  const price=Math.ceil(leafPrice+Number(finish.price||0));
  const opt2Price=Math.ceil(opt2LeafPrice+Number(finish.opt2Price||0));
  return {
    ...e,...ruleCalc,
    leafPrice,opt2LeafPrice,finish,finishPrice:Number(finish.price||0),
    price,opt2Price,priceType:type
  };
}

function price42SourceNote(book){
  if(!book)return '';
  return book.source+' · price book '+(book.priceBookId||'—')+' · тип цены '+price42TypeLabel(book.priceType)+' · источник обновлён '+book.updated+(book.derivedFormula?' · формула '+book.derivedFormula:'')+(book.manualOverride?' · активны ручные настройки ЛК':'');
}
function price42StandardSnapshot(){
  if(product()!=='single42')return {visible:false};
  const type=activeSalesPriceType(),typeLabel=price42TypeLabel(type),book=price42Book(type);
  if(!book)return {
    visible:true,available:false,title:'Цена не заполнена',priceType:type,
    note:'Тип цены «'+typeLabel+'» создан, но цена полотна 42 мм для него пока не заполнена.'
  };
  const calc=price42Calculation(type);
  if(!calc.eligible||calc.price===null){
    const quote=!!calc.priceOnRequest;
    return {
      visible:true,available:false,title:quote?'Цена после согласования':'Цена по запросу',priceType:type,
      html:quote?'<div><b>Покрытие:</b> '+escapeHtml(finishText('Single',1))+' / '+escapeHtml(finishText('Single',2))+'</div>':'',
      note:quote
        ?((calc.finish?.reason||'Для выбранного покрытия требуется индивидуальное согласование цены.')+' Базовая конфигурация полотна сохраняется, финальная цена автоматически не рассчитывается.')
        :'Для «'+typeLabel+'» цена 42 мм рассчитывается только по утверждённым правилам: '+(calc.reasons||[]).join('; ')+'.'
    };
  }
  const edgeLabel=calc.edgeKey==='black'?'чёрный анод':'серый анод';
  const heightFactorText=Number(calc.heightFactor||1).toFixed(4).replace(/0+$/,'').replace(/\.$/,'').replace('.',',');
  const widthFactorText=Number(calc.widthFactor||1).toFixed(4).replace(/0+$/,'').replace(/\.$/,'').replace('.',',');
  const totalFactorText=Number(calc.appliedFactor||1).toFixed(4).replace(/0+$/,'').replace(/\.$/,'').replace('.',',');
  const widthFormula=calc.width<=900?'ширина '+calc.width+' мм → ×1':'ширина '+calc.width+'/900 = ×'+widthFactorText;
  const baseFormula='<div>База 2000×900: '+formatRub(calc.basePrice)+' · высота '+calc.height+'/2000 = ×'+heightFactorText+' · '+widthFormula+' · итоговый коэффициент ×'+totalFactorText+' → базовое полотно '+formatRub(calc.leafPrice)+'</div>';
  const f=calc.finish||{};
  const finishLines=[];
  if(f.pvcSides){
    const opt2Text=formatRub(f.pvcOpt2);
    const activeText=type==='wholesale2'?'':(' → '+formatRub(f.pvcPrice)+' для '+typeLabel);
    finishLines.push('<div>ПВХ: '+f.pvcSides+' стор. × '+String(calc.height/1000).replace('.',',')+' м × '+formatRub(PRICE42_PVC_RATE_PER_HEIGHT_M_PER_SIDE)+' = '+opt2Text+' по Опт 2'+activeText+'</div>');
  }
  if(f.generalCatalogSelected){
    const activeText=type==='wholesale2'?'':(' → '+formatRub(f.generalCatalogPrice)+' для '+typeLabel);
    finishLines.push('<div>Общий каталог ПВХ: +'+formatRub(PRICE42_GENERAL_FILM_SURCHARGE_PER_DOOR)+' один раз на дверь'+activeText+'</div>');
  }
  if(f.enamelSides){
    finishLines.push('<div>Эмаль: '+String(f.areaPerSide).replace('.',',')+' м² × '+formatRub(PRICE42_ENAMEL_RATE_PER_SQM_PER_SIDE)+' × '+f.enamelSides+' стор. = '+formatRub(f.enamelPrice)+'</div>');
  }
  return {
    visible:true,available:true,title:formatRub(calc.price),priceType:type,
    html:'<div><b>Полотно 42 мм:</b> '+formatRub(calc.price)+'</div>'+
      '<div>'+calc.height+'×'+calc.width+' · '+escapeHtml($('opening')?.value||'')+' · '+price42FrameLabel(calc.frameKey)+' · '+edgeLabel+'</div>'+
      baseFormula+finishLines.join(''),
    note:price42SourceNote(book)+
      ' · ПВХ: '+formatRub(PRICE42_PVC_RATE_PER_HEIGHT_M_PER_SIDE)+'/м высоты за каждую сторону, ширина не влияет; общий каталог +'+formatRub(PRICE42_GENERAL_FILM_SURCHARGE_PER_DOOR)+' один раз на дверь'+
      ' · эмаль: '+formatRub(PRICE42_ENAMEL_RATE_PER_SQM_PER_SIDE)+'/м² за каждую сторону, ставка одинакова для Опт 2 / Опт 1 / Розницы, любой RAL без доплаты'+
      ' · шпон и HPL: цена после согласования.'
  };
}

function renderSalesPrice42(){
  const wrap=$('price42ResultWrap'),caption=$('price42Caption'),value=$('price42Result'),details=$('price42Details'),note=$('price42Note');
  if(!wrap||!value||!details||!note)return;
  const snapshot=price42StandardSnapshot();
  wrap.classList.toggle('hidden',!snapshot.visible);
  if(!snapshot.visible)return;
  if(caption)caption.textContent='Цена полотна 42 · '+price42TypeLabel(snapshot.priceType||activeSalesPriceType());
  value.textContent=snapshot.title||'—';
  details.innerHTML=snapshot.html||'';
  note.textContent=snapshot.note||'';
}
function configured42StandardUnitPrice(priceType=activeSalesPriceType()){
  const calc=price42Calculation(priceType);
  return calc.eligible&&Number.isFinite(Number(calc.price))?Number(calc.price):null;
}
function configured42PriceNote(priceType=activeSalesPriceType()){
  if(product()!=='single42')return '';
  const calc=price42Calculation(priceType);
  return calc.priceOnRequest&&calc.finish?.quoteTypes?.length?'Цена после согласования':'';
}
function is42StandardLeafCatalogItem(item){
  if(!item)return false;
  const category=String(item.category||''),name=String(item.name||''),combined=category+' '+name;
  if(/комплект|\+\s*короб|откат|двуствор|погонаж|короб/i.test(combined))return false;
  if(!(/Дверь\s*42/i.test(category)||/Дверь скрытая 42/i.test(category)||/Полотно скрытое/i.test(name)))return false;
  if(!/2000\s*[xх×*]\s*(600|700|800|900)/i.test(name))return false;
  if(!/Каркас из фанеры/i.test(name)&&!/Полотно скрытое/i.test(name))return false;
  if(!/Грунт(?:\s+под покраску)?/i.test(name))return false;
  if(!/(Серый анод|AL\s*сер|Черный анод|Чёрный анод|AL\s*черн)/i.test(name))return false;
  return true;
}
function price42EdgeKeyFromName(name){
  const s=String(name||'');
  if(/Черный анод|Чёрный анод|AL\s*черн/i.test(s))return 'black';
  if(/Серый анод|AL\s*сер/i.test(s))return 'gray';
  return '';
}
function cart42StandardFallbackUnitPrice(item,priceType=item?.priceType||activeSalesPriceType()){
  if(!is42StandardLeafCatalogItem(item))return null;
  const opt2Book=price42Book('wholesale2');
  if(!opt2Book)return null;
  const opt2Price=opt2Book.base?.plywood?.[price42EdgeKeyFromName(item.name)];
  return Number.isFinite(Number(opt2Price))?price42ApplySalesTier(Number(opt2Price),priceType):null;
}
