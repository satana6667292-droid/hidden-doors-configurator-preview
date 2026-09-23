const STOCK_DEMO=[
  {sku:'HD-ST-000101',category:'Дверь 36',name:'Полотно 36 мм / Frame 102 / 2000x800 / ПВХ-пленка: Эмалит Белый — TF 77 IE X 01',qty:12,unit:'шт.',location:'Склад готовой продукции'},
  {sku:'HD-ST-000102',category:'Дверь 36',name:'Полотно 36 мм / Frame 1 / 2000x700 / ПВХ-пленка: Олива — AG 1050',qty:5,unit:'шт.',location:'Склад готовой продукции'},
  {sku:'HD-ST-000103',category:'Дверь 36',name:'Полотно 36 мм / Line 19 / 2000x800 / ПВХ-пленка: Графит шагрень — AG 1027',qty:0,unit:'шт.',location:'Склад готовой продукции'},
  {sku:'HD-ST-000201',category:'Погонаж 36',name:'Короб телескопический 36 / 70×32×2070 / ПВХ-пленка: Эмалит Белый — TF 77 IE X 01',qty:24,unit:'шт.',location:'Погонаж'},
  {sku:'HD-ST-000202',category:'Погонаж 36',name:'Наличник телескопический 36 / 8×70×2150 / ПВХ-пленка: Эмалит Белый — TF 77 IE X 01',qty:38,unit:'шт.',location:'Погонаж'},
  {sku:'HD-ST-000203',category:'Погонаж 36',name:'Добор телескопический 36 / 10×150×2070 / ПВХ-пленка: Эмалит Белый — TF 77 IE X 01',qty:9,unit:'шт.',location:'Погонаж'},
  {sku:'HD-ST-000204',category:'Погонаж 36',name:'Притворная планка 36 / 10×34×2020 / ПВХ-пленка: Эмалит Белый — TF 77 IE X 01',qty:16,unit:'шт.',location:'Погонаж'},
  {sku:'HD-ST-000205',category:'Погонаж 36',name:'Соединительная планка для стыковки доборов 36 / 4×30×2070 / Грунт под покраску',qty:7,unit:'шт.',location:'Погонаж'},
  {sku:'HD-ST-000301',category:'Скрытая 42',name:'Дверь скрытая + короб / 42 мм / Каркас из фанеры / 2000x800 / Левое на себя / Алюминиевый торец / Черный анод / Сторона 1: Грунт под покраску / Сторона 2: Грунт под покраску',qty:3,unit:'шт.',location:'Склад готовой продукции'},
  {sku:'HD-ST-000401',category:'Скрытая 59',name:'Дверь скрытая + короб / 59 мм / Алюминиевый каркас / 2000x900 / Правое на себя / Алюминиевый торец / Серый анод / Сторона 1: Грунт под покраску / Сторона 2: Грунт под покраску',qty:2,unit:'шт.',location:'Склад готовой продукции'}
];

function getStock(){
  const stored=getStore('hd_v40_stock',null);
  if(Array.isArray(stored))return stored;
  const seeded=STOCK_DEMO.map(x=>({...x}));
  setStore('hd_v40_stock',seeded);
  return seeded;
}
function isStockDoorItem(item){
  const category=stockReceiptCategoryLabel(item);
  return [
    'Дверь 36',
    'Дверь скрытая 42',
    'Комплект: скрытая дверь + короб 42',
    'Откатная дверь 42',
    'Двустворчатая дверь 42',
    'Дверь скрытая 59',
    'Комплект: скрытая дверь + короб 59'
  ].includes(category);
}
function stockAvailableDoorUnits(){
  return getStock()
    .filter(item=>isStockDoorItem(item)&&Number(item.qty||0)>0)
    .reduce((sum,item)=>sum+Number(item.qty||0),0);
}
function stockDoorWord(count){
  const n=Math.abs(Number(count)||0)%100;
  const n1=n%10;
  if(n>10&&n<20)return 'дверей';
  if(n1===1)return 'дверь';
  if(n1>=2&&n1<=4)return 'двери';
  return 'дверей';
}
function updateStockNavCount(){
  const count=stockAvailableDoorUnits();
  const badge=$('stockNavCount');if(!badge)return;
  badge.textContent=count+' '+stockDoorWord(count);
  badge.title='Готовых дверей в наличии: '+count;
}
function saveStock(v){
  setStore('hd_v40_stock',v);
  updateStockNavCount();
}

function clearDemoStock(){
  if(!can('stockDemoClear'))return;
  const stock=getStock();
  const demoSkus=new Set(STOCK_DEMO.map(x=>String(x.sku)));
  const demoRows=stock.filter(x=>demoSkus.has(String(x.sku)));
  if(!demoRows.length){
    showStockActionMessage('Демонстрационных позиций на складе уже нет.','info');
    return;
  }
  if(!confirm('Удалить все демонстрационные позиции склада?\n\nБудут удалены только стартовые тестовые SKU. Добавленные реальные позиции останутся.'))return;
  const next=stock.filter(x=>!demoSkus.has(String(x.sku)));
  demoRows.forEach(item=>recordStockMovement({
    type:'demo-clear',
    sku:item.sku,
    qty:Number(item.qty||0),
    beforeQty:Number(item.qty||0),
    afterQty:0,
    location:item.location||'',
    source:'supply'
  }));
  saveStock(next);
  renderStock();
  showStockActionMessage('Демо-склад очищен: удалено '+demoRows.length+' тестовых SKU. Теперь можно заносить фактические остатки.','ok');
}
function supplySnapshotPayload(){
  const customDictionaries={};
  if(typeof hardwareDictionaryTypes==='function'&&typeof getCustomDictionaryItems==='function'){
    hardwareDictionaryTypes().forEach(type=>customDictionaries[type]=getCustomDictionaryItems(type));
  }
  return {
    schema:'hd-supply-snapshot-v1',
    exportedAt:new Date().toISOString(),
    role:role(),
    stock:getStock(),
    stockMovements:getStockMovements(),
    registry:getRegistry(),
    films36:getStore('hd_v4_films36',[]),
    filmsGeneral:getStore('hd_v4_films_general',[]),
    rals:getRals(),
    customDictionaries
  };
}
function exportStockSnapshot(){
  if(!can('stockExport'))return;
  const payload=supplySnapshotPayload();
  const stamp=new Date().toISOString().slice(0,10);
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='hidden-doors-supply-snapshot-'+stamp+'.json';
  a.click();
  URL.revokeObjectURL(a.href);
  showStockActionMessage('Снимок данных снабжения сохранён. Не удаляйте этот файл до переноса на сервер.','ok');
}
function getStockMovements(){return getStore('hd_v40_stock_movements',[])}
function saveStockMovements(v){setStore('hd_v40_stock_movements',v)}
function recordStockMovement(movement){
  const rows=getStockMovements();
  rows.unshift({...movement,at:new Date().toISOString()});
  saveStockMovements(rows.slice(0,1000));
}
function getCart(){return normalizeDouble42Cart(getStore('hd_v5_cart',[]))}
function saveCart(v){setStore('hd_v5_cart',normalizeDouble42Cart(v));updateCartCount()}
function getProfile(){return getStore('hd_v5_profile',{company:'',contact:'',phone:'',email:'',city:'',delivery:'Самовывоз',address:''})}
function getOrders(){return getStore('hd_v5_orders',[])}
function saveOrders(v){setStore('hd_v5_orders',v)}
function getDraft(){return getStore('hd_v5_order_draft',{})}

function showView(name){
  if(name==='pricing'&&!can('pricingAdmin'))return;
  ['configurator','stock','order','dictionaries','pricing','profile'].forEach(v=>{
    $('view'+v[0].toUpperCase()+v.slice(1))?.classList.toggle('hidden',v!==name);
    $('nav'+v[0].toUpperCase()+v.slice(1))?.classList.toggle('active',v===name);
  });
  if(name==='stock'){setStore(CATALOG_HERO_ROUTE_STORE,'stock');renderStock()}
  if(name==='order'){setStore(CATALOG_HERO_ROUTE_STORE,'order');renderCart()}
  if(name==='dictionaries')renderDictionaries();
  if(name==='pricing'&&typeof renderPricingAdmin==='function')renderPricingAdmin();
  if(name==='profile'){loadProfile();renderOrderHistory()}
  if(typeof renderCatalogHeroState==='function')renderCatalogHeroState();
  window.scrollTo({top:0,behavior:'smooth'});
}

function updateCartCount(){
  const count=getCart().reduce((s,x)=>s+Number(x.qty||0),0);
  const badge=$('cartCount');
  if(badge){
    badge.textContent=count;
    badge.classList.toggle('hidden',count<=0);
  }
}


