/* ============================================================
   LEO'S — Moteur applicatif (1/3) : données, i18n, utilitaires
   ============================================================ */

/* ---------- Wilayas : 58, avec zone tarifaire ---------- */
const WILAYAS = [
  ["01", "Adrar", "أدرار", "sud"],
  ["02", "Chlef", "الشلف", "ouest"],
  ["03", "Laghouat", "الأغواط", "sud"],
  ["04", "Oum El Bouaghi", "أم البواقي", "est"],
  ["05", "Batna", "باتنة", "est"],
  ["06", "Béjaïa", "بجاية", "est"],
  ["07", "Biskra", "بسكرة", "est"],
  ["08", "Béchar", "بشار", "sud"],
  ["09", "Blida", "البليدة", "nord"],
  ["10", "Bouira", "البويرة", "nord"],
  ["11", "Tamanrasset", "تمنراست", "sud"],
  ["12", "Tébessa", "تبسة", "est"],
  ["13", "Tlemcen", "تلمسان", "ouest"],
  ["14", "Tiaret", "تيارت", "ouest"],
  ["15", "Tizi Ouzou", "تيزي وزو", "nord"],
  ["16", "Alger", "الجزائر", "nord"],
  ["17", "Djelfa", "الجلفة", "sud"],
  ["18", "Jijel", "جيجل", "est"],
  ["19", "Sétif", "سطيف", "est"],
  ["20", "Saïda", "سعيدة", "ouest"],
  ["21", "Skikda", "سكيكدة", "est"],
  ["22", "Sidi Bel Abbès", "سيدي بلعباس", "ouest"],
  ["23", "Annaba", "عنابة", "est"],
  ["24", "Guelma", "قالمة", "est"],
  ["25", "Constantine", "قسنطينة", "est"],
  ["26", "Médéa", "المدية", "nord"],
  ["27", "Mostaganem", "مستغانم", "ouest"],
  ["28", "M'Sila", "المسيلة", "nord"],
  ["29", "Mascara", "معسكر", "ouest"],
  ["30", "Ouargla", "ورقلة", "sud"],
  ["31", "Oran", "وهران", "ouest"],
  ["32", "El Bayadh", "البيض", "sud"],
  ["33", "Illizi", "إليزي", "sud"],
  ["34", "Bordj Bou Arréridj", "برج بوعريريج", "est"],
  ["35", "Boumerdès", "بومرداس", "nord"],
  ["36", "El Tarf", "الطارف", "est"],
  ["37", "Tindouf", "تندوف", "sud"],
  ["38", "Tissemsilt", "تيسمسيلت", "ouest"],
  ["39", "El Oued", "الوادي", "sud"],
  ["40", "Khenchela", "خنشلة", "est"],
  ["41", "Souk Ahras", "سوق أهراس", "est"],
  ["42", "Tipaza", "تيبازة", "nord"],
  ["43", "Mila", "ميلة", "est"],
  ["44", "Aïn Defla", "عين الدفلى", "nord"],
  ["45", "Naâma", "النعامة", "ouest"],
  ["46", "Aïn Témouchent", "عين تموشنت", "ouest"],
  ["47", "Ghardaïa", "غرداية", "sud"],
  ["48", "Relizane", "غليزان", "ouest"],
  ["49", "Timimoun", "تيميمون", "sud"],
  ["50", "Bordj Badji Mokhtar", "برج باجي مختار", "sud"],
  ["51", "Ouled Djellal", "أولاد جلال", "sud"],
  ["52", "Béni Abbès", "بني عباس", "sud"],
  ["53", "In Salah", "عين صالح", "sud"],
  ["54", "In Guezzam", "عين قزام", "sud"],
  ["55", "Touggourt", "تقرت", "sud"],
  ["56", "Djanet", "جانت", "sud"],
  ["57", "El M'Ghair", "المغير", "sud"],
  ["58", "El Meniaa", "المنيعة", "sud"]
];

/* ---------- Couleurs ---------- */
const COLORS = {
  onyx:   { fr: "Noir onyx", ar: "أسود أونيكس", hex: "#171717" },
  forest: { fr: "Vert forêt", ar: "أخضر غامق", hex: "#1b3c2c" },
  sand:   { fr: "Sable", ar: "بيج رملي", hex: "#d8cdb4" },
  cream:  { fr: "Crème", ar: "كريمي", hex: "#efe9dc" },
  grey:   { fr: "Gris cendre", ar: "رمادي رمادي", hex: "#8e9692" },
  charcoal:{ fr: "Anthracite", ar: "فحمي", hex: "#3a3f3d" },
  khaki:  { fr: "Kaki militaire", ar: "كاكي", hex: "#6f7455" }
};

/* ---------- Catégories ---------- */
const CATS = {
  "Hoodies":    { fr: "Hoodies", en: "Hoodies", ar: "هوديز" },
  "T-shirts":   { fr: "T-shirts", ar: "تي شيرتات" },
  "Sweats":     { fr: "Sweats", ar: "سويت شيرت" },
  "Pantalons":  { fr: "Pantalons", ar: "بناطيل" },
  "Accessoires":{ fr: "Accessoires", ar: "إكسسوارات" }
};

