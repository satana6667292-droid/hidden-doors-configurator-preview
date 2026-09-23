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
const PRICE59_POWDER_COAT_RATE_PER_M=460;
const PRICE59_POWDER_COAT_RESERVE_FACTOR=1.10;

const PRICE59_TRIM_BOX_STANDARD_PROFILE_METERS=5.2;
const PRICE59_TRIM_BOX_WHIP_METERS=5.1;
const PRICE59_TRIM_EDGE_WHIP_METERS=6;
const PRICE59_TRIM_EDGE_OPT2_MARKUP=0.60;
const PRICE59_TRIM_EDGE_PURCHASE_WHIP=Object.freeze({
  gray:2052,
  black:2322,
  gold:2322
});
const PRICE59_TRIM_EDGE_SOURCE='АЛКОР · счёт №1186 от 19.08.2026 · профиль торца 58 мм "Вега": серебро 2 052 ₽/6 м, золото 2 322 ₽/6 м; чёрный временно по золотой базе';
const PRICE59_TRIM_BOX_LINEAR_OPT2_RAW=Object.freeze({
  gray:SALES_PRICE_59.boxOpt2.gray/PRICE59_TRIM_BOX_STANDARD_PROFILE_METERS,
  black:SALES_PRICE_59.boxOpt2.black/PRICE59_TRIM_BOX_STANDARD_PROFILE_METERS
});
const PRICE59_TRIM_BOX_LINEAR_OPT2=Object.freeze({
  gray:Math.ceil(PRICE59_TRIM_BOX_LINEAR_OPT2_RAW.gray),
  black:Math.ceil(PRICE59_TRIM_BOX_LINEAR_OPT2_RAW.black)
});

