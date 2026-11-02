/* TCO Kalla Toyota — renderer tunggal; data part per unit ada di data/units/<slug>.js */
(() => {
  'use strict';
  const $=(selector, root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money=value=>typeof value==='number'?`Rp${value.toLocaleString('id-ID')}`:'Harga belum tercantum';
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const catalog=Array.isArray(window.CATALOG)?window.CATALOG:[];
  window.TCO_UNIT_DATA=window.TCO_UNIT_DATA||{};
  if (!catalog.length) { $('#hero-title').textContent='Katalog belum tersedia';return; }
  const loaded=new Map();
  let index=Math.max(0,catalog.findIndex(m=>m.slug===(new URLSearchParams(location.search).get('unit')||'agya')));
  let tab='all',selectedColor='white',focusedPart=null,hideTimer=0,loadToken=0;
  const hoverCapable=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const model=()=>catalog[index];
  const data=()=>window.TCO_UNIT_DATA[model().slug]||null;
  const palette=()=>data()?.colors||[];
  const chosen=()=>palette().find(v=>v.key===selectedColor)||palette()[0]||null;
  const sourceParts=()=>Array.isArray(data()?.parts)?data().parts:[];

  // Browser file:// juga bisa memuat data via script. Tambah part cukup edit file unit tersebut.
  function loadUnit(slug){
    if(window.TCO_UNIT_DATA[slug])return Promise.resolve(true);
    if(loaded.has(slug))return loaded.get(slug);
    const task=new Promise(resolve=>{
      const script=document.createElement('script');
      script.src=`data/units/${encodeURIComponent(slug)}.js`;
      script.async=true;
      script.onload=()=>resolve(!!window.TCO_UNIT_DATA[slug]);
      script.onerror=()=>resolve(false);
      document.head.appendChild(script);
    });
    loaded.set(slug,task);
    return task;
  }

  function activePart(part){
    const p={...part};
    if(part.imagesByColor?.[selectedColor])p.image=part.imagesByColor[selectedColor];
    p.partsForColor=[];
    if(part.variants){
      p.partsForColor=part.variants[selectedColor]||[];
      p.hasColorVariant=p.partsForColor.length>0;
      p.sku=p.partsForColor.length===1?p.partsForColor[0].sku:null;
      p.price=p.partsForColor.length&&p.partsForColor.every(v=>v.price===p.partsForColor[0].price)?p.partsForColor[0].price:null;
      p.variantUnavailable=!p.hasColorVariant;
      p.note=p.hasColorVariant?`SKU khusus warna ${chosen()?.name||selectedColor}. ${part.note||''}`:`Tidak ada SKU untuk warna ${chosen()?.name||selectedColor} dalam data unit ini. Harga tidak diasumsikan sama dengan warna lain.`;
    }
    return p;
  }
  const allParts=()=>sourceParts().map(activePart);
  const title=p=>p.title||p.name||'Aksesori Toyota';
  const sku=p=>p.status==='verify'?'':p.sku||p.partNumber||'';
  function priceText(p){
    if(p.variantUnavailable)return 'Varian warna belum tersedia';
    if(p.status==='verify')return 'Harga belum terverifikasi';
    if(p.status==='bulletin')return p.priceLabel||'Mengikuti Part Bulletin';
    if(p.options?.length)return 'Pilihan varian (lihat rincian)';
    return money(p.price);
  }
  function descriptionNote(p){
    if(p.variantUnavailable)return p.note;
    if(p.status==='verify')return `Harga pembanding: ${money(p.referencePrice)} untuk ${p.referenceName||'nama part berbeda'}. SKU belum dapat dipastikan sama.`;
    return p.note||p.priceLabel||'';
  }
  function componentRows(parts,heading){
    if(!parts?.length)return '';
    return `<div class="part-components"><strong>${escapeHTML(heading)}</strong>${parts.map(p=>`<div><span>${escapeHTML(p.name||p.title)} <small>${escapeHTML(p.sku||'')}</small></span><b>${escapeHTML(money(p.price))}</b></div>`).join('')}</div>`;
  }
  function hidePopover(){clearTimeout(hideTimer);$('#part-popover').hidden=true;focusedPart=null;$$('.hotspot').forEach(b=>{b.classList.remove('is-active');b.setAttribute('aria-expanded','false')})}
  function delayHide(){clearTimeout(hideTimer);hideTimer=setTimeout(hidePopover,165)}
  function showPopover(part,button){
    if(!part)return;
    clearTimeout(hideTimer);focusedPart=part.id;
    $$('.hotspot').forEach(b=>{const active=b.dataset.partId===part.id;b.classList.toggle('is-active',active);b.setAttribute('aria-expanded',String(active))});
    $('#popover-title').textContent=title(part);
    $('#popover-sku').textContent=sku(part)?`Part Number: ${sku(part)}`:part.partsForColor?.length>1?'Beberapa SKU (lihat card)':'Part Number: lihat rincian';
    $('#popover-price').textContent=priceText(part);
    $('#popover-description').textContent=part.description||'Informasi aksesori TCO.';
    $('#popover-note').textContent=descriptionNote(part);
    const image=$('#popover-image');image.style.display=part.image?'block':'none';if(part.image){image.src=part.image;image.onerror=()=>{image.style.display='none'}}
    image.alt=`Ilustrasi ${title(part)}`;
    const pop=$('#part-popover');pop.hidden=false;
    const rect=button.getBoundingClientRect(),w=pop.offsetWidth,h=pop.offsetHeight;
    const topMin=($('#site-header')?.offsetHeight||106)+10;
    pop.style.left=clamp(rect.left+rect.width/2-w/2,10,Math.max(10,innerWidth-w-10))+'px';
    pop.style.top=clamp(rect.bottom+h+12<innerHeight?rect.bottom+12:rect.top-h-12,topMin,Math.max(topMin,innerHeight-h-12))+'px';
  }
  function attachHotspot(button,part){
    if(hoverCapable){button.addEventListener('mouseenter',()=>showPopover(part,button));button.addEventListener('mouseleave',delayHide)}
    button.addEventListener('click',e=>{e.stopPropagation();if(!hoverCapable&&focusedPart===part.id&&!$('#part-popover').hidden)hidePopover();else showPopover(part,button)});
    button.addEventListener('blur',delayHide);
  }
  $('#part-popover').addEventListener('mouseenter',()=>clearTimeout(hideTimer));
  $('#part-popover').addEventListener('mouseleave',delayHide);
  $('#popover-close').addEventListener('click',hidePopover);
  document.addEventListener('pointerdown',e=>{if(!e.target.closest('.hotspot,.part-popover'))hidePopover()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')hidePopover()});
  window.addEventListener('scroll',()=>{if(!$('#part-popover').hidden)hidePopover()},{passive:true});
  window.addEventListener('resize',hidePopover);

  function assignImage(image,url,onMissing,onLoaded){
    const request=(image._request||0)+1;image._request=request;
    image.hidden=true;
    image.onload=()=>{if(image._request!==request)return;image.hidden=false;onLoaded?.()};
    image.onerror=()=>{if(image._request!==request)return;image.hidden=true;onMissing?.()};
    if(url)image.src=url;else onMissing?.();
  }
  function renderHero(){
    const m=model(),d=data();const words=(d.title||m.name).split('|');
    document.title=`${m.name} — TCO Kalla Toyota`;
    $('#breadcrumb-unit').textContent=m.name;
    $('#hero-title').innerHTML=escapeHTML(words[0])+(words.length>1?` <em>${escapeHTML(words.slice(1).join(' '))}</em>`:'');
    $('#hero-tagline').textContent=d.tagline||'Explore Toyota Customization Option.';
    $('#hero-category').textContent=m.category;
    const color=chosen(),photo=$('#hero-car'),notice=$('#hero-image-error');
    photo.alt=`${m.name} warna ${color?.name||'putih'} tampak depan`;
    notice.hidden=true;
    assignImage(photo,color?.front||m.frontImage||m.main,()=>{notice.textContent=`Foto warna ${color?.name||'pilihan'} belum tersedia. Tidak menggunakan foto warna lain.`;notice.hidden=false},()=>{notice.hidden=true});
    $('#color-list').innerHTML=palette().map(c=>{
      const bg=c.twoTone?`linear-gradient(90deg,${c.hex} 0 50%,#16191d 50% 100%)`:c.hex;
      return `<button class="color-swatch${c.twoTone?' two-tone':''}" type="button" style="--swatch:${escapeHTML(bg)}" data-color="${escapeHTML(c.key)}" aria-label="${escapeHTML(c.name)}" title="${escapeHTML(c.name)}" aria-pressed="${c.key===selectedColor}"></button>`;
    }).join('');
    $('#color-name').textContent=color?.name||'Warna tidak tersedia';
    $('#color-panel').hidden=palette().length===0;
    $$('.color-swatch').forEach(button=>button.addEventListener('click',()=>{
      selectedColor=button.dataset.color;hidePopover();renderHero();renderAngles(allParts());renderCards(allParts());
    }));
    updateColorDock();
  }
  function renderAngles(parts){
    const gallery=$('#angle-gallery');gallery.innerHTML='';
    const active=chosen(),unit=model(),isCalibrated=['agya','calya','raize'].includes(unit.slug);
    const hasNamedColor=palette().length>1;
    $('#explorer-description').innerHTML=`Foto kendaraan mengikuti warna <strong>${escapeHTML(active?.name||'pilihan')}</strong>. Hover titik hijau atau ketuk pada ponsel untuk melihat aksesori, SKU, dan harga. Posisi titik mengikuti kalibrasi gambar referensi; varian dengan crop berbeda perlu disesuaikan.`;
    const views=[{key:'front',label:'TAMPAK DEPAN'},{key:'rear',label:'TAMPAK BELAKANG'}];
    gallery.classList.remove('single');
    for(const v of views){
      const url=active?.[v.key]||`assets/vehicles/${unit.slug}/colors/${v.key}-${selectedColor}.png`;
      const panel=document.createElement('article');panel.className='angle-panel';
      panel.innerHTML=`<div class="angle-panel-top"><span class="angle-name">${v.label}</span><span class="angle-note">${escapeHTML(active?.name||'White')} · ${isCalibrated?'titik aksesori':'foto referensi'}</span></div><div class="angle-image-space"><img alt="${escapeHTML(unit.name+' '+v.label+' '+(active?.name||''))}"><div class="hit-layer" hidden></div><div class="image-missing" hidden>Foto ${escapeHTML(v.label.toLowerCase())} warna ${escapeHTML(active?.name||'pilihan')} belum tersedia.<br>Tambahkan <strong>${escapeHTML(v.key+'-'+selectedColor+'.png')}</strong> pada folder warna unit.</div></div><p class="angle-instruction">${isCalibrated?'Hover atau ketuk titik untuk melihat detail aksesori':'Foto warna mengikuti pilihan; hotspot belum dikalibrasi'}</p>`;
      gallery.appendChild(panel);
      const img=$('img',panel),dots=$('.hit-layer',panel),missing=$('.image-missing',panel);
      const positioned=isCalibrated?parts.filter(p=>Array.isArray((p.positionsByColor?.[selectedColor]||p.pos)?.[v.key])&&!p.variantUnavailable):[];
      dots.innerHTML=positioned.map(p=>{const xy=(p.positionsByColor?.[selectedColor]||p.pos)[v.key];return `<button type="button" class="hotspot" data-part-id="${escapeHTML(p.id)}" style="--x:${clamp(xy[0],1,99)}%;--y:${clamp(xy[1],1,99)}%" aria-controls="part-popover" aria-expanded="false" aria-label="Lihat ${escapeHTML(title(p))}"></button>`}).join('');
      const byId=new Map(parts.map(p=>[p.id,p]));$$('.hotspot',dots).forEach(button=>attachHotspot(button,byId.get(button.dataset.partId)));
      assignImage(img,url,()=>{missing.hidden=false;dots.hidden=true},()=>{missing.hidden=true;dots.hidden=!positioned.length});
    }
  }
  function renderCards(parts){
    const visible=parts.filter(p=>tab==='all'||p.kind===tab);
    $('#part-count').textContent=parts.length;
    if(!visible.length){
      $('#tab-content').innerHTML=`<div class="empty-state">${model().slug==='bz4x'?'Data SKU dan harga aksesori bZ4X belum terverifikasi.':'Belum ada part pada kategori ini. Tambahkan pada data/units/'+escapeHTML(model().slug)+'.js.'}</div>`;
      return;
    }
    $('#tab-content').innerHTML=`<div class="parts-grid">${visible.map(p=>{
      const partRows=p.partsForColor?.length>1?componentRows(p.partsForColor,'Pilihan SKU sesuai grade/varian'):'';
      const optionRows=componentRows(p.options,'Pilihan aroma / varian');
      const componentTable=componentRows(p.components,p.componentsNote||'Rincian sparepart / komponen');
      const noSkuText=p.variantUnavailable?'SKU warna ini belum terdaftar':p.components?.length||p.options?.length?'Lihat nomor part pada rincian':'P/N belum tersedia';
      const pno=sku(p)?`P/N: ${sku(p)}`:noSkuText;
      return `<article class="part-card" data-part-id="${escapeHTML(p.id)}"><div class="part-media ${p.image?'':'no-photo'}">${p.image?`<img src="${escapeHTML(p.image)}" loading="lazy" alt="Ilustrasi ${escapeHTML(title(p))}">`:''}<span class="media-placeholder" ${p.image?'hidden':''}>Foto part belum tersedia</span></div><div class="part-body"><h3>${escapeHTML(title(p))}</h3><span class="part-sku">${escapeHTML(pno)}</span><span class="price ${p.status||p.variantUnavailable||p.options?.length?'uncertain':''}">${escapeHTML(priceText(p))}</span>${p.priceLabel&&!p.components?.length?`<span class="price-hint">${escapeHTML(p.priceLabel)}</span>`:''}<p>${escapeHTML(p.description||'Aksesori sesuai daftar TCO.')}</p>${partRows}${optionRows}${componentTable}${p.componentsNote?`<span class="part-photo-status">${escapeHTML(p.componentsNote)}</span>`:''}${descriptionNote(p)?`<span class="part-photo-status">${escapeHTML(descriptionNote(p))}</span>`:''}${p.photoStatus?`<span class="part-photo-status">${escapeHTML(p.photoStatus)}</span>`:''}${p.grades?.length?`<div class="part-grade">${p.grades.map(g=>`<span>${escapeHTML(g)}</span>`).join('')}</div>`:''}</div></article>`;
    }).join('')}</div>`;
    $$('.part-card img').forEach(img=>img.addEventListener('error',()=>{img.hidden=true;const placeholder=$('.media-placeholder',img.parentElement);if(placeholder)placeholder.hidden=false}));
  }
  function render(){
    const m=model(),d=data();
    if(!d){$('#tab-content').innerHTML=`<div class="empty-state">File data unit ${escapeHTML(m.slug)} belum tersedia.</div>`;return}
    if(!palette().some(c=>c.key===selectedColor))selectedColor=d.heroColor||palette()[0]?.key||'white';
    const parts=allParts();
    $('#unit-switch-label').textContent=m.name.toUpperCase();
    $('#unit-counter').textContent=`${String(index+1).padStart(2,'0')} / ${String(catalog.length).padStart(2,'0')}`;
    renderHero();renderAngles(parts);renderCards(parts);
    $$('.detail-tabs [data-tab]').forEach(b=>{const selected=b.dataset.tab===tab;b.classList.toggle('active',selected);b.setAttribute('aria-selected',String(selected))});
  }
  async function selectUnit(next,scroll=true,push=true){
    index=(next+catalog.length)%catalog.length;tab='all';selectedColor='white';hidePopover();
    const token=++loadToken,slug=model().slug;
    if(push)try{history.pushState(null,'',`detail.html?unit=${encodeURIComponent(slug)}`)}catch(_){}
    $('#tab-content').innerHTML='<div class="empty-state">Memuat data unit...</div>';
    await loadUnit(slug);
    if(token!==loadToken)return;
    render();if(scroll)window.scrollTo({top:0,behavior:'smooth'});
  }
  function updateColorDock(){
    const color=$('#color-panel');if(!color)return;
    color.classList.toggle('is-docked',window.scrollY>$('.hero').offsetTop+Math.max(50,$('.hero').offsetHeight/2));
  }
  window.addEventListener('scroll',updateColorDock,{passive:true});
  window.addEventListener('resize',updateColorDock);
  $('#prev-unit').addEventListener('click',()=>selectUnit(index-1));
  $('#next-unit').addEventListener('click',()=>selectUnit(index+1));
  $$('.detail-tabs [data-tab]').forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.tab;hidePopover();renderCards(allParts());$$('.detail-tabs [data-tab]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-selected',String(x===b))})}));
  window.addEventListener('popstate',()=>{const slug=new URLSearchParams(location.search).get('unit');const next=catalog.findIndex(x=>x.slug===slug);if(next>=0)selectUnit(next,false,false)});
  const menu=$('#menu-button'),mobile=$('#mobile-nav');
  menu?.addEventListener('click',()=>{mobile.hidden=!mobile.hidden;menu.setAttribute('aria-expanded',String(!mobile.hidden))});
  $$('#mobile-nav a').forEach(a=>a.addEventListener('click',()=>{mobile.hidden=true;menu?.setAttribute('aria-expanded','false')}));
  window.enableTCOHotspotCalibration=()=>$$('.angle-image-space img').forEach(img=>img.addEventListener('click',e=>{const r=img.getBoundingClientRect();console.info(img.alt,[(100*(e.clientX-r.left)/r.width).toFixed(1),(100*(e.clientY-r.top)/r.height).toFixed(1)])}));
  let start=null;
  $('#swipe-zone').addEventListener('touchstart',e=>{const t=e.changedTouches[0];start=[t.clientX,t.clientY]},{passive:true});
  $('#swipe-zone').addEventListener('touchend',e=>{if(!start)return;const t=e.changedTouches[0],dx=t.clientX-start[0],dy=t.clientY-start[1];if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)selectUnit(index+(dx<0?1:-1));start=null},{passive:true});
  // Panel warna diletakkan di body supaya tidak terpotong overflow hero saat scrolling.
  document.body.appendChild($('#color-panel'));
  selectUnit(index,false,false);
})();
