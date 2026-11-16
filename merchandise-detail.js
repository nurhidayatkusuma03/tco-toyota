(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const esc = v => String(v ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const money = v => "Rp " + Number(v).toLocaleString("id-ID");
  const all = Array.isArray(window.GR_MERCHANDISE) ? window.GR_MERCHANDISE : [];
  const id = new URLSearchParams(location.search).get("category") || "";
  const category = all.find(x=>x.id===id);
  const menu=$("#menu-button"), mobile=$("#mobile-nav");
  menu?.addEventListener("click",()=>{mobile.hidden=!mobile.hidden;menu.setAttribute("aria-expanded",String(!mobile.hidden));});
  mobile?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{mobile.hidden=true;menu?.setAttribute("aria-expanded","false");}));
  if(!category){
    $("#merch-detail-title").textContent="Kategori tidak ditemukan";
    $("#merch-detail-description").textContent="Silakan kembali ke halaman Merchandise dan pilih kategori yang tersedia.";
    $("#merch-product-grid").innerHTML='<a class="merch-back-link" href="index.html#merchandise">← Kembali ke Merchandise</a>';
    return;
  }
  document.title=category.title+" — GR Merchandise | TCO Kalla Toyota";
  $("#merch-breadcrumb-title").textContent=category.title;
  $("#merch-detail-title").textContent=category.title;
  $("#merch-detail-description").textContent="Temukan pilihan "+category.title+" Toyota Gazoo Racing. Lihat varian, harga, warna, material, ukuran, dan Part Number setiap item.";
  $("#merch-product-count").textContent=category.products.length+" ITEM TERSEDIA";
  const heroImage=$("#merch-detail-image");
  heroImage.src=category.image;
  heroImage.alt="Model koleksi Toyota Gazoo Racing";
  heroImage.classList.add("merch-model-crop");
  const grid=$("#merch-product-grid"), search=$("#merch-product-search");
  function productHTML(p,i){
    const colors=(p.colors||[]).map(c=>'<span class="merch-color-chip">'+esc(c)+'</span>').join("");
    const variants=p.partNumbers ? Object.entries(p.partNumbers).map(([k,v])=>'<div class="merch-variant-row"><span>'+esc(k==="-"?"Part Number":k)+'</span><strong>'+esc(v)+'</strong></div>').join("") : "";
    return `<article class="merch-item-card">
      <div class="merch-item-content">
        <div class="merch-item-top">
          <span class="merch-item-number">ITEM ${String(i+1).padStart(2,"0")}</span>
          <span class="merch-item-category">GR COLLECTION</span>
        </div>
        <h3>${esc(p.name)}</h3>
        <div class="merch-item-price"><small>HARGA</small><strong>${money(p.price)}</strong></div>
        <div class="merch-item-divider"></div>
        <div class="merch-item-fields">
          <div class="merch-item-field"><small>PILIHAN WARNA</small><div class="merch-colors">${colors || '<p>Informasi warna belum tersedia</p>'}</div></div>
          <div class="merch-item-field"><small>MATERIAL / SPESIFIKASI</small><p>${esc(p.material || "Informasi belum tersedia")}</p></div>
        </div>
        ${variants ? '<details class="merch-sku-detail"><summary>Lihat ukuran & Part Number</summary><div class="merch-variant-list">'+variants+'</div></details>' : '<div class="merch-sku-detail"><p>Part Number belum tercantum pada katalog.</p></div>'}
      </div>
    </article>`;
  }
  function render(){
    const q=search.value.trim().toLocaleLowerCase("id-ID");
    const products=category.products.filter(p=>(p.name+" "+(p.colors||[]).join(" ")+" "+(p.material||"")+" "+Object.values(p.partNumbers||{}).join(" ")).toLocaleLowerCase("id-ID").includes(q));
    grid.innerHTML=products.map(p=>productHTML(p,category.products.indexOf(p))).join("");
    $("#merch-empty").hidden=products.length>0;
  }
  search.addEventListener("input",render);
  render();
})();