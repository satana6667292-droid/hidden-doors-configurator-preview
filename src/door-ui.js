function finishSide(id,label,covers,filmMode){
  const dualPvcCatalog=product()==='single42'&&filmMode==='42';
  return `
  <div>
    <label>${label}</label>
    <select id="${id}Type">${options(covers,'Грунт под покраску')}</select>
    ${dualPvcCatalog?`<div id="${id}FilmCatalogWrap" class="hidden" style="margin-top:7px">
      <label>Каталог ПВХ</label>
      <select id="${id}FilmCatalog">${options(['Hidden Doors','Общий каталог'],'Hidden Doors')}</select>
    </div>`:''}
    <div id="${id}DetailWrap" class="hidden" style="margin-top:7px">
      <label id="${id}DetailLabel">Покрытие</label>
      <div class="inline">
        <select id="${id}Detail"></select>
        ${plusButton(`addDictionaryFor("${id}Type","${id}Detail","${filmMode}")`)}
      </div>
    </div>
  </div>`;
}


function edgeControls(prefix,is59=false){
  const colors=is59?['Черный анод','Серый анод','Золотой анод','Полимерно-порошковая покраска']:
                    ['Черный анод','Серый анод','Полимерно-порошковая покраска'];
  return `
  <div>
    <label>Тип торца</label>
    <input value="Алюминиевый" disabled>
  </div>
  <div style="margin-top:7px">
    <label>Цвет торца</label>
    <select id="${prefix}EdgeColor">${options(colors,'Черный анод')}</select>
  </div>
  <div id="${prefix}EdgeRalWrap" class="hidden" style="margin-top:7px">
    <label>RAL торца</label>
    <div class="inline">
      <select id="${prefix}EdgeRal">${options(getRals(),getRals()[0])}</select>
      ${plusButton(`addRal("${prefix}EdgeRal")`)}
    </div>
  </div>`;
}

function finishPane(title,prefix,covers,filmMode,is59=false,includeEdge=true){
  return `<div class="pane">
    ${title?`<div class="pane-title">${title}</div>`:''}
    ${finishSide(`${prefix}Side1`,'Сторона 1 (лицевая)',covers,filmMode)}
    <div style="height:10px"></div>
    ${finishSide(`${prefix}Side2`,'Сторона 2 (внутренняя)',covers,filmMode)}
    ${includeEdge?`<div style="height:10px"></div>${edgeControls(prefix,is59)}`:''}
  </div>`;
}
