/* DATA UNIT: Voxy — edit parts/colors di file ini saja; SKU/harga wajib sesuai TCO. */
window.TCO_UNIT_DATA=window.TCO_UNIT_DATA||{};
window.TCO_UNIT_DATA["voxy"] = {
  "slug": "voxy",
  "name": "Voxy",
  "title": "VOXY",
  "tagline": "Refined for your journey.",
  "heroColor": "white",
  "colors": [
    {
      "key": "white",
      "name": "White Pearl",
      "hex": "#f4f5f0",
      "front": "assets/vehicles/voxy/colors/front-white.png",
      "rear": "assets/vehicles/voxy/colors/rear-white.png"
    },
    {
      "key": "black",
      "name": "Black",
      "hex": "#18191a",
      "front": "assets/vehicles/voxy/colors/front-black.png",
      "rear": "assets/vehicles/voxy/colors/rear-black.png"
    },
    {
      "key": "silver",
      "name": "Metal Stream",
      "hex": "#b6bdc5",
      "front": "assets/vehicles/voxy/colors/front-silver.png",
      "rear": "assets/vehicles/voxy/colors/rear-silver.png"
    }
  ],
  "parts": [
    {
      "id": "front-bumper-spoiler-set",
      "title": "Front Bumper Spoiler, Set",
      "kind": "exterior",
      "description": "Aksesori eksterior. Nomor part dan harga ditampilkan untuk warna bodi yang dipilih.",
      "sourcePage": 13,
      "variants": {
        "white": [
          {
            "name": "Front bumper spoiler, set, 070 white pearl CS",
            "sku": "1540ATA670",
            "price": 9100000,
            "sourcePage": 13
          }
        ],
        "black": [
          {
            "name": "Front bumper spoiler, set, 226 Glitter Black GF",
            "sku": "1540BTA670",
            "price": 9100000,
            "sourcePage": 13
          },
          {
            "name": "Front bumper spoiler, set, 220 Sparkling Black CS",
            "sku": "1540CTA670",
            "price": 9100000,
            "sourcePage": 13
          }
        ],
        "silver": [
          {
            "name": "Front bumper spoiler, set, 1K0 Metal Stream ME",
            "sku": "1540DTA670",
            "price": 9100000,
            "sourcePage": 13
          }
        ]
      },
      "pos": {},
      "note": "Varian warna menggunakan SKU sesuai dokumen National TCO Juli 2026."
    },
    {
      "id": "rear-bumper-spoiler-set",
      "title": "Rear Bumper Spoiler, Set",
      "kind": "exterior",
      "description": "Aksesori eksterior. Nomor part dan harga ditampilkan untuk warna bodi yang dipilih.",
      "sourcePage": 13,
      "variants": {
        "white": [
          {
            "name": "Rear Bumper Spoiler, set, 070 White Peal CS",
            "sku": "1580ATA670",
            "price": 8081000,
            "sourcePage": 13
          }
        ],
        "black": [
          {
            "name": "Rear Bumper Spoiler, set, 226 Glitter Black GF",
            "sku": "1580BTA670",
            "price": 8081000,
            "sourcePage": 13
          },
          {
            "name": "Rear Bumper Spoiler, set, 220 Sparkling Black CS",
            "sku": "1580CTA670",
            "price": 8081000,
            "sourcePage": 13
          }
        ],
        "silver": [
          {
            "name": "Rear Bumper Spoiler, set, 1K0 Metal Stream ME",
            "sku": "1580DTA670",
            "price": 8081000,
            "sourcePage": 13
          }
        ]
      },
      "pos": {},
      "note": "Varian warna menggunakan SKU sesuai dokumen National TCO Juli 2026."
    },
    {
      "id": "signature-grille-illumination-set-15415ta670",
      "title": "Signature Grille Illumination, Set",
      "kind": "exterior",
      "sku": "15415TA670",
      "price": 8450000,
      "sourcePage": 13,
      "pos": {},
      "description": "Aksesori sesuai daftar National TCO Juli 2026. Kecocokan grade tetap mengikuti tabel sumber."
    },
    {
      "id": "premium-horn",
      "title": "Premium Horn (3 komponen)",
      "kind": "interior",
      "description": "Rangkaian klakson premium yang terdiri dari tiga komponen.",
      "price": 429000,
      "priceLabel": "Total penjumlahan 3 komponen, bukan harga paket resmi",
      "components": [
        {
          "name": "WIRE HARNESS PREMIUM HORN, SET **",
          "sku": "6A214TA670",
          "price": 199000
        },
        {
          "name": "HORN ASSY, LOW PITCHED **",
          "sku": "86510TA042",
          "price": 115000
        },
        {
          "name": "HORN HI (H) **",
          "sku": "86510TA081",
          "price": 115000
        }
      ],
      "pos": {}
    }
  ],
  "notes": {
    "source": "National TCO Master Part and Price List Juli 2026 (RTCO After Tax)",
    "readme": "Tambahkan part pada array parts di file ini. HTML tidak perlu diedit.",
    "fallback": "Jika file foto warna tidak ada, UI akan menampilkan belum tersedia, bukan warna lain."
  }
};
