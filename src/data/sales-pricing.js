// Sales price types used for doors, trim and other sellable catalog lines.
// Hardware BASE remains a separate Bitrix24 source until explicit sales-tier pricing is approved.
const SALES_PRICE_TYPES=Object.freeze([
  Object.freeze({id:'retail',label:'Розница',sort:1}),
  Object.freeze({id:'wholesale1',label:'Опт 1',sort:2}),
  Object.freeze({id:'wholesale2',label:'Опт 2',sort:3})
]);
const DEFAULT_SALES_PRICE_TYPE='wholesale2';
const SALES_PRICE_TYPE_STORE='hd_v76_sales_price_type';

const DOOR_SALES_TIER_POLICY=Object.freeze({
  door36:Object.freeze({label:'36 мм',wholesale1Markup:0.125,retailMarkup:0.50}),
  door42:Object.freeze({label:'42 мм',wholesale1Markup:0.125,retailMarkup:0.50}),
  door59:Object.freeze({label:'59 мм',wholesale1Markup:0.125,retailMarkup:0.50})
});
function doorSalesTierPolicy(group){
  return DOOR_SALES_TIER_POLICY[String(group||'')]||null;
}
// Important: this policy is intentionally limited to door nomenclature groups 36/42/59.
// Hardware, wall panels and other catalog groups must use their own separately approved pricing math.


function normalizeSalesPriceType(value){
  const id=String(value||'');
  return SALES_PRICE_TYPES.some(x=>x.id===id)?id:DEFAULT_SALES_PRICE_TYPE;
}
function salesPriceTypeMeta(value){
  const id=normalizeSalesPriceType(value);
  return SALES_PRICE_TYPES.find(x=>x.id===id)||SALES_PRICE_TYPES[2];
}
function salesPriceTypeLabel(value){return salesPriceTypeMeta(value).label}
function activeSalesPriceType(){
  return normalizeSalesPriceType(typeof getStore==='function'?getStore(SALES_PRICE_TYPE_STORE,DEFAULT_SALES_PRICE_TYPE):DEFAULT_SALES_PRICE_TYPE);
}
function salesPriceTypeOptionsHtml(selected=activeSalesPriceType()){
  const current=normalizeSalesPriceType(selected);
  return SALES_PRICE_TYPES.map(x=>'<option value="'+x.id+'" '+(x.id===current?'selected':'')+'>'+x.label+'</option>').join('');
}
function setActiveSalesPriceType(value,{refresh=true}={}){
  const id=normalizeSalesPriceType(value);
  if(typeof setStore==='function')setStore(SALES_PRICE_TYPE_STORE,id);
  const select=typeof $==='function'?$('salesPriceType'):null;
  if(select&&select.value!==id)select.value=id;
  if(refresh){
    if(typeof renderPartnerPrice36==='function')renderPartnerPrice36();
    if(typeof renderSalesPrice42==='function')renderSalesPrice42();
    if(typeof renderConfiguredPriceCard==='function')renderConfiguredPriceCard();
    if(typeof renderOrderExtras==='function')renderOrderExtras();
    if(typeof renderStock==='function'&&!$('viewStock')?.classList.contains('hidden'))renderStock();
    if(typeof renderCart==='function'&&!$('viewOrder')?.classList.contains('hidden'))renderCart();
  }
  return id;
}
function initSalesPriceTypeUI(){
  const select=typeof $==='function'?$('salesPriceType'):null;
  if(!select)return;
  select.innerHTML=salesPriceTypeOptionsHtml(activeSalesPriceType());
  select.value=activeSalesPriceType();
}


// v80: central sales price-book foundation.
// Price books are independent from product UI and are designed to become the sales layer
// above the future normative/factual cost engine.
const SALES_PRICE_BOOKS=Object.freeze([
  Object.freeze({
    id:'partner-2026-v1',
    name:'Партнёрский прайс Hidden Doors 2026',
    version:'2026.1',
    priceType:'wholesale2',
    priceTypeLabel:'Опт 2',
    status:'active',
    source:'Hidden doors Партнерский Прайс продуктовой линейки',
    sourceFileId:'10fH0RYUWVd5UWXJT6t7U8Iu1gJbI4LPpQWGPeQMF7mc',
    sourceUpdated:'22.01.2026',
    approvedAt:'19.09.2026',
    lookupPolicy:'exact-or-approved-formula'
  }),
  Object.freeze({
    id:'partner-2026-v1-wholesale1',
    name:'Опт 1 Hidden Doors 2026',
    version:'2026.1-opt1',
    priceType:'wholesale1',
    priceTypeLabel:'Опт 1',
    status:'active',
    source:'Расчёт от «Партнёрский прайс Hidden Doors 2026»',
    sourceFileId:'10fH0RYUWVd5UWXJT6t7U8Iu1gJbI4LPpQWGPeQMF7mc',
    sourceUpdated:'22.01.2026',
    approvedAt:'21.09.2026',
    lookupPolicy:'exact-or-approved-formula',
    derivedFrom:'partner-2026-v1',
    derivedFormula:'Опт 2 + 12,5%'
  }),
  Object.freeze({
    id:'partner-2026-v1-retail',
    name:'Розница Hidden Doors 2026',
    version:'2026.1-retail',
    priceType:'retail',
    priceTypeLabel:'Розница',
    status:'active',
    source:'Расчёт от «Партнёрский прайс Hidden Doors 2026»',
    sourceFileId:'10fH0RYUWVd5UWXJT6t7U8Iu1gJbI4LPpQWGPeQMF7mc',
    sourceUpdated:'22.01.2026',
    approvedAt:'21.09.2026',
    lookupPolicy:'exact-or-approved-formula',
    derivedFrom:'partner-2026-v1',
    derivedFormula:'Опт 2 + 50%'
  })
]);
const ACTIVE_SALES_PRICE_BOOK_BY_TYPE=Object.freeze({
  retail:'partner-2026-v1-retail',
  wholesale1:'partner-2026-v1-wholesale1',
  wholesale2:'partner-2026-v1'
});

function salesPriceBookById(id){
  return SALES_PRICE_BOOKS.find(x=>x.id===String(id||''))||null;
}
function activeSalesPriceBook(priceType=activeSalesPriceType()){
  const type=normalizeSalesPriceType(priceType);
  const id=ACTIVE_SALES_PRICE_BOOK_BY_TYPE[type]||'';
  return id?salesPriceBookById(id):null;
}
function salesPriceBookStatusLabel(status){
  return ({active:'Активен',draft:'Черновик',archived:'Архив'})[status]||String(status||'—');
}
function salesPriceBookPolicyLabel(policy){
  return policy==='exact'?'Только точное совпадение':policy==='exact-or-approved-formula'?'Точное правило или утверждённая формула':String(policy||'—');
}
function activeSalesPriceBookNote(priceType=activeSalesPriceType()){
  const book=activeSalesPriceBook(priceType);
  if(!book)return 'Для типа цены «'+salesPriceTypeLabel(priceType)+'» активный прайс пока не назначен.';
  return book.name+' · v'+book.version+' · '+book.source+' · обновлён '+book.sourceUpdated;
}

// Central rule: a sales price must never be silently inherited from a nearby size,
// frame, finish or product family.
function exactSalesPriceMatch(required,actual){
  const keys=Object.keys(required||{});
  return keys.every(key=>{
    const expected=required[key],value=actual?.[key];
    if(Array.isArray(expected))return expected.map(String).includes(String(value));
    return String(expected)===String(value);
  });
}