function price59TrimDoorOrderState(){
  const height=Number($('trim59DoorHeight')?.value||2000);
  const width=Number($('trim59DoorWidth')?.value||900);
  return {
    height,width,
    verticalLength:height+100,
    topLength:width+100,
    totalLength:(height+100)*2+(width+100)
  };
}
function price59TrimEdgeDoorOrderState(){
  const height=Number($('trim59EdgeDoorHeight')?.value||2000);
  const width=Number($('trim59EdgeDoorWidth')?.value||800);
  const verticalLength=height+20;
  const horizontalLength=width+20;
  const totalLength=verticalLength*2+horizontalLength*3;
  return {height,width,verticalLength,horizontalLength,totalLength,totalMeters:totalLength/1000};
}
function price59TrimProfileCurrentState(){
  const item=typeof trim59Item==='function'?trim59Item():'';
  const sale=$('trim59Sale')?.value||'Метраж';
  const isEdge=item==='Торец 59 с четвертью';
  const state=isEdge?price59TrimEdgeDoorOrderState():price59TrimDoorOrderState();
  return {
    item,
    color:$('trim59Color')?.value||'Серый',
    sale,
    height:state.height,
    width:state.width,
    verticalLength:state.verticalLength,
    horizontalLength:Number(state.horizontalLength||0),
    topLength:Number(state.topLength||0),
    totalLength:state.totalLength
  };
}
function price59TrimProfileCalculation(config=price59TrimProfileCurrentState(),priceType=activeSalesPriceType()){
  const item=String(config?.item||'');
  const sale=String(config?.sale||'Метраж');
  const type=normalizeSalesPriceType(priceType);

  if(item==='Торец 59 с четвертью'){
    const color=String(config?.color||'Серый');
    const edgeKey=price59EdgeKey(color);
    const purchaseKey=/золот/i.test(color)?'gold':edgeKey;
    const purchaseWhip=Number(PRICE59_TRIM_EDGE_PURCHASE_WHIP[purchaseKey]);
    if(!Number.isFinite(purchaseWhip)){
      return {ok:false,reason:'Для выбранного цвета торца 59 закупочная база не определена.'};
    }
    const rawRatePerMeterOpt2=(purchaseWhip/PRICE59_TRIM_EDGE_WHIP_METERS)*(1+PRICE59_TRIM_EDGE_OPT2_MARKUP);
    const ratePerMeterOpt2=Math.ceil(rawRatePerMeterOpt2);

    let lengthMm=1000;
    let unit='м.п.';
    let label='Торец 59 с четвертью · 1 м.п.';
    if(sale==='Целый хлыст'){
      lengthMm=Math.round(PRICE59_TRIM_EDGE_WHIP_METERS*1000);
      unit='хлыст';
      label='Торец 59 с четвертью · хлыст '+lengthMm+' мм';
    }else if(sale==='Под конкретную дверь'){
      const h=Number(config?.height||0);
      const w=Number(config?.width||0);
      const verticalLength=h+20;
      const horizontalLength=w+20;
      lengthMm=verticalLength*2+horizontalLength*3;
      unit='комплект';
      label='Торец 59 с четвертью · под дверь '+h+'×'+w+' · '+String(lengthMm/1000).replace('.',',')+' м.п.';
    }

    if(!Number.isFinite(lengthMm)||lengthMm<=0)return {ok:false,reason:'Не удалось определить длину торца 59.'};
    const lengthM=lengthMm/1000;
    const opt2Raw=lengthM*rawRatePerMeterOpt2;
    const opt2Price=Math.ceil(opt2Raw);
    return {
      ok:true,item,sale,priceType:type,color,edgeKey,
      height:Number(config?.height||0),width:Number(config?.width||0),
      verticalLength:sale==='Под конкретную дверь'?Number(config?.height||0)+20:null,
      horizontalLength:sale==='Под конкретную дверь'?Number(config?.width||0)+20:null,
      lengthMm,lengthM,unit,label,
      source:PRICE59_TRIM_EDGE_SOURCE,
      purchaseWhipPrice:purchaseWhip,
      purchaseWhipMeters:PRICE59_TRIM_EDGE_WHIP_METERS,
      opt2Markup:PRICE59_TRIM_EDGE_OPT2_MARKUP,
      rawRatePerMeterOpt2,ratePerMeterOpt2,opt2Raw,opt2Price,
      price:price59ApplySalesTier(opt2Price,type),
      formula:'Закуп '+purchaseWhip+' ₽ / '+PRICE59_TRIM_EDGE_WHIP_METERS+' м × 1,60 × '+String(lengthM).replace('.',',')+' м → Opt 2 '+opt2Price+' ₽'
    };
  }

  if(item!=='Профиль дверного короба 59'){
    return {ok:false,reason:'Для выбранного погонажа 59 цена не определена.'};
  }
  const edgeKey=price59EdgeKey(config?.color||'');
  const rawRatePerMeterOpt2=Number(PRICE59_TRIM_BOX_LINEAR_OPT2_RAW[edgeKey]);
  const ratePerMeterOpt2=Number(PRICE59_TRIM_BOX_LINEAR_OPT2[edgeKey]);
  if(!Number.isFinite(rawRatePerMeterOpt2)||!Number.isFinite(ratePerMeterOpt2)){
    return {ok:false,reason:'Для выбранного цвета профиля короба 59 ставка не определена.'};
  }

  let lengthMm=1000;
  let unit='м.п.';
  let label='Профиль дверного короба 59 · 1 м.п.';
  if(sale==='Целый хлыст'){
    lengthMm=Math.round(PRICE59_TRIM_BOX_WHIP_METERS*1000);
    unit='хлыст';
    label='Профиль дверного короба 59 · хлыст '+lengthMm+' мм';
  }else if(sale==='Под конкретную дверь'){
    const vertical=Number(config?.verticalLength||0);
    const top=Number(config?.topLength||0);
    lengthMm=vertical*2+top;
    unit='комплект';
    label='Комплект профиля короба 59 · 2×'+vertical+' + '+top+' мм';
  }

  if(!Number.isFinite(lengthMm)||lengthMm<=0)return {ok:false,reason:'Не удалось определить длину профиля короба 59.'};
  const lengthM=lengthMm/1000;
  const opt2Price=Math.ceil(lengthM*rawRatePerMeterOpt2);
  return {
    ok:true,item,sale,priceType:type,
    color:String(config?.color||''),
    edgeKey,
    height:Number(config?.height||0),
    width:Number(config?.width||0),
    verticalLength:Number(config?.verticalLength||0),
    topLength:Number(config?.topLength||0),
    lengthMm,lengthM,unit,label,
    rawRatePerMeterOpt2,ratePerMeterOpt2,opt2Price,
    price:price59ApplySalesTier(opt2Price,type),
    formula:'Длина '+String(lengthM).replace('.',',')+' м × расчётная ставка '+String(Math.round(rawRatePerMeterOpt2*100)/100).replace('.',',')+' ₽/м по Opt 2'
  };
}
function configuredTrim59UnitPrice(priceType=activeSalesPriceType()){
  if(product()!=='trim59')return null;
  const calc=price59TrimProfileCalculation(price59TrimProfileCurrentState(),priceType);
  return calc.ok?calc.price:null;
}
function configuredTrim59PriceNote(priceType=activeSalesPriceType()){
  if(product()!=='trim59')return '';
  const calc=price59TrimProfileCalculation(price59TrimProfileCurrentState(),priceType);
  return calc.ok?'':(calc.reason||'Цена погонажа 59 требует согласования.');
}

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
  if(/ч[её]рн|золот/i.test(s))return 'black';
  if(/сер|хром|полимер|порош/i.test(s))return 'gray';
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
  if(!Number.isFinite(w)||w<450||w>1000){
    return {ok:false,reason:'Ширина 59 мм должна быть 450–1000 мм.'};
  }
  if(!edgeKey){
    return {ok:false,reason:'Автоматическая база 59 мм сейчас утверждена для серого и чёрного анода.'};
  }
  const heightOpt2Price=price59AnchorOrFormula('leaf',edgeKey,h);
  if(heightOpt2Price===null)return {ok:false,reason:'Не удалось рассчитать базовую цену полотна 59 мм.'};
  const widthFactor=w<=900?1:w/900;
  const opt2Price=Math.ceil(heightOpt2Price*widthFactor);
  return {
    ok:true,height:h,width:w,edgeKey,
    heightFactor:price59HeightFactor(h),
    widthFactor,
    heightOpt2Price,
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
  if(!Number.isFinite(w)||w<450||w>1000)return {ok:false,reason:'Ширина короба 59 должна быть 450–1000 мм.'};
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
  return SALES_PRICE_59.source+' · 59 мм: H≤2000 без уменьшения; выше 2000 рост +10% на каждые 100 мм. Полотно: W≤900 → ×1, W>900 → W/900. Короб: ширина 450–1000 мм без доплаты. Золотой профиль считается по базе чёрного; RAL — по базе серого + отдельная покраска. Стекло/зеркало от ширины не меняется.';
}


