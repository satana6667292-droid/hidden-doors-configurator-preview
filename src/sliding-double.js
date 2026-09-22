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
      field('Конструкция обоих полотен',selectEl('frame',['Каркас из фанеры','Алюминиевый каркас'],'Каркас из фанеры'),'full')
    ))+
    section('Размеры',fields(
      field('Общая высота, мм',`<div class="inline">${selectEl('height',range(1700,2200,50),2000)}${plusButton(`toggleCustom("height")`)}</div><input id="customHeight" class="hidden" type="number" min="1700" step="1">`)+
      field('Признак цены',inputEl('standardFlag','Стандарт','text','disabled'))+
      field('Ширина левой створки, мм',`<div class="inline">${selectEl('leftWidth',range(400,1000,50),800)}${plusButton(`toggleCustomDoubleWidth("left")`)}</div><input id="customLeftWidth" class="hidden" type="number" min="400" max="1000" step="1">`)+
      field('Ширина правой створки, мм',`<div class="inline">${selectEl('rightWidth',range(400,1000,50),600)}${plusButton(`toggleCustomDoubleWidth("right")`)}</div><input id="customRightWidth" class="hidden" type="number" min="400" max="1000" step="1">`)+
      field('Открывание',selectEl('opening',['Левое на себя','Правое на себя'],'Левое на себя'),'full')
    ))+
    section('Покрытия створок',
      `<div class="note">Реверса нет. Активная/пассивная створка пока не участвует в SKU. Левая и правая створки могут иметь разные покрытия.</div>
       <div class="row" style="margin:12px 0"><button class="secondary" type="button" onclick="copyLeftToRight()">Скопировать левую створку → правую</button></div>
       <div class="fields">
         <div>${finishPane('Левая створка','Left',COVER_BASE,'42',false)}</div>
         <div>${finishPane('Правая створка','Right',COVER_BASE,'42',false)}</div>
       </div>`
    )+
    section('Комплектация двери',
      boxOption(true)+
      `<div id="bundleDouble42Details" style="margin-top:10px">
        <div class="catalog-note"><b>Короб 42 для двухстворчатой двери</b><br>Две вертикальные детали — петлевые стойки по высоте полотна +100 мм. Ответной стойки короба нет. Верхняя перемычка = ширина левой створки + ширина правой створки +100 мм.</div>
        <div class="fields" style="margin-top:10px">
          ${field('Цвет короба',
            selectEl('bundle42Color',['Серый','Чёрный','Полимерно-порошковая покраска'],'Серый')+
            `<div id="bundle42RalWrap" class="hidden" style="margin-top:8px">
               <label>RAL короба</label>
               ${selectEl('bundle42Ral',getRals(),getRals()[0])}
             </div>`
          ,'full')}
          ${field('Левая петлевая стойка',inputEl('bundleDouble42Left','', 'text','disabled'))}
          ${field('Правая петлевая стойка',inputEl('bundleDouble42Right','', 'text','disabled'))}
          ${field('Верхняя перемычка',inputEl('bundleDouble42Top','', 'text','disabled'),'full')}
        </div>
      </div>`
    )+
    doorOrderSections()+
    section('Расположение замка и ригелей',
      `<div class="catalog-note">Активную/пассивную створку пока не задаём. Если замок выбран выше, здесь указывается створка с замком; ответная часть подразумевается на противоположной створке. Если замок не выбран, ответная часть не формируется. Ригель выбирается отдельно для каждой створки и не входит в SKU полотен.</div>`+
      fields(
        field('Створка с замком',selectEl('doubleLockLeaf',['Левая створка','Правая створка'],'Левая створка')+
          '<div id="doubleLockHint" class="mini"></div>','full')+
        field('Ригель — левая створка',selectEl('doubleBoltLeft',['Не требуется','Ригель для двери'],'Не требуется'))+
        field('Ригель — правая створка',selectEl('doubleBoltRight',['Не требуется','Ригель для двери'],'Не требуется'))
      )
    )+
    section('Особенности заказа',field('Комментарий / операции, не входящие в SKU',`<textarea id="comment" placeholder="Замок, петли, фрезеровки, ригели и прочие операции заказа"></textarea>`,'full'));
  updateDouble42Frame();
  syncDouble42BundleColorFromDoor();
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
  const edge=$('LeftEdgeColor')?.value||'Серый анод';
  if(edge==='Черный анод')return 'Чёрный';
  if(edge==='Полимерно-порошковая покраска')return 'Полимерно-порошковая покраска';
  return 'Серый';
}
function syncDouble42BundleColorFromDoor(){
  if(product()!=='double42')return;
  const color=doubleBundleColorFromDoor();
  if($('bundle42Color'))$('bundle42Color').value=color;
  if(color==='Полимерно-порошковая покраска' && $('bundle42Ral')){
    $('bundle42Ral').value=$('LeftEdgeRal')?.value||getRals()[0];
  }
  updateBundleDouble42();
}
function updateBundleDouble42(){
  if(product()!=='double42')return;
  const d=$('bundleDouble42Details'); if(d)d.classList.toggle('hidden',!includeBox());
  const v=boxPartLengthVertical(), t=double42BoxTopLength();
  if($('bundleDouble42Left'))$('bundleDouble42Left').value=v+' мм';
  if($('bundleDouble42Right'))$('bundleDouble42Right').value=v+' мм';
  if($('bundleDouble42Top'))$('bundleDouble42Top').value=t+' мм';
  $('bundle42RalWrap')?.classList.toggle('hidden',$('bundle42Color')?.value!=='Полимерно-порошковая покраска');
}
function updateDouble42Hardware(){
  if(product()!=='double42')return;
  const lock=$('doorLock')?.value?.trim()||'';
  const select=$('doubleLockLeaf');
  if(select)select.disabled=!lock;
  const hint=$('doubleLockHint');
  if(hint){
    if(!lock) hint.textContent='Замок не выбран — ответная часть между створками не формируется.';
    else hint.textContent='Замок ставится в выбранную створку; ответная часть — в противоположную.';
  }
}

function refillFinishType(id,covers){
  const el=$(id); if(!el)return;
  const old=el.value;
  el.innerHTML=options(covers,covers.includes(old)?old:covers[0]);
}
