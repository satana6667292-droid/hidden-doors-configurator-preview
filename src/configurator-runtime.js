function bindAll(){
  document.querySelectorAll('#form select,#form input,#form textarea').forEach(el=>{
    el.addEventListener('input',handleInput);
    el.addEventListener('change',handleInput);
  });
  updateRoleUI();
  refreshDynamicDetails();
}

function handleInput(e){
  if(product()==='wallPanel'){
    if(e.target.id==='panelFilmCatalog') updateWallPanelFilmSelect();
    if(['panelFinishType','panelMillingMode'].includes(e.target.id)) updateWallPanelDynamic();
    if(e.target.id==='panelMillingFile') handleWallPanelSketchFile(e.target);
  }
  if(product()==='leaf36' && e.target.id==='collection36') updateLeaf36GroupSelect();
  if(product()==='leaf36' && e.target.id==='group36') updateLeaf36ModelSelect();
  if(product()==='leaf36' && e.target.id==='model36') updateLeaf36CatalogMeta();
  if(e.target.id==='frame'){
    if(product()==='single42') updateSingle42Frame();
    if(product()==='sliding42') updateSliding42Frame();
    if(product()==='double42') updateDouble42Frame();
  }
  if(product()==='sliding42' && ['slidingSystem','SingleSide1Type','SingleSide2Type'].includes(e.target.id)) syncSliding42Armadillo();
  if(product()==='double42' && e.target.id==='doorLock') updateDouble42Hardware();
  if(['single42','single59'].includes(product()) && e.target.id==='doorLock') updateDoorCylinderField();
  if(product()==='double42' && ['LeftEdgeColor','LeftEdgeRal'].includes(e.target.id)) syncDouble42BundleColorFromDoor();
  if(e.target.id==='trimType') renderTrimSize();
  if(e.target.id==='trim42Type') renderTrim42Dynamic();
  if(e.target.id==='trim59Type') renderTrim59Dynamic();
  if(e.target.id==='hardwareCategory') updateHardwareDatalist(true,true);
  if(product()==='hardware' && e.target.id==='catalogItem'){
    renderHingeCatalogCards();
    renderHardwareCatalogCards();
    renderHardwareSelectedPrice();
  }
  if(e.target.id==='additionalType') updateAdditionalDatalist();
  if(product()==='leaf36' && e.target.id==='film36') syncBundle36FilmsFromDoor();
  if(product()==='leaf36' && e.target.id==='cover36' && $('cover36')?.value==='ПВХ-пленка') syncBundle36FilmsFromDoor();
  if(['single42','single59'].includes(product()) && ['SingleEdgeColor','SingleEdgeRal'].includes(e.target.id)) syncBundleColorFromDoor();
  if(['single42','single59'].includes(product()) && ['SingleEdgeColor','SingleEdgeRal','SingleSide1Type','SingleSide2Type','height','customHeight','frame'].includes(e.target.id)) syncRecommendedDoorHinge(true,true);
  if(product()==='double42' && ['LeftEdgeColor','LeftEdgeRal','height','customHeight','frame'].includes(e.target.id)) syncRecommendedDoorHinge(true,true);
  refreshDynamicDetails();
  if(product()==='leaf36' && ['includeBox','cover36','film36','bundle36BoxFilm','bundle36TrimFilm','bundle36BoxQty','bundle36TrimQty'].includes(e.target.id)) updateBundle36();
  if(['single42','single59'].includes(product()) && ['includeBox','height','customHeight','width','customWidth','bundle42Color','bundle42Ral','bundle59Color','bundle59Ral'].includes(e.target.id)) updateBundle42_59();
  if(product()==='double42' && ['includeBox','height','customHeight','leftWidth','rightWidth','customLeftWidth','customRightWidth','bundle42Color','bundle42Ral'].includes(e.target.id)) updateBundleDouble42();
  render();
}

function refreshDynamicDetails(){
  document.querySelectorAll('[id$="Side1Type"],[id$="Side2Type"]').forEach(el=>updateFinishDetail(el.id));
  ['SingleEdgeColor','LeftEdgeColor','RightEdgeColor'].forEach(id=>updateEdgeRal(id));
  if($('film36')) $('film36').closest('.full')?.classList.toggle('hidden',$('cover36')?.value!=='ПВХ-пленка');
  if($('trimFilm')) $('trimFilm').closest('div')?.parentElement?.classList.toggle('hidden',$('trimCover')?.value!=='ПВХ-пленка');
  if($('doborStandard')) $('doborStandard').value=[100,150,200].includes(doborWidth())?'Стандарт':'Нестандарт';
  if(product()==='leaf36') updateBundle36();
  if(['single42','single59'].includes(product())){updateBundle42_59();updateDoorCylinderField();updateDoorHingePriceHint();updateDoorLockPriceHint();updateDoorHandlePriceHint();updateDoorTurnPriceHint();updateDoorCylinderPriceHint();updateDoorStopperPriceHint();updateDoorThresholdPriceHint();updateDoorCloserPriceHint();}
  if(product()==='sliding42'){syncSliding42Armadillo();updateSlidingHandlePriceHint();}
  if(product()==='double42'){updateBundleDouble42();updateDouble42Hardware();updateDoorLockPriceHint();updateDoorHandlePriceHint();updateDoorTurnPriceHint();updateDoorStopperPriceHint();updateDoorThresholdPriceHint();updateDoorCloserPriceHint()}
  if(product()==='hardware')renderHardwareSelectedPrice();
  if(typeof syncDoorProcessingOptions==='function')syncDoorProcessingOptions();
}

