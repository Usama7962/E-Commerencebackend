import dns from "node:dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const products = [
  // Herbal Supplements
  {
    name: "Ashwagandha Extract Capsules",
    description: "Pure organic Ashwagandha root extract. Reduces stress, boosts energy and improves sleep quality. 60 capsules per bottle.",
    price: 1200,
    category: "Herbal Supplements",
    imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80",
  },
  {
    name: "Turmeric Curcumin Tablets",
    description: "High-potency turmeric with black pepper for maximum absorption. Anti-inflammatory and antioxidant support. 90 tablets.",
    price: 950,
    category: "Herbal Supplements",
    imageUrl: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=500&q=80",
  },
  {
    name: "Moringa Leaf Powder",
    description: "100% organic Moringa oleifera leaf powder. Rich in vitamins, minerals and amino acids. Superfood for daily nutrition.",
    price: 750,
    category: "Herbal Supplements",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
  },
  {
    name: "Spirulina Tablets Organic",
    description: "Pure blue-green algae spirulina tablets. Complete protein source, iron-rich, boosts immunity naturally.",
    price: 1100,
    category: "Herbal Supplements",
    imageUrl: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=500&q=80",
  },
  {
    name: "Giloy Immunity Booster",
    description: "Traditional Giloy (Tinospora cordifolia) extract capsules. Strengthens immunity and purifies blood naturally.",
    price: 680,
    category: "Herbal Supplements",
    imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80",
  },

  // Essential Oils
  {
    name: "Lavender Essential Oil",
    description: "Pure steam-distilled lavender oil. Promotes relaxation, reduces anxiety and improves sleep. 30ml glass bottle.",
    price: 850,
    category: "Essential Oils",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80",
  },
  {
    name: "Tea Tree Oil Pure",
    description: "100% natural tea tree oil with antibacterial properties. Great for skin care, acne treatment, and aromatherapy. 15ml.",
    price: 650,
    category: "Essential Oils",
    imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80",
  },
  {
    name: "Eucalyptus Oil Therapeutic",
    description: "Premium eucalyptus essential oil for respiratory relief. Clears sinuses, relieves congestion. Cold-pressed, 30ml.",
    price: 550,
    category: "Essential Oils",
    imageUrl: "https://images.unsplash.com/photo-1547793548-7a0f7b150f0a?w=500&q=80",
  },
  {
    name: "Peppermint Oil Organic",
    description: "Certified organic peppermint oil. Relieves headaches, aids digestion, energizes mind and body. 20ml dropper bottle.",
    price: 720,
    category: "Essential Oils",
    imageUrl: "https://images.unsplash.com/photo-1583958917784-9a3a0c5ad1d0?w=500&q=80",
  },
  {
    name: "Rosemary Essential Oil",
    description: "Pure rosemary oil for hair growth and mental clarity. Stimulates circulation and reduces stress. 30ml.",
    price: 780,
    category: "Essential Oils",
    imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&q=80",
  },

  // Herbal Teas
  {
    name: "Green Tea Matcha Premium",
    description: "Ceremonial grade Japanese matcha powder. High in antioxidants, boosts metabolism, enhances focus. 100g tin.",
    price: 1500,
    category: "Herbal Teas",
    imageUrl: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&q=80",
  },
  {
    name: "Chamomile Relaxation Tea",
    description: "Organic chamomile flower tea bags. Calms nerves, promotes sleep, soothes digestion. Box of 25 bags.",
    price: 450,
    category: "Herbal Teas",
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&q=80",
  },
  {
    name: "Hibiscus Herbal Infusion",
    description: "Ruby-red hibiscus tea rich in vitamin C. Supports heart health, lowers blood pressure. 20 pyramid bags.",
    price: 520,
    category: "Herbal Teas",
    imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&q=80",
  },
  {
    name: "Ginger Lemon Detox Tea",
    description: "Warming ginger and lemon blend for detoxification. Aids digestion, boosts immunity. 30 tea bags.",
    price: 580,
    category: "Herbal Teas",
    imageUrl: "https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=500&q=80",
  },
  {
    name: "Tulsi Holy Basil Tea",
    description: "Sacred Tulsi (Holy Basil) leaves tea. Adaptogenic herb that reduces stress and boosts respiratory health. 25 bags.",
    price: 420,
    category: "Herbal Teas",
    imageUrl: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&q=80",
  },

  // Natural Skincare
  {
    name: "Aloe Vera Gel Pure",
    description: "99% pure aloe vera gel for skin and hair. Moisturizes, heals sunburn, reduces acne scars. 200ml pump bottle.",
    price: 480,
    category: "Natural Skincare",
    imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80",
  },
  {
    name: "Neem Face Wash Herbal",
    description: "Neem and tea tree face wash for acne-prone skin. Deep cleanses pores, controls oil, prevents breakouts. 150ml.",
    price: 350,
    category: "Natural Skincare",
    imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80",
  },
  {
    name: "Rose Hip Seed Oil",
    description: "Cold-pressed rosehip oil for face. Reduces wrinkles, brightens skin, fades dark spots. 30ml glass dropper.",
    price: 1200,
    category: "Natural Skincare",
    imageUrl: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=500&q=80",
  },
  {
    name: "Coconut Oil Virgin Cold-Pressed",
    description: "Extra virgin coconut oil for skin, hair and cooking. Deep moisturizing, anti-fungal properties. 500ml jar.",
    price: 890,
    category: "Natural Skincare",
    imageUrl: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&q=80",
  },
  {
    name: "Shea Butter Raw Unrefined",
    description: "African shea butter for deep skin nourishment. Heals dry skin, reduces stretch marks, natural SPF. 250g.",
    price: 950,
    category: "Natural Skincare",
    imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80",
  },

  // Honey & Superfoods
  {
    name: "Manuka Honey UMF 15+",
    description: "Premium New Zealand Manuka honey with antibacterial properties. Heals throat, boosts immunity. 250g jar.",
    price: 3500,
    category: "Honey & Superfoods",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80",
  },
  {
    name: "Black Seed Oil (Kalonji)",
    description: "Pure cold-pressed black seed oil. Known as 'cure for everything except death'. Boosts immunity. 250ml.",
    price: 1400,
    category: "Honey & Superfoods",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7f28db3d3265?w=500&q=80",
  },
  {
    name: "Chia Seeds Organic",
    description: "Premium organic chia seeds rich in omega-3, fiber and protein. Supports weight loss and heart health. 500g pack.",
    price: 850,
    category: "Honey & Superfoods",
    imageUrl: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=500&q=80",
  },
  {
    name: "Apple Cider Vinegar Raw",
    description: "Unfiltered apple cider vinegar with 'the mother'. Aids digestion, weight management, detox. 500ml glass bottle.",
    price: 680,
    category: "Honey & Superfoods",
    imageUrl: "https://images.unsplash.com/photo-1473348328597-17980880c8d0?w=500&q=80",
  },
  {
    name: "Flaxseed Golden Whole",
    description: "Whole golden flaxseeds rich in omega-3 and lignans. Supports heart health and digestion. 400g resealable pack.",
    price: 420,
    category: "Honey & Superfoods",
    imageUrl: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=500&q=80",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    await Product.insertMany(products);
    console.log(`Inserted ${products.length} herbal products successfully!`);

    await mongoose.disconnect();
    console.log("Done! Database seeded with herbal products.");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

seed();
