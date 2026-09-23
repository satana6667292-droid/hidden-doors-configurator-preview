const SLIDING42_SYSTEMS=[
  'Armadillo HIDDEN/40',
  'Armadillo HIDDEN/80',
  'Morelli INVISIBLE-2 1100',
  'Morelli INVISIBLE-2 1800',
  'Без системы'
];
const SLIDING42_HANDLES=[
  'Без ручки',
  'Ручка для раздвижных дверей ARMADILLO SH.URB153.010 (SH010 URB) BL-26, цвет - черный',
  'Ручка для раздвижных дверей Armadillo sh010 urb sn-3, матовый никель'
];

function sliding42HasGlass(){
  return ['SingleSide1Type','SingleSide2Type'].some(id=>$(id)?.value==='Стекло/зеркало');
}
function sliding42SystemHintText(){
  const system=$('slidingSystem')?.value||'';
  const w=currentWidth();
  if(system==='Armadillo HIDDEN/80') return 'Автоматически выбран HIDDEN/80: хотя бы на одной стороне используется стекло/зеркало.';
  if(system==='Armadillo HIDDEN/40') return 'Автоматически выбран HIDDEN/40: стекло/зеркало на полотне не используется.';
  if(system==='Morelli INVISIBLE-2 1100') return `Morelli INVISIBLE-2 1100: допустимая ширина полотна 800–1100 мм. Сейчас выбрано ${w} мм.`;
  if(system==='Morelli INVISIBLE-2 1800') return `Morelli INVISIBLE-2 1800: допустимая ширина полотна 1100–1800 мм. Сейчас выбрано ${w} мм.`;
  if(system==='Без системы') return 'Система открывания в заказ не добавляется: формируется только подготовленное полотно.';
  return '';
}
function syncSliding42Armadillo(){
  const system=$('slidingSystem'); if(!system)return;
  if(system.value==='Armadillo HIDDEN/40'||system.value==='Armadillo HIDDEN/80'){
    system.value=sliding42HasGlass()?'Armadillo HIDDEN/80':'Armadillo HIDDEN/40';
  }
  const hint=$('slidingSystemHint');
  if(hint)hint.textContent=sliding42SystemHintText();
  if(typeof updateSlidingSystemPriceHint==='function')updateSlidingSystemPriceHint();
}
function sliding42OrderSections(){
  return section('Фурнитура и система открывания',
    fields(
      field('Ручка для откатной двери',selectEl('slidingHandle',SLIDING42_HANDLES,'Без ручки')+'<div id="slidingHandlePriceHint" class="mini hinge-price-hint"></div>','full')+
      field('Система открывания',selectEl('slidingSystem',SLIDING42_SYSTEMS,SLIDING42_SYSTEMS[0])+
        '<div id="slidingSystemHint" class="mini"></div><div id="slidingSystemPriceHint" class="mini hinge-price-hint"></div>','full')
    )+
    `<div class="catalog-note" style="margin-top:10px">
      Для откатной 42 не используются петли, замок, завертка, цилиндр, стопор, автоматический порог и доводчик.
      Система открывания и ручка добавляются в заказ отдельными товарными позициями.
    </div>`+
    doorProcessingSection('sliding')
  );
}