function updateFinishDetail(typeId){
  const type=$(typeId); if(!type)return;
  const detailId=typeId.replace('Type','Detail');
  const catalogId=typeId.replace('Type','FilmCatalog');
  const wrap=$(detailId+'Wrap'), sel=$(detailId);
  const catalogWrap=$(catalogId+'Wrap'), catalog=$(catalogId);
  const detailLabel=$(detailId+'Label');
  if(!wrap||!sel)return;
  if(type.value==='ПВХ-пленка'){
    catalogWrap?.classList.remove('hidden');
    wrap.classList.remove('hidden');
    if(detailLabel)detailLabel.textContent='ПВХ-плёнка';
    const old=sel.value;
    const vals=catalog
      ?(catalog.value==='Общий каталог'?getFilmsGeneral():getFilms36())
      :getFilms42();
    sel.innerHTML=options(vals,vals.includes(old)?old:vals[0]);
  } else if(type.value==='Эмаль'){
    catalogWrap?.classList.add('hidden');
    wrap.classList.remove('hidden');
    if(detailLabel)detailLabel.textContent='RAL';
    const old=sel.value, vals=getRals();
    sel.innerHTML=options(vals,vals.includes(old)?old:vals[0]);
  } else {
    catalogWrap?.classList.add('hidden');
    wrap.classList.add('hidden');
  }
}


function updateEdgeRal(colorId){
  const color=$(colorId); if(!color)return;
  const prefix=colorId.replace('EdgeColor','');
  $(prefix+'EdgeRalWrap')?.classList.toggle('hidden',color.value!=='Полимерно-порошковая покраска');
}

function toggleCustom(which){
  const sel=$(which), inp=$('custom'+which[0].toUpperCase()+which.slice(1));
  if(!sel||!inp||!dimensionCustomAllowed())return;
  const open=inp.classList.contains('hidden');
  inp.classList.toggle('hidden',!open); sel.classList.toggle('hidden',open);
  if(open){inp.value=sel.value;inp.focus()}
  render();
}
function toggleCustom36Width(){
  if(!elevated())return;
  const s=$('width36'),i=$('customWidth36'),open=i.classList.contains('hidden');
  i.classList.toggle('hidden',!open);s.classList.toggle('hidden',open);
  if(open){i.value=s.value;i.focus()} render();
}
function toggleCustomDobor(){
  if(!elevated())return;
  const s=$('doborWidth'),i=$('customDoborWidth'),open=i.classList.contains('hidden');
  i.classList.toggle('hidden',!open);s.classList.toggle('hidden',open);
  if(open){i.value=s.value;i.focus()} render();
}
function toggleCustomDoubleWidth(side){
  if(!elevated())return;
  const cap=side==='left'?'Left':'Right',s=$(side+'Width'),i=$('custom'+cap+'Width'),open=i.classList.contains('hidden');
  i.classList.toggle('hidden',!open);s.classList.toggle('hidden',open);
  if(open){i.value=s.value;i.focus()} render();
}

function addRal(targetId){
  if(!elevated())return;
  const raw=prompt('Введите RAL, например RAL 1013:'); if(!raw)return;
  const norm=raw.trim().toUpperCase().startsWith('RAL ')?raw.trim().toUpperCase():'RAL '+raw.trim().toUpperCase().replace('RAL','').trim();
  const vals=getRals(); if(!vals.includes(norm)){vals.push(norm);setStore('hd_v4_rals',vals)}
  document.querySelectorAll('[id$="Detail"],[id$="EdgeRal"]').forEach(el=>{
    if(el && (el.id.includes('Detail') || el.id.includes('EdgeRal'))){
      const current=el.value;
      const all=getRals();
      if(el.id.includes('EdgeRal') || ($(el.id.replace('Detail','Type'))?.value==='Эмаль')){
        el.innerHTML=options(all, all.includes(current)?current:all[0]);
      }
    }
  });
  ['bundle42Ral','bundle59Ral'].forEach(id=>{
    const el=$(id); if(el){const current=el.value;el.innerHTML=options(getRals(),getRals().includes(current)?current:getRals()[0])}
  });
  if($(targetId))$(targetId).value=norm;
  render();
}

function addFilm(scope,targetId){
  if(!elevated())return;
  const name=prompt('Название плёнки:'); if(!name)return;
  const article=prompt('Артикул плёнки:'); if(!article)return;
  const item=`${name.trim()} — ${article.trim().toUpperCase()}`;
  const list=scope==='36'?getFilms36():getFilmsGeneral();
  const same=list.find(x=>x.split('—').pop().trim().toUpperCase()===article.trim().toUpperCase());
  if(same){alert('Плёнка с таким артикулом уже существует в выбранном каталоге: '+same);return}
  const key=scope==='36'?'hd_v4_films36':'hd_v4_films_general';
  const vals=getStore(key,[]);vals.push(item);setStore(key,vals);
  if($(targetId))$(targetId).innerHTML=options(scope==='36'?getFilms36():getFilmsGeneral(),item);
  render();
}

function addDictionaryFor(typeId,detailId,mode){
  if(!elevated())return;
  const type=$(typeId)?.value;
  if(type==='Эмаль'){addRal(detailId);return}
  if(type!=='ПВХ-пленка')return;
  const catalog=$(typeId.replace('Type','FilmCatalog'))?.value||'';
  const scope=catalog
    ?(catalog==='Hidden Doors'?'36':'general')
    :(mode==='42'?'general':'36');
  addFilm(scope,detailId);
  updateFinishDetail(typeId);
}


