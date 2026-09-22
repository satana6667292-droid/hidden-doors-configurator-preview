function renderSingle42(){
  $('form').innerHTML =
    section('Базовая система',fields(
      field('Тип изделия',inputEl('fixedType','Дверь 42 мм','text','disabled'))+
      field('Система',inputEl('fixedSystem','42 мм','text','disabled'))+
      field('Конструкция полотна',selectEl('frame',['Каркас из фанеры','Алюминиевый каркас'],'Каркас из фанеры'),'full')
    ))+
    section('Размер полотна',fields(
      field('Высота, мм',`<div class="inline">${selectEl('height',range(1700,2200,50),2000)}${dimensionPlusButton(`toggleCustom("height")`)}</div><input id="customHeight" class="hidden" type="number" min="1" step="5">`)+
      field('Ширина, мм',`<div class="inline">${selectEl('width',range(450,1000,50),800)}${dimensionPlusButton(`toggleCustom("width")`)}</div><input id="customWidth" class="hidden" type="number" min="1" step="5">`)+
      field('Признак цены',inputEl('standardFlag','Стандарт','text','disabled'))+
      field('Открывание',selectEl('opening',['Левое на себя','Правое на себя','Левый реверс','Правый реверс'],'Левое на себя'))
    ))+
    section('Покрытие полотна',
      `<div class="note">Сторона 1 — лицевая сторона скрытой двери, заподлицо со стеной со стороны коридора. Для реверсной двери четверть профиля находится со стороны 1.</div>`+
      `<div style="margin-top:12px">${finishPane('', 'Single', COVER_BASE,'42',false)}</div>`+
      `<div class="catalog-note" style="margin-top:10px"><b>Цена покрытия 42 мм</b><br>ПВХ считается по высоте отдельно для каждой стороны; для ПВХ доступны каталоги Hidden Doors и Общий. Общий каталог даёт одну доплату на дверь. Эмаль считается по площади каждой стороны. Шпон и HPL — цена после согласования.</div>`
    )+
    section('Комплектация двери',
      boxOption(true)+boxMiter45Option()+
      `<div id="bundle42Details" style="margin-top:10px">
        <div class="catalog-note"><b>Короб 42 под конкретную дверь</b><br>Каждая деталь рассчитывается отдельно: +100 мм к соответствующему размеру полотна.</div>
        <div class="fields" style="margin-top:10px">
          ${field('Цвет короба',
            selectEl('bundle42Color',['Серый','Чёрный','Полимерно-порошковая покраска'],'Серый')+
            `<div id="bundle42RalWrap" class="hidden" style="margin-top:8px">
               <label>RAL короба</label>
               ${selectEl('bundle42Ral',getRals(),getRals()[0])}
             </div>`
          ,'full')}
          ${field('Петлевая стойка',inputEl('bundle42Hinge','', 'text','disabled'))}
          ${field('Ответная стойка',inputEl('bundle42Strike','', 'text','disabled'))}
          ${field('Верхняя перемычка',inputEl('bundle42Top','', 'text','disabled'),'full')}
        </div>
      </div>`
    )+
    doorOrderSections()+
    section('Особенности заказа',field('Комментарий / конкретизация, не входящая в SKU',`<textarea id="comment" placeholder="Конкретный HPL, шпон, бамбук, фрезеровка, замок, петли и т.п."></textarea>`,'full'));
  updateSingle42Frame();
  syncBundleColorFromDoor();
  syncRecommendedDoorHinge(true,true);
}