function stockProductLine(item){
  const text=(String(item?.category||'')+' '+String(item?.name||'')).toLowerCase();
  if(/(?:^|\D)36\s*мм|дверь 36|погонаж 36/.test(text))return '36 мм';
  if(/(?:^|\D)42\s*мм|скрытая 42|погонаж 42/.test(text))return '42 мм';
  if(/(?:^|\D)59\s*мм|скрытая 59|погонаж 59/.test(text))return '59 мм';
  return 'Другое';
}
function normalizeStockVisualText(value){
  return String(value||'').toUpperCase().replace(/Ё/g,'Е').replace(/[_-]+/g,' ').replace(/[^A-ZА-Я0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
}
function stock36DoorVisual(item){
  const descriptor=String(item?.category||'')+' '+String(item?.name||'');
  if(stockProductLine(item)!=='36 мм'||!/двер/i.test(descriptor)||/погонаж/i.test(descriptor))return null;
  const hay=normalizeStockVisualText(item.name);
  const candidates=[];
  for(const group of DOOR36_CATALOG){
    for(const model of group.models){
      const source=String(model.source||'').replace(/\.[^.]+$/,'').replace(/_Magnolia$/i,'').replace(/_/g,' ');
      candidates.push({
        model:model.name,
        source,
        sourceNeedle:normalizeStockVisualText(source),
        modelNeedle:normalizeStockVisualText(model.name)
      });
    }
  }
  candidates.sort((a,b)=>Math.max(b.sourceNeedle.length,b.modelNeedle.length)-Math.max(a.sourceNeedle.length,a.modelNeedle.length));
  const hit=candidates.find(x=>(x.modelNeedle&&hay.includes(x.modelNeedle))||(x.sourceNeedle&&hay.includes(x.sourceNeedle)));
  if(!hit)return null;
  const meta=door36ModelMeta(hit.model);
  const driveId=DOOR36_IMAGE_IDS[hit.model]||'';
  return {
    model:hit.model,
    legacy:hit.source,
    collection:meta?.collection||'',
    group:meta?.group||'',
    imageUrl:driveId?door36ImageUrl(driveId):'',
    driveUrl:driveId?door36DriveUrl(driveId):''
  };
}
function stockItemUnitPrice(item){
  return genericCatalogItemPrice(item);
}
function stockItemVisualHtml(item){
  const visual=stock36DoorVisual(item);
  if(visual?.imageUrl){
    const img='<img src="'+visual.imageUrl+'" alt="'+escapeHtml(visual.model)+'" loading="lazy" referrerpolicy="no-referrer">';
    return '<div class="stock-card-media stock-card-media-36-render">'+(visual.driveUrl?'<a href="'+visual.driveUrl+'" target="_blank" rel="noopener">'+img+'</a>':img)+
      '<div class="stock-model-chip">'+escapeHtml(visual.model)+'</div></div>';
  }
  const label=item.category==='Погонаж 36'?'Погонаж 36':'Фото пока не привязано';
  return '<div class="stock-card-media stock-card-media-empty"><span>'+escapeHtml(label)+'</span></div>';
}
function stockItemVisualMeta(item){
  const visual=stock36DoorVisual(item);
  if(!visual)return '';
  return '<div class="stock-visual-meta"><b>'+escapeHtml(visual.collection+' / '+visual.group+' / '+visual.model)+'</b>'+
    (visual.legacy?'<span>Исходное складское название: '+escapeHtml(visual.legacy)+'</span>':'')+
    '<span class="stock-render-warning"><b>Важно:</b> рендер показывает модель/фрезеровку, а не фактический цвет плёнки. Ориентируйтесь на плёнку в наименовании позиции и физический каталог образцов.</span></div>';
}


let stockReceiptSelectedSku='';
let stockNomenclatureCreateContext=null;

function stockFriendlyHardwareCategory(type){
  const map={lock:'Замки',handle:'Ручки',hinge:'Петли',turn:'Завертки',cylinder:'Цилиндры',stop:'Стопоры',threshold:'Автоматические пороги',closer:'Доводчики',opening:'Системы открывания',grille:'Вентиляционные решётки'};
  return map[type]||type||'Фурнитура';
}
function stockNomenclatureCandidates(){
  const bySku=new Map();
  getStock().forEach(item=>{
    if(item?.sku)bySku.set(String(item.sku),{...item,sourceKind:'stock'});
  });
  getRegistry().forEach(item=>{
    if(!item?.sku)return;
    const sku=String(item.sku);
    if(!bySku.has(sku))bySku.set(sku,{...item,sku,name:item.name||sku,category:item.category||'Номенклатура',unit:item.unit||'шт.',qty:0,location:'',sourceKind:'registry'});
  });
  if(typeof hardwareDictionaryTypes==='function'&&typeof getCustomDictionaryItems==='function'){
    hardwareDictionaryTypes().forEach(type=>{
      getCustomDictionaryItems(type).forEach(item=>{
        if(!item?.sku)return;
        const sku=String(item.sku);
        if(!bySku.has(sku))bySku.set(sku,{
          sku,name:item.name||sku,category:stockFriendlyHardwareCategory(type),unit:'шт.',qty:0,location:'',sourceKind:'hardware',
          brand:item.brand||'',article:item.article||'',model:item.model||'',finish:item.finish||''
        });
      });
    });
  }
  return [...bySku.values()].sort((a,b)=>String(a.category).localeCompare(String(b.category),'ru')||String(a.name).localeCompare(String(b.name),'ru'));
}
function stockReceiptCandidateBySku(sku){
  return stockNomenclatureCandidates().find(x=>String(x.sku)===String(sku))||null;
}
function refreshStockFilterOptions(){
  const stock=getStock();
  const select=$('stockCategory');
  if(select){
    const old=select.value||'Все категории';
    const cats=['Все категории',...new Set(stock.map(x=>x.category).filter(Boolean))];
    select.innerHTML=options(cats,cats.includes(old)?old:'Все категории');
  }
  const lineSelect=$('stockLine');
  if(lineSelect){
    const old=lineSelect.value||'Все линейки';
    const lines=['Все линейки','36 мм','42 мм','59 мм','Другое'];
    lineSelect.innerHTML=options(lines,lines.includes(old)?old:'Все линейки');
  }
}
function stockReceiptCategoryLabel(item){
  const line=stockProductLine(item);
  if(item?.stockReceiptCategory)return String(item.stockReceiptCategory);
  const category=String(item?.category||'').trim();
  const name=String(item?.name||'').trim();
  const text=(category+' '+name).toLowerCase();

  if(line==='36 мм'){
    if(/погонаж|короб телескоп|наличник телескоп|добор телескоп|притворн|соединительн/.test(text))return 'Погонаж 36';
    if(/двер/.test(text))return 'Дверь 36';
  }
  if(line==='42 мм'){
    if(/погонаж|профиль дверного короба 42|торец bc3|торец c4/.test(text))return 'Погонаж 42';
    if(/откат/.test(text))return 'Откатная дверь 42';
    if(/двуствор/.test(text))return 'Двустворчатая дверь 42';
    if(/дверь скрытая\s*\+\s*короб|скрытая 42/.test(text))return 'Комплект: скрытая дверь + короб 42';
    if(/двер/.test(text))return 'Дверь скрытая 42';
  }
  if(line==='59 мм'){
    if(/погонаж|профиль дверного короба 59|торец 59/.test(text))return 'Погонаж 59';
    if(/дверь скрытая\s*\+\s*короб|скрытая 59/.test(text))return 'Комплект: скрытая дверь + короб 59';
    if(/двер/.test(text))return 'Дверь скрытая 59';
  }
  return category||'Другое';
}
function stockReceiptCategoryChoices(line,candidates){
  const fixed={
    '36 мм':['Дверь 36','Погонаж 36'],
    '42 мм':['Дверь скрытая 42','Комплект: скрытая дверь + короб 42','Откатная дверь 42','Двустворчатая дверь 42','Погонаж 42'],
    '59 мм':['Дверь скрытая 59','Комплект: скрытая дверь + короб 59','Погонаж 59']
  };
  if(fixed[line])return fixed[line];
  const pool=line==='Все линейки'?candidates:candidates.filter(x=>stockProductLine(x)===line);
  return [...new Set(pool.map(stockReceiptCategoryLabel).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru'));
}
function stockReceiptElementLabel(item){
  const name=String(item?.name||'');
  const line=stockProductLine(item);
  const dictionaries={
    '36 мм':['Короб телескопический','Наличник телескопический','Добор телескопический','Притворная планка','Соединительная планка для стыковки доборов'],
    '42 мм':['Профиль дверного короба 42','Торец BC3','Торец C4'],
    '59 мм':['Профиль дверного короба 59','Торец 59 с четвертью']
  };
  return (dictionaries[line]||[]).find(x=>name.toLowerCase().includes(x.toLowerCase()))||'';
}
function stockReceiptPogoElements(line){
  return {
    '36 мм':['Короб телескопический','Наличник телескопический','Добор телескопический','Притворная планка','Соединительная планка для стыковки доборов'],
    '42 мм':['Профиль дверного короба 42','Торец BC3','Торец C4'],
    '59 мм':['Профиль дверного короба 59','Торец 59 с четвертью']
  }[line]||[];
}
function stockReceipt36GroupsForCollection(collection){
  if(collection && collection!=='Все коллекции')return door36Groups(collection);
  return DOOR36_CATALOG.map(x=>x.collection);
}
function stockReceipt36ModelsForSelection(collection,group){
  if(group && group!=='Все группы')return door36Models(group);
  return stockReceipt36GroupsForCollection(collection).flatMap(door36Models);
}
function refreshStockReceipt36ModelOptions(preferred=''){
  const model=$('stockReceiptModel');if(!model)return;
  const collection=$('stockReceiptCollection')?.value||'Все коллекции';
  const group=$('stockReceiptGroup')?.value||'Все группы';
  const old=preferred||model.value||'Все модели';
  const vals=['Все модели',...stockReceipt36ModelsForSelection(collection,group)];
  model.innerHTML=options(vals,vals.includes(old)?old:'Все модели');
}
function refreshStockReceipt36GroupOptions(preferredGroup='',preferredModel=''){
  const group=$('stockReceiptGroup');if(!group)return;
  const collection=$('stockReceiptCollection')?.value||'Все коллекции';
  const old=preferredGroup||group.value||'Все группы';
  const vals=['Все группы',...stockReceipt36GroupsForCollection(collection)];
  group.innerHTML=options(vals,vals.includes(old)?old:'Все группы');
  refreshStockReceipt36ModelOptions(preferredModel);
}
function renderStockReceiptDependentFilters(preferredItem=null){
  const wrap=$('stockReceiptDependentFilters');if(!wrap)return;
  const line=$('stockReceiptLine')?.value||'Все линейки';
  const cat=$('stockReceiptCategory')?.value||'Все категории';
  const oldCollection=$('stockReceiptCollection')?.value||'Все коллекции';
  const oldGroup=$('stockReceiptGroup')?.value||'Все группы';
  const oldModel=$('stockReceiptModel')?.value||'Все модели';
  const oldElement=$('stockReceiptElement')?.value||'Все элементы';
  const preferredVisual=preferredItem?stock36DoorVisual(preferredItem):null;

  if(line==='36 мм'&&cat==='Дверь 36'){
    const collections=['Все коллекции',...door36Collections()];
    const selectedCollection=preferredVisual?.collection||oldCollection;
    wrap.innerHTML=
      '<div><label>Коллекция</label><select id="stockReceiptCollection" onchange="stockReceipt36CollectionChanged()">'+options(collections,collections.includes(selectedCollection)?selectedCollection:'Все коллекции')+'</select></div>'+
      '<div><label>Группа</label><select id="stockReceiptGroup" onchange="stockReceipt36GroupChanged()"></select></div>'+
      '<div><label>Модель</label><select id="stockReceiptModel" onchange="stockReceiptDependentChanged()"></select></div>';
    wrap.classList.remove('hidden');
    refreshStockReceipt36GroupOptions(preferredVisual?.group||oldGroup,preferredVisual?.model||oldModel);
    return;
  }

  const pogo=(line==='36 мм'&&cat==='Погонаж 36')||(line==='42 мм'&&cat==='Погонаж 42')||(line==='59 мм'&&cat==='Погонаж 59');
  if(pogo){
    const vals=['Все элементы',...stockReceiptPogoElements(line)];
    const preferredElement=preferredItem?stockReceiptElementLabel(preferredItem):oldElement;
    wrap.innerHTML='<div><label>Элемент</label><select id="stockReceiptElement" onchange="stockReceiptDependentChanged()">'+options(vals,vals.includes(preferredElement)?preferredElement:'Все элементы')+'</select></div>';
    wrap.classList.remove('hidden');
    return;
  }

  wrap.innerHTML='';
  wrap.classList.add('hidden');
}
function prepareStockReceiptFilters(preferredItem=null){
  const candidates=stockNomenclatureCandidates();
  const line=$('stockReceiptLine'),cat=$('stockReceiptCategory');
  if(line){
    const current=line.value||'Все линейки';
    const preferred=preferredItem?stockProductLine(preferredItem):current;
    const vals=['Все линейки','36 мм','42 мм','59 мм','Другое'];
    line.innerHTML=options(vals,vals.includes(preferred)?preferred:'Все линейки');
  }
  if(cat){
    const current=cat.value||'Все категории';
    const preferred=preferredItem?stockReceiptCategoryLabel(preferredItem):current;
    const vals=['Все категории',...stockReceiptCategoryChoices(line?.value||'Все линейки',candidates)];
    cat.innerHTML=options(vals,vals.includes(preferred)?preferred:'Все категории');
  }
  renderStockReceiptDependentFilters(preferredItem);
}
function stockReceiptLineChanged(){
  stockReceiptSelectedSku='';
  if($('stockReceiptCategory'))$('stockReceiptCategory').value='Все категории';
  prepareStockReceiptFilters();
  renderStockReceiptCandidates();
  renderStockReceiptSelection();
}
function stockReceiptCategoryChanged(){
  stockReceiptSelectedSku='';
  renderStockReceiptDependentFilters();
  renderStockReceiptCandidates();
  renderStockReceiptSelection();
}
function stockReceipt36CollectionChanged(){
  stockReceiptSelectedSku='';
  refreshStockReceipt36GroupOptions();
  renderStockReceiptCandidates();
  renderStockReceiptSelection();
}
function stockReceipt36GroupChanged(){
  stockReceiptSelectedSku='';
  refreshStockReceipt36ModelOptions();
  renderStockReceiptCandidates();
  renderStockReceiptSelection();
}
function stockReceiptDependentChanged(){
  stockReceiptSelectedSku='';
  renderStockReceiptCandidates();
  renderStockReceiptSelection();
}
function stockReceiptFilterContext(){
  return {
    line:$('stockReceiptLine')?.value||'Все линейки',
    category:$('stockReceiptCategory')?.value||'Все категории',
    collection:$('stockReceiptCollection')?.value||'Все коллекции',
    group:$('stockReceiptGroup')?.value||'Все группы',
    model:$('stockReceiptModel')?.value||'Все модели',
    element:$('stockReceiptElement')?.value||'Все элементы',
    search:$('stockReceiptSearch')?.value||''
  };
}
function restoreStockReceiptFilterContext(context){
  if(!context)return;
  const candidates=stockNomenclatureCandidates();
  const line=$('stockReceiptLine'),cat=$('stockReceiptCategory');
  if(line){
    const lineVals=['Все линейки','36 мм','42 мм','59 мм','Другое'];
    line.value=lineVals.includes(context.line)?context.line:'Все линейки';
  }
  if(cat){
    const vals=['Все категории',...stockReceiptCategoryChoices(line?.value||'Все линейки',candidates)];
    cat.innerHTML=options(vals,vals.includes(context.category)?context.category:'Все категории');
    cat.value=vals.includes(context.category)?context.category:'Все категории';
  }
  renderStockReceiptDependentFilters();
  if($('stockReceiptCollection')){
    const vals=['Все коллекции',...door36Collections()];
    $('stockReceiptCollection').value=vals.includes(context.collection)?context.collection:'Все коллекции';
    refreshStockReceipt36GroupOptions(context.group,context.model);
  }
  if($('stockReceiptElement')){
    const vals=['Все элементы',...stockReceiptPogoElements(line?.value||'')];
    $('stockReceiptElement').value=vals.includes(context.element)?context.element:'Все элементы';
  }
  if($('stockReceiptSearch'))$('stockReceiptSearch').value=context.search||'';
}
function openStockReceipt(sku='',restoreContext=null){
  if(!elevated())return;
  stockReceiptSelectedSku=sku||'';
  const modal=$('stockReceiptModal');if(!modal)return;
  modal.classList.remove('hidden');
  document.body.style.overflow='hidden';
  if($('stockReceiptSearch'))$('stockReceiptSearch').value='';
  const candidate=sku?stockReceiptCandidateBySku(sku):null;
  prepareStockReceiptFilters(restoreContext?null:candidate);
  if(restoreContext)restoreStockReceiptFilterContext(restoreContext);
  renderStockReceiptCandidates();
  renderStockReceiptSelection();
  setTimeout(()=>$('stockReceiptSearch')?.focus(),0);
}
function closeStockReceipt(){
  $('stockReceiptModal')?.classList.add('hidden');
  document.body.style.overflow='';
  stockReceiptSelectedSku='';
}
function renderStockReceiptCandidates(){
  const box=$('stockReceiptCandidates');if(!box)return;
  const q=($('stockReceiptSearch')?.value||'').trim().toLowerCase();
  const line=$('stockReceiptLine')?.value||'Все линейки';
  const cat=$('stockReceiptCategory')?.value||'Все категории';
  const collection=$('stockReceiptCollection')?.value||'Все коллекции';
  const group=$('stockReceiptGroup')?.value||'Все группы';
  const model=$('stockReceiptModel')?.value||'Все модели';
  const element=$('stockReceiptElement')?.value||'Все элементы';
  const candidates=stockNomenclatureCandidates().filter(x=>{
    const visual=stock36DoorVisual(x);
    const uiCategory=stockReceiptCategoryLabel(x);
    const uiElement=stockReceiptElementLabel(x);
    const hay=[x.sku,x.category,uiCategory,x.name,x.brand,x.article,x.model,x.finish,uiElement,visual?.model,visual?.collection,visual?.group].filter(Boolean).join(' ').toLowerCase();
    return (!q||hay.includes(q))&&
      (line==='Все линейки'||stockProductLine(x)===line)&&
      (cat==='Все категории'||uiCategory===cat)&&
      (collection==='Все коллекции'||visual?.collection===collection)&&
      (group==='Все группы'||visual?.group===group)&&
      (model==='Все модели'||visual?.model===model)&&
      (element==='Все элементы'||uiElement===element);
  }).slice(0,120);
  box.innerHTML=candidates.length?candidates.map(item=>{
    const current=getStock().find(x=>String(x.sku)===String(item.sku));
    const price=stockItemUnitPrice(item);
    const visual=stock36DoorVisual(item);
    const source=current?'На складе':item.sourceKind==='hardware'?'Справочник фурнитуры':'Реестр номенклатуры';
    return '<button type="button" class="stock-receipt-candidate '+(String(item.sku)===String(stockReceiptSelectedSku)?'active':'')+'" data-sku="'+escapeHtml(item.sku)+'" onclick="selectStockReceiptCandidate(this.dataset.sku)">'+
      (visual?.imageUrl?'<span class="stock-receipt-thumb"><img src="'+visual.imageUrl+'" alt="'+escapeHtml(visual.model)+'" loading="lazy" referrerpolicy="no-referrer"></span>':'<span class="stock-receipt-thumb empty">SKU</span>')+
      '<span class="stock-receipt-candidate-main"><b>'+escapeHtml(item.sku)+'</b><span>'+escapeHtml(item.name)+'</span><small>'+escapeHtml(stockReceiptCategoryLabel(item))+' · '+escapeHtml(source)+(current?' · остаток '+current.qty+' '+escapeHtml(current.unit||'шт.'):'')+'</small></span>'+
      '<span class="stock-receipt-candidate-price">'+(price===null?'По запросу':formatRub(price))+'</span>'+
    '</button>';
  }).join(''):'<div class="empty">По выбранным фильтрам существующая номенклатура не найдена.</div>';
}
function selectStockReceiptCandidate(sku){
  stockReceiptSelectedSku=String(sku||'');
  renderStockReceiptCandidates();
  renderStockReceiptSelection();
}
function stockReceiptStep(item){return String(item?.unit||'шт.').toLowerCase()==='м'?0.1:1}
function defaultStockLocation(item){
  const category=String(item?.category||'');
  if(/погонаж/i.test(category))return 'Погонаж';
  if(/петл|зам|руч|заверт|цилиндр|стоп|порог|довод|систем|решет/i.test(category))return 'Фурнитура';
  return 'Склад готовой продукции';
}
function renderStockReceiptSelection(){
  const box=$('stockReceiptSelection');if(!box)return;
  const candidate=stockReceiptCandidateBySku(stockReceiptSelectedSku);
  const saveBtn=$('stockReceiptSaveBtn');
  if(!candidate){
    box.innerHTML='<div class="empty">Выберите существующую позицию слева. Если нужного SKU ещё нет, сначала создайте номенклатуру в конфигураторе.</div>';
    if(saveBtn)saveBtn.disabled=true;
    return;
  }
  const current=getStock().find(x=>String(x.sku)===String(candidate.sku));
  const price=stockItemUnitPrice(candidate);
  const visual=stock36DoorVisual(candidate);
  const location=current?.location||defaultStockLocation(candidate);
  const step=stockReceiptStep(candidate);
  box.innerHTML=
    '<div class="stock-receipt-selected">'+
      (visual?.imageUrl?'<div class="stock-receipt-selected-media"><img src="'+visual.imageUrl+'" alt="'+escapeHtml(visual.model)+'" referrerpolicy="no-referrer"></div>':'')+
      '<div class="stock-receipt-selected-info"><div class="mini">'+escapeHtml(stockReceiptCategoryLabel(candidate))+' · '+escapeHtml(stockProductLine(candidate))+'</div><h3>'+escapeHtml(candidate.name)+'</h3>'+
      '<div class="stock-meta"><span class="stock-badge">'+escapeHtml(candidate.sku)+'</span>'+(current?'<span class="stock-badge ok">Сейчас: '+current.qty+' '+escapeHtml(current.unit||candidate.unit||'шт.')+'</span>':'<span class="stock-badge">Ещё не на складе</span>')+'</div>'+
      '<div class="stock-price" style="margin-top:8px">'+(price===null?'Цена по запросу':formatRub(price))+'</div></div>'+
    '</div>'+
    '<div class="fields" style="margin-top:14px">'+
      '<div><label>Количество прихода</label><input id="stockReceiptQty" type="number" min="'+step+'" step="'+step+'" value="'+step+'"></div>'+
      '<div><label>Место хранения</label><input id="stockReceiptLocation" list="stockLocationOptions" value="'+escapeHtml(location)+'" '+(current?'disabled':'')+'></div>'+
    '</div>'+
    (current?'<div class="mini">SKU уже есть на складе. Новая строка не создаётся — приход увеличит текущий остаток. Место хранения остаётся прежним.</div>':'<div class="mini">Будет создана складская карточка существующего SKU. Наименование и SKU вручную не вводятся.</div>');
  if(saveBtn){
    saveBtn.disabled=false;
    saveBtn.textContent=current?'Добавить приход':'Добавить на склад';
  }
}
function showStockActionMessage(text,type='ok'){
  const box=$('stockActionMessage');if(!box)return;
  box.className='status '+type;
  box.textContent=text;
}
function applyStockReceipt(){
  if(!elevated())return;
  const candidate=stockReceiptCandidateBySku(stockReceiptSelectedSku);
  if(!candidate)return;
  const qty=Number($('stockReceiptQty')?.value);
  const step=stockReceiptStep(candidate);
  if(!Number.isFinite(qty)||qty<step){alert('Укажите корректное количество прихода.');return}
  const stock=getStock();
  const existing=stock.find(x=>String(x.sku)===String(candidate.sku));
  const before=Number(existing?.qty||0);
  const location=existing?.location||$('stockReceiptLocation')?.value?.trim()||defaultStockLocation(candidate);
  if(existing){
    existing.qty=Math.round((before+qty)*1000)/1000;
    existing.location=existing.location||location;
    existing.lastReceiptAt=new Date().toISOString();
  }else{
    stock.push({
      sku:candidate.sku,
      category:candidate.category||'Номенклатура',
      name:candidate.name||candidate.sku,
      qty:Math.round(qty*1000)/1000,
      unit:candidate.unit||'шт.',
      location,
      unitPrice:stockItemUnitPrice(candidate),
      source:'manual-receipt',
      lastReceiptAt:new Date().toISOString()
    });
  }
  saveStock(stock);
  const after=before+qty;
  recordStockMovement({type:'receipt',sku:candidate.sku,qty,beforeQty:before,afterQty:after,location,source:'manual'});
  const cart=getCart();
  let cartChanged=false;
  cart.forEach(item=>{
    if(String(item.sku)===String(candidate.sku)){item.stock=after;cartChanged=true}
  });
  if(cartChanged)saveCart(cart);
  refreshStockFilterOptions();
  renderStock();
  closeStockReceipt();
  showStockActionMessage('Приход сохранён: '+candidate.sku+' · +'+qty+' '+(candidate.unit||'шт.')+' · остаток '+after+' '+(candidate.unit||'шт.')+'.','ok');
}
function stockConfiguratorRouteFromContext(context){
  const line=context?.line||'';
  const category=context?.category||'';
  let section='doors',system=line==='36 мм'?'36':line==='59 мм'?'59':'42',execution='single';
  if(/^Погонаж /.test(category))section='trim';
  if(category==='Откатная дверь 42')execution='sliding';
  if(category==='Двустворчатая дверь 42')execution='double';
  return {section,system,execution};
}
function applyStockContextToConfigurator(context){
  if(!context)return;
  const route=stockConfiguratorRouteFromContext(context);
  if($('catalogSection'))$('catalogSection').value=route.section;
  if($('catalogSystem'))$('catalogSystem').value=route.system;
  if($('doorExecution'))$('doorExecution').value=route.execution;
  syncTopCatalog(true);

  if(product()==='leaf36'){
    const collections=door36Collections();
    if(context.collection!=='Все коллекции'&&collections.includes(context.collection)){
      $('collection36').value=context.collection;
      updateLeaf36GroupSelect();
    }
    const groups=door36Groups($('collection36')?.value||'');
    if(context.group!=='Все группы'&&groups.includes(context.group)){
      $('group36').value=context.group;
      updateLeaf36ModelSelect();
    }
    const models=door36Models($('group36')?.value||'');
    if(context.model!=='Все модели'&&models.includes(context.model)){
      $('model36').value=context.model;
      updateLeaf36CatalogMeta();
    }
  }

  if(product()==='trim36'&&context.element&&context.element!=='Все элементы'&&$('trimType')){
    const vals=['Короб телескопический','Наличник телескопический','Добор телескопический','Притворная планка','Соединительная планка для стыковки доборов'];
    if(vals.includes(context.element)){$('trimType').value=context.element;renderTrimSize();}
  }
  if(product()==='trim42'&&context.element&&context.element!=='Все элементы'&&$('trim42Type')){
    const vals=['Профиль дверного короба 42','Торец BC3','Торец C4'];
    if(vals.includes(context.element)){$('trim42Type').value=context.element;renderTrim42Dynamic();}
  }
  if(product()==='trim59'&&context.element&&context.element!=='Все элементы'&&$('trim59Type')){
    const vals=['Профиль дверного короба 59','Торец 59 с четвертью'];
    if(vals.includes(context.element)){$('trim59Type').value=context.element;renderTrim59Dynamic();}
  }

  if(['single42','single59'].includes(product())&&$('includeBox')){
    $('includeBox').checked=/^Комплект:/.test(context.category||'');
    updateBundle42_59();
  }
  render();
}
function stockCreateContextText(context){
  return [context?.line,context?.category,
    context?.collection!=='Все коллекции'?context?.collection:'',
    context?.group!=='Все группы'?context?.group:'',
    context?.model!=='Все модели'?context?.model:'',
    context?.element!=='Все элементы'?context?.element:''
  ].filter(Boolean).join(' → ');
}
function renderStockCreateContextBanner(){
  const box=$('stockCreateContextBanner');if(!box)return;
  if(!stockNomenclatureCreateContext){box.classList.add('hidden');box.innerHTML='';return}
  box.className='status info';
  box.innerHTML='<b>Создание из склада:</b> '+escapeHtml(stockCreateContextText(stockNomenclatureCreateContext))+
    '<br><span class="mini">После создания SKU вы автоматически вернётесь в то же окно прихода с сохранёнными фильтрами.</span>'+
    '<div class="row" style="margin-top:8px"><button class="ghost" type="button" onclick="cancelStockNomenclatureCreate()">Вернуться на склад</button></div>';
}
function cancelStockNomenclatureCreate(){
  const context=stockNomenclatureCreateContext;
  stockNomenclatureCreateContext=null;
  renderStockCreateContextBanner();
  showView('stock');
  openStockReceipt('',context);
}
function stockRegistryMetaForCurrentConfig(){
  const line=product()==='leaf36'||product()==='trim36'?'36 мм':
    ['single42','sliding42','double42','trim42'].includes(product())?'42 мм':
    ['single59','trim59'].includes(product())?'59 мм':'Другое';
  let category=categoryLabel();
  if(product()==='leaf36')category='Дверь 36';
  if(product()==='trim36')category='Погонаж 36';
  if(product()==='single42')category=includeBox()?'Комплект: скрытая дверь + короб 42':'Дверь скрытая 42';
  if(product()==='sliding42')category='Откатная дверь 42';
  if(product()==='double42')category='Двустворчатая дверь 42';
  if(product()==='trim42')category='Погонаж 42';
  if(product()==='single59')category=includeBox()?'Комплект: скрытая дверь + короб 59':'Дверь скрытая 59';
  if(product()==='trim59')category='Погонаж 59';
  return {stockReceiptCategory:category,stockProductLineHint:line,productType:product()};
}
function returnToStockReceiptAfterCreate(record){
  if(!stockNomenclatureCreateContext)return false;
  const context=stockNomenclatureCreateContext;
  stockNomenclatureCreateContext=null;
  renderStockCreateContextBanner();
  showView('stock');
  openStockReceipt(record?.sku||'',context);
  return true;
}
function goCreateNomenclatureFromStock(){
  stockNomenclatureCreateContext=stockReceiptFilterContext();
  closeStockReceipt();
  showView('configurator');
  applyStockContextToConfigurator(stockNomenclatureCreateContext);
  renderStockCreateContextBanner();
  window.scrollTo({top:0,behavior:'smooth'});
}

function initStockFilters(){
  refreshStockFilterOptions();
  $('stockSearch').addEventListener('input',renderStock);
  $('stockCategory').addEventListener('change',renderStock);
  $('stockLine')?.addEventListener('change',renderStock);
  $('onlyAvailable').addEventListener('change',renderStock);
}

function renderStock(){
  updateStockNavCount();
  const stock=getStock();
  const q=($('stockSearch')?.value||'').trim().toLowerCase();
  const cat=$('stockCategory')?.value||'Все категории';
  const line=$('stockLine')?.value||'Все линейки';
  const only=$('onlyAvailable')?.checked??true;
  const filtered=stock.filter(x=>{
    const visual=stock36DoorVisual(x);
    const hay=`${x.sku} ${x.category} ${x.name} ${x.location} ${visual?.model||''} ${visual?.collection||''} ${visual?.group||''}`.toLowerCase();
    return (!q||hay.includes(q)) &&
      (cat==='Все категории'||x.category===cat) &&
      (line==='Все линейки'||stockProductLine(x)===line) &&
      (!only||x.qty>0);
  });
  $('stockSkuCount').textContent=stock.length;
  $('stockAvailableCount').textContent=stock.filter(x=>Number(x.qty)>0).length;
  $('stockUnitsCount').textContent=stock.reduce((s,x)=>s+Number(x.qty||0),0);
  $('stockList').innerHTML=filtered.length?filtered.map(x=>{
    const price=stockItemUnitPrice(x);
    const lineName=stockProductLine(x);
    const salesPriceType=typeof stockSalesPriceType==='function'?stockSalesPriceType(x):null;
    return `
    <div class="stock-card">
      ${stockItemVisualHtml(x)}
      <div class="stock-card-body">
        <div class="stock-card-head">
          <div>
            <div class="mini">${escapeHtml(x.category)} · ${escapeHtml(lineName)}</div>
            <h3>${escapeHtml(x.name)}</h3>
          </div>
          <div class="stock-price">${price===null?'<span class="mini">Цена по запросу</span>':formatRub(price)}</div>
        </div>
        ${stockItemVisualMeta(x)}
        <div class="stock-meta">
          <span class="stock-badge">${escapeHtml(x.sku)}</span>
          ${salesPriceType?'<span class="stock-badge price-tier-badge">'+escapeHtml(salesPriceTypeLabel(salesPriceType))+'</span>':''}
          <span class="stock-badge ${x.qty>0?'ok':'zero'}">${x.qty>0?`В наличии: ${x.qty} ${x.unit}`:'Нет в наличии'}</span>
        </div>
        <div class="mini">${escapeHtml(x.location||'Место хранения не указано')}</div>
        <div class="stock-actions">
          <input id="stockQty_${x.sku}" type="number" min="1" max="${Math.max(1,x.qty)}" value="1" ${x.qty<=0?'disabled':''}>
          <button onclick="addStockToCart('${x.sku}')" ${x.qty<=0?'disabled':''}>Добавить в заказ</button>
          <button class="secondary stock-write hidden" type="button" onclick="openStockReceipt('${x.sku}')">+ Приход</button>
          <button class="ghost stock-delete hidden" type="button" onclick="deleteStockItem('${x.sku}')">Удалить со склада</button>
        </div>
      </div>
    </div>`;
  }).join(''):'<div class="empty full">По выбранным фильтрам ничего не найдено.</div>';
  updateRoleUI();
}

function deleteStockItem(sku){
  if(!can('stockDelete'))return;
  const stock=getStock();
  const item=stock.find(x=>String(x.sku)===String(sku));
  if(!item)return;
  const confirmed=confirm('Удалить позицию со склада?\n\n'+item.sku+'\n'+item.name+'\n\nSKU и сама номенклатура не удаляются — исчезнет только складская позиция.');
  if(!confirmed)return;

  const before=Number(item.qty||0);
  saveStock(stock.filter(x=>String(x.sku)!==String(sku)));
  recordStockMovement({
    type:'manual-stock-delete',
    sku:item.sku,
    qty:-before,
    beforeQty:before,
    afterQty:0,
    location:item.location||'',
    source:'admin'
  });

  const cart=getCart();
  let cartChanged=false;
  cart.forEach(row=>{
    if(String(row.sku)===String(sku)){
      row.stock=0;
      cartChanged=true;
    }
  });
  if(cartChanged)saveCart(cart);

  refreshStockFilterOptions();
  renderStock();
  showStockActionMessage('Позиция удалена со склада: '+item.sku+'. Номенклатура сохранена.','ok');
}

function addStockToCart(sku){
  const item=getStock().find(x=>x.sku===sku);if(!item||item.qty<=0)return;
  const requested=Math.max(1,Number($(`stockQty_${sku}`)?.value||1));
  const cart=getCart();
  const priceType=typeof stockSalesPriceType==='function'?stockSalesPriceType(item):null;
  const lineKey=priceType?item.sku+'@PRICE:'+priceType:item.sku;
  const existing=cart.find(x=>cartKeyOf(x)===lineKey);
  const current=existing?Number(existing.qty):0;
  const total=Math.min(item.qty,current+requested);
  const unitPrice=stockItemUnitPrice(item);
  if(existing){
    existing.qty=total;existing.stock=item.qty;
    if(unitPrice!==null)existing.unitPrice=unitPrice;
    if(priceType)existing.priceType=priceType;
  }
  else cart.push({sku:item.sku,lineKey,name:item.name,category:item.category,stock:item.qty,unit:item.unit,qty:Math.min(requested,item.qty),unitPrice,priceType});
  saveCart(cart);
  alert(`Добавлено в заказ: ${item.sku}`);
}


function configuredCartSku(){
  const existing=findDuplicate(false);
  if(existing)return existing.sku;
  let h=2166136261, s=canonical();
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
  return 'CFG-'+(h>>>0).toString(16).toUpperCase().padStart(8,'0');
}
function configuredOrderLineKey(){
  const baseSku=configuredCartSku();
  const extras=selectedOrderExtras().map(x=>x.join('=')).sort();
  const companions=companionItems().map(x=>[x.key,x.name,x.qty,x.unit].join('=')).sort();
  const priceType=typeof configuredSalesPriceType==='function'?configuredSalesPriceType():null;
  const signature=JSON.stringify({baseSku,extras,companions,priceType});
  let h=2166136261;
  for(let i=0;i<signature.length;i++){h^=signature.charCodeAt(i);h=Math.imul(h,16777619)}
  return baseSku+'@'+(h>>>0).toString(16).toUpperCase().padStart(8,'0');
}
function cartKeyOf(item){return item?.lineKey||item?.sku||''}


function double42OrderHash(value){
  let h=2166136261,s=String(value||'');
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
  return (h>>>0).toString(16).toUpperCase().padStart(8,'0');
}
function double42SetCodeNumber(value){
  const match=String(value||'').trim().match(/^D42-(\d+)$/i);
  return match?Number(match[1]):0;
}
function double42SetCodeLabel(number){
  return 'D42-'+String(Math.max(1,Number(number)||1)).padStart(2,'0');
}
function double42NameWithSetCode(name,setCode){
  const raw=String(name||'').replace(/^D42-\d+\s*·\s*/i,'').trim();
  return setCode+(raw?' · '+raw:'');
}
function ensureDouble42SetCodes(cart){
  if(!Array.isArray(cart)||!cart.length)return Array.isArray(cart)?cart:[];
  const groups=new Map();
  cart.forEach((item,index)=>{
    const setKey=String(item?.double42SetKey||'');
    if(!setKey)return;
    if(!groups.has(setKey))groups.set(setKey,{rows:[],index});
    groups.get(setKey).rows.push(item);
  });
  if(!groups.size)return cart;

  const used=new Set();
  let next=1;
  for(const group of [...groups.values()].sort((a,b)=>a.index-b.index)){
    let code='';
    for(const row of group.rows){
      const candidate=String(row?.double42SetCode||row?.productionMeta?.double42SetCode||'').trim().toUpperCase();
      const number=double42SetCodeNumber(candidate);
      if(number>0&&!used.has(candidate)){code=candidate;break}
    }
    if(!code){
      while(used.has(double42SetCodeLabel(next)))next+=1;
      code=double42SetCodeLabel(next);
    }
    used.add(code);
    next=Math.max(next,double42SetCodeNumber(code)+1);
    group.rows.forEach(row=>{
      row.double42SetCode=code;
      row.name=double42NameWithSetCode(row.name,code);
      row.productionMeta={...(row.productionMeta||{}),double42SetCode:code};
    });
  }
  return cart;
}
function double42CartRowRank(item){
  const role=String(item?.double42ComponentRole||item?.productionMeta?.double42ComponentRole||'');
  if(role==='leaf-left'||(item?.source!=='bundle'&&item?.double42Leaf==='Left'))return 0;
  if(role==='leaf-right'||(item?.source!=='bundle'&&item?.double42Leaf==='Right'))return 1;
  if(role==='box'||item?.kind==='box-kit')return 2;
  return 3;
}
function ensureDouble42SetRowOrder(cart){
  if(!Array.isArray(cart)||!cart.length)return Array.isArray(cart)?cart:[];
  const groups=new Map();
  cart.forEach((item,index)=>{
    const setKey=String(item?.double42SetKey||'');
    if(!setKey)return;
    if(!groups.has(setKey))groups.set(setKey,[]);
    groups.get(setKey).push({item,index});
  });
  if(!groups.size)return cart;

  const emitted=new Set();
  const out=[];
  cart.forEach((item,index)=>{
    const setKey=String(item?.double42SetKey||'');
    if(!setKey){out.push(item);return}
    if(emitted.has(setKey))return;
    emitted.add(setKey);
    const group=(groups.get(setKey)||[]).slice().sort((a,b)=>{
      const rank=double42CartRowRank(a.item)-double42CartRowRank(b.item);
      return rank||a.index-b.index;
    });
    group.forEach(entry=>out.push(entry.item));
  });
  return out;
}
function normalizeDouble42Cart(cart){
  return ensureDouble42SetRowOrder(ensureDouble42SetCodes(cart));
}
function double42LeafLabel(prefix){return prefix==='Left'?'Левая створка':'Правая створка'}
function double42LeafOpening(prefix){return prefix==='Left'?'Левое на себя':'Правое на себя'}
function double42LeafWidth(prefix){return doubleWidth(prefix==='Left'?'left':'right')}
function double42LeafIsActive(prefix){
  const active=$('doubleLockLeaf')?.value||'Левая створка';
  return active===double42LeafLabel(prefix);
}
function double42LeafCanonicalForOrder(prefix){
  return [
    'DOUBLE42-LEAF','42',prefix,$('frame')?.value||'',currentHeight(),double42LeafWidth(prefix),
    double42LeafOpening(prefix),finishText(prefix,1),finishText(prefix,2),edgeText('Double')
  ].join('|').toUpperCase().replace(/\s+/g,' ').trim();
}
function double42LeafCartSku(prefix){
  return 'CFG-D42-'+(prefix==='Left'?'L':'R')+'-'+double42OrderHash(double42LeafCanonicalForOrder(prefix));
}
function double42LeafOrderName(prefix){
  const label=double42LeafLabel(prefix);
  const active=double42LeafIsActive(prefix);
  const parts=[
    label+' двустворчатой двери 42 мм',
    active?'Активная створка':'Пассивная створка',
    $('frame')?.value||'',
    currentHeight()+'x'+double42LeafWidth(prefix),
    double42LeafOpening(prefix),
    'Алюминиевый торец: '+edgeText('Double'),
    'Сторона 1: '+finishText(prefix,1),
    'Сторона 2: '+finishText(prefix,2)
  ];
  const hinge=$(prefix==='Left'?'doubleHingesLeft':'doubleHingesRight')?.value?.trim()||'';
  const hingeQty=Number($(prefix==='Left'?'doubleHingeQtyLeft':'doubleHingeQtyRight')?.value||0);
  if(hinge&&hingeQty>0)parts.push('Петли: '+hinge+' × '+hingeQty+' шт.');
  const handle=$(prefix==='Left'?'doubleHandleLeftSelect':'doubleHandleRightSelect')?.value||'Без ручки';
  parts.push(handle&&handle!=='Без ручки'?'Ручка: '+handle:'Без ручки');

  const lock=$('doorLock')?.value?.trim()||'';
  if(active&&lock)parts.push('Замок: '+lock);
  if(!active&&lock)parts.push('Ответная часть замка: '+lock);
  const cylinder=$('doorCylinder')?.value?.trim()||'';
  if(active&&cylinder)parts.push('Цилиндр: '+cylinder);
  if(!active&&$('doubleBolt')?.checked)parts.push('Ригель: PUNTO DHM-01 SN');

  const stopper=$(prefix==='Left'?'doubleStopperLeft':'doubleStopperRight')?.value?.trim()||'';
  if(stopper)parts.push('Стопор: '+stopper);
  const threshold=$(prefix==='Left'?'doubleThresholdLeft':'doubleThresholdRight')?.value?.trim()||'';
  if(threshold)parts.push('Автопорог: '+threshold);
  const vent=$(prefix==='Left'?'doubleVentLeft':'doubleVentRight')?.value||'';
  if(vent&&vent!=='Не требуется')parts.push('Вентрешётка: '+vent);
  const extra=$(prefix==='Left'?'doubleExtraLeft':'doubleExtraRight')?.value?.trim()||'';
  if(extra)parts.push('Доп. элемент: '+extra);

  const ops=[];
  const selected=(id,label)=>{if($(id)?.checked)ops.push(label)};
  selected(prefix==='Left'?'procStopperMillingLeft':'procStopperMillingRight','фрезеровка под скрытый стопор');
  selected(prefix==='Left'?'procThresholdMillingLeft':'procThresholdMillingRight','фрезеровка под автопорог');
  selected(prefix==='Left'?'procVentCutLeft':'procVentCutRight','врезка вентиляционной решётки');
  selected(prefix==='Left'?'procPortholeCutLeft':'procPortholeCutRight','врезка иллюминатора');
  selected(prefix==='Left'?'procPetDoorCutLeft':'procPetDoorCutRight','врезка дверцы для животного');
  if(active&&$('procSkudLockCut')?.checked)ops.push('врезка замка СКУД');
  if(ops.length)parts.push('Обработка: '+ops.join(', '));
  return parts.filter(Boolean).join(' / ');
}
function double42CompanionLeafPrefix(item){
  const key=String(item?.key||'');
  if(/^BUNDLE-P42-DOUBLE-|^BOX-MITER45-42-DOUBLE|^POWDER-COAT-42-DOUBLE$|^DOOR-CLOSER$/.test(key))return '';
  const leaf=String(item?.leaf||item?.activeLeaf||item?.passiveLeaf||'');
  if(leaf==='Левая створка')return 'Left';
  if(leaf==='Правая створка')return 'Right';
  if(key==='DOOR-CYLINDER')return double42LeafIsActive('Left')?'Left':'Right';
  if(/(?:HINGE|HANDLE|STOPPER|THRESHOLD|MILLING|VENT-GRILLE|ADDITIONAL-ELEMENT|VENT-GRILLE-CUT|PORTHOLE-CUT|PET-DOOR-CUT)-LEFT$/.test(key))return 'Left';
  if(/(?:HINGE|HANDLE|STOPPER|THRESHOLD|MILLING|VENT-GRILLE|ADDITIONAL-ELEMENT|VENT-GRILLE-CUT|PORTHOLE-CUT|PET-DOOR-CUT)-RIGHT$/.test(key))return 'Right';
  return '';
}
function double42CompanionVisibleName(item,prefix){
  const raw=String(item?.name||'');
  if(prefix){
    const label=double42LeafLabel(prefix);
    return raw.toLowerCase().includes(label.toLowerCase())?raw:label+' / '+raw;
  }
  return raw.startsWith('Двустворчатый комплект 42 / ')?raw:'Двустворчатый комплект 42 / '+raw;
}
function double42CompanionSku(item){
  const key=String(item?.key||'');
  const baseKey=String(item?.baseKey||key||'DOUBLE42-COMP');
  if(item?.kind==='box-kit'){
    const parts=item?.boxParts||{};
    const signature=[
      'DOUBLE42-BOX','42',
      Number(parts.left||0),Number(parts.right||0),Number(parts.top||0),
      String(item?.boxColorKey||''),
      String(item?.boxColor||'')
    ].join('|').toUpperCase();
    return 'CFG-D42-BOX-'+double42OrderHash(signature);
  }
  if(
    item?.kind==='service' ||
    /^PROCESS-|^BOX-MITER45-|^POWDER-COAT-/i.test(key) ||
    /^PROCESS-|^BOX-MITER45-|^POWDER-COAT-/i.test(baseKey)
  ){
    return String(baseKey||key).replace(/-(LEFT|RIGHT)$/i,'');
  }
  const supplierId=item?.supplierItemId;
  if(supplierId!==undefined&&supplierId!==null&&String(supplierId)!==''){
    return 'CAT-SUP-'+String(supplierId);
  }
  const identity=[baseKey,String(item?.name||'')].join('|').toUpperCase().replace(/\s+/g,' ').trim();
  return 'CAT-D42-'+double42OrderHash(identity);
}
function addConfiguredDouble42ToCart(){
  const setLineKey=configuredOrderLineKey();
  const cart=getCart();
  const existingSetCode=cart.find(x=>x.double42SetKey===setLineKey)?.double42SetCode||'';
  const usedSetCodes=new Set(cart.map(x=>String(x.double42SetCode||'')).filter(Boolean));
  let setCode=existingSetCode;
  if(!setCode){
    let nextSetNumber=1;
    while(usedSetCodes.has(double42SetCodeLabel(nextSetNumber)))nextSetNumber+=1;
    setCode=double42SetCodeLabel(nextSetNumber);
  }
  const currentPairQty=Math.max(0,...cart.filter(x=>x.double42SetKey===setLineKey&&x.source!=='bundle').map(x=>Number(x.qty||0)));
  const pairQty=currentPairQty+1;
  const priceType=typeof configuredSalesPriceType==='function'?configuredSalesPriceType():activeSalesPriceType();
  const baseMeta=(typeof doorProductionMeta==='function'?(doorProductionMeta()||{}):{});

  for(const prefix of ['Left','Right']){
    const side=prefix==='Left'?'left':'right';
    const label=double42LeafLabel(prefix);
    const sku=double42LeafCartSku(prefix);
    const lineKey=setLineKey+'::LEAF-'+prefix.toUpperCase();
    const price=typeof configuredPrice42LeafLine==='function'
      ?configuredPrice42LeafLine(prefix,doubleWidth(side),label,priceType)
      :null;
    const hit=cart.find(x=>cartKeyOf(x)===lineKey);
    const componentRole=prefix==='Left'?'leaf-left':'leaf-right';
    const productionMeta={...baseMeta,double42SetKey:setLineKey,double42SetCode:setCode,double42Leaf:prefix,leafLabel:label,active:double42LeafIsActive(prefix),double42ComponentRole:componentRole,countAsDoor:true};
    const row={
      sku,lineKey,name:double42NameWithSetCode(double42LeafOrderName(prefix),setCode),category:'Двустворчатая дверь 42 · '+label,
      stock:null,unit:'шт.',qty:pairQty,step:1,source:'production',
      extras:[['Комплект','Двустворчатая дверь 42'],['Створка',label],['Роль',double42LeafIsActive(prefix)?'Активная':'Пассивная']],
      productionMeta,
      unitPrice:price?.priceKnown?Number(price.unitPrice):null,
      priceType:price?.actualPriceType||priceType,
      priceNote:price?.priceKnown?'':(price?.note||'Цена створки требует согласования.'),
      double42SetKey:setLineKey,double42SetCode:setCode,double42Leaf:prefix,double42ComponentRole:componentRole,countAsDoor:true
    };
    if(hit)Object.assign(hit,row);
    else cart.push(row);
  }

  const leftLineKey=setLineKey+'::LEAF-LEFT';
  const rightLineKey=setLineKey+'::LEAF-RIGHT';
  companionItems().forEach(x=>{
    const prefix=double42CompanionLeafPrefix(x);
    const parentLineKey=prefix==='Left'?leftLineKey:prefix==='Right'?rightLineKey:null;
    const childLineKey=setLineKey+'::COMP::'+x.key;
    const bundleSku=double42CompanionSku(x);
    const perParentQty=Number(x.qty||0);
    const unitPrice=companionItemUnitPrice(x);
    const childPriceType=typeof companionSalesPriceType==='function'?companionSalesPriceType(x):null;
    const hit=cart.find(i=>cartKeyOf(i)===childLineKey);
    const componentRole=x.kind==='box-kit'
      ?'box'
      :prefix==='Left'
        ?'leaf-companion-left'
        :prefix==='Right'
          ?'leaf-companion-right'
          :'set-companion';
    const companionProductionMeta={
      double42SetKey:setLineKey,
      double42SetCode:setCode,
      double42Leaf:prefix||null,
      double42ComponentRole:componentRole,
      parentLineKey,
      countAsDoor:false
    };
    const row={
      sku:bundleSku,lineKey:childLineKey,name:double42NameWithSetCode(double42CompanionVisibleName(x,prefix),setCode),
      category:x.type,stock:null,unit:x.unit,qty:perParentQty*pairQty,step:x.step||1,
      source:'bundle',kind:x.kind||'bundle',parentLineKey,
      parentDoorSku:prefix?double42LeafCartSku(prefix):null,
      perParentQty,baseKey:x.baseKey||x.key,boxPart:x.boxPart||null,boxMiter45:!!x.boxMiter45,
      unitPrice,priceType:childPriceType,double42SetKey:setLineKey,double42SetCode:setCode,double42Leaf:prefix||null,
      double42ComponentRole:componentRole,countAsDoor:false,productionMeta:companionProductionMeta
    };
    if(hit)Object.assign(hit,row);
    else cart.push(row);
  });

  saveCart(cart);
  const message=$('cartAddMessage');
  if(message){
    message.className='status ok';
    message.innerHTML='Добавлено в корзину сделки: <b>2 отдельные створки двустворчатой двери 42</b> + выбранная комплектация.';
    message.classList.remove('hidden');
  }
  updateCartCount();
}

function configuredCartStep(){
  if(product()==='trim42'&&($('trim42Sale')?.value||'')==='Метраж')return 0.001;
  if(product()==='trim59'&&($('trim59Sale')?.value||'')==='Метраж')return 0.001;
  return 1;
}
function configuredCartUnit(){
  if(product()==='trim42'&&typeof price42TrimProfileCalculation==='function'){
    const calc=price42TrimProfileCalculation(price42TrimProfileCurrentState(),activeSalesPriceType());
    if(calc?.ok&&calc.unit)return calc.unit;
  }
  if(product()==='trim59'&&typeof price59TrimProfileCalculation==='function'){
    const calc=price59TrimProfileCalculation(price59TrimProfileCurrentState(),activeSalesPriceType());
    if(calc?.ok&&calc.unit)return calc.unit;
  }
  return 'шт.';
}

function addConfiguredToCart(){
  const v=validate(); if(v.errs.length){alert('Сначала исправьте ошибки конфигурации.');return}
  if(product()==='double42'){addConfiguredDouble42ToCart();return}
  const match=stockMatch();
  const sku=match?.sku||configuredCartSku();
  const lineKey=configuredOrderLineKey();
  const cart=getCart();
  const existing=cart.find(x=>cartKeyOf(x)===lineKey);
  const stock=match?match.qty:null;
  const configuredUnitPrice=configuredCatalogUnitPrice();
  const configuredPriceType=typeof configuredSalesPriceType==='function'?configuredSalesPriceType():null;
  const configuredPriceNote=product()==='single59'&&typeof configured59PriceNote==='function'
    ?configured59PriceNote(configuredPriceType||activeSalesPriceType())
    :product()==='trim59'&&typeof configuredTrim59PriceNote==='function'
      ?configuredTrim59PriceNote(configuredPriceType||activeSalesPriceType())
      :product()==='trim42'&&typeof configuredTrim42PriceNote==='function'
        ?configuredTrim42PriceNote(configuredPriceType||activeSalesPriceType())
        :product()==='double42'&&typeof configuredDouble42PriceNote==='function'
          ?configuredDouble42PriceNote(configuredPriceType||activeSalesPriceType())
          :(typeof configured42PriceNote==='function'?configured42PriceNote(configuredPriceType||activeSalesPriceType()):'');
  if(existing){
    existing.qty=Number(existing.qty||0)+1;
    existing.productionMeta=doorProductionMeta();
    existing.priceNote=configuredPriceNote||'';
    existing.unit=configuredCartUnit();
    existing.step=configuredCartStep();
    if(configuredUnitPrice!==null)existing.unitPrice=configuredUnitPrice;
    else if(configuredPriceNote)existing.unitPrice=null;
    if(configuredPriceType)existing.priceType=configuredPriceType;
  }
  else cart.push({sku,lineKey,name:longName(),category:categoryLabel(),stock,unit:configuredCartUnit(),qty:1,step:configuredCartStep(),source:match?'stock':'production',extras:selectedOrderExtras(),productionMeta:doorProductionMeta(),unitPrice:configuredUnitPrice,priceType:configuredPriceType,priceNote:configuredPriceNote});

  const parent=cart.find(i=>cartKeyOf(i)===lineKey);
  const parentQty=Number(parent?.qty||1);
  companionItems().forEach(x=>{
    const bundleSku=x.key+'-'+configuredCartSku().replace('CFG-','');
    const childLineKey=lineKey+'::'+x.key;
    const hit=cart.find(i=>cartKeyOf(i)===childLineKey);
    const perParentQty=Number(x.qty||0);
    const bundleUnitPrice=companionItemUnitPrice(x);
    const bundlePriceType=typeof companionSalesPriceType==='function'?companionSalesPriceType(x):null;
    if(hit){
      hit.parentLineKey=lineKey;
      hit.parentDoorSku=sku;
      hit.perParentQty=perParentQty;
      hit.kind=x.kind||'bundle';
      hit.baseKey=x.baseKey||x.key;
      hit.boxPart=x.boxPart||null;
      hit.boxMiter45=!!x.boxMiter45;
      hit.qty=perParentQty*parentQty;
      if(bundleUnitPrice!==null)hit.unitPrice=bundleUnitPrice;
      if(bundlePriceType)hit.priceType=bundlePriceType;
    }else{
      cart.push({sku:bundleSku,lineKey:childLineKey,name:x.name,category:x.type,stock:null,unit:x.unit,qty:perParentQty*parentQty,step:x.step||1,source:'bundle',kind:x.kind||'bundle',parentLineKey:lineKey,parentDoorSku:sku,perParentQty,baseKey:x.baseKey||x.key,boxPart:x.boxPart||null,boxMiter45:!!x.boxMiter45,unitPrice:bundleUnitPrice,priceType:bundlePriceType});
    }
  });

  saveCart(cart);
  const message=$('cartAddMessage');
  if(message){
    message.className='status ok';
    message.innerHTML='Добавлено в корзину сделки: <b>'+escapeHtml(sku)+'</b>. Можно выбрать следующую конфигурацию.';
    message.classList.remove('hidden');
  }
  updateCartCount();
}

const CART_RETAIL_DISCOUNT_STORE='hd_v115_cart_retail_discount';
function cartDiscountRoleAllowed(){return can('cartDiscount')}
function bitrixDealPushAllowed(){return can('bitrixDeal')}
function getCartRetailDiscountPercent(){
  const raw=Number(getStore(CART_RETAIL_DISCOUNT_STORE,0));
  if(!Number.isFinite(raw))return 0;
  return Math.max(0,Math.min(10,Math.round(raw)));
}
function setCartRetailDiscountPercent(value){
  if(!cartDiscountRoleAllowed())return;
  let percent=Number(value);
  if(!Number.isFinite(percent))percent=0;
  percent=Math.max(0,Math.min(10,Math.round(percent)));
  setStore(CART_RETAIL_DISCOUNT_STORE,percent);
  const input=$('cartRetailDiscount');
  if(input&&Number(input.value)!==percent)input.value=percent;
  renderCart();
}
function cartItemRetailDiscountPercent(item,percent=getCartRetailDiscountPercent()){
  return cartStoredPriceType(item)==='retail'?Math.max(0,Math.min(10,Number(percent)||0)):0;
}
function cartItemEffectiveUnitPrice(item,percent=getCartRetailDiscountPercent()){
  const base=cartItemUnitPrice(item);
  if(base===null||!Number.isFinite(Number(base)))return null;
  const discount=cartItemRetailDiscountPercent(item,percent);
  return discount>0?Math.ceil(Number(base)*(1-discount/100)):Number(base);
}
function cartItemEffectiveLineTotal(item,percent=getCartRetailDiscountPercent()){
  const price=cartItemEffectiveUnitPrice(item,percent);
  const qty=Number(item?.qty||0);
  return price===null||!Number.isFinite(price)||!Number.isFinite(qty)?null:price*qty;
}
function cartEffectivePriceSummary(cart,percent=getCartRetailDiscountPercent()){
  let total=0,baseTotal=0,priced=0,unpriced=0,retailDiscountAmount=0,discountedLines=0;
  for(const item of cart||[]){
    const base=cartItemUnitPrice(item);
    const qty=Number(item?.qty||0);
    const line=cartItemEffectiveLineTotal(item,percent);
    if(line===null){unpriced++;continue}
    priced++;total+=line;
    if(base!==null&&Number.isFinite(Number(base))&&Number.isFinite(qty)){
      const baseLine=Number(base)*qty;
      baseTotal+=baseLine;
      const diff=Math.max(0,baseLine-line);
      if(diff>0){retailDiscountAmount+=diff;discountedLines++}
    }
  }
  return {total,baseTotal,priced,unpriced,retailDiscountAmount,discountedLines,complete:unpriced===0};
}
function buildBitrixDealCartPayload(){
  const discountPercent=getCartRetailDiscountPercent();
  return {
    schema:'hd-bitrix-deal-cart-v1',
    createdAt:new Date().toISOString(),
    retailDiscountPercent:discountPercent,
    rows:getCart().map(item=>({
      sku:item.sku||'',
      lineKey:cartKeyOf(item),
      parentLineKey:item.parentLineKey||null,
      parentDoorSku:item.parentDoorSku||null,
      setLineKey:item.double42SetKey||null,
      setCode:item.double42SetCode||null,
      leaf:item.double42Leaf||null,
      componentRole:item.double42ComponentRole||null,
      countAsDoor:item.countAsDoor===true,
      kind:item.kind||null,
      baseKey:item.baseKey||null,
      name:item.name||'',
      category:item.category||'',
      qty:Number(item.qty||0),
      unit:item.unit||'шт.',
      priceType:cartStoredPriceType(item),
      baseUnitPrice:cartItemUnitPrice(item),
      discountPercent:cartItemRetailDiscountPercent(item,discountPercent),
      unitPrice:cartItemEffectiveUnitPrice(item,discountPercent),
      source:item.source||'',
      extras:Array.isArray(item.extras)?item.extras:[],
      productionMeta:item.productionMeta||null
    }))
  };
}
async function pushCartToBitrixDeal(){
  if(!bitrixDealPushAllowed())return;
  const cart=getCart();
  const message=$('bitrixDealMessage');
  if(!cart.length){
    if(message){message.className='status warn';message.textContent='Корзина сделки пуста.';message.classList.remove('hidden')}
    return;
  }
  const payload=buildBitrixDealCartPayload();
  const adapter=window.HD_BITRIX_ADAPTER;
  if(adapter&&typeof adapter.addCartToCurrentDeal==='function'){
    try{
      if(message){message.className='status info';message.textContent='Передаём номенклатуру в текущую сделку Bitrix24…';message.classList.remove('hidden')}
      const result=await adapter.addCartToCurrentDeal(payload);
      if(message){
        message.className='status ok';
        message.innerHTML='Комплектация передана в сделку Bitrix24'+(result?.dealId?' <b>#'+escapeHtml(result.dealId)+'</b>':'')+'.';
      }
      return;
    }catch(error){
      if(message){message.className='status err';message.textContent='Bitrix24: '+String(error?.message||error);message.classList.remove('hidden')}
      return;
    }
  }
  setStore('hd_v115_bitrix_preview_payload',payload);
  if(message){
    message.className='status info';
    message.innerHTML='<b>Preview-режим:</b> пакет номенклатуры сформирован и сохранён локально. Реальная отправка включится после подключения Bitrix24 adapter к этой кнопке.';
    message.classList.remove('hidden');
  }
}

function renderCart(){
  const cart=getCart();
  $('cartEmpty').classList.toggle('hidden',cart.length>0);
  $('cartContent').classList.toggle('hidden',cart.length===0);
  if(!cart.length){
    if($('cartPriceSummary'))$('cartPriceSummary').innerHTML='';
    updateCartCount();return
  }
  const discountPercent=getCartRetailDiscountPercent();
  $('cartBody').innerHTML=cart.map(x=>{
    const baseUnitPrice=cartItemUnitPrice(x);
    const discount=cartItemRetailDiscountPercent(x,discountPercent);
    const unitPrice=cartItemEffectiveUnitPrice(x,discountPercent);
    const lineTotal=cartItemEffectiveLineTotal(x,discountPercent);
    const linkedDouble42Child=!!x.double42SetKey&&x.source==='bundle';
    const linkedDouble42Main=!!x.double42SetKey&&x.source!=='bundle';
    const qtyControl=linkedDouble42Child
      ?'<span class="mini"><b>'+escapeHtml(String(x.qty))+'</b> · связано с комплектом</span>'
      :'<input type="number" min="0" step="'+(x.step||1)+'" '+(x.stock==null?'':'max="'+x.stock+'"')+' value="'+x.qty+'" onchange="changeCartQty(\''+cartKeyOf(x)+'\',this.value)">';
    const removeControl=linkedDouble42Child
      ?'<span class="mini">В составе комплекта</span>'
      :'<button class="ghost" onclick="removeCartItem(\''+cartKeyOf(x)+'\')">'+(linkedDouble42Main?'Удалить комплект':'Удалить')+'</button>';
    return `
    <tr>
      <td><b>${escapeHtml(x.sku)}</b></td>
      <td>${escapeHtml(x.name)}${x.extras?.length?`<div class="mini">${x.extras.map(e=>escapeHtml(e[0]+': '+e[1])).join(' · ')}</div>`:''}</td>
      <td>${x.stock==null?'<span class="stock-badge">Под заказ</span>':x.stock+' '+escapeHtml(x.unit)}</td>
      <td>${unitPrice===null?'<span class="mini">'+escapeHtml(x.priceNote||'По запросу')+'</span>':
        (discount>0?'<div class="cart-price-old">'+formatRub(baseUnitPrice)+'</div><b>'+formatRub(unitPrice)+'</b><div class="cart-discount-chip">−'+discount+'% от розницы</div>':'<b>'+formatRub(unitPrice)+'</b>')}${cartStoredPriceType(x)?'<div class="price-tier-inline">'+escapeHtml(salesPriceTypeLabel(cartStoredPriceType(x)))+'</div>':''}</td>
      <td>${qtyControl}</td>
      <td>${lineTotal===null?'<span class="mini">—</span>':'<b>'+formatRub(lineTotal)+'</b>'}</td>
      <td>${removeControl}</td>
    </tr>`;
  }).join('');
  const summary=cartEffectivePriceSummary(cart,discountPercent);
  const salesTypes=[...new Set(cart.map(x=>cartStoredPriceType(x)).filter(Boolean))];
  if($('cartPriceSummary')){
    $('cartPriceSummary').innerHTML=
      '<div class="result" style="margin-top:12px"><div class="cap">Итого по заказу</div><div class="val">'+formatRub(summary.total)+'</div>'+
      (summary.unpriced?'<div class="mini" style="margin-top:6px">Не включено в итог позиций без установленной цены: '+summary.unpriced+'.</div>':'')+
      (salesTypes.length?'<div class="mini" style="margin-top:6px">Типы цен в корзине: <b>'+salesTypes.map(salesPriceTypeLabel).join(', ')+'</b>.</div>':'')+
      (summary.retailDiscountAmount>0?'<div class="cart-saving">Скидка от розничных строк: −'+formatRub(summary.retailDiscountAmount)+' · '+discountPercent+'%</div>':'')+
      '<div class="mini" style="margin-top:6px">Скидка применяется только к строкам «Розница». Опт 1 и Опт 2 не изменяются.</div></div>';
  }
  const discountInput=$('cartRetailDiscount');
  if(discountInput)discountInput.value=discountPercent;
  const discountHint=$('cartRetailDiscountHint');
  if(discountHint){
    discountHint.textContent=discountPercent>0
      ?'Активна скидка '+discountPercent+'% только для розничных строк. Экономия: '+formatRub(summary.retailDiscountAmount)+'.'
      :'Скидка не задана. Можно вручную установить от 1 до 10% для розничных строк.';
  }
  updateRoleUI();
  applyProfileToOrder(false);
  const draft=getDraft();
  if(draft.comment!==undefined){
    $('orderDelivery').value=draft.delivery||$('orderDelivery').value;
    $('orderDate').value=draft.date||'';
    $('orderAddress').value=draft.address||$('orderAddress').value;
    $('orderComment').value=draft.comment||'';
  }
  updateCartCount();
}

function changeCartQty(lineKey,val){
  const cart=getCart(),item=cart.find(x=>cartKeyOf(x)===lineKey);if(!item)return;
  if(item.double42SetKey&&item.source==='bundle'){
    const q=Math.max(1,...cart.filter(x=>x.double42SetKey===item.double42SetKey&&x.source!=='bundle').map(x=>Number(x.qty||1)));
    cart.filter(x=>x.double42SetKey===item.double42SetKey).forEach(x=>{
      if(x.source==='bundle'&&Number(x.perParentQty)>0)x.qty=Number(x.perParentQty)*q;
      else if(x.source!=='bundle')x.qty=q;
    });
    saveCart(cart);renderCart();return;
  }
  const min=item.source==='bundle'?0:1;
  item.qty=item.stock==null?Math.max(min,Number(val)||min):Math.max(min,Math.min(item.stock,Number(val)||min));
  if(item.double42SetKey&&item.source!=='bundle'){
    const q=Number(item.qty||1);
    cart.filter(x=>x.double42SetKey===item.double42SetKey).forEach(x=>{
      if(x.source==='bundle'&&Number(x.perParentQty)>0)x.qty=Number(x.perParentQty)*q;
      else if(x.source!=='bundle')x.qty=q;
    });
  }else if(item.source!=='bundle'){
    cart.filter(x=>x.source==='bundle'&&x.parentLineKey===lineKey&&Number(x.perParentQty)>0)
      .forEach(x=>{x.qty=Number(x.perParentQty)*Number(item.qty||0)});
  }
  saveCart(cart);renderCart();
}
function removeCartItem(lineKey){
  const cart=getCart(),item=cart.find(x=>cartKeyOf(x)===lineKey);if(!item)return;
  const next=item.double42SetKey
    ?cart.filter(x=>x.double42SetKey!==item.double42SetKey)
    :item.source==='bundle'
      ?cart.filter(x=>cartKeyOf(x)!==lineKey)
      :cart.filter(x=>cartKeyOf(x)!==lineKey && x.parentLineKey!==lineKey);
  saveCart(next);renderCart();
}
function clearCart(){
  if(!getCart().length)return;
  if(confirm('Очистить текущий заказ?')){saveCart([]);renderCart()}
}

function loadProfile(){
  const p=getProfile();
  $('profileCompany').value=p.company||'';
  $('profileContact').value=p.contact||'';
  $('profilePhone').value=p.phone||'';
  $('profileEmail').value=p.email||'';
  $('profileCity').value=p.city||'';
  $('profileDelivery').value=p.delivery||'Самовывоз';
  $('profileAddress').value=p.address||'';
}

function saveProfile(){
  const p={
    company:$('profileCompany').value.trim(),
    contact:$('profileContact').value.trim(),
    phone:$('profilePhone').value.trim(),
    email:$('profileEmail').value.trim(),
    city:$('profileCity').value.trim(),
    delivery:$('profileDelivery').value,
    address:$('profileAddress').value.trim()
  };
  setStore('hd_v5_profile',p);
  const b=$('profileMessage');b.className='status ok';b.textContent='Профиль сохранён в этом браузере.';
  applyProfileToOrder(false);
}

function applyProfileToOrder(overwrite=true){
  const p=getProfile();
  const map=[
    ['orderCompany',p.company],['orderContact',p.contact],['orderPhone',p.phone],
    ['orderEmail',p.email],['orderAddress',[p.city,p.address].filter(Boolean).join(', ')]
  ];
  map.forEach(([id,val])=>{
    if($(id) && (overwrite||!$(id).value))$(id).value=val||'';
  });
  if($('orderDelivery') && (overwrite||!$('orderDelivery').value))$('orderDelivery').value=p.delivery||'Самовывоз';
}

function collectOrderForm(){
  return {
    company:$('orderCompany')?.value.trim()||'',
    contact:$('orderContact')?.value.trim()||'',
    phone:$('orderPhone')?.value.trim()||'',
    email:$('orderEmail')?.value.trim()||'',
    delivery:$('orderDelivery')?.value||'Самовывоз',
    date:$('orderDate')?.value||'',
    address:$('orderAddress')?.value.trim()||'',
    comment:$('orderComment')?.value.trim()||''
  };
}

function saveOrderDraft(){
  if(!getCart().length)return;
  const draft=collectOrderForm();
  setStore('hd_v5_order_draft',draft);
  const b=$('orderMessage');b.className='status info';b.textContent='Черновик заказа сохранён локально.';
}

function submitOrder(){
  const cart=getCart();if(!cart.length)return;
  const form=collectOrderForm();
  const errors=[];
  if(!form.company)errors.push('Укажите заказчика / компанию.');
  if(!form.contact)errors.push('Укажите контактное лицо.');
  if(!form.phone)errors.push('Укажите телефон.');
  if(errors.length){
    const b=$('orderMessage');b.className='status err';b.innerHTML='<b>Не хватает данных:</b><br>'+errors.map(x=>'• '+escapeHtml(x)).join('<br>');
    return;
  }
  const orders=getOrders();
  const now=new Date();
  const seq=String(orders.length+1).padStart(3,'0');
  const num=`HD-ORD-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${seq}`;
  orders.unshift({number:num,status:'Оформлен',created:now.toLocaleString('ru-RU'),form,items:cart,pricing:{retailDiscountPercent:getCartRetailDiscountPercent()}});
  saveOrders(orders);
  saveCart([]);
  setStore('hd_v5_order_draft',{});
  const b=$('orderMessage');b.className='status ok';b.innerHTML=`Заказ <b>${num}</b> оформлен в прототипе. Реальная отправка в Bitrix24 пока не подключена.`;
  renderCart();
  renderOrderHistory();
}

function renderOrderHistory(){
  const orders=getOrders();
  $('orderHistory').innerHTML=orders.length?orders.map(o=>`
    <div class="history-item">
      <div class="history-head"><b>${escapeHtml(o.number)}</b><span class="stock-badge ok">${escapeHtml(o.status)}</span></div>
      <div class="mini">${escapeHtml(o.created)} · ${o.items.reduce((s,x)=>s+Number(x.qty),0)} ед. · ${escapeHtml(o.form.delivery)}${cartEffectivePriceSummary(o.items,o.pricing?.retailDiscountPercent||0).priced?' · '+formatRub(cartEffectivePriceSummary(o.items,o.pricing?.retailDiscountPercent||0).total):''}</div>
      <div style="margin-top:7px">${o.items.slice(0,3).map(x=>`<div>${x.qty} × ${escapeHtml(x.sku)} — ${escapeHtml(x.name)}</div>`).join('')}${o.items.length>3?`<div class="muted">+ ещё ${o.items.length-3}</div>`:''}</div>
    </div>`).join(''):'<div class="empty">Оформленных заказов пока нет.</div>';
}