function copyLeftToRight(){
  ['Side1Type','Side2Type','EdgeColor'].forEach(suffix=>{
    const l=$('Left'+suffix),r=$('Right'+suffix);
    if(l&&r){r.value=l.value}
  });
  refreshDynamicDetails();
  ['Side1Detail','Side2Detail','EdgeRal'].forEach(suffix=>{
    const l=$('Left'+suffix),r=$('Right'+suffix);
    if(l&&r)r.value=l.value;
  });
  refreshDynamicDetails();
  render();
}

function currentHeight(){
  return $('customHeight')&&!$('customHeight').classList.contains('hidden')?Number($('customHeight').value):Number($('height')?.value);
}
function currentWidth(){
  return $('customWidth')&&!$('customWidth').classList.contains('hidden')?Number($('customWidth').value):Number($('width')?.value);
}
function width36(){
  return $('customWidth36')&&!$('customWidth36').classList.contains('hidden')?Number($('customWidth36').value):Number($('width36')?.value);
}
function doborWidth(){
  return $('customDoborWidth')&&!$('customDoborWidth').classList.contains('hidden')?Number($('customDoborWidth').value):Number($('doborWidth')?.value);
}
function doubleWidth(side){
  const cap=side==='left'?'Left':'Right';
  const custom=$('custom'+cap+'Width');
  return custom&&!custom.classList.contains('hidden')?Number(custom.value):Number($(side+'Width')?.value);
}

function finishText(prefix,side){
  const type=$(prefix+'Side'+side+'Type')?.value||'';
  const detail=$(prefix+'Side'+side+'Detail')?.value||'';
  if(type==='ПВХ-пленка'){
    const catalog=$(prefix+'Side'+side+'FilmCatalog')?.value||'';
    return catalog?`${type} (${catalog}): ${detail}`:`${type}: ${detail}`;
  }
  if(type==='Эмаль')return `${type}: ${detail}`;
  return type;
}


function edgeText(prefix){
  const c=$(prefix+'EdgeColor')?.value||'';
  return c==='Полимерно-порошковая покраска'?`${c} ${$(prefix+'EdgeRal')?.value||''}`:c;
}
function cover36Text(){
  return $('cover36')?.value==='ПВХ-пленка'?`ПВХ-пленка: ${$('film36').value}`:'Грунт под покраску';
}
function trimCoverText(){
  return $('trimCover')?.value==='ПВХ-пленка'?`ПВХ-пленка: ${$('trimFilm').value}`:'Грунт под покраску';
}

