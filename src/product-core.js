function boxOption(defaultChecked=true){
  return `<div class="bundle-check">
    <input id="includeBox" type="checkbox" ${defaultChecked?'checked':''}>
    <div>
      <label for="includeBox">Добавить дверной короб</label>
      <div class="mini">Короб добавляется отдельной номенклатурой из «Погонажа» и не меняет SKU самой двери.</div>
    </div>
  </div>`;
}
function includeBox(){return $('includeBox')?.checked??false}
function boxMiter45Option(){
  if(!['single42','single59'].includes(product()))return '';
  return `<div class="bundle-check" style="margin-top:10px">
    <input id="boxMiter45" type="checkbox">
    <div>
      <label for="boxMiter45">Запил короба под 45°</label>
      <div class="mini">Платная услуга для этого комплекта короба. По умолчанию выключена, не входит в SKU полотна и добавляется в заказ отдельной строкой.</div>
    </div>
  </div>`;
}
function boxMiter45Selected(){
  return ['single42','single59'].includes(product()) && includeBox() && ($('boxMiter45')?.checked??false);
}
function boxMiter45Suffix(){return boxMiter45Selected()?'M45':''}
function boxMiter45NameSuffix(){return boxMiter45Selected()?' / Запил 45°':''}
function doorProductionMeta(){
  if(!['single42','single59'].includes(product()))return {};
  return {
    system:product()==='single42'?'42':'59',
    boxIncluded:includeBox(),
    boxMiter45:boxMiter45Selected(),
    boxTreatment:boxMiter45Selected()?'MITER_45':'NONE'
  };
}
function updateBoxMiter45State(){
  const el=$('boxMiter45'); if(!el)return;
  const enabled=includeBox();
  el.disabled=!enabled;
  if(!enabled)el.checked=false;
}


const CATALOG_HERO_ROUTE_STORE='hd_v68_catalog_hero_route';
const CATALOG_HERO_TRIM_SYSTEM_STORE='hd_v68_catalog_trim_system';
const CATALOG_HERO_MAIN_ROUTES=[
  {key:'door36',label:'Двери 36 мм'},
  {key:'single42',label:'Скрытые 42 мм'},
  {key:'single59',label:'Скрытые 59 мм'},
  {key:'sliding42',label:'Раздвижные 42 мм'},
  {key:'double42',label:'Двустворчатые 42 мм'},
  {key:'trim',label:'Погонаж'},
  {key:'wallPanel',label:'Стеновые панели'},
  {key:'hardware',label:'Фурнитура'},
  {key:'openingSystem',label:'Системы открывания'}
];
const CATALOG_HERO_EXTRA_ROUTES=['additionalElement','installation','plinth'];
const CATALOG_UTILITY_ROUTES=['stock','order'];

function catalogHeroIcon(key){
  const common='fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  if(key==='door36'||key==='single42'||key==='single59')return '<svg viewBox="0 0 120 90" aria-hidden="true"><rect x="37" y="8" width="46" height="74" rx="2" '+common+'/><rect x="43" y="13" width="34" height="67" rx="1.5" '+common+'/><circle cx="71" cy="48" r="1.8" fill="currentColor"/></svg>';
  if(key==='sliding42')return '<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M24 14h72" '+common+'/><rect x="31" y="18" width="42" height="62" rx="2" '+common+'/><rect x="56" y="18" width="38" height="62" rx="2" '+common+'/><circle cx="66" cy="51" r="1.7" fill="currentColor"/></svg>';
  if(key==='double42')return '<svg viewBox="0 0 120 90" aria-hidden="true"><rect x="24" y="10" width="72" height="70" rx="2" '+common+'/><path d="M60 10v70" '+common+'/><circle cx="55" cy="48" r="1.5" fill="currentColor"/><circle cx="65" cy="48" r="1.5" fill="currentColor"/></svg>';
  if(key==='trim')return '<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M36 19v57h16V13H36v6Zm16 2h16v55H52m16-45h16v45H68" '+common+'/><path d="M36 19 23 27v49h13M52 13 40 20m28 1-12 7m28 8-12 7" '+common+' opacity=".55"/></svg>';
  if(key==='wallPanel')return '<svg viewBox="0 0 120 90" aria-hidden="true"><rect x="21" y="14" width="78" height="62" rx="2" '+common+'/><path d="M47 14v62M73 14v62" '+common+'/><path d="M74 15h24v60H74z" fill="currentColor" opacity=".14"/></svg>';
  if(key==='hardware')return '<svg viewBox="0 0 120 90" aria-hidden="true"><circle cx="34" cy="31" r="10" '+common+'/><path d="M43 31h39" '+common+'/><path d="M80 31h12" '+common+'/><circle cx="35" cy="63" r="9" '+common+'/><path d="M35 60v7" '+common+'/><rect x="76" y="50" width="16" height="29" rx="2" '+common+'/><path d="M80 56h8M80 64h8M84 50v29" '+common+' opacity=".7"/></svg>';
  if(key==='openingSystem')return '<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M22 17h76" '+common+'/><path d="M28 22v56M92 22v56" '+common+' opacity=".45"/><rect x="32" y="24" width="43" height="52" rx="2" '+common+'/><path d="M77 50h15M86 43l7 7-7 7" '+common+'/><circle cx="68" cy="51" r="1.7" fill="currentColor"/></svg>';
  if(key==='stock')return '<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M27 17v60M93 17v60M27 39h66M27 61h66" '+common+'/><rect x="35" y="23" width="19" height="12" rx="1" '+common+'/><rect x="63" y="23" width="22" height="12" rx="1" '+common+'/><rect x="37" y="45" width="23" height="12" rx="1" '+common+'/><rect x="67" y="45" width="17" height="12" rx="1" '+common+'/><rect x="34" y="66" width="21" height="10" rx="1" '+common+'/><rect x="64" y="66" width="23" height="10" rx="1" '+common+'/></svg>';
  if(key==='order')return '<svg viewBox="0 0 120 90" aria-hidden="true"><rect x="31" y="13" width="58" height="68" rx="4" '+common+'/><rect x="47" y="8" width="27" height="10" rx="3" '+common+'/><path d="M43 34h34M43 45h34M43 56h25" '+common+' opacity=".7"/><circle cx="80" cy="66" r="12" fill="currentColor" opacity=".14"/><path d="M74 62h3l2 7h8l2-5H78M80 72h.01M87 72h.01" '+common+'/></svg>';
  return '<svg viewBox="0 0 120 90" aria-hidden="true"><rect x="26" y="18" width="68" height="54" rx="8" '+common+'/><path d="M38 34h44M38 45h44M38 56h30" '+common+'/></svg>';
}