function renderSliding42(){
  $('form').innerHTML =
    section('Полотно 42 под откатную систему',fields(
      field('Тип изделия',inputEl('fixedType','Полотно 42 под откатную систему','text','disabled'))+
      field('Система полотна',inputEl('fixedSystem','42 мм','text','disabled'))+
      field('Конструкция полотна',selectEl('frame',['Каркас из фанеры','Алюминиевый каркас'],'Каркас из фанеры'),'full')
    ))+
    section('Размер полотна',fields(
      field('Высота, мм',`<div class="inline">${selectEl('height',range(1700,2200,50),2000)}${plusButton(`toggleCustom("height")`)}</div><input id="customHeight" class="hidden" type="number" min="1" step="1">`)+
      field('Ширина, мм',`<div class="inline">${selectEl('width',range(450,1000,50),800)}${plusButton(`toggleCustom("width")`)}</div><input id="customWidth" class="hidden" type="number" min="1" step="1">`)+
      field('Направление отката',selectEl('slidingDirection',['Откат влево','Откат вправо'],'Откат влево'),'full')
    ))+
    section('Покрытие полотна',
      `<div class="note">Сторона 1 и сторона 2 задаются отдельно. Ограничения покрытий зависят от конструкции полотна так же, как у обычной двери 42.</div>`+
      `<div style="margin-top:12px">${finishPane('', 'Single', COVER_BASE,'42',false)}</div>`
    )+
    sliding42OrderSections()+
    section('Дополнительные элементы двери',
      fields(
        field('Вентиляционная решётка',simpleSelectWithNone('doorVent','Вентиляционные решетки'))+
        field('Иллюминатор / декоративный элемент',searchableCatalog('doorExtra','Доп.фурнитура','Не требуется — начните вводить'),'full')
      )
    )+
    section('Особенности заказа',
      field('Комментарий / операции, не входящие в SKU',`<textarea id="comment" placeholder="Дополнительные закладные, фрезеровки, особенности монтажа системы и т.п."></textarea>`,'full')
    );
  updateSliding42Frame();
  syncSliding42Armadillo();
  updateSlidingHandlePriceHint();
}

function updateSliding42Frame(){
  const f=$('frame'); if(!f)return;
  const plywood=f.value==='Каркас из фанеры';
  const maxH=plywood?2200:2300;
  if($('height') && $('customHeight')?.classList.contains('hidden')){
    const old=Number($('height').value||2000);
    $('height').innerHTML=options(range(1700,maxH,50),Math.min(old,maxH));
  }
  const covers=(plywood?COVER_BASE:COVER_ALU).filter(x=>x!=='Стекло/зеркало');
  refillFinishType('SingleSide1Type',covers);
  refillFinishType('SingleSide2Type',covers);
}