/* ---------- Guide des tailles ---------- */
const SIZE_TABLE = {
  Hoodies: {
    head: ["S", "M", "L", "XL", "XXL"],
    rows: [
      ["Poitrine (cm)", "112", "120", "128", "136", "144"],
      ["Longueur (cm)", "68", "71", "74", "77", "80"],
      ["Épaules (cm)", "52", "55", "58", "61", "64"],
      ["Manche (cm)", "58", "60", "62", "64", "66"]
    ],
    ar: {
      head: ["S", "M", "L", "XL", "XXL"],
      rows: [
        ["الصدر (سم)", "112", "120", "128", "136", "144"],
        ["الطول (سم)", "68", "71", "74", "77", "80"],
        ["الأكتاف (سم)", "52", "55", "58", "61", "64"],
        ["الكم (سم)", "58", "60", "62", "64", "66"]
      ]
    },
    fit: { fr: "Coupe oversize : si tu hésites entre deux tailles, prends la plus grande.", ar: "قَصّة أوفرسايز: إذا كنت متردداً بين مقاسين، اختر الأكبر." }
  },
  "T-shirts": {
    head: ["S", "M", "L", "XL", "XXL"],
    rows: [
      ["Poitrine (cm)", "104", "112", "120", "128", "136"],
      ["Longueur (cm)", "66", "69", "72", "75", "78"],
      ["Épaules (cm)", "50", "53", "56", "59", "62"]
    ],
    ar: {
      head: ["S", "M", "L", "XL", "XXL"],
      rows: [
        ["الصدر (سم)", "104", "112", "120", "128", "136"],
        ["الطول (سم)", "66", "69", "72", "75", "78"],
        ["الأكتاف (سم)", "50", "53", "56", "59", "62"]
      ]
    },
    fit: { fr: "Coupe boxy : couvre les hanches, manches courtes larges.", ar: "قَصّة مربعة: تغطي الوركين بأكمام قصيرة واسعة." }
  },
  Pantalons: {
    head: ["S", "M", "L", "XL"],
    rows: [
      ["Taille (cm)", "72", "78", "84", "90"],
      ["Hanches (cm)", "100", "106", "112", "118"],
      ["Longueur (cm)", "100", "102", "104", "106"]
    ],
    ar: {
      head: ["S", "M", "L", "XL"],
      rows: [
        ["الخصر (سم)", "72", "78", "84", "90"],
        ["الأرداف (سم)", "100", "106", "112", "118"],
        ["الطول (سم)", "100", "102", "104", "106"]
      ]
    },
    fit: { fr: "Taille élastiquée + cordon : prends ta taille habituelle.", ar: "خصر مطاطي مع رباط: اختر مقاسك المعتاد." }
  }
};