function updateSingle42Frame(){
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

function renderSingle59(){
  $('form').innerHTML =
    section('Базовая система',fields(
      field('Тип изделия',inputEl('fixedType','Дверь 59 мм','text','disabled'))+
      field('Система',inputEl('fixedSystem','59 мм','text','disabled'))+
      field('Каркас',inputEl('frame59','Алюминиевый каркас','text','disabled'),'full')
    ))+
    section('Размер полотна',fields(
      field('Высота, мм',`<div class="inline">${selectEl('height',range(1700,2950,50),2000)}${plusButton(`toggleCustom("height")`)}</div><input id="customHeight" class="hidden" type="number" min="1700" max="2950" step="1">`)+
      field('Ширина, мм',`<div class="inline">${selectEl('width',range(450,1000,50),800)}${plusButton(`toggleCustom("width")`)}</div><input id="customWidth" class="hidden" type="number" min="1" step="1">`)+
      field('Признак цены',inputEl('standardFlag','Стандарт','text','disabled'))+
      field('Открывание',selectEl('opening',['Левое на себя','Правое на себя','Левый реверс','Правый реверс'],'Левое на себя'))
    ))+
    section('Покрытие полотна',
      `<div class="note">Сторона 1 и сторона 2 задаются отдельно. Для 59 доступен полный список покрытий.</div>`+
      `<div style="margin-top:12px">${finishPane('', 'Single', COVER_ALU,'42',true)}</div>`
    )+
    section('Комплектация двери',
      boxOption(true)+boxMiter45Option()+
      `<div id="bundle59Details" style="margin-top:10px">
        <div class="catalog-note"><b>Короб 59 под конкретную дверь</b><br>Каждая деталь рассчитывается отдельно: +100 мм к соответствующему размеру полотна.</div>
        <div class="fields" style="margin-top:10px">
          ${field('Цвет короба',
            selectEl('bundle59Color',['Серый','Чёрный','Золотой','Полимерно-порошковая покраска'],'Серый')+
            `<div id="bundle59RalWrap" class="hidden" style="margin-top:8px">
               <label>RAL короба</label>
               ${selectEl('bundle59Ral',getRals(),getRals()[0])}
             </div>`
          ,'full')}
          ${field('Петлевая стойка',inputEl('bundle59Hinge','', 'text','disabled'))}
          ${field('Ответная стойка',inputEl('bundle59Strike','', 'text','disabled'))}
          ${field('Верхняя перемычка',inputEl('bundle59Top','', 'text','disabled'),'full')}
        </div>
      </div>`
    )+
    doorOrderSections()+
    section('Особенности заказа',field('Комментарий / конкретизация, не входящая в SKU',`<textarea id="comment"></textarea>`,'full'));
  syncBundleColorFromDoor();
  syncRecommendedDoorHinge(true,true);
}






function door36ImageUrl(fileId){return fileId?`https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w1200`:'';}
function door36DriveUrl(fileId){return fileId?`https://drive.google.com/file/d/${encodeURIComponent(fileId)}/view`:'';}



function door36Collections(){
  return [...DOOR36_COLLECTIONS].sort((a,b)=>a.sort-b.sort).map(x=>x.name);
}
function door36CollectionMeta(collection){
  return DOOR36_COLLECTIONS.find(x=>x.name===collection)||null;
}
function door36Groups(collection){
  const c=door36CollectionMeta(collection);
  return c?[...c.groups]:[];
}
function door36GroupMeta(group){
  return DOOR36_CATALOG.find(x=>x.collection===group)||null;
}
function door36Models(group){
  const g=door36GroupMeta(group);
  return g?[...g.models].sort((a,b)=>a.sort-b.sort).map(x=>x.name):[];
}
function door36ModelMeta(model){
  for(const g of DOOR36_CATALOG){
    const m=g.models.find(x=>x.name===model);
    if(m){
      const c=DOOR36_COLLECTIONS.find(x=>x.groups.includes(g.collection));
      const groupSort=c?c.groups.indexOf(g.collection)+1:g.sort;
      return {...m,collection:c?.name||'',collectionSort:c?.sort||'',group:g.collection,groupSort};
    }
  }
  return null;
}
function updateLeaf36CatalogMeta(){
  const collection=$('collection36')?.value||'';
  const group=$('group36')?.value||'';
  const model=$('model36')?.value||'';
  const c=door36CollectionMeta(collection);
  const m=door36ModelMeta(model);
  const driveId=DOOR36_IMAGE_IDS[model]||'';
  if($('collectionSort36'))$('collectionSort36').value=c?.sort||'';
  if($('groupSort36'))$('groupSort36').value=m?.groupSort||'';
  if($('modelSort36'))$('modelSort36').value=m?.sort||'';
  if($('modelSource36'))$('modelSource36').value=m?.source||'';
  if($('modelDriveId36'))$('modelDriveId36').value=driveId;
  if($('modelImage36'))$('modelImage36').value=door36ImageUrl(driveId);
  updateLeaf36Preview();
}
function updateLeaf36Preview(){
  const wrap=$('leaf36Preview');
  if(!wrap)return;
  const model=$('model36')?.value||'';
  const meta=door36ModelMeta(model);
  const driveId=DOOR36_IMAGE_IDS[model]||'';
  if(!model || !meta || !driveId){
    wrap.innerHTML='<div class="door36-preview-empty">Для выбранной модели изображение пока не привязано.</div>';
    return;
  }
  const imageUrl=door36ImageUrl(driveId);
  const driveUrl=door36DriveUrl(driveId);
  wrap.innerHTML=`
    <div class="door36-preview-layout">
      <div class="door36-preview-media">
        <img class="door36-preview-image" src="${imageUrl}" alt="${meta.collection} ${meta.group} ${model}" referrerpolicy="no-referrer">
      </div>
      <div>
        <div class="door36-preview-title">${meta.collection} / ${meta.group} / ${model}</div>
        <div class="door36-preview-meta">
          <div><b>Коллекция:</b> ${meta.collection}</div>
          <div><b>Группа:</b> ${meta.group}</div>
          <div><b>Модель:</b> ${model}</div>
          <div><b>Исходный рендер:</b> ${meta.source||'—'}</div>
          <div><b>Порядок:</b> коллекция ${meta.collectionSort}, группа ${meta.groupSort}, модель ${meta.sort}</div>
        </div>
        <a class="door36-preview-link" href="${driveUrl}" target="_blank" rel="noopener">Открыть исходный рендер на Google Drive ↗</a>
      </div>
    </div>`;
}
function updateLeaf36GroupSelect(){
  const collection=$('collection36');
  const group=$('group36');
  if(!collection||!group)return;
  const vals=door36Groups(collection.value);
  const old=group.value;
  const selected=vals.includes(old)?old:(vals[0]||'');
  group.innerHTML=options(vals,selected);
  group.value=selected;
  updateLeaf36ModelSelect();
}
function updateLeaf36ModelSelect(){
  const group=$('group36');
  const model=$('model36');
  if(!group||!model)return;
  const vals=door36Models(group.value);
  const old=model.value;
  const selected=vals.includes(old)?old:(vals[0]||'');
  model.innerHTML=options(vals,selected);
  model.value=selected;
  updateLeaf36CatalogMeta();
}

function renderLeaf36(){
  const collections=door36Collections();
  const collection=collections[0]||'';
  const groups=door36Groups(collection);
  const group=groups[0]||'';
  const models=door36Models(group);
  $('form').innerHTML =
    section('Дверь 36',
      fields(
        field('Тип изделия',inputEl('fixedType','Дверь 36 мм','text','disabled'))+
        field('Коллекция',selectEl('collection36',collections,collection))+
        field('Группа',selectEl('group36',groups,group))+
        field('Модель',selectEl('model36',models,models[0]||''))
      )+
      `<div class="mini">Структура каталога: сначала коллекция «Классика» или «LINE», затем группа, затем конкретная модель. Рендер привязан к модели.</div>
       <input id="collectionSort36" type="hidden">
       <input id="groupSort36" type="hidden">
       <input id="modelSort36" type="hidden">
       <input id="modelSource36" type="hidden">
       <input id="modelDriveId36" type="hidden">
       <input id="modelImage36" type="hidden">
       <div class="door36-preview-shell"><div id="leaf36Preview"></div></div>
       <div class="render-color-disclaimer">
         <span class="render-color-disclaimer-icon" aria-hidden="true">!</span>
         <span><b>Рендер предназначен только для выбора модели и фрезеровки.</b> Цвет на изображении условный и не является образцом ПВХ-плёнки. Фактический оттенок выбирайте только по физическому каталогу образцов Hidden Doors у партнёра или менеджера.</span>
       </div>`
    )+
    section('Размер',fields(
      field('Высота, мм',selectEl('height36',[1800,1850,1900,2000],2000))+
      field('Ширина, мм',`<div class="inline">${selectEl('width36',[600,650,700,750,800,850,900],800)}${plusButton(`toggleCustom36Width()`)}</div><input id="customWidth36" class="hidden" type="number" min="1" max="900" step="1">`)
    ))+
    section('Покрытие',fields(
      field('Тип покрытия',selectEl('cover36',['ПВХ-пленка','Грунт под покраску'],'ПВХ-пленка'),'full')+
      field('ПВХ-плёнка',`<div class="inline">${selectEl('film36',getFilms36(),getFilms36()[0])}${plusButton(`addFilm("36","film36")`)}</div>`,'full')
    )+
    `<div class="render-color-disclaimer compact">
      <span class="render-color-disclaimer-icon" aria-hidden="true">!</span>
      <span><b>Плёнку не выбирают по рендеру на экране.</b> Сначала выберите фактический цвет по физическому каталогу образцов, затем укажите здесь его название/артикул для оформления заказа.</span>
    </div>`
    )+
    section('Комплектация двери',
      boxOption(true)+
      `<div id="bundle36Details" style="margin-top:10px">
        <div class="catalog-note"><b>Автокомплект короба 36 по умолчанию</b><br>По умолчанию плёнка короба и наличников совпадает с плёнкой полотна, но её можно изменить отдельно.</div>
        <div class="fields" style="margin-top:10px">
          ${field('Короб телескопический 36 — палок',
            inputEl('bundle36BoxQty','2.5','number','min="0" step="0.5"')+
            `<div id="bundle36BoxFilmWrap" style="margin-top:8px">
               <label>Плёнка короба</label>
               ${selectEl('bundle36BoxFilm',getFilms36(),$('film36')?.value||getFilms36()[0])}
             </div>`
          )}
          ${field('Наличник телескопический 36 — шт.',
            inputEl('bundle36TrimQty','5','number','min="0" step="1"')+
            `<div id="bundle36TrimFilmWrap" style="margin-top:8px">
               <label>Плёнка наличника</label>
               ${selectEl('bundle36TrimFilm',getFilms36(),$('film36')?.value||getFilms36()[0])}
             </div>`
          )}
        </div>
        <div id="bundle36GroundNote" class="mini hidden">Для покрытия «Грунт под покраску» отдельный выбор ПВХ-плёнки не используется.</div>
      </div>`
    )+
    section('Правила',`<div class="note">Нет сторон 1/2, нет открывания, нет остекления. Торец пока не является отдельным свойством SKU. Максимальная ширина — 900 мм; ширину меньше 600 мм можно вводить вручную.</div>`);
  updateLeaf36CatalogMeta();
}

function syncBundle36FilmsFromDoor(){
  if(product()!=='leaf36' || $('cover36')?.value!=='ПВХ-пленка')return;
  const film=$('film36')?.value||getFilms36()[0]||'';
  ['bundle36BoxFilm','bundle36TrimFilm'].forEach(id=>{
    const el=$(id); if(!el)return;
    const vals=getFilms36();
    const old=el.value;
    el.innerHTML=options(vals,film);
    el.value=film;
  });
}
function updateBundle36(){
  const details=$('bundle36Details');
  if(!details)return;
  details.classList.toggle('hidden',!includeBox());
  const isPvc=$('cover36')?.value==='ПВХ-пленка';
  $('bundle36BoxFilmWrap')?.classList.toggle('hidden',!isPvc);
  $('bundle36TrimFilmWrap')?.classList.toggle('hidden',!isPvc);
  $('bundle36GroundNote')?.classList.toggle('hidden',isPvc);
}
function bundle36Finish(kind){
  if($('cover36')?.value!=='ПВХ-пленка')return 'Грунт под покраску';
  const id=kind==='box'?'bundle36BoxFilm':'bundle36TrimFilm';
  const film=$(id)?.value||$('film36')?.value||getFilms36()[0]||'';
  return 'ПВХ-пленка: '+film;
}


function bundleColorFromDoor(){
  const edge=$('SingleEdgeColor')?.value||'Серый анод';
  if(edge==='Черный анод')return 'Чёрный';
  if(edge==='Серый анод')return 'Серый';
  if(edge==='Золотой анод')return 'Золотой';
  if(edge==='Полимерно-порошковая покраска')return 'Полимерно-порошковая покраска';
  return 'Серый';
}
function syncBundleColorFromDoor(){
  if(product()==='single42'){
    const color=bundleColorFromDoor();
    if($('bundle42Color'))$('bundle42Color').value=color;
    if(color==='Полимерно-порошковая покраска' && $('bundle42Ral')){
      $('bundle42Ral').value=$('SingleEdgeRal')?.value||getRals()[0];
    }
  }
  if(product()==='single59'){
    const color=bundleColorFromDoor();
    if($('bundle59Color'))$('bundle59Color').value=color;
    if(color==='Полимерно-порошковая покраска' && $('bundle59Ral')){
      $('bundle59Ral').value=$('SingleEdgeRal')?.value||getRals()[0];
    }
  }
  updateBundle42_59();
}
function bundleBoxColorText(system){
  const color=$(system==='42'?'bundle42Color':'bundle59Color')?.value||'Серый';
  if(color!=='Полимерно-порошковая покраска')return color;
  const ral=$(system==='42'?'bundle42Ral':'bundle59Ral')?.value||getRals()[0]||'';
  return `Полимерно-порошковая покраска ${ral}`.trim();
}

function boxPartLengthVertical(){return currentHeight()+100}
function boxPartLengthTop(){return currentWidth()+100}
function updateBundle42_59(){
  updateBoxMiter45State();
  if(product()==='single42'){
    const d=$('bundle42Details'); if(d)d.classList.toggle('hidden',!includeBox());
    const v=boxPartLengthVertical(), t=boxPartLengthTop();
    if($('bundle42Hinge'))$('bundle42Hinge').value=v+' мм';
    if($('bundle42Strike'))$('bundle42Strike').value=v+' мм';
    if($('bundle42Top'))$('bundle42Top').value=t+' мм';
    $('bundle42RalWrap')?.classList.toggle('hidden',$('bundle42Color')?.value!=='Полимерно-порошковая покраска');
  }
  if(product()==='single59'){
    const d=$('bundle59Details'); if(d)d.classList.toggle('hidden',!includeBox());
    const v=boxPartLengthVertical(), t=boxPartLengthTop();
    if($('bundle59Hinge'))$('bundle59Hinge').value=v+' мм';
    if($('bundle59Strike'))$('bundle59Strike').value=v+' мм';
    if($('bundle59Top'))$('bundle59Top').value=t+' мм';
    $('bundle59RalWrap')?.classList.toggle('hidden',$('bundle59Color')?.value!=='Полимерно-порошковая покраска');
  }
}

function appendSelectedDoorProcessingItems(items){
  const add=(id,key,name,price,note='')=>{
    if(!$(id)?.checked)return;
    items.push({
      key,
      baseKey:key,
      type:'Услуги / Дополнительная обработка',
      qty:1,
      unit:'шт.',
      step:1,
      kind:'service',
      fixedUnitPrice:price,
      priceNote:note||'Фиксированная стоимость работы для Опт 2 / Опт 1 / Розницы.',
      name
    });
  };
  add('procStopperMilling','PROCESS-STOPPER-MILLING','Фрезеровка под скрытый стопор',575);
  add('procThresholdMilling','PROCESS-THRESHOLD-MILLING','Фрезеровка под автопорог',1840);
  add('procPortholeCut','PROCESS-PORTHOLE-CUT','Врезка иллюминатора',1955);
  add('procPetDoorCut','PROCESS-PET-DOOR-CUT','Врезка дверцы для животного',2875);
  add('procSkudLockCut','PROCESS-SKUD-LOCK-CUT','Врезка замка СКУД-системы',4025,'Партнёрский прайс: от 4 025 ₽; без наценки по типу цены.');
  add('procSlidingMilling','PROCESS-SLIDING-MILLING','Фрезеровка под откатную систему',2875);
  return items;
}

function companionItems(){
  if(['single42','single59'].includes(product())){
    const items=[];
    const hinge=$('doorHinges')?.value?.trim()||'';
    const hingeQty=Number($('doorHingeQty')?.value||0);
    if(hinge && hingeQty>0){
      items.push({key:'DOOR-HINGE',type:'Фурнитура / Петли',priceCategory:'Петли',qty:hingeQty,unit:'шт.',step:1,name:hinge});
    }
    const lock=$('doorLock')?.value?.trim()||'';
    if(lock){
      items.push({key:'DOOR-LOCK',type:'Фурнитура / Замки',priceCategory:'Замки',qty:1,unit:'шт.',step:1,name:lock});
    }
    const handle=$('doorHandle')?.value?.trim()||'';
    if(handle){
      items.push({key:'DOOR-HANDLE',type:'Фурнитура / Ручки',priceCategory:'Ручки',qty:1,unit:'шт.',step:1,name:handle});
    }
    const turn=$('doorTurn')?.value?.trim()||'';
    if(turn){
      items.push({key:'DOOR-TURN',type:'Фурнитура / Завертки',priceCategory:'Завертки',qty:1,unit:'шт.',step:1,name:turn});
    }
    const cylinder=$('doorCylinder')?.value?.trim()||'';
    if(cylinder){
      items.push({key:'DOOR-CYLINDER',type:'Фурнитура / Цилиндры',priceCategory:'Цилиндровые механизмы',qty:1,unit:'шт.',step:1,name:cylinder});
    }
    const stopper=$('doorStopper')?.value?.trim()||'';
    if(stopper){
      items.push({key:'DOOR-STOPPER',type:'Фурнитура / Стопоры',priceCategory:'Стопоры',qty:1,unit:'шт.',step:1,name:stopper});
    }
    const threshold=$('doorThreshold')?.value?.trim()||'';
    if(threshold){
      items.push({key:'DOOR-THRESHOLD',type:'Фурнитура / Скрытые пороги',priceCategory:'Скрытый порог',qty:1,unit:'шт.',step:1,name:threshold});
    }
    const closer=$('doorCloser')?.value?.trim()||'';
    if(closer){
      items.push({key:'DOOR-CLOSER',type:'Фурнитура / Доводчики',priceCategory:'Доводчики',qty:1,unit:'шт.',step:1,name:closer});
    }
    appendSelectedDoorProcessingItems(items);
    const system=product()==='single42'?'42':'59';
    if(system==='42'&&typeof price42CurrentPowderCoatItem==='function'){
      const powderItem=price42CurrentPowderCoatItem();
      if(powderItem)items.push(powderItem);
    }
    if(system==='59'&&typeof price59CurrentPowderCoatItem==='function'){
      const powderItem=price59CurrentPowderCoatItem();
      if(powderItem)items.push(powderItem);
    }
    if(!includeBox())return items;
    const color=bundleBoxColorText(system);
    const v=boxPartLengthVertical(),t=boxPartLengthTop();
    const miter=boxMiter45Selected(),miterKey=boxMiter45Suffix(),miterName=boxMiter45NameSuffix();
    if(system==='42'){
      items.push({
        key:'BUNDLE-P42-BOX'+(miterKey?'-'+miterKey:''),
        baseKey:'BUNDLE-P42-BOX',
        type:'Погонаж 42',
        qty:1,
        unit:'комплект',
        step:1,
        kind:'box-kit',
        boxMiter45:miter,
        boxHeight:currentHeight(),
        boxWidth:currentWidth(),
        boxColor:color,
        boxColorKey:price42BoxColorKey(color),
        boxParts:{hinge:v,strike:v,top:t},
        name:`Комплект дверного короба 42 / под полотно ${currentHeight()}×${currentWidth()} / петлевая ${v} мм / ответная ${v} мм / верх ${t} мм / ${color}${miterName}`
      });
    }else{
      items.push({
        key:'BUNDLE-P59-BOX'+(miterKey?'-'+miterKey:''),
        baseKey:'BUNDLE-P59-BOX',
        type:'Погонаж 59',
        qty:1,
        unit:'комплект',
        step:1,
        kind:'box-kit',
        boxMiter45:miter,
        boxHeight:currentHeight(),
        boxWidth:currentWidth(),
        boxColor:color,
        boxParts:{hinge:v,strike:v,top:t},
        name:`Комплект дверного короба 59 / под полотно ${currentHeight()}×${currentWidth()} / петлевая ${v} мм / ответная ${v} мм / верх ${t} мм / ${color}${miterName}`
      });
    }
    if(boxMiter45Selected()){
      items.push({
        key:'BOX-MITER45-'+system,
        type:'Услуги / Обработка короба',
        qty:1,
        unit:'комплект',
        step:1,
        kind:'service',
        fixedUnitPrice:PRICE42_BOX_MITER45_FIXED_PRICE,
        priceNote:'Фиксированная стоимость услуги 1 100 ₽ для Опт 2 / Опт 1 / Розницы.',
        name:`Запил комплекта дверного короба ${system} мм под 45°`
      });
    }
    return items;
  }
  if(product()==='sliding42'){
    const items=[];
    const powderItem=typeof price42CurrentPowderCoatItem==='function'?price42CurrentPowderCoatItem():null;
    if(powderItem)items.push(powderItem);
    const handle=$('slidingHandle')?.value||'Без ручки';
    const system=$('slidingSystem')?.value||'';
    if(handle!=='Без ручки')items.push({key:'SLIDE42-HANDLE',type:'Фурнитура / Ручки',priceCategory:'Ручки',qty:1,unit:'шт.',step:1,name:handle});
    if(system && system!=='Без системы')items.push({key:'SLIDE42-SYSTEM',type:'Системы открывания',priceCategory:'Системы открывания',qty:1,unit:'шт.',step:1,name:system});
    appendSelectedDoorProcessingItems(items);
    return items;
  }
  if(product()==='double42'){
    const items=[];
    const hinge=$('doorHinges')?.value?.trim()||'';
    if(hinge)items.push({key:'DOOR-HINGE',type:'Фурнитура / Петли',priceCategory:'Петли',qty:4,unit:'шт.',step:1,name:hinge});
    const lock=$('doorLock')?.value?.trim()||'';
    if(lock)items.push({key:'DOOR-LOCK',type:'Фурнитура / Замки',priceCategory:'Замки',qty:1,unit:'шт.',step:1,name:lock});
    const handle=$('doorHandle')?.value?.trim()||'';
    if(handle)items.push({key:'DOOR-HANDLE',type:'Фурнитура / Ручки',priceCategory:'Ручки',qty:1,unit:'шт.',step:1,name:handle});
    const turn=$('doorTurn')?.value?.trim()||'';
    if(turn)items.push({key:'DOOR-TURN',type:'Фурнитура / Завертки',priceCategory:'Завертки',qty:1,unit:'шт.',step:1,name:turn});
    const stopper=$('doorStopper')?.value?.trim()||'';
    if(stopper)items.push({key:'DOOR-STOPPER',type:'Фурнитура / Стопоры',priceCategory:'Стопоры',qty:1,unit:'шт.',step:1,name:stopper});
    const threshold=$('doorThreshold')?.value?.trim()||'';
    if(threshold)items.push({key:'DOOR-THRESHOLD',type:'Фурнитура / Скрытые пороги',priceCategory:'Скрытый порог',qty:1,unit:'шт.',step:1,name:threshold});
    const closer=$('doorCloser')?.value?.trim()||'';
    if(closer)items.push({key:'DOOR-CLOSER',type:'Фурнитура / Доводчики',priceCategory:'Доводчики',qty:1,unit:'шт.',step:1,name:closer});
    if($('doubleBoltLeft')?.value==='Ригель для двери')items.push({key:'DOUBLE42-BOLT-LEFT',type:'Доп.фурнитура',qty:1,unit:'шт.',step:1,name:'Ригель для двери'});
    if($('doubleBoltRight')?.value==='Ригель для двери')items.push({key:'DOUBLE42-BOLT-RIGHT',type:'Доп.фурнитура',qty:1,unit:'шт.',step:1,name:'Ригель для двери'});
    appendSelectedDoorProcessingItems(items);
    if(!includeBox())return items;
    const color=bundleBoxColorText('42'),v=boxPartLengthVertical(),t=double42BoxTopLength();
    const boxMeta={
      kind:'box-part',
      boxHeight:currentHeight(),
      leftWidth:doubleWidth('left'),
      rightWidth:doubleWidth('right'),
      boxColor:color,
      boxColorKey:price42BoxColorKey(color)
    };
    items.push(
      {key:'BUNDLE-P42-DOUBLE-LEFT',baseKey:'BUNDLE-P42-DOUBLE-LEFT',type:'Погонаж 42',qty:1,unit:'шт.',step:1,boxPart:'left',...boxMeta,name:`Профиль дверного короба 42 / Левая петлевая стойка / ${v} мм / ${color}`},
      {key:'BUNDLE-P42-DOUBLE-RIGHT',baseKey:'BUNDLE-P42-DOUBLE-RIGHT',type:'Погонаж 42',qty:1,unit:'шт.',step:1,boxPart:'right',...boxMeta,name:`Профиль дверного короба 42 / Правая петлевая стойка / ${v} мм / ${color}`},
      {key:'BUNDLE-P42-DOUBLE-TOP',baseKey:'BUNDLE-P42-DOUBLE-TOP',type:'Погонаж 42',qty:1,unit:'шт.',step:1,boxPart:'top',boxLength:t,...boxMeta,name:`Профиль дверного короба 42 / Верхняя перемычка / ${t} мм / ${color}`}
    );
    return items;
  }
  if(!includeBox())return [];
  if(product()==='leaf36'){
    const boxQty=Number($('bundle36BoxQty')?.value||2.5);
    const trimQty=Number($('bundle36TrimQty')?.value||5);
    return [
      {key:'BUNDLE-P36-BOX',type:'Погонаж 36',qty:boxQty,unit:'палки',step:0.5,name:'Короб телескопический 36 / 70×32×2070 / '+bundle36Finish('box')},
      {key:'BUNDLE-P36-TRIM',type:'Погонаж 36',qty:trimQty,unit:'шт.',step:1,name:'Наличник телескопический 36 / 8×70×2150 / '+bundle36Finish('trim')}
    ];
  }

  return [];
}
