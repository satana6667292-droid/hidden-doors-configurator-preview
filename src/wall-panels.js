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
function renderWallPanel(){
  const films=getFilms36();
  $('form').innerHTML=
    section('Стеновая панель',fields(
      field('Тип изделия',inputEl('fixedType','Стеновая панель','text','disabled'))+
      field('Толщина МДФ, мм',selectEl('panelThickness',[4,6,8,10,16,19],10))
    ))+
    section('Размер панели',fields(
      field('Длина, мм',inputEl('panelLength','2780','number','min="1" max="2780" step="1"'))+
      field('Ширина, мм',inputEl('panelWidth','950','number','min="18" max="950" step="1"'))
    )+`<div class="mini">Размер задаётся вручную с точностью до 1 мм. Длина — не более 2780 мм. Ширина — от 18 до 950 мм.</div>`)+
    section('Материал / покрытие',
      fields(field('Материал',selectEl('panelFinishType',['Плёнка','Шпон','Эмаль по RAL'],'Плёнка'),'full'))+
      `<div id="panelFilmWrap" style="margin-top:10px">${fields(
        field('Каталог плёнки',selectEl('panelFilmCatalog',['Каталог плёнок 36','Основной каталог плёнок'],'Каталог плёнок 36'))+
        field('Плёнка',selectEl('panelFilm',films,films[0]||''))
      )}</div>`+
      `<div id="panelVeneerWrap" class="hidden" style="margin-top:10px">${field('Шпон / порода / артикул',inputEl('panelVeneer','','text','placeholder="Например: дуб натуральный"'),'full')}</div>`+
      `<div id="panelRalWrap" class="hidden" style="margin-top:10px">${field('RAL',selectEl('panelRal',getRals(),getRals()[0]||''),'full')}</div>`
    )+
    section('Фрезеровка',
      fields(field('Исполнение',selectEl('panelMillingMode',['Глухая / без фрезеровки','Фрезеровка по эскизу заказчика'],'Глухая / без фрезеровки'),'full'))+
      `<div id="panelMillingCustomWrap" class="hidden" style="margin-top:10px">
        ${fields(
          field('Код / название эскиза',inputEl('panelMillingCode','','text','placeholder="Например: Проект Иванов — панель 03"'))+
          field('Комментарий к фрезеровке',`<textarea id="panelMillingNote" placeholder="Глубина, шаг, привязки, пожелания заказчика"></textarea>`)
        )}
        <div class="wall-sketch-box">
          <label for="panelMillingFile">Эскиз заказчика</label>
          <input id="panelMillingFile" type="file" accept="image/png,image/jpeg,image/webp,application/pdf">
          <div class="mini">В прототипе файл показывается только локально в браузере. В рабочей версии его нужно сохранять как вложение к позиции/заказу.</div>
          <div class="wall-sketch-preview"><img id="panelSketchPreviewImg" class="hidden" alt="Эскиз фрезеровки"><div id="panelSketchFileName" class="wall-sketch-file">Файл не выбран</div></div>
        </div>
      </div>`
    )+
    section('Запил 45° для стыковки',
      wallPanelMiterRows()+
      `<div class="mini">Каждая сторона задаётся независимо. Поэтому можно выбрать одну, две, три или все четыре стороны, а также сочетать внутренний и внешний запил на одной панели.</div>`
    )+
    section('Правила',`<div class="note">Стеновая панель — отдельная номенклатура и никак не привязана к двери. Размер, толщина, материал, фрезеровка и запил участвуют в формировании уникальной конфигурации.</div>`);
  updateWallPanelDynamic();
}