/* ---------- Catalogue ---------- */
const DEFAULT_PRODUCTS = [
  {
    id: "hoodie-onyx",
    name: { fr: "Hoodie Oversize Onyx", ar: "هودي أوفرسايز أونيكس" },
    cat: "Hoodies", price: 5900, oldPrice: 6900,
    tag: { fr: "Best-seller", ar: "الأكثر مبيعاً" },
    isNew: true, lowStock: 0, soldOut: false,
    img: "assets/hoodie-onyx.jpg",
    colors: ["onyx", "forest", "sand"], sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.9, reviews: 128,
    desc: {
      fr: "Notre pièce signature : molleton gratté 420 g/m², épaules tombantes et capuche doublée qui garde sa forme. Un hoodie lourd, chaud, qui ne bouloche pas au lavage.",
      ar: "قطعتنا الأساسية: قطن مبطن 420 غ/م²، أكتاف منسدلة وقلنسوة مبطنة تحفظ شكلها. هودي ثقيل ودافئ لا يتكتّل عند الغسل."
    },
    features: {
      fr: ["Molleton gratté 420 g/m²", "Coupe oversize, épaules tombantes", "Capuche doublée double épaisseur", "Broderie dorée poitrine", "Coutures latérales renforcées"],
      ar: ["قطن مبطن 420 غ/م²", "قَصّة أوفرسايز بأكتاف منسدلة", "قلنسوة مبطنة بطبقتين", "تطريز ذهبي على الصدر", "خياطة جانبية مقوّاة"]
    }
  },
  {
    id: "hoodie-sand",
    name: { fr: "Hoodie Oversize Sahara", ar: "هودي أوفرسايز صحراء" },
    cat: "Hoodies", price: 5900, oldPrice: 0,
    tag: { fr: "Nouveau", ar: "جديد" },
    isNew: true, lowStock: 4, soldOut: false,
    img: "assets/hoodie-sand.jpg",
    colors: ["sand", "cream", "khaki"], sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.8, reviews: 61,
    desc: {
      fr: "Le même molleton lourd, dans un sable chaud qui va avec tout. Se porte large avec un jean ou un cargo, et reste beau même après trente lavages.",
      ar: "نفس القطن الثقيل بلون رملي دافئ يناسب كل شيء. يُلبس واسعاً مع الجينز أو الكارغو، ويبقى جميلاً بعد ثلاثين غسلة."
    },
    features: {
      fr: ["Molleton gratté 420 g/m²", "Couleur sable non délavée", "Poche kangourou doublée", "Poignets et bas élastiqués", "Unisexe"],
      ar: ["قطن مبطن 420 غ/م²", "لون رملي لا يبهت", "جيب مربع مبطن", "أساور وأسفل مطاطي", "للجنسين"]
    }
  },
  {
    id: "hoodie-zip",
    name: { fr: "Hoodie Zippé Cendre", ar: "هودي بسحّاب رمادي" },
    cat: "Hoodies", price: 6900, oldPrice: 7400,
    tag: { fr: "Édition limitée", ar: "إصدار محدود" },
    isNew: false, lowStock: 0, soldOut: false,
    img: "assets/hoodie-zip.jpg",
    colors: ["charcoal", "onyx"], sizes: ["M", "L", "XL", "XXL"],
    rating: 4.7, reviews: 44,
    desc: {
      fr: "Zip métallique renforcé, col montant et coupe droite oversize. Le layering parfait pour les matins frais d'Alger.",
      ar: "سحّاب معدني مقوّى، رقبة عالية وقَصّة مستقيمة أوفرسايز. الطبقة المثالية لصباحات الجزائر الباردة."
    },
    features: {
      fr: ["Zip YKK renforcé", "Col montant doublé", "Deux poches latérales", "Molleton 400 g/m²", "Intérieur brossé"],
      ar: ["سحّاب YKK مقوّى", "رقبة عالية مبطنة", "جيبان جانبيان", "قطن مبطن 400 غ/م²", "بطانة داخلية ناعمة"]
    }
  },
  {
    id: "tee-white",
    name: { fr: "Tee Oversize Blanc Casse", ar: "تي شيرت أوفرسايز أبيض" },
    cat: "T-shirts", price: 3200, oldPrice: 3800,
    tag: { fr: "-16 %", ar: "‎-16٪" },
    isNew: false, lowStock: 0, soldOut: false,
    img: "assets/tee-white.jpg",
    colors: ["cream", "sand", "forest"], sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.8, reviews: 97,
    desc: {
      fr: "Jersey de coton peigné 240 g/m², col renforcé qui ne se détend pas. La coupe boxy s'arrête juste sous la ceinture.",
      ar: "قطن مُمشّط 240 غ/م² برقبة مقوّاة لا تتمدد. القَصّة المربعة تنتهي أسفل الحزام مباشرة."
    },
    features: {
      fr: ["Coton peigné 240 g/m²", "Col côtelé renforcé", "Coupe boxy oversize", "Coutures d'épaule à l'anglaise", "Pré-rétréci"],
      ar: ["قطن ممشط 240 غ/م²", "رقبة مضلعة مقوّاة", "قَصّة مربعة أوفرسايز", "خياطة أكتاف مقوّاة", "لا ينكمش بعد الغسل"]
    }
  },
  {
    id: "tee-black",
    name: { fr: "Tee Oversize Noir Encre", ar: "تي شيرت أوفرسايز أسود" },
    cat: "T-shirts", price: 3200, oldPrice: 0,
    tag: { fr: "Essentiel", ar: "أساسي" },
    isNew: false, lowStock: 6, soldOut: false,
    img: "assets/tee-black.jpg",
    colors: ["onyx", "charcoal"], sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.9, reviews: 152,
    desc: {
      fr: "Le noir qui reste noir : teinture en pièce et lavage enzymatique pour éviter le délavage. Se porte seul ou sous un hoodie.",
      ar: "الأسود الذي يبقى أسود: صباغة كاملة وغسل إنزيمي لتجنّب البهتان. يُلبس وحده أو تحت الهودي."
    },
    features: {
      fr: ["Teinture en pièce", "Coton peigné 240 g/m²", "Coupe boxy oversize", "Manches courtes larges", "Unisexe"],
      ar: ["صباغة كاملة", "قطن ممشط 240 غ/م²", "قَصّة مربعة أوفرسايز", "أكمام قصيرة واسعة", "للجنسين"]
    }
  },
  {
    id: "crewneck-avoine",
    name: { fr: "Sweat Col Rond Avoine", ar: "سويت شيرت برقبة دائرية" },
    cat: "Sweats", price: 4900, oldPrice: 0,
    tag: { fr: "Confort", ar: "مريح" },
    isNew: true, lowStock: 0, soldOut: false,
    img: "assets/crewneck.jpg",
    colors: ["cream", "sand"], sizes: ["S", "M", "L", "XL"],
    rating: 4.7, reviews: 38,
    desc: {
      fr: "Molleton 380 g/m², intérieur brossé et col côtelé épais. La pièce parfaite pour les journées où tu veux juste être bien.",
      ar: "قطن مبطن 380 غ/م²، بطانة ناعمة ورقبة مضلعة سميكة. القطعة المثالية للأيام التي تريد فيها الراحة فقط."
    },
    features: {
      fr: ["Molleton 380 g/m²", "Intérieur brossé", "Col côtelé 3 cm", "Bas et poignets élastiqués", "Coupe droite légèrement large"],
      ar: ["قطن مبطن 380 غ/م²", "بطانة داخلية ناعمة", "رقبة مضلعة 3 سم", "أسفل وأساور مطاطية", "قَصّة مستقيمة واسعة قليلاً"]
    }
  },
  {
    id: "cargo-wide",
    name: { fr: "Cargo Large Noir", ar: "بنطال كارغو أسود واسع" },
    cat: "Pantalons", price: 4900, oldPrice: 5600,
    tag: { fr: "-12 %", ar: "‎-12٪" },
    isNew: false, lowStock: 0, soldOut: false,
    img: "assets/cargo.jpg",
    colors: ["onyx", "khaki"], sizes: ["S", "M", "L", "XL"],
    rating: 4.6, reviews: 55,
    desc: {
      fr: "Toile de coton épaisse, jambe large et poches cargo profondes. Taille élastiquée avec cordon pour l'ajuster comme tu veux.",
      ar: "قماش قطني سميك، ساق واسعة وجيوب كارغو عميقة. خصر مطاطي مع رباط لتعديله كما تحب."
    },
    features: {
      fr: ["Toile coton 320 g/m²", "Jambe large droite", "6 poches dont 2 cargo", "Taille élastiquée + cordon", "Ourlet ajustable"],
      ar: ["قماش قطني 320 غ/م²", "ساق واسعة مستقيمة", "6 جيوب بينها 2 كارغو", "خصر مطاطي مع رباط", "أسفل قابل للتعديل"]
    }
  },
  {
    id: "short-sable",
    name: { fr: "Short Molleton Sable", ar: "شورت مبطن رملي" },
    cat: "Pantalons", price: 3500, oldPrice: 0,
    tag: { fr: "Été", ar: "صيف" },
    isNew: false, lowStock: 0, soldOut: false,
    img: "assets/shorts.jpg",
    colors: ["sand", "grey"], sizes: ["S", "M", "L", "XL"],
    rating: 4.5, reviews: 29,
    desc: {
      fr: "Molleton léger 300 g/m², coupe ample au-dessus du genou. Avec un tee oversize, c'est la tenue d'été complète.",
      ar: "قطن خفيف 300 غ/م²، قَصّة واسعة فوق الركبة. مع تي شيرت أوفرسايز تصبح إطلالة الصيف كاملة."
    },
    features: {
      fr: ["Molleton 300 g/m²", "Coupe ample au-dessus du genou", "Taille élastiquée + cordon", "Deux poches latérales", "Unisexe"],
      ar: ["قطن مبطن 300 غ/م²", "قَصّة واسعة فوق الركبة", "خصر مطاطي مع رباط", "جيبان جانبيان", "للجنسين"]
    }
  },
  {
    id: "cap-lion",
    name: { fr: "Casquette Leo's Lion", ar: "كاسكيط ليون" },
    cat: "Accessoires", price: 2200, oldPrice: 0,
    tag: { fr: "Signature", ar: "العلامة" },
    isNew: true, lowStock: 0, soldOut: false,
    img: "assets/cap.jpg",
    colors: ["onyx", "forest"], sizes: ["Unique"],
    rating: 4.7, reviews: 33,
    desc: {
      fr: "Casquette non structurée en coton lavé, broderie dorée discrète. Fermeture métallique réglable, tient bien sur toutes les têtes.",
      ar: "كاسكيط قطني مغسول غير مُقوّى، تطريز ذهبي بسيط. إغلاق معدني قابل للتعديل يناسب كل الرؤوس."
    },
    features: {
      fr: ["Coton lavé non structuré", "Broderie fil doré", "Fermeture métallique réglable", "Visière pré-formée", "Taille unique 54–60 cm"],
      ar: ["قطن مغسول غير مقوّى", "تطريز بخيط ذهبي", "إغلاق معدني قابل للتعديل", "مظلة مشكّلة", "مقاس واحد 54–60 سم"]
    }
  }
];