function renderDouble42(){
  $('form').innerHTML =
    section('Базовая система',fields(
      field('Тип изделия',inputEl('fixedType','Двустворчатая дверь 42 мм','text','disabled'))+
      field('Система',inputEl('fixedSystem','42 мм','text','disabled'))+
      field('Конструкция обоих полотен',selectEl('frame',['Каркас из фанеры','Алюминиевый каркас'],'Каркас из фанеры')+
        '<div class="mini">Тип каркаса единый для обеих створок. Смешанное исполнение фанера + алюминий не допускается.</div>','full')
    ))+
    section('Размеры',fields(
      field('Общая высота, мм',`<div class="inline">${selectEl('height',range(1700,2200,50),2000)}${plusButton(`toggleCustom("height")`)}</div><input id="customHeight" class="hidden" type="number" min="1700" step="5">`)+
      field('Признак цены',inputEl('standardFlag','Стандарт','text','disabled'))+
      field('Ширина левой створки, мм',`<div class="inline">${selectEl('leftWidth',range(400,1000,50),800)}${plusButton(`toggleCustomDoubleWidth("left")`)}</div><input id="customLeftWidth" class="hidden" type="number" min="400" max="1000" step="5">`)+
      field('Ширина правой створки, мм',`<div class="inline">${selectEl('rightWidth',range(400,1000,50),600)}${plusButton(`toggleCustomDoubleWidth("right")`)}</div><input id="customRightWidth" class="hidden" type="number" min="400" max="1000" step="5">`)+
      field('Общая ширина проёма',inputEl('doubleTotalWidth','Рассчитывается из двух створок','text','disabled')+
        '<div class="mini">Отдельного ограничения по общей ширине нет. Контролируются только левая и правая створки по отдельности.</div>','full')+
      field('Открывание левой створки',inputEl('doubleLeftOpening','Левое на себя','text','disabled'))+
      field('Открывание правой створки',inputEl('doubleRightOpening','Правое на себя','text','disabled'))
    ))+
    section('Покрытия створок',
      `<div class="note">Реверса нет. Левая створка всегда открывается «левое на себя», правая — «правое на себя». У двустворчатой двери всегда одна активная и одна пассивная створка; вариант «обе активные» не используется. Активная сторона — параметр конкретного заказа: она не входит в SKU, длинное название и ключ дублей номенклатуры. Покрытия левой и правой створки могут отличаться, но цвет алюминиевого торца выбирается один на весь комплект.</div>
       <div class="row" style="margin:12px 0"><button class="secondary" type="button" onclick="copyLeftToRight()">Скопировать покрытие левой створки → правую</button></div>
       <div class="fields">
         <div>${finishPane('Левая створка','Left',COVER_BASE,'42',false,false)}</div>
         <div>${finishPane('Правая створка','Right',COVER_BASE,'42',false,false)}</div>
       </div>
       <div class="pane" style="margin-top:12px">
         <div class="pane-title">Алюминиевый торец · общий для комплекта</div>
         ${edgeControls('Double',false)}
       </div>`
    )+
    section('Комплектация двери',
      boxOption(true)+boxMiter45Option()+
      `<div id="bundleDouble42Details" style="margin-top:10px">
        <div class="catalog-note"><b>Короб 42 для двухстворчатой двери</b><br>Две вертикальные детали — петлевые стойки по высоте полотна +100 мм. Ответной стойки короба нет. Верхняя перемычка = ширина левой створки + ширина правой створки +10 мм.<br>Цвет короба по умолчанию подставляется по общему цвету алюминиевого торца, но менеджер может вручную выбрать другой цвет короба. Ручной выбор сохраняется, пока снова не изменят цвет торца.</div>
        <div class="fields" style="margin-top:10px">
          ${field('Цвет короба',
            selectEl('bundle42Color',['Серый','Чёрный','Полимерно-порошковая покраска'],'Серый')+
            `<div id="bundle42RalWrap" class="hidden" style="margin-top:8px">
               <label>RAL короба</label>
               ${selectEl('bundle42Ral',getRals(),getRals()[0])}
               <div id="bundle42RalHint" class="mini"></div>
             </div>`
          ,'full')}
          ${field('Левая петлевая стойка',inputEl('bundleDouble42Left','', 'text','disabled'))}
          ${field('Правая петлевая стойка',inputEl('bundleDouble42Right','', 'text','disabled'))}
          ${field('Верхняя перемычка',inputEl('bundleDouble42Top','', 'text','disabled'),'full')}
        </div>
      </div>`
    )+
    doorOrderSections()+

    section('Активная / пассивная створка',
      `<div class="catalog-note">У двустворчатой двери всегда одна активная и одна пассивная створка. Выберите активную; противоположная автоматически считается пассивной. Размер створки на эту роль не влияет: активная может быть уже, шире или равна пассивной. Открывание створок фиксировано конструктивом: левая — левое на себя, правая — правое на себя. Если выбран замок, он ставится только на активную створку, а ответная часть — на пассивную. Режима «обе створки активные» нет.</div>`+
      fields(
        field('Активная створка',selectEl('doubleLockLeaf',['Левая створка','Правая створка'],'Левая створка')+
          '<div id="doubleLockHint" class="mini"></div>','full')+
        field('Ригель / шпингалет пассивной створки',
          '<label class="check"><input id="doubleBolt" type="checkbox" checked> <span>Добавить 1 ригель / шпингалет на пассивную створку</span></label>'+
          '<div id="doubleBoltHint" class="mini"></div>','full')
      )
    )+
    section('Особенности заказа',field('Комментарий / операции, не входящие в SKU',`<textarea id="comment" placeholder="Замок, петли, фрезеровки, ригели и прочие операции заказа"></textarea>`,'full'));
  updateDouble42Frame();
  syncDouble42BundleColorFromDoor();
  syncRecommendedDoorHinge(true,true);
  updateDouble42Hardware();
}

