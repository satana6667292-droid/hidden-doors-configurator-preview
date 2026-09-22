// v93: approved packaging cost logic shared by 36/42/59 cost models.
// Sources confirmed from Hidden Doors email invoices:
// cardboard 1050x2000 T-23 = 94 RUB/sheet; 12 strips 160x1000 from one sheet.
// transparent tape 48x150 m = 100 RUB/roll.
// stretch 500 mm x 23 mkm, 2 kg = 550 RUB/roll; invoice does not state metres,
// so 190 m remains an explicit working conversion until supplier metres are confirmed.
// blue masking tape 50x25 m = 195 RUB/roll.
// PE sleeve (1500x2)x0.08, 100 running m = 4173.75 RUB/roll.

const HD93_PACKAGING=Object.freeze({
  cardboard:Object.freeze({
    sheetPrice:94,
    stripsPerSheet:12,
    stripWidthMm:160,
    stripLengthMm:1000,
    thicknessMm:3,
    leafStrips:6,
    boxStrips:2
  }),
  tape:Object.freeze({
    rollPrice:100,
    rollMeters:150,
    leafWraps:5,
    boxMeters:6
  }),
  stretch:Object.freeze({
    rollPrice:550,
    rollMeters:190,
    boxMeters:5,
    invoiceSpec:'500 мм × 23 мкм · 2 кг',
    conversionStatus:'working'
  }),
  sleeve:Object.freeze({
    rollPrice:4173.75,
    rollMeters:100,
    allowanceMm:300,
    widthSpec:'1500×2 мм',
    thicknessMm:0.08
  }),
  blueTape:Object.freeze({
    rollPrice:195,
    rollMeters:25,
    lockCutMm:196,
    allowanceMm:20
  })
});

const HD93_HINGE_CUT_MM=Object.freeze({
  K8060:110,
  'K6360/38':125,
  K2760:135,
  K1019:105,
  'AGB ECLIPSE 2.0':115,
  'AGB ECLIPSE 3.0':115,
  'ARMADILLO U3D3000':115,
  'MORELLI CH-01':135
});