/* ---------- Avis clients ---------- */
const REVIEWS = [
  { name: { fr: "Yacine B.", ar: "ياسين ب." }, city: { fr: "Alger", ar: "الجزائر" }, stars: 5,
    text: { fr: "Le hoodie est vraiment lourd, pas la version fine qu'on trouve partout. Livré en 2 jours à Bab Ezzouar, payé au livreur.",
            ar: "الهودي ثقيل فعلاً، ليس النسخة الرقيقة الموجودة في كل مكان. وصل في يومين إلى باب الزوار، ودفعت للعامل." } },
  { name: { fr: "Lina M.", ar: "لينا م." }, city: { fr: "Constantine", ar: "قسنطينة" }, stars: 5,
    text: { fr: "J'ai pris deux tees pour avoir la remise : la coupe tombe parfaitement et le col ne s'est pas détendu après cinq lavages.",
            ar: "أخذت قميصين لأستفيد من التخفيض: القَصّة مثالية والرقبة لم تتمدد بعد خمس غسلات." } },
  { name: { fr: "Amine K.", ar: "أمين ك." }, city: { fr: "Oran", ar: "وهران" }, stars: 5,
    text: { fr: "Commande passée un dimanche soir, appelée le lendemain matin pour confirmer, colis récupéré au Stop Desk le mardi. Rien à dire.",
            ar: "طلبت ليلة الأحد، اتصلوا بي صباح الغد للتأكيد، واستلمت الطرد من مكتب التسليم الثلاثاء. لا تعليق." } },
  { name: { fr: "Nour H.", ar: "نور ح." }, city: { fr: "Béjaïa", ar: "بجاية" }, stars: 4,
    text: { fr: "Très belle qualité, juste la couleur sable un peu plus claire que sur les photos. L'échange a été fait en une journée.",
            ar: "جودة جميلة جداً، فقط اللون الرملي أفتح قليلاً مما في الصور. تم التبديل في يوم واحد." } },
  { name: { fr: "Sofiane T.", ar: "سفيان ت." }, city: { fr: "Sétif", ar: "سطيف" }, stars: 5,
    text: { fr: "Je fais 1m82 et 95 kg : le XL est parfait, large sans être un sac. C'est mon troisième achat chez eux.",
            ar: "طولي 1.82 ووزني 95 كغ: مقاس XL مثالي، واسع دون مبالغة. هذه ثالث عملية شراء عندهم." } },
  { name: { fr: "Rania Z.", ar: "رانيا ز." }, city: { fr: "Tlemcen", ar: "تلمسان" }, stars: 5,
    text: { fr: "Le service WhatsApp répond en quelques minutes et m'a aidée à choisir la taille. Le sweat crème est magnifique.",
            ar: "خدمة واتساب ترد في دقائق وساعدتني في اختيار المقاس. السويت الكريمي رائع." } }
];

/* ---------- FAQ ---------- */
const FAQS = [
  { q: { fr: "Combien de temps prend la livraison ?", ar: "كم يستغرق التوصيل؟" },
    a: { fr: "Entre 24 et 72 h dans le Nord et le Centre, 2 à 4 jours à l'Est et à l'Ouest, 3 à 6 jours dans le Sud. Tu reçois un appel du transporteur avant la livraison.", ar: "من 24 إلى 72 ساعة في الشمال والوسط، 2 إلى 4 أيام في الشرق والغرب، و3 إلى 6 أيام في الجنوب. يتصل بك الناقل قبل التسليم." } },
  { q: { fr: "Comment se passe le paiement ?", ar: "كيف تتم عملية الدفع؟" },
    a: { fr: "C'est du paiement à la livraison : tu payes en espèces au livreur, après avoir vu le colis. Aucun acompte, aucune carte bancaire.", ar: "الدفع عند الاستلام: تدفع نقداً لعامل التوصيل بعد رؤية الطرد. لا مُقدَّم ولا بطاقة بنكية." } },
  { q: { fr: "Et si la taille ne va pas ?", ar: "وماذا لو لم يناسبني المقاس؟" },
    a: { fr: "Tu as 48 h après réception pour demander un échange, sans frais de pièce. On récupère l'article et on t'envoie la bonne taille.", ar: "لديك 48 ساعة بعد الاستلام لطلب التبديل دون رسوم على القطعة. نستلم المنتج ونرسل لك المقاس الصحيح." } },
  { q: { fr: "Les couleurs bavent-elles au lavage ?", ar: "هل تبهت الألوان عند الغسل؟" },
    a: { fr: "Non. Nos tissus sont teints en pièce et pré-rétrécis : lave à 30 °C, à l'envers, et la couleur tient des années.", ar: "لا. أقمشتنا مصبوغة بالكامل ومعالجة ضد الانكماش: اغسل على 30 درجة، مقلوباً، وسيبقى اللون سنوات." } },
  { q: { fr: "Puis-je commander sur WhatsApp ?", ar: "هل يمكنني الطلب عبر واتساب؟" },
    a: { fr: "Oui. Remplis le panier puis clique sur « Envoyer sur WhatsApp » : le message part avec ton récapitulatif complet, on confirme et on expédie.", ar: "نعم. املأ السلة ثم اضغط على «إرسال عبر واتساب»: تُرسل الرسالة مع ملخص طلبك كاملاً، ونؤكد ثم نشحن." } },
  { q: { fr: "Les produits taillent-ils petit ?", ar: "هل المقاسات صغيرة؟" },
    a: { fr: "Non, c'est justement notre spécialité : coupes oversize généreuses. Consulte le guide des tailles (mesures en cm) avant de valider.", ar: "لا، بل هذا اختصاصنا: قَصّات أوفرسايز واسعة. راجع دليل المقاسات (بالسنتيمتر) قبل التأكيد." } }
];

/* ---------- Réglages par défaut ---------- */
const DEFAULT_SETTINGS = {
  discount: 10,
  minimumItems: 2,
  freeShipItems: 2,
  feeNorth: 500,
  feeEastWest: 600,
  feeSouth: 900,
  deskDiscount: 20,
  deliveryDays: "2–5",
  whatsapp: "213555000000",
  facebookPixel: "",
  tiktokPixel: "",
  showAnnouncement: true
};

/* ============================================================
   DICTIONNAIRE BILINGUE
   ============================================================ */
