let dictionaryEditorType='';
let dictionaryExtraParams=[];
let dictionaryPendingImageData='';
let dictionaryPendingImageName='';

function getCustomDictionaryItems(type){
  const keys={lock:'hd_v34_dict_locks',handle:'hd_v34_dict_handles',hinge:'hd_v34_dict_hinges',turn:'hd_v34_dict_turns',cylinder:'hd_v34_dict_cylinders',stop:'hd_v34_dict_stops',threshold:'hd_v34_dict_thresholds',closer:'hd_v34_dict_closers',opening:'hd_v34_dict_opening_systems',grille:'hd_v34_dict_grilles'};
  return getStore(keys[type]||'',[]);
}
function saveCustomDictionaryItems(type,items){
  const keys={lock:'hd_v34_dict_locks',handle:'hd_v34_dict_handles',hinge:'hd_v34_dict_hinges',turn:'hd_v34_dict_turns',cylinder:'hd_v34_dict_cylinders',stop:'hd_v34_dict_stops',threshold:'hd_v34_dict_thresholds',closer:'hd_v34_dict_closers',opening:'hd_v34_dict_opening_systems',grille:'hd_v34_dict_grilles'};
  if(keys[type])setStore(keys[type],items);
}
function hardwareDictionaryTypes(){return ['lock','handle','hinge','turn','cylinder','stop','threshold','closer','opening','grille']}
function dictionaryCardCount(type,bitrixName){
  return catalogValues(bitrixName).length+getCustomDictionaryItems(type).length;
}
function nextHardwareSku(){
  const stored=Number(getStore('hd_v34_hw_sku_seq',0))||0;
  const used=hardwareDictionaryTypes()
    .flatMap(type=>getCustomDictionaryItems(type))
    .map(item=>String(item.sku||'').match(/^HD-HW-(\d{6})$/))
    .filter(Boolean)
    .map(match=>Number(match[1]));
  const next=Math.max(stored,...used,0)+1;
  setStore('hd_v34_hw_sku_seq',next);
  return 'HD-HW-'+String(next).padStart(6,'0');
}

function ensureDictionaryEditor(){
  let editor=$('dictionaryEditor');
  if(editor)return editor;
  const grid=$('dictionaryGrid');
  if(!grid)return null;
  editor=document.createElement('div');
  editor.id='dictionaryEditor';
  editor.className='pane hidden';
  editor.style.marginTop='14px';
  editor.innerHTML=`
    <div class="pane-title" id="dictionaryEditorTitle">Добавить позицию</div>
    <div class="mini" id="dictionaryEditorNote"></div>
    <div id="dictionaryEditorFields" class="fields" style="margin-top:12px"></div>
    <div id="dictionaryEditorMessage" class="status hidden" style="margin-top:12px"></div>
    <div class="row" style="margin-top:12px">
      <button id="dictionarySaveBtn" type="button" onclick="saveHardwareDictionaryEntry(dictionaryEditorType)" disabled>Сохранить</button>
      <button class="secondary" type="button" onclick="closeDictionaryEditor()">Закрыть</button>
    </div>`;
  grid.insertAdjacentElement('afterend',editor);
  return editor;
}
function closeDictionaryEditor(){
  const editor=$('dictionaryEditor');
  if(editor)editor.classList.add('hidden');
  dictionaryEditorType='';
  dictionaryExtraParams=[];
  dictionaryPendingImageData='';dictionaryPendingImageName='';
}
function dictionaryClearMessages(){
  const box=$('dictionaryEditorMessage');
  if(!box)return;
  box.className='status hidden';
  box.textContent='';
}
function dictionaryShowMessage(text,type){
  const box=$('dictionaryEditorMessage');
  if(!box)return;
  box.textContent=text;
  box.className='status '+type;
}
function dictionaryShowError(text){dictionaryShowMessage(text,'err')}
function dictionaryShowSuccess(text){dictionaryShowMessage(text,'ok')}


