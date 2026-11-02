(() => {
  'use strict';
  const models=Array.isArray(window.CATALOG)?window.CATALOG:[];
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let category='Semua',term='',highlight=-1,visibleSuggestions=[];
  const categories=['Semua','LCGC','MPV','SUV','Commercial'];
  const search=$('#model-search'),suggestions=$('#search-suggestions'),wrapper=$('#search-wrapper');
  const header=$('#site-header'), catalog=$('#katalog'), home=$('#home');
  function isMatching(m){return (category==='Semua'||category===m.category) && (`${m.name} ${m.slug} ${m.category}`.toLocaleLowerCase('id-ID').includes(term));}
  // Transparan selama Home masih terlihat; putih tepat setelah hero Home terlewati.
  function updateHeader(){header.classList.toggle('is-solid',home.getBoundingClientRect().bottom <= header.offsetHeight);}
  window.addEventListener('scroll',updateHeader,{passive:true});
  window.addEventListener('resize',updateHeader);
  updateHeader();
  function setNav(){let current='home';const contact=$('#contact');const y=window.scrollY+header.offsetHeight+130;if(contact&&y>=contact.offsetTop)current='contact';else if(y>=catalog.offsetTop)current='katalog';$$('.main-nav a').forEach(a=>a.classList.toggle('active',a.dataset.section===current));$$('.progress-item').forEach(b=>{let on=b.dataset.jump===current;b.classList.toggle('current',on);on?b.setAttribute('aria-current','step'):b.removeAttribute('aria-current')})}
  window.addEventListener('scroll',setNav,{passive:true});setNav();
  $$('.progress-item').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.jump)?.scrollIntoView({behavior:'smooth'})));
  const menu=$('#menu-button'),mobile=$('#mobile-nav');
  menu?.addEventListener('click',()=>{mobile.hidden=!mobile.hidden;menu.setAttribute('aria-expanded',String(!mobile.hidden));});
  $$('#mobile-nav a').forEach(a=>a.addEventListener('click',()=>{mobile.hidden=true;menu.setAttribute('aria-expanded','false')}));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape' && mobile && !mobile.hidden){mobile.hidden=true;menu?.setAttribute('aria-expanded','false');menu?.focus()}
  });
  function renderFilters(){const f=$('#category-filters');f.innerHTML=categories.map(v=>`<button class="filter-btn ${category===v?'active':''}" type="button" data-cat="${esc(v)}" aria-pressed="${category===v}">${esc(v)}</button>`).join('');$$('button',f).forEach(b=>b.addEventListener('click',()=>{category=b.dataset.cat;renderFilters();renderGrid()}));}
  function renderGrid(){const result=models.filter(isMatching);$('#catalog-counter').innerHTML=`${result.length} UNIT <span>↘</span>`;$('#no-results').hidden=!!result.length;$('#model-grid').innerHTML=result.map((m,i)=>`<a class="model-card poster-card" href="detail.html?unit=${encodeURIComponent(m.slug)}" aria-label="Lihat aksesori ${esc(m.name)}"><div class="model-image poster-image"><span class="model-badge">${esc(m.category.toUpperCase())}</span><img src="${esc(m.poster||`assets/posters/${m.slug}.png`)}" alt="Poster Toyota ${esc(m.name)}" loading="lazy"></div><div class="model-info"><div><p>TOYOTA / ${String(models.indexOf(m)+1).padStart(2,'0')}</p><h3>${esc(m.name)}</h3></div><span class="model-arrow" aria-hidden="true">↗</span></div></a>`).join('')}
  function closeSuggestions(){suggestions.hidden=true;search.setAttribute('aria-expanded','false');search.removeAttribute('aria-activedescendant');highlight=-1}
  function updateSuggestions(){const v=search.value.trim().toLocaleLowerCase('id-ID');const normalize=m=>m.name.toLocaleLowerCase('id-ID').replace(/^(all new|new)\s+/,'').replace(/^kijang\s+/,'');visibleSuggestions=v?models.filter(m=>normalize(m).includes(v)||m.slug.includes(v)).sort((a,b)=>Number(normalize(b).startsWith(v))-Number(normalize(a).startsWith(v))).slice(0,7):[];
    if(!visibleSuggestions.length){closeSuggestions();return}
    suggestions.innerHTML=visibleSuggestions.map((m,i)=>`<a href="detail.html?unit=${encodeURIComponent(m.slug)}" role="option" id="suggestion-${i}" class="suggestion" data-index="${i}"><img src="${esc(m.poster||`assets/posters/${m.slug}.png`)}" alt="Poster Toyota ${esc(m.name)}" loading="lazy"><span><strong>${esc(m.name)}</strong><small>${esc(m.category)}</small></span><span aria-hidden="true">↗</span></a>`).join('');suggestions.hidden=false;search.setAttribute('aria-expanded','true');
  }
  function onSearch(value){search.value=value;term=value.trim().toLocaleLowerCase('id-ID');renderGrid();updateSuggestions()}
  search.addEventListener('input',()=>onSearch(search.value));
  search.addEventListener('focus',()=>{if(search.value.trim())updateSuggestions()});
  search.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSuggestions();return}if(suggestions.hidden)return;
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();highlight=(highlight+(e.key==='ArrowDown'?1:-1)+visibleSuggestions.length)%visibleSuggestions.length;$$('.suggestion',suggestions).forEach((a,i)=>a.classList.toggle('selected',i===highlight));search.setAttribute('aria-activedescendant','suggestion-'+highlight)}
    if(e.key==='Enter'&&highlight>=0){e.preventDefault();location.href=`detail.html?unit=${encodeURIComponent(visibleSuggestions[highlight].slug)}`;}
  });
  document.addEventListener('click',e=>{if(!wrapper.contains(e.target))closeSuggestions()});
  // Pencarian teks saja; tombol kaca pembesar menjalankan filter dan membuka saran.
  const searchButton=$('#search-submit');
  searchButton?.addEventListener('click',()=>{
    onSearch(search.value);
    search.focus();
  });
  renderFilters();renderGrid();
})();