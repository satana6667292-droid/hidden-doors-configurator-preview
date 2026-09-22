// v118: approved 59 mm sales pricing.
// Source: Hidden doors Partner price 2026, sheets "Скрытые двери" / "Нестандарты".
const SALES_PRICE_59=Object.freeze({
  source:'Hidden doors Партнерский Прайс продуктовой линейки',
  sourceFileId:'10fH0RYUWVd5UWXJT6t7U8Iu1gJbI4LPpQWGPeQMF7mc',
  baseHeight:2000,
  minHeight:1700,
  maxHeight:2950,
  baseWidthMax:900,
  leafOpt2:Object.freeze({gray:19863,black:20539}),
  boxOpt2:Object.freeze({gray:7971,black:8776}),
  glassOpt2:Object.freeze({oneSide:14950,twoSides:26450}),
  leafAnchors:Object.freeze({
    gray:Object.freeze({2000:19863,2400:27809,2500:29795,2600:31781,2700:33768,2800:35754,2900:37740}),
    black:Object.freeze({2000:20539,2400:28754,2500:30808,2600:32862,2700:34916,2800:36970,2900:39024})
  }),
  boxAnchors:Object.freeze({
    gray:Object.freeze({2000:7971,2400:11159,2500:11957,2600:12754,2700:13551,2800:14348,2900:15145}),
    black:Object.freeze({2000:8776,2400:12286,2500:13165,2600:14042,2700:14920,2800:15797,2900:16675})
  })
});
const PRICE59_PVC_RATE_PER_HEIGHT_M_PER_SIDE=1725;
const PRICE59_ENAMEL_RATE_PER_SQM_PER_SIDE=4000;
const PRICE59_GENERAL_FILM_SURCHARGE_PER_DOOR=2300;