function hd93num(v,d=0){
  if(v===null||v===undefined||String(v).trim()==='')return d;
  const n=Number(String(v).replace(',','.'));
  return Number.isFinite(n)?n:d;
}
function hd93unit(price,qty){return hd93num(price)/Math.max(.000001,hd93num(qty,1))}
function hd93hingeKey(name=''){
  const s=String(name).toUpperCase();
  if(s.includes('K8060')||s.includes('К8060'))return 'K8060';
  if(s.includes('K6360/38')||s.includes('К6360/38'))return 'K6360/38';
  if(s.includes('K2760')||s.includes('К2760'))return 'K2760';
  if(s.includes('K1019')||s.includes('К1019'))return 'K1019';
  if(s.includes('ECLIPSE 2.0'))return 'AGB ECLIPSE 2.0';
  if(s.includes('ECLIPSE 3.0'))return 'AGB ECLIPSE 3.0';
  if(s.includes('U3D3000'))return 'ARMADILLO U3D3000';
  if(s.includes('MORELLI CH-01'))return 'MORELLI CH-01';
  return '';
}
function hd93hingeCutMm(name){
  const key=hd93hingeKey(name);
  return key?HD93_HINGE_CUT_MM[key]??null:null;
}
function hd93defaultHinge(system,height,glassSides=0){
  const h=hd93num(height,2000);
  if(system==='42'){
    return {name:'K8060',qty:2};
  }
  if(system==='59'){
    if(glassSides>0){
      return {name:'K2760',qty:glassSides===1?(h<=2200?2:3):(h<=2300?3:4)};
    }
    return {name:'K6360/38',qty:h<=2400?2:3};
  }
  return {name:'',qty:0};
}
function hd93packagingCalc(opts={}){
  const system=String(opts.system||'42');
  const h=hd93num(opts.height,2000);
  const w=hd93num(opts.width,800);
  const thickness=hd93num(opts.thickness,system==='59'?59:system==='36'?36:42);
  const aluminumFrame=!!opts.aluminumFrame;
  const hasLock=opts.hasLock!==false;
  const cardboardThickness=hd93num(opts.cardboardThicknessMm,HD93_PACKAGING.cardboard.thicknessMm);
  const wraps=hd93num(opts.leafTapeWraps,HD93_PACKAGING.tape.leafWraps);
  const prices=opts.prices||{};

  const cardboardSheet=hd93num(prices.cardboardSheet,HD93_PACKAGING.cardboard.sheetPrice);
  const tapeRoll=hd93num(prices.tapeRoll,HD93_PACKAGING.tape.rollPrice);
  const tapeMeters=hd93num(prices.tapeMeters,HD93_PACKAGING.tape.rollMeters);
  const stretchRoll=hd93num(prices.stretchRoll,HD93_PACKAGING.stretch.rollPrice);
  const stretchMeters=hd93num(prices.stretchMeters,HD93_PACKAGING.stretch.rollMeters);
  const sleeveRoll=hd93num(prices.sleeveRoll,HD93_PACKAGING.sleeve.rollPrice);
  const sleeveMeters=hd93num(prices.sleeveMeters,HD93_PACKAGING.sleeve.rollMeters);
  const blueRoll=hd93num(prices.blueRoll,HD93_PACKAGING.blueTape.rollPrice);
  const blueMeters=hd93num(prices.blueMeters,HD93_PACKAGING.blueTape.rollMeters);

  const cardboardUnit=cardboardSheet/HD93_PACKAGING.cardboard.stripsPerSheet;
  const tapeUnit=hd93unit(tapeRoll,tapeMeters);
  const stretchUnit=hd93unit(stretchRoll,stretchMeters);
  const sleeveUnit=hd93unit(sleeveRoll,sleeveMeters);
  const blueUnit=hd93unit(blueRoll,blueMeters);

  const leafCardboardStrips=HD93_PACKAGING.cardboard.leafStrips;
  const boxCardboardStrips=HD93_PACKAGING.cardboard.boxStrips;
  const outerWidth=w+2*cardboardThickness;
  const outerThickness=thickness+2*cardboardThickness;
  const leafTapeM=wraps*2*(outerWidth+outerThickness)/1000;
  const boxTapeM=HD93_PACKAGING.tape.boxMeters;
  const stretchM=HD93_PACKAGING.stretch.boxMeters;
  const sleeveM=(h+HD93_PACKAGING.sleeve.allowanceMm)/1000;

  const def=hd93defaultHinge(system,h,hd93num(opts.glassSides,0));
  const hingeName=String(opts.hingeName||def.name);
  const hingeQty=Math.max(0,hd93num(opts.hingeQty,def.qty));
  const hingeCut=hd93hingeCutMm(hingeName);
  const blueMm=aluminumFrame&&hingeCut!==null
    ?(hasLock?HD93_PACKAGING.blueTape.lockCutMm+HD93_PACKAGING.blueTape.allowanceMm:0)
      +hingeQty*(hingeCut+HD93_PACKAGING.blueTape.allowanceMm)
    :0;
  const blueTapeM=blueMm/1000;

  const rows={
    leafCardboard:{qty:leafCardboardStrips,unit:'полос',cost:leafCardboardStrips*cardboardUnit},
    boxCardboard:{qty:boxCardboardStrips,unit:'полос',cost:boxCardboardStrips*cardboardUnit},
    leafTape:{qty:leafTapeM,unit:'м',cost:leafTapeM*tapeUnit},
    boxTape:{qty:boxTapeM,unit:'м',cost:boxTapeM*tapeUnit},
    stretch:{qty:stretchM,unit:'м',cost:stretchM*stretchUnit},
    sleeve:{qty:sleeveM,unit:'м',cost:sleeveM*sleeveUnit},
    blueTape:{qty:blueTapeM,unit:'м',cost:blueTapeM*blueUnit,hingeName,hingeQty,hingeCutMm:hingeCut}
  };
  const leafCost=rows.leafCardboard.cost+rows.leafTape.cost+rows.sleeve.cost+rows.blueTape.cost;
  const boxCost=rows.boxCardboard.cost+rows.boxTape.cost+rows.stretch.cost;
  return {system,height:h,width:w,thickness,aluminumFrame,hasLock,rows,leafCost,boxCost,total:leafCost+boxCost};
}
