// Curated, ultra-high-resolution mock and seed products for ENZO luxury menswear
// Modeled accurately on the uploaded brand identity & product photos

export const MOCK_CATEGORIES = [
  {
    id: "cat-polos",
    slug: "polos",
    name: { ar: "بولو شيرت فاخرة", en: "Polo Shirts" },
    description: { ar: "قمصان بولو بنقوش معمارية وسحابات راقية", en: "Signature baroque & architectural zip-collar polos" },
    image: "https://images.unsplash.com/photo-1625910513413-5626244f7ea5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-tshirts",
    slug: "t-shirts",
    name: { ar: "تيشيرتات مطرزة وغرافيك", en: "T-Shirts" },
    description: { ar: "تيشيرتات قطن ثقيل 280GSM بقصات أوفر سايز", en: "Heavyweight 280GSM cotton streetwear & embroidered tees" },
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-trousers",
    slug: "trousers",
    name: { ar: "بناطيل وتشارلستون", en: "Tailored Trousers" },
    description: { ar: "بناطيل كلاسيك وتشينو بكسرات أنيقة", en: "Italian pleated chinos and tapered modern trousers" },
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-training",
    slug: "training",
    name: { ar: "أطقم ترينينج رجالية", en: "Training Sets" },
    description: { ar: "أطقم فرنش تيري عالية الفخامة للراحة والأناقة", en: "High-density French terry luxury loungewear sets" },
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
  },
];