const SALES_PRICE_COVERAGE=Object.freeze([
  Object.freeze({block:'36 мм',area:'Полотно ПВХ',status:'connected',note:'Опт 2 / Опт 1 / Розница · +12,5% / +50% от Опт 2'}),
  Object.freeze({block:'36 мм',area:'Комплект / погонаж',status:'connected',note:'Три уровня цены подключены: Опт 2 / Опт 1 / Розница'}),
  Object.freeze({block:'42 мм',area:'Полотно · грунт / ПВХ / эмаль · фанера 1700–2200 / AL 1700–2300',status:'connected',note:'База и ПВХ следуют уровням Опт 2 / Опт 1 / Розница; эмаль 4 000 ₽/м² одинакова для всех уровней; шпон/HPL — после согласования'}),
  Object.freeze({block:'42 мм',area:'Комплект короба · H2000 · W600/700/800/900',status:'connected',note:'Опт 2: серый 5 594 ₽, чёрный 6 514 ₽; Опт 1 +12,5%, Розница +50%. Цена самостоятельная, не остаток от полного комплекта'}),
  Object.freeze({block:'59 мм',area:'Полотно / короб / стекло-зеркало',status:'connected',note:'Опт 2 подключён: полотно 19 863 / 20 539 ₽, короб 7 971 / 8 776 ₽; H≤2000 без уменьшения, выше — высотная шкала; полотно W≤900 ×1, W>900 ×W/900; Опт 1 +12,5%, Розница +50%'}),
  Object.freeze({block:'Фурнитура',area:'K8060 / K6360/38 / K2760 / Vantage',status:'connected',note:'Весь каталог фурнитуры по рознице. Для K8060, K6360/38, K2760 и магнитных Vantage действует лестница Опт 2 → Опт 1 → Розница. Для стандартных Vantage чёрный/серый/хром Опт 2 = 603 ₽ по партнёрскому прайсу; остальные Vantage рассчитываются от текущей розницы /1,50'}),
  Object.freeze({block:'Доп. работы',area:'Фрезеровки / врезки / стекло / RAL короба и прочее',status:'pending',note:'ПВХ и эмаль полотна 42 уже подключены в блоке двери; остальные дополнительные работы подключаются отдельно'}),
  Object.freeze({block:'Себестоимость',area:'36 мм · полотно ПВХ + короб',status:'connected',note:'Полотно и покупной короб считаются отдельными объектами по схеме закупка → списание → норма → тех. отход → факт → отклонение'})
]);

