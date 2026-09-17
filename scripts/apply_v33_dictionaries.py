from pathlib import Path

src = Path('v32.html')
out = Path('v33.html')
text = src.read_text(encoding='utf-8')

text = text.replace(
    '<title>Hidden Doors — Личный кабинет · Прототип v32 · Полный конфигуратор</title>',
    '<title>Hidden Doors — Личный кабинет · Прототип v33 · Справочники: правила добавления</title>'
)
text = text.replace(
    '<div class="sub">Прототип v32 · полный конфигуратор · каталог 36 + стеновые панели</div>',
    '<div class="sub">Прототип v33 · полный конфигуратор · справочники: ПВХ и RAL</div>'
)

dict_start = text.index('  <div id="viewDictionaries" class="appview hidden">')
dict_end = text.index('\n\n<script>', dict_start)
new_dict_html = '''  <div id="viewDictionaries" class="appview hidden">
    <section class="card">
      <div class="top" style="margin-bottom:14px">
        <div>
          <h2 style="font-size:20px;margin-bottom:4px">Справочники</h2>
          <div class="mini">Для каждой группы задаём отдельное правило добавления. В v33 настроены ПВХ-плёнки и RAL. ПВХ разделены на два каталога: специальный каталог 36 мм и общий каталог для остальной номенклатуры. Плёнки 36 мм при этом также доступны в 42/59 и стеновых панелях.</div>
        </div>
      </div>

      <div class="row" style="margin-bottom:14px">
        <button onclick="openDictionaryEditor('film36')">+ ПВХ-плёнка 36 мм</button>
        <button class="secondary" onclick="openDictionaryEditor('filmGeneral')">+ ПВХ-плёнка · общий каталог</button>
        <button class="secondary" onclick="openDictionaryEditor('ral')">+ RAL</button>
      </div>

      <div id="dictionaryEditor" class="pane hidden" style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start">
          <div>
            <div class="cap">Правило добавления</div>
            <div id="dictionaryEditorTitle" style="font-size:16px;font-weight:900"></div>
          </div>
          <button class="ghost" type="button" onclick="closeDictionaryEditor()">Закрыть</button>
        </div>
        <div id="dictionaryEditorNote" class="mini" style="margin-top:7px"></div>
        <div id="dictionaryEditorFields" class="fields" style="margin-top:12px"></div>
        <div id="dictionaryEditorError" class="status err hidden" style="margin-top:12px"></div>
        <div id="dictionaryEditorSuccess" class="status ok hidden" style="margin-top:12px"></div>
        <div class="row" style="margin-top:12px">
          <button id="dictionarySaveBtn" type="button" onclick="saveDictionaryEntry()" disabled>Добавить в справочник</button>
          <button class="secondary" type="button" onclick="closeDictionaryEditor()">Отмена</button>
        </div>
      </div>

      <div id="dictionaryGrid" class="dict-grid"></div>
    </section>
  </div>'''
text = text[:dict_start] + new_dict_html + text[dict_end:]