function updateDouble42Frame(){
  const f=$('frame'); if(!f)return;
  const plywood=f.value==='Каркас из фанеры';
  const maxH=plywood?2200:2300;
  if($('height') && $('customHeight')?.classList.contains('hidden')){
    const old=Number($('height').value||2000);
    $('height').innerHTML=options(range(1700,maxH,50),Math.min(old,maxH));
  }
  const covers=(plywood?COVER_BASE:COVER_ALU).filter(x=>x!=='Стекло/зеркало');
  ['LeftSide1Type','LeftSide2Type','RightSide1Type','RightSide2Type'].forEach(id=>refillFinishType(id,covers));
  updateBundleDouble42();
}
function double42BoxTopLength(){return doubleWidth('left')+doubleWidth('right')+10}
function doubleBundleColorFromDoor(){
  const edge=$('DoubleEdgeColor')?.value||'Серый анод';
  if(edge==='Черный анод')return 'Чёрный';
  if(edge==='Полимерно-порошковая покраска')return 'Полимерно-порошковая покраска';
  return 'Серый';
}
function syncDouble42BundleColorFromDoor(){
  if(product()!=='double42')return;
  const color=doubleBundleColorFromDoor();
  if($('bundle42Color'))$('bundle42Color').value=color;
  if(color==='Полимерно-порошковая покраска' && $('bundle42Ral')){
    $('bundle42Ral').value=$('DoubleEdgeRal')?.value||getRals()[0];
  }
  updateBundleDouble42();
}
function updateBundleDouble42(){
  if(product()!=='double42')return;
  updateBoxMiter45State();
  const d=$('bundleDouble42Details'); if(d)d.classList.toggle('hidden',!includeBox());
  const v=boxPartLengthVertical(), t=double42BoxTopLength();
  if($('bundleDouble42Left'))$('bundleDouble42Left').value=v+' мм';
  if($('bundleDouble42Right'))$('bundleDouble42Right').value=v+' мм';
  if($('bundleDouble42Top'))$('bundleDouble42Top').value=t+' мм';
  if($('doubleTotalWidth'))$('doubleTotalWidth').value=(doubleWidth('left')+doubleWidth('right'))+' мм';

  const boxPowder=$('bundle42Color')?.value==='Полимерно-порошковая покраска';
  const edgePowder=$('DoubleEdgeColor')?.value==='Полимерно-порошковая покраска';
  const ral=$('bundle42Ral');
  $('bundle42RalWrap')?.classList.toggle('hidden',!boxPowder);

  if(boxPowder&&edgePowder&&ral){
    ral.value=$('DoubleEdgeRal')?.value||getRals()[0];
    ral.disabled=true;
    if($('bundle42RalHint'))$('bundle42RalHint').textContent='RAL короба совпадает с общим RAL алюминиевого торца.';
  }else{
    if(ral)ral.disabled=false;
    if($('bundle42RalHint'))$('bundle42RalHint').textContent=boxPowder?'RAL короба можно выбрать отдельно, так как торец не окрашен порошково.':'';
  }
}
function updateDouble42Hardware(){
  if(product()!=='double42')return;
  const lock=$('doorLock')?.value?.trim()||'';
  const activeLeaf=$('doubleLockLeaf')?.value||'Левая створка';
  const passiveLeaf=activeLeaf==='Левая створка'?'Правая створка':'Левая створка';
  const hint=$('doubleLockHint');
  if(hint){
    if(!lock) hint.textContent='Активная: '+activeLeaf+'. Пассивная: '+passiveLeaf+'. Замок не выбран.';
    else{
      const skud=typeof isSkudLockForProcessing==='function'&&isSkudLockForProcessing(lock);
      hint.textContent=skud
        ?'Активная: '+activeLeaf+'. Пассивная: '+passiveLeaf+'. 1 СКУД-замок и 1 врезка СКУД — только на активной; на пассивной — ответная часть.'
        :'Активная: '+activeLeaf+'. Пассивная: '+passiveLeaf+'. 1 замок — на активной; ответная часть — на пассивной.';
    }
  }
  const boltHint=$('doubleBoltHint');
  if(boltHint)boltHint.textContent='Один ригель / шпингалет устанавливается на пассивную створку: '+passiveLeaf+'.';
}

function refillFinishType(id,covers){
  const el=$(id); if(!el)return;
  const old=el.value;
  el.innerHTML=options(covers,covers.includes(old)?old:covers[0]);
}