function validate(){
  const errs=[],warns=[];
  if(product()==='wallPanel'){
    const len=Number($('panelLength')?.value);
    const width=Number($('panelWidth')?.value);
    if(!Number.isFinite(len)||len<1||len>2780) errs.push('Длина стеновой панели должна быть от 1 до 2780 мм.');
    if(!Number.isFinite(width)||width<18||width>950) errs.push('Ширина стеновой панели должна быть от 18 до 950 мм.');
    const finish=$('panelFinishType')?.value||'';
    if(finish==='Плёнка'&&!$('panelFilm')?.value) errs.push('Выберите плёнку из выбранного каталога.');
    if(finish==='Шпон'&&!$('panelVeneer')?.value?.trim()) errs.push('Укажите шпон / породу / артикул.');
    if(finish==='Эмаль по RAL'&&!$('panelRal')?.value) errs.push('Выберите RAL.');
    if($('panelMillingMode')?.value==='Фрезеровка по эскизу заказчика'){
      if(!$('panelMillingCode')?.value?.trim()) errs.push('Для фрезеровки по эскизу укажите код или название эскиза.');
      if(!$('panelMillingFile')?.files?.length) warns.push('Эскиз фрезеровки пока не прикреплён.');
    }
    return {errs,warns};
  }
  if(['hardware','openingSystem','additionalElement','installation','plinth'].includes(product())){
    if(!$('catalogItem')?.value.trim()) errs.push('Выберите позицию из каталога.');
    return {errs,warns};
  }
  if(product()==='single42'){
    const h=currentHeight(),w=currentWidth(),ply=$('frame').value==='Каркас из фанеры',maxH=ply?2200:2300;
    if(!Number.isFinite(h)||h<1700||h>maxH)errs.push(`Высота должна быть 1700–${maxH} мм для выбранного каркаса.`);
    if(Number.isFinite(h)&&h%5!==0)errs.push('Высота полотна 42 мм задаётся с шагом 5 мм.');
    if(!Number.isFinite(w)||w<=0)errs.push('Некорректная ширина.');
    if(Number.isFinite(w)&&w%5!==0)errs.push('Ширина полотна 42 мм задаётся с шагом 5 мм.');
    if(w<450||w>1000)warns.push('Ширина вне базовой сетки 450–1000 мм. Жёсткий технический предел для обычной 42 пока не утверждён.');
    checkFinishes(['Single'],errs,ply);
    rejectGlassMirrorFor42(['Single'],errs);
    if(!$('doorHinges')?.value?.trim())errs.push('Выберите петлю.');
    if(!(Number($('doorHingeQty')?.value)>0))errs.push('Укажите количество петель.');
    if(doorLockRequiresCylinder() && !$('doorCylinder')?.value?.trim())errs.push('Для выбранного замка под цилиндр обязательно выберите цилиндр.');
  }
  if(product()==='sliding42'){
    const h=currentHeight(),w=currentWidth(),ply=$('frame').value==='Каркас из фанеры',maxH=ply?2200:2300;
    if(h<1700||h>maxH)errs.push(`Высота должна быть 1700–${maxH} мм для выбранного каркаса.`);
    if(!Number.isFinite(w)||w<=0)errs.push('Некорректная ширина.');
    if(w<450||w>1000)warns.push('Ширина вне базовой сетки 450–1000 мм. Жёсткий технический предел откатной 42 пока не утверждён.');
    checkFinishes(['Single'],errs,ply);
    rejectGlassMirrorFor42(['Single'],errs);
    const slidingSystem=$('slidingSystem')?.value||'';
    if(!SLIDING42_SYSTEMS.includes(slidingSystem))errs.push('Выберите систему открывания для откатной двери.');
    if(slidingSystem==='Armadillo HIDDEN/40' && sliding42HasGlass())errs.push('Armadillo HIDDEN/40 нельзя использовать при стекле/зеркале — выберите HIDDEN/80.');
    if(slidingSystem==='Armadillo HIDDEN/80' && !sliding42HasGlass())warns.push('Для полотна без стекла/зеркала Armadillo автоматически рекомендуется HIDDEN/40.');
    if(slidingSystem==='Morelli INVISIBLE-2 1100' && (w<800||w>1100))errs.push('Morelli INVISIBLE-2 1100: ширина полотна должна быть 800–1100 мм.');
    if(slidingSystem==='Morelli INVISIBLE-2 1800' && (w<1100||w>1800))errs.push('Morelli INVISIBLE-2 1800: ширина полотна должна быть 1100–1800 мм.');
  }
  if(product()==='single59'){
    const h=currentHeight(),w=currentWidth();
    if(h<1700||h>2950)errs.push('Для 59 высота должна быть 1700–2950 мм.');
    if(!Number.isFinite(w)||w<=0)errs.push('Некорректная ширина.');
    if(w<450||w>1000)warns.push('Ширина вне базовой сетки 450–1000 мм. Жёсткий предел ширины пока не утверждён.');
    checkFinishes(['Single'],errs,false);
    if(!$('doorHinges')?.value?.trim())errs.push('Выберите петлю.');
    if(!(Number($('doorHingeQty')?.value)>0))errs.push('Укажите количество петель.');
    if(doorLockRequiresCylinder() && !$('doorCylinder')?.value?.trim())errs.push('Для выбранного замка под цилиндр обязательно выберите цилиндр.');
  }
  if(product()==='leaf36'){
    const w=width36();
    if(!$('collection36')?.value?.trim())errs.push('Выберите коллекцию полотна.');
    if(!$('group36')?.value?.trim())errs.push('Выберите группу полотна.');
    if(!$('model36')?.value?.trim())errs.push('Выберите модель полотна.');
    if(!Number.isFinite(w)||w<=0||w>900)errs.push('Для 36 ширина должна быть больше 0 и не более 900 мм.');
    if(w<600)warns.push('Ширина ниже базового ряда 600–900 мм; это допустимый ручной размер.');
  }
  if(product()==='trim36'){
    if($('trimType').value==='Добор телескопический'){
      const w=doborWidth();
      if(!Number.isFinite(w)||w<50||w>500)errs.push('Ширина добора должна быть 50–500 мм.');
    }
  }
  if(product()==='double42'){
    const h=currentHeight(),ply=$('frame').value==='Каркас из фанеры',maxH=ply?2200:2300;
    const lw=doubleWidth('left'),rw=doubleWidth('right');
    if(h<1700||h>maxH)errs.push(`Общая высота должна быть 1700–${maxH} мм.`);
    if(lw<400||lw>1000)errs.push('Левая створка: ширина 400–1000 мм.');
    if(rw<400||rw>1000)errs.push('Правая створка: ширина 400–1000 мм.');
    checkFinishes(['Left','Right'],errs,ply);
    rejectGlassMirrorFor42(['Left','Right'],errs);
  }
  return{errs,warns};
}

function rejectGlassMirrorFor42(prefixes,errs){
  prefixes.forEach(prefix=>{
    [1,2].forEach(side=>{
      if($(prefix+'Side'+side+'Type')?.value==='Стекло/зеркало'){
        errs.push(`${prefix}: стекло/зеркало недоступно для конструктивов 42 мм.`);
      }
    });
  });
}

function checkFinishes(prefixes,errs,plywood){
  prefixes.forEach(prefix=>{
    [1,2].forEach(side=>{
      const t=$(prefix+'Side'+side+'Type')?.value;
      const d=$(prefix+'Side'+side+'Detail')?.value;
      if(['ПВХ-пленка','Эмаль'].includes(t)&&!d)errs.push(`${prefix}: сторона ${side} — нужна детализация покрытия.`);
      if(plywood&&['Бамбуковая панель','Стекло/зеркало'].includes(t))errs.push(`${prefix}: ${t} недоступно на фанерном каркасе.`);
    });
    if($(prefix+'EdgeColor')?.value==='Полимерно-порошковая покраска'&&!$(prefix+'EdgeRal')?.value)errs.push(`${prefix}: требуется RAL торца.`);
  });
}

