/* Data tampilan; harga tidak diketik ulang, diambil dari detail-tco-prices.js */
window.TCO_DETAIL_META = {
  'agya': { title:'NEW|AGYA', tagline:'Move with your style.', heroColor:'orange' },
  'calya': {title:'NEW|CALYA',tagline:'For every journey.',heroColor:'white'},
  'raize': {title:'RAIZE',tagline:'Ready for your next move.'},
  'rush': {title:'RUSH',tagline:'Ready for adventure.'},
  'yaris-cross': {title:'YARIS|CROSS',tagline:'Explore more possibilities.'},
  'fortuner': {title:'FORTUNER',tagline:'Bold in every detail.'},
  'bz4x': {title:'bZ4X',tagline:'Beyond Zero. Beyond Expectations.',heroColor:'white'},
  'land-cruiser': {title:'LAND CRUISER|300',tagline:'Crafted for every journey.'},
  'avanza': {title:'NEW|AVANZA',tagline:'For the journeys that matter.'},
  'veloz': {title:'VELOZ|HYBRID',tagline:'Style meets innovation.'},
  'innova-zenix': {title:'INNOVA|ZENIX',tagline:'Elevate Your Next Journey.'},
  'innova-reborn': {title:'INNOVA|REBORN',tagline:'Experience every journey.'},
  'voxy': {title:'VOXY',tagline:'Refined for your journey.'},
  'alphard': {title:'ALPHARD',tagline:'A new level of comfort.'},
  'vellfire': {title:'VELLFIRE',tagline:'Elevated in every detail.'},
  'hilux-d-cab': {title:'HILUX',tagline:'Built for what comes next.'},
  'hilux-rangga': {title:'HILUX|RANGGA',tagline:'Ready for every business.'}
};
const AGYA_COLORS = [
  ['white','White','#f7f7f5'], ['black','Black','#17191b'],
  ['red','Red','#c32335'], ['yellow','Yellow','#f9d416'],
  ['silver','Silver Metallic','#b7bec3'], ['gray','Gray Metallic','#5d656b'],
  ['orange','Orange','#e77c24']
];
// Pilihan warna merujuk pada katalog model Kalla Toyota.
// Setiap foto lokal harus sesuai warna: front-white.png, front-black.png, dst.
// Foto Kalla hanya referensi fallback saat aset lokal belum diserahkan.
const CALYA_COLORS = [
  ['white', 'White', '#f4f5f1', '1657672878-new-calya_white.png'],
  ['silver', 'Silver Metallic', '#bfc4c8', '1657679900-new-calya_silver-metallic.png'],
  ['gray', 'Grey Metallic', '#5d6266', '1657679941-new-calya_grey-metallic.png'],
  ['black', 'Black', '#1a1b1f', '1657679954-new-calya_black.png'],
  ['red', 'Red', '#bb2732', '1657679965-new-calya_red.png'],
  ['orange', 'Orange Metallic', '#d8722c', '1657679977-new-calya_orange-metallic.png'],
  ['bronze', 'Bronze Mica Metallic', '#886e56', '1657679996-new-calya_bronze-mica-metallic.png']
];
// Toyota Raize: pilihan one-tone dan two-tone menurut katalog Kalla Toyota.
// Tampilkan foto yang benar saja: nama file tidak boleh dialihkan ke warna lain.
// Foto two-tone wajib memperlihatkan atap hitam, bukan hanya bodi warna tunggal.
const RAIZE_COLORS = [
  ['white', 'White', '#f6f7f4'],
  ['black', 'Black', '#161719'],
  ['gray', 'Gray Metallic', '#696f73'],
  ['red', 'Red', '#bd2534'],
  ['silver', 'Silver Metallic', '#c2c9ce'],
  ['turquoise', 'Turquoise MM', '#37a2a2'],
  ['yellow', 'Yellow', '#eacb24'],
  ['white-black', 'White Black (Two Tone)', '#e6e9e6'],
  ['red-black', 'Red Black (Two Tone)', '#bd2534'],
  ['silver-black', 'Silver Metallic Black (Two Tone)', '#9ca4ab'],
  ['turquoise-black', 'Turquoise MM Black (Two Tone)', '#2e9292'],
  ['yellow-black', 'Yellow Black (Two Tone)', '#eacb24']
];
window.TCO_COLOR_ASSETS = Object.fromEntries(
  (window.CATALOG || []).map(m=>[
    m.slug,
    m.slug === 'agya'
    ? AGYA_COLORS.map(([key,name,hex])=>({key,name,hex,front:`assets/vehicles/agya/colors/front-${key}.png`}))
    : m.slug === 'calya'
    ? CALYA_COLORS.map(([key,name,hex,filename])=>({
        key,name,hex,front:`assets/vehicles/calya/colors/front-${key}.png`,
        fallbackFront:`https://kallatoyota.co.id/storage/images/thumbnail/colors/${filename}`
      }))
    : m.slug === 'raize'
    ? RAIZE_COLORS.map(([key,name,hex])=>({key,name,hex,front:`assets/vehicles/raize/colors/front-${key}.png`,twoTone:key.endsWith('-black')}))
    : [{key:'white',name:'White (Foto referensi)',hex:'#f7f7f5',front:`assets/vehicles/${m.slug}/colors/front-white.png`}]
  ])
);
/* Foto explorer bersifat TETAP, tidak terpengaruh selected color pada hero */
window.TCO_EXPLORER_IMAGES = Object.fromEntries(
  (window.CATALOG || []).map(m=>[
    m.slug, {front:`assets/vehicles/${m.slug}/colors/front-white.png`,rear:`assets/vehicles/${m.slug}/colors/rear-white.png`}
  ])
);
/* Semua hotspot Agya merujuk koordinat relatif terhadap raster asli (bukan frame). 
   Jika PNG baru memiliki crop berbeda, set ulang posisi lewat fungsi kalibrasi. */
window.TCO_EXPLORER_POSITIONS = {
  agya: Object.fromEntries((window.TCO_PRICES?.agyaCards||[]).map(p=>[p.id,p.pos||{}]))
};
