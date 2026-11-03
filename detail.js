
/* TCO Kalla Toyota — Detail Unit
   Agya: 1 PNG gabungan depan + belakang; hotspot khusus exterior.
   Data SKU dan harga tetap dari data/units/<slug>.js.
*/
(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const esc = value => String(value ?? '').replace(
    /[&<>"']/g,
    char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]
  );

  const money = value =>
    typeof value === 'number' && Number.isFinite(value)
      ? `Rp${value.toLocaleString('id-ID')}`
      : 'Harga belum tercantum';

  const norm = value =>
    String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

  const catalog = Array.isArray(window.CATALOG)
    ? window.CATALOG
    : [];

  window.TCO_UNIT_DATA ||= {};

  if (!catalog.length) return;

  const loaded = new Map();

  let index = Math.max(
    0,
    catalog.findIndex(m =>
      m.slug === (
        new URLSearchParams(location.search).get('unit') ||
        'agya'
      )
    )
  );

  let selectedColor = 'white';
  let tab = 'all';
  let loadToken = 0;
  let pinned = null;
  let heroRequest = 0;

  const model = () => catalog[index];

  const unit = () =>
    window.TCO_UNIT_DATA[model().slug] || null;

  const colors = () =>
    Array.isArray(unit()?.colors) ? unit().colors : [];

  const color = () =>
    colors().find(c => c.key === selectedColor) ||
    colors()[0];

  const originals = () =>
    Array.isArray(unit()?.parts) ? unit().parts : [];

  const name = p =>
    p.title || p.name || 'Aksesori Toyota';

  const keyOf = p =>
    p.id || norm(name(p));

  // Agya menggunakan satu PNG yang sudah berisi
  // tampak depan dan belakang sekaligus.
  const isComposite = () =>
    model().slug === 'agya' ||
    unit()?.heroComposite === true;


  /* ======================================
     1. LOAD DATA UNIT
     ====================================== */

  function loadUnit(slug) {
    if (window.TCO_UNIT_DATA[slug]) {
      return Promise.resolve(true);
    }

    if (loaded.has(slug)) {
      return loaded.get(slug);
    }

    const task = new Promise(resolve => {
      const script = document.createElement('script');

      script.src =
        `data/units/${encodeURIComponent(slug)}.js`;

      script.onload = () =>
        resolve(Boolean(window.TCO_UNIT_DATA[slug]));

      script.onerror = () => resolve(false);

      document.head.appendChild(script);
    });

    loaded.set(slug, task);

    return task;
  }


  /* ======================================
     2. DATA PART BERDASARKAN WARNA
     ====================================== */

  function activePart(raw) {
    const p = { ...raw };

    p.description =
      raw.descriptionByColor?.[selectedColor] ??
      raw.description ??
      '';

    p.image =
      raw.imagesByColor?.[selectedColor] ||
      raw.imageByColor?.[selectedColor] ||
      raw.image;

    p.partsForColor = [];

    if (raw.variants) {
      const value = raw.variants[selectedColor];

      p.partsForColor = Array.isArray(value)
        ? value
        : value ? [value] : [];

      p.variantUnavailable =
        p.partsForColor.length === 0;

      if (p.partsForColor.length === 1) {
        p.sku =
          p.partsForColor[0].sku || null;

        if (p.partsForColor[0].image) {
          p.image = p.partsForColor[0].image;
        }
      } else {
        p.sku = null;
      }

      const same =
        p.partsForColor.length &&
        p.partsForColor.every(
          x =>
            typeof x.price === 'number' &&
            x.price === p.partsForColor[0].price
        );

      p.price = same
        ? p.partsForColor[0].price
        : null;
    }

    return p;
  }

  const parts = () =>
    originals().map(activePart);

  function partNo(p) {
    if (
      p.variantUnavailable ||
      p.status === 'verify'
    ) {
      return '';
    }

    return p.sku || p.partNumber || '';
  }

  function priceLabel(p) {
    if (p.variantUnavailable) {
      return 'Varian warna belum tersedia';
    }

    if (p.status === 'verify') {
      return 'Harga belum terverifikasi';
    }

    if (p.status === 'bulletin') {
      return p.priceLabel ||
        'Mengikuti Part Bulletin';
    }

    if (p.options?.length && p.price == null) {
      return 'Lihat pilihan varian';
    }

    return typeof p.price === 'number'
      ? money(p.price)
      : p.priceLabel || 'Harga belum tercantum';
  }

  function componentRows(items, heading) {
    if (
      !Array.isArray(items) ||
      !items.length
    ) {
      return '';
    }

    return `
      <div class="part-components">
        <strong>${esc(heading)}</strong>

        ${items.map(x => `
          <div>
            <span>
              ${esc(x.name || x.title)}
              <small>${esc(x.sku || '')}</small>
            </span>

            <b>
              ${esc(
                typeof x.price === 'number'
                  ? money(x.price)
                  : (
                      x.priceLabel ||
                      'Mengikuti dokumen TCO'
                    )
              )}
            </b>
          </div>
        `).join('')}
      </div>
    `;
  }


  /* ======================================
     3. FOTO PART SESUAI WARNA
     ====================================== */

  const suffixes = {
    white: ['white', 'putih', 'PUTIH'],
    black: ['black', 'hitam', 'HITAM'],
    red: ['red', 'merah'],
    yellow: ['yellow', 'kuning'],
    silver: ['silver'],
    gray: ['gray', 'grey', 'GRAY'],
    orange: ['orange', 'Orange']
  };

  const agyaStems = {
    'rad-grille-emblem-set':
      't-emblem-rad-grille',

    'gr-front-aeromudguard':
      'gr-front-aeromudguard',

    'gr-side-skirt':
      'gr-side-skirt',

    'gr-rear-detail':
      'gr-rear-detail',

    'sporty-roof-spoiler':
      'sporty-roof-spoiler'
  };

  function agyaFamily(p) {
    const k = norm(keyOf(p));
    const t = norm(name(p));

    if (agyaStems[k]) return k;

    if (/emblem.*grill|grill.*emblem/.test(t)) {
      return 'rad-grille-emblem-set';
    }

    if (/gr.*front.*aeromudguard/.test(t)) {
      return 'gr-front-aeromudguard';
    }

    if (/gr.*rear.*aeromudguard/.test(t)) {
      return 'gr-rear-detail';
    }

    if (/gr.*side.*skirt/.test(t)) {
      return 'gr-side-skirt';
    }

    if (/sporty.*roof.*spoiler/.test(t)) {
      return 'sporty-roof-spoiler';
    }

    return null;
  }

  function imagePaths(p) {
    const paths = [];

    const add = path => {
      if (path && !paths.includes(path)) {
        paths.push(path);
      }
    };

    add(p.imagesByColor?.[selectedColor]);
    add(p.imageByColor?.[selectedColor]);

    p.partsForColor?.forEach(x =>
      add(x.image)
    );

    const family =
      model().slug === 'agya'
        ? agyaFamily(p)
        : null;

    if (family) {
      const stem = agyaStems[family];

      const base =
        'assets/vehicles/agya/parts/';

      for (
        const s of suffixes[selectedColor] ||
        [selectedColor]
      ) {
        add(`${base}${stem}-${s}.png`);
      }

      // Untuk part dengan variasi warna,
      // jangan fallback ke foto warna lain.
    } else if (
      !p.imagesByColor &&
      !p.imageByColor
    ) {
      add(p.image);

      if (p.file) {
        add(
          `assets/vehicles/${model().slug}/parts/${p.file}`
        );
      }

      if (
        model().slug === 'agya' &&
        keyOf(p) === 'dvr'
      ) {
        add('assets/vehicles/agya/parts/DVR.png');
      }
    }

    return paths;
  }

  function setPartImage(img, p) {
    const placeholder = $(
      '.media-placeholder',
      img.parentElement
    );

    const candidates = imagePaths(p);
    let i = 0;

    img.hidden = true;

    if (placeholder) {
      placeholder.hidden = false;
    }

    const next = () => {
      if (i >= candidates.length) {
        img.hidden = true;
        img.removeAttribute('src');
        return;
      }

      img.src = candidates[i++];
    };

    img.onload = () => {
      img.hidden = false;

      if (placeholder) {
        placeholder.hidden = true;
      }
    };

    img.onerror = next;

    next();
  }


  /* ======================================
     4. HOTSPOT KHUSUS EXTERIOR AGYA
     ====================================== */

  // Koordinat dihitung dari keseluruhan
  // PNG gabungan depan + belakang.
  // Angka merupakan posisi awal kalibrasi.

  const agyaPositions = {
    'rad-grille-emblem-set': [35, 59],

    'gr-front-aeromudguard': [42, 81],

    'front-bumper-spoiler-set': [34, 85],

    'gr-side-skirt': [23, 83],

    'side-skirt-set': [65, 83],

    'gr-rear-detail': [90, 80],

    'rear-bumper-spoiler-set': [85, 86],

    'sporty-roof-spoiler': [86, 18]
  };

  // Tidak ada hotspot interior, kamera,
  // DVR, maupun komponen tersembunyi.

  const excluded =
    /premium[\s-]?horn|back[\s-]?camera|kamera|dvr|dash[\s-]?cam|klakson/i;

  const valid = a =>
    Array.isArray(a) &&
    a.length >= 2 &&
    a.slice(0, 2).every(
      v =>
        Number.isFinite(Number(v)) &&
        Number(v) >= 0 &&
        Number(v) <= 100
    );

  function hotspotPosition(p) {
    if (
      String(p.kind).toLowerCase() !==
      'exterior'
    ) {
      return null;
    }

    if (
      excluded.test(
        `${keyOf(p)} ${name(p)}`
      )
    ) {
      return null;
    }

    if (isComposite()) {
      // Posisi yang ditetapkan pada data unit
      // selalu diprioritaskan.

      const custom =
        p.hotspot?.composite ||
        p.pos?.composite;

      if (valid(custom)) {
        return {
          view: 'front',
          xy: custom
        };
      }

      if (model().slug !== 'agya') {
        return null;
      }

      const k = keyOf(p);
      const t = norm(name(p));

      let xy =
        agyaPositions[k] ||
        agyaPositions[agyaFamily(p)];

      if (
        !xy &&
        /spoiler-bumper-depan|front-bumper/.test(t)
      ) {
        xy =
          agyaPositions[
            'front-bumper-spoiler-set'
          ];
      }

      if (
        !xy &&
        /spoiler-bumper-belakang|rear-bumper/.test(t)
      ) {
        xy =
          agyaPositions[
            'rear-bumper-spoiler-set'
          ];
      }

      if (
        !xy &&
        /body-kit-samping|side-skirt/.test(t)
      ) {
        xy =
          agyaPositions[
            'side-skirt-set'
          ];
      }

      return xy
        ? {
            view: 'front',
            xy
          }
        : null;
    }

    // Unit lain tetap mendukung foto
    // depan dan belakang terpisah.

    if (valid(p.hotspot?.front)) {
      return {
        view: 'front',
        xy: p.hotspot.front
      };
    }

    if (valid(p.hotspot?.rear)) {
      return {
        view: 'rear',
        xy: p.hotspot.rear
      };
    }

    if (valid(p.pos?.front)) {
      return {
        view: 'front',
        xy: p.pos.front
      };
    }

    if (valid(p.pos?.rear)) {
      return {
        view: 'rear',
        xy: p.pos.rear
      };
    }

    return null;
  }


  /* ======================================
     5. TOOLTIP / POPUP HOTSPOT
     ====================================== */

  const tooltip = $('#hero-part-tooltip');

  function closeTooltip() {
    if (tooltip) {
      tooltip.hidden = true;
    }

    if (pinned) {
      pinned.setAttribute(
        'aria-expanded',
        'false'
      );
    }

    pinned = null;
  }

  function openTooltip(
    p,
    button,
    pin = false
  ) {
    if (!tooltip) return;

    if (
      pin &&
      pinned === button &&
      !tooltip.hidden
    ) {
      closeTooltip();
      return;
    }

    if (pin) {
      if (pinned) {
        pinned.setAttribute(
          'aria-expanded',
          'false'
        );
      }

      pinned = button;

      button.setAttribute(
        'aria-expanded',
        'true'
      );
    }

    const no =
      partNo(p) ||
      p.partsForColor
        ?.map(x => x.sku)
        .filter(Boolean)
        .join(' · ') ||
      p.components
        ?.map(x => x.sku)
        .filter(Boolean)
        .join(' · ') ||
      '';

    tooltip.innerHTML = `
      <div class="hotspot-tooltip-media">
        <img
          alt="Foto ${esc(name(p))}"
          hidden
        >

        <span class="media-placeholder">
          Foto belum tersedia
        </span>
      </div>

      <div class="hotspot-tooltip-info">
        <strong>${esc(name(p))}</strong>

        <span>
          ${esc(
            no
              ? `P/N: ${no}`
              : 'P/N: lihat rincian part'
          )}
        </span>

        <b>${esc(priceLabel(p))}</b>
      </div>
    `;

    setPartImage(
      $('img', tooltip),
      p
    );

    tooltip.hidden = false;

    const rect =
      button.getBoundingClientRect();

    const size =
      tooltip.getBoundingClientRect();

    const left = Math.max(
      8,
      Math.min(
        innerWidth - size.width - 8,
        rect.left +
        rect.width / 2 -
        size.width / 2
      )
    );

    const above =
      rect.top - size.height - 10;

    const top =
      above > 90
        ? above
        : Math.min(
            innerHeight - size.height - 8,
            rect.bottom + 10
          );

    tooltip.style.left = `${left}px`;

    tooltip.style.top =
      `${Math.max(8, top)}px`;
  }


  /* ======================================
     6. PENEMPATAN TITIK PADA GAMBAR
     ====================================== */

  function positionHotspots() {
    $$('.hero-angle').forEach(frame => {
      if (
        frame.hidden ||
        getComputedStyle(frame).display === 'none'
      ) {
        return;
      }

      const img = $('img', frame);

      if (
        !img?.naturalWidth ||
        !img?.naturalHeight
      ) {
        return;
      }

      const width = frame.clientWidth;
      const height = frame.clientHeight;

      if (!width || !height) return;

      const scale = Math.min(
        width / img.naturalWidth,
        height / img.naturalHeight
      );

      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;

      const offsetX = (width - w) / 2;
      const offsetY = height - h;

      $$('.hero-hotspot', frame).forEach(btn => {
        btn.style.left = `${
          offsetX +
          w * Number(btn.dataset.x) / 100
        }px`;

        btn.style.top = `${
          offsetY +
          h * Number(btn.dataset.y) / 100
        }px`;
      });
    });

    closeTooltip();
  }

  function renderHotspots() {
    const front = $('#hero-hotspots-front');
    const rear = $('#hero-hotspots-rear');

    front?.replaceChildren();
    rear?.replaceChildren();

    const visible = parts().filter(
      p =>
        tab === 'all' ||
        p.kind === tab
    );

    visible.forEach(p => {
      const point = hotspotPosition(p);

      if (!point) return;

      const layer =
        point.view === 'rear'
          ? rear
          : front;

      if (!layer) return;

      const btn =
        document.createElement('button');

      btn.type = 'button';
      btn.className = 'hero-hotspot';

      btn.dataset.partId = keyOf(p);
      btn.dataset.x = String(point.xy[0]);
      btn.dataset.y = String(point.xy[1]);

      btn.setAttribute(
        'aria-label',
        `Lihat ${name(p)}`
      );

      btn.setAttribute(
        'aria-expanded',
        'false'
      );

      btn.addEventListener(
        'pointerenter',
        e => {
          if (
            e.pointerType !== 'touch' &&
            !pinned
          ) {
            openTooltip(p, btn);
          }
        }
      );

      btn.addEventListener(
        'pointerleave',
        () => {
          if (!pinned) closeTooltip();
        }
      );

      btn.addEventListener(
        'focus',
        () => openTooltip(p, btn)
      );

      btn.addEventListener(
        'blur',
        () => {
          if (!pinned) closeTooltip();
        }
      );

      btn.addEventListener(
        'click',
        e => {
          e.stopPropagation();

          openTooltip(p, btn, true);
        }
      );

      layer.appendChild(btn);
    });

    requestAnimationFrame(
      positionHotspots
    );
  }


  /* ======================================
     7. LOAD FOTO MOBIL
     ====================================== */

  function loadCar(
    img,
    src,
    onSuccess,
    onError
  ) {
    const request = ++heroRequest;

    img.hidden = true;

    img.onload = () => {
      if (request !== heroRequest) {
        return;
      }

      img.hidden = false;

      onSuccess?.();

      requestAnimationFrame(
        positionHotspots
      );
    };

    img.onerror = () => {
      if (request === heroRequest) {
        onError?.();
      }
    };

    if (src) {
      img.src = src;
    } else {
      img.removeAttribute('src');
      onError?.();
    }
  }


  /* ======================================
     8. RENDER HERO
     ====================================== */

  function renderHero() {
    const m = model();
    const d = unit();
    const c = color();

    const words =
      (d.title || m.name).split('|');

    document.title =
      `${m.name} — TCO Kalla Toyota`;

    $('#breadcrumb-unit').textContent =
      m.name;

    $('#hero-title').innerHTML =
      esc(words[0]) +
      (
        words.length > 1
          ? ` <em>${
              esc(words.slice(1).join(' '))
            }</em>`
          : ''
      );

    $('#hero-tagline').textContent =
      d.tagline || '';

    $('#hero-category').textContent =
      m.category || '';

    const front = $('#hero-car');
    const rear = $('#hero-car-rear');

    const frontFrame =
      $('.hero-angle-front');

    const rearFrame =
      $('.hero-angle-rear');

    const visual = $('#hero-visual');
    const notice = $('#hero-image-error');

    const composite = isComposite();

    const frontSrc =
      c?.front ||
      (
        !c
          ? (m.frontImage || m.main)
          : null
      );

    // Untuk Agya: tidak mengambil rear-white.png.
    const rearSrc = composite
      ? null
      : (
          c?.rear ||
          (!c ? m.rearImage : null)
        );

    notice.hidden = true;

    frontFrame.hidden = false;

    rearFrame.hidden =
      composite || !rearSrc;

    visual.classList.toggle(
      'is-composite',
      composite
    );

    visual.classList.toggle(
      'is-single',
      composite || !rearSrc
    );

    visual.classList.remove(
      'show-rear'
    );

    $('#hero-view-toggle').hidden =
      composite || !rearSrc;

    $$('#hero-view-toggle [data-hero-view]')
      .forEach(b =>
        b.setAttribute(
          'aria-pressed',
          String(
            b.dataset.heroView === 'front'
          )
        )
      );

    front.alt = composite
      ? `${m.name} ${c?.name || ''} tampak depan dan belakang`
      : `${m.name} ${c?.name || ''} tampak depan`;

    rear.alt =
      `${m.name} ${c?.name || ''} tampak belakang`;

    // Hanya satu PNG untuk Agya.
    loadCar(
      front,
      frontSrc,

      () => {
        notice.hidden = true;
      },

      () => {
        notice.textContent =
          `Foto ${m.name} warna ${
            c?.name || ''
          } belum tersedia.`;

        notice.hidden = false;
      }
    );

    // Bersihkan gambar rear sebelumnya.
    rear.onload = null;
    rear.onerror = null;
    rear.removeAttribute('src');
    rear.hidden = true;

    if (!composite && rearSrc) {
      rear.onload = () => {
        rear.hidden = false;

        requestAnimationFrame(
          positionHotspots
        );
      };

      rear.onerror = () => {
        rearFrame.hidden = true;

        visual.classList.add(
          'is-single'
        );
      };

      rear.src = rearSrc;
    }

    // Render swatch warna.
    $('#color-list').innerHTML =
      colors().map(item => {
        const swatch = item.twoTone
          ? `linear-gradient(
              90deg,
              ${item.hex} 0 50%,
              ${item.secondHex || '#16191d'} 50% 100%
            )`
          : item.hex;

        return `
          <button
            type="button"
            class="color-swatch${
              item.twoTone ? ' two-tone' : ''
            }"
            style="--swatch:${esc(swatch)}"
            data-color="${esc(item.key)}"
            aria-label="${esc(item.name)}"
            title="${esc(item.name)}"
            aria-pressed="${
              item.key === selectedColor
            }">
          </button>
        `;
      }).join('');

    $('#color-name').textContent =
      c?.name || '';

    $('#color-panel').hidden =
      !colors().length;

    renderHotspots();
  }


  /* ======================================
     9. CARD SPAREPART
     ====================================== */

  function renderCards() {
    const all = parts();

    const visible = all.filter(
      p =>
        tab === 'all' ||
        p.kind === tab
    );

    $('#part-count').textContent =
      String(all.length);

    const root = $('#tab-content');

    if (!visible.length) {
      root.innerHTML = `
        <div class="empty-state">
          Belum ada sparepart pada kategori ini.
        </div>
      `;

      renderHotspots();
      return;
    }

    root.innerHTML = `
      <div class="parts-grid">
        ${visible.map(p => {
          const no = partNo(p);

          const labelNo =
            p.variantUnavailable
              ? 'SKU warna ini belum tersedia'
              : no
                ? `P/N: ${no}`
                : 'Lihat nomor part pada rincian';

          return `
            <article
              class="part-card"
              data-part-id="${esc(keyOf(p))}">

              <div class="part-media">
                <img
                  hidden
                  loading="lazy"
                  alt="Foto ${esc(name(p))} ${
                    esc(color()?.name || '')
                  }">

                <span class="media-placeholder">
                  Foto part belum tersedia
                </span>
              </div>

              <div class="part-body">
                <h3>${esc(name(p))}</h3>

                <span class="part-sku">
                  ${esc(labelNo)}
                </span>

                <span class="price ${
                  p.status ||
                  p.variantUnavailable
                    ? 'uncertain'
                    : ''
                }">
                  ${esc(priceLabel(p))}
                </span>

                ${
                  p.description
                    ? `<p>${esc(p.description)}</p>`
                    : ''
                }

                ${componentRows(
                  p.partsForColor?.length > 1
                    ? p.partsForColor
                    : [],
                  'Pilihan SKU sesuai varian'
                )}

                ${componentRows(
                  p.options,
                  'Pilihan varian'
                )}

                ${componentRows(
                  p.components,
                  'Rincian komponen'
                )}

                ${
                  p.status === 'verify' &&
                  p.referencePrice != null
                    ? `
                      <small class="part-photo-status">
                        Harga referensi ${
                          esc(money(p.referencePrice))
                        }; kecocokan dengan part GR
                        belum terverifikasi.
                      </small>
                    `
                    : ''
                }

                ${
                  p.note
                    ? `
                      <small class="part-photo-status">
                        ${esc(p.note)}
                      </small>
                    `
                    : ''
                }

                ${
                  p.photoStatus
                    ? `
                      <small class="part-photo-status">
                        ${esc(p.photoStatus)}
                      </small>
                    `
                    : ''
                }

                ${
                  p.grades?.length
                    ? `
                      <div class="part-grade">
                        ${p.grades.map(g => `
                          <span>${esc(g)}</span>
                        `).join('')}
                      </div>
                    `
                    : ''
                }
              </div>
            </article>
          `;
        }).join('')}
      </div>
    `;

    $$('.part-card', root).forEach(
      (card, i) =>
        setPartImage(
          $('img', card),
          visible[i]
        )
    );

    renderHotspots();
  }


  /* ======================================
     10. RENDER HALAMAN
     ====================================== */

  function render() {
    const m = model();
    const d = unit();

    if (!d) {
      $('#tab-content').textContent =
        `Data unit ${m.name} belum tersedia.`;

      return;
    }

    if (
      !colors().some(
        c => c.key === selectedColor
      )
    ) {
      selectedColor =
        colors().some(
          c => c.key === d.heroColor
        )
          ? d.heroColor
          : colors()[0]?.key || 'white';
    }

    $('#unit-switch-label').textContent =
      m.name.toUpperCase();

    $('#unit-counter').textContent =
      `${
        String(index + 1).padStart(2, '0')
      } / ${
        String(catalog.length).padStart(2, '0')
      }`;

    renderHero();
    renderCards();

    $$('.detail-tabs [data-tab]').forEach(
      button => {
        const active =
          button.dataset.tab === tab;

        button.classList.toggle(
          'active',
          active
        );

        button.setAttribute(
          'aria-selected',
          String(active)
        );
      }
    );
  }


  /* ======================================
     11. SLIDER PERPINDAHAN UNIT
     ====================================== */

  async function selectUnit(
    next,
    scroll = true,
    push = true
  ) {
    const previous = index;

    index =
      (next + catalog.length) %
      catalog.length;

    tab = 'all';
    selectedColor = 'white';

    closeTooltip();

    const slug = model().slug;
    const token = ++loadToken;

    $('#tab-content').innerHTML = `
      <div class="empty-state">
        Memuat data unit...
      </div>
    `;

    const ok = await loadUnit(slug);

    if (token !== loadToken) return;

    if (push) {
      try {
        const url = new URL(
          location.href
        );

        url.searchParams.set(
          'unit',
          slug
        );

        history.pushState(
          null,
          '',
          url
        );
      } catch (_) {}
    }

    if (!ok) {
      $('#tab-content').textContent =
        `File data/units/${slug}.js belum tersedia.`;

      return;
    }

    render();

    const hero = $('.hero');

    if (push && hero) {
      hero.style.setProperty(
        '--slide-from',
        next < previous
          ? '-24px'
          : '24px'
      );

      hero.classList.remove(
        'is-unit-sliding'
      );

      void hero.offsetWidth;

      hero.classList.add(
        'is-unit-sliding'
      );

      setTimeout(
        () => hero.classList.remove(
          'is-unit-sliding'
        ),
        420
      );
    }

    if (scroll) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }


  /* ======================================
     12. EVENT LISTENERS
     ====================================== */

  $('#prev-unit')?.addEventListener(
    'click',
    () => selectUnit(index - 1)
  );

  $('#next-unit')?.addEventListener(
    'click',
    () => selectUnit(index + 1)
  );

  // Pemilihan warna kendaraan.
  $('#color-list')?.addEventListener(
    'click',
    e => {
      const button =
        e.target.closest('[data-color]');

      if (!button) return;

      selectedColor =
        button.dataset.color;

      closeTooltip();
      renderHero();
      renderCards();
    }
  );

  // Tab All / Interior / Exterior.
  $$('.detail-tabs [data-tab]').forEach(
    button =>
      button.addEventListener(
        'click',
        () => {
          tab = button.dataset.tab;

          renderCards();

          $$('.detail-tabs [data-tab]').forEach(
            item => {
              item.classList.toggle(
                'active',
                item === button
              );

              item.setAttribute(
                'aria-selected',
                String(item === button)
              );
            }
          );
        }
      )
  );

  // Tombol depan / belakang untuk
  // unit yang memiliki dua foto terpisah.
  $$('#hero-view-toggle [data-hero-view]')
    .forEach(button =>
      button.addEventListener(
        'click',
        () => {
          const rear =
            button.dataset.heroView === 'rear';

          $('#hero-visual').classList.toggle(
            'show-rear',
            rear
          );

          $$('#hero-view-toggle [data-hero-view]')
            .forEach(b =>
              b.setAttribute(
                'aria-pressed',
                String(b === button)
              )
            );

          requestAnimationFrame(
            positionHotspots
          );
        }
      )
    );

  // Swipe slider model.
  for (
    const area of [
      $('#swipe-zone'),
      $('#hero-visual')
    ].filter(Boolean)
  ) {
    let start = null;

    area.addEventListener(
      'pointerdown',
      e => {
        if (
          e.button !== 0 ||
          e.target.closest('button')
        ) {
          return;
        }

        start = {
          x: e.clientX,
          y: e.clientY,
          id: e.pointerId
        };
      },
      { passive: true }
    );

    area.addEventListener(
      'pointerup',
      e => {
        if (
          !start ||
          e.pointerId !== start.id
        ) {
          return;
        }

        const dx =
          e.clientX - start.x;

        const dy =
          e.clientY - start.y;

        start = null;

        if (
          Math.abs(dx) > 65 &&
          Math.abs(dx) >
            Math.abs(dy) * 1.4
        ) {
          selectUnit(
            index + (dx < 0 ? 1 : -1)
          );
        }
      },
      { passive: true }
    );

    area.addEventListener(
      'pointercancel',
      () => {
        start = null;
      }
    );
  }

  // Keyboard.
  $('#swipe-zone')?.setAttribute(
    'tabindex',
    '0'
  );

  $('#swipe-zone')?.addEventListener(
    'keydown',
    e => {
      if (
        e.key !== 'ArrowLeft' &&
        e.key !== 'ArrowRight'
      ) {
        return;
      }

      e.preventDefault();

      selectUnit(
        index +
        (
          e.key === 'ArrowRight'
            ? 1
            : -1
        )
      );
    }
  );

  // Browser Back / Forward.
  window.addEventListener(
    'popstate',
    () => {
      const slug =
        new URLSearchParams(
          location.search
        ).get('unit');

      const i = catalog.findIndex(
        x => x.slug === slug
      );

      if (i >= 0) {
        selectUnit(
          i,
          false,
          false
        );
      }
    }
  );

  // Reposisi hotspot ketika resize.
  window.addEventListener(
    'resize',
    () =>
      requestAnimationFrame(
        positionHotspots
      ),
    { passive: true }
  );

  // Tutup tooltip ketika klik di luar.
  document.addEventListener(
    'pointerdown',
    e => {
      if (
        !e.target.closest(
          '.hero-hotspot'
        )
      ) {
        closeTooltip();
      }
    }
  );

  document.addEventListener(
    'keydown',
    e => {
      if (e.key === 'Escape') {
        closeTooltip();
      }
    }
  );

  // Navbar mobile.
  $('#menu-button')?.addEventListener(
    'click',
    () => {
      const nav = $('#mobile-nav');

      nav.hidden = !nav.hidden;

      $('#menu-button').setAttribute(
        'aria-expanded',
        String(!nav.hidden)
      );
    }
  );

  $$('#mobile-nav a').forEach(
    a =>
      a.addEventListener(
        'click',
        () => {
          $('#mobile-nav').hidden = true;

          $('#menu-button')?.setAttribute(
            'aria-expanded',
            'false'
          );
        }
      )
  );

  // Floating color bar tetap di body
  // agar tidak terpotong container hero.
  if ($('#color-panel')) {
    document.body.appendChild(
      $('#color-panel')
    );
  }

  // Inisialisasi halaman.
  selectUnit(
    index,
    false,
    false
  );
})();