function standardFlag(){
  if(product()==='wallPanel') return 'Не применяется';
  if(['hardware','openingSystem','additionalElement','installation','plinth','trim42','trim59'].includes(product())) return 'Каталожная позиция';
  if(product()==='single42') return currentHeight()===2000&&[600,700,800,900].includes(currentWidth())?'Стандарт':'Нестандарт';
  if(product()==='leaf36') return Number($('height36')?.value)>2000?'Нестандарт':'Стандарт';
  if(product()==='trim36'){
    if($('trimType')?.value==='Добор телескопический') return [100,150,200].includes(doborWidth())?'Стандарт':'Нестандарт';
    return 'Стандарт';
  }
  return currentHeight()===2000?'Стандарт':'Нестандарт';
}

function longName(){
  if(product()==='wallPanel') return wallPanelLongName();
  if(product()==='hardware') return ['Фурнитура',$('hardwareCategory')?.value,$('hardwareType')?.value==='Все позиции'?'':$('hardwareType')?.value,$('hardwareBrand')?.value,$('catalogItem')?.value].filter(Boolean).join(' / ');
  if(product()==='openingSystem') return ['Система открывания',$('catalogItem')?.value].filter(Boolean).join(' / ');
  if(product()==='additionalElement') return ['Дополнительный элемент двери',$('additionalType')?.value,$('catalogItem')?.value].filter(Boolean).join(' / ');
  if(product()==='installation') return ['Монтаж и комплектующие',$('catalogItem')?.value].filter(Boolean).join(' / ');
  if(product()==='plinth') return ['Плинтус',$('catalogItem')?.value].filter(Boolean).join(' / ');
  if(product()==='single42'){
    return ['Дверь','42 мм',$('frame').value,`${currentHeight()}x${currentWidth()}`,$('opening').value,
      'Алюминиевый торец',edgeText('Single'),`Сторона 1: ${finishText('Single',1)}`,`Сторона 2: ${finishText('Single',2)}`].join(' / ');
  }
  if(product()==='sliding42'){
    return ['Полотно 42 под откатную систему',$('frame').value,`${currentHeight()}x${currentWidth()}`,$('slidingDirection').value,
      'Алюминиевый торец',edgeText('Single'),`Сторона 1: ${finishText('Single',1)}`,`Сторона 2: ${finishText('Single',2)}`].join(' / ');
  }
  if(product()==='single59'){
    return ['Дверь','59 мм','Алюминиевый каркас',`${currentHeight()}x${currentWidth()}`,$('opening').value,
      'Алюминиевый торец',edgeText('Single'),`Сторона 1: ${finishText('Single',1)}`,`Сторона 2: ${finishText('Single',2)}`].join(' / ');
  }
  if(product()==='leaf36'){
    return ['Дверь','36 мм',`Коллекция: ${$('collection36').value.trim()}`,`Группа: ${$('group36').value.trim()}`,`Модель: ${$('model36').value.trim()}`,`${$('height36').value}x${width36()}`,cover36Text()].join(' / ');
  }
  if(product()==='trim42'){
    const t=trim42Item(), sale=$('trim42Sale')?.value||'Метраж';
    if(t==='Профиль дверного короба 42'&&sale==='Под конкретную дверь'){
      const s=trim42DoorOrderState();
      if(s.mode==='Комплект короба'){
        return ['Комплект дверного короба 42',`Под полотно ${s.height}x${s.width}`,s.opening,s.color,
          `Петлевая ${s.verticalLength} мм`,`Ответная ${s.verticalLength} мм`,`Верх ${s.topLength} мм`].join(' / ');
      }
      return ['Профиль дверного короба 42',trim42DoorSelectedPartName(s),'Под конкретную дверь'].join(' / ');
    }
    if(t==='Профиль дверного короба 42')return [t,$('trim42Color')?.value,'хлыст 5100 мм',sale].join(' / ');
    return [t,'хлыст 6000 мм',sale].join(' / ');
  }
  if(product()==='trim59'){
    const t=trim59Item(),sale=$('trim59Sale')?.value||'Метраж';
    return [t,$('trim59Color')?.value,`хлыст ${t==='Профиль дверного короба 59'?'5100':'6000'} мм`,sale].join(' / ');
  }
  if(product()==='trim36'){
    const t=$('trimType').value,cover=trimCoverText();
    let size='';
    if(t==='Добор телескопический')size=`10×${doborWidth()}×2070`;
    else size=$('trimFixedSize')?.value||'';
    return [`${t} 36`,size,cover].join(' / ');
  }
  if(product()==='double42'){
    return ['Двустворчатая дверь','42 мм',$('frame').value,`H${currentHeight()}`,
      `Левая ${doubleWidth('left')} мм`,`Правая ${doubleWidth('right')} мм`,$('opening').value,
      `Левая створка — Сторона 1: ${finishText('Left',1)}`,`Сторона 2: ${finishText('Left',2)}`,'Алюминиевый торец '+edgeText('Left'),
      `Правая створка — Сторона 1: ${finishText('Right',1)}`,`Сторона 2: ${finishText('Right',2)}`,'Алюминиевый торец '+edgeText('Right')
    ].join(' / ');
  }
  return '';
}