export const MOCK_PRODUCTS = [
  {
    id: "prod-1",
    slug: "italia-renaissance-heritage-polo",
    sku: "ENZ-POL-001",
    category_id: "cat-polos",
    name: {
      ar: "قميص بولو إيطاليا التراثي بنقوش معمارية",
      en: "Italia Renaissance Heritage Architectural Polo",
    },
    description: {
      ar: "قميص بولو استثنائي يجمع بين الفخامة الإيطالية والنقوش المعمارية الباروكية المرسومة بدقة على الأكتاف والأكمام، مع شارة إيطاليا المطرزة وسحاب أمريكي أنيق.",
      en: "A masterpiece of modern tailoring featuring intricate Italian architectural Renaissance border prints, embroidered heritage crest, and a structured contrast collar in mercerized cotton.",
    },
    material: {
      ar: "100% قطن ميرسيريزد ناعم ومسامي (220 GSM)",
      en: "100% Mercerized Breathable Piqué Cotton (220 GSM)",
    },
    fit: {
      ar: "قصة كلاسيكية منتظمة (Regular Tailored Fit)",
      en: "Regular Smart Tailored Fit (True to size)",
    },
    care_instructions: {
      ar: "غسيل بارد على الوجه الداخلي، تجفيف طبيعي بدون مبيضات",
      en: "Cold gentle machine wash inside out. Do not tumble dry. Warm iron.",
    },
    price: 260,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "أبيض عاجي مع كحلي", en: "Ivory White & Navy" }, hex: "#F4F1EA" },
      { name: { ar: "أسود ملكي", en: "Onyx Black" }, hex: "#111111" },
    ],
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80",
    ],
    stock: 14,
    badges: ["Bestseller", "New Arrival"],
    rating: 4.95,
    review_count: 38,
    is_active: true,
  },
  {
    id: "prod-2",
    slug: "argentina-cityscape-baroque-polo",
    sku: "ENZ-POL-002",
    category_id: "cat-polos",
    name: {
      ar: "بولو الأرجنتين بنقوش سماوية ومعالم معمارية",
      en: "Argentina Cityscape Baroque Engraved Polo",
    },
    description: {
      ar: "تصميم فاخر مستوحى من المعالم التاريخية بتدرجات الأزرق السماوي والأوف وايت، مع ياقة مطاطية وشعار ذهبي محاك بدقة فائقة.",
      en: "Inspired by classical cityscape lithographs and Latin American grandeur. Features cyan blue architectural panoramas on an off-white cotton base.",
    },
    material: {
      ar: "قطن مصري طويل التيلة ممزوج بألياف الإيلاستين (95% قطن / 5% سباندكس)",
      en: "95% Long-Staple Egyptian Cotton, 5% Elastane",
    },
    fit: {
      ar: "قصة مريحة وعصرية (Relaxed Modern Fit)",
      en: "Relaxed Modern Fit",
    },
    care_instructions: {
      ar: "غسيل يدوي أو دورة أقمشة حساسة بدرجة حرارة 30° مئوية",
      en: "Hand wash or gentle cycle at 30°C. Dry flat in shade.",
    },
    price: 275,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "أزرق سماوي وأبيض", en: "Sky Blue & White" }, hex: "#6BA4B8" },
      { name: { ar: "بيج رملي", en: "Sand Beige" }, hex: "#D4C7B5" },
    ],
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80",
    ],
    stock: 8,
    badges: ["Limited Edition"],
    rating: 4.92,
    review_count: 29,
    is_active: true,
  },
  {
    id: "prod-3",
    slug: "quiet-luxury-ribbed-zip-polo",
    sku: "ENZ-POL-003",
    category_id: "cat-polos",
    name: {
      ar: "بولو أبيض عاجي بياقة سحاب وقماش مضلع فاخر",
      en: "Quiet Luxury Ribbed Zip-Collar Polo",
    },
    description: {
      ar: "قطعة الهدوء والفخامة المطلقة (Quiet Luxury). قماش محبوك بخطوط عمودية تمنح قواماً ممشوقاً، مع سحاب معدني مخفي ولمسة نهائية شديدة النعومة.",
      en: "The quintessential quiet luxury staple. Features a fine vertical rib knit texture, matte silver quarter-zip hardware, and a tailored band hem.",
    },
    material: {
      ar: "مزيج القطن الإيطالي والحرير الصناعي (70% قطن / 30% فسكوز)",
      en: "70% Italian Combed Cotton, 30% Viscose Knit",
    },
    fit: {
      ar: "قصة انسيابية أنيقة (Tailored Slim-Straight)",
      en: "Tailored Slim-Straight Fit",
    },
    care_instructions: {
      ar: "غسيل جاف أو غسيل بارد خفيف جداً، لا تعلق وهي مبللة",
      en: "Gentle cold cycle or dry clean. Reshape while damp.",
    },
    price: 240,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: { ar: "أبيض لؤلؤي", en: "Pearl White" }, hex: "#F8F7F2" },
      { name: { ar: "أسود فحمي", en: "Charcoal Black" }, hex: "#1C1C1E" },
      { name: { ar: "أخضر زيتوني هادئ", en: "Sage Olive" }, hex: "#556B2F" },
    ],
    images: [
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    ],
    stock: 19,
    badges: ["Bestseller", "New Arrival"],
    rating: 5.0,
    review_count: 52,
    is_active: true,
  },
  {
    id: "prod-4",
    slug: "enzo-monogram-heavyweight-tee",
    sku: "ENZ-TEE-001",
    category_id: "cat-tshirts",
    name: {
      ar: "تيشيرت إنزو الأيقوني قطن ثقيل 280GSM",
      en: "ENZO Signature Archival Heavyweight Tee",
    },
    description: {
      ar: "تيشيرت أسود فاحم مصنوع من أفخر أنواع القطن المعالج بوزن 280 GSM، بقبة مضلعة عريضة وطباعة حريرية متينة لشعار ENZO الهندسي.",
      en: "Heavyweight 280GSM pre-shrunk cotton jersey featuring the minimalist ENZO geometric white monogram, thick ribbed crewneck collar, and structured drop shoulders.",
    },
    material: {
      ar: "100% قطن نقي معالج ضد الوبر والانكماش (280 GSM)",
      en: "100% Heavy Combed Cotton (280 GSM)",
    },
    fit: {
      ar: "أوفر سايز عصري متناسق (Boxy Oversized Fit)",
      en: "Structured Boxy Oversized Fit",
    },
    care_instructions: {
      ar: "غسيل بارد 30° على الوجه المقلوب، كوي على حرارة متوسطة",
      en: "Machine wash cold inside out. Iron inside out. Do not bleach.",
    },
    price: 180,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "أسود أونيكس", en: "Onyx Black" }, hex: "#0A0A0A" },
      { name: { ar: "أبيض ناصع", en: "Pure White" }, hex: "#FFFFFF" },
    ],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80",
    ],
    stock: 25,
    badges: ["Bestseller"],
    rating: 4.91,
    review_count: 64,
    is_active: true,
  },
  {
    id: "prod-5",
    slug: "curved-contrast-streetwear-tee",
    sku: "ENZ-TEE-002",
    category_id: "cat-tshirts",
    name: {
      ar: "تيشيرت ستريت وير بقصات منحنية بيضاء متباينة",
      en: "Curved Contrast Inset Streetwear Tee",
    },
    description: {
      ar: "مستوحى من ملابس الشارع العالمية والرياضية الفاخرة. تيشيرت أسود مع خطوط منحنية جانبية بلون أبيض ناصع تعطي مظهراً ديناميكياً فريداً.",
      en: "Dynamic streetwear silhouette constructed with curved white contrast panel inserts along the flanks and shoulders, with micro-embroidered center badge.",
    },
    material: {
      ar: "100% قطن ممشوط مريح (240 GSM)",
      en: "100% Combed Cotton Jersey (240 GSM)",
    },
    fit: {
      ar: "قصة مريحة وعريضة (Relaxed Fit)",
      en: "Relaxed Streetwear Fit",
    },
    care_instructions: {
      ar: "غسيل بدرجة حرارة 30° مئوية، يفضل تجفيفه على علاقة",
      en: "Machine wash at 30°C. Hang dry to maintain shape.",
    },
    price: 195,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: { ar: "أسود مع أبيض", en: "Black / White Contrast" }, hex: "#0F0F10" },
    ],
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=900&q=80",
    ],
    stock: 11,
    badges: ["New Arrival"],
    rating: 4.88,
    review_count: 19,
    is_active: true,
  },
  {
    id: "prod-6",
    slug: "italian-tailored-pleated-chino-trousers",
    sku: "ENZ-TRS-001",
    category_id: "cat-trousers",
    name: {
      ar: "بنطال تشينو إيطالي فاخر بكسرات أمامية",
      en: "Italian Pleated Tailored Chino Trousers",
    },
    description: {
      ar: "بنطال كلاسيكي عصري مزود بكسرات مزدوجة تمنح راحة استثنائية عند الجلوس والحركة، مع خصر قابل للتعديل وثنية سفلية أنيقة (Turn-up hem).",
      en: "Refined Italian-style smart casual trousers with double forward pleats, extended tab waistband, side adjusters, and a clean tapered cropped ankle.",
    },
    material: {
      ar: "قطن تويل إيطالي فاخر مع لمسة مطاطية خفيفة (98% قطن / 2% ليكرا)",
      en: "98% Premium Italian Cotton Twill, 2% Lycra",
    },
    fit: {
      ar: "قصة مريحة عند الفخذ وضيقة عند الكاحل (Relaxed Tapered)",
      en: "Relaxed Tapered Crop",
    },
    care_instructions: {
      ar: "غسيل جاف أو غسيل يدوي مع كوي بالبخار",
      en: "Machine wash cold or dry clean. Steam iron for sharp pleats.",
    },
    price: 290,
    sizes: ["30", "32", "34", "36", "38"],
    colors: [
      { name: { ar: "بيج كريمي عاجي", en: "Ivory Cream" }, hex: "#EBE5D8" },
      { name: { ar: "أسود داكن", en: "Midnight Black" }, hex: "#141414" },
      { name: { ar: "زيتي خاكي", en: "Olive Khaki" }, hex: "#4B5320" },
    ],
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80",
    ],
    stock: 16,
    badges: ["Bestseller"],
    rating: 4.97,
    review_count: 45,
    is_active: true,
  },
  {
    id: "prod-7",
    slug: "monochrome-french-terry-training-set",
    sku: "ENZ-SET-001",
    category_id: "cat-training",
    name: {
      ar: "طقم ترينينج فاخر من قماش الفرنش تيري الثقيل",
      en: "Monochrome French Terry Luxury Training Set",
    },
    description: {
      ar: "طقم رياضي متكامل مكون من كنزة أنيقة وبنطال مريح محاك من قطن الفرنش تيري عالي الكثافة (420 GSM) مع أطراف مضلعة وأربطة معدنية مخصصة.",
      en: "Complete two-piece luxury active set crafted from ultra-dense 420GSM French terry. Includes relaxed drop-shoulder crew sweater and matching tapered sweatpants.",
    },
    material: {
      ar: "100% قطن فرنش تيري ثقيل فائق النعومة (420 GSM)",
      en: "100% Heavyweight French Terry Cotton (420 GSM)",
    },
    fit: {
      ar: "قصة واسعة مريحة (Oversized Lounge Fit)",
      en: "Oversized Lounge Fit",
    },
    care_instructions: {
      ar: "غسيل بارد 30°، يرجى عدم استخدام النشافة الآلية",
      en: "Machine wash cold. Do not tumble dry. Iron on low heat.",
    },
    price: 380,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: { ar: "رمادي فحمي", en: "Charcoal Heather" }, hex: "#2A2A2E" },
      { name: { ar: "بيج ترابي ناعم", en: "Earthy Taupe" }, hex: "#A89F91" },
    ],
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&q=80",
    ],
    stock: 7,
    badges: ["Limited Edition", "New Arrival"],
    rating: 5.0,
    review_count: 31,
    is_active: true,
  },
  {
    id: "prod-8",
    slug: "tailored-smart-black-trouser",
    sku: "ENZ-TRS-002",
    category_id: "cat-trousers",
    name: {
      ar: "بنطال أسود رسمي بقصة ضيقة عند الكاحل",
      en: "Modern Tailored Ankle-Crop Black Trousers",
    },
    description: {
      ar: "البنطال الأساسي في خزانة كل رجل. يتناسق بسهولة مع البولو والحذاء الرياضي لإطلالة سريعة وعصرية تناسب بيئة العمل والمناسبات المسائية.",
      en: "The cornerstone of the modern smart-casual wardrobe. Pairs seamlessly with polos and clean sneakers for an effortless day-to-night transition.",
    },
    material: {
      ar: "صوف خفيف ممزوج مع البوليستر المطاط (65% بولي / 33% فيسكوز / 2% سباندكس)",
      en: "65% Poly, 33% Viscose, 2% Spandex Crease-Resistant Blend",
    },
    fit: {
      ar: "قصة ضيقة مستقيمة (Slim Straight)",
      en: "Slim Straight Tailored Fit",
    },
    care_instructions: {
      ar: "غسيل لطيف بماء بارد أو غسيل جاف",
      en: "Machine wash cold gentle. Line dry.",
    },
    price: 280,
    sizes: ["30", "32", "34", "36", "38"],
    colors: [
      { name: { ar: "أسود فحمي", en: "Jet Black" }, hex: "#0E0E0E" },
      { name: { ar: "كحلي داكن", en: "Deep Navy" }, hex: "#151B29" },
    ],
    images: [
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80",
    ],
    stock: 22,
    badges: ["New Arrival"],
    rating: 4.89,
    review_count: 27,
    is_active: true,
  },
];
