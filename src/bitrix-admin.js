const BITRIX_ADMIN_AUDIT_STATE={
  status:'idle',
  error:'',
  result:null,
  survivorBySku:{},
  bindingStatus:'idle',
  bindingError:'',
  bindings:[],
  candidateStatus:'idle',
  candidateError:'',
  candidates:[],
  selectedCandidateKey:''
};

function bitrixAdminAllowed(){
  return typeof can==='function'?can('bitrixAdminAudit'):false;
}
function bitrixAdminAdapter(){
  return window.HD_BITRIX_ADAPTER||null;
}
function bitrixAdminSetState(patch){
  Object.assign(BITRIX_ADMIN_AUDIT_STATE,patch||{});
  if(typeof activePricingAdminSection==='function'&&activePricingAdminSection()==='bitrix'){
    const root=typeof $==='function'?$('pricingAdminRoot'):null;
    if(root&&typeof renderPricingAdmin==='function')renderPricingAdmin();
  }
}
function bitrixAdminTypeLabel(kind){
  return ({
    product:'Товар',
    offer:'Торговое предложение',
    sku:'Товар с вариациями',
    service:'Услуга'
  })[String(kind||'')]||String(kind||'Неизвестный тип');
}
function bitrixAdminStatusBadge(active){
  const on=String(active||'').toUpperCase()==='Y';
  return '<span class="bitrix-audit-pill '+(on?'ok':'muted')+'">'+(on?'Активен':'Неактивен')+'</span>';
}
function bitrixAdminEncode(value){return encodeURIComponent(String(value??''))}
function bitrixAdminDecode(value){
  try{return decodeURIComponent(String(value??''))}catch{return String(value??'')}
}