function salesPriceCoverageStatusMeta(status){
  return ({
    connected:{label:'Подключено',cls:'ok'},
    pending:{label:'Не подключено',cls:'warn'},
    external:{label:'Другой источник',cls:'info'},
    future:{label:'Следующий слой',cls:'info'}
  })[status]||{label:String(status||'—'),cls:'info'};
}
const PRICING_ADMIN_SECTION_STORE='hd_v83_pricing_admin_section';
const PRICING_ADMIN_SECTIONS=Object.freeze([
  Object.freeze({id:'overview',label:'Обзор'}),
  Object.freeze({id:'door36',label:'Двери 36'}),
  Object.freeze({id:'door42',label:'Двери 42'}),
  Object.freeze({id:'door59',label:'Двери 59'}),
  Object.freeze({id:'trim',label:'Погонаж'}),
  Object.freeze({id:'hardware',label:'Фурнитура'}),
  Object.freeze({id:'extras',label:'Доп. работы'}),
  Object.freeze({id:'cost',label:'Себестоимость'})
]);
function activePricingAdminSection(){
  const raw=typeof getStore==='function'?getStore(PRICING_ADMIN_SECTION_STORE,'overview'):'overview';
  return PRICING_ADMIN_SECTIONS.some(x=>x.id===raw)?raw:'overview';
}
function setPricingAdminSection(id){
  const next=PRICING_ADMIN_SECTIONS.some(x=>x.id===id)?id:'overview';
  if(typeof setStore==='function')setStore(PRICING_ADMIN_SECTION_STORE,next);
  renderPricingAdmin();
}
function pricingAdminNavHtml(active=activePricingAdminSection()){
  return '<div class="pricing-admin-nav">'+PRICING_ADMIN_SECTIONS.map(x=>
    '<button class="'+(x.id===active?'active':'')+'" onclick="setPricingAdminSection(\''+x.id+'\')">'+escapeHtml(x.label)+'</button>'
  ).join('')+'</div>';
}
function pricingAdminSectionHeader(title,subtitle,badge=''){
  return '<div class="pricing-section-head"><div><div class="pricing-section-title">'+escapeHtml(title)+'</div><div class="mini">'+escapeHtml(subtitle)+'</div></div>'+
    (badge?'<span class="pricing-section-badge">'+escapeHtml(badge)+'</span>':'')+'</div>';
}
function renderPricingOverview(){
  const active=activeSalesPriceBook('wholesale2');
  const connected=SALES_PRICE_COVERAGE.filter(x=>x.status==='connected').length;
  const unresolved=SALES_PRICE_COVERAGE.length-connected;
  return '<div class="pricing-admin-grid">'+
      '<div class="pricing-admin-card primary">'+
        '<div class="pricing-admin-kicker">Активный прайс · Опт 2</div>'+
        '<div class="pricing-admin-title">'+escapeHtml(active?.name||'Не назначен')+'</div>'+
        '<div class="pricing-admin-meta">'+
          '<span>Версия <b>'+escapeHtml(active?.version||'—')+'</b></span>'+
          '<span>Статус <b>'+escapeHtml(salesPriceBookStatusLabel(active?.status))+'</b></span>'+
          '<span>Источник обновлён <b>'+escapeHtml(active?.sourceUpdated||'—')+'</b></span>'+
          '<span>Утверждён <b>'+escapeHtml(active?.approvedAt||'—')+'</b></span>'+
        '</div>'+
        '<div class="pricing-admin-policy"><b>Правило цены:</b> '+escapeHtml(salesPriceBookPolicyLabel(active?.lookupPolicy))+
          '. Если нет точного правила или утверждённой формулы — цена не подставляется автоматически.</div>'+
      '</div>'+
      '<div class="pricing-admin-card">'+
        '<div class="pricing-admin-kicker">Контроль покрытия</div>'+
        '<div class="pricing-admin-big">'+connected+' / '+SALES_PRICE_COVERAGE.length+'</div>'+
        '<div class="mini">блоков уже подключены · '+unresolved+' ещё требуют настройки</div>'+
      '</div>'+
      '<div class="pricing-admin-card">'+
        '<div class="pricing-admin-kicker">Архитектура</div>'+
        '<div class="pricing-admin-title">Одна панель для всего каталога</div>'+
        '<div class="mini">Двери, погонаж, фурнитура, доп. работы и себестоимость постепенно подключаются к одному административному контуру.</div>'+
      '</div>'+
    '</div>'+
    '<div class="pricing-category-grid">'+
      [
        ['door36','36 мм','Полотно и погонаж: Опт 2 / Опт 1 / Розница','ok'],
        ['door42','42 мм','Три уровня цены + покрытия: ПВХ, общий каталог, эмаль; шпон/HPL по согласованию','ok'],
        ['door59','59 мм','Опт 2 подключён: полотно, короб и стекло/зеркало; Опт 1 +12,5%, Розница +50%','ok'],
        ['trim','Погонаж','36 мм подключён; 42/59 будут добавляться отдельно','info'],
        ['hardware','Фурнитура','Розница для всего каталога; отдельная лестница для K8060, K6360/38, K2760 и Vantage','ok'],
        ['extras','Доп. работы','Цены источника собраны, автоматизация впереди','warn'],
        ['cost','Себестоимость','36 мм: полотно и короб уже считаются отдельными объектами себестоимости','ok']
      ].map(([id,title,desc,status])=>'<button class="pricing-category-card" onclick="setPricingAdminSection(\''+id+'\')">'+
        '<span class="pricing-category-card-top"><b>'+escapeHtml(title)+'</b><span class="pricing-status '+status+'">'+escapeHtml(status==='ok'?'Подключено':status==='warn'?'В работе':'Отдельный слой')+'</span></span>'+
        '<span>'+escapeHtml(desc)+'</span>'+
      '</button>').join('')+
    '</div>'+
    '<div class="section">'+
      '<div class="section-title">Покрытие активным прайсом</div>'+
      '<div class="table-wrap"><table class="pricing-coverage-table"><thead><tr><th>Блок</th><th>Область</th><th>Статус</th><th>Комментарий</th></tr></thead><tbody>'+
      SALES_PRICE_COVERAGE.map(row=>{const m=salesPriceCoverageStatusMeta(row.status);return '<tr>'+
        '<td><b>'+escapeHtml(row.block)+'</b></td>'+
        '<td>'+escapeHtml(row.area)+'</td>'+
        '<td><span class="pricing-status '+m.cls+'">'+escapeHtml(m.label)+'</span></td>'+
        '<td>'+escapeHtml(row.note)+'</td>'+
      '</tr>'}).join('')+
      '</tbody></table></div>'+
    '</div>';
}
function renderPricing36Admin(){
  const opt2=typeof price36Book==='function'?price36Book('wholesale2'):null;
  const opt1=typeof price36Book==='function'?price36Book('wholesale1'):null;
  const retail=typeof price36Book==='function'?price36Book('retail'):null;
  if(!opt2||!opt1||!retail)return pricingAdminSectionHeader('Двери 36','Ценовые уровни пока не подключены полностью','Не подключено');
  const rows=[
    ['Полотно ПВХ 36 мм',opt2.doorLeaf,opt1.doorLeaf,retail.doorLeaf,'шт.'],
    ['Базовый комплект',opt2.doorKit,opt1.doorKit,retail.doorKit,'компл.'],
    ['Короб телескопический',opt2.trim?.box,opt1.trim?.box,retail.trim?.box,'шт.'],
    ['Наличник телескопический',opt2.trim?.casing,opt1.trim?.casing,retail.trim?.casing,'шт.'],
    ['Добор 100',opt2.trim?.dobor100,opt1.trim?.dobor100,retail.trim?.dobor100,'шт.'],
    ['Добор 150',opt2.trim?.dobor150,opt1.trim?.dobor150,retail.trim?.dobor150,'шт.'],
    ['Добор 200',opt2.trim?.dobor200,opt1.trim?.dobor200,retail.trim?.dobor200,'шт.'],
    ['Притворная планка',opt2.trim?.rebate,opt1.trim?.rebate,retail.trim?.rebate,'шт.'],
    ['Соединительная планка',opt2.trim?.connector,opt1.trim?.connector,retail.trim?.connector,'шт.']
  ];
  const kpi=(title,formula,leaf,kit,cls='')=>
    '<div class="pricing-admin-card '+cls+'">'+
      '<div class="pricing-admin-kicker">'+escapeHtml(title)+'</div>'+
      '<div class="pricing-admin-big">'+formatRub(leaf)+'</div>'+
      '<div class="mini">Полотно 36 мм · комплект <b>'+formatRub(kit)+'</b></div>'+
      '<div class="pricing-admin-policy">'+escapeHtml(formula)+'</div>'+
    '</div>';
  return pricingAdminSectionHeader('Двери 36 · уровни продажных цен','Все три уровня считаются от одной базы Опт 2. Опт 1 = +12,5%; Розница = +50%.','3 уровня подключены')+
    '<div class="pricing-admin-grid">'+
      kpi('Опт 2','Базовая утверждённая цена',opt2.doorLeaf,opt2.doorKit,'primary')+
      kpi('Опт 1','Опт 2 + 12,5%',opt1.doorLeaf,opt1.doorKit)+
      kpi('Розница','Опт 2 + 50%',retail.doorLeaf,retail.doorKit)+
    '</div>'+
    '<div class="pricing-admin-card pricing-wide-card"><div class="table-wrap"><table><thead><tr><th>Позиция</th><th>Опт 2</th><th>Опт 1</th><th>Розница</th><th>Ед.</th></tr></thead><tbody>'+
    rows.map(r=>'<tr><td><b>'+escapeHtml(r[0])+'</b></td><td>'+formatRub(r[1])+'</td><td>'+formatRub(r[2])+' <span class="pricing-status ok">+12,5%</span></td><td><b>'+formatRub(r[3])+'</b> <span class="pricing-status ok">+50%</span></td><td>'+escapeHtml(r[4])+'</td></tr>').join('')+
    '</tbody></table></div><div class="mini pricing-table-note">Опт 1 и Розница не хранят отдельные копии цен: обе цены автоматически пересчитываются при изменении Опт 2. Внутренний расчёт хранится до копеек; интерфейс отображает цену в рублях.</div></div>';
}
function renderPricing42Admin(){
  return pricingAdminSectionHeader('Двери 42 · три уровня цены','Опт 2 — база; Опт 1 = +12,5%; Розница = +50%. Подключены правила ПВХ и эмали полотна.','Покрытия подключены')+
    renderPricing42RuleEditor()+
    '<div class="pricing-admin-card pricing-wide-card"><div class="pricing-rule-block-title">Комплект короба 42 · фиксированная цена</div>'+
      '<div class="table-wrap"><table><thead><tr><th>Цвет</th><th>Опт 2</th><th>Опт 1</th><th>Розница</th><th>Область</th></tr></thead><tbody>'+
        '<tr><td><b>Серый / анод</b></td><td>'+formatRub(SALES_PRICE_42_BOX_OPT2.gray)+'</td><td>'+formatRub(price42ApplySalesTier(SALES_PRICE_42_BOX_OPT2.gray,'wholesale1'))+'</td><td>'+formatRub(price42ApplySalesTier(SALES_PRICE_42_BOX_OPT2.gray,'retail'))+'</td><td>H2000 · W600/700/800/900</td></tr>'+
        '<tr><td><b>Чёрный / анод</b></td><td>'+formatRub(SALES_PRICE_42_BOX_OPT2.black)+'</td><td>'+formatRub(price42ApplySalesTier(SALES_PRICE_42_BOX_OPT2.black,'wholesale1'))+'</td><td>'+formatRub(price42ApplySalesTier(SALES_PRICE_42_BOX_OPT2.black,'retail'))+'</td><td>H2000 · W600/700/800/900</td></tr>'+
      '</tbody></table></div>'+
      '<div class="mini pricing-table-note">Короб — самостоятельная ценовая позиция. Он не рассчитывается как остаток между ценой полного комплекта, полотном и фурнитурой.</div></div>'+
    '<div class="pricing-admin-card pricing-wide-card"><div class="pricing-rule-block-title">Покрытия полотна 42 мм</div>'+
      '<div class="pricing-roadmap-lines">'+
        '<div><b>ПВХ · каждая сторона</b><span class="pricing-status ok">1 725 ₽/м высоты</span><small>Ширина не влияет. Каталог Hidden Doors — без отдельной доплаты.</small></div>'+
        '<div><b>Общий каталог ПВХ</b><span class="pricing-status ok">+2 300 ₽ / дверь</span><small>Один раз, если хотя бы одна сторона выбрана из общего каталога; не удваивается при двух сторонах.</small></div>'+
        '<div><b>Эмаль</b><span class="pricing-status ok">4 000 ₽/м² / сторона</span><small>H × W × 4 000 × число сторон. Ставка одинаковая для Опт 2 / Опт 1 / Розницы; любой RAL без доплаты.</small></div>'+
        '<div><b>Шпон / HPL</b><span class="pricing-status info">После согласования</span><small>Финальная цена автоматически не рассчитывается.</small></div>'+
      '</div></div>'+
    '<div class="pricing-admin-card pricing-wide-card"><div class="pricing-rule-block-title">Следующий уровень 42 мм</div>'+
    '<div class="pricing-roadmap-lines">'+
      '<div><b>Полотно</b><span class="pricing-status ok">Подключено</span><small>База, высота, ширина, реверс + ПВХ / общий каталог / эмаль; шпон и HPL — после согласования</small></div>'+
      '<div><b>Комплект короба</b><span class="pricing-status ok">Подключено</span><small>H2000 · W600/700/800/900 · Опт 2: серый 5 594 ₽ / чёрный 6 514 ₽; Опт 1 +12,5%, Розница +50%</small></div>'+
      '<div><b>K8060 / K6360/38 / K2760</b><span class="pricing-status ok">Три типа цены</span><small>Опт 2 = Розница /1,50; Опт 1 = Опт 2 +12,5%; остальная фурнитура остаётся по рознице</small></div>'+
      '<div><b>Итог комплекта</b><span class="pricing-status warn">Следующий блок</span><small>Контроль против прайса 19 090 / 20 815</small></div>'+
    '</div></div>';
}
function renderPricingHardwareAdmin(){
  const rows=typeof hardwarePartnerOpt2Rows==='function'?hardwarePartnerOpt2Rows():[];
  const body=rows.length?rows.map(row=>
    '<tr><td><b>'+escapeHtml(row.category)+'</b></td><td>'+escapeHtml(row.name)+'</td><td><b>'+formatRub(row.opt2Price)+'</b></td><td>'+formatRub(row.opt1Price)+'</td><td>'+formatRub(row.retailPrice)+'</td><td><span class="pricing-status ok">Лестница</span></td></tr>'
  ).join(''):'<tr><td colspan="6" class="mini">Правила загрузятся вместе с каталогом фурнитуры.</td></tr>';
  return pricingAdminSectionHeader('Фурнитура · типы цен','Весь каталог фурнитуры хранит розничные цены. K8060, K6360/38, K2760 и магнитные Vantage получают полноценную лестницу Опт 2 → Опт 1 → Розница.','Три семейства подключены')+
    '<div class="pricing-admin-grid">'+
      '<div class="pricing-admin-card primary"><div class="pricing-admin-kicker">Вся прочая фурнитура</div><div class="pricing-admin-title">Розница</div><div class="mini">Оптовые типы для остальных позиций пока не рассчитываются.</div></div>'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Согласованные петли</div><div class="pricing-admin-big">3 семьи</div><div class="mini">K8060 · K6360/38 · K2760 · Vantage; колпачки K8060 не входят.</div></div>'+
      '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Логика</div><div class="pricing-admin-big">+12,5% / +50%</div><div class="mini">от Опт 2 до Опт 1 / Розницы.</div></div>'+
    '</div>'+
    '<div class="pricing-admin-card pricing-wide-card"><div class="pricing-rule-block-title">Петли с тремя типами цены</div>'+
      '<div class="table-wrap"><table><thead><tr><th>Категория</th><th>Позиция</th><th>Опт 2</th><th>Опт 1</th><th>Розница</th><th>Правило</th></tr></thead><tbody>'+body+'</tbody></table></div>'+
      '<div class="mini pricing-table-note">Опт 2 восстанавливается из текущей розничной цены как Розница / 1,50; Опт 1 = Опт 2 +12,5%. Для Vantage стандартных цветов Опт 2 = 603 ₽ по партнёрскому прайсу; остальные цвета Vantage получают Опт 2 от текущей розницы /1,50. Вся прочая фурнитура остаётся по рознице.</div></div>';
}
function renderPricing59Admin(){
  if(typeof SALES_PRICE_59==='undefined')return renderPricingSimpleSection('door59');
  const tiers=[
    ['Опт 2','wholesale2','База'],
    ['Опт 1','wholesale1','+12,5%'],
    ['Розница','retail','+50%']
  ];
  const rows=tiers.map(([label,type,rule])=>
    '<tr><td><b>'+label+'</b></td>'+
    '<td>'+formatRub(price59ApplySalesTier(SALES_PRICE_59.leafOpt2.gray,type))+'</td>'+
    '<td>'+formatRub(price59ApplySalesTier(SALES_PRICE_59.leafOpt2.black,type))+'</td>'+
    '<td>'+formatRub(price59ApplySalesTier(SALES_PRICE_59.boxOpt2.gray,type))+'</td>'+
    '<td>'+formatRub(price59ApplySalesTier(SALES_PRICE_59.boxOpt2.black,type))+'</td>'+
    '<td>'+escapeHtml(rule)+'</td></tr>'
  ).join('');
  return pricingAdminSectionHeader(
    'Двери 59 · продажные цены',
    'База Опт 2 для H=2000. При H≤2000 цена не уменьшается; выше 2000 применяется утверждённая высотная шкала. Ширина полотна до 900 мм не меняет цену; выше 900 мм применяется W/900.',
    'Подключено'
  )+
  '<div class="pricing-admin-grid">'+
    '<div class="pricing-admin-card primary"><div class="pricing-admin-kicker">Полотно 59 · Опт 2</div><div class="pricing-admin-big">'+formatRub(SALES_PRICE_59.leafOpt2.gray)+'</div><div class="mini">серый анод · чёрный '+formatRub(SALES_PRICE_59.leafOpt2.black)+'</div></div>'+
    '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Короб 59 · Опт 2</div><div class="pricing-admin-big">'+formatRub(SALES_PRICE_59.boxOpt2.gray)+'</div><div class="mini">серый анод · чёрный '+formatRub(SALES_PRICE_59.boxOpt2.black)+'</div></div>'+
    '<div class="pricing-admin-card"><div class="pricing-admin-kicker">Стекло / зеркало · Опт 2</div><div class="pricing-admin-big">'+formatRub(SALES_PRICE_59.glassOpt2.oneSide)+'</div><div class="mini">1 сторона · 2 стороны '+formatRub(SALES_PRICE_59.glassOpt2.twoSides)+'</div></div>'+
  '</div>'+
  '<div class="pricing-admin-card pricing-wide-card">'+
    '<div class="pricing-rule-block-title">База H=2000 · уровни цен</div>'+
    '<div class="table-wrap"><table><thead><tr><th>Тип цены</th><th>Полотно серое</th><th>Полотно чёрное</th><th>Короб серый</th><th>Короб чёрный</th><th>Правило</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
    '<div class="pricing-width-rule" style="margin-top:12px">'+
      '<div class="pricing-rule-static"><b>H ≤ 2000:</b> коэффициент ×1,00 — цену вниз не уменьшаем.</div>'+
      '<div class="pricing-rule-static"><b>H > 2000:</b> +10% на каждые 100 мм по шкале 2100 ×1,10 · 2200 ×1,20 · 2300 ×1,30 · …</div>'+
      '<div class="pricing-rule-static"><b>Стекло/зеркало:</b> 14 950 ₽ за 1 сторону / 26 450 ₽ за 2 стороны при H≤2000; выше — та же высотная шкала; затем +12,5% / +50%.</div>'+
      '<div class="pricing-rule-static"><b>Ширина полотна:</b> W ≤ 900 → ×1; W > 900 → ×(W/900). Ширины 450–595 остаются нестандартными, но отдельной скидки по ширине нет. Стекло/зеркало от ширины не меняется.</div>'+
      '<div class="pricing-rule-static"><b>Короб:</b> ширина 450–1000 мм не влияет на цену, как у короба 42 мм.</div>'+
      '<div class="pricing-rule-static"><b>Золото / RAL:</b> золотой профиль использует базу чёрного; RAL использует базу серого + 460 ₽/м.п. с 10% техзапасом.</div>'+
    '</div>'+
  '</div>';
}

