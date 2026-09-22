const HARDWARE_USER_IMAGE_STORE='hd_v74_hardware_images';
let hardwareImageEditTarget=null;
let catalogImageSearchContext=null;

function hardwareCategoryForDictionaryType(type){
  const map={hinge:'Петли',lock:'Замки',handle:'Ручки',turn:'Завертки',cylinder:'Цилиндровые механизмы',stop:'Стопоры',threshold:'Скрытый порог',closer:'Доводчики',opening:'Системы открывания',grille:'Вентиляционные решетки'};
  return map[type]||type||'Фурнитура';
}
function hardwareUserImageKey(category,item){
  return String(category||'')+'|'+String(item||'').trim().toUpperCase();
}
function hardwareUserImages(){return getStore(HARDWARE_USER_IMAGE_STORE,{})}
function hardwareUserImageMeta(category,item){
  const record=hardwareUserImages()[hardwareUserImageKey(category,item)];
  if(!record?.image)return null;
  return {image:record.image,source:'Загружено вручную · '+(record.fileName||'фото'),status:'manual',updatedAt:record.updatedAt||''};
}
function saveHardwareUserImage(category,item,image,fileName='Фото',refresh=true){
  if(!catalogWriteAllowed()||!category||!item||!image)return false;
  const all=hardwareUserImages();
  all[hardwareUserImageKey(category,item)]={
    category:String(category),item:String(item),image:String(image),fileName:String(fileName||'Фото'),
    updatedAt:new Date().toISOString(),updatedBy:role()
  };
  setStore(HARDWARE_USER_IMAGE_STORE,all);
  if(refresh){
    if(typeof renderHingeCatalogCards==='function')renderHingeCatalogCards();
    if(typeof renderHardwareCatalogCards==='function')renderHardwareCatalogCards();
    if(typeof renderOpeningSystemCards==='function')renderOpeningSystemCards();
  }
  return true;
}
async function compressCatalogImageFile(file){
  if(!file||!String(file.type||'').startsWith('image/'))throw new Error('Выберите файл изображения JPG, PNG или WebP.');
  if(file.size>12*1024*1024)throw new Error('Файл слишком большой. Максимум 12 МБ.');
  const source=await new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(reader.result);
    reader.onerror=()=>reject(new Error('Не удалось прочитать файл.'));
    reader.readAsDataURL(file);
  });
  const img=await new Promise((resolve,reject)=>{
    const el=new Image();
    el.onload=()=>resolve(el);
    el.onerror=()=>reject(new Error('Не удалось открыть изображение.'));
    el.src=source;
  });
  const maxSide=1000;
  const iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height;
  const scale=Math.min(1,maxSide/Math.max(iw,ih));
  const w=Math.max(1,Math.round(iw*scale)),h=Math.max(1,Math.round(ih*scale));
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);
  return canvas.toDataURL('image/webp',0.82);
}
function catalogImageSearchQuery(parts=[]){
  const seen=new Set();
  return parts.map(x=>String(x||'').trim()).filter(Boolean).filter(x=>{
    const key=x.toUpperCase();if(seen.has(key))return false;seen.add(key);return true;
  }).join(' ').replace(/\s+/g,' ').trim();
}
function catalogImageSearchQueryForItem(category,item){
  const brand=typeof hardwareBrandForItem==='function'?hardwareBrandForItem(item):'';
  const cleanBrand=brand==='Не определено'?'':brand;
  return catalogImageSearchQuery([cleanBrand,item,'фото товара']);
}
function catalogImageSearchUrls(query){
  const q=encodeURIComponent(query);
  return {
    google:'https://www.google.com/search?tbm=isch&q='+q,
    yandex:'https://yandex.ru/images/search?text='+q,
    bing:'https://www.bing.com/images/search?q='+q
  };
}
function openCatalogImageSearch(context){
  if(!catalogWriteAllowed()){alert('Работа с изображениями доступна ролям «Снабжение» и «Администратор».');return}
  catalogImageSearchContext=context||null;
  const modal=$('catalogImageSearchModal');if(!modal)return;
  const query=String(context?.query||'').trim();
  if($('catalogImageSearchQuery'))$('catalogImageSearchQuery').value=query;
  if($('catalogImageUrl'))$('catalogImageUrl').value='';
  if($('catalogImageUrlPreview')){$('catalogImageUrlPreview').classList.add('hidden');$('catalogImageUrlPreview').src=''}
  const label=$('catalogImageSearchTarget');
  if(label)label.textContent=context?.label||context?.item||'Номенклатура';
  modal.classList.remove('hidden');
  document.body.style.overflow='hidden';
}
function closeCatalogImageSearch(){
  $('catalogImageSearchModal')?.classList.add('hidden');
  document.body.style.overflow='';
  catalogImageSearchContext=null;
  hardwareImageEditTarget=null;
  if($('catalogImageSearchUploadInput'))$('catalogImageSearchUploadInput').value='';
}
function launchCatalogImageSearch(engine){
  const query=$('catalogImageSearchQuery')?.value?.trim()||'';
  if(!query)return;
  const urls=catalogImageSearchUrls(query);
  const url=urls[engine]||urls.google;
  window.open(url,'_blank','noopener');
}
function previewCatalogImageUrl(){
  const url=$('catalogImageUrl')?.value?.trim()||'';
  const img=$('catalogImageUrlPreview'),status=$('catalogImageUrlStatus'),useBtn=$('catalogImageUseUrlBtn');
  if(useBtn)useBtn.disabled=true;
  if(status){status.className='mini';status.textContent=''}
  if(!img)return;
  img.dataset.valid='0';
  if(!/^https?:\/\//i.test(url)){
    img.classList.add('hidden');img.removeAttribute('src');
    if(status)status.textContent=url?'Нужна прямая ссылка http:// или https://':'';
    return;
  }
  img.onload=()=>{
    img.dataset.valid='1';
    if(status){status.className='mini image-url-ok';status.textContent='Изображение открывается — ссылку можно использовать.'}
    if(useBtn)useBtn.disabled=false;
  };
  img.onerror=()=>{
    img.dataset.valid='0';img.classList.add('hidden');
    if(status){status.className='mini image-url-error';status.textContent='Ссылка не открылась как изображение. Скачайте фото и загрузите файлом либо скопируйте прямую ссылку на картинку.'}
    if(useBtn)useBtn.disabled=true;
  };
  img.classList.remove('hidden');img.src=url;
}
function applyCatalogImageToContext(image,name){
  const ctx=catalogImageSearchContext;if(!ctx||!image)return false;
  if(ctx.mode==='replace'){
    return saveHardwareUserImage(ctx.category,ctx.item,image,name||'Фото из интернета',true);
  }
  if(ctx.mode==='dictionary'){
    dictionaryPendingImageData=image;
    dictionaryPendingImageName=name||'Фото из интернета';
    if(typeof renderDictionaryImagePreview==='function')renderDictionaryImagePreview();
    return true;
  }
  if(ctx.mode==='import'&&Number.isInteger(ctx.index)&&typeof nomenclatureImportRows!=='undefined'&&nomenclatureImportRows[ctx.index]){
    nomenclatureImportRows[ctx.index].imageData=image;
    nomenclatureImportRows[ctx.index].imageName=name||'Фото из интернета';
    if(typeof refreshImportRows==='function')refreshImportRows();
    return true;
  }
  return false;
}
function useCatalogImageUrl(){
  const url=$('catalogImageUrl')?.value?.trim()||'';
  const img=$('catalogImageUrlPreview');
  if(!/^https?:\/\//i.test(url)){alert('Вставьте прямую ссылку на изображение, начинающуюся с http:// или https://');return}
  if(img?.dataset.valid!=='1'){alert('Сначала проверьте ссылку: изображение должно открыться в предпросмотре.');return}
  if(applyCatalogImageToContext(url,'Фото из интернета'))closeCatalogImageSearch();
}
async function handleCatalogImageSearchUpload(file){
  if(!file||!catalogImageSearchContext)return;
  try{
    const image=await compressCatalogImageFile(file);
    if(applyCatalogImageToContext(image,file.name||'Загруженное фото'))closeCatalogImageSearch();
  }catch(err){alert(err?.message||'Не удалось загрузить изображение.')}
}
function openHardwareImageReplace(category,item){
  if(!catalogWriteAllowed()){alert('Замена изображений доступна ролям «Снабжение» и «Администратор».');return}
  hardwareImageEditTarget={category:String(category||''),item:String(item||'')};
  openCatalogImageSearch({
    mode:'replace',
    category:String(category||''),
    item:String(item||''),
    label:String(item||''),
    query:catalogImageSearchQueryForItem(category,item)
  });
}
async function handleHardwareImageReplaceFile(file){
  if(!file||!hardwareImageEditTarget)return;
  const target=hardwareImageEditTarget;
  try{
    const image=await compressCatalogImageFile(file);
    saveHardwareUserImage(target.category,target.item,image,file.name,true);
  }catch(err){alert(err?.message||'Не удалось загрузить изображение.')}finally{
    hardwareImageEditTarget=null;
    if($('hardwareImageReplaceInput'))$('hardwareImageReplaceInput').value='';
  }
}
function catalogImageEditControl(kind,index){
  return catalogWriteAllowed()?'<span class="catalog-image-edit-btn" role="button" tabindex="0" data-image-edit-kind="'+escapeHtml(kind)+'" data-image-edit-index="'+index+'">Заменить изображение</span>':'';
}

document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('catalogImageSearchModal')?.classList.contains('hidden'))closeCatalogImageSearch()});

// v75 final build checkpoint
