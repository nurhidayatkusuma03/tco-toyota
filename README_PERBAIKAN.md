# TCO Kalla Toyota — Fix v17 (1 November 2026)

## Yang diperbaiki
- Navbar `index.html` dan `detail.html` menggunakan markup yang sama dan CSS `shared-navbar.css` (desktop dan mobile).
- Menu hamburger halaman detail aktif.
- Agya: pilihan 7 warna di hero, foto putih front/rear dan hotspot yang sudah ditentukan tetap digunakan.
- Ke-15 unit lain: hero memakai foto lama yang benar-benar tersedia; pemilih warna disembunyikan sampai file warna disiapkan.
- Explorer unit lain: memakai front/rear WebP referensi bila ada, tidak lagi memaksa meminta PNG putih kosong dan **tidak menampilkan hotspot yang belum diverifikasi**.
- Kartu part TCO unit lain menampilkan foto referensi hanya apabila nama visual part identik dengan nama TCO. Jika belum ada, tampil teks "Foto part belum tersedia" tanpa broken image.
- Kartu sparepart tidak menggunakan hover popup; popup hanya di hotspot Agya yang memiliki koordinat.
- Data harga `detail-tco-prices.js` tidak diubah. Status harga GR aerokit yang belum terverifikasi dipertahankan.

## File untuk diganti / ditambah
- TIMPA `index.html`, `detail.html`, `detail.js`, `detail-tco-data.js`, `detail.css`.
- TAMBAHKAN `shared-navbar.css` ke root proyek.
- JANGAN mengganti data.js, detail-tco-prices.js, foto, atau folder assets yang sudah ada.

## Keterbatasan yang belum diselesaikan
- Belum ada foto warna dan foto part tervalidasi untuk semua unit di `assets/vehicles/<slug>/{colors,parts}`.
- Foto referensi WebP lama bisa berbeda model, grade atau versi tahun dari TCO Juli 2026; bukan klaim verifikasi.
- Hotspot 15 unit lain tetap disembunyikan sampai ada foto final dan koordinat x/y yang teruji.
- Grade unit selain Agya memerlukan penyesuaian manual dari tabel TCO; tidak ditebak.
- Jika ingin mempublikasikan, verifikasi harga dan part number dengan PDF asli serta sumber internal terbaru.

## Uji lokal
Jalankan server statis (misalnya `python -m http.server 8000`), lalu buka:
- `http://localhost:8000/index.html`
- `http://localhost:8000/detail.html?unit=agya`
- `http://localhost:8000/detail.html?unit=calya`
- `http://localhost:8000/detail.html?unit=innova-zenix`
Periksa desktop dan mobile, pergantian unit, tab dan tombol warna Agya. Pada browser klik Ctrl+Shift+R untuk menghapus CSS cached.

## Khusus file di Google Drive
Jika Google Drive belum menyimpan HTML baru, jangan gunakan detail.js v17 dengan HTML lama tanpa patch kompatibilitas (kode dalam ZIP ini sudah kompatibel).
ZIP ini adalah patch yang dapat dipasang manual. Perubahan pada Drive tidak boleh dianggap sinkron penuh sebelum semua file berikut terpasang.