function renderPricingSimpleSection(id){
  const map={
    door59:['Двери 59','Модель уровней зафиксирована: Опт 1 = Опт 2 +12,5%, Розница = Опт 2 +50%. Сейчас нужно последовательно подключить базовые цены Опт 2 и исключения 59 мм.','Модель зафиксирована'],
    trim:['Погонаж','36 мм уже подключён. Для 42/59 здесь будут отдельные цены полного короба, стоек, поперечин и продажа отдельных деталей.','Расширяем'],
    hardware:['Фурнитура','Сейчас каталог показывает BASE Bitrix24. Для фурнитуры позже согласуем собственные проценты и правила; модель дверей +12,5% / +50% здесь не применяется.','Отдельная математика'],
    extras:['Дополнительные работы','Сюда войдут фрезеровки, скрытый стопор, автопорог, стекло/зеркало, ПВХ, RAL, откатная система и другие работы.','В работе'],
    cost:['Себестоимость','Нормативная и фактическая себестоимость будет жить отдельно от продажной цены: материалы + операции + фурнитура + расходники + упаковка.','Отдельный слой']
  };
  const row=map[id]||map.cost;
  return pricingAdminSectionHeader(row[0],row[1],row[2])+
    '<div class="pricing-empty-state"><div class="pricing-empty-icon">HD</div><div><b>'+escapeHtml(row[0])+'</b><p>'+escapeHtml(row[1])+'</p><span>Структура раздела уже зарезервирована в общей административной панели.</span></div></div>';
}
function renderPricingAdminBody(section){
  if(section==='overview')return renderPricingOverview();
  if(section==='door36')return renderPricing36Admin();
  if(section==='door42')return renderPricing42Admin();
  if(section==='door59')return renderPricing59Admin();
  if(section==='hardware')return renderPricingHardwareAdmin();
  if(section==='cost'&&typeof renderCostAdmin==='function')return renderCostAdmin();
  if(section==='cost'&&typeof renderCost36Admin==='function')return renderCost36Admin();
  return renderPricingSimpleSection(section);
}