const HARDWARE_DUPLICATE_SOURCE_MAP={
  hinge:'Петли',lock:'Замки',handle:'Ручки',turn:'Завертки',cylinder:'Цилиндровые механизмы',
  stop:'Стопоры',threshold:'Скрытый порог',closer:'Доводчики',opening:'Системы открывания',
  grille:'Вентиляционные решетки',extra:'Доп.фурнитура'
};
function normalizeHardwareName(value){
  return String(value||'').toUpperCase().replace(/Ё/g,'Е').replace(/[«»"']/g,'')
    .replace(/[×ХX]/g,'X').replace(/[.,;:(){}\[\]]/g,' ').replace(/[-–—]/g,' ')
    .replace(/\s+/g,' ').trim();
}
function normalizeHardwareArticle(value){
  return String(value||'').toUpperCase().replace(/Ё/g,'Е').replace(/[«»"']/g,'')
    .replace(/\s*([.\/-])\s*/g,'$1').replace(/\s+/g,' ').trim();
}
function hardwareStaticEntries(){
  return Object.entries(HARDWARE_DUPLICATE_SOURCE_MAP).flatMap(([type,cat])=>
    catalogValues(cat).map(name=>({source:'catalog',type,category:cat,name:String(name||''),article:'',brand:'',model:''}))
  );
}
function hardwareCustomEntries(){
  return hardwareDictionaryTypes().flatMap(type=>
    getCustomDictionaryItems(type).map(item=>({
      source:'custom',type,category:type,
      name:String(item.name||''),article:String(item.article||''),brand:String(item.brand||''),model:String(item.model||''),sku:String(item.sku||'')
    }))
  );
}
function allHardwareEntries(){return [...hardwareStaticEntries(),...hardwareCustomEntries()]}
function staticNameContainsArticle(name,article){
  const a=normalizeHardwareArticle(article);if(a.length<4)return false;
  const n=String(name||'').toUpperCase().replace(/Ё/g,'Е').replace(/\s*([.\/-])\s*/g,'$1').replace(/\s+/g,' ');
  return n.includes(a);
}
function findHardwareDuplicateCandidate({name='',article='',excludeSku=''}={}){
  const nn=normalizeHardwareName(name),aa=normalizeHardwareArticle(article);
  let possible=null;
  for(const entry of allHardwareEntries()){
    if(excludeSku&&entry.sku===excludeSku)continue;
    if(nn&&normalizeHardwareName(entry.name)===nn)return {kind:'hard',reason:'Полное наименование уже есть',entry};
    if(aa&&entry.source==='custom'&&normalizeHardwareArticle(entry.article)===aa)return {kind:'hard',reason:'Артикул уже есть в добавленной фурнитуре',entry};
    if(!possible&&aa&&entry.source==='catalog'&&staticNameContainsArticle(entry.name,aa)){
      possible={kind:'possible',reason:'Артикул уже встречается в текущем каталоге — проверьте цвет/исполнение',entry};
    }
  }
  return possible;
}
function hardwareDuplicateExistingLabel(duplicate){
  const e=duplicate?.entry||{};
  const source=e.source==='catalog'?'системный каталог':'добавленная номенклатура';
  const sku=e.sku?' · SKU '+e.sku:'';
  const article=e.article?' · арт. '+e.article:'';
  const category=hardwareDuplicateDisplayCategory(e);
  return (category?category+' · ':'')+(e.name||'существующая позиция')+sku+article+' · '+source;
}
function hardwareDuplicateGuardMessage(duplicate){
  if(!duplicate)return '';
  const prefix=duplicate.kind==='hard'
    ?'Такая позиция уже есть. Добавлять повтор не нужно.'
    :'Позиция с таким артикулом уже встречается в каталоге. Повторное добавление заблокировано.';
  return prefix+' '+hardwareDuplicateExistingLabel(duplicate);
}

function currentHardwareDuplicateGroups(){
  const entries=allHardwareEntries();
  const byName=new Map();
  entries.forEach(e=>{const k=normalizeHardwareName(e.name);if(!k)return;if(!byName.has(k))byName.set(k,[]);byName.get(k).push(e)});
  const exact=[...byName.values()].filter(g=>g.length>1);
  const byArticle=new Map();
  hardwareCustomEntries().forEach(e=>{const k=normalizeHardwareArticle(e.article);if(!k)return;if(!byArticle.has(k))byArticle.set(k,[]);byArticle.get(k).push(e)});
  const structured=[...byArticle.values()].filter(g=>g.length>1);
  return {entries,exact,structured};
}

let hardwareDuplicateAuditGroups=[];

function hardwareDuplicateDisplayCategory(entry){
  return HARDWARE_DUPLICATE_SOURCE_MAP[entry.type]||entry.category||entry.type||'—';
}
function hardwareDuplicateMergeMeta(group){
  const customs=group.filter(x=>x.source==='custom');
  const catalogs=group.filter(x=>x.source==='catalog');
  const hasCatalog=catalogs.length>0;
  const customTypes=[...new Set(customs.map(x=>x.type).filter(Boolean))];
  if(catalogs.length>=2&&customs.length===0){
    const catalogTypes=[...new Set(catalogs.map(x=>x.type).filter(Boolean))];
    const normalizedNames=[...new Set(catalogs.map(x=>normalizeHardwareName(x.name)).filter(Boolean))];
    if(catalogTypes.length===1&&normalizedNames.length===1){
      return {
        canMerge:true,
        mode:'catalog',
        type:catalogTypes[0],
        category:HARDWARE_DUPLICATE_SOURCE_MAP[catalogTypes[0]]||catalogs[0].category||'',
        count:catalogs.length
      };
    }
    return {canMerge:false,reason:'Системные позиции различаются по справочнику или наименованию'};
  }
  if(hasCatalog)return {canMerge:false,reason:'Смешанная группа: системная + пользовательская позиция — требуется ручной выбор основной'};
  if(customs.length<2)return {canMerge:false,reason:'Недостаточно пользовательских дублей'};
  if(customTypes.length!==1)return {canMerge:false,reason:'Позиции находятся в разных справочниках'};
  return {canMerge:true,mode:'custom',type:customTypes[0],count:customs.length};
}
function hardwareSkuSequence(sku){
  const m=String(sku||'').match(/^HD-HW-(\d{6})$/);
  return m?Number(m[1]):Number.MAX_SAFE_INTEGER;
}
function findCustomHardwareRecord(entry){
  const items=getCustomDictionaryItems(entry.type);
  let index=items.findIndex(x=>entry.sku&&String(x.sku||'')===entry.sku);
  if(index<0){
    const name=normalizeHardwareName(entry.name),article=normalizeHardwareArticle(entry.article);
    index=items.findIndex(x=>
      (!name||normalizeHardwareName(x.name)===name)&&
      (!article||normalizeHardwareArticle(x.article)===article)
    );
  }
  return index>=0?{items,index,item:items[index]}:null;
}
function isMergeValueEmpty(value){
  return value===null||value===undefined||value===''||(Array.isArray(value)&&value.length===0);
}
function uniqueMergeArray(a,b){
  const out=[];
  for(const value of [...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])]){
    const key=typeof value==='object'?JSON.stringify(value):String(value);
    if(!out.some(x=>(typeof x==='object'?JSON.stringify(x):String(x))===key))out.push(value);
  }
  return out;
}
function mergeHardwareExtras(a,b){
  const out=[];
  for(const item of [...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])]){
    if(!item||typeof item!=='object')continue;
    const name=String(item.name||'').trim(),value=String(item.value||'').trim();
    if(!name&&!value)continue;
    const key=normalizeHardwareName(name)+'|'+normalizeHardwareName(value);
    if(!out.some(x=>normalizeHardwareName(x.name)+'|'+normalizeHardwareName(x.value)===key))out.push({name,value});
  }
  return out;
}
function mergeHardwareItemRecords(records){
  if(!records.length)return null;
  const sorted=[...records].sort((a,b)=>hardwareSkuSequence(a.sku)-hardwareSkuSequence(b.sku));
  const survivor={...sorted[0],extra:mergeHardwareExtras(sorted[0].extra,[])};
  const mergedFrom=[];
  const protectedKeys=new Set(['sku','createdAt','importedAt','mergedAt','mergedFromSkus']);
  for(const source of sorted.slice(1)){
    if(source.sku)mergedFrom.push(source.sku);
    for(const [key,value] of Object.entries(source)){
      if(protectedKeys.has(key)||key==='extra')continue;
      if(Array.isArray(value)){
        survivor[key]=uniqueMergeArray(survivor[key],value);
        continue;
      }
      if(isMergeValueEmpty(survivor[key])&&!isMergeValueEmpty(value))survivor[key]=value;
      else if(!isMergeValueEmpty(value)&&String(survivor[key])!==String(value)){
        survivor.extra=mergeHardwareExtras(survivor.extra,[{
          name:'Значение из объединённого дубля · '+key,
          value:String(value)
        }]);
      }
    }
    survivor.extra=mergeHardwareExtras(survivor.extra,source.extra);
  }
  survivor.mergedFromSkus=uniqueMergeArray(survivor.mergedFromSkus,mergedFrom);
  survivor.mergedAt=new Date().toISOString();
  return survivor;
}
function saveHardwareSkuAliases(removedSkus,survivorSku){
  const aliases=getStore('hd_v36_hw_sku_aliases',{});
  for(const sku of removedSkus)if(sku&&sku!==survivorSku)aliases[sku]=survivorSku;
  setStore('hd_v36_hw_sku_aliases',aliases);
}
function mergeHardwareDuplicateGroup(groupIndex){
  const group=hardwareDuplicateAuditGroups[groupIndex];
  if(!group)return;
  const meta=hardwareDuplicateMergeMeta(group);
  if(!meta.canMerge){alert(meta.reason);return}
  if(meta.mode==='catalog'){
    const catalogEntries=group.filter(x=>x.source==='catalog');
    const survivor=catalogEntries[0];
    const raw=(BITRIX_CATALOG[meta.category]||[]);
    const sameRaw=raw.filter(name=>normalizeHardwareName(name)===normalizeHardwareName(survivor.name));
    const extraCount=Math.max(0,sameRaw.length-1);
    const ok=confirm(
      'Объединить '+catalogEntries.length+' одинаковые системные позиции?\n\n'+
      'В каталоге останется одна строка:\n'+survivor.name+'\n\n'+
      'Исходный импорт Bitrix24 не удаляется: повторные строки будут скрыты правилом объединения.'
    );
    if(!ok)return;
    saveCatalogDuplicateMergeRule(meta.category,survivor.name);
    renderDictionaries();
    runHardwareDuplicateAudit();
    const box=$('hardwareDuplicateAudit');
    if(box){
      const note=document.createElement('div');
      note.className='status ok';
      note.style.marginBottom='10px';
      note.innerHTML='<b>Системные дубли объединены.</b> Оставлена одна позиция; скрыто повторов: '+extraCount+'.';
      box.prepend(note);
    }
    return;
  }
  const records=[];
  for(const entry of group.filter(x=>x.source==='custom')){
    const found=findCustomHardwareRecord(entry);
    if(found&&!records.some(x=>String(x.sku||'')===String(found.item.sku||'')))records.push(found.item);
  }
  if(records.length<2){runHardwareDuplicateAudit();return}
  const survivor=[...records].sort((a,b)=>hardwareSkuSequence(a.sku)-hardwareSkuSequence(b.sku))[0];
  const removed=records.filter(x=>x!==survivor).map(x=>x.sku).filter(Boolean);
  const ok=confirm(
    'Объединить '+records.length+' одинаковые позиции?\n\n'+
    'Останется основной SKU: '+(survivor.sku||'без SKU')+'\n'+
    'Недостающие характеристики будут перенесены в него, а лишние пользовательские дубли удалены.'
  );
  if(!ok)return;

  const merged=mergeHardwareItemRecords(records);
  const removeSet=new Set(records.map(x=>String(x.sku||'')));
  const items=getCustomDictionaryItems(meta.type);
  const next=[];
  let inserted=false;
  for(const item of items){
    if(removeSet.has(String(item.sku||''))){
      if(!inserted){next.push(merged);inserted=true}
    }else next.push(item);
  }
  if(!inserted)next.push(merged);
  saveCustomDictionaryItems(meta.type,next);
  saveHardwareSkuAliases(removed,merged.sku);
  renderDictionaries();
  runHardwareDuplicateAudit();
  const box=$('hardwareDuplicateAudit');
  if(box){
    const note=document.createElement('div');
    note.className='status ok';
    note.style.marginBottom='10px';
    note.innerHTML='<b>Позиции объединены.</b> Основной SKU: '+escapeHtml(merged.sku||'—')+'. Удалено дублей: '+removed.length+'.';
    box.prepend(note);
  }
}
function runHardwareDuplicateAudit(){
  const box=$('hardwareDuplicateAudit');if(!box)return;
  const report=currentHardwareDuplicateGroups();
  const groups=[...report.exact];
  for(const group of report.structured){
    const sig=group.map(x=>(x.source||'')+'|'+(x.type||'')+'|'+(x.sku||normalizeHardwareName(x.name))).sort().join('||');
    if(!groups.some(g=>g.map(x=>(x.source||'')+'|'+(x.type||'')+'|'+(x.sku||normalizeHardwareName(x.name))).sort().join('||')===sig))groups.push(group);
  }
  hardwareDuplicateAuditGroups=groups;
  const duplicateRows=groups.reduce((sum,g)=>sum+Math.max(0,g.length-1),0);
  if(!groups.length){
    box.innerHTML='<div class="status ok"><b>Дубли не найдены.</b> Проверено '+report.entries.length+' позиций фурнитуры.</div>';
    return;
  }
  box.innerHTML='<div class="status warn"><b>Найдены дубли: '+groups.length+' групп · '+duplicateRows+' лишних строк.</b><br>Нажмите «Объединить» для полностью одинаковых пользовательских или системных позиций. Для системных дублей исходный импорт не удаляется — повтор скрывается правилом объединения.</div>'+
    '<div class="table-wrap" style="margin-top:10px"><table><thead><tr><th>№</th><th>SKU</th><th>Категория</th><th>Наименование</th><th>Источник</th><th>Артикул</th><th>Действие</th></tr></thead><tbody>'+
    groups.map((g,i)=>{
      const meta=hardwareDuplicateMergeMeta(g);
      const action=meta.canMerge
        ?'<button class="secondary catalog-write" type="button" onclick="mergeHardwareDuplicateGroup('+i+')">Объединить</button>'
        :'<span class="mini">'+escapeHtml(meta.reason)+'</span>';
      return g.map((e,j)=>'<tr>'+
        '<td>'+(j===0?i+1:'↳')+'</td>'+
        '<td>'+escapeHtml(e.sku||'—')+'</td>'+
        '<td>'+escapeHtml(hardwareDuplicateDisplayCategory(e))+'</td>'+
        '<td>'+escapeHtml(e.name)+'</td>'+
        '<td>'+escapeHtml(e.source==='catalog'?'Текущий каталог':'Добавлено вручную/импорт')+'</td>'+
        '<td>'+escapeHtml(e.article||'—')+'</td>'+
        (j===0?'<td rowspan="'+g.length+'">'+action+'</td>':'')+
        '</tr>').join('');
    }).join('')+
    '</tbody></table></div>';
}

function renderDictionaries(){
  const box=$('dictionaryGrid'); if(!box)return;
  const cards=[
    {filmScope:'36',name:'ПВХ-плёнки · 36 мм',count:getFilms36().length,note:'36 мм используют только этот каталог; 42/59 мм также видят его как дополнительный · название + артикул'},
    {filmScope:'general',name:'ПВХ-плёнки · основной каталог',count:getFilmsGeneral().length,note:'Основной справочник для 42/59 мм; для 36 мм недоступен · название + артикул'},
    {name:'RAL',count:getRals().length,note:'Редактируемый справочник цветов'},
    {key:'hinge',name:'Петли',count:dictionaryCardCount('hinge','Петли'),note:'Обязательные поля + произвольные дополнительные параметры'},
    {key:'lock',name:'Замки',count:dictionaryCardCount('lock','Замки'),note:'Обязательные поля + произвольные дополнительные параметры'},
    {key:'handle',name:'Ручки',count:dictionaryCardCount('handle','Ручки'),note:'Обязательные поля + произвольные дополнительные параметры'},
    {key:'turn',name:'Завертки',count:dictionaryCardCount('turn','Завертки'),note:'Обязательные поля + произвольные дополнительные параметры'},
    {key:'cylinder',name:'Цилиндры',count:dictionaryCardCount('cylinder','Цилиндровые механизмы'),note:'Обязательные поля + произвольные дополнительные параметры'},
    {key:'stop',name:'Стопоры',count:dictionaryCardCount('stop','Стопоры'),note:'Обязательные поля + произвольные дополнительные параметры'},
    {key:'threshold',name:'Автоматические пороги',count:dictionaryCardCount('threshold','Скрытый порог'),note:'Обязательные поля + произвольные дополнительные параметры'},
    {key:'closer',name:'Доводчики',count:dictionaryCardCount('closer','Доводчики'),note:'Обязательные поля + произвольные дополнительные параметры'},
    {key:'opening',name:'Системы открывания',count:dictionaryCardCount('opening','Системы открывания'),note:'Обязательные поля + произвольные дополнительные параметры'},
    {key:'grille',name:'Вентиляционные решётки',count:dictionaryCardCount('grille','Вентиляционные решетки'),note:'Обязательные поля + произвольные дополнительные параметры'}
  ];
  box.innerHTML=cards.map(x=>{
    const action=x.key
      ?`<div class="row catalog-write" style="margin-top:10px"><button class="secondary" type="button" onclick="openDictionaryEditor('${x.key}')">Добавить</button></div>`
      :x.filmScope
        ?`<div class="row catalog-write" style="margin-top:10px"><button class="secondary" type="button" onclick="dictionaryAddFilm('${x.filmScope}')">Добавить плёнку</button></div>`
        :'';
    return `<div class="dict-card"><h3>${escapeHtml(x.name)}</h3><div class="mini">${escapeHtml(x.note)}</div><div class="n">${x.count}</div>${action}</div>`;
  }).join('');
  ensureDictionaryEditor();
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
  dictionaryExtraParams.push({name:'',value:''});
  renderExtraParams();
}
function updateExtraParam(i,key,value){
  if(dictionaryExtraParams[i])dictionaryExtraParams[i][key]=value;
}
function removeExtraParam(i){
  dictionaryExtraParams.splice(i,1);
  renderExtraParams();
}
function hardwareExtraBlock(){
  return `<div class="full" style="margin-top:12px"><div class="section-title">Дополнительные параметры</div><div class="mini">Если нужного свойства нет среди стандартных — добавьте его вручную. Эти поля не заменяют обязательные параметры.</div><div id="dictExtraParams"></div><div class="row" style="margin-top:10px"><button type="button" class="ghost" onclick="addExtraParam()">+ Добавить параметр</button></div></div>`;
}

