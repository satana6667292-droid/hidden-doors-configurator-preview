function renderTrim36(){
  $('form').innerHTML =
    section('Элемент погонажа',fields(
      field('Категория',selectEl('trimType',['Короб телескопический','Наличник телескопический','Добор телескопический','Притворная планка','Соединительная планка для стыковки доборов'],'Добор телескопический'),'full')
    ))+
    section('Размер',`<div id="trimSizeWrap"></div>`)+
    section('Покрытие',fields(
      field('Тип покрытия',selectEl('trimCover',['ПВХ-пленка','Грунт под покраску'],'ПВХ-пленка'))+
      field('ПВХ-плёнка',`<div class="inline">${selectEl('trimFilm',getFilms36(),getFilms36()[0])}${plusButton(`addFilm("36","trimFilm")`)}</div>`)
    ))+
    section('Правила',`<div class="note">Единица измерения — шт. Модель полотна на погонаж не влияет. Вертикальные и горизонтальные детали отдельно не различаются.</div>`);
  renderTrimSize();
}

function renderTrimSize(){
  const wrap=$('trimSizeWrap'); if(!wrap)return;
  const t=$('trimType')?.value||'Добор телескопический';
  let html='';
  if(t==='Короб телескопический') html=field('Размер',inputEl('trimFixedSize','70×32×2070','text','disabled'),'full');
  if(t==='Наличник телескопический') html=field('Размер',inputEl('trimFixedSize','8×70×2150','text','disabled'),'full');
  if(t==='Притворная планка') html=field('Размер',inputEl('trimFixedSize','10×34×2020','text','disabled'),'full');
  if(t==='Соединительная планка для стыковки доборов') html=field('Размер',inputEl('trimFixedSize','4×30×2070','text','disabled'),'full');
  if(t==='Добор телескопический') html=fields(
    field('Толщина × длина',inputEl('trimBase','10 × 2070','text','disabled'))+
    field('Ширина, мм',`<div class="inline">${selectEl('doborWidth',[100,150,200],100)}${plusButton(`toggleCustomDobor()`)}</div><input id="customDoborWidth" class="hidden" type="number" min="50" max="500" step="1">`)+
    field('Признак',inputEl('doborStandard','Стандарт','text','disabled'),'full')
  );
  wrap.innerHTML=html;
  wrap.querySelectorAll('select,input').forEach(el=>{
    el.addEventListener('input',()=>{refreshDynamicDetails();render()});
    el.addEventListener('change',()=>{refreshDynamicDetails();render()});
  });
}


function trim42Item(){return $('trim42Type')?.value||'Профиль дверного короба 42'}
function trim59Item(){return $('trim59Type')?.value||'Профиль дверного короба 59'}