function pricing42AdminNumber(id){
  return Number(typeof $==='function'?$(id)?.value:'');
}
function pricing42AdminValuesFromForm(){
  return {
    base:{
      plywood:{gray:pricing42AdminNumber('pricing42PlywoodGray'),black:pricing42AdminNumber('pricing42PlywoodBlack')},
      aluminum:{gray:pricing42AdminNumber('pricing42AluminumGray'),black:pricing42AdminNumber('pricing42AluminumBlack')}
    }
  };
}
function pricing42AdminDraftCalculation(){
  const values=pricing42AdminValuesFromForm();
  const frameKey=$('pricing42TestFrame')?.value||'plywood';
  const edgeKey=$('pricing42TestEdge')?.value||'gray';
  const height=Number($('pricing42TestHeight')?.value||2000);
  const width=Number($('pricing42TestWidth')?.value||900);
  const approved=typeof price42ApprovedBook==='function'?price42ApprovedBook('wholesale2'):null;
  const limits=approved?.limits?.[frameKey];
  if(!limits||height<limits.minHeight||height>limits.maxHeight)return {ok:false,reason:'Высота вне диапазона выбранного каркаса.'};
  if(width<(approved?.limits?.minWidth||450)||width>(approved?.limits?.maxWidth||1000))return {ok:false,reason:'Ширина вне диапазона 450–1000 мм.'};
  const base=Number(values.base?.[frameKey]?.[edgeKey]);
  const heightFactor=height/2000;
  const widthFactor=width<=900?1:width/900;
  if(!Number.isFinite(base)||base<=0||!Number.isFinite(heightFactor)||heightFactor<=0||!Number.isFinite(widthFactor)||widthFactor<=0){
    return {ok:false,reason:'Заполните корректные базовые цены.'};
  }
  return {ok:true,base,heightFactor,widthFactor,price:Math.ceil(base*heightFactor*widthFactor),height,width,frameKey,edgeKey};
}
function renderPricing42RulePreview(){
  const out=typeof $==='function'?$('pricing42RulePreview'):null;
  if(!out)return;
  const calc=pricing42AdminDraftCalculation();
  if(!calc.ok){
    out.innerHTML='<div class="pricing-rule-preview-error">'+escapeHtml(calc.reason||'Расчёт недоступен')+'</div>';
    return;
  }
  const frame=calc.frameKey==='aluminum'?'AL каркас':'Фанера';
  const edge=calc.edgeKey==='black'?'Чёрный анод':'Серый анод';
  out.innerHTML=
    '<div class="pricing-rule-preview-price">'+formatRub(calc.price)+'</div>'+
    '<div class="pricing-rule-preview-formula">'+escapeHtml(frame+' · '+edge+' · '+calc.height+'×'+calc.width)+
    '<br>'+formatRub(calc.base)+' × '+String(calc.heightFactor).replace('.',',')+' × '+String(calc.widthFactor).replace('.',',')+' = <b>'+formatRub(calc.price)+'</b></div>';
}
function applyPricing42AdminRules(){
  if(typeof savePrice42AdminRules!=='function')return;
  const result=savePrice42AdminRules(pricing42AdminValuesFromForm());
  if(!result.ok){
    const msg=$('pricing42AdminMessage');
    if(msg){msg.className='pricing-admin-message error';msg.textContent=result.error||'Не удалось сохранить правила.'}
    return;
  }
  renderPricingAdmin();
  const msg=$('pricing42AdminMessage');
  if(msg){msg.className='pricing-admin-message success';msg.textContent='Сохранено и применено. Новые расчёты 42 мм используют эти значения.'}
  if(typeof renderSalesPrice42==='function')renderSalesPrice42();
}
function resetPricing42AdminRules(){
  if(!confirm('Вернуть утверждённые значения 42 мм из Price Book? Ручные настройки этого браузера будут удалены.'))return;
  if(typeof resetPrice42AdminRules==='function')resetPrice42AdminRules();
  renderPricingAdmin();
  const msg=$('pricing42AdminMessage');
  if(msg){msg.className='pricing-admin-message success';msg.textContent='Утверждённые значения восстановлены.'}
  if(typeof renderSalesPrice42==='function')renderSalesPrice42();
}
function pricing42Input(id,label,value,{step='1',suffix='₽'}={}){
  return '<label class="pricing-rule-field"><span>'+escapeHtml(label)+'</span><div class="pricing-rule-input-wrap"><input id="'+id+'" type="number" min="0.01" step="'+step+'" value="'+escapeHtml(String(value))+'" oninput="renderPricing42RulePreview()"><em>'+escapeHtml(suffix)+'</em></div></label>';
}
function renderPricing42RuleEditor(){
  if(typeof price42AdminRuleValues!=='function')return '';
  const v=price42AdminRuleValues();
  const mode=v.manualOverride?'Ручные базовые цены активны':'Утверждённые значения';
  const modeCls=v.manualOverride?'manual':'approved';
  const updated=v.manualOverride&&v.manualUpdatedAt?new Date(v.manualUpdatedAt).toLocaleString('ru-RU'):'';
  return '<div class="section pricing-rule-editor">'+
    '<div class="pricing-rule-editor-head">'+
      '<div><div class="section-title">42 мм · Опт 2 · Логика цены</div>'+
      '<div class="mini">Высота масштабируется линейно. Ширины 600–900 мм имеют одну базовую цену; линейный коэффициент ширины включается только выше 900 мм.</div></div>'+
      '<span class="pricing-rule-mode '+modeCls+'">'+escapeHtml(mode)+'</span>'+
    '</div>'+
    (v.manualOverride?'<div class="pricing-rule-local-note"><b>Ручной режим прототипа.</b> Меняются только базовые цены 2000×900; линейная формула размера остаётся фиксированной'+(updated?' · '+escapeHtml(updated):'')+'.</div>':'')+
    '<div class="pricing-rule-layout">'+
      '<div class="pricing-rule-block">'+
        '<div class="pricing-rule-block-title">1. Базовая цена полотна · 2000×900 мм</div>'+
        '<div class="pricing-rule-fields">'+
          pricing42Input('pricing42PlywoodGray','Фанера · серый',v.base.plywood.gray)+
          pricing42Input('pricing42PlywoodBlack','Фанера · чёрный',v.base.plywood.black)+
          pricing42Input('pricing42AluminumGray','AL · серый',v.base.aluminum.gray)+
          pricing42Input('pricing42AluminumBlack','AL · чёрный',v.base.aluminum.black)+
        '</div>'+
      '</div>'+
      '<div class="pricing-rule-block">'+
        '<div class="pricing-rule-block-title">2. Размерная формула</div>'+
        '<div class="pricing-width-rule">'+
          '<div class="pricing-rule-static"><b>К высоты = H / 2000</b></div>'+
          '<div class="pricing-rule-static"><b>К ширины = 1</b> при W ≤ 900 мм; при W > 900 мм → <b>W / 900</b></div>'+
          '<div class="pricing-rule-static"><b>К размера = К высоты × К ширины</b></div>'+
          '<div class="pricing-rule-static">Опт 2 полотна = <b>база × (H/2000) × К ширины</b></div>'+
          '<div class="pricing-rule-static">Стандартные ширины <b>600 / 700 / 800 / 900 мм</b> стоят одинаково. Ширина 450–595 мм остаётся нестандартной, но отдельной ценовой надбавки/скидки по ширине не получает.</div>'+
          '<div class="pricing-rule-static">Реверс / левое / правое → <b>на цену не влияет</b></div>'+
          '<div class="pricing-rule-static">Максимум: фанера <b>2200 мм</b> · AL <b>2300 мм</b></div>'+
        '</div>'+
      '</div>'+
      '<div class="pricing-rule-block pricing-rule-test">'+
        '<div class="pricing-rule-block-title">3. Быстрая проверка формулы</div>'+
        '<div class="pricing-test-fields">'+
          '<label><span>Каркас</span><select id="pricing42TestFrame" onchange="renderPricing42RulePreview()"><option value="plywood">Фанера</option><option value="aluminum">Алюминий</option></select></label>'+
          '<label><span>Анод</span><select id="pricing42TestEdge" onchange="renderPricing42RulePreview()"><option value="gray">Серый</option><option value="black">Чёрный</option></select></label>'+
          '<label><span>Высота</span><input id="pricing42TestHeight" type="number" min="1700" max="2300" step="5" value="2100" oninput="renderPricing42RulePreview()"></label>'+
          '<label><span>Ширина</span><input id="pricing42TestWidth" type="number" min="450" max="1000" step="5" value="900" oninput="renderPricing42RulePreview()"></label>'+
        '</div>'+
        '<div id="pricing42RulePreview" class="pricing-rule-preview"></div>'+
      '</div>'+
    '</div>'+
    '<div class="pricing-rule-actions">'+
      '<button class="primary" onclick="applyPricing42AdminRules()">Сохранить базовые цены</button>'+
      '<button class="secondary" onclick="resetPricing42AdminRules()">Вернуть утверждённые значения</button>'+
      '<div id="pricing42AdminMessage" class="pricing-admin-message"></div>'+
    '</div>'+
    '<div class="mini pricing-rule-footnote">Уже сохранённые строки заказа не пересчитываются автоматически: они сохраняют цену-снимок. Новые конфигурации используют актуальную базу и линейную формулу.</div>'+
  '</div>';
}
function pricingStickyUxEnsure(){
  if(window.__hdPricingStickyUx)return window.__hdPricingStickyUx;
  const state={raf:0,overlay:null,viewport:null,table:null,activeWrap:null};
  const ensureOverlay=()=>{
    if(state.overlay?.isConnected)return state.overlay;
    const overlay=document.createElement('div');
    overlay.className='pricing-floating-table-head';
    overlay.setAttribute('aria-hidden','true');
    const viewport=document.createElement('div');
    viewport.className='pricing-floating-table-head-viewport';
    overlay.appendChild(viewport);
    document.body.appendChild(overlay);
    state.overlay=overlay;state.viewport=viewport;
    return overlay;
  };
  const clear=()=>{
    if(state.overlay)state.overlay.classList.remove('show');
    state.activeWrap=null;
  };
  const syncClone=(table)=>{
    const thead=table.tHead;
    if(!thead||!state.viewport)return;
    const cloneTable=document.createElement('table');
    cloneTable.className=(table.className||'')+' pricing-floating-table';
    cloneTable.style.width=Math.max(table.scrollWidth,table.getBoundingClientRect().width)+'px';
    cloneTable.style.minWidth=cloneTable.style.width;
    cloneTable.style.tableLayout='fixed';
    const cloneHead=thead.cloneNode(true);
    cloneTable.appendChild(cloneHead);
    const src=[...thead.querySelectorAll('th')],dst=[...cloneHead.querySelectorAll('th')];
    src.forEach((th,i)=>{
      const w=th.getBoundingClientRect().width;
      if(dst[i]){dst[i].style.width=w+'px';dst[i].style.minWidth=w+'px';dst[i].style.maxWidth=w+'px'}
    });
    state.viewport.innerHTML='';
    state.viewport.appendChild(cloneTable);
    state.table=cloneTable;
  };
  const update=()=>{
    state.raf=0;
    const root=typeof $==='function'?$('pricingAdminRoot'):document.getElementById('pricingAdminRoot');
    if(!root||activePricingAdminSection?.()!=='cost'){clear();return}
    const topNav=root.querySelector('.pricing-admin-nav');
    const modelNav=root.querySelector('.cost-model-nav');
    const navH=topNav?Math.ceil(topNav.getBoundingClientRect().height):0;
    root.style.setProperty('--pricing-admin-nav-height',navH+'px');
    const stackBottom=Math.max(
      0,
      topNav?.getBoundingClientRect().bottom||0,
      modelNav?.getBoundingClientRect().bottom||0
    );
    const stickyTop=Math.max(0,Math.ceil(stackBottom))+6;
    const tables=[...root.querySelectorAll('.cost36-reference-table,.hd-cost-table')];
    let picked=null;
    for(const table of tables){
      const wrap=table.closest('.table-wrap')||table.parentElement;
      const tr=table.getBoundingClientRect(),hr=table.tHead?.getBoundingClientRect(),wr=wrap?.getBoundingClientRect();
      if(!hr||!wr)continue;
      const visible=tr.bottom>stickyTop+hr.height&&tr.top<window.innerHeight&&wr.right>0&&wr.left<window.innerWidth;
      if(visible&&hr.top<stickyTop){picked={table,wrap,hr,wr};break}
    }
    if(!picked){clear();return}
    ensureOverlay();
    if(state.activeWrap!==picked.wrap||!state.table)syncClone(picked.table);
    state.activeWrap=picked.wrap;
    const left=Math.max(8,picked.wr.left);
    const right=Math.min(window.innerWidth-8,picked.wr.right);
    const width=Math.max(0,right-left);
    state.overlay.style.top=stickyTop+'px';
    state.overlay.style.left=left+'px';
    state.overlay.style.width=width+'px';
    state.overlay.classList.add('show');
    if(state.table)state.table.style.transform='translateX('+(-picked.wrap.scrollLeft)+'px)';
  };
  const schedule=()=>{if(!state.raf)state.raf=requestAnimationFrame(update)};
  state.schedule=schedule;state.update=update;
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',()=>{state.table=null;schedule()},{passive:true});
  window.__hdPricingStickyUx=state;
  return state;
}
function pricingStickyUxRefresh(){
  const state=pricingStickyUxEnsure();
  const root=typeof $==='function'?$('pricingAdminRoot'):document.getElementById('pricingAdminRoot');
  if(root){
    root.querySelectorAll('.cost36-reference-table,.hd-cost-table').forEach(table=>{
      const wrap=table.closest('.table-wrap');
      if(wrap&&!wrap.dataset.hdStickyHeadBound){
        wrap.dataset.hdStickyHeadBound='1';
        wrap.addEventListener('scroll',state.schedule,{passive:true});
      }
    });
  }
  state.schedule();
}
function renderPricingAdmin(){
  const root=typeof $==='function'?$('pricingAdminRoot'):null;
  if(!root)return;
  const section=activePricingAdminSection();
  root.innerHTML=pricingAdminNavHtml(section)+'<div class="pricing-admin-content">'+renderPricingAdminBody(section)+'</div>';
  if(section==='door42'&&typeof renderPricing42RulePreview==='function')renderPricing42RulePreview();
  if(section==='cost'&&activeCostAdminModel?.()==='leaf36'&&typeof renderCost36Preview==='function')renderCost36Preview();
  pricingStickyUxRefresh();
}