function bitrixAdminPortalDomain(){
  return String(BITRIX_ADMIN_AUDIT_STATE.result?.portalDomain||'hiddendoors.bitrix24.ru')
    .replace(/^https?:\/\//,'').replace(/\/$/,'');
}
function bitrixAdminRecordPath(record){
  const catalogId=Number(record?.catalogId||0);
  const id=Number(record?.id||record?.productId||0);
  return catalogId&&id?'/shop/catalog/'+catalogId+'/product/'+id+'/':'';
}
function bitrixAdminOpenAnyRecord(record){
  if(!record)return;
  const path=record.cardPath||bitrixAdminRecordPath(record);
  if(path&&window.BX24&&typeof BX24.openPath==='function'){
    BX24.openPath(path);
    return;
  }
  const url=record.cardUrl||(path?'https://'+bitrixAdminPortalDomain()+path:'');
  if(url){
    window.open(url,'_blank','noopener,noreferrer');
    return;
  }
  alert('Для этой карточки Bitrix24 ещё не удалось определить ссылку.');
}
async function bitrixAdminLoadBindings(){
  if(!bitrixAdminAllowed())return;
  const adapter=bitrixAdminAdapter();
  if(!adapter||typeof adapter.listSkuBindings!=='function'){
    BITRIX_ADMIN_AUDIT_STATE.bindingStatus='disconnected';
    BITRIX_ADMIN_AUDIT_STATE.bindingError='Ручные связи появятся после подключения server bridge.';
    if(typeof renderPricingAdmin==='function')renderPricingAdmin();
    return;
  }
  BITRIX_ADMIN_AUDIT_STATE.bindingStatus='loading';
  BITRIX_ADMIN_AUDIT_STATE.bindingError='';
  if(typeof renderPricingAdmin==='function')renderPricingAdmin();
  try{
    const result=await adapter.listSkuBindings();
    BITRIX_ADMIN_AUDIT_STATE.bindings=Array.isArray(result)?result:(Array.isArray(result?.bindings)?result.bindings:[]);
    BITRIX_ADMIN_AUDIT_STATE.bindingStatus='ready';
  }catch(error){
    BITRIX_ADMIN_AUDIT_STATE.bindingStatus='error';
    BITRIX_ADMIN_AUDIT_STATE.bindingError=String(error?.message||error);
  }
  if(typeof renderPricingAdmin==='function')renderPricingAdmin();
}
async function bitrixAdminSearchLegacy(){
  if(!bitrixAdminAllowed())return;
  const query=String($('bitrixLegacyQuery')?.value||'').trim();
  if(!query){alert('Введите PRODUCT_ID или часть названия товара.');return}
  const adapter=bitrixAdminAdapter();
  if(!adapter||typeof adapter.searchCatalogCandidates!=='function'){
    BITRIX_ADMIN_AUDIT_STATE.candidateStatus='disconnected';
    BITRIX_ADMIN_AUDIT_STATE.candidateError='Поиск по реальному каталогу появится после подключения server bridge.';
    if(typeof renderPricingAdmin==='function')renderPricingAdmin();
    return;
  }
  BITRIX_ADMIN_AUDIT_STATE.candidateStatus='loading';
  BITRIX_ADMIN_AUDIT_STATE.candidateError='';
  BITRIX_ADMIN_AUDIT_STATE.candidates=[];
  BITRIX_ADMIN_AUDIT_STATE.selectedCandidateKey='';
  if(typeof renderPricingAdmin==='function')renderPricingAdmin();
  try{
    const result=await adapter.searchCatalogCandidates({query});
    BITRIX_ADMIN_AUDIT_STATE.candidates=Array.isArray(result)?result:(Array.isArray(result?.matches)?result.matches:[]);
    BITRIX_ADMIN_AUDIT_STATE.candidateStatus='ready';
  }catch(error){
    BITRIX_ADMIN_AUDIT_STATE.candidateStatus='error';
    BITRIX_ADMIN_AUDIT_STATE.candidateError=String(error?.message||error);
  }
  if(typeof renderPricingAdmin==='function')renderPricingAdmin();
}
function bitrixAdminCandidateKey(record){
  return String(record?.kind||'')+':'+String(record?.id||'');
}
function bitrixAdminSelectCandidate(key){
  BITRIX_ADMIN_AUDIT_STATE.selectedCandidateKey=String(key||'');
  if(typeof renderPricingAdmin==='function')renderPricingAdmin();
}
function bitrixAdminSelectedCandidate(){
  const key=BITRIX_ADMIN_AUDIT_STATE.selectedCandidateKey;
  return (BITRIX_ADMIN_AUDIT_STATE.candidates||[]).find(x=>bitrixAdminCandidateKey(x)===key)||null;
}
async function bitrixAdminCreateBinding(){
  if(!bitrixAdminAllowed())return;
  const sku=String($('bitrixBindingSku')?.value||'').trim();
  const note=String($('bitrixBindingNote')?.value||'').trim();
  const record=bitrixAdminSelectedCandidate();
  if(!sku){alert('Введите стабильный SKU из конфигуратора.');return}
  if(!record){alert('Сначала найдите и выберите конкретную карточку Bitrix24.');return}
  const adapter=bitrixAdminAdapter();
  if(!adapter||typeof adapter.bindSkuToProduct!=='function'){
    alert('Создание связи появится после подключения server bridge.');
    return;
  }
  const xmlWarning=record.xmlId&&record.xmlId!==sku
    ?'\n\nВ карточке уже есть другой внешний код: '+record.xmlId+'. Он НЕ будет автоматически изменён.'
    :'';
  const confirmed=confirm(
    'Связать наш SKU с существующей карточкой Bitrix24?\n\n'+
    'SKU: '+sku+'\n'+
    'PRODUCT_ID: #'+record.id+'\n'+
    'Карточка: '+(record.name||'Без названия')+
    xmlWarning+
    '\n\nПосле этого интеграция будет использовать эту карточку вместо создания новой.'
  );
  if(!confirmed)return;
  try{
    await adapter.bindSkuToProduct({
      sku,
      productId:Number(record.id),
      kind:String(record.kind||'product'),
      catalogId:Number(record.catalogId||0)||null,
      name:String(record.name||''),
      sourceXmlId:String(record.xmlId||''),
      note
    });
    BITRIX_ADMIN_AUDIT_STATE.candidateStatus='idle';
    BITRIX_ADMIN_AUDIT_STATE.candidates=[];
    BITRIX_ADMIN_AUDIT_STATE.selectedCandidateKey='';
    await bitrixAdminLoadBindings();
  }catch(error){
    alert('Не удалось создать связь: '+String(error?.message||error));
  }
}
async function bitrixAdminUnbind(encodedSku){
  if(!bitrixAdminAllowed())return;
  const sku=bitrixAdminDecode(encodedSku);
  const binding=(BITRIX_ADMIN_AUDIT_STATE.bindings||[]).find(x=>String(x.sku)===sku);
  if(!binding)return;
  const adapter=bitrixAdminAdapter();
  if(!adapter||typeof adapter.unbindSku!=='function'){
    alert('Удаление связи появится после подключения server bridge.');
    return;
  }
  if(!confirm(
    'Снять ручную привязку?\n\n'+
    'SKU: '+sku+'\n'+
    'PRODUCT_ID: #'+binding.productId+'\n\n'+
    'Карточка Bitrix24 НЕ удаляется. Удаляется только наша ручная связь.'
  ))return;
  try{
    await adapter.unbindSku({sku});
    await bitrixAdminLoadBindings();
  }catch(error){
    alert('Не удалось снять связь: '+String(error?.message||error));
  }
}
function bitrixAdminOpenBinding(encodedSku){
  const sku=bitrixAdminDecode(encodedSku);
  const binding=(BITRIX_ADMIN_AUDIT_STATE.bindings||[]).find(x=>String(x.sku)===sku);
  if(binding)bitrixAdminOpenAnyRecord({id:binding.productId,catalogId:binding.catalogId,cardPath:binding.cardPath,cardUrl:binding.cardUrl});
}

function bitrixAdminFindConflict(sku){
  return (BITRIX_ADMIN_AUDIT_STATE.result?.conflicts||[]).find(x=>String(x.sku)===String(sku))||null;
}
function bitrixAdminFindRecord(sku,id){
  const group=bitrixAdminFindConflict(sku);
  return group?.records?.find(x=>Number(x.id)===Number(id))||null;
}
function bitrixAdminSelectSurvivor(encodedSku,id){
  const sku=bitrixAdminDecode(encodedSku);
  BITRIX_ADMIN_AUDIT_STATE.survivorBySku[sku]=Number(id);
  if(typeof renderPricingAdmin==='function')renderPricingAdmin();
}
function bitrixAdminOpenRecord(encodedSku,id){
  const sku=bitrixAdminDecode(encodedSku);
  bitrixAdminOpenAnyRecord(bitrixAdminFindRecord(sku,id));
}
async function runBitrixAdminAudit(){
  if(!bitrixAdminAllowed())return;
  const adapter=bitrixAdminAdapter();
  if(!adapter||typeof adapter.auditNomenclature!=='function'){
    bitrixAdminSetState({
      status:'disconnected',
      error:'Адаптер Bitrix24 ещё не подключён. Интерфейс аудита готов, реальные данные появятся после подключения server bridge.',
      result:null
    });
    return;
  }
  bitrixAdminSetState({status:'loading',error:''});
  try{
    const result=await adapter.auditNomenclature();
    BITRIX_ADMIN_AUDIT_STATE.survivorBySku={};
    bitrixAdminSetState({status:'ready',result,error:''});
  }catch(error){
    bitrixAdminSetState({status:'error',error:String(error?.message||error),result:null});
  }
}
async function bitrixAdminDeleteDuplicate(encodedSku,deleteId,expectedKind){
  if(!bitrixAdminAllowed())return;
  const sku=bitrixAdminDecode(encodedSku);
  const keepId=Number(BITRIX_ADMIN_AUDIT_STATE.survivorBySku[sku]||0);
  const target=bitrixAdminFindRecord(sku,deleteId);
  const survivor=bitrixAdminFindRecord(sku,keepId);
  if(!keepId||!survivor){
    alert('Сначала отметьте карточку, которую нужно ОСТАВИТЬ.');
    return;
  }
  if(Number(deleteId)===keepId){
    alert('Нельзя удалить карточку, отмеченную как оставляемая.');
    return;
  }
  const adapter=bitrixAdminAdapter();
  if(!adapter||typeof adapter.deleteCatalogDuplicate!=='function'){
    alert('Удаление через Bitrix24 ещё не подключено к server bridge.');
    return;
  }
  const targetName=target?.name||('PRODUCT_ID '+deleteId);
  const keepName=survivor?.name||('PRODUCT_ID '+keepId);
  const confirmed=confirm(
    'Удалить дубль из Bitrix24?\n\n'+
    'SKU: '+sku+'\n'+
    'УДАЛИТЬ: #'+deleteId+' — '+targetName+'\n'+
    'ОСТАВИТЬ: #'+keepId+' — '+keepName+'\n\n'+
    'Перед удалением сервер ещё раз перепроверит дубли. Действие необратимо.'
  );
  if(!confirmed)return;

  bitrixAdminSetState({status:'loading',error:''});
  try{
    await adapter.deleteCatalogDuplicate({
      sku,
      deleteId:Number(deleteId),
      keepId,
      expectedKind:String(expectedKind||'')
    });
    await runBitrixAdminAudit();
  }catch(error){
    bitrixAdminSetState({
      status:'error',
      error:'Удаление не выполнено: '+String(error?.message||error)
    });
  }
}
function bitrixAdminSummaryValue(summary,key,fallback=0){
  const value=summary?.[key];
  return Number.isFinite(Number(value))?Number(value):fallback;
}
function bitrixAdminConflictHtml(group){
  const sku=String(group?.sku||'');
  const encoded=bitrixAdminEncode(sku);
  const selected=Number(BITRIX_ADMIN_AUDIT_STATE.survivorBySku[sku]||0);
  const rows=(group?.records||[]).map(record=>{
    const id=Number(record?.id||0);
    const sectionPath=Array.isArray(record?.sectionPath)&&record.sectionPath.length
      ?record.sectionPath.join(' → ')
      :(record?.catalogName||'');
    const path='CRM → Складской учёт → Товарный каталог'+(sectionPath?' → '+sectionPath:'');
    const canOpen=!!(record?.cardPath||record?.cardUrl);
    return '<div class="bitrix-duplicate-record">'+
      '<div class="bitrix-duplicate-keep"><label><input type="radio" name="bitrixKeep_'+encoded+'" '+(selected===id?'checked':'')+
        ' onchange="bitrixAdminSelectSurvivor(\''+encoded+'\','+id+')"> <span>Оставить</span></label></div>'+
      '<div class="bitrix-duplicate-main">'+
        '<div class="bitrix-duplicate-title">'+escapeHtml(record?.name||'Без названия')+'</div>'+
        '<div class="bitrix-duplicate-meta">'+
          '<span>PRODUCT_ID <b>#'+id+'</b></span>'+
          '<span>'+escapeHtml(bitrixAdminTypeLabel(record?.kind))+'</span>'+
          bitrixAdminStatusBadge(record?.active)+
        '</div>'+
        '<div class="bitrix-duplicate-path">'+escapeHtml(path)+'</div>'+
      '</div>'+
      '<div class="bitrix-duplicate-actions">'+
        '<button class="secondary" type="button" '+(canOpen?'':'disabled')+
          ' onclick="bitrixAdminOpenRecord(\''+encoded+'\','+id+')">Открыть в Bitrix24</button>'+
        '<button class="bitrix-danger" type="button" '+(selected===id?'disabled':'')+
          ' onclick="bitrixAdminDeleteDuplicate(\''+encoded+'\','+id+',\''+escapeHtml(record?.kind||'')+'\')">Удалить дубль</button>'+
      '</div>'+
    '</div>';
  }).join('');
  return '<div class="bitrix-conflict-card">'+
    '<div class="bitrix-conflict-head"><div><b>'+escapeHtml(sku)+'</b><span>'+Number(group?.count||group?.records?.length||0)+' карточки с одним SKU</span></div>'+
      '<span class="bitrix-audit-pill danger">Конфликт</span></div>'+
    '<div class="mini">Отметьте одну карточку «Оставить», затем удалите лишнюю. Перед удалением сервер повторно проверит этот SKU.</div>'+
    '<div class="bitrix-duplicate-list">'+rows+'</div>'+
  '</div>';
}
function bitrixAdminIssueRows(items,emptyText){
  if(!Array.isArray(items)||!items.length)return '<div class="bitrix-audit-empty">'+escapeHtml(emptyText)+'</div>';
  return '<div class="table-wrap"><table class="bitrix-audit-table"><thead><tr><th>Тип</th><th>SKU / объект</th><th>Что обнаружено</th><th>Путь</th></tr></thead><tbody>'+
    items.map(item=>'<tr>'+
      '<td>'+escapeHtml(item?.type||item?.status||'Проверка')+'</td>'+
      '<td><b>'+escapeHtml(item?.sku||item?.name||'—')+'</b></td>'+
      '<td>'+escapeHtml(item?.message||item?.reason||'—')+'</td>'+
      '<td>'+escapeHtml(Array.isArray(item?.sectionPath)?item.sectionPath.join(' → '):(item?.path||'—'))+'</td>'+
    '</tr>').join('')+
  '</tbody></table></div>';
}

function bitrixAdminCandidateResultsHtml(){
  const state=BITRIX_ADMIN_AUDIT_STATE;
  if(state.candidateStatus==='loading')return '<div class="status info">Ищем карточки в Bitrix24…</div>';
  if(state.candidateStatus==='disconnected')return '<div class="status warn">'+escapeHtml(state.candidateError)+'</div>';
  if(state.candidateStatus==='error')return '<div class="status err">'+escapeHtml(state.candidateError)+'</div>';
  if(state.candidateStatus!=='ready')return '<div class="bitrix-audit-empty">Введите PRODUCT_ID или часть названия старой карточки Bitrix24.</div>';
  if(!state.candidates.length)return '<div class="bitrix-audit-empty">Совпадений не найдено.</div>';
  return '<div class="bitrix-binding-candidates">'+state.candidates.map(record=>{
    const key=bitrixAdminCandidateKey(record);
    const selected=state.selectedCandidateKey===key;
    const xml=record.xmlId
      ?'<span class="bitrix-audit-pill '+(record.xmlId?'muted':'ok')+'">xmlId: '+escapeHtml(record.xmlId)+'</span>'
      :'<span class="bitrix-audit-pill ok">xmlId пустой</span>';
    return '<button type="button" class="bitrix-binding-candidate '+(selected?'active':'')+'" onclick="bitrixAdminSelectCandidate(\''+escapeHtml(key)+'\')">'+
      '<span class="bitrix-binding-candidate-head"><b>#'+Number(record.id||0)+' · '+escapeHtml(record.name||'Без названия')+'</b>'+
        '<span>'+escapeHtml(bitrixAdminTypeLabel(record.kind))+'</span></span>'+
      '<span class="bitrix-binding-candidate-meta">'+xml+'<span>'+escapeHtml(record.catalogName||'Каталог Bitrix24')+'</span></span>'+
    '</button>';
  }).join('')+'</div>';
}
function bitrixAdminBindingsTableHtml(){
  const state=BITRIX_ADMIN_AUDIT_STATE;
  if(state.bindingStatus==='loading')return '<div class="status info">Загружаем ручные связи…</div>';
  if(state.bindingStatus==='disconnected')return '<div class="status warn">'+escapeHtml(state.bindingError)+'</div>';
  if(state.bindingStatus==='error')return '<div class="status err">'+escapeHtml(state.bindingError)+'</div>';
  if(state.bindingStatus!=='ready')return '<div class="bitrix-audit-empty">Список ручных связей ещё не загружен.</div>';
  if(!state.bindings.length)return '<div class="bitrix-audit-empty ok">Ручных связей пока нет.</div>';
  return '<div class="table-wrap"><table class="bitrix-audit-table"><thead><tr><th>Наш SKU</th><th>PRODUCT_ID</th><th>Карточка</th><th>Тип</th><th>Исходный xmlId</th><th></th></tr></thead><tbody>'+
    state.bindings.map(binding=>{
      const encoded=bitrixAdminEncode(binding.sku);
      return '<tr>'+
        '<td><b>'+escapeHtml(binding.sku)+'</b></td>'+
        '<td>#'+Number(binding.productId||0)+'</td>'+
        '<td>'+escapeHtml(binding.name||'—')+'</td>'+
        '<td>'+escapeHtml(bitrixAdminTypeLabel(binding.kind))+'</td>'+
        '<td>'+escapeHtml(binding.sourceXmlId||'пустой')+'</td>'+
        '<td><div class="row">'+
          '<button class="secondary" type="button" onclick="bitrixAdminOpenBinding(\''+encoded+'\')">Открыть</button>'+
          '<button class="ghost" type="button" onclick="bitrixAdminUnbind(\''+encoded+'\')">Снять связь</button>'+
        '</div></td>'+
      '</tr>';
    }).join('')+
  '</tbody></table></div>';
}
function bitrixAdminBindingsHtml(){
  const selected=bitrixAdminSelectedCandidate();
  return '<div class="pricing-admin-card pricing-wide-card bitrix-binding-shell">'+
    '<div class="pricing-rule-block-title">Ручная привязка старой номенклатуры</div>'+
    '<div class="mini">Используйте это, когда карточка уже существует в старом каталоге Bitrix24, но у неё нет нашего стабильного SKU. Старая карточка не переносится и её xmlId автоматически не переписывается.</div>'+
    '<div class="bitrix-binding-form">'+
      '<label>Наш стабильный SKU<input id="bitrixBindingSku" type="text" placeholder="Например, CFG-D42-..." autocomplete="off"></label>'+
      '<label>PRODUCT_ID или название старой карточки<div class="bitrix-binding-search-row"><input id="bitrixLegacyQuery" type="text" placeholder="Например, 18432 или Дверь скрытая 42" autocomplete="off"><button type="button" onclick="bitrixAdminSearchLegacy()">Найти</button></div></label>'+
      '<label class="full">Комментарий к связи<input id="bitrixBindingNote" type="text" placeholder="Необязательно: почему выбрана именно эта карточка"></label>'+
    '</div>'+
    bitrixAdminCandidateResultsHtml()+
    (selected?'<div class="bitrix-binding-selected"><div><b>Выбрано:</b> #'+Number(selected.id||0)+' · '+escapeHtml(selected.name||'Без названия')+
      '<div class="mini">Тип: '+escapeHtml(bitrixAdminTypeLabel(selected.kind))+' · текущий xmlId: '+escapeHtml(selected.xmlId||'пустой')+'</div></div>'+
      '<div class="row"><button class="secondary" type="button" onclick="bitrixAdminOpenAnyRecord(BITRIX_ADMIN_AUDIT_STATE.candidates.find(x=>bitrixAdminCandidateKey(x)===BITRIX_ADMIN_AUDIT_STATE.selectedCandidateKey))">Открыть в Bitrix24</button>'+
      '<button type="button" onclick="bitrixAdminCreateBinding()">Связать с нашим SKU</button></div></div>':'')+
    '<div class="bitrix-binding-list-head"><b>Сохранённые ручные связи</b><button class="secondary" type="button" onclick="bitrixAdminLoadBindings()">Обновить список</button></div>'+
    bitrixAdminBindingsTableHtml()+
  '</div>';
}

function renderBitrixAdmin(){
  const state=BITRIX_ADMIN_AUDIT_STATE;
  const result=state.result;
  const summary=result?.summary||{};
  const conflicts=Array.isArray(result?.conflicts)?result.conflicts:[];
  const other=Array.isArray(result?.other)?result.other:[];
  const issues=Array.isArray(result?.issues)?result.issues:[];
  const connected=state.status==='ready';

  let statusHtml='';
  if(state.status==='idle'){
    statusHtml='<div class="status info">Аудит ещё не запускался. Реальные данные Bitrix24 не запрашиваются автоматически.</div>';
  }else if(state.status==='loading'){
    statusHtml='<div class="status info">Проверяем каталог Bitrix24…</div>';
  }else if(state.status==='disconnected'){
    statusHtml='<div class="status warn">'+escapeHtml(state.error)+'</div>';
  }else if(state.status==='error'){
    statusHtml='<div class="status err">'+escapeHtml(state.error)+'</div>';
  }else if(connected){
    statusHtml='<div class="status ok">Аудит завершён'+(result?.auditedAt?' · '+escapeHtml(result.auditedAt):'')+'. Изменения в каталоге выполняются только отдельной командой администратора.</div>';
  }

  const conflictCount=connected?bitrixAdminSummaryValue(summary,'conflicts',conflicts.length):'—';
  const otherCount=connected?bitrixAdminSummaryValue(summary,'other',other.length):'—';
  const issueCount=connected?bitrixAdminSummaryValue(summary,'issues',issues.length):'—';

  return pricingAdminSectionHeader(
      'Bitrix24 · аудит номенклатуры',
      'Контроль стабильных SKU, дублей, разделов и проблем синхронизации. Никаких автоматических удалений.',
      connected?'Подключено':'Контрольный контур'
    )+
    '<div class="pricing-admin-grid bitrix-audit-summary">'+
      '<div class="pricing-admin-card primary"><div class="pricing-admin-kicker">Связь</div><div class="pricing-admin-title">'+
        (connected?'Bitrix24 доступен':'Ожидает подключения')+'</div><div class="mini">'+escapeHtml(result?.portalDomain||'hiddendoors.bitrix24.ru')+'</div></div>'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Дубли SKU</div><div class="pricing-admin-big">'+conflictCount+'</div><div class="mini">требуют решения администратора</div></div>'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">99. Прочее / ошибки</div><div class="pricing-admin-big">'+otherCount+' / '+issueCount+'</div><div class="mini">маршрутизация / технические проблемы</div></div>'+
    '</div>'+
    '<div class="bitrix-audit-toolbar">'+
      '<button type="button" onclick="runBitrixAdminAudit()" '+(state.status==='loading'?'disabled':'')+'>'+(connected?'Обновить аудит':'Запустить аудит')+'</button>'+
      '<span class="mini">Проверка только читает каталог. Удаление доступно отдельно внутри конкретного конфликта.</span>'+
    '</div>'+
    statusHtml+
    bitrixAdminBindingsHtml()+
    '<div class="pricing-admin-card pricing-wide-card">'+
      '<div class="pricing-rule-block-title">Дубли стабильного SKU</div>'+
      (connected
        ?(conflicts.length?conflicts.map(bitrixAdminConflictHtml).join(''):'<div class="bitrix-audit-empty ok">Дублей стабильного SKU не найдено.</div>')
        :'<div class="bitrix-audit-empty">После подключения здесь появятся реальные конфликтные SKU и ссылки на карточки Bitrix24.</div>')+
    '</div>'+
    '<div class="pricing-rule-layout bitrix-audit-lower">'+
      '<div class="pricing-admin-card"><div class="pricing-rule-block-title">99. Прочее</div>'+
        (connected?bitrixAdminIssueRows(other,'Позиций в «99. Прочее» нет.'):'<div class="bitrix-audit-empty">Данные появятся после аудита.</div>')+
      '</div>'+
      '<div class="pricing-admin-card"><div class="pricing-rule-block-title">Ошибки и предупреждения</div>'+
        (connected?bitrixAdminIssueRows(issues,'Ошибок синхронизации нет.'):'<div class="bitrix-audit-empty">Данные появятся после аудита.</div>')+
      '</div>'+
    '</div>'+
    '<div class="pricing-admin-card pricing-wide-card bitrix-audit-rules">'+
      '<div class="pricing-rule-block-title">Что контролируем</div>'+
      '<div class="pricing-rules">'+
        '<div><b>Одинаковый SKU.</b> Один стабильный SKU должен вести ровно на одну карточку Bitrix24.</div>'+
        '<div><b>Тип записи.</b> Товар, вариация, родитель товара с вариациями и услуга обрабатываются разными REST-методами.</div>'+
        '<div><b>Путь.</b> Для каждой найденной карточки показываем раздел каталога и прямое открытие карточки в Bitrix24.</div>'+
        '<div><b>Удаление.</b> Только администратор, только после выбора карточки, которую оставляем, и повторной серверной проверки конфликта.</div>'+
      '</div>'+
    '</div>';
}