function trim42DoorOrderState(){
  const height=Number($('trim42DoorHeight')?.value||2000);
  const width=Number($('trim42DoorWidth')?.value||700);
  const opening=$('trim42DoorOpening')?.value||'Левое на себя';
  const color=$('trim42Color')?.value||'Серый';
  const mode=$('trim42DoorOrderMode')?.value||'Комплект короба';
  const part=$('trim42DoorPart')?.value||'Петлевая стойка';
  return {
    height,width,opening,color,mode,part,
    verticalLength:height+100,
    topLength:width+100
  };
}
function trim42DoorPartName(kind,state=trim42DoorOrderState()){
  if(kind==='TOP')return `Верхняя перемычка / ${state.topLength} мм / ${state.color}`;
  const label=kind==='HINGE'?'Петлевая стойка':'Ответная стойка';
  return `${label} / ${state.opening} / ${state.verticalLength} мм / ${state.color}`;
}
function trim42DoorSelectedPartName(state=trim42DoorOrderState()){
  if(state.part==='Верхняя перемычка')return trim42DoorPartName('TOP',state);
  if(state.part==='Ответная стойка')return trim42DoorPartName('STRIKE',state);
  return trim42DoorPartName('HINGE',state);
}
function trim42DoorPreviewHtml(){
  const s=trim42DoorOrderState();
  const rows=[
    {kind:'HINGE',label:'Петлевая стойка',length:s.verticalLength,opening:s.opening},
    {kind:'STRIKE',label:'Ответная стойка',length:s.verticalLength,opening:s.opening},
    {kind:'TOP',label:'Верхняя перемычка',length:s.topLength,opening:'Одна для всех вариантов'}
  ];
  const selectedKind=s.part==='Ответная стойка'?'STRIKE':s.part==='Верхняя перемычка'?'TOP':'HINGE';
  const visible=s.mode==='Комплект короба'?rows:rows.filter(x=>x.kind===selectedKind);
  return visible.map(x=>`
    <div class="trim42-box-part-card ${s.mode==='Отдельная деталь'?'selected':''}">
      <div class="trim42-box-part-kicker">${x.kind==='TOP'?'ОБЩАЯ ДЕТАЛЬ':'СВОЯ НОМЕНКЛАТУРА'}</div>
      <div class="trim42-box-part-title">${x.label}</div>
      <div class="trim42-box-part-size">${x.length} мм</div>
      <div class="trim42-box-part-meta">${x.kind==='TOP'?'Ширина полотна + 100 мм':x.opening+' · высота полотна + 100 мм'}</div>
      <div class="trim42-box-part-meta">Цвет: <b>${s.color}</b></div>
      <div class="trim42-box-part-name">${trim42DoorPartName(x.kind,s)}</div>
    </div>`).join('');
}
function updateTrim42DoorOrderUI(){
  const panel=$('trim42DoorOrderPanel');
  if(!panel)return;
  const active=trim42Item()==='Профиль дверного короба 42' && ($('trim42Sale')?.value||'')==='Под конкретную дверь';
  panel.classList.toggle('hidden',!active);
  if(!active)return;
  const s=trim42DoorOrderState();
  $('trim42DoorPartWrap')?.classList.toggle('hidden',s.mode!=='Отдельная деталь');
  const preview=$('trim42DoorPreview');
  if(preview)preview.innerHTML=trim42DoorPreviewHtml();
  const title=$('trim42DoorOrderSummary');
  if(title){
    title.innerHTML='<b>'+escapeHtml(s.mode)+'</b> · полотно '+s.height+'×'+s.width+' · '+escapeHtml(s.opening)+' · '+escapeHtml(s.color)+
      (s.mode==='Отдельная деталь'?' · '+escapeHtml(s.part):'');
  }
}
function renderTrim42(){
  $('form').innerHTML=
    section('Погонаж 42',fields(
      field('Элемент',selectEl('trim42Type',['Профиль дверного короба 42','Торец BC3','Торец C4'],'Профиль дверного короба 42'),'full')
    ))+
    section('Исполнение',`<div id="trim42Dynamic"></div>`)+
    section('Правила',`<div class="note">
      Для профиля дверного короба 42 используем серый или чёрный цвет. Длина хлыста короба — 5100 мм.
      При заказе «Под конкретную дверь» полотно выбирается по характеристикам. Петлевая и ответная стойки = высота полотна + 100 мм; верх = ширина полотна + 100 мм.
      Для «Левое на себя / Правое на себя / Левый реверс / Правый реверс» петлевая и ответная стойки являются разной готовой номенклатурой. Верхняя перемычка одна для всех четырёх вариантов.
      Торцы BC3 и C4 учитываются отдельно, длина хлыста — 6000 мм.
    </div>`);
  renderTrim42Dynamic();
}
function renderTrim42Dynamic(){
  const w=$('trim42Dynamic');if(!w)return;
  const t=trim42Item();
  if(t==='Профиль дверного короба 42'){
    w.innerHTML=
      fields(
        field('Цвет',selectEl('trim42Color',['Серый','Чёрный'],'Серый'))+
        field('Длина целого хлыста',inputEl('trim42Length','5100 мм','text','disabled'))+
        field('Способ заказа',selectEl('trim42Sale',['Метраж','Целый хлыст','Под конкретную дверь'],'Метраж'),'full')
      )+
      `<div id="trim42DoorOrderPanel" class="trim42-door-order-panel hidden">
        <div class="trim42-door-order-head">
          <div>
            <div class="trim42-door-order-eyebrow">ПОДБОР ПО ПОЛОТНУ</div>
            <div class="trim42-door-order-title">Короб 42 под конкретную дверь</div>
            <div class="mini">Выбираем характеристики полотна — приложение подбирает нужную номенклатуру и длины деталей.</div>
          </div>
          <span class="badge">без цены · согласование UX</span>
        </div>
        <div class="fields trim42-door-filter-grid">
          ${field('Что заказать',selectEl('trim42DoorOrderMode',['Комплект короба','Отдельная деталь'],'Комплект короба'))}
          ${field('Открывание полотна',selectEl('trim42DoorOpening',['Левое на себя','Правое на себя','Левый реверс','Правый реверс'],'Левое на себя'))}
          ${field('Высота полотна, мм',selectEl('trim42DoorHeight',range(1700,2300,50),2000))}
          ${field('Ширина полотна, мм',selectEl('trim42DoorWidth',range(450,1000,50),700))}
          <div id="trim42DoorPartWrap" class="hidden">
            ${field('Отдельная деталь',selectEl('trim42DoorPart',['Петлевая стойка','Ответная стойка','Верхняя перемычка'],'Петлевая стойка'),'full')}
          </div>
        </div>
        <div id="trim42DoorOrderSummary" class="catalog-note trim42-door-summary"></div>
        <div id="trim42DoorPreview" class="trim42-box-parts-grid"></div>
      </div>`;
  }else{
    w.innerHTML=fields(
      field('Профиль торца',inputEl('trim42Edge',t,'text','disabled'))+
      field('Длина целого хлыста',inputEl('trim42Length','6000 мм','text','disabled'))+
      field('Способ заказа',selectEl('trim42Sale',['Метраж','Целый хлыст','Под конкретную дверь'],'Метраж'),'full')
    );
  }
  w.querySelectorAll('select,input').forEach(el=>{
    const sync=()=>{updateTrim42DoorOrderUI();render()};
    el.addEventListener('input',sync);
    el.addEventListener('change',sync);
  });
  updateTrim42DoorOrderUI();
}