const I18N = {
  fr: {
    "card.new": "Nouveau", "card.quick": "Ajout rapide", "card.view": "Voir le produit", "card.low": "Plus que {n} en stock",
    "card.reviews": "{n} avis", "shop.results": "{n} pièce(s)", "shop.empty": "Aucune pièce ne correspond. Essaie un autre mot ou enlève le filtre.",
    "shop.all": "Tout", "shop.newOnly": "Nouveautés",
    "bag.added": "{name} ajouté au panier", "bag.addedQty": "{qty} × {name} ajouté au panier", "bag.sizeNeeded": "Choisis une taille d'abord",
    "bag.removed": "Article retiré du panier", "bag.max": "Stock maximum atteint pour cette pièce",
    "cart.title": "Ton panier", "cart.empty": "Ton panier est vide", "cart.emptyText": "Ajoute une pièce : le combo de 10 % s'active dès {n} articles.",
    "cart.emptyCta": "Voir la collection", "cart.size": "Taille", "cart.color": "Couleur", "cart.remove": "Retirer",
    "cart.subtotal": "Sous-total", "cart.discount": "Remise combo ({n} %)", "cart.delivery": "Livraison", "cart.deliveryFree": "Offerte",
    "cart.total": "Total à payer", "cart.totalEstimate": "Total estimé (hors livraison)", "cart.deliveryLater": "Calculée à la commande",
    "cart.checkout": "Passer commande", "cart.note": "Paiement à la livraison · frais confirmés selon ta wilaya",
    "cart.nudge": "Encore {n} pièce(s) pour {off}", "cart.nudgeOff": "la remise de {d} %", "cart.freeShip": "Livraison offerte dès {n} articles : encore {left} !",
    "cart.freeShipOk": "Livraison offerte sur cette commande", "cart.continue": "Continuer mes achats",
    "wish.added": "Ajouté à tes favoris", "wish.removed": "Retiré de tes favoris",
    "badge.save": "Économise {n}", "badge.out": "Épuisé",
    "pdp.home": "Accueil", "pdp.shop": "Boutique", "pdp.back": "Retour à la boutique",
    "pdp.color": "Couleur", "pdp.size": "Taille", "pdp.sizeGuide": "Guide des tailles", "pdp.qty": "Quantité",
    "pdp.add": "Ajouter au panier", "pdp.addShort": "Ajouter", "pdp.buy": "Commander maintenant", "pdp.out": "Épuisé — me prévenir",
    "pdp.inStock": "En stock · expédié sous 24 h", "pdp.low": "Plus que {n} en stock", "pdp.choose": "Choisis une option pour continuer",
    "pdp.save": "Tu économises {n}", "pdp.f1": "Coton épais 420 g", "pdp.f1s": "Ne se déforme pas",
    "pdp.f2": "Livraison 24–72 h", "pdp.f2s": "58 wilayas, à domicile ou Stop Desk",
    "pdp.f3": "Échange 48 h", "pdp.f3s": "Mauvaise taille ? On reprend",
    "pdp.factCat": "Catégorie", "pdp.factFit": "Coupe", "pdp.factCare": "Entretien", "pdp.factOrig": "Origine",
    "pdp.fitVal": "Oversize, non rétrécie", "pdp.careVal": "Lavage 30 °C, à l'envers", "pdp.origVal": "Dessiné à Alger",
    "pdp.share": "Partager", "pdp.copied": "Lien copié dans le presse-papier", "pdp.waAsk": "Poser une question sur WhatsApp",
    "pdp.related": "Ça va bien avec", "pdp.freeShip": "Livraison offerte dès {n} articles dans le panier",
    "pdp.perk1": "Paiement à la livraison", "pdp.perk1s": "Tu payes en espèces, une fois le colis en main.",
    "pdp.perk2": "Expédition sous 24 h", "pdp.perk2s": "Commandes confirmées avant 16 h parties le jour même.",
    "pdp.perk3": "Échange facile 48 h", "pdp.perk3s": "Une taille à changer ? On organise la reprise.",
    "acc.details": "Détails du produit", "acc.features": "Caractéristiques", "acc.ship": "Livraison & retours", "acc.care": "Entretien",
    "acc.careText": "Lavage machine à 30 °C, à l'envers, avec des couleurs similaires. Pas d'eau de javel. Séchage à l'air libre, repassage à basse température sur l'envers.",
    "acc.shipText": "Expédition depuis Alger sous 24 h ouvrées. Livraison 24–72 h dans le Nord/Centre, 2–4 jours à l'Est/Ouest, 3–6 jours au Sud. Paiement à la livraison, échange gratuit sous 48 h.",
    "size.title": "Guide des tailles", "size.sub": "Mesures prises à plat, en centimètres. Nos coupes sont oversize : entre deux tailles, prends la plus grande.",
    "size.col1": "Mesure", "size.note": "Besoin d'aide ? Envoie ta taille et ton poids sur WhatsApp, on te conseille en 5 minutes.",
    "size.cta": "Demander conseil sur WhatsApp",
    "rev.verified": "Achat vérifié", "rev.helpful": "Utile",
    "checkout.title": "Finaliser la commande", "checkout.sub": "Paiement à la livraison · on t'appelle pour confirmer avant l'expédition.",
    "form.name": "Nom et prénom", "form.namePh": "Ex : Amine Belkacem", "form.phone": "Numéro de téléphone", "form.phoneHint": "Format : 0555 12 34 56, 0666…, 0777… ou +213…",
    "form.wilaya": "Wilaya", "form.wilayaPh": "Choisis ta wilaya", "form.mode": "Mode de livraison",
    "form.modeHome": "À domicile", "form.modeHomeSub": "Le livreur vient jusqu'à ta porte", "form.modeDesk": "Stop Desk", "form.modeDeskSub": "Tu récupères au bureau du transporteur",
    "form.address": "Commune / adresse", "form.addressPh": "Ex : Bab Ezzouar, cité 200 logements, près de la pharmacie", "form.note": "Note pour le livreur (optionnel)", "form.notePh": "Ex : appelez-moi avant 18 h",
    "form.feeHome": "À domicile : {n}", "form.feeDesk": "Stop Desk : {n}", "form.feeFree": "Offerte",
    "checkout.payNote": "Aucun paiement en ligne. Tu payes le livreur en espèces quand tu reçois le colis.",
    "checkout.submit": "Confirmer ma commande", "checkout.terms": "En confirmant, tu acceptes d'être contacté au numéro indiqué pour valider la commande.",
    "checkout.empty": "Ton panier est vide : ajoute une pièce avant de commander.",
    "err.name": "Indique ton nom complet.", "err.phone": "Numéro invalide. Exemple : 0555 12 34 56.", "err.wilaya": "Choisis ta wilaya.", "err.address": "Indique ta commune et un repère.",
    "summary.title": "Récapitulatif", "summary.subtotal": "Sous-total", "summary.discount": "Remise combo", "summary.ship": "Livraison ({mode})", "summary.total": "Total à payer", "summary.items": "{n} article(s)",
    "mode.home": "à domicile", "mode.desk": "Stop Desk",
    "confirm.title": "Commande enregistrée !", "confirm.sub": "On t'appelle dans les prochaines heures pour confirmer la taille et l'adresse.",
    "confirm.refLabel": "Référence de commande", "confirm.wa": "Envoyer sur WhatsApp", "confirm.continue": "Continuer mes achats", "confirm.keep": "Garde ta référence : elle sert au suivi de ta commande.",
    "confirm.thanks": "Merci {name} ! Ta commande {ref} est enregistrée.",
    "news.ok": "Merci ! Ton code −10 % arrive par e-mail dans une minute.", "news.err": "Vérifie ton adresse e-mail.",
    "toast.track": "Envoie-nous ton numéro de commande sur WhatsApp, on te répond avec le suivi.",
    "zone.nord": "Nord & Centre", "zone.ew": "Est & Ouest", "zone.sud": "Grand Sud",
    "del.homeFee": "À domicile", "del.deskFee": "Stop Desk (moins cher)", "del.days": "Délai estimé", "del.zoneNote": "Frais calculés selon la zone de ta wilaya.",
    "del.rowHome": "Livraison à domicile", "del.rowDesk": "Livraison Stop Desk", "del.rowDays": "Délai moyen", "del.rowFree": "Livraison offerte",
    "del.freeText": "Dès {n} articles dans le panier",
    "combo.tier2": "−{d} % sur tout le panier", "combo.tier3": "Livraison offerte", "combo.tier3off": "Livraison offerte dès {n} pièces",
    "combo.progress": "{have} / {need} pièce(s) pour la remise de {d} %", "combo.progressDone": "Combo activé : −{d} % appliqués",
    "wa.hello": "Salam ! Je voudrais des infos sur la collection Leo's.", "cta.whatsapp": "Commander sur WhatsApp", "wa.order": "Salam ! Je veux commander",
    "wa.ask": "Salam ! Une question sur : {name}",
    "admin.tab": "Gestion Leo's", "admin.open": "Gestion",
    "admin.orders.empty": "Aucune commande enregistrée dans ce navigateur pour le moment.",
    "admin.orderLine": "{ref} · {name} · {total}", "admin.added": "Produit ajouté au catalogue", "admin.removed": "Produit supprimé",
    "admin.saved": "Réglages enregistrés", "admin.resetDone": "Données de démo restaurées", "admin.exported": "Fichier JSON téléchargé",
    "admin.confirmDelete": "Supprimer « {name} » du catalogue ?", "admin.nameNeeded": "Donne un nom au produit.", "admin.needOne": "Garde au moins un produit en ligne.",
    "admin.currency": "DA", "admin.announce": "Barre d'annonce",
    "admin.fStock": "Stock restant (0 = illimité)", "admin.soldOut": "Épuisé", "admin.stockState": "Stock",
    "footer.sizeOpen": "Guide des tailles Leo's"
  },
  ar: {
    "card.new": "جديد", "card.quick": "إضافة سريعة", "card.view": "عرض المنتج", "card.low": "بقي {n} فقط في المخزون",
    "card.reviews": "{n} رأي", "shop.results": "{n} قطعة", "shop.empty": "لا توجد قطعة مطابقة. جرّب كلمة أخرى أو أزل الفلتر.",
    "shop.all": "الكل", "shop.newOnly": "جديدنا",
    "bag.added": "تمت إضافة {name} إلى السلة", "bag.addedQty": "تمت إضافة {qty} × {name} إلى السلة", "bag.sizeNeeded": "اختر المقاس أولاً",
    "bag.removed": "تم حذف المنتج من السلة", "bag.max": "وصلت للحد الأقصى من المخزون",
    "cart.title": "سلّتك", "cart.empty": "سلّتك فارغة", "cart.emptyText": "أضف قطعة: تخفيض 10٪ يُفعَّل من {n} قطع.",
    "cart.emptyCta": "تصفح المجموعة", "cart.size": "المقاس", "cart.color": "اللون", "cart.remove": "حذف",
    "cart.subtotal": "المجموع الفرعي", "cart.discount": "تخفيض الكومبو ({n}٪)", "cart.delivery": "التوصيل", "cart.deliveryFree": "مجاني",
    "cart.total": "المبلغ الإجمالي", "cart.checkout": "إتمام الطلب", "cart.note": "الدفع عند الاستلام · تكلفة التوصيل حسب الولاية",
    "cart.nudge": "بقي {n} قطعة للحصول على {off}", "cart.nudgeOff": "تخفيض {d}٪", "cart.freeShip": "التوصيل مجاني من {n} قطع: بقي {left}!",
    "cart.freeShipOk": "التوصيل مجاني على هذا الطلب", "cart.continue": "متابعة التسوق",
    "wish.added": "أُضيف إلى المفضلة", "wish.removed": "أُزيل من المفضلة",
    "badge.save": "توفّر {n}", "badge.out": "نفدت الكمية",
    "pdp.home": "الرئيسية", "pdp.shop": "المتجر", "pdp.back": "رجوع إلى المتجر",
    "pdp.color": "اللون", "pdp.size": "المقاس", "pdp.sizeGuide": "دليل المقاسات", "pdp.qty": "الكمية",
    "pdp.add": "أضف إلى السلة", "pdp.addShort": "أضف", "pdp.buy": "اطلب الآن", "pdp.out": "نفدت — أعلمني",
    "pdp.inStock": "متوفر · يُرسل خلال 24 ساعة", "pdp.low": "بقي {n} فقط في المخزون", "pdp.choose": "اختر الخيارات للمتابعة",
    "pdp.save": "توفّر {n}", "pdp.freeShip": "التوصيل مجاني من {n} قطع في السلة",
    "pdp.f1": "قطن سميك 420 غ", "pdp.f1s": "لا يفقد شكله",
    "pdp.f2": "توصيل 24–72 ساعة", "pdp.f2s": "58 ولاية، للمنزل أو مكتب التسليم",
    "pdp.f3": "تبديل خلال 48 ساعة", "pdp.f3s": "المقاس غير مناسب؟ نستبدله",
    "pdp.factCat": "الفئة", "pdp.factFit": "القَصّة", "pdp.factCare": "العناية", "pdp.factOrig": "المنشأ",
    "pdp.fitVal": "أوفرسايز، لا ينكمش", "pdp.careVal": "غسل 30 °م، مقلوباً", "pdp.origVal": "مصمَّم في الجزائر",
    "pdp.share": "شارك", "pdp.copied": "تم نسخ الرابط", "pdp.waAsk": "اسأل عبر واتساب",
    "pdp.related": "يُناسب مع", "pdp.perk1": "الدفع عند الاستلام", "pdp.perk1s": "تدفع نقداً بعد استلام الطرد.",
    "pdp.perk2": "إرسال خلال 24 ساعة", "pdp.perk2s": "الطلبات المؤكدة قبل 16:00 تُرسل اليوم نفسه.",
    "pdp.perk3": "تبديل سهل 48 ساعة", "pdp.perk3s": "تريد تغيير المقاس؟ ننظّم الاسترجاع.",
    "acc.details": "تفاصيل المنتج", "acc.features": "المواصفات", "acc.ship": "التوصيل والإرجاع", "acc.care": "العناية",
    "acc.careText": "غسل بالآلة على 30 °م، مقلوباً، مع ألوان مشابهة. بدون مبيّض. تجفيف في الهواء، وكي بحرارة منخفضة من الداخل.",
    "acc.shipText": "الإرسال من الجزائر العاصمة خلال 24 ساعة عمل. التوصيل 24–72 ساعة في الشمال والوسط، 2–4 أيام في الشرق والغرب، و3–6 أيام في الجنوب. الدفع عند الاستلام، وتبديل مجاني خلال 48 ساعة.",
    "size.title": "دليل المقاسات", "size.sub": "القياسات مسطّحة بالسنتيمتر. قَصّاتنا أوفرسايز: بين مقاسين اختر الأكبر.",
    "size.col1": "القياس", "size.note": "تحتاج مساعدة؟ أرسل طولك ووزنك على واتساب وسننصحك في 5 دقائق.",
    "size.cta": "استشرنا على واتساب",
    "rev.verified": "شراء موثّق", "rev.helpful": "مفيد",
    "checkout.title": "إتمام الطلب", "checkout.sub": "الدفع عند الاستلام · نتصل بك للتأكيد قبل الإرسال.",
    "form.name": "الاسم واللقب", "form.namePh": "مثال: أمين بلقاسم", "form.phone": "رقم الهاتف", "form.phoneHint": "الصيغة: 0555 12 34 56 أو 0666… أو 0777… أو +213…",
    "form.wilaya": "الولاية", "form.wilayaPh": "اختر ولايتك", "form.mode": "طريقة التوصيل",
    "form.modeHome": "إلى المنزل", "form.modeHomeSub": "يأتي عامل التوصيل إلى بابك", "form.modeDesk": "مكتب التسليم", "form.modeDeskSub": "تستلم من مكتب الناقل",
    "form.address": "البلدية / العنوان", "form.addressPh": "مثال: باب الزوار، حي 200 مسكن، قرب الصيدلية", "form.note": "ملاحظة لعامل التوصيل (اختياري)", "form.notePh": "مثال: اتصلوا بي قبل السادسة مساءً",
    "form.feeHome": "إلى المنزل: {n}", "form.feeDesk": "مكتب التسليم: {n}", "form.feeFree": "مجاني",
    "checkout.payNote": "لا دفع إلكتروني. تدفع لعامل التوصيل نقداً عند استلام الطرد.",
    "checkout.submit": "تأكيد الطلب", "checkout.terms": "بالتأكيد، أنت توافق على أن نتصل بك على الرقم المذكور لتأكيد الطلب.",
    "checkout.empty": "سلّتك فارغة: أضف قطعة قبل الطلب.",
    "err.name": "اكتب اسمك الكامل.", "err.phone": "رقم غير صالح. مثال: 0555 12 34 56.", "err.wilaya": "اختر ولايتك.", "err.address": "اكتب البلدية وأقرب نقطة معروفة.",
    "summary.title": "ملخص الطلب", "summary.subtotal": "المجموع الفرعي", "summary.discount": "تخفيض الكومبو", "summary.ship": "التوصيل ({mode})", "summary.total": "المبلغ الإجمالي", "summary.items": "{n} قطعة",
    "mode.home": "إلى المنزل", "mode.desk": "مكتب التسليم",
    "confirm.title": "تم تسجيل طلبك!", "confirm.sub": "سنتصل بك خلال الساعات القادمة لتأكيد المقاس والعنوان.",
    "confirm.refLabel": "رقم الطلب", "confirm.wa": "إرسال عبر واتساب", "confirm.continue": "متابعة التسوق", "confirm.keep": "احفظ رقم الطلب لمتابعته.",
    "confirm.thanks": "شكراً {name}! تم تسجيل طلبك {ref}.",
    "news.ok": "شكراً! سيصلك كود ‎-10٪ على البريد في دقيقة.", "news.err": "تحقّق من بريدك الإلكتروني.",
    "toast.track": "أرسل لنا رقم طلبك على واتساب وسنرد عليك بمعلومات التتبع.",
    "zone.nord": "الشمال والوسط", "zone.ew": "الشرق والغرب", "zone.sud": "الجنوب الكبير",
    "del.homeFee": "إلى المنزل", "del.deskFee": "مكتب التسليم (أرخص)", "del.days": "المدة المتوقعة", "del.zoneNote": "تُحسب التكلفة حسب منطقة ولايتك.",
    "del.rowHome": "التوصيل إلى المنزل", "del.rowDesk": "التوصيل إلى مكتب التسليم", "del.rowDays": "المدة المتوسطة", "del.rowFree": "التوصيل مجاني",
    "del.freeText": "من {n} قطع في السلة",
    "combo.tier2": "‎-{d}٪ على كل السلة", "combo.tier3": "التوصيل مجاني", "combo.tier3off": "التوصيل مجاني من {n} قطع",
    "combo.progress": "{have} / {need} قطعة للحصول على تخفيض {d}٪", "combo.progressDone": "تم تفعيل الكومبو: ‎-{d}٪ مطبَّقة",
    "wa.hello": "سلام! أريد معلومات عن مجموعة Leo's.", "cta.whatsapp": "اطلب عبر واتساب", "wa.order": "سلام! أريد الطلب",
    "wa.ask": "سلام! لدي سؤال حول: {name}",
    "admin.tab": "إدارة Leo's", "admin.open": "الإدارة",
    "admin.orders.empty": "لا توجد طلبات مسجّلة في هذا المتصفح حالياً.",
    "admin.orderLine": "{ref} · {name} · {total}", "admin.added": "تمت إضافة المنتج للكتالوج", "admin.removed": "تم حذف المنتج",
    "admin.saved": "تم حفظ الإعدادات", "admin.resetDone": "تمت استعادة بيانات العرض", "admin.exported": "تم تنزيل ملف JSON",
    "admin.confirmDelete": "حذف «{name}» من الكتالوج؟", "admin.nameNeeded": "أعط اسماً للمنتج.", "admin.needOne": "أبقِ منتجاً واحداً على الأقل.",
    "admin.currency": "دج", "admin.announce": "شريط الإعلان",
    "footer.sizeOpen": "دليل مقاسات Leo's"
  }
};

