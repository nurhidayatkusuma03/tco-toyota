/* DATA UNIT: Land Cruiser 300 (LC300) — edit parts/colors di file ini saja; SKU/harga wajib sesuai TCO. */
window.TCO_UNIT_DATA=window.TCO_UNIT_DATA||{};
window.TCO_UNIT_DATA["land-cruiser"] = {
  "slug": "land-cruiser",
  "name": "Land Cruiser 300 (LC300)",
  "title": "LAND CRUISER|300",
  "tagline": "Crafted for every journey.",
  "heroColor": "white",
  "colors": [
    {
      "key": "white",
      "name": "White (foto jika tersedia)",
      "hex": "#f6f6f4",
      "front": "assets/vehicles/land-cruiser/colors/front-white.png",
      "rear": "assets/vehicles/land-cruiser/colors/rear-white.png"
    }
  ],
  "parts": [
    {
      "id": "bonnet-protector-pzq1560250",
      "title": "Bonnet Protector",
      "kind": "exterior",
      "sku": "PZQ1560250",
      "price": 2500000,
      "sourcePage": 11,
      "pos": {},
      "description": "Aksesori sesuai daftar National TCO Juli 2026. Kecocokan grade tetap mengikuti tabel sumber.",
      "image": "assets/land-cruiser-part-1.webp",
      "photoStatus": "Foto referensi katalog lama; pastikan kesesuaian part/tahun/grade."
    },
    {
      "id": "rubber-floor-mat-pzq2060520",
      "title": "Rubber Floor Mat",
      "kind": "interior",
      "sku": "PZQ2060520",
      "price": 2100000,
      "sourcePage": 11,
      "pos": {},
      "description": "Aksesori sesuai daftar National TCO Juli 2026. Kecocokan grade tetap mengikuti tabel sumber."
    },
    {
      "id": "door-housing-protector-16802talc3",
      "title": "Door Housing Protector",
      "kind": "exterior",
      "sku": "16802TALC3",
      "price": 1450000,
      "sourcePage": 11,
      "pos": {},
      "description": "Aksesori sesuai daftar National TCO Juli 2026. Kecocokan grade tetap mengikuti tabel sumber."
    },
    {
      "id": "air-fragrance-device-set-lc300-pc55660001",
      "title": "Air Fragrance Device Set LC300",
      "kind": "interior",
      "sku": "PC55660001",
      "price": 1999000,
      "sourcePage": 11,
      "pos": {},
      "description": "Aksesori sesuai daftar National TCO Juli 2026. Kecocokan grade tetap mengikuti tabel sumber."
    },
    {
      "id": "scents-ntco",
      "title": "Scents NTCO (4 pilihan aroma)",
      "kind": "interior",
      "description": "Empat varian aroma dijadikan satu card. Tiap aroma memiliki SKU dan harga tersendiri.",
      "options": [
        {
          "name": "Scents NTCO Oceanic Joy",
          "sku": "PC5560K00AA1",
          "price": 199000
        },
        {
          "name": "Scents NTCO Amber Haven",
          "sku": "PC5560K008A1",
          "price": 199000
        },
        {
          "name": "Scents NTCO Blossom Whisper",
          "sku": "PC5560K006A1",
          "price": 199000
        },
        {
          "name": "Scents NTCO Sunlit Zest",
          "sku": "PC5560K009A1",
          "price": 199000
        }
      ],
      "note": "Pilihan aroma tidak bergantung pada warna kendaraan.",
      "pos": {}
    }
  ],
  "notes": {
    "source": "National TCO Master Part and Price List Juli 2026 (RTCO After Tax)",
    "readme": "Tambahkan part pada array parts di file ini. HTML tidak perlu diedit.",
    "fallback": "Jika file foto warna tidak ada, UI akan menampilkan belum tersedia, bukan warna lain."
  }
};