function shortName(){
  if(product()==='wallPanel') return `Стеновая панель | МДФ ${$('panelThickness')?.value||''} | ${$('panelLength')?.value||''}×${$('panelWidth')?.value||''} | ${wallPanelFinishText()}`;
  if(['hardware','openingSystem','additionalElement','installation','plinth'].includes(product())) return longName();
  if(product()==='single42')return `Дверь 42 | ${$('frame').value==='Каркас из фанеры'?'Фанера':'Алюм.'} | ${currentHeight()}×${currentWidth()} | ${$('opening').value}`;
  if(product()==='sliding42')return `Откатная 42 | ${$('frame').value==='Каркас из фанеры'?'Фанера':'Алюм.'} | ${currentHeight()}×${currentWidth()} | ${$('slidingDirection').value}`;
  if(product()==='single59')return `Дверь 59 | ${currentHeight()}×${currentWidth()} | ${$('opening').value}`;
  if(product()==='leaf36')return `Дверь 36 | ${$('collection36').value} | ${$('group36').value} | ${$('model36').value} | ${$('height36').value}×${width36()} | ${$('cover36').value}`;
  if(product()==='trim36')return `Погонаж 36 | ${$('trimType').value}`;
  if(product()==='trim42'){
    const sale=$('trim42Sale')?.value||'Метраж';
    if(trim42Item()==='Профиль дверного короба 42'&&sale==='Под конкретную дверь'){
      const s=trim42DoorOrderState();
      return s.mode==='Комплект короба'
        ?`Короб 42 | комплект | ${s.height}×${s.width} | ${s.opening} | ${s.color}`
        :`Короб 42 | ${s.part} | ${s.opening} | ${s.color}`;
    }
    return `Погонаж 42 | ${trim42Item()}`;
  }
  if(product()==='trim59')return `Погонаж 59 | ${trim59Item()}`;
  if(product()==='double42')return `Двустворчатая 42 | ${$('frame').value==='Каркас из фанеры'?'Фанера':'Алюм.'} | H${currentHeight()} | ${doubleWidth('left')}+${doubleWidth('right')} | ${$('opening').value}`;
  return '';
}

function canonical(){
  if(product()==='wallPanel') return wallPanelCanonicalParts().join('|').toUpperCase().replace(/\s+/g,' ').trim();
  let parts=[product()];
  if(product()==='hardware')parts.push($('hardwareCategory')?.value,$('hardwareType')?.value,$('hardwareBrand')?.value,$('catalogItem')?.value);
  if(product()==='openingSystem')parts.push($('catalogItem')?.value);
  if(product()==='additionalElement')parts.push($('additionalType')?.value,$('catalogItem')?.value);
  if(product()==='installation'||product()==='plinth')parts.push($('catalogItem')?.value);
  if(product()==='single42')parts.push('42',$('frame').value,currentHeight(),currentWidth(),$('opening').value,finishText('Single',1),finishText('Single',2),edgeText('Single'),$('doorHinges')?.value||'',Number($('doorHingeQty')?.value||0));
  if(product()==='sliding42')parts.push('42','SLIDING',$('frame').value,currentHeight(),currentWidth(),$('slidingDirection').value,finishText('Single',1),finishText('Single',2),edgeText('Single'));
  if(product()==='single59')parts.push('59','ALU',currentHeight(),currentWidth(),$('opening').value,finishText('Single',1),finishText('Single',2),edgeText('Single'),$('doorHinges')?.value||'',Number($('doorHingeQty')?.value||0));
  if(product()==='leaf36')parts.push('36',$('collection36').value.trim(),$('group36').value.trim(),$('model36').value.trim(),$('height36').value,width36(),cover36Text());
  if(product()==='trim36')parts.push($('trimType').value,$('trimType').value==='Добор телескопический'?doborWidth():$('trimFixedSize')?.value,trimCoverText());
  if(product()==='trim42'){
    const sale=$('trim42Sale')?.value||'';
    parts.push(trim42Item(),$('trim42Color')?.value||'',sale);
    if(trim42Item()==='Профиль дверного короба 42'&&sale==='Под конкретную дверь'){
      const s=trim42DoorOrderState();
      parts.push(s.mode,s.opening,s.height,s.width,s.part,s.verticalLength,s.topLength);
    }
  }
  if(product()==='trim59')parts.push(trim59Item(),$('trim59Color')?.value||'', $('trim59Sale')?.value||'');
  if(product()==='double42')parts.push('42',$('frame').value,currentHeight(),doubleWidth('left'),doubleWidth('right'),$('opening').value,
    finishText('Left',1),finishText('Left',2),edgeText('Left'),finishText('Right',1),finishText('Right',2),edgeText('Right'));
  return parts.join('|').toUpperCase().replace(/\s+/g,' ').trim();
}

function categoryLabel(){
  return {
    single42:'Дверь 42',sliding42:'Откатная дверь 42',single59:'Дверь 59',leaf36:'Дверь 36',trim36:'Погонаж 36',trim42:'Погонаж 42',trim59:'Погонаж 59',double42:'Двустворчатая дверь 42',hardware:'Фурнитура',openingSystem:'Системы открывания',additionalElement:'Доп. элементы двери',installation:'Монтаж и комплектующие',plinth:'Плинтус'
  }[product()];
}

function renderRecommendations(){
  const box=$('recommendations');
  if(product()!=='double42'){box.innerHTML='';return}
  box.innerHTML=`
    <div class="section">
      <div class="section-title">Сопутствующие товары</div>
      <div class="rec"><b>Профиль короба 42 мм</b><span class="badge">автокомплект</span> Две петлевые стойки по H+100 мм и верхняя перемычка по сумме ширин створок +100 мм. Ответной стойки короба нет.</div>
      <div class="rec"><b>Ригель</b><span class="badge">по выбору</span> Можно выбрать отдельно для левой, правой или обеих створок. Отдельный товар, не влияет на SKU полотен.</div>
    </div>`;
}

