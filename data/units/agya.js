window.TCO_UNIT_DATA = window.TCO_UNIT_DATA || {};

(() => {
  'use strict';

  const base = 'assets/vehicles/agya/';

  const partPhoto = name =>
    base + 'parts/' + name;

  const keys = [
    'white',
    'black',
    'red',
    'yellow',
    'silver',
    'gray',
    'orange'
  ];

  const colorInfo = {
    white: ['White', '#f7f7f5'],
    black: ['Black', '#17191b'],
    red: ['Red', '#c32335'],
    yellow: ['Yellow', '#f9d416'],
    silver: ['Silver Metallic', '#b7bec3'],
    gray: ['Gray Metallic', '#5d656b'],
    orange: ['Orange', '#e77c24']
  };

  // Referensi nama foto part per warna
  const photos = (stem, available = keys) =>
    Object.fromEntries(
      available.map(key => [
        key,
        partPhoto(`${stem}-${key}.png`)
      ])
    );

  // SKU dan harga berdasarkan varian warna
  const variants = (title, price, codes) =>
    Object.fromEntries(
      keys.map(key => [
        key,
        [{
          name: `${title}, ${colorInfo[key][0]}`,
          sku: codes[key],
          price,
          sourcePage: 9
        }]
      ])
    );

  const gradeEG = ['E', 'G'];

  /*
    PART NUMBER BERDASARKAN WARNA

    Diambil dari data TCO yang sebelumnya
    digunakan pada proyek.

    Front Bumper Spoiler, Set
    SideSkirt, Set
    Rear Bumper Spoiler, Set
  */

  const tcoSkus = {

    front: {
      white: 'P5154BYA0U47',
      black: 'P5154BYA0U1J',
      red: 'P5154BYA0U3F',
      silver: 'P5154BYA132G',
      gray: 'P5154BYA1324',
      yellow: 'P5154BYA132H',
      orange: 'P5154BYA133G'
    },

    side: {
      white: 'P5156BYA0T47',
      black: 'P5156BYA0T1J',
      red: 'P5156BYA0T3F',
      silver: 'P5156BYA0U2G',
      gray: 'P5156BYA0U24',
      yellow: 'P5156BYA0U2H',
      orange: 'P5156BYA0U3G'
    },

    rear: {
      white: 'P5158BYA0X47',
      black: 'P5158BYA0X1J',
      red: 'P5158BYA0X3F',
      silver: 'P5158BYA182G',
      gray: 'P5158BYA1824',
      yellow: 'P5158BYA182H',
      orange: 'P5158BYA183G'
    }

  };


  /* ==========================================
     DATA UNIT AGYA
     ========================================== */

  window.TCO_UNIT_DATA.agya = {

    slug: 'agya',

    name: 'Agya',

    title: 'NEW|AGYA',

    tagline: 'Move with your style.',

    heroColor: 'white',

    // Foto depan sudah mencakup
    // tampak depan dan belakang.
    heroComposite: true,


    /* ========================================
       WARNA KENDARAAN
       ======================================== */

    colors: keys.map(key => ({

      key,

      name: colorInfo[key][0],

      hex: colorInfo[key][1],

      front:
        `${base}colors/front-${key}.png`

    })),


    /* ========================================
       DAFTAR SPAREPART AGYA
       TOTAL: 8 CARD
       ======================================== */

    parts: [


      /* ======================================
         1. SET EMBLEM GRILLE DEPAN
         ====================================== */

      {

        id: 'rad-grille-emblem-set',

        title:
          'T-Emblem RAD Grille + Emblem Base',

        kind: 'exterior',

        sourcePage: 9,

        grades: gradeEG,

        description:
          'Emblem Toyota pada grille depan beserta dudukannya.',

        price: 108000,

        priceLabel:
          'Rp. 108.000',

        status: 'bulletin',

        sku: null,

        // Dua komponen dalam satu card.
        components: [

          {
            name: 'T-Emblem RAD Grille',

            sku: '75311-BZ470',

            price: 80000,

            priceLabel:
              'Rp. 80.000'
          },

          {
            name:
              'Emblem Base (Base Grille Emblem)',

            sku: '75312-BZ140',

            price: 20000,

            priceLabel:
              'Rp. 20.000'
          }

        ],

        imagesByColor: photos(
          't-emblem-rad-grille'
        ),

        hotspot: {
          composite: [36, 68]
        }

      },


      /* ======================================
         2. GR FRONT AEROMUDGUARD
         ====================================== */

      {

        id: 'gr-front-aeromudguard',

        title:
          'GR Front Aeromudguard',

        kind: 'exterior',

        sourcePage: 9,

        grades: gradeEG,

        description:
          'Aerokit pada sudut bumper depan.',

        // Harga mengikuti entri
        // Front Bumper Spoiler, Set.
        price: 1475000,

        referencePrice: 1475000,

        referenceName:
          'Front Bumper Spoiler, Set',

        relatedSKUs: tcoSkus.front,

        variants: variants(
          'Front Bumper Spoiler, Set',
          1475000,
          tcoSkus.front
        ),

        imagesByColor: photos(
          'gr-front-aeromudguard'
        ),

        hotspot: {
          composite: [44, 84]
        }

      },


      /* ======================================
         3. GR SIDE SKIRT
         ====================================== */

      {

        id: 'gr-side-skirt',

        title:
          'GR Side Skirt',

        kind: 'exterior',

        sourcePage: 9,

        grades: gradeEG,

        description:
          'Aksesori pada bagian bawah sisi bodi kendaraan.',

        // Harga mengikuti entri
        // SideSkirt, Set.
        price: 2375000,

        referencePrice: 2375000,

        referenceName:
          'SideSkirt, Set',

        relatedSKUs: tcoSkus.side,

        variants: variants(
          'SideSkirt, Set',
          2375000,
          tcoSkus.side
        ),

        // Hanya warna yang sudah memiliki
        // foto pada folder parts.
        imagesByColor: photos(
          'gr-side-skirt',
          [
            'red',
            'yellow',
            'gray',
            'silver',
            'white',
            'black',
            'orange'
          ]
        ),

        hotspot: {
          composite: [26, 82]
        }

      },


      /* ======================================
         4. GR REAR AEROMUDGUARD
         ====================================== */

      {

        id: 'gr-rear-detail',

        title:
          'GR Rear Aeromudguard',

        kind: 'exterior',

        sourcePage: 9,

        grades: gradeEG,

        description:
          'Aerokit pada sudut bumper belakang.',

        // Harga mengikuti entri
        // Rear Bumper Spoiler, Set.
        price: 1299000,

        referencePrice: 1299000,

        referenceName:
          'Rear Bumper Spoiler, Set',

        relatedSKUs: tcoSkus.rear,

        variants: variants(
          'Rear Bumper Spoiler, Set',
          1299000,
          tcoSkus.rear
        ),

        imagesByColor: photos(
          'gr-rear-detail'
        ),

        hotspot: {
          composite: [89, 83]
        }

      },


      /* ======================================
         5. SPORTY ROOF SPOILER
         ====================================== */

      {

        id: 'sporty-roof-spoiler',

        // Perbaikan nama:
        // Sebelumnya salah tertulis
        // "Rear Bumper Spoiler, Set".
        title:
          'Sporty Roof Spoiler',

        kind: 'exterior',

        sourcePage: 9,

        grades: gradeEG,

        description:
          'Spoiler pada ujung atap pintu bagasi belakang.',

        price: 1090000,

        sku: 'P5150BYA02',

        imagesByColor: photos(
          'sporty-roof-spoiler'
        ),

        hotspot: {
          composite: [83, 45]
        }

      },


      /* ======================================
         6. BACK CAMERA
         ====================================== */

      {

        id: 'back-camera',

        title:
          'Back Camera',

        kind: 'exterior',

        sourcePage: 9,

        grades: ['G'],

        description:
          'Kamera belakang untuk membantu parkir mundur.',

        price: 959000,

        sku: 'P5634BYA0V',

        image: partPhoto(
          'back-camera.png'
        )

        // Tidak menggunakan hotspot.

      },


      /* ======================================
         7. PREMIUM HORN
         ====================================== */

      {

        id: 'premium-horn',

        title:
          'Premium Horn (3 komponen)',

        kind: 'interior',

        sourcePage: 9,

        grades: ['E', 'G', 'GR'],

        description:
          'Klakson premium terdiri dari wire harness dan dua unit horn.',

        // Total harga tiga komponen.
        price: 442000,

        priceLabel:
          'Total 3 komponen, bukan harga paket resmi',

        sku: null,

        components: [

          {
            name:
              'Wire Harness Premium Horn',

            sku: '6A205TAD74',

            price: 212000
          },

          {
            name:
              'Horn Assy Low Pitched',

            sku: '86510TA042',

            price: 115000
          },

          {
            name:
              'Horn Hi (H)',

            sku: '86510TA081',

            price: 115000
          }

        ],

        image: partPhoto(
          'premium-horn.png'
        )

        // Komponen interior:
        // Tidak menggunakan hotspot.

      },


      /* ======================================
         8. DVR / DASHCAM
         ====================================== */

      {

        id: 'dvr',

        title:
          'DVR (Dashcam)',

        kind: 'interior',

        sourcePage: 9,

        grades: ['E', 'G', 'GR'],

        description:
          'Kamera perekam perjalanan (dashcam).',

        price: 1999000,

        sku: 'P56A3BYA05',

        // Kapitalisasi file sesuai folder.
        image: partPhoto(
          'DVR.png'
        )

        // Tidak menggunakan hotspot.

      }

    ]

  };

})();