function dictionaryImageBlock(){
  return '<div class="full dictionary-image-field"><label>Фото товара <span class="mini">необязательно</span></label>'+
    '<div class="dictionary-image-row"><div id="dictionaryImagePreview" class="dictionary-image-preview empty">Фото не выбрано</div>'+
    '<div class="dictionary-image-actions"><input id="dictionaryImageFile" class="hidden" type="file" accept="image/png,image/jpeg,image/webp" onchange="handleDictionaryImageFile(this.files?.[0])">'+
    '<div class="row"><button class="secondary" type="button" onclick="$(\'dictionaryImageFile\').click()">Загрузить фото</button>'+
    '<button class="ghost internet-image-search-btn" type="button" onclick="openDictionaryImageSearch()">Найти фото в интернете</button></div>'+
    '<div class="mini" style="margin-top:6px">Можно загрузить JPG / PNG / WebP с компьютера или найти точное фото по названию, бренду и артикулу.</div></div></div></div>';
}
function renderDictionaryImagePreview(){
  const box=$('dictionaryImagePreview');if(!box)return;
  if(!dictionaryPendingImageData){box.className='dictionary-image-preview empty';box.innerHTML='Фото не выбрано';return}
  box.className='dictionary-image-preview';
  box.innerHTML='<img src="'+dictionaryPendingImageData+'" alt="Предпросмотр"><span>'+escapeHtml(dictionaryPendingImageName||'Фото')+'</span>';
}
async function handleDictionaryImageFile(file){
  if(!catalogWriteAllowed()||!file)return;
  try{dictionaryPendingImageData=await compressCatalogImageFile(file);dictionaryPendingImageName=file.name||'Фото';renderDictionaryImagePreview()}
  catch(err){dictionaryShowError(err?.message||'Не удалось загрузить фото.')}
}
function openDictionaryImageSearch(){
  if(!catalogWriteAllowed())return;
  const name=$('dictHwName')?.value?.trim()||'';
  const brand=$('dictHwBrand')?.value?.trim()||'';
  const article=$('dictHwArticle')?.value?.trim()||'';
  const model=$('dictHwModel')?.value?.trim()||'';
  const query=catalogImageSearchQuery([brand,article,model,name,'фото товара']);
  openCatalogImageSearch({
    mode:'dictionary',
    label:name||'Новая позиция номенклатуры',
    query
  });
}