// v111: one transparent price card for configured door assemblies.
const CONFIGURED_PRICE_CARD_PRODUCTS=Object.freeze(['leaf36','single42','sliding42','single59','double42']);

function configuredPriceRound(value){
  const n=Number(value);
  return Number.isFinite(n)?Math.ceil(n):null;
}
function configuredPriceQty(value,fallback=1){
  const n=Number(value);
  return Number.isFinite(n)&&n>0?n:fallback;
}
function configuredPriceLine({key,label,qty=1,unit='шт.',unitPrice=null,priceKnown,actualPriceType=null,note='',source=''}){
  const q=configuredPriceQty(qty,1);
  const p=configuredPriceRound(unitPrice);
  const known=priceKnown===undefined?p!==null:!!priceKnown;
  return {
    key:String(key||''),
    label:String(label||'Позиция'),
    qty:q,
    unit:String(unit||'шт.'),
    unitPrice:known?p:null,
    total:known?configuredPriceRound(p*q):null,
    priceKnown:known,
    actualPriceType:actualPriceType?normalizeSalesPriceType(actualPriceType):null,
    note:String(note||''),
    source:String(source||'')
  };
}
function configuredPriceCompanionLabel(item){
  const key=String(item?.baseKey||item?.key||'');
  const name=String(item?.name||'').trim();
  if(key==='BUNDLE-P36-BOX')return 'Короб';
  if(key==='BUNDLE-P36-TRIM')return 'Наличник';
  if(key==='BUNDLE-P42-BOX')return 'Комплект короба 42';
  if(key==='BUNDLE-P59-BOX')return 'Комплект короба 59';
  if(key==='POWDER-COAT-42'||key==='POWDER-COAT-59')return 'Полимерно-порошковая покраска RAL';
  if(key==='DOOR-HINGE')return name?'Петли · '+name:'Петли';
  if(key==='DOOR-LOCK')return name?'Замок · '+name:'Замок';
  if(key==='DOOR-HANDLE')return name?'Ручка · '+name:'Ручка';
  if(key==='DOOR-TURN')return name?'Завёртка · '+name:'Завёртка';
  if(key==='DOOR-CYLINDER')return name?'Цилиндр · '+name:'Цилиндр';
  if(key==='DOOR-STOPPER')return name?'Стопор · '+name:'Стопор';
  if(key==='DOOR-THRESHOLD')return name?'Автопорог · '+name:'Автопорог';
  if(key==='DOOR-CLOSER')return name?'Доводчик · '+name:'Доводчик';
  if(/^BOX-MITER45-/.test(key))return 'Запил короба под 45°';
  if(/^DOUBLE42-BOLT-/.test(key))return 'Ригель · '+(key.endsWith('LEFT')?'левая створка':'правая створка');
  return name||key||'Позиция';
}
function configuredPriceLineFromCompanion(item,requestedType=activeSalesPriceType()){
  const unitPrice=typeof companionItemUnitPrice==='function'?companionItemUnitPrice(item):null;
  const actualType=typeof companionSalesPriceType==='function'?companionSalesPriceType(item):null;
  const noteParts=[];
  if(item?.priceNote)noteParts.push(String(item.priceNote));
  if(actualType&&normalizeSalesPriceType(actualType)!==normalizeSalesPriceType(requestedType)){
    noteParts.push('Для этой позиции выбранный тип цены пока не утверждён; используется '+salesPriceTypeLabel(actualType)+'.');
  }
  return configuredPriceLine({
    key:item?.baseKey||item?.key||'companion',
    label:configuredPriceCompanionLabel(item),
    qty:item?.qty||1,
    unit:item?.unit||'шт.',
    unitPrice,
    priceKnown:unitPrice!==null&&unitPrice!==undefined&&Number.isFinite(Number(unitPrice)),
    actualPriceType:actualType,
    note:noteParts.join(' ')
  });
}
function configuredPrice42LeafLine(prefix,width,label,priceType=activeSalesPriceType()){
  const h=currentHeight();
  const w=Number(width);
  const frameKey=price42FrameKey($('frame')?.value||'');
  const edgeKey=price42EdgeKey($(prefix+'EdgeColor')?.value||'');
  if(!frameKey||!edgeKey){
    return configuredPriceLine({key:'door-leaf-'+prefix,label,priceKnown:false,note:'Для выбранного каркаса/торца цена полотна не определена.'});
  }
  const base=price42RuleCalculation({height:h,width:w,frameKey,edgeKey},priceType);
  const finish=price42FinishCalculation({
    height:h,width:w,
    side1Type:$(prefix+'Side1Type')?.value||'Грунт под покраску',
    side2Type:$(prefix+'Side2Type')?.value||'Грунт под покраску',
    side1Catalog:$(prefix+'Side1FilmCatalog')?.value||'Hidden Doors',
    side2Catalog:$(prefix+'Side2FilmCatalog')?.value||'Hidden Doors'
  },priceType);
  if(!base.ok||!finish.ok||finish.priceOnRequest){
    return configuredPriceLine({
      key:'door-leaf-'+prefix,label,priceKnown:false,
      note:finish?.reason||base?.reason||'Цена полотна требует согласования.'
    });
  }
  return configuredPriceLine({
    key:'door-leaf-'+prefix,label,qty:1,unit:'шт.',
    unitPrice:Number(base.price)+Number(finish.price||0),
    actualPriceType:priceType
  });
}
function configuredDouble42LeafUnitPrice(priceType=activeSalesPriceType()){
  if(product()!=='double42')return null;
  const left=configuredPrice42LeafLine('Left',doubleWidth('left'),'Левая створка',priceType);
  const right=configuredPrice42LeafLine('Right',doubleWidth('right'),'Правая створка',priceType);
  if(!left.priceKnown||!right.priceKnown)return null;
  const total=Number(left.total||0)+Number(right.total||0);
  return Number.isFinite(total)?Math.ceil(total):null;
}
function configuredDouble42PriceNote(priceType=activeSalesPriceType()){
  if(product()!=='double42')return '';
  const left=configuredPrice42LeafLine('Left',doubleWidth('left'),'Левая створка',priceType);
  const right=configuredPrice42LeafLine('Right',doubleWidth('right'),'Правая створка',priceType);
  return (!left.priceKnown||!right.priceKnown)?'Цена одной или обеих створок требует согласования':'';
}