function renderCatalogHeroNav(){
  const track=$('catalogHeroTrack'); if(!track)return;
  if(!track.dataset.ready){
    track.innerHTML=CATALOG_HERO_MAIN_ROUTES.map(r=>
      '<button type="button" class="catalog-hero-card" data-catalog-route="'+r.key+'" aria-label="'+r.label+'">'+
        '<span class="catalog-hero-art">'+catalogHeroIcon(r.key)+'</span>'+
        '<span class="catalog-hero-label">'+r.label+'</span>'+
      '</button>'
    ).join('');
    track.querySelectorAll('[data-catalog-route]').forEach(btn=>{
      btn.addEventListener('click',()=>openCatalogHeroRoute(btn.dataset.catalogRoute));
    });
    track.dataset.ready='1';
  }
  renderCatalogHeroState();
}

function catalogHeroRouteFromProduct(){
  const p=product();
  if(p==='leaf36')return 'door36';
  if(p==='single42')return 'single42';
  if(p==='single59')return 'single59';
  if(p==='sliding42')return 'sliding42';
  if(p==='double42')return 'double42';
  if(['trim36','trim42','trim59'].includes(p))return 'trim';
  if(p==='wallPanel')return 'wallPanel';
  if(p==='hardware')return 'hardware';
  if(p==='openingSystem')return 'openingSystem';
  if(CATALOG_HERO_EXTRA_ROUTES.includes(p))return p;
  return 'single42';
}

function currentCatalogHeroRoute(){
  const stock=$('viewStock'),orderView=$('viewOrder'),config=$('viewConfigurator');
  if(stock&&!stock.classList.contains('hidden'))return 'stock';
  if(orderView&&!orderView.classList.contains('hidden'))return 'order';
  if(config&&!config.classList.contains('hidden'))return catalogHeroRouteFromProduct();
  return getStore(CATALOG_HERO_ROUTE_STORE,'single42');
}

function catalogHeroMainRoute(route){
  return CATALOG_HERO_EXTRA_ROUTES.includes(route)?'hardware':route;
}

function renderCatalogHeroState(){
  const route=currentCatalogHeroRoute();
  const main=catalogHeroMainRoute(route);
  document.querySelectorAll('[data-catalog-route]').forEach(btn=>{
    const active=btn.dataset.catalogRoute===main;
    btn.classList.toggle('active',active);
    btn.setAttribute('aria-pressed',active?'true':'false');
  });
  document.querySelectorAll('[data-catalog-extra]').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.catalogExtra===route);
  });
  const trimNav=$('catalogTrimSystemNav');
  trimNav?.classList.toggle('hidden',main!=='trim');
  const sys=$('catalogSystem')?.value||getStore(CATALOG_HERO_TRIM_SYSTEM_STORE,'42');
  document.querySelectorAll('[data-trim-system]').forEach(btn=>btn.classList.toggle('active',btn.dataset.trimSystem===sys));
}

function setCatalogTrimSystem(system){
  if(!['36','42','59'].includes(String(system)))return;
  setStore(CATALOG_HERO_TRIM_SYSTEM_STORE,String(system));
  if($('catalogSection'))$('catalogSection').value='trim';
  if($('catalogSystem'))$('catalogSystem').value=String(system);
  if($('doorExecution'))$('doorExecution').value='single';
  showView('configurator');
  syncTopCatalog(true);
  setStore(CATALOG_HERO_ROUTE_STORE,'trim');
  renderCatalogHeroState();
}

