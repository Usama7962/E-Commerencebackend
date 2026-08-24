import dns from "node:dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const details = {
  "Ashwagandha Extract Capsules": {
    ingredients: "Ashwagandha Root Extract (KSM-66) 600mg, Black Pepper Extract (BioPerine) 5mg, Vegetable Capsule Shell (HPMC)",
    usage: "Take 1-2 capsules daily with warm water or milk after meals. Best taken in the evening for stress relief and better sleep.",
    benefits: "Reduces stress & anxiety\nImproves sleep quality\nBoosts energy & stamina\nSupports immune system\nEnhances memory & focus",
  },
  "Turmeric Curcumin Tablets": {
    ingredients: "Turmeric Extract (95% Curcuminoids) 500mg, Black Pepper Extract 10mg, Ginger Root Powder 50mg, Cellulose Filler",
    usage: "Take 1 tablet twice daily with meals. Can be taken with warm water or milk for better absorption.",
    benefits: "Powerful anti-inflammatory\nStrong antioxidant protection\nSupports joint health\nAids digestion\nBoosts brain function",
  },
  "Moringa Leaf Powder": {
    ingredients: "100% Organic Moringa Oleifera Leaf Powder - No additives, fillers, or preservatives",
    usage: "Mix 1 teaspoon (3g) in water, smoothie, or juice daily. Can also be sprinkled on food. Start with half teaspoon.",
    benefits: "Rich in Vitamin A, C & Iron\nBoosts energy naturally\nSupports healthy blood sugar\nStrengthens bones\nImproves skin health",
  },
  "Spirulina Tablets Organic": {
    ingredients: "100% Pure Spirulina (Arthrospira platensis) 500mg per tablet - No binders or fillers",
    usage: "Take 4-6 tablets daily with water, preferably before meals. Start with 2 tablets and gradually increase.",
    benefits: "Complete protein source (60%)\nRich in Iron & B12\nPowerful detoxifier\nBoosts immunity\nIncreases stamina",
  },
  "Giloy Immunity Booster": {
    ingredients: "Giloy Stem Extract (Tinospora cordifolia) 500mg, Tulsi Extract 100mg, Amla Extract 50mg",
    usage: "Take 1-2 capsules daily with lukewarm water after breakfast. Continue for 2-3 months for best results.",
    benefits: "Strengthens immunity\nPurifies blood naturally\nReduces fever\nHelps manage diabetes\nImproves digestion",
  },
  "Lavender Essential Oil": {
    ingredients: "100% Pure Steam-Distilled Lavandula Angustifolia (Lavender) Flower Oil - Therapeutic Grade",
    usage: "Aromatherapy: Add 3-5 drops to diffuser. Topical: Mix 2-3 drops with carrier oil and apply. Bath: Add 5-8 drops to warm bath water.",
    benefits: "Promotes deep relaxation\nImproves sleep quality\nRelieves headaches\nCalms anxiety & stress\nSoothes skin irritation",
  },
  "Tea Tree Oil Pure": {
    ingredients: "100% Pure Melaleuca Alternifolia (Tea Tree) Leaf Oil - Steam Distilled, Undiluted",
    usage: "Skin: Dilute 1-2 drops in carrier oil, apply to affected area. Scalp: Add 5 drops to shampoo. Never ingest.",
    benefits: "Natural antibacterial\nFights acne & pimples\nAntifungal properties\nClears dandruff\nHeals minor wounds",
  },
  "Eucalyptus Oil Therapeutic": {
    ingredients: "100% Pure Eucalyptus Globulus Leaf Oil - Cold Pressed, Therapeutic Grade",
    usage: "Steam inhalation: Add 3-4 drops to hot water and inhale. Chest rub: Mix with coconut oil and apply. Diffuser: 4-5 drops.",
    benefits: "Clears nasal congestion\nRelieves cold & cough\nReduces sinus pressure\nMuscle pain relief\nNatural insect repellent",
  },
  "Peppermint Oil Organic": {
    ingredients: "100% Certified Organic Mentha Piperita (Peppermint) Oil - Steam Distilled",
    usage: "Headache: Apply diluted to temples. Digestion: 1 drop in warm water (food grade only). Energy: Inhale directly or diffuse.",
    benefits: "Relieves headaches fast\nAids digestion\nBoosts mental alertness\nCools sore muscles\nFreshens breath naturally",
  },
  "Rosemary Essential Oil": {
    ingredients: "100% Pure Rosmarinus Officinalis (Rosemary) Leaf Oil - Steam Distilled, Therapeutic Grade",
    usage: "Hair: Mix 5 drops with coconut oil, massage into scalp 30 min before wash. Focus: Diffuse 3-4 drops while studying/working.",
    benefits: "Stimulates hair growth\nImproves memory & focus\nRelieves muscle pain\nBoosts circulation\nReduces stress hormones",
  },
  "Green Tea Matcha Premium": {
    ingredients: "100% Japanese Ceremonial Grade Matcha Green Tea Powder (Camellia sinensis) - Stone Ground",
    usage: "Whisk 1-2g (half tsp) in 70ml hot water (80°C, not boiling). Whisk in W motion until frothy. Can add to milk for latte.",
    benefits: "10x antioxidants of regular green tea\nCalm alertness (L-Theanine)\nBoosts metabolism\nEnhances focus\nDetoxifies naturally",
  },
  "Chamomile Relaxation Tea": {
    ingredients: "Organic Chamomile Flowers (Matricaria chamomilla) - Whole Dried Flowers, No Stems",
    usage: "Steep 1 tea bag in hot water (90°C) for 5-7 minutes. Best enjoyed 30 minutes before bedtime. Add honey if desired.",
    benefits: "Promotes restful sleep\nCalms nervous system\nRelieves stomach cramps\nReduces inflammation\nSoothes sore throat",
  },
  "Ginger Lemon Detox Tea": {
    ingredients: "Dried Ginger Root 40%, Lemongrass 25%, Lemon Peel 20%, Turmeric Root 10%, Black Pepper 5%",
    usage: "Steep 1 bag in boiling water for 5-8 minutes. Drink warm, preferably in the morning on empty stomach. 2-3 cups daily.",
    benefits: "Aids digestion\nBoosts immunity\nDetoxifies liver\nReduces bloating\nWarms body & improves circulation",
  },
  "Tulsi Holy Basil Tea": {
    ingredients: "Organic Krishna Tulsi Leaves 50%, Rama Tulsi Leaves 30%, Vana Tulsi Leaves 20% - No Caffeine",
    usage: "Steep 1 bag in hot water for 5 minutes. Drink 2-3 cups daily. Can be consumed hot or iced.",
    benefits: "Adaptogenic stress relief\nBoosts respiratory health\nStrengthens immunity\nBalances blood sugar\nRich in antioxidants",
  },
  "Hibiscus Herbal Infusion": {
    ingredients: "Dried Hibiscus Flowers (Hibiscus sabdariffa) 90%, Rose Petals 10% - Caffeine Free",
    usage: "Steep 1 bag in hot water for 7-10 minutes for full flavor. Enjoy hot or cold. Add honey or mint for taste.",
    benefits: "Supports heart health\nMay lower blood pressure\nRich in Vitamin C\nAids weight management\nBeautiful skin from within",
  },
  "Aloe Vera Gel Pure": {
    ingredients: "99% Pure Aloe Barbadensis Leaf Gel, Vitamin E, Xanthan Gum (natural thickener) - No Parabens, No Color",
    usage: "Apply generous layer on clean skin/hair. Leave 15-20 min, rinse. For daily moisturizing, apply thin layer and leave on.",
    benefits: "Deep hydration for skin\nHeals sunburn fast\nReduces acne scars\nConditions hair naturally\nAnti-aging properties",
  },
  "Neem Face Wash Herbal": {
    ingredients: "Neem Extract 15%, Tea Tree Oil 5%, Aloe Vera Gel 20%, Turmeric Extract 3%, Natural Surfactants, Purified Water",
    usage: "Wet face, take small amount, massage gently in circular motion for 1-2 minutes. Rinse with water. Use twice daily.",
    benefits: "Deep pore cleansing\nControls excess oil\nPrevents acne breakouts\nNatural antibacterial\nGentle on sensitive skin",
  },
  "Rose Hip Seed Oil": {
    ingredients: "100% Cold-Pressed Rosa Canina (Rosehip) Seed Oil - Unrefined, No Additives, Rich in Vitamin A & C",
    usage: "Apply 2-3 drops on clean, damp face at night. Pat gently, don't rub. Can mix with moisturizer. Use daily for best results.",
    benefits: "Reduces fine lines & wrinkles\nFades dark spots & scars\nBrightens complexion\nDeep nourishment\nEvens skin tone",
  },
  "Coconut Oil Virgin Cold-Pressed": {
    ingredients: "100% Organic Virgin Coconut Oil (Cocos nucifera) - Cold-Pressed, Unrefined, No Chemicals",
    usage: "Skin: Apply directly as moisturizer. Hair: Warm and massage into scalp, leave 1-2 hours. Cooking: Use as healthy cooking oil.",
    benefits: "Deep skin moisturizer\nStrengthens hair roots\nNatural antifungal\nHealthy cooking alternative\nOil pulling for oral health",
  },
  "Shea Butter Raw Unrefined": {
    ingredients: "100% Raw Unrefined Shea Butter (Vitellaria paradoxa) - Grade A, Cold-Pressed from West Africa",
    usage: "Warm small amount between palms until melted. Apply on dry skin, stretch marks, or lips. Use after shower for best absorption.",
    benefits: "Intense dry skin relief\nReduces stretch marks\nNatural SPF protection\nHeals cracked heels\nAnti-inflammatory for eczema",
  },
  "Manuka Honey UMF 15+": {
    ingredients: "100% Pure New Zealand Manuka Honey - UMF 15+ Certified, MGO 514+, Raw & Unpasteurized",
    usage: "Take 1 teaspoon directly or in warm water (not hot) 1-3 times daily. For wounds: Apply thin layer on clean wound, cover with bandage.",
    benefits: "Powerful antibacterial\nHeals sore throat\nBoosts immunity\nAids wound healing\nSupports gut health",
  },
  "Black Seed Oil (Kalonji)": {
    ingredients: "100% Pure Cold-Pressed Nigella Sativa (Black Seed/Kalonji) Oil - Unfiltered, No Preservatives",
    usage: "Take 1 teaspoon daily on empty stomach, or mix with honey. Topical: Apply on skin/hair. Not for children under 5.",
    benefits: "Boosts overall immunity\nAnti-inflammatory\nSupports respiratory health\nPromotes hair growth\nAids weight management",
  },
  "Chia Seeds Organic": {
    ingredients: "100% Organic Chia Seeds (Salvia hispanica) - Raw, Non-GMO, No Additives or Preservatives",
    usage: "Soak 2 tbsp in water/milk for 15 min (chia pudding). Add to smoothies, yogurt, or salads. Daily intake: 1-2 tablespoons.",
    benefits: "Rich in Omega-3 fatty acids\nHigh fiber for digestion\nComplete plant protein\nSupports weight loss\nStrengthens bones (calcium)",
  },
  "Apple Cider Vinegar Raw": {
    ingredients: "Organic Apple Cider Vinegar with 'The Mother' (Acetobacter culture) - Raw, Unfiltered, Unpasteurized, 5% Acidity",
    usage: "Mix 1-2 tbsp in a glass of warm water. Drink before meals. For hair: Dilute 1:3 with water as final rinse after shampoo.",
    benefits: "Aids digestion & gut health\nSupports weight management\nBalances blood sugar\nNatural detoxifier\nShiny healthy hair",
  },
  "Flaxseed Golden Whole": {
    ingredients: "100% Whole Golden Flaxseeds (Linum usitatissimum) - Raw, Non-GMO, Rich in Omega-3 ALA",
    usage: "Grind 1-2 tbsp fresh daily (for best nutrition). Add to smoothies, oatmeal, or roti dough. Store ground flax in fridge.",
    benefits: "Highest plant source of Omega-3\nRich in lignans (antioxidant)\nSupports heart health\nAids digestion (fiber)\nMay reduce cholesterol",
  },
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log("Connected to DB");

    for (const [name, data] of Object.entries(details)) {
      const result = await Product.findOneAndUpdate(
        { name },
        { $set: data },
        { new: true }
      );
      if (result) {
        console.log(`Updated: ${name}`);
      } else {
        console.log(`Not found: ${name}`);
      }
    }

    console.log("All products updated with details!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

run();