function price59TypeLabel(priceType){return salesPriceTypeLabel(priceType)}
function price59ApplySalesTier(opt2Value,priceType=activeSalesPriceType()){
  const v=Number(opt2Value);
  if(!Number.isFinite(v))return null;
  const type=normalizeSalesPriceType(priceType);
  if(type==='wholesale1')return Math.ceil(v*1.125);
  if(type==='retail')return Math.ceil(v*1.5);
  return Math.ceil(v);
}
function price59HeightFactor(height){
  const h=Number(height);
  if(!Number.isFinite(h)||h<SALES_PRICE_59.minHeight||h>SALES_PRICE_59.maxHeight)return null;
  if(h<=SALES_PRICE_59.baseHeight)return 1;
  return 1+(h-SALES_PRICE_59.baseHeight)/1000;
}
function price59EdgeKey(value=''){
  const s=String(value||'');
  if(/ч[её]рн/i.test(s))return 'black';
  if(/сер|хром/i.test(s))return 'gray';
  return '';
}
function price59AnchorOrFormula(kind,edgeKey,height){
  const h=Number(height),factor=price59HeightFactor(h);
  if(factor===null||!['gray','black'].includes(edgeKey))return null;
  const anchors=kind==='box'?SALES_PRICE_59.boxAnchors:SALES_PRICE_59.leafAnchors;
  const exact=anchors?.[edgeKey]?.[h];
  if(Number.isFinite(Number(exact)))return Number(exact);
  const base=(kind==='box'?SALES_PRICE_59.boxOpt2:SALES_PRICE_59.leafOpt2)?.[edgeKey];
  return Number.isFinite(Number(base))?Math.ceil(Number(base)*factor):null;
}
function price59LeafBaseCalculation({height,width,edgeColor}={},priceType=activeSalesPriceType()){
  const h=Number(height),w=Number(width),edgeKey=price59EdgeKey(edgeColor);
  if(!Number.isFinite(h)||h<SALES_PRICE_59.minHeight||h>SALES_PRICE_59.maxHeight){
    return {ok:false,reason:'Высота 59 мм должна быть 1700–2950 мм.'};
  }
  if(!Number.isFinite(w)||w<600||w>900){
    return {ok:false,reason:'Автоматическая цена полотна 59 мм сейчас утверждена для ширины 600–900 мм. Ширину вне этого диапазона нужно согласовать отдельно.'};
  }
  if(!edgeKey){
    return {ok:false,reason:'Автоматическая база 59 мм сейчас утверждена для серого и чёрного анода.'};
  }
  const opt2Price=price59AnchorOrFormula('leaf',edgeKey,h);
  if(opt2Price===null)return {ok:false,reason:'Не удалось рассчитать базовую цену полотна 59 мм.'};
  return {
    ok:true,height:h,width:w,edgeKey,
    heightFactor:price59HeightFactor(h),
    opt2Price,
    price:price59ApplySalesTier(opt2Price,priceType),
    priceType:normalizeSalesPriceType(priceType)
  };
}
function price59GlassOpt2(height,sides){
  const count=Number(sides)||0;
  if(count<=0)return 0;
  const base=count>=2?SALES_PRICE_59.glassOpt2.twoSides:SALES_PRICE_59.glassOpt2.oneSide;
  const factor=price59HeightFactor(height);
  return factor===null?null:Math.ceil(base*factor);
}
function price59FinishCalculation(config={},priceType=activeSalesPriceType()){
  const h=Number(config.height),w=Number(config.width);
  if(!Number.isFinite(h)||!Number.isFinite(w)||h<=0||w<=0)return {ok:false,reason:'Некорректный размер покрытия.'};
  const side1Type=String(config.side1Type||'Грунт под покраску');
  const side2Type=String(config.side2Type||'Грунт под покраску');
  const types=[side1Type,side2Type];
  const quoteTypes=[...new Set(types.filter(x=>['Шпон','HPL','Бамбуковая панель'].includes(x)))];
  if(quoteTypes.length)return {ok:true,priceOnRequest:true,quoteTypes,reason:quoteTypes.join(' / ')+' — цена после согласования.'};
  const allowed=new Set(['Грунт под покраску','ПВХ-пленка','Эмаль','Стекло/зеркало']);
  const unsupported=[...new Set(types.filter(x=>!allowed.has(x)))];
  if(unsupported.length)return {ok:false,reason:'Для покрытия '+unsupported.join(' / ')+' нет утверждённой автоматической цены.'};

  const glassSides=types.filter(x=>x==='Стекло/зеркало').length;
  const pvcSides=types.filter(x=>x==='ПВХ-пленка').length;
  const enamelSides=types.filter(x=>x==='Эмаль').length;

  const glassOpt2=price59GlassOpt2(h,glassSides);
  if(glassOpt2===null)return {ok:false,reason:'Не удалось рассчитать стекло/зеркало.'};
  const glassPrice=price59ApplySalesTier(glassOpt2,priceType)||0;

  const pvcOpt2=Math.ceil((h/1000)*PRICE59_PVC_RATE_PER_HEIGHT_M_PER_SIDE*pvcSides);
  const pvcPrice=price59ApplySalesTier(pvcOpt2,priceType)||0;

  const side1Catalog=String(config.side1Catalog||'Hidden Doors');
  const side2Catalog=String(config.side2Catalog||'Hidden Doors');
  const generalCatalogSelected=
    (side1Type==='ПВХ-пленка'&&side1Catalog==='Общий каталог')||
    (side2Type==='ПВХ-пленка'&&side2Catalog==='Общий каталог');
  const generalCatalogOpt2=generalCatalogSelected?PRICE59_GENERAL_FILM_SURCHARGE_PER_DOOR:0;
  const generalCatalogPrice=price59ApplySalesTier(generalCatalogOpt2,priceType)||0;

  const areaPerSide=(h/1000)*(w/1000);
  const enamelPrice=Math.ceil(areaPerSide*PRICE59_ENAMEL_RATE_PER_SQM_PER_SIDE*enamelSides);

  return {
    ok:true,priceOnRequest:false,
    glassSides,glassOpt2,glassPrice,
    pvcSides,pvcOpt2,pvcPrice,
    enamelSides,areaPerSide,enamelPrice,
    generalCatalogSelected,generalCatalogOpt2,generalCatalogPrice,
    opt2Price:glassOpt2+pvcOpt2+generalCatalogOpt2+enamelPrice,
    price:glassPrice+pvcPrice+generalCatalogPrice+enamelPrice,
    priceType:normalizeSalesPriceType(priceType)
  };
}
function price59CurrentFinishConfig(){
  return {
    height:currentHeight(),width:currentWidth(),
    side1Type:$('SingleSide1Type')?.value||'Грунт под покраску',
    side2Type:$('SingleSide2Type')?.value||'Грунт под покраску',
    side1Catalog:$('SingleSide1FilmCatalog')?.value||'Hidden Doors',
    side2Catalog:$('SingleSide2FilmCatalog')?.value||'Hidden Doors'
  };
}
function price59Calculation(priceType=activeSalesPriceType()){
  if(product()!=='single59')return {ok:false,eligible:false,reason:'not59'};
  const base=price59LeafBaseCalculation({
    height:currentHeight(),width:currentWidth(),edgeColor:$('SingleEdgeColor')?.value||''
  },priceType);
  const finish=price59FinishCalculation(price59CurrentFinishConfig(),priceType);
  if(!base.ok)return {...base,eligible:false,finish};
  if(!finish.ok||finish.priceOnRequest)return {
    ...base,eligible:false,priceOnRequest:!!finish.priceOnRequest,finish,
    reason:finish.reason||'Покрытие требует согласования.'
  };
  return {
    ...base,eligible:true,finish,
    leafPrice:base.price,opt2LeafPrice:base.opt2Price,
    finishPrice:finish.price,
    price:Math.ceil(Number(base.price)+Number(finish.price||0)),
    opt2Total:Math.ceil(Number(base.opt2Price)+Number(finish.opt2Price||0))
  };
}
function configured59UnitPrice(priceType=activeSalesPriceType()){
  const calc=price59Calculation(priceType);
  return calc.eligible&&Number.isFinite(Number(calc.price))?Number(calc.price):null;
}
function configured59PriceNote(priceType=activeSalesPriceType()){
  if(product()!=='single59')return '';
  const calc=price59Calculation(priceType);
  if(calc.priceOnRequest)return 'Цена после согласования';
  if(!calc.eligible)return calc.reason||'Цена требует уточнения';
  return '';
}
function price59BoxCalculation({height,width,color}={},priceType=activeSalesPriceType()){
  const h=Number(height),w=Number(width),edgeKey=price59EdgeKey(color);
  if(!Number.isFinite(h)||h<SALES_PRICE_59.minHeight||h>SALES_PRICE_59.maxHeight)return {ok:false,reason:'Высота короба 59 вне утверждённого диапазона.'};
  if(!Number.isFinite(w)||w<600||w>900)return {ok:false,reason:'Автоматическая цена короба 59 сейчас утверждена для ширины 600–900 мм.'};
  if(!edgeKey)return {ok:false,reason:'Автоматическая цена короба 59 сейчас утверждена для серого и чёрного анода.'};
  const opt2Price=price59AnchorOrFormula('box',edgeKey,h);
  if(opt2Price===null)return {ok:false,reason:'Не удалось рассчитать цену короба 59.'};
  return {ok:true,height:h,width:w,edgeKey,heightFactor:price59HeightFactor(h),opt2Price,price:price59ApplySalesTier(opt2Price,priceType),priceType:normalizeSalesPriceType(priceType)};
}
function price59BoxCompanionUnitPrice(item,priceType=activeSalesPriceType()){
  const calc=price59BoxCalculation({
    height:item?.boxHeight??currentHeight(),
    width:item?.boxWidth??currentWidth(),
    color:item?.boxColor||''
  },priceType);
  return calc.ok?calc.price:null;
}
function price59SourceNote(){
  return SALES_PRICE_59.source+' · 59 мм: H≤2000 без уменьшения; выше 2000 рост +10% на каждые 100 мм по утверждённой шкале. Ширина 600–900 мм не меняет базовую цену.';
}
