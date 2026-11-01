# Kalla Toyota — katalog informasi TCO

## Struktur yang dipakai

- `index.html` + `data.js` + `app.js`: homepage, daftar unit, filter/pencarian poster. `data.js` tidak lagi menyimpan daftar parts (hanya metadata katalog).
- `detail.html` + `detail.js` + `detail.css`: template tunggal untuk semua model. **Jangan menambah markup card ke HTML.**
- `data/units/<slug>.js`: **satu sumber data per unit** untuk daftar part, SKU, harga RTCO After Tax, grup varian warna, opsi warna, hotspot, dan deskripsi.
- `assets/vehicles/<slug>/colors/front-<warna>.png` dan `rear-<warna>.png`: foto unit; boleh belum tersedia. Foto yang gagal dimuat tidak diganti warna lain.
- `assets/vehicles/<slug>/parts/<nama-file>.png`: foto aksesori; boleh belum tersedia.
- `assets/posters/<slug>.png`: thumbnail poster untuk katalog dan saran pencarian.

## Cara menambah atau mengubah part

1. Buka file unit yang cocok, contoh `data/units/raize.js` atau `data/units/calya.js`.
2. Tambahkan objek baru ke array `parts` pada file itu. Isi `id` yang unik, `title`, `kind` (`interior` atau `exterior`), `sku`, `price` (angka rupiah tanpa pemisah ribuan), `description`, dan jika tersedia `image`, `pos`, `grades`, `sourcePage`.
3. Simpan/perbarui file yang **sama**. Website akan memuatnya saat halaman detail model dibuka; **tidak perlu edit `detail.html` atau `detail.js`.**
4. Jika aksesori memiliki nomor part berbeda menurut warna, gunakan `variants` alih-alih membuat banyak card. Isi objek kunci warna (`white`, `red`, `black`, dll.) dengan daftar pilihan `{ "name": "...", "sku": "...", "price": 123000 }`. Kunci harus cocok dengan `colors[].key`.
5. Jika satu card memuat beberapa komponen (misal Premium Horn), gunakan `components: [{name,sku,price}, ...]` dan tuliskan `priceLabel` bila `price` hanyalah **jumlah komponen**, bukan harga paket resmi.
6. Untuk beberapa opsi non-warna (misal varian aroma), gunakan `options: [{name,sku,price}, ...]`.
7. Untuk foto part khusus warna, isi `imagesByColor: { "white": "assets/vehicles/agya/parts/part-white.png", "red": "..." }` agar gambar card ikut berubah. Jika foto belum tersedia, hapus properti `image` atau biarkan path yang sesuai; kartu akan menampilkan placeholder. Jangan gunakan foto part yang berbeda hanya karena mirip.
8. Jika harga belum terverifikasi, gunakan `status: "verify"` tanpa angka harga. Jangan mengasumsikan SKU atau harga antar warna/grade sama.

### Format penambahan part

```js
{
  "id": "aksesori-baru",
  "title": "Nama Aksesori Baru",
  "kind": "exterior",
  "sku": "SKU_DARI_TCO",
  "price": 123000,
  "description": "Deskripsi sesuai sumber",
  "image": "assets/vehicles/raize/parts/SKU_DARI_TCO.png",
  "pos": {},
  "sourcePage": 8
}
```

## Pemilihan warna & Part Explorer

- Warna dipilih dari `colors[]`, dipakai oleh foto hero **dan** foto depan/belakang di explorer.
- Bila foto belakang warna tertentu belum ada, explorer menampilkan pesan `rear-<warna>.png` belum tersedia; **tidak** memakai putih sebagai pengganti.
- Hotspot memakai `pos.front`/`pos.rear` dalam persen dari raster. **Kalibrasi di warna yang berganti crop wajib ditinjau**. Untuk koordinat khusus warna, gunakan `positionsByColor: { "red": { "front": [x,y] } }`.
- Harga dan SKU yang memiliki varian warna mengikuti `variants[selectedColor]`; untuk warna tanpa SKU terdata, ditandai belum tersedia, bukan memakai SKU warna lain.
- Part tanpa varian warna mempertahankan harga dari tabel TCO dan dapat dipakai lintas warna sesuai batasan grade pada sumber.

## Catatan sumber

- Harga menggunakan **RTCO After Tax (selling price to customer)** dari National TCO Master Part and Price List Juli 2026, bukan harga jual kendaraan atau transaksi.
- Daftar harga SKU untuk bZ4X masih belum terverifikasi dan karenanya tetap kosong.
- Aerokit GR Agya dan part dari tabel satuan yang namanya berbeda **tidak** disamakan tanpa konfirmasi.
- File `detail-tco-prices.js`, `detail-tco-prices.json` dan `detail-tco-data.js` adalah **arsip referensi lama**, tidak lagi dimuat oleh halaman detail. Konten terbaru tinggal di `data/units/`.
- Semua foto belum selesai; struktur ini disiapkan untuk pemasukan aset berikutnya.
