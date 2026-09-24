function wallPanelFilmValues(){
  const src=$('panelFilmCatalog')?.value||'Каталог плёнок 36';
  return src==='Каталог плёнок 36'?getFilms36():getFilmsGeneral();
}
function updateWallPanelFilmSelect(){
  const el=$('panelFilm'); if(!el)return;
  const vals=wallPanelFilmValues();
  const old=el.value;
  if(!vals.length){
    el.innerHTML='<option value="">— основной каталог пока пуст в этом браузере —</option>';
    el.value='';
    return;
  }
  const selected=vals.includes(old)?old:vals[0];
  el.innerHTML=options(vals,selected);
  el.value=selected;
}
function wallPanelMiterRows(){
  const vals=['Нет','45° внутренний','45° внешний'];
  return `<div class="wall-panel-side-grid">
    <div class="wall-panel-side"><b>Верхняя сторона</b>${selectEl('panelMiterTop',vals,'Нет')}</div>
    <div class="wall-panel-side"><b>Правая сторона</b>${selectEl('panelMiterRight',vals,'Нет')}</div>
    <div class="wall-panel-side"><b>Нижняя сторона</b>${selectEl('panelMiterBottom',vals,'Нет')}</div>
    <div class="wall-panel-side"><b>Левая сторона</b>${selectEl('panelMiterLeft',vals,'Нет')}</div>
  </div>`;
}
function updateWallPanelDynamic(){
  if(product()!=='wallPanel')return;
  const finish=$('panelFinishType')?.value||'Плёнка';
  $('panelFilmWrap')?.classList.toggle('hidden',finish!=='Плёнка');
  $('panelVeneerWrap')?.classList.toggle('hidden',finish!=='Шпон');
  $('panelRalWrap')?.classList.toggle('hidden',finish!=='Эмаль по RAL');
  if(finish==='Плёнка')updateWallPanelFilmSelect();
  const custom=$('panelMillingMode')?.value==='Фрезеровка по эскизу заказчика';
  $('panelMillingCustomWrap')?.classList.toggle('hidden',!custom);
}
function handleWallPanelSketchFile(input){
  const file=input?.files?.[0];
  const name=$('panelSketchFileName');
  const img=$('panelSketchPreviewImg');
  if(!name||!img)return;
  if(!file){name.textContent='Файл не выбран';img.classList.add('hidden');img.removeAttribute('src');return;}
  name.textContent=`${file.name} · ${Math.max(1,Math.round(file.size/1024))} КБ`;
  if(file.type&&file.type.startsWith('image/')){
    const reader=new FileReader();
    reader.onload=()=>{img.src=String(reader.result||'');img.classList.remove('hidden');};
    reader.readAsDataURL(file);
  }else{
    img.classList.add('hidden');img.removeAttribute('src');
  }
}
function wallPanelFinishText(){
  const type=$('panelFinishType')?.value||'';
  if(type==='Плёнка'){
    const cat=$('panelFilmCatalog')?.value||'';
    const film=$('panelFilm')?.value||'';
    return `Плёнка: ${film}${cat?` (${cat})`:''}`;
  }
  if(type==='Шпон')return `Шпон: ${$('panelVeneer')?.value?.trim()||''}`;
  if(type==='Эмаль по RAL')return `Эмаль: ${$('panelRal')?.value||''}`;
  return type;
}
function wallPanelMiterData(){
  return [
    ['Верх',$('panelMiterTop')?.value||'Нет'],
    ['Право',$('panelMiterRight')?.value||'Нет'],
    ['Низ',$('panelMiterBottom')?.value||'Нет'],
    ['Лево',$('panelMiterLeft')?.value||'Нет']
  ];
}
function wallPanelMiterText(){
  const selected=wallPanelMiterData().filter(x=>x[1]!=='Нет');
  return selected.length?selected.map(x=>`${x[0]} — ${x[1]}`).join('; '):'нет';
}
function wallPanelMillingText(){
  const mode=$('panelMillingMode')?.value||'Глухая / без фрезеровки';
  if(mode==='Глухая / без фрезеровки')return 'без фрезеровки';
  const code=$('panelMillingCode')?.value?.trim()||'';
  return `по эскизу заказчика${code?` (${code})`:''}`;
}
function wallPanelLongName(){
  return [
    'Стеновая панель',
    `МДФ ${$('panelThickness')?.value||''} мм`,
    `${$('panelLength')?.value||''}x${$('panelWidth')?.value||''} мм`,
    wallPanelFinishText(),
    `Фрезеровка: ${wallPanelMillingText()}`,
    `Запил 45°: ${wallPanelMiterText()}`
  ].join(' / ');
}
function wallPanelCanonicalParts(){
  const finish=$('panelFinishType')?.value||'';
  let finishKey=[finish];
  if(finish==='Плёнка')finishKey.push($('panelFilmCatalog')?.value||'', $('panelFilm')?.value||'');
  if(finish==='Шпон')finishKey.push($('panelVeneer')?.value?.trim()||'');
  if(finish==='Эмаль по RAL')finishKey.push($('panelRal')?.value||'');
  const milling=$('panelMillingMode')?.value||'';
  const millingKey=milling==='Фрезеровка по эскизу заказчика'?[$('panelMillingCode')?.value?.trim()||'']:[];
  const miter=wallPanelMiterData().flat();
  return [
    'WALLPANEL',
    $('panelThickness')?.value||'',
    $('panelLength')?.value||'',
    $('panelWidth')?.value||'',
    ...finishKey,
    milling,
    ...millingKey,
    ...miter
  ];
}