function configuredPriceUnknownSelectedExtras(existingLabels=new Set()){
  if(typeof selectedOrderExtras!=='function')return [];
  const skip=new Set(['Створка с замком','Ответная часть замка']);
  const represented=new Set([
    'Петли','Замок','Ручка','Завертка','Завёртка','Цилиндр','Стопор','Автопорог','Доводчик',
    'Запил короба под 45°','Ригель'
  ]);
  for(const label of existingLabels)represented.add(label);
  return selectedOrderExtras()
    .filter(([label,value])=>value&&!skip.has(label)&&!represented.has(label))
    .map(([label,value],index)=>configuredPriceLine({
      key:'selected-extra-'+index,
      label:label+' · '+value,
      qty:1,unit:'шт.',priceKnown:false,
      note:'Позиция выбрана, но продажная цена для неё пока не подключена к карточке комплекта.'
    }));
}
function configuredPriceBreakdown(){
  const productKey=product();
  if(!CONFIGURED_PRICE_CARD_PRODUCTS.includes(productKey))return {visible:false};
  const requestedType=activeSalesPriceType();
  const lines=[];
  let sourceNote=typeof activeSalesPriceBookNote==='function'?activeSalesPriceBookNote(requestedType):'';

  if(productKey==='leaf36'){
    const book=price36Book(requestedType);
    const pvc=$('cover36')?.value==='ПВХ-пленка';
    lines.push(configuredPriceLine({
      key:'door-leaf-36',label:'Полотно 36 мм',qty:1,unit:'шт.',
      unitPrice:pvc?book?.doorLeaf:null,
      priceKnown:!!book&&pvc&&Number.isFinite(Number(book.doorLeaf)),
      actualPriceType:requestedType,
      note:pvc?'':'Автоматическая цена полотна 36 мм сейчас утверждена только для ПВХ-плёнки.'
    }));
    if(includeBox()){
      for(const item of companionItems()){
        const raw=configuredPriceLineFromCompanion(item,requestedType);
        const known=pvc&&raw.priceKnown;
        lines.push({...raw,priceKnown:known,unitPrice:known?raw.unitPrice:null,total:known?raw.total:null,
          note:known?raw.note:'Для комплекта 36 мм автоматическая цена погонажа сейчас утверждена в ПВХ-плёнке.'});
      }
    }
    sourceNote=book?price36SourceNote(book):sourceNote;
  }

  if(['single42','sliding42'].includes(productKey)){
    const calc=price42Calculation(requestedType);
    lines.push(configuredPriceLine({
      key:'door-leaf-42',label:productKey==='sliding42'?'Откатное полотно 42 мм':'Полотно 42 мм',qty:1,unit:'шт.',
      unitPrice:calc?.eligible&&calc?.price!==null?calc.price:null,
      priceKnown:!!calc?.eligible&&calc?.price!==null,
      actualPriceType:requestedType,
      note:calc?.priceOnRequest?(calc?.finish?.reason||'Цена покрытия после согласования.'):(calc?.eligible?'':(calc?.reasons||[]).join('; '))
    }));
    const companions=companionItems();
    for(const item of companions)lines.push(configuredPriceLineFromCompanion(item,requestedType));
    lines.push(...configuredPriceUnknownSelectedExtras());
    sourceNote=price42SourceNote(price42Book(requestedType))+(productKey==='sliding42'?' · Откатное исполнение не имеет отдельной наценки за конструктив.':'');
  }

  if(productKey==='single59'){
    const calc=typeof price59Calculation==='function'?price59Calculation(requestedType):null;
    lines.push(configuredPriceLine({
      key:'door-leaf-59',label:'Полотно 59 мм',qty:1,unit:'шт.',
      unitPrice:calc?.eligible&&calc?.price!==null?calc.price:null,
      priceKnown:!!calc?.eligible&&calc?.price!==null,
      actualPriceType:requestedType,
      note:calc?.priceOnRequest?(calc?.finish?.reason||'Цена покрытия после согласования.'):(calc?.eligible?'':(calc?.reason||'Цена 59 мм требует уточнения.'))
    }));
    const companions=companionItems();
    for(const item of companions)lines.push(configuredPriceLineFromCompanion(item,requestedType));
    lines.push(...configuredPriceUnknownSelectedExtras());
    sourceNote=(typeof price59SourceNote==='function'?price59SourceNote():(typeof activeSalesPriceBookNote==='function'?activeSalesPriceBookNote(requestedType):''));
  }

  if(productKey==='double42'){
    lines.push(configuredPrice42LeafLine('Left',doubleWidth('left'),'Левая створка',requestedType));
    lines.push(configuredPrice42LeafLine('Right',doubleWidth('right'),'Правая створка',requestedType));
    const companions=companionItems();
    const boxParts=companions.filter(x=>/^BUNDLE-P42-DOUBLE-/.test(String(x?.baseKey||x?.key||'')));
    if(boxParts.length){
      const boxCalc=typeof price42DoubleBoxCalculation==='function'
        ?price42DoubleBoxCalculation({
          height:currentHeight(),
          leftWidth:doubleWidth('left'),
          rightWidth:doubleWidth('right'),
          color:$('bundle42Color')?.value||''
        },requestedType)
        :null;
      lines.push(configuredPriceLine({
        key:'box-kit-double42',label:'Короб двухстворчатый 42',qty:1,unit:'комплект',
        unitPrice:boxCalc?.ok?boxCalc.price:null,
        priceKnown:!!boxCalc?.ok&&Number.isFinite(Number(boxCalc.price)),
        actualPriceType:boxCalc?.ok?requestedType:null,
        note:boxCalc?.ok
          ?'Верх '+boxCalc.topLengthMm+' мм = ('+boxCalc.leftWidth+' + '+boxCalc.rightWidth+' + 10) мм × '+boxCalc.ratePerMeterOpt2+' ₽/м по Опт 2; стоевые части сохраняют высотную логику короба 42.'
          :(boxCalc?.reason||'Цена короба требует уточнения.')
      }));
    }
    for(const item of companions){
      if(/^BUNDLE-P42-DOUBLE-/.test(String(item?.baseKey||item?.key||'')))continue;
      lines.push(configuredPriceLineFromCompanion(item,requestedType));
    }
    lines.push(...configuredPriceUnknownSelectedExtras());
    sourceNote=price42SourceNote(price42Book(requestedType))+' · Створки рассчитаны по правилам полотна 42 мм. Двустворчатый короб: две стоевые части сохраняют высотную логику короба 42; верх = (W₁ + W₂ + 10 мм) × ставка профиля, Опт 2: серый 1 076 ₽/м, чёрный 1 253 ₽/м.';
  }

  const visibleLines=lines.filter(x=>Number(x.qty)>0);
  const knownTotal=visibleLines.reduce((sum,line)=>sum+(line.priceKnown&&Number.isFinite(Number(line.total))?Number(line.total):0),0);
  const unknownLines=visibleLines.filter(x=>!x.priceKnown);
  const mismatchedLines=visibleLines.filter(x=>x.priceKnown&&x.actualPriceType&&normalizeSalesPriceType(x.actualPriceType)!==normalizeSalesPriceType(requestedType));
  return {
    visible:true,
    productKey,
    priceType:requestedType,
    lines:visibleLines,
    knownTotal:configuredPriceRound(knownTotal)||0,
    total:unknownLines.length?null:(configuredPriceRound(knownTotal)||0),
    hasUnknownPrices:unknownLines.length>0,
    unknownCount:unknownLines.length,
    hasMixedPriceTypes:mismatchedLines.length>0,
    mixedPriceTypes:[...new Set(mismatchedLines.map(x=>salesPriceTypeLabel(x.actualPriceType)))],
    complete:unknownLines.length===0,
    sourceNote
  };
}
function configuredPriceLineHtml(line,requestedType){
  const qty=Number(line.qty||1);
  const priceTypeNote=line.actualPriceType&&normalizeSalesPriceType(line.actualPriceType)!==normalizeSalesPriceType(requestedType)
    ?'<span class="configured-price-type-note">'+escapeHtml(salesPriceTypeLabel(line.actualPriceType))+'</span>':'';
  if(!line.priceKnown){
    return '<div class="configured-price-line unknown"><div><span class="configured-price-label">'+escapeHtml(line.label)+'</span>'+
      (line.note?'<div class="configured-price-line-note">'+escapeHtml(line.note)+'</div>':'')+
      '</div><strong>цена не заполнена</strong></div>';
  }
  const qtyText=(qty!==1)
    ?escapeHtml(String(qty).replace('.',','))+' × '+formatRub(line.unitPrice)+' = '
    :'';
  return '<div class="configured-price-line"><div><span class="configured-price-label">'+escapeHtml(line.label)+'</span>'+priceTypeNote+
    (line.note?'<div class="configured-price-line-note">'+escapeHtml(line.note)+'</div>':'')+
    '</div><strong>'+qtyText+formatRub(line.total)+'</strong></div>';
}
function renderConfiguredPriceCard(){
  const wrap=$('configuredPriceResultWrap');
  if(!wrap)return;
  const data=configuredPriceBreakdown();
  wrap.classList.toggle('hidden',!data.visible);
  if(!data.visible)return;
  $('price36ResultWrap')?.classList.add('hidden');
  $('price42ResultWrap')?.classList.add('hidden');
  const caption=$('configuredPriceCaption');
  const value=$('configuredPriceResult');
  const details=$('configuredPriceDetails');
  const status=$('configuredPriceStatus');
  const note=$('configuredPriceNote');
  if(caption)caption.textContent='Цена · '+salesPriceTypeLabel(data.priceType);
  if(value)value.textContent=data.complete
    ?formatRub(data.total)
    :(data.knownTotal>0?formatRub(data.knownTotal)+' + позиции без цены':'Цена требует уточнения');
  if(details){
    const rows=data.lines.map(line=>configuredPriceLineHtml(line,data.priceType)).join('');
    const footer=data.complete
      ?'<div class="configured-price-total"><span>Комплект</span><strong>'+formatRub(data.total)+'</strong></div>'
      :(data.knownTotal>0?'<div class="configured-price-total partial"><span>Известная часть</span><strong>'+formatRub(data.knownTotal)+'</strong></div>':'');
    details.innerHTML=rows+footer;
  }
  if(status){
    const messages=[];
    if(data.hasUnknownPrices)messages.push('Не включено в итог позиций без установленной цены: '+data.unknownCount+'.');
    if(data.hasMixedPriceTypes)messages.push('Есть позиции в другом доступном типе цены: '+data.mixedPriceTypes.join(', ')+'. Тип цены указан в соответствующей строке.');
    status.classList.toggle('hidden',messages.length===0);
    status.innerHTML=messages.map(x=>'<div>'+escapeHtml(x)+'</div>').join('');
  }
  if(note)note.textContent=data.sourceNote||'';
}
