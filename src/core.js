const $=id=>document.getElementById(id);

const HD_ROLE_PERMISSIONS=Object.freeze({
  manager:Object.freeze({
    label:'Менеджер',
    dimensionCustom:true,
    catalogWrite:false,
    stockWrite:false,
    stockDelete:false,
    stockDemoClear:false,
    stockExport:true,
    createSku:false,
    managerWorkflow:true,
    bitrixDeal:true,
    cartDiscount:true,
    pricingAdmin:false,
    bitrixAdminAudit:false
  }),
  supply:Object.freeze({
    label:'Снабжение',
    dimensionCustom:true,
    catalogWrite:true,
    stockWrite:true,
    stockDelete:true,
    stockDemoClear:true,
    stockExport:true,
    createSku:true,
    managerWorkflow:true,
    bitrixDeal:false,
    cartDiscount:true,
    pricingAdmin:false,
    bitrixAdminAudit:false
  }),
  admin:Object.freeze({
    label:'Администратор',
    dimensionCustom:true,
    catalogWrite:true,
    stockWrite:true,
    stockDelete:true,
    stockDemoClear:true,
    stockExport:true,
    createSku:true,
    managerWorkflow:true,
    bitrixDeal:true,
    cartDiscount:true,
    pricingAdmin:true,
    bitrixAdminAudit:true
  })
});
function normalizeRole(value){
  const raw=String(value||'').toLowerCase();
  if(raw==='elena')return 'supply';
  return Object.prototype.hasOwnProperty.call(HD_ROLE_PERMISSIONS,raw)?raw:'manager';
}
function runtimeRoleContext(){
  const ctx=window.HD_RUNTIME_CONTEXT;
  if(!ctx||ctx.locked!==true)return null;
  return {...ctx,role:normalizeRole(ctx.role)};
}
function role(){
  const runtime=runtimeRoleContext();
  if(runtime)return runtime.role;
  return normalizeRole($('role')?.value||'manager');
}
function rolePermissions(){return HD_ROLE_PERMISSIONS[role()]||HD_ROLE_PERMISSIONS.manager}
function can(permission){return rolePermissions()[permission]===true}
function roleLabel(){return rolePermissions().label||role()}
function roleLocked(){return !!runtimeRoleContext()}
function elevated(){return can('catalogWrite')}
function dimensionCustomAllowed(){return can('dimensionCustom')}
function catalogWriteAllowed(){return can('catalogWrite')}
function managerWorkflowVisible(){return can('managerWorkflow')}
function bitrixDealActionAllowed(){return can('bitrixDeal')}
function setRuntimeRoleContext(context){
  window.HD_RUNTIME_CONTEXT={...(context||{}),role:normalizeRole(context?.role),locked:true};
  if(typeof updateRoleUI==='function')updateRoleUI();
  if(typeof renderForm==='function')renderForm();
}
function initStandaloneRoleFromUrl(){
  if(runtimeRoleContext())return;
  try{
    const params=new URLSearchParams(window.location.search);
    const requested=params.get('hd_role');
    if(!requested)return;
    const normalized=normalizeRole(requested);
    const allowed=['manager','supply','admin'];
    if(!allowed.includes(normalized))return;
    window.HD_RUNTIME_CONTEXT={
      role:normalized,
      locked:true,
      source:'standalone-url',
      userName:params.get('hd_user')||(
        normalized==='supply'?'Сотрудник снабжения':
        normalized==='admin'?'Администратор':'Менеджер'
      )
    };
  }catch(e){}
}
const product=()=>$('productType').value;

function getStore(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch(e){return f}}
function setStore(k,v){localStorage.setItem(k,JSON.stringify(v))}
function getFilms36(){return [...new Set([...INITIAL_FILMS_36,...getStore('hd_v4_films36',[])])]}
function getFilmsGeneral(){return [...new Set([...INITIAL_FILMS_GENERAL,...getStore('hd_v4_films_general',[])])]}
function getFilms42(){return [...new Set([...getFilmsGeneral(),...getFilms36()])]}
function getRals(){return getStore('hd_v4_rals',BASE_RALS)}
function getRegistry(){return getStore('hd_registry_v4_proto',[])}
function saveRegistry(v){setStore('hd_registry_v4_proto',v)}

function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function options(vals,selected){return vals.map(v=>`<option ${String(v)===String(selected)?'selected':''}>${escapeHtml(v)}</option>`).join('')}
function range(a,b,step){const x=[];for(let n=a;n<=b;n+=step)x.push(n);return x}
function field(label,body,cls=''){return `<div class="${cls}"><label>${label}</label>${body}</div>`}
function selectEl(id,vals,sel){return `<select id="${id}">${options(vals,sel)}</select>`}
function inputEl(id,val,type='text',extra=''){return `<input id="${id}" type="${type}" value="${escapeHtml(val??'')}" ${extra}>`}
function plusButton(action){return elevated()?`<button class="plus" type="button" onclick="${action}">+</button>`:''}
function dimensionPlusButton(action){return dimensionCustomAllowed()?`<button class="plus" type="button" onclick="${action}" title="Ввести размер с шагом 5 мм">+</button>`:''}
function section(title,content){return `<div class="section"><div class="section-title">${title}</div>${content}</div>`}
function fields(content){return `<div class="fields">${content}</div>`}
