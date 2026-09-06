// Dhanam Organics - Product Catalog Data
// SOURCE OF TRUTH: Exactly the 8 authentic products provided in public/images/products/
// When new products are added, simply append them to this array or update via the PHP backend.

export const CATEGORIES = [
  {
    "id": "all",
    "name": "All Products",
    "tamilName": "அனைத்து பொருட்கள்",
    "count": 8
  },
  {
    "id": "heritage-podis",
    "name": "Heritage Podis",
    "tamilName": "பாரம்பரிய பொடிகள்",
    "count": 5
  },
  {
    "id": "herbal-wellness",
    "name": "Herbal & Wellness",
    "tamilName": "மூலிகை நலம்",
    "count": 3
  }
];

export const PRODUCTS = [
  {
    "id": 1,
    "name": "இட்லி பொடி • Traditional Idli Podi",
    "tamilName": "இட்லி பொடி (வீடு தயாரிப்பு)",
    "englishName": "Traditional Idli Podi (Home Style Gunpowder)",
    "category": "Heritage Podis",
    "categorySlug": "heritage-podis",
    "price": 130,
    "originalPrice": 150,
    "weight": "200g",
    "inStock": true,
    "isFeatured": true,
    "badge": "Bestseller",
    "image": "./images/products/idli-podi.png",
    "description": "Authentic traditional homemade idli gunpowder podi crafted with roasted lentils, red chillies, and sesame. Perfect accompaniment for hot idlis and crispy dosas.",
    "tamildescription": "இட்லி எளிதில் செரிமானமாகும் ஆரோக்கியமான காலை உணவு.அரிசி மற்றும் உளுந்தால் தயாரிக்கப்படுவதால் புரதச்சத்து கிடைக்கிறது.ஆவியில் வேகவைப்பதால் எண்ணெய் குறைவாக இருக்கும்.சாம்பார், சட்னி அல்லது பொடியுடன் சுவையாக சாப்பிடலாம்.",
    "benefits": [
      "Traditional home recipe",
      "Stone-roasted lentils",
      "No artificial preservatives"
    ],
    "usage": "Mix 1-2 spoons with cold-pressed gingelly/sesame oil or pure ghee, and dip your warm idlis and dosas."
  },
  {
    "id": 2,
    "name": "பருப்பு பொடி • Paruppu Podi",
    "tamilName": "பருப்பு பொடி (சாதத்திற்கு)",
    "englishName": "Dal Podi for Hot Steamed Rice",
    "category": "Heritage Podis",
    "categorySlug": "heritage-podis",
    "price": 140,
    "originalPrice": 160,
    "weight": "200g",
    "inStock": true,
    "isFeatured": true,
    "badge": "Traditional Favorite",
    "image": "./images/products/paruppu-podi.png",
    "description": "Rich, aromatic roasted dal podi prepared specifically for hot steamed rice. High protein comfort food crafted in traditional Tamil style.",
    "tamildescription": "பருப்பு பொடி சுவையான பாரம்பரிய தென்னிந்திய உணவுப் பொடி.துவரம் பருப்பு, கடலைப் பருப்பு மற்றும் மிளகாய் சேர்த்து தயாரிக்கப்படுகிறது.சாதத்துடன் நெய் அல்லது நல்லெண்ணெய் சேர்த்து சாப்பிடலாம்.சுவையுடன் புரதச்சத்தும் நிறைந்த ஆரோக்கியமான உணவாகும்.",
    "benefits": [
      "High natural plant protein",
      "Easy to digest",
      "Comfort food for all ages"
    ],
    "ingredients": "Roasted gram dal, toor dal, cumin, red chillies, garlic, black pepper, sea salt, asafoetida.",
    "usage": "Serve with piping hot steamed rice and a generous dollop of pure desi ghee."
  },
  {
    "id": 3,
    "name": "கருவேப்பிலை பொடி • Curry Leaf Podi",
    "tamilName": "கருவேப்பிலை பொடி",
    "englishName": "Curry Leaves Rice & Idli Podi",
    "category": "Heritage Podis",
    "categorySlug": "heritage-podis",
    "price": 140,
    "originalPrice": 160,
    "weight": "200g",
    "inStock": true,
    "isFeatured": true,
    "badge": "Nutrient Rich",
    "image": "./images/products/karuveppilai-podi.png",
    "description":"Curry leaves provide many nutrients essential for the body.They aid in digestion and support stomach health.They help maintain the health of hair and skin.Being rich in antioxidants, they are beneficial for overall health.",
    "tamildescription": "கருவேப்பிலை உடலுக்கு தேவையான பல ஊட்டச்சத்துக்களை வழங்குகிறது.சரிமானத்தை மேம்படுத்தவும் வயிற்று ஆரோக்கியத்திற்கும் உதவுகிறது.முடி மற்றும் சரும ஆரோக்கியத்தை பராமரிக்க உதவுகிறது.ஆன்டிஆக்ஸிடன்ட்கள் நிறைந்ததால் உடல் நலத்திற்கு பயனுள்ளதாகும்.",
    
    "benefits": [
      "Natural source of iron",
      "Promotes hair strength and vitality",
      "Supports healthy digestion"
    ],
    "ingredients": "Fresh organic curry leaves, urad dal, chana dal, pepper, cumin, dry chillies, sea salt.",
    "usage": "Mix with hot rice and sesame oil or enjoy as a healthy side for tiffin."
  },
  {
    "id": 4,
    "name": "எள்ளு இட்லி பொடி • Ellu Idli Podi",
    "tamilName": "எள்ளு இட்லி பொடி",
    "englishName": "Black Sesame Idli Podi",
    "category": "Heritage Podis",
    "categorySlug": "heritage-podis",
    "price": 150,
    "originalPrice": 175,
    "weight": "200g",
    "inStock": true,
    "isFeatured": false,
    "badge": "Calcium Rich",
    "image": "./images/products/ellu-idli-podi.png",
    "description": "Handpicked black sesame seeds dry-roasted and blended with farm lentils. Imparts a deep, nutty roasted aroma and provides essential minerals.",
    "tamildescription": "எள் பொடி கால்சியம் மற்றும் இரும்புச்சத்து நிறைந்த சத்தான உணவாகும்.எலும்புகள் மற்றும் பற்களின் ஆரோக்கியத்தை ஆதரிக்க உதவுகிறது.நல்ல கொழுப்புகள் மற்றும் புரதச்சத்தையும் வழங்குகிறது.சாதம், இட்லி மற்றும் தோசையுடன் சுவையாக சேர்த்து சாப்பிடலாம்.",
  "benefits": [
      "Natural source of calcium & zinc",
      "Heart-healthy essential fats",
      "Traditional warming food"
    ],
    "ingredients": "Black sesame seeds, urad dal, red chillies, curry leaves, asafoetida, rock salt.",
    "usage": "Pair with soft idlis, dosas, or sprinkle over warm ragi and millet rotis."
  },
  {
    "id": 5,
    "name": "பிரண்டை பொடி • Pirandai Podi",
    "tamilName": "பிரண்டை பொடி",
    "englishName": "Pirandai Bone & Joint Wellness Podi",
    "category": "Herbal & Wellness",
    "categorySlug": "herbal-wellness",
    "price": 160,
    "originalPrice": 185,
    "weight": "200g",
    "inStock": true,
    "isFeatured": true,
    "badge": "Heritage Herbal",
    "image": "./images/products/pirandai-podi.png",
    "description": "Ancient Siddha herbal formulation using fresh Cissus quadrangularis (Pirandai/Veldt Grape), traditionally valued for supporting bone density and gut health.",
    "tamildescription": "பிரண்டை பொடி செரிமானத்தை மேம்படுத்த உதவும் பாரம்பரிய உணவுப் பொடியாகும்.உடல் எலும்புகளின் ஆரோக்கியத்தை ஆதரிக்க உதவுகிறது.பசியை அதிகரிக்கவும் வயிற்று அசௌகரியத்தை குறைக்கவும் பாரம்பரியமாக பயன்படுத்தப்படுகிறது.",
    "benefits": [
      "Supports bone strength & joint health",
      "Soothes digestion & acidity",
      "Traditional healing herb"
    ],"usage": "Take 1 spoon with hot steamed rice and gingelly oil twice a week."
  },
  {
    "id": 6,
    "name": "முடவாட்டுக்கால் சூப் பொடி • Mudavattukal Soup Podi",
    "tamilName": "முடவாட்டுக்கால் சூப் பொடி",
    "englishName": "Mudavattukal Herbal Joint Health Soup",
    "category": "Herbal & Wellness",
    "categorySlug": "herbal-wellness",
    "price": 180,
    "originalPrice": 210,
    "weight": "200g",
    "inStock": true,
    "isFeatured": true,
    "badge": "Medicinal Specialty",
    "image": "./images/products/mudavattukal-soup-podi.png",
    "description": "Rare medicinal soup powder made from traditional Mudavattukal (medicinal hill fern rhizome) combined with invigorating herbs and warming spices.",
    "tamildescrpiption": "முடவாட்டுக்கால் சூப் பொடி பாரம்பரியமாக உடல் ஆரோக்கியத்திற்கு பயன்படுத்தப்படுகிறது.மூட்டு மற்றும் எலும்புகளின் ஆரோக்கியத்தை ஆதரிக்க உதவுகிறது.உடலுக்கு தேவையான ஊட்டச்சத்துகளை வழங்கி புத்துணர்ச்சி அளிக்க உதவுகிறது",
    "benefits": [
      "Traditional relief for knee and joint pain",
      "Warming and restorative soup",
      "Strengthens mobility"
    ],
    "usage": "Boil 1 teaspoon in 200ml water for 5 minutes, strain and sip as a soothing warm herbal soup."
  },
  {
    "id": 7,
    "name": "முருங்கை இட்லி பொடி • Murungai Idli Podi",
    "tamilName": "முருங்கை இட்லி பொடி",
    "englishName": "Moringa Leaf Idli Podi",
    "category": "Herbal & Wellness",
    "categorySlug": "herbal-wellness",
    "price": 150,
    "originalPrice": 175,
    "weight": "200g",
    "inStock": true,
    "isFeatured": false,
    "badge": "Superfood",
    "image": "./images/products/murungai-idli-podi.png",
    "description": "Naturally dried organic drumstick leaves (Moringa) slow-roasted with select pulses and spices. A daily superfood boost for the whole family.",
    "tamildescription": "முருங்கைக்கீரை பொடி பல்வேறு ஊட்டச்சத்துக்கள் நிறைந்த ஆரோக்கியமான உணவாகும்.இது இரும்புச்சத்து, கால்சியம் மற்றும் ஆன்டிஆக்ஸிடன்ட்களை வழங்குகிறது.உடல் நோய் எதிர்ப்பு சக்தியை ஆதரிக்க உதவுகிறது.சாதம், இட்லி மற்றும் தோசையுடன் சுவையாக சேர்த்து சாப்பிடலாம்.",
    "benefits": [
      "Abundant in antioxidants & vitamin A",
      "Enhances daily vitality",
      "Mild, appetizing flavor"
    ],
    "usage": "Stir into hot rice with ghee, or use as an accompaniment with breakfast idli and dosa."
  },
  {
    "id": 8,
    "name": "இன்ஸ்டன்ட் ரசம் பொடி • Instant Rasam Podi",
    "tamilName": "இன்ஸ்டன்ட் ரசம் பொடி",
    "englishName": "Instant Authentic Rasam Podi",
    "category": "Heritage Podis",
    "categorySlug": "heritage-podis",
    "price": 140,
    "originalPrice": 160,
    "weight": "200g",
    "inStock": true,
    "isFeatured": false,
    "badge": "Easy Kitchen",
    "image": "./images/products/instant-rasam-podi.png",
    "description": "Handcrafted traditional Tamil Nadu rasam powder with crushed coriander seeds, black pepper, and cumin. Prepare restaurant-grade comforting rasam in just 5 minutes.",
    "tamildescription": "ரசம் செரிமானத்தை மேம்படுத்த உதவும் சுவையான பாரம்பரிய உணவு.மிளகு மற்றும் சீரகம் சேர்வதால் உடலுக்கு புத்துணர்ச்சி அளிக்கிறது.சளி மற்றும் தொண்டை அசௌகரியத்தின் போது இதமாக இருக்கும்.திரவச்சத்து மற்றும் சில முக்கிய ஊட்டச்சத்துக்களை வழங்குகிறது.",
    "benefits": [
      "Quick & easy home preparation",
      "Aids digestion after meals",
      "No artificial flavor enhancers"
    ],
    "usage": "Add 1-2 spoons to boiled tomato-tamarind water, simmer for 3 minutes and temper with mustard and curry leaves."
  }
];

export default PRODUCTS;