function selectedOrderExtras(){
  if(product()==='sliding42'){
    const out=[];
    const handle=$('slidingHandle')?.value||'Без ручки';
    const system=$('slidingSystem')?.value||'';
    if(handle && handle!=='Без ручки')out.push(['Ручка',handle]);
    if(system && system!=='Без системы')out.push(['Система открывания',system]);
    const vent=$('doorVent')?.value||'';
    const extra=$('doorExtra')?.value?.trim()||'';
    if(vent && vent!=='Не требуется')out.push(['Вентрешётка',vent]);
    if(extra)out.push(['Доп. элемент',extra]);
    return out;
  }
  if(!['single42','single59','double42'].includes(product()))return [];
  const ids=[
    ['Петли','doorHinges'],['Замок','doorLock'],['Ручка','doorHandle'],['Завертка','doorTurn'],
    ['Цилиндр','doorCylinder'],['Стопор','doorStopper'],['Автопорог','doorThreshold'],['Доводчик','doorCloser'],
    ['Система открывания','doorOpeningSystem'],['Вентрешётка','doorVent'],['Доп. элемент','doorExtra']
  ];
  const filteredIds=['single42','single59'].includes(product())?ids.filter(([label])=>label!=='Петли'):ids;
  const out=filteredIds.map(([label,id])=>[label,$(id)?.value?.trim()||'']).filter(([,v])=>v && v!=='Не требуется');
  if(['single42','single59'].includes(product()) && boxMiter45Selected())out.push(['Запил короба под 45°','Да']);
  if(product()==='double42'){
    const lock=$('doorLock')?.value?.trim()||'';
    if(lock){
      const leaf=$('doubleLockLeaf')?.value||'Левая створка';
      out.push(['Створка с замком',leaf]);
      out.push(['Ответная часть замка',leaf==='Левая створка'?'Правая створка':'Левая створка']);
    }
    if($('doubleBoltLeft')?.value==='Ригель для двери')out.push(['Ригель','Левая створка']);
    if($('doubleBoltRight')?.value==='Ригель для двери')out.push(['Ригель','Правая створка']);
  }
  return out;
}
function renderOrderExtras(){
  const box=$('orderExtras'); if(!box)return;
  const extras=selectedOrderExtras();
  const companions=companionItems();
  const lines=[];
  const pricedExtraLabels=new Set();
  if(companions.some(x=>x.key==='DOOR-LOCK'))pricedExtraLabels.add('Замок');
  if(companions.some(x=>x.key==='DOOR-HANDLE'||x.key==='SLIDE42-HANDLE'))pricedExtraLabels.add('Ручка');
  if(companions.some(x=>x.key==='DOOR-TURN'))pricedExtraLabels.add('Завертка');
  if(companions.some(x=>x.key==='DOOR-CYLINDER'))pricedExtraLabels.add('Цилиндр');
  if(companions.some(x=>x.key==='DOOR-STOPPER'))pricedExtraLabels.add('Стопор');
  if(companions.some(x=>x.key==='DOOR-THRESHOLD'))pricedExtraLabels.add('Автопорог');
  if(companions.some(x=>x.key==='DOOR-CLOSER'))pricedExtraLabels.add('Доводчик');
  if(companions.some(x=>x.key==='SLIDE42-SYSTEM'))pricedExtraLabels.add('Система открывания');
  const renderedExtras=extras.filter(([k])=>!pricedExtraLabels.has(k));
  renderedExtras.forEach(([k,v])=>lines.push(`<div><b>${escapeHtml(k)}:</b> ${escapeHtml(v)}</div>`));
  companions.forEach(x=>{
    const label=x.kind==='service'?'Платная услуга':'Автокомплект';
    const unitPrice=companionItemUnitPrice(x);
    const priceHtml=unitPrice===null?' <span class="mini">· цена по запросу</span>':' <span class="mini">· '+formatRub(unitPrice)+'/'+escapeHtml(x.unit)+' · итого '+formatRub(unitPrice*Number(x.qty||0))+'</span>';
    lines.push(`<div><b>${label}:</b> ${x.qty} ${escapeHtml(x.unit)} × ${escapeHtml(x.name)}${priceHtml}</div>`);
  });
  box.innerHTML=lines.length?lines.join(''):
    (['single42','single59','double42','leaf36'].includes(product())?'Дополнительная комплектация не выбрана.':'Для этой товарной группы отдельная комплектация заказа не требуется.');
}
function stockMatch(){
  const cat=categoryLabel();
  const candidates=getStock().filter(x=>x.category===cat && x.qty>0);
  if(!candidates.length)return null;
  let dims='';
  if(product()==='single42'||product()==='single59'||product()==='sliding42')dims=`${currentHeight()}x${currentWidth()}`;
  if(product()==='leaf36')dims=`${$('height36')?.value}x${width36()}`;
  if(product()==='trim36')dims=$('trimFixedSize')?.value||String(doborWidth());
  const opening=product()==='sliding42'?($('slidingDirection')?.value||''):($('opening')?.value||'');
  return candidates.find(x=>{
    const n=x.name.toLowerCase();
    return (!dims||n.includes(dims.toLowerCase())) && (!opening||n.includes(opening.toLowerCase()));
  })||null;
}
function renderStockMatch(){
  const box=$('stockMatchBox'); if(!box)return;
  if(!['single42','single59','sliding42','leaf36','trim36','double42'].includes(product())){
    box.className='status info';box.textContent='Для этой товарной группы автоматическое сопоставление со складом пока не используется.';return;
  }
  const m=stockMatch();
  if(m){box.className='status ok';box.innerHTML=`<b>Есть точное совпадение:</b> ${escapeHtml(m.sku)} · доступно ${m.qty} ${escapeHtml(m.unit)}<br>${escapeHtml(m.name)}`;}
  else{box.className='status warn';box.innerHTML='<b>Точного совпадения на локальном складе прототипа нет.</b><br>Позицию можно добавить в заказ как изготовление под заказ.';}
}
function render(){
  refreshDynamicDetails();
  const s=standardFlag();
  if($('standardFlag'))$('standardFlag').value=s;
  $('standardResult').textContent=s+' (в длинное название не включается)';
  $('standardResult')?.closest('.result')?.classList.toggle('hidden',['leaf36','wallPanel'].includes(product()));
  $('fullName').textContent=longName();
  $('shortName').textContent=shortName();
  $('uniqKey').textContent=canonical();
  renderRecommendations();
  renderPartnerPrice36();
  if(typeof renderSalesPrice42==='function')renderSalesPrice42();
  if(typeof renderConfiguredPriceCard==='function')renderConfiguredPriceCard();
  if(product()==='openingSystem' && typeof renderOpeningSystemPrice==='function')renderOpeningSystemPrice();
  renderOrderExtras();
  renderStockMatch();
  const v=validate(),box=$('validationBox');
  if(v.errs.length){box.className='status err';box.innerHTML='<b>Нельзя создать:</b><br>'+v.errs.map(x=>'• '+escapeHtml(x)).join('<br>')}
  else if(v.warns.length){box.className='status warn';box.innerHTML='<b>Допустимо с предупреждением:</b><br>'+v.warns.map(x=>'• '+escapeHtml(x)).join('<br>')}
  else{box.className='status ok';box.innerHTML='<b>Конфигурация проходит текущие согласованные правила.</b>'}
  $('createBtn').disabled=role()==='manager'||v.errs.length>0;
  $('duplicateBox').classList.add('hidden');
  updateRoleUI();
}

