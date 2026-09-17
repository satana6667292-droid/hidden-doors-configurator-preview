from pathlib import Path

src = Path('v33.html')
out = Path('v34.html')
s = src.read_text(encoding='utf-8')

s = s.replace('Прототип v33 · Справочники: правила добавления','Прототип v34 · Справочники: замки, ручки и петли')
s = s.replace('Прототип v33 · справочники: ПВХ и RAL','Прототип v34 · справочники: ПВХ, RAL, замки, ручки и петли')

marker = "$('role').addEventListener('change',renderForm);"
assert marker in s

addon = r'''

/* v34 — формы справочников замков, ручек и петель */
let dictionaryExtraParams=[];

function getCustomDictionaryItems(type){
  const keys={lock:'hd_v34_dict_locks',handle:'hd_v34_dict_handles',hinge:'hd_v34_dict_hinges'};
  return getStore(keys[type]||'',[]);
}
function saveCustomDictionaryItems(type,items){
  const keys={lock:'hd_v34_dict_locks',handle:'hd_v34_dict_handles',hinge:'hd_v34_dict_hinges'};
  if(keys[type])setStore(keys[type],items);
}
function dictionaryCardCount(type,bitrixName){
  return catalogValues(bitrixName).length+getCustomDictionaryItems(type).length;
}

function renderDictionaries(){
  const box=$('dictionaryGrid'); if(!box)return;
  const cards=[
    {key:'film36',name:'ПВХ-плёнки · 36 мм',count:getFilms36().length,note:'Специальный экономичный каталог для дверей 36 мм. Эти плёнки также доступны в 42/59 и стеновых панелях.'},
    {key:'filmGeneral',name:'ПВХ-плёнки · общий каталог',count:getFilmsGeneral().length,note:'Каталог для 42/59, стеновых панелей и остальной номенклатуры. В дверь 36 мм этот каталог не подставляется.'},
    {key:'ral',name:'RAL',count:getRals().length,note:'Редактируемый справочник цветов: обозначение RAL + обязательный четырёхзначный номер.'},
    {key:'hinge',name:'Петли',count:dictionaryCardCount('hinge','Петли'),note:'Обязательные поля + произвольные дополнительные параметры.'},
    {key:'lock',name:'Замки',count:dictionaryCardCount('lock','Замки'),note:'Обязательные поля + произвольные дополнительные параметры.'},
    {key:'handle',name:'Ручки',count:dictionaryCardCount('handle','Ручки'),note:'Обязательные поля + произвольные дополнительные параметры.'},
    {name:'Завертки',count:catalogValues('Завертки').length,note:'Bitrix24 · ревизия'},
    {name:'Цилиндры',count:catalogValues('Цилиндровые механизмы').length,note:'Bitrix24 · ревизия'},
    {name:'Стопоры',count:catalogValues('Стопоры').length,note:'Bitrix24 · ревизия'},
    {name:'Автоматические пороги',count:catalogValues('Скрытый порог').length,note:'Переименовано из «Скрытый порог»'},
    {name:'Доводчики',count:catalogValues('Доводчики').length,note:'Оставлены без глубокой ревизии'},
    {name:'Системы открывания',count:catalogValues('Системы открывания').length,note:'Отдельный раздел'},
    {name:'Вентиляционные решётки',count:catalogValues('Вентиляционные решетки').length,note:'Дополнительные элементы двери'},
    {name:'Доп. фурнитура / элементы',count:catalogValues('Доп.фурнитура').length,note:'Иллюминаторы, декоративные накладки и прочие дополнительные элементы'},
    {name:'Всё для монтажа',count:catalogValues('Всё для монтажа').length,note:'Монтажные комплекты и комплектующие'},
    {name:'Плинтус',count:catalogValues('Плинтус').length,note:'Самостоятельная товарная группа'}
  ];
  box.innerHTML=cards.map(x=>`<div class="dict-card">
    <h3>${escapeHtml(x.name)}</h3>
    <div class="mini">${escapeHtml(x.note)}</div>
    <div class="n">${x.count}</div>
    ${x.key?`<div class="row" style="margin-top:10px"><button class="secondary" type="button" onclick="openDictionaryEditor('${x.key}')">Добавить</button></div>`:''}
  </div>`).join('');
}

function dictInput(id,label,placeholder='',type='text',extra=''){
  return `<div><label>${label} <span style="color:#991b1b">*</span></label><input id="${id}" type="${type}" placeholder="${placeholder}" ${extra} oninput="dictionaryRefreshSaveState()"></div>`;
}
function dictSelect(id,label,values){
  return `<div><label>${label} <span style="color:#991b1b">*</span></label><select id="${id}" onchange="dictionaryRefreshSaveState()">${values.map(v=>`<option>${v}</option>`).join('')}</select></div>`;
}
function renderExtraParams(){
  const box=$('dictExtraParams'); if(!box)return;
  box.innerHTML=dictionaryExtraParams.length?dictionaryExtraParams.map((p,i)=>`
    <div class="fields" style="margin-top:8px;align-items:end">
      <div><label>Название параметра</label><input value="${escapeHtml(p.name||'')}" placeholder="Например: Угол открывания" oninput="updateExtraParam(${i},'name',this.value)"></div>
      <div><label>Значение</label><div class="inline"><input value="${escapeHtml(p.value||'')}" placeholder="Например: 180°" oninput="updateExtraParam(${i},'value',this.value)"><button type="button" class="ghost" onclick="removeExtraParam(${i})">×</button></div></div>
    </div>`).join(''):'<div class="mini">Дополнительных параметров пока нет.</div>';
}
function addExtraParam(){
  dictionaryExtraParams.push({name:'',value:''});renderExtraParams();
}
function updateExtraParam(i,key,value){
  if(dictionaryExtraParams[i])dictionaryExtraParams[i][key]=value;
}
function removeExtraParam(i){
  dictionaryExtraParams.splice(i,1);renderExtraParams();
}
function hardwareExtraBlock(){
  return `<div class="full" style="margin-top:12px"><div class="section-title">Дополнительные параметры</div><div class="mini">Если нужного свойства нет среди стандартных — добавьте его вручную. Эти поля не заменяют обязательные параметры.</div><div id="dictExtraParams"></div><div class="row" style="margin-top:10px"><button type="button" class="ghost" onclick="addExtraParam()">+ Добавить параметр</button></div></div>`;
}

function openDictionaryEditor(type){
  dictionaryEditorType=type;
  dictionaryExtraParams=[];
  const editor=$('dictionaryEditor'); if(!editor)return;
  dictionaryClearMessages();
  editor.classList.remove('hidden');
  const title=$('dictionaryEditorTitle'), note=$('dictionaryEditorNote'), fieldsBox=$('dictionaryEditorFields');
  if(type==='film36' || type==='filmGeneral'){
    const is36=type==='film36';
    title.textContent=is36?'Добавить ПВХ-плёнку · каталог 36 мм':'Добавить ПВХ-плёнку · общий каталог';
    note.textContent=is36?'Оба поля обязательны. Каталог 36 мм используется в дверях 36 мм и дополнительно доступен в другой номенклатуре.':'Оба поля обязательны. Общий каталог используется для 42/59, стеновых панелей и остальной номенклатуры.';
    fieldsBox.innerHTML=`<div><label>Номенклатурное наименование</label><input id="dictFilmName" autocomplete="off" placeholder="Например: Дуб натуральный" oninput="dictionaryRefreshSaveState()"></div>`+`<div><label>Артикул</label><input id="dictFilmArticle" autocomplete="off" placeholder="Например: TF 14 IE 28 21" oninput="dictionaryRefreshSaveState()"></div>`;
    setTimeout(()=>$('dictFilmName')?.focus(),0);
  }else if(type==='ral'){
    title.textContent='Добавить цвет RAL';
    note.textContent='Сохраняем обозначение как «RAL 9003»: система RAL фиксирована, номер обязателен и должен содержать 4 цифры.';
    fieldsBox.innerHTML=`<div><label>Обозначение</label><input value="RAL" disabled></div>`+`<div><label>Номер RAL</label><input id="dictRalNumber" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="9003" oninput="this.value=this.value.replace(/\D/g,'').slice(0,4);dictionaryRefreshSaveState()"></div>`;
    setTimeout(()=>$('dictRalNumber')?.focus(),0);
  }else if(type==='lock'){
    title.textContent='Добавить дверной замок';
    note.textContent='Все отмеченные поля обязательны. Артикул производителя должен быть уникальным среди добавленных замков.';
    fieldsBox.innerHTML=dictInput('dictHwName','Номенклатурное наименование','Например: Замок магнитный AGB Mediana Polaris')+dictInput('dictHwBrand','Бренд / производитель','AGB')+dictInput('dictHwArticle','Артикул производителя','B06103.50.93')+dictSelect('dictLockType','Тип замка',['Магнитный','Механический','Под цилиндр','WC','Защёлка','Другой'])+dictInput('dictHwFinish','Цвет / отделка','Чёрный матовый')+dictInput('dictLockBackset','Backset, мм','50','number','min="1" step="1"')+hardwareExtraBlock();
    renderExtraParams();
  }else if(type==='handle'){
    title.textContent='Добавить дверную ручку';
    note.textContent='Основные идентифицирующие характеристики обязательны. Остальные свойства можно добавить вручную.';
    fieldsBox.innerHTML=dictInput('dictHwName','Номенклатурное наименование','Например: Ручка Armadillo AJAX')+dictInput('dictHwBrand','Бренд / производитель','Armadillo')+dictInput('dictHwArticle','Артикул производителя','AJAX URB6')+dictInput('dictHwModel','Модель / серия','AJAX')+dictSelect('dictHandleType','Тип ручки',['На розетке','Кноб','Для раздвижной двери','Другая'])+dictSelect('dictHandleBase','Форма основания',['Круглая','Квадратная','Прямоугольная','Специальная'])+dictInput('dictHwFinish','Цвет / отделка','Матовый хром')+hardwareExtraBlock();
    renderExtraParams();
  }else if(type==='hinge'){
    title.textContent='Добавить дверную петлю';
    note.textContent='Для петли дополнительно обязательны допустимая масса двери и хотя бы одна применяемая толщина двери.';
    fieldsBox.innerHTML=dictInput('dictHwName','Номенклатурное наименование','Например: Петля скрытая Krona Koblenz K7080')+dictInput('dictHwBrand','Бренд / производитель','Krona Koblenz')+dictInput('dictHwArticle','Артикул производителя','K7080 ...')+dictInput('dictHwModel','Модель / серия','K7080')+dictSelect('dictHingeType','Тип петли',['Скрытая','Карточная','Другая'])+dictInput('dictHwFinish','Цвет / отделка','Чёрный')+dictInput('dictHingeMass','Допустимая масса двери, кг','80','number','min="1" step="1"')+`<div class="full"><label>Применяемость по толщине двери <span style="color:#991b1b">*</span></label><div class="row"><label class="check"><input id="dictHinge36" type="checkbox" onchange="dictionaryRefreshSaveState()"> 36 мм</label><label class="check"><input id="dictHinge42" type="checkbox" onchange="dictionaryRefreshSaveState()"> 42 мм</label><label class="check"><input id="dictHinge59" type="checkbox" onchange="dictionaryRefreshSaveState()"> 59 мм</label></div></div>`+hardwareExtraBlock();
    renderExtraParams();
  }
  dictionaryRefreshSaveState();
  editor.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function dictionaryHardwareReady(){
  const base=[$('dictHwName'),$('dictHwBrand'),$('dictHwArticle'),$('dictHwFinish')].every(x=>x?.value.trim());
  if(!base)return false;
  if(dictionaryEditorType==='lock')return !!($('dictLockType')?.value && Number($('dictLockBackset')?.value)>0);
  if(dictionaryEditorType==='handle')return !!($('dictHwModel')?.value.trim() && $('dictHandleType')?.value && $('dictHandleBase')?.value);
  if(dictionaryEditorType==='hinge')return !!($('dictHwModel')?.value.trim() && $('dictHingeType')?.value && Number($('dictHingeMass')?.value)>0 && ($('dictHinge36')?.checked||$('dictHinge42')?.checked||$('dictHinge59')?.checked));
  return false;
}
function dictionaryRefreshSaveState(){
  const btn=$('dictionarySaveBtn'); if(!btn)return;
  let ready=false;
  if(dictionaryEditorType==='film36' || dictionaryEditorType==='filmGeneral')ready=!!($('dictFilmName')?.value.trim() && $('dictFilmArticle')?.value.trim());
  else if(dictionaryEditorType==='ral')ready=/^\d{4}$/.test($('dictRalNumber')?.value.trim()||'');
  else if(['lock','handle','hinge'].includes(dictionaryEditorType))ready=dictionaryHardwareReady();
  btn.disabled=!ready;
}
function normalizedExtraParams(){
  return dictionaryExtraParams.map(x=>({name:(x.name||'').trim(),value:(x.value||'').trim()})).filter(x=>x.name&&x.value);
}
function customArticleExists(type,article){
  const a=article.trim().toUpperCase();
  return getCustomDictionaryItems(type).some(x=>String(x.article||'').toUpperCase()===a);
}
function saveHardwareDictionaryEntry(type){
  if(!dictionaryHardwareReady()){dictionaryShowError('Заполните все обязательные поля.');return}
  const article=$('dictHwArticle').value.trim().toUpperCase();
  if(customArticleExists(type,article)){dictionaryShowError('Позиция с таким артикулом уже добавлена в этот справочник.');return}
  const item={name:$('dictHwName').value.trim(),brand:$('dictHwBrand').value.trim(),article,finish:$('dictHwFinish').value.trim(),extra:normalizedExtraParams(),createdAt:new Date().toISOString()};
  if(type==='lock')Object.assign(item,{lockType:$('dictLockType').value,backset:Number($('dictLockBackset').value)});
  if(type==='handle')Object.assign(item,{model:$('dictHwModel').value.trim(),handleType:$('dictHandleType').value,baseShape:$('dictHandleBase').value});
  if(type==='hinge')Object.assign(item,{model:$('dictHwModel').value.trim(),hingeType:$('dictHingeType').value,maxMass:Number($('dictHingeMass').value),doorThickness:[36,42,59].filter(v=>$('dictHinge'+v)?.checked)});
  const vals=getCustomDictionaryItems(type);vals.push(item);saveCustomDictionaryItems(type,vals);
  dictionaryShowSuccess('Добавлено: '+item.name+' · '+item.article+(item.extra.length?' · доп. параметров: '+item.extra.length:''));
  renderDictionaries();
  openDictionaryEditor(type);
}

const v33SaveDictionaryEntry=saveDictionaryEntry;
function saveDictionaryEntry(){
  if(['lock','handle','hinge'].includes(dictionaryEditorType)){saveHardwareDictionaryEntry(dictionaryEditorType);return}
  return v33SaveDictionaryEntry();
}

'''

s = s.replace(marker, addon + marker)
out.write_text(s, encoding='utf-8')
print(out, len(s.encode('utf-8')))