/* ============================================================
   ÉTAT
   ============================================================ */
const LS = {
  cart: "leos_cart_v2",
  products: "leos_products_v2",
  settings: "leos_settings_v2",
  wish: "leos_wish_v2",
  orders: "leos_orders_v2",
  lang: "leos_lang_v1"
};

const state = {
  lang: "fr",
  products: [],
  cart: [],
  wish: [],
  orders: [],
  settings: { ...DEFAULT_SETTINGS },
  filter: "all",
  sort: "featured",
  search: "",
  product: null,
  size: null,
  color: null,
  qty: 1,
  gallery: 0,
  wilaya: "",
  mode: "home",
  lastOrder: null,
  adminUnlocked: false,
  quick: { pid: null, size: null, color: null }
};

/* ============================================================
   UTILITAIRES
   ============================================================ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return JSON.parse(JSON.stringify(fallback));
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? JSON.parse(JSON.stringify(fallback)) : parsed;
  } catch (err) {
    return JSON.parse(JSON.stringify(fallback));
  }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (err) { /* mode privé */ }
}

function esc(value) {
  return String(value === null || value === undefined ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function money(value) {
  const n = Number(value) || 0;
  const formatted = n.toLocaleString(state.lang === "ar" ? "ar-DZ" : "fr-DZ").replace(/\u202f|\u00a0/g, " ");
  return state.lang === "ar" ? `${formatted} دج` : `${formatted} DA`;
}

function t(key, vars) {
  const dict = I18N[state.lang] || I18N.fr;
  let str = dict[key] !== undefined ? dict[key] : (I18N.fr[key] !== undefined ? I18N.fr[key] : key);
  if (vars) {
    Object.keys(vars).forEach(k => { str = str.split(`{${k}}`).join(vars[k]); });
  }
  return str;
}

function L(obj) {
  if (obj === null || obj === undefined) return "";
  if (typeof obj === "string") return obj;
  return obj[state.lang] || obj.fr || "";
}

function productById(id) { return state.products.find(p => p.id === id) || null; }
function colorName(key) { return COLORS[key] ? L(COLORS[key]) : key; }
function colorHex(key) { return COLORS[key] ? COLORS[key].hex : "#ccc"; }
function catName(key) { return CATS[key] ? L(CATS[key]) : key; }
function wilayaByCode(code) { return WILAYAS.find(w => w[0] === code) || null; }
function wilayaLabel(code) {
  const w = wilayaByCode(code);
  if (!w) return "";
  return `${w[0]} · ${state.lang === "ar" ? w[2] : w[1]}`;
}

function showToast(message, icon) {
  const toast = $("#toast");
  if (!toast) return;
  const glyph = icon === "heart"
    ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-8-5.1-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.9-8 11-8 11z"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  toast.innerHTML = `${glyph}<span>${esc(message)}</span>`;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function debounce(fn, wait) {
  let timer;
  return function () {
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(null, args), wait);
  };
}

/* ---------- Tarifs livraison ---------- */
function baseFee(code) {
  const w = wilayaByCode(code);
  if (!w) return 0;
  const zone = w[3];
  if (zone === "nord") return Number(state.settings.feeNorth) || 0;
  if (zone === "ouest" || zone === "est") return Number(state.settings.feeEastWest) || 0;
  return Number(state.settings.feeSouth) || 0;
}

function feeForMode(code, mode) {
  const base = baseFee(code);
  if (mode !== "desk") return base;
  const off = Math.min(60, Math.max(0, Number(state.settings.deskDiscount) || 0));
  return Math.max(0, Math.round((base * (1 - off / 100)) / 50) * 50);
}

function cartCount() { return state.cart.reduce((sum, item) => sum + item.qty, 0); }
function cartLines() {
  return state.cart.map(item => {
    const product = productById(item.pid);
    if (!product) return null;
    return { ...item, product, line: product.price * item.qty };
  }).filter(Boolean);
}
function subtotal() { return cartLines().reduce((sum, line) => sum + line.line, 0); }
function discountRate() {
  const need = Math.max(2, Number(state.settings.minimumItems) || 2);
  return cartCount() >= need ? Math.max(0, Math.min(60, Number(state.settings.discount) || 0)) : 0;
}
function discountValue() { return Math.round(subtotal() * discountRate() / 100); }
function shippingFee() {
  if (!state.cart.length) return 0;
  const freeAt = Math.max(1, Number(state.settings.freeShipItems) || 2);
  if (cartCount() >= freeAt) return 0;
  if (!state.wilaya) return feeForMode("16", state.mode);
  return feeForMode(state.wilaya, state.mode);
}
function orderTotal() { return Math.max(0, subtotal() - discountValue() + shippingFee()); }

/* ---------- Validation ---------- */
function normalizePhone(input) {
  let digits = String(input || "").replace(/[^\d+]/g, "").replace(/\+/g, "");
  if (digits.startsWith("00213")) digits = digits.slice(5);
  else if (digits.startsWith("213")) digits = digits.slice(3);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}
function isValidPhone(input) {
  const digits = normalizePhone(input);
  return /^[5-7]\d{8}$/.test(digits);
}
function internationalPhone(input) {
  return "213" + normalizePhone(input);
}
