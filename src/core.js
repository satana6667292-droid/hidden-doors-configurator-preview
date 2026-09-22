const $=id=>document.getElementById(id);
const role=()=>$('role').value;
const elevated=()=>['supply','admin','elena'].includes(role());
const dimensionCustomAllowed=()=>['manager','supply','admin','elena'].includes(role());
const catalogWriteAllowed=()=>elevated();
const managerWorkflowVisible=()=>['manager','supply','admin'].includes(role());
const bitrixDealActionAllowed=()=>['manager','admin'].includes(role());
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