js_start = text.index('function renderDictionaries(){')
js_end = text.index("\n$('role').addEventListener", js_start)
new_js = r'''let dictionaryEditorType='';

function renderDictionaries(){
  const box=$('dictionaryGrid'); if(!box)return;
  const cards=[
    {key:'film36',name:'ПВХ-плёнки · 36 мм',count:getFilms36().length,note:'Специальный экономичный каталог для дверей 36 мм. Эти плёнки также доступны в 42/59 и стеновых панелях.'},
    {key:'filmGeneral',name:'ПВХ-плёнки · общий каталог',count:getFilmsGeneral().length,note:'Каталог для 42/59, стеновых панелей и остальной номенклатуры. В дверь 36 мм этот каталог не подставляется.'},
    {key:'ral',name:'RAL',count:getRals().length,note:'Редактируемый справочник цветов: обозначение RAL + обязательный четырёхзначный номер.'},
    {name:'Петли',count:catalogValues('Петли').length,note:'Bitrix24 · ревизия'},
    {name:'Замки',count:catalogValues('Замки').length,note:'Bitrix24 · ревизия'},
    {name:'Ручки',count:catalogValues('Ручки').length,note:'Bitrix24 · ревизия'},
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

function dictionaryClearMessages(){
  const err=$('dictionaryEditorError'), ok=$('dictionaryEditorSuccess');
  if(err){err.classList.add('hidden');err.textContent=''}
  if(ok){ok.classList.add('hidden');ok.textContent=''}
}
function dictionaryShowError(message){
  dictionaryClearMessages();
  const box=$('dictionaryEditorError'); if(!box)return;
  box.textContent=message; box.classList.remove('hidden');
}
function dictionaryShowSuccess(message){
  dictionaryClearMessages();
  const box=$('dictionaryEditorSuccess'); if(!box)return;
  box.textContent=message; box.classList.remove('hidden');
}
function openDictionaryEditor(type){
  dictionaryEditorType=type;
  const editor=$('dictionaryEditor'); if(!editor)return;
  dictionaryClearMessages();
  editor.classList.remove('hidden');
  const title=$('dictionaryEditorTitle'), note=$('dictionaryEditorNote'), fieldsBox=$('dictionaryEditorFields');
  if(type==='film36' || type==='filmGeneral'){
    const is36=type==='film36';
    title.textContent=is36?'Добавить ПВХ-плёнку · каталог 36 мм':'Добавить ПВХ-плёнку · общий каталог';
    note.textContent=is36
      ?'Оба поля обязательны. Каталог 36 мм используется в дверях 36 мм и дополнительно доступен в другой номенклатуре.'
      :'Оба поля обязательны. Общий каталог используется для 42/59, стеновых панелей и остальной номенклатуры.';
    fieldsBox.innerHTML=
      `<div><label>Номенклатурное наименование</label><input id="dictFilmName" autocomplete="off" placeholder="Например: Дуб натуральный" oninput="dictionaryRefreshSaveState()"></div>`+
      `<div><label>Артикул</label><input id="dictFilmArticle" autocomplete="off" placeholder="Например: TF 14 IE 28 21" oninput="dictionaryRefreshSaveState()"></div>`;
    setTimeout(()=>$('dictFilmName')?.focus(),0);
  }else if(type==='ral'){
    title.textContent='Добавить цвет RAL';
    note.textContent='Сохраняем обозначение как «RAL 9003»: система RAL фиксирована, номер обязателен и должен содержать 4 цифры.';
    fieldsBox.innerHTML=
      `<div><label>Обозначение</label><input value="RAL" disabled></div>`+
      `<div><label>Номер RAL</label><input id="dictRalNumber" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="9003" oninput="this.value=this.value.replace(/\\D/g,'').slice(0,4);dictionaryRefreshSaveState()"></div>`;
    setTimeout(()=>$('dictRalNumber')?.focus(),0);
  }
  dictionaryRefreshSaveState();
  editor.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function closeDictionaryEditor(){
  dictionaryEditorType='';
  const editor=$('dictionaryEditor'); if(editor)editor.classList.add('hidden');
  dictionaryClearMessages();
}
function dictionaryRefreshSaveState(){
  const btn=$('dictionarySaveBtn'); if(!btn)return;
  let ready=false;
  if(dictionaryEditorType==='film36' || dictionaryEditorType==='filmGeneral'){
    ready=!!($('dictFilmName')?.value.trim() && $('dictFilmArticle')?.value.trim());
  }else if(dictionaryEditorType==='ral'){
    ready=/^\d{4}$/.test($('dictRalNumber')?.value.trim()||'');
  }
  btn.disabled=!ready;
}
function dictionaryFilmArticle(item){
  return String(item||'').split('—').pop().trim().toUpperCase();
}
function saveDictionaryEntry(){
  dictionaryClearMessages();
  if(dictionaryEditorType==='film36' || dictionaryEditorType==='filmGeneral'){
    const name=$('dictFilmName')?.value.trim()||'';
    const article=$('dictFilmArticle')?.value.trim().toUpperCase()||'';
    if(!name || !article){dictionaryShowError('Заполните оба обязательных поля: номенклатурное наименование и артикул.');return}
    const all=[...getFilms36(),...getFilmsGeneral()];
    const same=all.find(x=>dictionaryFilmArticle(x)===article);
    if(same){dictionaryShowError('Плёнка с таким артикулом уже существует: '+same);return}
    const item=`${name} — ${article}`;
    const key=dictionaryEditorType==='film36'?'hd_v4_films36':'hd_v4_films_general';
    const vals=getStore(key,[]); vals.push(item); setStore(key,vals);
    $('dictFilmName').value=''; $('dictFilmArticle').value='';
    dictionaryShowSuccess('Добавлено: '+item);
    renderDictionaries(); renderForm(); dictionaryRefreshSaveState();
    return;
  }
  if(dictionaryEditorType==='ral'){
    const number=$('dictRalNumber')?.value.trim()||'';
    if(!/^\d{4}$/.test(number)){dictionaryShowError('Укажите 4 цифры номера RAL, например 9003.');return}
    const norm='RAL '+number;
    const vals=getRals();
    if(vals.includes(norm)){dictionaryShowError(norm+' уже есть в справочнике.');return}
    vals.push(norm); setStore('hd_v4_rals',vals);
    $('dictRalNumber').value='';
    dictionaryShowSuccess('Добавлено: '+norm);
    renderDictionaries(); renderForm(); dictionaryRefreshSaveState();
  }
}

function dictionaryAddRal(){openDictionaryEditor('ral')}
function dictionaryAddFilm(scope='general'){openDictionaryEditor(scope==='36'?'film36':'filmGeneral')}
'''
text = text[:js_start] + new_js + text[js_end:]

required = [
    'Прототип v33 · полный конфигуратор · справочники: ПВХ и RAL',
    "openDictionaryEditor('film36')",
    'Номенклатурное наименование',
    'Номер RAL',
    "catalogValues('Всё для монтажа')",
    "catalogValues('Плинтус')",
    "catalogValues('Доп.фурнитура')",
]
for marker in required:
    if marker not in text:
        raise SystemExit(f'Missing v33 marker: {marker}')

out.write_text(text, encoding='utf-8')
print(f'Wrote {out} ({out.stat().st_size} bytes)')
