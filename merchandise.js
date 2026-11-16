/* TCO Toyota — GR Merchandise section. Loaded after app.js. */
(() => {
  "use strict";
  const groups = Array.isArray(window.GR_MERCHANDISE) ? window.GR_MERCHANDISE : [];
  const fmt = n => "Rp " + Number(n).toLocaleString("id-ID");
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const nav = document.querySelector("#main-nav");
  const mobileNav = document.querySelector("#mobile-nav");
  const catalog = document.querySelector("#katalog");
  if (!nav || !mobileNav || !catalog || document.querySelector("#merchandise")) return;

  const style = document.createElement("link");
  style.rel = "stylesheet"; style.href = "merchandise.css"; document.head.appendChild(style);

  const desktopLink = document.createElement("a");
  desktopLink.href = "#merchandise"; desktopLink.className = "nav-link"; desktopLink.dataset.section = "merchandise"; desktopLink.textContent = "Merchandise";
  nav.insertBefore(desktopLink, nav.querySelector('[data-section="contact"]'));

  const mobileLink = document.createElement("a");
  mobileLink.href = "#merchandise"; mobileLink.textContent = "Merchandise";
  mobileNav.insertBefore(mobileLink, mobileNav.querySelector('a[href="#contact"]'));

  const section = document.createElement("section");
  section.id = "merchandise"; section.className = "merch-section section-anchor";
  section.setAttribute("aria-labelledby","merch-title");
  section.innerHTML = `
    <div class="wide-container">
      <div class="merch-intro">
        <div><span class="small-index">EXPLORE THE COLLECTION / 03</span><h2 id="merch-title">GR <span>Merchandise.</span></h2>
        <p>Ekspresikan semangat Toyota Gazoo Racing melalui koleksi apparel dan gears untuk aktivitas sehari-hari.</p></div>
        <div class="merch-mark">GR <span>COLLECTION</span></div>
      </div>
      <div class="merch-toolbar">
        <div class="merch-filters" role="group" aria-label="Filter merchandise">
          <button class="merch-filter active" data-filter="Semua" aria-pressed="true">Semua</button>
          <button class="merch-filter" data-filter="Apparel" aria-pressed="false">Apparel</button>
          <button class="merch-filter" data-filter="Gears" aria-pressed="false">Gears</button>
        </div>
        <label class="merch-search"><span class="sr-only">Cari merchandise</span><input id="merch-search" type="search" placeholder="Cari merchandise..." autocomplete="off"><span>⌕</span></label>
      </div>
      <div class="merch-grid" id="merch-grid"></div>
      <p class="merch-note">Harga dan spesifikasi mengikuti GR Apparel & Merchandise Catalog yang menjadi referensi. Ketersediaan stok dan harga aktual dapat dikonfirmasi kepada GR Places.</p>
    </div>`;
  catalog.insertAdjacentElement("afterend", section);

  const progress = document.querySelector(".hero-progress");
  if (progress && !progress.querySelector('[data-jump="merchandise"]')) {
    const b = document.createElement("button");
    b.className = "progress-item"; b.type = "button"; b.dataset.jump = "merchandise";
    b.setAttribute("aria-label","03 · Buka Merchandise"); b.title = "Merchandise";
    b.innerHTML = '<span class="progress-line" aria-hidden="true"></span><span>03</span>';
    progress.insertBefore(b, progress.querySelector('[data-jump="contact"]'));
    const contactButton = progress.querySelector('[data-jump="contact"]');
    if (contactButton) { contactButton.querySelector("span:last-child").textContent = "04"; contactButton.setAttribute("aria-label","04 · Buka Hubungi Kami"); }
    b.addEventListener("click", () => section.scrollIntoView({behavior:"smooth"}));
  }

  const grid = section.querySelector("#merch-grid");
  const search = section.querySelector("#merch-search");
  let active = "Semua";
  function render() {
    const q = search.value.trim().toLocaleLowerCase("id-ID");
    const list = groups.filter(g => (active === "Semua" || g.category === active) &&
      (`${g.title} ${g.category} ${g.products.map(p => p.name + " " + p.colors.join(" ") + " " + p.material).join(" ")}`).toLocaleLowerCase("id-ID").includes(q));
    grid.innerHTML = list.map(g => {
      const startingPrice = Math.min(...g.products.map(p => Number(p.price) || Infinity));
      return `
      <article class="merch-card model-card">
        <div class="merch-image model-image"><img src="${esc(g.image)}" alt="${esc(g.title)} — Toyota Gazoo Racing" loading="lazy"><span>${esc(g.category)}</span><b class="merch-image-count">${g.products.length} PRODUK</b></div>
        <div class="merch-card-body">
          <div class="model-info merch-card-heading"><div><p>TOYOTA GAZOO RACING</p><h3>${esc(g.title)}</h3><span class="merch-price-from">Mulai ${fmt(startingPrice)}</span></div><span class="model-arrow" aria-hidden="true">↗</span></div>
          <button class="merch-toggle" type="button" aria-expanded="false">Lihat koleksi <span>＋</span></button>
          <div class="merch-products" hidden>${g.products.map(p => {
            const sku = p.partNumbers ? Object.entries(p.partNumbers).map(([k,v]) => `${k === "-" ? "" : k + ": "}${v}`).join(" · ") : "";
            return `<div class="merch-product"><div class="merch-product-top"><strong>${esc(p.name)}</strong><b>${fmt(p.price)}</b></div>
              <p class="merch-meta">${esc(p.colors.join(" / "))}${p.material ? " · " + esc(p.material) : ""}</p>
              ${sku ? `<details class="merch-sku"><summary>Ukuran & Part Number</summary><p>${esc(sku)}</p></details>` : ""}
            </div>`;
          }).join("")}</div>
        </div>
      </article>`;
    }).join("");
    grid.querySelectorAll(".merch-toggle").forEach(btn => btn.addEventListener("click", () => {
      const panel = btn.nextElementSibling;
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
      btn.classList.toggle("is-open", open);
      btn.querySelector("span").textContent = open ? "−" : "＋";
      btn.firstChild.textContent = open ? "Tutup koleksi " : "Lihat koleksi ";
    }));
    grid.querySelectorAll("details").forEach(d => d.addEventListener("toggle", () => d.closest(".merch-card")?.classList.toggle("has-open-detail", d.open)));
  }
  section.querySelectorAll(".merch-filter").forEach(btn => btn.addEventListener("click", () => {
    active = btn.dataset.filter;
    section.querySelectorAll(".merch-filter").forEach(x => { const on = x === btn; x.classList.toggle("active",on); x.setAttribute("aria-pressed",String(on)); });
    render();
  }));
  search.addEventListener("input", render);
  mobileLink.addEventListener("click", () => { mobileNav.hidden = true; document.querySelector("#menu-button")?.setAttribute("aria-expanded","false"); });
  desktopLink.addEventListener("click", () => { section.scrollIntoView({behavior:"smooth"}); });
  function updateActive() {
    const y = window.scrollY + (document.querySelector("#site-header")?.offsetHeight || 90) + 130;
    const home = document.querySelector("#home"), contact = document.querySelector("#contact");
    let current = "home";
    if (contact && y >= contact.offsetTop) current = "contact";
    else if (y >= section.offsetTop) current = "merchandise";
    else if (y >= catalog.offsetTop) current = "katalog";
    nav.querySelectorAll(".nav-link").forEach(a => a.classList.toggle("active", a.dataset.section === current));
    progress?.querySelectorAll(".progress-item").forEach(b => {
      const on = b.dataset.jump === current;
      b.classList.toggle("current",on);
      if (on) b.setAttribute("aria-current","step"); else b.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", updateActive, {passive:true});
  window.addEventListener("resize", updateActive);
  render(); updateActive();
})();