function openDictionaryEditor(type){
  if(!catalogWriteAllowed()){alert('Добавление номенклатуры доступно ролям «Снабжение» и «Администратор».');return}
  dictionaryPendingImageData='';dictionaryPendingImageName='';
  if(!hardwareDictionaryTypes().includes(type))return;
  dictionaryEditorType=type;
  dictionaryExtraParams=[];
  const editor=ensureDictionaryEditor(); if(!editor)return;
  dictionaryClearMessages();
  editor.classList.remove('hidden');
  const title=$('dictionaryEditorTitle'),note=$('dictionaryEditorNote'),fieldsBox=$('dictionaryEditorFields');
  if(type==='lock'){
    title.textContent='Добавить дверной замок';
    note.textContent='Все отмеченные поля обязательны. Артикул производителя должен быть уникальным среди добавленной фурнитуры.';
    fieldsBox.innerHTML=
      dictInput('dictHwName','Номенклатурное наименование','Например: Замок магнитный AGB Mediana Polaris')+
      dictInput('dictHwBrand','Бренд / производитель','AGB')+
      dictInput('dictHwArticle','Артикул производителя','B06103.50.93')+
      dictSelect('dictLockType','Тип замка',['Магнитный','Механический','Под цилиндр','WC','Защёлка','Другой'])+
      dictInput('dictHwFinish','Цвет / отделка','Чёрный матовый')+
      dictInput('dictLockBackset','Backset, мм','50','number','min="1" step="1"')+
      hardwareExtraBlock();
  }else if(type==='handle'){
    title.textContent='Добавить дверную ручку';
    note.textContent='Основные идентифицирующие характеристики обязательны. Артикул производителя должен быть уникальным среди добавленной фурнитуры.';
    fieldsBox.innerHTML=
      dictInput('dictHwName','Номенклатурное наименование','Например: Ручка Armadillo AJAX')+
      dictInput('dictHwBrand','Бренд / производитель','Armadillo')+
      dictInput('dictHwArticle','Артикул производителя','AJAX URB6')+
      dictInput('dictHwModel','Модель / серия','AJAX')+
      dictSelect('dictHandleType','Тип ручки',['На розетке','Кноб','Для раздвижной двери','Другая'])+
      dictSelect('dictHandleBase','Форма основания',['Круглая','Квадратная','Прямоугольная','Специальная'])+
      dictInput('dictHwFinish','Цвет / отделка','Матовый хром')+
      hardwareExtraBlock();
  }else if(type==='hinge'){
    title.textContent='Добавить дверную петлю';
    note.textContent='Для петли дополнительно обязательны допустимая масса двери и хотя бы одна применяемая толщина двери. Артикул производителя должен быть уникальным среди добавленной фурнитуры.';
    fieldsBox.innerHTML=
      dictInput('dictHwName','Номенклатурное наименование','Например: Петля скрытая Krona Koblenz K7080')+
      dictInput('dictHwBrand','Бренд / производитель','Krona Koblenz')+
      dictInput('dictHwArticle','Артикул производителя','K7080 ...')+
      dictInput('dictHwModel','Модель / серия','K7080')+
      dictSelect('dictHingeType','Тип петли',['Скрытая','Карточная','Другая'])+
      dictInput('dictHwFinish','Цвет / отделка','Чёрный')+
      dictInput('dictHingeMass','Допустимая масса двери, кг','80','number','min="1" step="1"')+
      `<div class="full"><label>Применяемость по толщине двери <span style="color:#991b1b">*</span></label><div class="row"><label class="check"><input id="dictHinge36" type="checkbox" onchange="dictionaryRefreshSaveState()"> 36 мм</label><label class="check"><input id="dictHinge42" type="checkbox" onchange="dictionaryRefreshSaveState()"> 42 мм</label><label class="check"><input id="dictHinge59" type="checkbox" onchange="dictionaryRefreshSaveState()"> 59 мм</label></div></div>`+
      hardwareExtraBlock();
  }else if(type==='turn'){
    title.textContent='Добавить завертку / WC-фурнитуру';
    note.textContent='Артикул производителя уникален во всём справочнике фурнитуры. Длина квадрата / штока обязательна для сантехнической завертки и вертушки на шток цилиндра.';
    fieldsBox.innerHTML=
      dictInput('dictHwName','Номенклатурное наименование','Например: Завертка Armadillo BK6.R.URS52')+
      dictInput('dictHwBrand','Бренд / производитель','Armadillo')+
      dictInput('dictHwArticle','Артикул производителя','BK6.R.URS52 BL-26')+
      dictInput('dictHwModel','Модель / серия','BK6 URS')+
      dictSelect('dictTurnType','Тип изделия',['Сантехническая завертка / WC','Вертушка на шток цилиндра','Вставка под шток цилиндра','Накладка под цилиндр','Другое'])+
      dictInput('dictHwFinish','Цвет / отделка','Чёрный')+
      `<div><label>Длина квадрата / штока, мм <span class="mini">обязательно для WC / вертушки на шток</span></label><input id="dictTurnShaftLength" type="number" min="1" step="1" placeholder="80" oninput="dictionaryRefreshSaveState()"></div>`+
      dictSelect('dictTurnBase','Форма основания / розетки',['Круглая','Квадратная','Другая','Не применяется'])+
      hardwareExtraBlock();
  }else if(type==='cylinder'){
    title.textContent='Добавить цилиндровый механизм';
    note.textContent='Размеры цилиндра и применяемость обязательны. Для исполнения «Ключ / вертушка» указывается сторона вертушки. Артикул производителя уникален во всём справочнике фурнитуры.';
    fieldsBox.innerHTML=
      dictInput('dictHwName','Номенклатурное наименование','Например: Цилиндровый механизм Vantage ZC80')+
      dictInput('dictHwBrand','Бренд / производитель','Vantage')+
      dictInput('dictHwArticle','Артикул производителя','ZC80 CP')+
      dictInput('dictHwModel','Модель / серия','ZC80')+
      dictSelect('dictCylinderExecution','Исполнение',['Ключ / ключ','Ключ / вертушка','Без вертушки / специальное','Другое'])+
      dictInput('dictHwFinish','Цвет / отделка','Хром')+
      dictInput('dictCylinderLength','Общая длина цилиндра, мм','80','number','min="1" step="1"')+
      dictInput('dictCylinderSideA','Сторона A, мм','35','number','min="1" step="1"')+
      dictInput('dictCylinderSideB','Сторона B, мм','45','number','min="1" step="1"')+
      `<div><label>Количество ключей</label><input id="dictCylinderKeyCount" type="number" min="0" step="1" placeholder="5" oninput="dictionaryRefreshSaveState()"></div>`+
      `<div id="dictCylinderThumbSideWrap" class="hidden"><label>Сторона вертушки <span style="color:#991b1b">*</span></label><select id="dictCylinderThumbSide" onchange="dictionaryRefreshSaveState()"><option>Сторона A</option><option>Сторона B</option><option>Неважно</option></select></div>`+
      `<div class="full"><label>Применяемость по толщине двери <span style="color:#991b1b">*</span></label><div class="row"><label class="check"><input id="dictCylinder36" type="checkbox" onchange="dictionaryRefreshSaveState()"> 36 мм</label><label class="check"><input id="dictCylinder42" type="checkbox" onchange="dictionaryRefreshSaveState()"> 42 мм</label><label class="check"><input id="dictCylinder59" type="checkbox" onchange="dictionaryRefreshSaveState()"> 59 мм</label></div></div>`+
      hardwareExtraBlock();
  }else if(type==='stop'){
    title.textContent='Добавить стопор / ограничитель';
    note.textContent='Тип изделия, способ монтажа и цвет обязательны. Артикул производителя уникален во всём справочнике фурнитуры.';
    fieldsBox.innerHTML=
      dictInput('dictHwName','Номенклатурное наименование','Например: Магнитный скрытый стопор FANTOM PREMIUM')+
      dictInput('dictHwBrand','Бренд / производитель','FANTOM')+
      dictInput('dictHwArticle','Артикул производителя','HGT004')+
      dictInput('dictHwModel','Модель / серия','PREMIUM HGT004')+
      dictSelect('dictStopType','Тип изделия',['Скрытый магнитный стопор','Напольный упор / ограничитель','Дверной ограничитель','Магнитный стопор','Другой'])+
      dictSelect('dictStopMount','Способ монтажа',['Скрытый','Напольный','Накладной','На клеевой основе','Другой'])+
      dictInput('dictHwFinish','Цвет / отделка','Чёрный')+
      hardwareExtraBlock();
  }else if(type==='threshold'){
    title.textContent='Добавить автоматический порог';
    note.textContent='Для автоматического порога обязательны модель, тип изделия и длина. Цвет / отделка необязательны. Артикул производителя уникален во всём справочнике фурнитуры.';
    fieldsBox.innerHTML=
      dictInput('dictHwName','Номенклатурное наименование','Например: Автоматический порог EASY BLOCK F/1020')+
      dictInput('dictHwBrand','Бренд / производитель','EASY BLOCK')+
      dictInput('dictHwArticle','Артикул производителя','F/1020')+
      dictInput('dictHwModel','Модель / серия','EASY BLOCK F')+
      dictSelect('dictThresholdType','Тип изделия',['Автоматический выпадающий порог','Другой'])+
      dictInput('dictThresholdLength','Длина порога, мм','1020','number','min="1" step="1"')+
      `<div><label>Цвет / отделка <span class="mini">необязательно</span></label><input id="dictHwFinish" type="text" placeholder="Например: алюминий" oninput="dictionaryRefreshSaveState()"></div>`+
      hardwareExtraBlock();
  }else if(type==='closer'){
    title.textContent='Добавить дверной доводчик';
    note.textContent='Тип доводчика, фиксация открытого положения и цвет обязательны. Класс EN и максимальная масса двери необязательны. Артикул производителя уникален во всём справочнике фурнитуры.';
    fieldsBox.innerHTML=
      dictInput('dictHwName','Номенклатурное наименование','Например: Доводчик GEZE TS3000 EN1-4')+
      dictInput('dictHwBrand','Бренд / производитель','GEZE')+
      dictInput('dictHwArticle','Артикул производителя','TS3000')+
      dictInput('dictHwModel','Модель / серия','TS3000')+
      dictSelect('dictCloserType','Тип доводчика',['Накладной','Со скользящей тягой','Скрытый / врезной','Другой'])+
      `<div><label>Класс EN <span class="mini">необязательно</span></label><input id="dictCloserEn" type="text" placeholder="Например: EN1-4" oninput="dictionaryRefreshSaveState()"></div>`+
      `<div><label>Максимальная масса двери, кг <span class="mini">необязательно</span></label><input id="dictCloserMass" type="number" min="1" step="1" placeholder="80" oninput="dictionaryRefreshSaveState()"></div>`+
      dictSelect('dictCloserHoldOpen','Фиксация открытого положения',['Есть','Нет','Не указано'])+
      dictInput('dictHwFinish','Цвет / отделка','Матовый хром')+
      hardwareExtraBlock();
  }else if(type==='opening'){
    title.textContent='Добавить систему открывания';
    note.textContent='Тип открывания и тип позиции обязательны. Масса, размеры, направление и цвет необязательны. Артикул производителя уникален во всём справочнике фурнитуры.';
    fieldsBox.innerHTML=
      dictInput('dictHwName','Номенклатурное наименование','Например: Раздвижная система Armadillo HIDDEN/80')+
      dictInput('dictHwBrand','Бренд / производитель','Armadillo')+
      dictInput('dictHwArticle','Артикул производителя','HIDDEN/80')+
      dictInput('dictHwModel','Модель / серия','HIDDEN/80')+
      dictSelect('dictOpeningType','Тип открывания',['Раздвижная','Пенал / кассета','Книжка','Рото','Pivot','Twice','Телескопическая','Синхронная','Другое'])+
      dictSelect('dictOpeningItemType','Тип позиции',['Полная система / комплект','Пенал','Обрамление','Направляющая','Ролики / механизм','Толкатель','Другой компонент'])+
      `<div><label>Максимальная масса двери, кг <span class="mini">необязательно</span></label><input id="dictOpeningMaxMass" type="number" min="1" step="1" placeholder="80" oninput="dictionaryRefreshSaveState()"></div>`+
      `<div><label>Минимальная ширина полотна, мм <span class="mini">необязательно</span></label><input id="dictOpeningMinWidth" type="number" min="1" step="1" placeholder="800" oninput="dictionaryRefreshSaveState()"></div>`+
      `<div><label>Максимальная ширина полотна, мм <span class="mini">необязательно</span></label><input id="dictOpeningMaxWidth" type="number" min="1" step="1" placeholder="1100" oninput="dictionaryRefreshSaveState()"></div>`+
      `<div><label>Минимальная высота полотна, мм <span class="mini">необязательно</span></label><input id="dictOpeningMinHeight" type="number" min="1" step="1" placeholder="2000" oninput="dictionaryRefreshSaveState()"></div>`+
      `<div><label>Максимальная высота полотна, мм <span class="mini">необязательно</span></label><input id="dictOpeningMaxHeight" type="number" min="1" step="1" placeholder="2400" oninput="dictionaryRefreshSaveState()"></div>`+
      `<div><label>Сторона / направление <span class="mini">необязательно</span></label><select id="dictOpeningDirection" onchange="dictionaryRefreshSaveState()"><option value="">Не указано</option><option>Левая</option><option>Правая</option><option>Универсальная / неважно</option></select></div>`+
      `<div><label>Цвет / отделка <span class="mini">необязательно</span></label><input id="dictHwFinish" type="text" placeholder="Например: чёрный" oninput="dictionaryRefreshSaveState()"></div>`+
      hardwareExtraBlock();
  }else{
    title.textContent='Добавить вентиляционную решётку';
    note.textContent='Для решётки обязательны материал, два размера и тип исполнения. Бренд, артикул производителя, цвет и комплектация необязательны.';
    fieldsBox.innerHTML=
      dictInput('dictHwName','Номенклатурное наименование','Например: Решётка вентиляционная алюминиевая 245×60 мм')+
      `<div><label>Бренд / производитель <span class="mini">необязательно</span></label><input id="dictHwBrand" type="text" placeholder="Например: GTV" oninput="dictionaryRefreshSaveState()"></div>`+
      `<div><label>Артикул производителя <span class="mini">необязательно</span></label><input id="dictHwArticle" type="text" placeholder="Если известен" oninput="dictionaryRefreshSaveState()"></div>`+
      dictSelect('dictGrilleMaterial','Материал',['Алюминий','Металл','Другой'])+
      dictInput('dictGrilleSize1','Размер 1, мм','245','number','min="1" step="1"')+
      dictInput('dictGrilleSize2','Размер 2, мм','60','number','min="1" step="1"')+
      dictSelect('dictGrilleType','Тип исполнения',['Врезная','Накладная / обычная','Другое'])+
      `<div><label>Цвет / отделка <span class="mini">необязательно</span></label><input id="dictHwFinish" type="text" placeholder="Например: белая" oninput="dictionaryRefreshSaveState()"></div>`+
      `<div><label>Комплектация <span class="mini">необязательно</span></label><select id="dictGrillePackage" onchange="dictionaryRefreshSaveState()"><option value="">Не указано</option><option>1 шт.</option><option>Комплект</option></select></div>`+
      hardwareExtraBlock();
  }
  fieldsBox.insertAdjacentHTML('beforeend',dictionaryImageBlock());
  renderDictionaryImagePreview();
  renderExtraParams();
  dictionaryRefreshSaveState();
  editor.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function turnNeedsShaftLength(){
  return ['Сантехническая завертка / WC','Вертушка на шток цилиндра'].includes($('dictTurnType')?.value||'');
}
function cylinderNeedsThumbSide(){
  return $('dictCylinderExecution')?.value==='Ключ / вертушка';
}
function updateCylinderThumbSideVisibility(){
  $('dictCylinderThumbSideWrap')?.classList.toggle('hidden',!cylinderNeedsThumbSide());
}
function dictionaryHardwareReady(){
  if(!$('dictHwName')?.value.trim())return false;
  if(dictionaryEditorType!=='grille'&&![$('dictHwBrand'),$('dictHwArticle')].every(x=>x?.value.trim()))return false;
  if(!['threshold','opening','grille'].includes(dictionaryEditorType)&&!$('dictHwFinish')?.value.trim())return false;
  if(dictionaryEditorType==='lock')return !!($('dictLockType')?.value&&Number($('dictLockBackset')?.value)>0);
  if(dictionaryEditorType==='handle')return !!($('dictHwModel')?.value.trim()&&$('dictHandleType')?.value&&$('dictHandleBase')?.value);
  if(dictionaryEditorType==='hinge')return !!($('dictHwModel')?.value.trim()&&$('dictHingeType')?.value&&Number($('dictHingeMass')?.value)>0&&($('dictHinge36')?.checked||$('dictHinge42')?.checked||$('dictHinge59')?.checked));
  if(dictionaryEditorType==='turn')return !!($('dictHwModel')?.value.trim()&&$('dictTurnType')?.value&&$('dictTurnBase')?.value&&(!turnNeedsShaftLength()||Number($('dictTurnShaftLength')?.value)>0));
  if(dictionaryEditorType==='cylinder')return !!(
    $('dictHwModel')?.value.trim()&&
    $('dictCylinderExecution')?.value&&
    Number($('dictCylinderLength')?.value)>0&&
    Number($('dictCylinderSideA')?.value)>0&&
    Number($('dictCylinderSideB')?.value)>0&&
    ($('dictCylinder36')?.checked||$('dictCylinder42')?.checked||$('dictCylinder59')?.checked)&&
    (!cylinderNeedsThumbSide()||$('dictCylinderThumbSide')?.value)
  );
  if(dictionaryEditorType==='stop')return !!($('dictHwModel')?.value.trim()&&$('dictStopType')?.value&&$('dictStopMount')?.value);
  if(dictionaryEditorType==='threshold')return !!($('dictHwModel')?.value.trim()&&$('dictThresholdType')?.value&&Number($('dictThresholdLength')?.value)>0);
  if(dictionaryEditorType==='closer')return !!($('dictHwModel')?.value.trim()&&$('dictCloserType')?.value&&$('dictCloserHoldOpen')?.value);
  if(dictionaryEditorType==='opening')return !!($('dictHwModel')?.value.trim()&&$('dictOpeningType')?.value&&$('dictOpeningItemType')?.value);
  if(dictionaryEditorType==='grille')return !!($('dictGrilleMaterial')?.value&&Number($('dictGrilleSize1')?.value)>0&&Number($('dictGrilleSize2')?.value)>0&&$('dictGrilleType')?.value);
  return false;
}
function dictionaryRefreshSaveState(){
  updateCylinderThumbSideVisibility();
  const btn=$('dictionarySaveBtn'); if(!btn)return;
  const ready=dictionaryHardwareReady();
  const name=$('dictHwName')?.value?.trim()||'';
  const article=$('dictHwArticle')?.value?.trim()||'';
  const duplicate=(name||article)?findHardwareDuplicateCandidate({name,article}):null;
  btn.disabled=!ready||!!duplicate;

  const box=$('dictionaryEditorMessage');
  if(duplicate&&box){
    box.dataset.autoDuplicate='1';
    box.className='status err';
    box.innerHTML='<b>Автоконтроль дублей:</b> '+escapeHtml(hardwareDuplicateGuardMessage(duplicate));
  }else if(box?.dataset.autoDuplicate==='1'){
    delete box.dataset.autoDuplicate;
    box.className='status hidden';
    box.textContent='';
  }
}
function normalizedExtraParams(){
  return dictionaryExtraParams.map(x=>({name:(x.name||'').trim(),value:(x.value||'').trim()})).filter(x=>x.name&&x.value);
}
function customArticleExists(article){
  const a=normalizeHardwareArticle(article);
  return hardwareDictionaryTypes().some(type=>
    getCustomDictionaryItems(type).some(x=>normalizeHardwareArticle(x.article)===a)
  );
}
function saveHardwareDictionaryEntry(type){
  if(!catalogWriteAllowed())return;
  if(!hardwareDictionaryTypes().includes(type))return;
  if(!dictionaryHardwareReady()){dictionaryShowError('Заполните все обязательные поля.');return}
  const article=$('dictHwArticle').value.trim().toUpperCase();
  const duplicate=findHardwareDuplicateCandidate({name:$('dictHwName').value.trim(),article});
  if(duplicate){
    dictionaryShowError('Автоконтроль дублей: '+hardwareDuplicateGuardMessage(duplicate));
    return;
  }
  const item={
    sku:nextHardwareSku(),
    name:$('dictHwName').value.trim(),
    brand:$('dictHwBrand').value.trim(),
    article,
    finish:$('dictHwFinish').value.trim(),
    extra:normalizedExtraParams(),
    createdAt:new Date().toISOString()
  };
  if(type==='lock')Object.assign(item,{lockType:$('dictLockType').value,backset:Number($('dictLockBackset').value)});
  if(type==='handle')Object.assign(item,{model:$('dictHwModel').value.trim(),handleType:$('dictHandleType').value,baseShape:$('dictHandleBase').value});
  if(type==='hinge')Object.assign(item,{model:$('dictHwModel').value.trim(),hingeType:$('dictHingeType').value,maxMass:Number($('dictHingeMass').value),doorThickness:[36,42,59].filter(v=>$('dictHinge'+v)?.checked)});
  if(type==='turn')Object.assign(item,{model:$('dictHwModel').value.trim(),turnType:$('dictTurnType').value,shaftLength:Number($('dictTurnShaftLength')?.value)||null,baseShape:$('dictTurnBase').value});
  if(type==='cylinder')Object.assign(item,{
    model:$('dictHwModel').value.trim(),
    cylinderExecution:$('dictCylinderExecution').value,
    totalLength:Number($('dictCylinderLength').value),
    sideA:Number($('dictCylinderSideA').value),
    sideB:Number($('dictCylinderSideB').value),
    keyCount:$('dictCylinderKeyCount')?.value===''?null:Number($('dictCylinderKeyCount').value),
    doorThickness:[36,42,59].filter(v=>$('dictCylinder'+v)?.checked),
    thumbSide:cylinderNeedsThumbSide()?$('dictCylinderThumbSide').value:null
  });
  if(type==='stop')Object.assign(item,{
    model:$('dictHwModel').value.trim(),
    stopType:$('dictStopType').value,
    mountType:$('dictStopMount').value
  });
  if(type==='threshold')Object.assign(item,{
    model:$('dictHwModel').value.trim(),
    thresholdType:$('dictThresholdType').value,
    length:Number($('dictThresholdLength').value)
  });
  if(type==='closer')Object.assign(item,{
    model:$('dictHwModel').value.trim(),
    closerType:$('dictCloserType').value,
    enClass:$('dictCloserEn')?.value.trim()||null,
    maxMass:$('dictCloserMass')?.value===''?null:Number($('dictCloserMass').value),
    holdOpen:$('dictCloserHoldOpen').value
  });
  if(type==='opening')Object.assign(item,{
    model:$('dictHwModel').value.trim(),
    openingType:$('dictOpeningType').value,
    itemType:$('dictOpeningItemType').value,
    maxMass:$('dictOpeningMaxMass')?.value===''?null:Number($('dictOpeningMaxMass').value),
    minWidth:$('dictOpeningMinWidth')?.value===''?null:Number($('dictOpeningMinWidth').value),
    maxWidth:$('dictOpeningMaxWidth')?.value===''?null:Number($('dictOpeningMaxWidth').value),
    minHeight:$('dictOpeningMinHeight')?.value===''?null:Number($('dictOpeningMinHeight').value),
    maxHeight:$('dictOpeningMaxHeight')?.value===''?null:Number($('dictOpeningMaxHeight').value),
    direction:$('dictOpeningDirection')?.value||null
  });
  if(type==='grille')Object.assign(item,{
    material:$('dictGrilleMaterial').value,
    size1:Number($('dictGrilleSize1').value),
    size2:Number($('dictGrilleSize2').value),
    grilleType:$('dictGrilleType').value,
    packageType:$('dictGrillePackage')?.value||null
  });
  const vals=getCustomDictionaryItems(type);
  vals.push({...item,imageAttached:!!dictionaryPendingImageData,imageName:dictionaryPendingImageName||''});
  saveCustomDictionaryItems(type,vals);
  if(dictionaryPendingImageData)saveHardwareUserImage(hardwareCategoryForDictionaryType(type),item.name,dictionaryPendingImageData,dictionaryPendingImageName,false);
  renderDictionaries();
  openDictionaryEditor(type);
  dictionaryShowSuccess('Добавлено: '+item.sku+' · '+item.name+' · '+item.article+(item.extra.length?' · доп. параметров: '+item.extra.length:''));
}

function dictionaryAddRal(){
  if(!catalogWriteAllowed())return;
  const raw=prompt('Введите RAL, например RAL 1013:'); if(!raw)return;
  const norm=raw.trim().toUpperCase().startsWith('RAL ')?raw.trim().toUpperCase():'RAL '+raw.trim().toUpperCase().replace('RAL','').trim();
  const vals=getRals();
  if(vals.some(x=>String(x).toUpperCase()===norm)){
    alert('Автоконтроль дублей: '+norm+' уже есть. Повтор не добавлен.');
    return;
  }
  vals.push(norm);setStore('hd_v4_rals',vals);
  renderDictionaries(); renderForm();
}
function filmValuesByScope(scope){
  return scope==='36'?getFilms36():getFilmsGeneral();
}
function filmStoreKeyByScope(scope){
  return scope==='36'?'hd_v4_films36':'hd_v4_films_general';
}
function filmDuplicateCandidate(scope,name,article){
  const nn=normalizeHardwareName(name);
  const aa=normalizeHardwareArticle(article);
  for(const existing of filmValuesByScope(scope)){
    const text=String(existing||'');
    const parts=text.split('—');
    const existingName=parts.length>1?parts.slice(0,-1).join('—').trim():text.trim();
    const existingArticle=parts.length>1?parts[parts.length-1].trim():'';
    if(aa&&normalizeHardwareArticle(existingArticle)===aa)return existing;
    if(nn&&aa&&normalizeHardwareName(existingName)===nn&&normalizeHardwareArticle(existingArticle)===aa)return existing;
  }
  return '';
}
function dictionaryAddFilm(scope='general'){
  if(!catalogWriteAllowed())return;
  const label=scope==='36'?'каталог 36 мм':'основной каталог';
  const name=prompt('Название плёнки · '+label+':');if(!name)return;
  const article=prompt('Артикул плёнки:');if(!article)return;
  const cleanName=name.trim(),cleanArticle=article.trim().toUpperCase();
  const duplicate=filmDuplicateCandidate(scope,cleanName,cleanArticle);
  if(duplicate){
    alert('Автоконтроль дублей: такая ПВХ-плёнка уже есть в выбранном каталоге. Повтор не добавлен.\n\n'+duplicate);
    return;
  }
  const item=`${cleanName} — ${cleanArticle}`;
  const key=filmStoreKeyByScope(scope);
  const vals=getStore(key,[]);
  vals.push(item);setStore(key,vals);
  renderDictionaries(); renderForm();
}


// --- dictionary-import.js ---
// v33: client-side import assistant. Source data is reviewed before saving.
let nomenclatureImportFile=null;
let nomenclatureImportRows=[];
let nomenclatureImportBusy=false;
let nomenclatureImportSourceLabel='Ручной ввод';

const IMPORT_CATEGORY_OPTIONS=[
  ['film36','ПВХ-плёнки 36'],
  ['filmGeneral','ПВХ-плёнки — общие'],
  ['ral','RAL'],
  ['hinge','Петли'],
  ['lock','Замки'],
  ['handle','Ручки'],
  ['turn','Завертки'],
  ['cylinder','Цилиндры'],
  ['stop','Стопоры'],
  ['threshold','Автоматические пороги'],
  ['closer','Доводчики'],
  ['opening','Системы открывания'],
  ['grille','Вентиляционные решётки'],
  ['unknown','Не определено']
];

function importCategoryLabel(key){return IMPORT_CATEGORY_OPTIONS.find(x=>x[0]===key)?.[1]||key}
function importCategoryOptions(selected){
  return IMPORT_CATEGORY_OPTIONS.map(([v,n])=>'<option value="'+v+'" '+(v===selected?'selected':'')+'>'+escapeHtml(n)+'</option>').join('');
}
function openNomenclatureImport(){
  if(!catalogWriteAllowed()){alert('Импорт номенклатуры доступен ролям «Снабжение» и «Администратор».');return}
  resetNomenclatureImport();
  nomenclatureImportSourceLabel='Файл';
  $('nomenclatureImportModal')?.classList.remove('hidden');
  document.body.style.overflow='hidden';
}
function openNomenclatureTextImport(){
  if(!catalogWriteAllowed()){alert('Импорт номенклатуры доступен ролям «Снабжение» и «Администратор».');return}
  resetNomenclatureImport();
  nomenclatureImportSourceLabel='Вставленная строка';
  $('nomenclatureImportModal')?.classList.remove('hidden');
  document.body.style.overflow='hidden';
  $('importExtractedWrap')?.classList.remove('hidden');
  $('importProgressWrap')?.classList.add('hidden');
  const area=$('importExtractedText');
  if(area){
    area.placeholder='Вставьте длинное наименование. Можно вставить несколько позиций — по одной на строку.';
    area.focus();
  }
}
function closeNomenclatureImport(){
  $('nomenclatureImportModal')?.classList.add('hidden');
  document.body.style.overflow='';
}
function resetNomenclatureImport(){
  nomenclatureImportFile=null;nomenclatureImportRows=[];nomenclatureImportBusy=false;nomenclatureImportSourceLabel='Ручной ввод';
  if($('nomenclatureImportFile'))$('nomenclatureImportFile').value='';
  if($('importFileName'))$('importFileName').textContent='';
  if($('importExtractedText'))$('importExtractedText').value='';
  $('importExtractedWrap')?.classList.add('hidden');
  $('importProgressWrap')?.classList.add('hidden');
  $('importMatchStage')?.classList.add('hidden');
  $('importFileStage')?.classList.remove('hidden');
  setImportStep(1);
  const msg=$('importApplyMessage');if(msg){msg.className='status hidden';msg.textContent=''}
}
function setImportStep(step){
  [1,2,3].forEach(n=>$('importStep'+n)?.classList.toggle('active',n===step));
}
function setImportProgress(pct,text){
  $('importProgressWrap')?.classList.remove('hidden');
  if($('importProgressBar'))$('importProgressBar').style.width=Math.max(0,Math.min(100,pct))+'%';
  if($('importProgressText'))$('importProgressText').textContent=text||'';
}
async function loadExternalScript(src,test){
  if(test?.())return;
  await new Promise((resolve,reject)=>{
    const existing=[...document.scripts].find(x=>x.src===src);
    if(existing){existing.addEventListener('load',resolve,{once:true});existing.addEventListener('error',reject,{once:true});return}
    const el=document.createElement('script');el.src=src;el.async=true;el.onload=resolve;el.onerror=()=>reject(new Error('Не удалось загрузить библиотеку: '+src));document.head.appendChild(el);
  });
}
async function handleNomenclatureImportFile(file){
  if(!file||nomenclatureImportBusy)return;
  nomenclatureImportFile=file;
  nomenclatureImportSourceLabel=file.name||'Файл';
  $('importFileName').textContent=file.name+' · '+Math.max(1,Math.round(file.size/1024))+' КБ';
  nomenclatureImportBusy=true;
  try{
    setImportProgress(8,'Читаю файл…');
    const text=await extractTextFromImportFile(file);
    $('importExtractedText').value=(text||'').trim();
    $('importExtractedWrap')?.classList.remove('hidden');
    setImportProgress(100,text?.trim()?'Файл распознан. Проверьте текст и запустите сопоставление.':'Текст не найден. Можно вставить/исправить его вручную.');
  }catch(err){
    console.error(err);
    $('importExtractedWrap')?.classList.remove('hidden');
    $('importExtractedText').value='';
    setImportProgress(100,'Автораспознавание не удалось. Вставьте текст вручную и продолжите сопоставление.');
  }finally{nomenclatureImportBusy=false}
}
async function extractTextFromImportFile(file){
  const name=(file.name||'').toLowerCase();
  const type=(file.type||'').toLowerCase();
  if(type.startsWith('text/')||/\.(txt|csv|json)$/i.test(name)){
    setImportProgress(35,'Читаю текст…');return await file.text();
  }
  if(/\.(xlsx|xls)$/i.test(name)){
    setImportProgress(20,'Подключаю чтение Excel…');
    await loadExternalScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',()=>!!window.XLSX);
    setImportProgress(45,'Читаю листы Excel…');
    const wb=XLSX.read(await file.arrayBuffer(),{type:'array'});
    return wb.SheetNames.map(sn=>'['+sn+']\n'+XLSX.utils.sheet_to_csv(wb.Sheets[sn],{FS:'\t'})).join('\n');
  }
  if(type==='application/pdf'||name.endsWith('.pdf')){
    setImportProgress(20,'Подключаю чтение PDF…');
    await loadExternalScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',()=>!!window.pdfjsLib);
    pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const pdf=await pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;
    let out='';
    for(let p=1;p<=pdf.numPages;p++){
      setImportProgress(20+Math.round(55*p/pdf.numPages),'Читаю PDF: страница '+p+' из '+pdf.numPages);
      const page=await pdf.getPage(p);const content=await page.getTextContent();
      out+=content.items.map(x=>x.str).join(' ')+'\n';
    }
    if(out.replace(/\s/g,'').length<40){
      setImportProgress(78,'PDF похож на скан. Запускаю OCR первой страницы…');
      const page=await pdf.getPage(1);const viewport=page.getViewport({scale:1.8});
      const canvas=document.createElement('canvas');canvas.width=viewport.width;canvas.height=viewport.height;
      await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
      out+='\n'+await ocrCanvas(canvas);
    }
    return out;
  }
  if(type.startsWith('image/')||/\.(png|jpe?g|webp|bmp)$/i.test(name)){
    setImportProgress(20,'Подготавливаю OCR изображения…');
    return await ocrImageFile(file);
  }
  throw new Error('Формат пока не поддерживается автоматически');
}
async function ensureTesseract(){
  await loadExternalScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js',()=>!!window.Tesseract);
}
async function ocrImageFile(file){
  await ensureTesseract();
  setImportProgress(35,'OCR: распознаю изображение…');
  const result=await Tesseract.recognize(file,'rus+eng',{logger:m=>{
    if(m.status==='recognizing text')setImportProgress(35+Math.round((m.progress||0)*55),'OCR: '+Math.round((m.progress||0)*100)+'%');
  }});
  return result.data?.text||'';
}
async function ocrCanvas(canvas){
  await ensureTesseract();
  const result=await Tesseract.recognize(canvas,'rus+eng',{logger:m=>{
    if(m.status==='recognizing text')setImportProgress(78+Math.round((m.progress||0)*18),'OCR скана: '+Math.round((m.progress||0)*100)+'%');
  }});
  return result.data?.text||'';
}
function normalizeImportLine(line){
  return String(line||'').replace(/[|;]+/g,' ').replace(/\s{2,}/g,' ').trim();
}
function guessImportCategory(line){
  const s=line.toLowerCase();
  if(/\bral\s*[- ]?\d{3,4}\b/i.test(line))return 'ral';
  if(/\b(tf|ag)\s*[\d]/i.test(line)&&/(эмалит|шагрень|холст|бетон|лофт|дюна|ясень|орех|дуб|астана|ларче|grey|beige|white|плен|плён)/i.test(line))return 'film36';
  if(/петл|hinge|kubica|krona koblenz/i.test(line))return 'hinge';
  if(/замок|lock|магнитн.*защел|защёл/i.test(line))return 'lock';
  if(/ручк|handle|lever/i.test(line))return 'handle';
  if(/заверт|wc[- ]?bolt|вертуш|thumbturn/i.test(line))return 'turn';
  if(/цилиндр|cylinder|ключ\/верт|ключ\/ключ/i.test(line))return 'cylinder';
  if(/стопор|ограничител|door stop|fantom/i.test(line))return 'stop';
  if(/автоматическ.*порог|выпадающ.*порог|threshold/i.test(line))return 'threshold';
  if(/доводчик|closer|geze ts|dcs-/i.test(line))return 'closer';
  if(/систем.*открыван|раздвижн|пенал|кассет|hidden\/(40|80)|invisible-2|pivot|roto|twice/i.test(line))return 'opening';
  if(/реш[её]тк.*вент|вентиляцион.*реш/i.test(line))return 'grille';
  return 'unknown';
}
function extractImportArticle(line,category){
  if(category==='ral'){const m=line.match(/\bRAL\s*[- ]?(\d{3,4})\b/i);return m?'RAL '+m[1]:''}
  if(category.startsWith('film')){
    const m=line.match(/\b(?:TF|AG)\s*[A-Z0-9][A-Z0-9 .\-\/]*\d\b/i);
    return m?m[0].replace(/\s+/g,' ').trim().toUpperCase():'';
  }
  const patterns=[
    /\b[A-ZА-Я]{1,16}[A-ZА-Я0-9]*[.\/-][A-ZА-Я0-9][A-ZА-Я0-9._\/-]{1,}\b/i,
    /\b[A-ZА-Я]{1,16}\d[A-ZА-Я0-9._\/-]{2,}\b/i
  ];
  for(const re of patterns){const m=line.match(re);if(m)return m[0].toUpperCase()}
  return '';
}
function extractImportBrand(line){
  const known=['Armadillo','Morelli','FUARO','Puerto','Punto','Rucetti','Vantage','Pallini','AGB','Krona Koblenz','Kubica','GEZE','FANTOM','GTV','NOTEDO','VETTORE','НОРА-М'];
  const l=line.toLowerCase();
  return known.find(x=>l.includes(x.toLowerCase()))||'';
}
function importNameFromLine(line,article){
  let name=normalizeImportLine(line);
  if(article && name.toUpperCase().endsWith(article.toUpperCase()))name=name.slice(0,-article.length).trim().replace(/[—–,-]+$/,'').trim();
  return name;
}

function extractImportModel(line,brand='',article=''){
  const s=String(line||'');
  const candidates=s.match(/\b(?=[A-ZА-Я0-9._\/-]*\d)[A-ZА-Я][A-ZА-Я0-9._\/-]{2,}\b/gi)||[];
  const picked=candidates.find(x=>{
    const u=x.toUpperCase();
    return u!=='RAL'&&u!=='EN'&&!/^\d+$/.test(x)&&!/^\d+[XХ×]\d+$/i.test(x)&&!/^[XХ×]\d+$/i.test(x);
  });
  if(picked)return picked.trim();
  if(article)return String(article).trim().split(/\s+/)[0]||'';
  return '';
}
function extractImportFinish(line){
  const direct=String(line||'').match(/(?:цвет|отделк[аи]|покрыти[ея])\s*[-:–—]?\s*([^,;()]{2,60})/i);
  if(direct)return direct[1].trim().replace(/[.]+$/,'');
  const finishes=[
    'сатинированное золото','флорентийское золото','итальянский тисненый','матовое золото',
    'матовый никель','вороненый никель','сатинированный хром','матовый хром',
    'нержавеющая сталь','черный матовый','чёрный матовый','белый','белая','серебристый',
    'алюминий','графит','антрацит','бронза','хром','черный','чёрный','золото'
  ];
  const low=String(line||'').toLowerCase();
  return finishes.find(x=>low.includes(x.toLowerCase()))||'';
}
function importMassKg(line){
  const m=String(line||'').match(/(?:до\s*|max(?:имальн\w*)?\s*)?(\d{2,3})\s*кг(?=\s|[,.;)]|$)/i);
  return m?Number(m[1]):null;
}
function importDoorThicknesses(line){
  const out=[];
  for(const m of String(line||'').matchAll(/\b(36|42|59)\s*мм(?=\s|[,.;)]|$)/gi)){
    const v=Number(m[1]);if(!out.includes(v))out.push(v);
  }
  return out;
}
function importBaseShape(line){
  const s=String(line||'').toLowerCase();
  if(/квадратн/.test(s))return 'Квадратная';
  if(/кругл/.test(s))return 'Круглая';
  if(/прямоугольн/.test(s))return 'Прямоугольная';
  return '';
}
function parseImportCharacteristics(line,category){
  const s=String(line||''),low=s.toLowerCase(),c={extra:[]};
  const add=(name,value)=>{if(value!==null&&value!==undefined&&String(value).trim()!=='')c.extra.push({name,value:String(value)})};
  const mass=importMassKg(s);
  const thickness=importDoorThicknesses(s);
  const size=s.match(/\b(\d{2,4})\s*[xх×]\s*(\d{1,4})(?:\s*[xх×]\s*(\d{1,4}))?\s*(?:мм)?\b/i);
  if(size)add('Размер',size.slice(1).filter(Boolean).join('×')+' мм');

  if(category==='lock'){
    c.lockType=/магнит/.test(low)?'Магнитный':/цилиндр/.test(low)?'Под цилиндр':/\bwc\b|сантех/.test(low)?'WC':/защ[её]л/.test(low)?'Защёлка':/механ/.test(low)?'Механический':'Другой';
    const m=s.match(/(?:backset|дорнмасс|дорн)\D{0,12}(\d{2,3})\s*(?:мм)?/i);c.backset=m?Number(m[1]):null;
  }
  if(category==='handle'){
    c.handleType=/раздвиж|откатн/.test(low)?'Для раздвижной двери':/кноб|knob/.test(low)?'Кноб':/ручк/.test(low)?'На розетке':'Другая';
    c.baseShape=importBaseShape(s)||'Специальная';
  }
  if(category==='hinge'){
    c.hingeType=/скрыт|invisible|kubica|krona/.test(low)?'Скрытая':/карточн/.test(low)?'Карточная':'Другая';
    c.maxMass=mass;c.doorThickness=thickness;
  }
  if(category==='turn'){
    c.turnType=/накладк.*цилиндр/.test(low)?'Накладка под цилиндр':/вставк.*шток/.test(low)?'Вставка под шток цилиндра':/вертуш.*шток/.test(low)?'Вертушка на шток цилиндра':/\bwc\b|заверт|сантех/.test(low)?'Сантехническая завертка / WC':'Другое';
    const m=s.match(/(?:квадрат|шток|ось)[^\d]{0,16}(\d{2,3})\s*мм/i);c.shaftLength=m?Number(m[1]):null;
    c.baseShape=importBaseShape(s)||'Не применяется';
  }
  if(category==='cylinder'){
    c.cylinderExecution=/ключ\s*[\/+-]\s*верт|ключ.*вертуш/.test(low)?'Ключ / вертушка':/ключ\s*[\/+-]\s*ключ/.test(low)?'Ключ / ключ':'Другое';
    const ab=s.match(/\b(\d{2,3})\s*[\/xх×+]\s*(\d{2,3})\b/);
    if(ab){c.sideA=Number(ab[1]);c.sideB=Number(ab[2]);c.totalLength=c.sideA+c.sideB}
    else {const lm=s.match(/(?:длина|цилиндр)[^\d]{0,16}(\d{2,3})\s*мм/i);c.totalLength=lm?Number(lm[1]):null;c.sideA=null;c.sideB=null}
    const keys=s.match(/(\d{1,2})\s*ключ/i);c.keyCount=keys?Number(keys[1]):null;
    c.doorThickness=thickness;
    c.thumbSide=/вертушк.*сторон[ае]\s*a/i.test(low)?'Сторона A':/вертушк.*сторон[ае]\s*b/i.test(low)?'Сторона B':c.cylinderExecution==='Ключ / вертушка'?'Неважно':null;
  }
  if(category==='stop'){
    c.stopType=/скрыт.*магнит/.test(low)?'Скрытый магнитный стопор':/напольн/.test(low)?'Напольный упор / ограничитель':/магнит/.test(low)?'Магнитный стопор':/ограничител/.test(low)?'Дверной ограничитель':'Другой';
    c.mountType=/скрыт/.test(low)?'Скрытый':/напольн/.test(low)?'Напольный':/клеев/.test(low)?'На клеевой основе':/наклад/.test(low)?'Накладной':'Другой';
  }
  if(category==='threshold'){
    c.thresholdType=/автомат|выпадающ/.test(low)?'Автоматический выпадающий порог':'Другой';
    const m=s.match(/(?:длина|\bL\b)[^\d]{0,12}(\d{3,4})\s*(?:мм)?/i)||s.match(/\b(?:F\/)?(\d{3,4})\b/);c.length=m?Number(m[1]):null;
  }
  if(category==='closer'){
    c.closerType=/скрыт|врезн/.test(low)?'Скрытый / врезной':/скользящ/.test(low)?'Со скользящей тягой':/доводчик/.test(low)?'Накладной':'Другой';
    const en=s.match(/\bEN\s*\d+(?:\s*[-–—]\s*\d+)?\b/i);c.enClass=en?en[0].replace(/\s+/g,''):'';
    c.maxMass=mass;c.holdOpen=/без\s*фиксац/.test(low)?'Нет':/фиксац/.test(low)?'Есть':'Не указано';
  }
  if(category==='opening'){
    c.openingType=/пенал|кассет/.test(low)?'Пенал / кассета':/книжк/.test(low)?'Книжка':/рото|roto/.test(low)?'Рото':/pivot/.test(low)?'Pivot':/twice/.test(low)?'Twice':/телескоп/.test(low)?'Телескопическая':/синхрон/.test(low)?'Синхронная':/раздвиж|откатн|hidden\/|invisible-2/.test(low)?'Раздвижная':'Другое';
    c.itemType=/направляющ/.test(low)?'Направляющая':/ролик|механизм/.test(low)?'Ролики / механизм':/толкател/.test(low)?'Толкатель':/обрамлен/.test(low)?'Обрамление':/пенал|кассет/.test(low)?'Пенал':/систем|комплект|hidden\/|invisible-2/.test(low)?'Полная система / комплект':'Другой компонент';
    c.maxMass=mass;
    const wr=s.match(/ширин\w*[^\d]{0,15}(\d{3,4})\s*(?:[-–—]|до)\s*(\d{3,4})/i);if(wr){c.minWidth=Number(wr[1]);c.maxWidth=Number(wr[2])}
    const hr=s.match(/высот\w*[^\d]{0,15}(\d{3,4})\s*(?:[-–—]|до)\s*(\d{3,4})/i);if(hr){c.minHeight=Number(hr[1]);c.maxHeight=Number(hr[2])}
    c.direction=/лев/.test(low)?'Левая':/прав/.test(low)?'Правая':/универс|неваж/.test(low)?'Универсальная / неважно':null;
  }
  if(category==='grille'){
    c.material=/алюмин/.test(low)?'Алюминий':/металл|сталь/.test(low)?'Металл':'Другой';
    if(size){c.size1=Number(size[1]);c.size2=Number(size[2])}
    c.grilleType=/врезн/.test(low)?'Врезная':/наклад|реш[её]тк/.test(low)?'Накладная / обычная':'Другое';
    c.packageType=/комплект/.test(low)?'Комплект':/1\s*шт/.test(low)?'1 шт.':null;
  }
  if(mass&&!['hinge','closer','opening'].includes(category))add('Максимальная масса',mass+' кг');
  if(thickness.length&&!['hinge','cylinder'].includes(category))add('Толщина двери',thickness.join(', ')+' мм');
  return c;
}
function importCharacteristicsText(c){
  if(!c)return '';
  const p=[];
  const put=(name,value,unit='')=>{if(value!==null&&value!==undefined&&value!==''&&!(Array.isArray(value)&&!value.length))p.push(name+': '+(Array.isArray(value)?value.join(', '):value)+unit)};
  put('Тип замка',c.lockType);put('Backset',c.backset,' мм');
  put('Тип ручки',c.handleType);put('Основание',c.baseShape);
  put('Тип петли',c.hingeType);put('Макс. масса',c.maxMass,' кг');if(c.doorThickness?.length)put('Толщина двери',c.doorThickness,' мм');
  put('Тип завертки',c.turnType);put('Шток / квадрат',c.shaftLength,' мм');
  put('Исполнение цилиндра',c.cylinderExecution);put('Длина цилиндра',c.totalLength,' мм');put('A',c.sideA,' мм');put('B',c.sideB,' мм');put('Ключей',c.keyCount);put('Сторона вертушки',c.thumbSide);
  put('Тип стопора',c.stopType);put('Монтаж',c.mountType);
  put('Тип порога',c.thresholdType);put('Длина',c.length,' мм');
  put('Тип доводчика',c.closerType);put('EN',c.enClass);put('Фиксация',c.holdOpen);
  put('Тип открывания',c.openingType);put('Тип позиции',c.itemType);put('Ширина min',c.minWidth,' мм');put('Ширина max',c.maxWidth,' мм');put('Высота min',c.minHeight,' мм');put('Высота max',c.maxHeight,' мм');put('Направление',c.direction);
  put('Материал',c.material);put('Размер 1',c.size1,' мм');put('Размер 2',c.size2,' мм');put('Тип решётки',c.grilleType);put('Комплектация',c.packageType);
  (c.extra||[]).forEach(x=>put(x.name,x.value));
  return [...new Set(p)].join('; ');
}
function existingImportMatch(row){
  const art=(row.article||'').trim().toUpperCase();
  if(row.category==='ral')return getRals().some(x=>x.toUpperCase()===(row.article||row.name).toUpperCase());
  if(row.category==='film36'||row.category==='filmGeneral'){
    const films=row.category==='film36'?getFilms36():getFilmsGeneral();
    return films.some(x=>art&&x.toUpperCase().includes(art))||films.some(x=>x.toLowerCase()===((row.name||'')+' — '+(row.article||'')).toLowerCase());
  }
  if(['hinge','lock','handle','turn','cylinder','stop','threshold','closer','opening','grille'].includes(row.category)){
    const hit=findHardwareDuplicateCandidate({name:row.name,article:row.article});
    return hit?.kind==='hard';
  }
  return false;
}
function importHardwareDuplicateCandidate(row){
  if(!['hinge','lock','handle','turn','cylinder','stop','threshold','closer','opening','grille'].includes(row.category))return null;
  return findHardwareDuplicateCandidate({name:row.name,article:row.article});
}
function priorImportBatchDuplicate(row){
  if(!row?.checked)return null;
  const idx=nomenclatureImportRows.indexOf(row);if(idx<=0)return null;
  const aa=normalizeHardwareArticle(row.article),nn=normalizeHardwareName(row.name);
  for(let i=0;i<idx;i++){
    const prev=nomenclatureImportRows[i];
    if(!prev?.checked)continue;
    if(!['hinge','lock','handle','turn','cylinder','stop','threshold','closer','opening','grille'].includes(prev.category))continue;
    if(aa&&normalizeHardwareArticle(prev.article)===aa)return {reason:'Дубль артикула внутри загружаемого файла',row:prev};
    if(nn&&normalizeHardwareName(prev.name)===nn)return {reason:'Дубль наименования внутри загружаемого файла',row:prev};
  }
  return null;
}
function validateImportRow(row){
  if(!row.checked)return {status:'skip',message:'Исключено'};
  if(row.category==='unknown')return {status:'review',message:'Выберите справочник'};
  if(row.category==='ral'){
    const raw=row.article||row.name||'';
    if(!/\bRAL\s*\d{3,4}\b/i.test(raw))return {status:'review',message:'Уточните RAL'};
  }else if(row.category==='film36'||row.category==='filmGeneral'){
    if(!row.name.trim())return {status:'review',message:'Нет названия'};
    if(!row.article.trim())return {status:'review',message:'Нет артикула'};
  }else{
    if(!row.name.trim())return {status:'review',message:'Нет наименования'};
    if(row.category!=='grille'&&!row.article.trim())return {status:'review',message:'Нет артикула'};
  }
  const batchDup=priorImportBatchDuplicate(row);
  if(batchDup)return {status:'exists',message:'Дубль в этом импорте — не добавляется'};
  const hwDup=importHardwareDuplicateCandidate(row);
  if(hwDup)return {status:'exists',message:'Уже есть — не добавляется · '+hardwareDuplicateExistingLabel(hwDup)};
  if(existingImportMatch(row))return {status:'exists',message:'Уже есть — не добавляется'};
  return {status:'ready',message:'Готово'};
}
function buildNomenclatureImportProposals(){
  const text=$('importExtractedText')?.value||'';
  let lines=text.split(/\r?\n/).map(normalizeImportLine).filter(x=>x.length>=3);
  const seen=new Set();lines=lines.filter(x=>{const k=x.toLowerCase();if(seen.has(k))return false;seen.add(k);return true});
  nomenclatureImportRows=lines.slice(0,500).map((line,i)=>{
    const category=guessImportCategory(line),article=extractImportArticle(line,category),brand=extractImportBrand(line);
    const model=extractImportModel(line,brand,article),finish=extractImportFinish(line);
    const characteristics=parseImportCharacteristics(line,category);
    return {
      id:i+1,checked:true,source:line,category,
      name:category==='ral'?(article||line):importNameFromLine(line,article),
      brand,article,model,finish,characteristics,
      characteristicsText:importCharacteristicsText(characteristics),
      status:'review',message:''
    };
  });
  if(!nomenclatureImportRows.length){
    nomenclatureImportRows=[{id:1,checked:true,source:'',category:'unknown',name:'',brand:'',article:'',model:'',finish:'',characteristics:{extra:[]},characteristicsText:'',status:'review',message:'Добавьте позицию вручную'}];
  }
  $('importFileStage')?.classList.add('hidden');$('importMatchStage')?.classList.remove('hidden');setImportStep(2);
  refreshImportRows();
}
function refreshImportRows(){
  nomenclatureImportRows.forEach(r=>Object.assign(r,validateImportRow(r)));
  const body=$('importProposalBody');if(!body)return;
  body.innerHTML=nomenclatureImportRows.map((r,i)=>'<tr>'+
    '<td><input type="checkbox" '+(r.checked?'checked':'')+' '+(r.status==='exists'?'disabled title="Дубль: автоматически исключён из добавления"':'')+' onchange="updateImportRow('+i+',\'checked\',this.checked)"></td>'+
    '<td><select onchange="updateImportRow('+i+',\'category\',this.value)">'+importCategoryOptions(r.category)+'</select></td>'+
    '<td><input value="'+escapeHtml(r.name)+'" title="'+escapeHtml(r.source)+'" oninput="updateImportRow('+i+',\'name\',this.value)"></td>'+
    '<td><input value="'+escapeHtml(r.brand)+'" oninput="updateImportRow('+i+',\'brand\',this.value)"></td>'+
    '<td><input value="'+escapeHtml(r.article)+'" oninput="updateImportRow('+i+',\'article\',this.value)"></td>'+
    '<td><input value="'+escapeHtml(r.model)+'" oninput="updateImportRow('+i+',\'model\',this.value)"></td>'+
    '<td><input value="'+escapeHtml(r.finish)+'" oninput="updateImportRow('+i+',\'finish\',this.value)"></td>'+
    '<td><textarea class="import-char-input" onchange="updateImportCharacteristicsText('+i+',this.value)">'+escapeHtml(r.characteristicsText||'')+'</textarea></td>'+
    '<td><div class="import-image-actions"><label class="import-image-pick '+(r.imageData?'has-image':'')+'">'+(r.imageData?'Фото ✓':'Загрузить')+'<input type="file" class="hidden" accept="image/png,image/jpeg,image/webp" onchange="handleImportRowImage('+i+',this.files?.[0])"></label><button class="import-image-search" type="button" onclick="openImportRowImageSearch('+i+')">Найти</button></div>'+(r.imageName?'<div class="mini import-image-name">'+escapeHtml(r.imageName)+'</div>':'')+'</td>'+
    '<td><span class="import-status '+r.status+'">'+escapeHtml(r.message)+'</span></td>'+
  '</tr>').join('');
  const active=nomenclatureImportRows.filter(r=>r.checked);
  const ready=active.filter(r=>r.status==='ready').length,exists=active.filter(r=>r.status==='exists').length,review=active.filter(r=>r.status==='review').length;
  $('importSummary').innerHTML=
    '<div class="import-stat"><span class="mini">Найдено строк</span><b>'+nomenclatureImportRows.length+'</b></div>'+
    '<div class="import-stat"><span class="mini">Готово добавить</span><b>'+ready+'</b></div>'+
    '<div class="import-stat"><span class="mini">Уже есть</span><b>'+exists+'</b></div>'+
    '<div class="import-stat"><span class="mini">Нужно уточнить</span><b>'+review+'</b></div>';
  $('importQuestions').innerHTML=
    (exists?'<div class="status info" style="margin-bottom:8px"><b>Автоконтроль дублей:</b> '+exists+' поз. уже есть в номенклатуре и не будут добавлены повторно.</div>':'')+
    (review?'<div class="import-question"><b>Нужно уточнение.</b> Проверьте строки со статусом «Нужно уточнить»: выберите правильный справочник, заполните полный артикул и проверьте автоматически распознанные характеристики. Можно снять галочку, чтобы не импортировать позицию.</div>':'');
  const btn=$('applyNomenclatureImportBtn');if(btn)btn.disabled=review>0||ready===0;
  if(review===0)setImportStep(3);else setImportStep(2);
}
async function handleImportRowImage(i,file){
  if(!catalogWriteAllowed()||!nomenclatureImportRows[i]||!file)return;
  try{nomenclatureImportRows[i].imageData=await compressCatalogImageFile(file);nomenclatureImportRows[i].imageName=file.name||'Фото';refreshImportRows()}
  catch(err){alert(err?.message||'Не удалось загрузить фото.')}
}
function openImportRowImageSearch(i){
  if(!catalogWriteAllowed()||!nomenclatureImportRows[i])return;
  const row=nomenclatureImportRows[i];
  const query=catalogImageSearchQuery([row.brand,row.article,row.model,row.name,'фото товара']);
  openCatalogImageSearch({
    mode:'import',
    index:i,
    label:row.name||'Импортируемая позиция',
    query
  });
}
function updateImportRow(i,key,value){
  if(!nomenclatureImportRows[i])return;
  nomenclatureImportRows[i][key]=value;
  if(key==='category'){
    const row=nomenclatureImportRows[i];
    if(row.category==='ral'&&!row.article){row.article=extractImportArticle(row.source,'ral')||row.name}
    row.characteristics=parseImportCharacteristics(row.source,row.category);
    row.characteristicsText=importCharacteristicsText(row.characteristics);
  }
  refreshImportRows();
}
function updateImportCharacteristicsText(i,value){
  if(!nomenclatureImportRows[i])return;
  nomenclatureImportRows[i].characteristicsText=value;
}
function removeUncheckedImportRows(){nomenclatureImportRows=nomenclatureImportRows.filter(x=>x.checked);refreshImportRows()}
function backToImportFile(){$('importMatchStage')?.classList.add('hidden');$('importFileStage')?.classList.remove('hidden');setImportStep(1)}
function pushUniqueFilm(key,row){
  const item=row.name.trim()+' — '+row.article.trim().toUpperCase();
  const vals=getStore(key,[]);
  const films=key==='hd_v4_films36'?getFilms36():getFilmsGeneral();
  if(!films.some(x=>x.toUpperCase()===item.toUpperCase())){vals.push(item);setStore(key,vals);return true}
  return false;
}
function importedHardwareItem(row){
  const c=row.characteristics||{};
  const extra=[
    {name:'Источник импорта',value:nomenclatureImportSourceLabel||nomenclatureImportFile?.name||'Ручной импорт'},
    {name:'Исходная строка',value:row.source||row.name},
    ...(c.extra||[])
  ];
  if(row.characteristicsText)extra.push({name:'Распознанные характеристики',value:row.characteristicsText});
  const item={
    sku:nextHardwareSku(),name:row.name.trim(),brand:row.brand.trim(),article:row.article.trim().toUpperCase(),
    model:(row.model||row.article||'').trim(),finish:row.finish.trim(),extra,
    imageAttached:!!row.imageData,imageName:row.imageName||'',
    importedAt:new Date().toISOString()
  };
  if(row.category==='lock')Object.assign(item,{lockType:c.lockType||'Другой',backset:c.backset||null});
  if(row.category==='handle')Object.assign(item,{handleType:c.handleType||'Другая',baseShape:c.baseShape||'Специальная'});
  if(row.category==='hinge')Object.assign(item,{hingeType:c.hingeType||'Другая',maxMass:c.maxMass||null,doorThickness:c.doorThickness||[]});
  if(row.category==='turn')Object.assign(item,{turnType:c.turnType||'Другое',shaftLength:c.shaftLength||null,baseShape:c.baseShape||'Не применяется'});
  if(row.category==='cylinder')Object.assign(item,{
    cylinderExecution:c.cylinderExecution||'Другое',totalLength:c.totalLength||null,sideA:c.sideA||null,sideB:c.sideB||null,
    keyCount:c.keyCount??null,doorThickness:c.doorThickness||[],thumbSide:c.thumbSide||null
  });
  if(row.category==='stop')Object.assign(item,{stopType:c.stopType||'Другой',mountType:c.mountType||'Другой'});
  if(row.category==='threshold')Object.assign(item,{thresholdType:c.thresholdType||'Другой',length:c.length||null});
  if(row.category==='closer')Object.assign(item,{closerType:c.closerType||'Другой',enClass:c.enClass||null,maxMass:c.maxMass||null,holdOpen:c.holdOpen||'Не указано'});
  if(row.category==='opening')Object.assign(item,{
    openingType:c.openingType||'Другое',itemType:c.itemType||'Другой компонент',maxMass:c.maxMass||null,
    minWidth:c.minWidth||null,maxWidth:c.maxWidth||null,minHeight:c.minHeight||null,maxHeight:c.maxHeight||null,direction:c.direction||null
  });
  if(row.category==='grille')Object.assign(item,{
    material:c.material||'Другой',size1:c.size1||null,size2:c.size2||null,grilleType:c.grilleType||'Другое',packageType:c.packageType||null
  });
  return item;
}
function applyNomenclatureImport(){
  if(!catalogWriteAllowed())return;
  const active=nomenclatureImportRows.filter(r=>r.checked);
  active.forEach(r=>Object.assign(r,validateImportRow(r)));
  if(active.some(r=>r.status==='review')){refreshImportRows();return}
  let added=0,skipped=0;
  for(const row of active){
    if(row.status==='exists'){skipped++;continue}
    if(row.category==='film36'){if(pushUniqueFilm('hd_v4_films36',row))added++;else skipped++;continue}
    if(row.category==='filmGeneral'){if(pushUniqueFilm('hd_v4_films_general',row))added++;else skipped++;continue}
    if(row.category==='ral'){
      const raw=(row.article||row.name).trim().toUpperCase();
      const m=raw.match(/RAL\s*(\d{3,4})/);if(!m){skipped++;continue}
      const val='RAL '+m[1],vals=getRals();if(!vals.includes(val)){vals.push(val);setStore('hd_v4_rals',vals);added++}else skipped++;continue
    }
    if(['hinge','lock','handle','turn','cylinder','stop','threshold','closer','opening','grille'].includes(row.category)){
      const duplicate=findHardwareDuplicateCandidate({name:row.name,article:row.article});
      if(duplicate){skipped++;continue}
      const vals=getCustomDictionaryItems(row.category);
      const item=importedHardwareItem(row);
      vals.push(item);saveCustomDictionaryItems(row.category,vals);
      if(row.imageData)saveHardwareUserImage(hardwareCategoryForDictionaryType(row.category),item.name,row.imageData,row.imageName||'Фото импорта',false);
      added++;continue
    }
    skipped++;
  }
  renderDictionaries();renderForm();
  const msg=$('importApplyMessage');if(msg){msg.className='status ok';msg.innerHTML='<b>Импорт применён.</b> Добавлено: '+added+'. Пропущено существующих/исключённых: '+skipped+'.'}
  setImportStep(3);
  if($('applyNomenclatureImportBtn'))$('applyNomenclatureImportBtn').disabled=true;
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('nomenclatureImportModal')?.classList.contains('hidden'))closeNomenclatureImport()});
document.addEventListener('DOMContentLoaded',()=>{
  const dz=$('importDropZone');if(!dz)return;
  ['dragenter','dragover'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add('drag')}));
  ['dragleave','drop'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove('drag')}));
  dz.addEventListener('drop',e=>{const f=e.dataTransfer?.files?.[0];if(f)handleNomenclatureImportFile(f)});
});