function price59IsPowderColor(value=''){
  return /полимер|порош/i.test(String(value||''));
}
function price59RoundLength(value){
  const n=Number(value);
  return Number.isFinite(n)?Math.round(n*10000)/10000:null;
}
function price59PowderCoatCalculation({height,width,edgeColor,boxColor,includeBox:withBox=false}={}){
  const h=Number(height),w=Number(width);
  if(!Number.isFinite(h)||h<=0||!Number.isFinite(w)||w<=0){
    return {active:false,edgeMeters:0,boxMeters:0,rawMeters:0,billableMeters:0,total:0};
  }
  const edgePainted=price59IsPowderColor(edgeColor);
  const boxPainted=!!withBox&&price59IsPowderColor(boxColor);
  // 59 мм: физически 5 деталей кромки — 2 вертикали + 3 горизонтали.
  const edgeMm=edgePainted?(2*(h+20)+3*(w+20)):0;
  const boxMm=boxPainted?(2*(h+100)+(w+100)):0;
  const rawMeters=price59RoundLength((edgeMm+boxMm)/1000)||0;
  const billableMeters=price59RoundLength(rawMeters*PRICE59_POWDER_COAT_RESERVE_FACTOR)||0;
  return {
    active:edgePainted||boxPainted,
    edgePainted,boxPainted,
    edgeMeters:price59RoundLength(edgeMm/1000)||0,
    boxMeters:price59RoundLength(boxMm/1000)||0,
    rawMeters,billableMeters,
    ratePerMeter:PRICE59_POWDER_COAT_RATE_PER_M,
    reservePercent:10,
    total:Math.ceil(billableMeters*PRICE59_POWDER_COAT_RATE_PER_M)
  };
}
function price59CurrentPowderCoatItem(){
  if(product()!=='single59')return null;
  const edgeColor=$('SingleEdgeColor')?.value||'';
  const boxColor=$('bundle59Color')?.value||'';
  const calc=price59PowderCoatCalculation({
    height:currentHeight(),
    width:currentWidth(),
    edgeColor,
    boxColor,
    includeBox:includeBox()
  });
  if(!calc.active||calc.billableMeters<=0)return null;
  const edgeRal=$('SingleEdgeRal')?.value||'';
  const boxRal=$('bundle59Ral')?.value||'';
  const ralParts=[];
  if(calc.edgePainted)ralParts.push('торец '+(edgeRal||'RAL'));
  if(calc.boxPainted)ralParts.push('короб '+(boxRal||edgeRal||'RAL'));
  const noteParts=[];
  if(calc.boxPainted)noteParts.push('короб '+String(calc.boxMeters).replace('.',',')+' м');
  if(calc.edgePainted)noteParts.push('алюминиевая кромка '+String(calc.edgeMeters).replace('.',',')+' м');
  return {
    key:'POWDER-COAT-59',
    baseKey:'POWDER-COAT-59',
    type:'Услуги / Полимерно-порошковая покраска',
    qty:calc.billableMeters,
    unit:'м.п.',
    step:0.0005,
    kind:'service',
    fixedUnitPrice:PRICE59_POWDER_COAT_RATE_PER_M,
    priceNote:noteParts.join(' + ')+' = '+String(calc.rawMeters).replace('.',',')+' м; +10% запас = '+String(calc.billableMeters).replace('.',',')+' м.',
    name:'Полимерно-порошковая покраска профиля 59 / '+ralParts.join(' / ')+' / '+String(calc.billableMeters).replace('.',',')+' м.п. × '+PRICE59_POWDER_COAT_RATE_PER_M+' ₽'
  };
}