function renderTrim59(){
  $('form').innerHTML=
    section('Погонаж 59',fields(
      field('Элемент',selectEl('trim59Type',['Профиль дверного короба 59','Торец 59 с четвертью'],'Профиль дверного короба 59'),'full')
    ))+
    section('Исполнение',`<div id="trim59Dynamic"></div>`)+
    section('Правила',`<div class="note">
      Для 59 короб и торец доступны в сером, чёрном и золотом исполнении.
      Длина хлыста короба — 5100 мм; торца — 6000 мм.
      Для 59 используется единый профиль с четвертью.
      «Каркас» как отдельную позицию погонажа 59 не используем.
    </div>`);
  renderTrim59Dynamic();
}
function renderTrim59Dynamic(){
  const w=$('trim59Dynamic');if(!w)return;
  const t=trim59Item();
  const isBox=t==='Профиль дверного короба 59';
  w.innerHTML=fields(
    field('Цвет',selectEl('trim59Color',['Серый','Чёрный','Золотой'],'Серый'))+
    field('Длина целого хлыста',inputEl('trim59Length',isBox?'5100 мм':'6000 мм','text','disabled'))+
    field('Способ заказа',selectEl('trim59Sale',['Метраж','Целый хлыст','Под конкретную дверь'],'Метраж'),'full')
  );
  w.querySelectorAll('select,input').forEach(el=>{el.addEventListener('input',render);el.addEventListener('change',render)});
}