function openCatalogHeroRoute(key,remember=true){
  const mainKeys=CATALOG_HERO_MAIN_ROUTES.map(x=>x.key);
  if(!mainKeys.includes(key)&&!CATALOG_HERO_EXTRA_ROUTES.includes(key)&&!CATALOG_UTILITY_ROUTES.includes(key))key='single42';
  if(key==='stock'||key==='order'){
    if(remember)setStore(CATALOG_HERO_ROUTE_STORE,key);
    showView(key);
    renderCatalogHeroState();
    return;
  }
  showView('configurator');
  let section='doors',system='42',execution='single';
  if(key==='door36'){section='doors';system='36'}
  else if(key==='single42'){section='doors';system='42'}
  else if(key==='single59'){section='doors';system='59'}
  else if(key==='sliding42'){section='doors';system='42';execution='sliding'}
  else if(key==='double42'){section='doors';system='42';execution='double'}
  else if(key==='trim'){section='trim';system=getStore(CATALOG_HERO_TRIM_SYSTEM_STORE,'42')}
  else if(key==='wallPanel'){section='wallPanel'}
  else if(key==='hardware'){section='hardware'}
  else if(key==='openingSystem'){section='openingSystem'}
  else if(CATALOG_HERO_EXTRA_ROUTES.includes(key)){section=key}
  if($('catalogSection'))$('catalogSection').value=section;
  if($('catalogSystem'))$('catalogSystem').value=system;
  if($('doorExecution'))$('doorExecution').value=execution;
  syncTopCatalog(true);
  if(remember)setStore(CATALOG_HERO_ROUTE_STORE,key);
  renderCatalogHeroState();
}

function restoreCatalogHeroRoute(){
  const saved=getStore(CATALOG_HERO_ROUTE_STORE,'single42');
  const valid=CATALOG_HERO_MAIN_ROUTES.some(x=>x.key===saved)||CATALOG_HERO_EXTRA_ROUTES.includes(saved)||CATALOG_UTILITY_ROUTES.includes(saved);
  openCatalogHeroRoute(valid?saved:'single42',false);
}

function syncTopCatalog(triggerRender=true){
  const section=$('catalogSection')?.value||'doors';
  const system=$('catalogSystem')?.value||'42';
  let p='';
  if(section==='doors'){
    const execution=(system==='42'?($('doorExecution')?.value||'single'):'single');
    p=system==='36'?'leaf36':system==='59'?'single59':execution==='double'?'double42':execution==='sliding'?'sliding42':'single42';
  } else if(section==='trim'){
    p=system==='36'?'trim36':system==='42'?'trim42':'trim59';
  } else {
    p=section;
  }
  if($('productType'))$('productType').value=p;

  const needsSystem=['doors','trim'].includes(section);
  $('catalogSystemWrap')?.classList.toggle('hidden',!needsSystem);
  const doubleAllowed=section==='doors'&&system==='42';
  $('doorExecutionWrap')?.classList.toggle('hidden',!doubleAllowed);
  if($('doorExecution') && !doubleAllowed)$('doorExecution').value='single';

  const labels={
    doors:'Двери',trim:'Погонаж',hardware:'Фурнитура',openingSystem:'Системы и механизмы открывания',
    additionalElement:'Дополнительные элементы двери',installation:'Монтаж и комплектующие',plinth:'Плинтус',wallPanel:'Стеновые панели'
  };
  let hint=labels[section]||section;
  if(needsSystem)hint+=' → '+system+' мм';
  if(doubleAllowed){
    const ex=$('doorExecution').value;
    hint+=' → '+(ex==='double'?'Двустворчатая':ex==='sliding'?'Откатная':'Одностворчатая');
  }
  if($('catalogPathHint'))$('catalogPathHint').textContent=hint;
  if(section==='trim')setStore(CATALOG_HERO_TRIM_SYSTEM_STORE,system);
  if(triggerRender)setStore(CATALOG_HERO_ROUTE_STORE,catalogHeroRouteFromProduct());
  renderCatalogHeroState();

  if(triggerRender)renderForm();
}

function renderForm(){
  if(product()==='single42') renderSingle42();
  if(product()==='single59') renderSingle59();
  if(product()==='leaf36') renderLeaf36();
  if(product()==='wallPanel') renderWallPanel();
  if(product()==='trim36') renderTrim36();
  if(product()==='trim42') renderTrim42();
  if(product()==='trim59') renderTrim59();
  if(product()==='double42') renderDouble42();
  if(product()==='sliding42') renderSliding42();
  if(product()==='hardware') renderHardware();
  if(product()==='openingSystem') renderOpeningSystem();
  if(product()==='additionalElement') renderAdditionalElement();
  if(product()==='installation') renderInstallation();
  if(product()==='plinth') renderPlinth();
  bindAll();
  render();
}