function nextSku(reg){
  let max=0;reg.forEach(r=>{const m=(r.sku||'').match(/HD-D-(\d+)/);if(m)max=Math.max(max,Number(m[1]))});
  return 'HD-D-'+String(max+1).padStart(6,'0');
}
function findDuplicate(show=true){
  const key=canonical(),reg=getRegistry(),hit=reg.find(r=>r.key===key);
  if(show){
    const b=$('duplicateBox');b.classList.remove('hidden');
    if(hit){b.className='status ok';b.innerHTML=`Найдена существующая номенклатура: <b>${hit.sku}</b><br>${escapeHtml(hit.name)}`}
    else{b.className='status info';b.innerHTML='Точного дубля в тестовом реестре не найдено.'}
  }
  return hit;
}
function createSku(){
  const v=validate();if(v.errs.length||role()==='manager')return;
  const reg=getRegistry(),hit=findDuplicate(false),b=$('duplicateBox');b.classList.remove('hidden');
  if(hit){
    b.className='status ok';b.innerHTML=`Дубль не создан. Уже существует: <b>${hit.sku}</b><br>${escapeHtml(hit.name)}`;
    if(typeof returnToStockReceiptAfterCreate==='function')returnToStockReceiptAfterCreate(hit);
    return;
  }
  const sku=nextSku(reg);
  const stockMeta=typeof stockRegistryMetaForCurrentConfig==='function'?stockRegistryMetaForCurrentConfig():{};
  const record={sku,key:canonical(),category:categoryLabel(),name:longName(),created:new Date().toLocaleString('ru-RU'),...stockMeta};
  reg.push(record);
  saveRegistry(reg);b.className='status ok';b.innerHTML=`Создана новая тестовая номенклатура: <b>${sku}</b>`;renderRegistry();
  if(typeof returnToStockReceiptAfterCreate==='function')returnToStockReceiptAfterCreate(record);
}
function renderRegistry(){
  const reg=getRegistry().slice().reverse();
  $('registryBody').innerHTML=reg.length?reg.map(r=>`<tr><td><b>${r.sku}</b></td><td>${escapeHtml(r.category)}</td><td>${escapeHtml(r.name)}</td><td>${r.created}</td></tr>`).join(''):
    '<tr><td colspan="4" style="color:#6b7280">Пока нет созданных позиций.</td></tr>';
}
function clearRegistry(){
  if(role()!=='admin')return;
  if(confirm('Очистить тестовый реестр v6?')){saveRegistry([]);renderRegistry()}
}
function exportCsv(){
  const reg=getRegistry(),rows=[['SKU','Категория','Наименование','Ключ уникальности','Создано'],...reg.map(r=>[r.sku,r.category,r.name,r.key,r.created])];
  const csv=rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(';')).join('\n');
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'}),a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download='hidden_doors_registry_v4.csv';a.click();URL.revokeObjectURL(a.href);
}
function copyText(id){
  const t=$(id).textContent;
  navigator.clipboard?.writeText(t).catch(()=>prompt('Скопируйте:',t));
}
function updateRoleUI(){
  document.querySelectorAll('.admin-only').forEach(el=>el.classList.toggle('hidden',role()!=='admin'));
  document.querySelectorAll('.stock-write,.catalog-write').forEach(el=>el.classList.toggle('hidden',!catalogWriteAllowed()));
  document.querySelectorAll('.manager-workflow').forEach(el=>el.classList.toggle('hidden',!managerWorkflowVisible()));
  document.querySelectorAll('.bitrix-deal-action').forEach(el=>el.classList.toggle('hidden',!bitrixDealActionAllowed()));
  if(role()!=='admin'&&!$('viewPricing')?.classList.contains('hidden'))showView('configurator');
}