const WALL_PANEL_PVC_BLANK_RATE_M2=Object.freeze({
  6:5079.2,
  8:5148,
  10:5216,
  16:5580,
  19:6045,
  22:6345
});
const WALL_PANEL_MITER45_RATE_PER_M=90;

function wallPanelMiterMeters(){
  const length=Number($('panelLength')?.value||0);
  const width=Number($('panelWidth')?.value||0);
  if(!Number.isFinite(length)||!Number.isFinite(width)||length<=0||width<=0)return 0;
  const selected=wallPanelMiterData();
  let mm=0;
  for(const [side,value] of selected){
    if(value==='Нет')continue;
    mm+=(side==='Верх'||side==='Низ')?width:length;
  }
  return mm/1000;
}
function wallPanelPriceCalculation(priceType=activeSalesPriceType()){
  const thickness=Number($('panelThickness')?.value||0);
  const length=Number($('panelLength')?.value||0);
  const width=Number($('panelWidth')?.value||0);
  const finish=$('panelFinishType')?.value||'Плёнка';
  const milling=$('panelMillingMode')?.value||'Глухая / без фрезеровки';
  const rate=Number(WALL_PANEL_PVC_BLANK_RATE_M2[thickness]);

  if(finish!=='Плёнка'){
    return {ok:false,reason:'На первом этапе автоматический расчёт стеновых панелей доступен только для ПВХ-плёнки.'};
  }
  if(milling!=='Глухая / без фрезеровки'){
    return {ok:false,reason:'Фрезерованные стеновые панели будут подключены следующим этапом.'};
  }
  if(!Number.isFinite(rate)){
    return {ok:false,reason:'Для МДФ '+thickness+' мм ставка глухой панели в ПВХ пока не утверждена.'};
  }
  if(!Number.isFinite(length)||length<1||length>2780||!Number.isFinite(width)||width<18||width>950){
    return {ok:false,reason:'Проверьте размеры стеновой панели.'};
  }

  const areaM2=(length*width)/1000000;
  const panelPrice=Math.ceil(areaM2*rate);
  const miterMeters=wallPanelMiterMeters();
  const miterPrice=Math.ceil(miterMeters*WALL_PANEL_MITER45_RATE_PER_M);
  return {
    ok:true,
    priceType:normalizeSalesPriceType(priceType),
    thickness,
    length,
    width,
    areaM2,
    ratePerM2:rate,
    panelPrice,
    miterMeters,
    miterRatePerM:WALL_PANEL_MITER45_RATE_PER_M,
    miterPrice,
    total:panelPrice+miterPrice,
    sameForAllPriceTypes:true
  };
}
function configuredWallPanelUnitPrice(priceType=activeSalesPriceType()){
  const calc=wallPanelPriceCalculation(priceType);
  return calc.ok?calc.total:null;
}
function configuredWallPanelPriceNote(priceType=activeSalesPriceType()){
  const calc=wallPanelPriceCalculation(priceType);
  return calc.ok
    ?'Стеновые панели: глухая ПВХ-панель по ставке за м²; запил 45° — 90 ₽/м.п. выбранной стороны. Цена одинакова для Opt 2 / Opt 1 / Розницы.'
    :(calc.reason||'Цена стеновой панели требует уточнения.');
}

function renderWallPanel(){
  const films=getFilms36();
  $('form').innerHTML=
    section('Стеновая панель',fields(
      field('Тип изделия',inputEl('fixedType','Стеновая панель','text','disabled'))+
      field('Толщина МДФ, мм',selectEl('panelThickness',[6,8,10,16,19,22],10))
    ))+
    section('Размер панели',fields(
      field('Длина, мм',inputEl('panelLength','2780','number','min="1" max="2780" step="1"'))+
      field('Ширина, мм',inputEl('panelWidth','950','number','min="18" max="950" step="1"'))
    )+`<div class="mini">Размер задаётся вручную с точностью до 1 мм. Длина — не более 2780 мм. Ширина — от 18 до 950 мм.</div>`)+
    section('Материал / покрытие',
      fields(field('Покрытие',inputEl('panelFinishType','Плёнка','text','disabled'),'full'))+
      `<div id="panelFilmWrap" style="margin-top:10px">${fields(
        field('Каталог плёнки',selectEl('panelFilmCatalog',['Каталог плёнок 36','Основной каталог плёнок'],'Каталог плёнок 36'))+
        field('Плёнка',selectEl('panelFilm',films,films[0]||''))
      )}</div>`+
      `<div id="panelVeneerWrap" class="hidden"></div><div id="panelRalWrap" class="hidden"></div>`
    )+
    section('Фрезеровка',
      fields(field('Исполнение',inputEl('panelMillingMode','Глухая / без фрезеровки','text','disabled'),'full'))+
      `<div class="mini">На первом этапе доступны только глухие панели. Фрезерованные панели подключим отдельным этапом.</div><div id="panelMillingCustomWrap" class="hidden"></div>`
    )+
    section('Запил 45° для стыковки',
      wallPanelMiterRows()+
      `<div class="mini">Каждая сторона задаётся независимо. Стоимость запила — <b>90 ₽ за 1 м.п.</b> выбранной стороны; внутренний и внешний запил имеют одну ставку.</div>`
    )+
    section('Правила',`<div class="note">Стеновая панель — отдельная номенклатура. На первом этапе считаются только глухие панели в ПВХ-плёнке. Цена панели = площадь × ставка за м²; запил 45° добавляется по фактической длине выбранных сторон. Ставка одинакова для Opt 2 / Opt 1 / Розницы.</div>`);
  updateWallPanelDynamic();
}
