import mongoose from 'mongoose';
import { ENV } from '../config/env.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';

const INITIAL_CATEGORIES = [
  {
    name: 'Designer Kurtis',
    slug: 'kurtis',
    tag: 'Daily & Festive',
    description: 'From breathable cottons to opulent silk kurtis, tailored for festive gatherings and everyday grace.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    displayOrder: 1,
  },
  {
    name: 'Sarees',
    slug: 'sarees',
    tag: 'Heritage Drapes',
    description: 'Banarasi silks, tissue drapes, organzas, and georgettes woven with grace and regal heritage borders.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    displayOrder: 2,
  },
  {
    name: 'Lehengas',
    slug: 'lehengas',
    tag: 'Bridal & Grand',
    description: 'Stunning flared lehengas embellished with zardozi, sequins, and resham threadwork made for unforgettable moments.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    displayOrder: 3,
  },
  {
    name: 'Salwar Suits',
    slug: 'salwar-suits',
    tag: 'Classic Sets',
    description: 'Anarkalis, straight-cut suits, and palazzo sets tailored with fine dupattas and flattering silhouettes.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    displayOrder: 4,
  },
  {
    name: 'Designer Blouses',
    slug: 'blouses',
    tag: 'Bespoke Cuts',
    description: 'Maggam work, intricate back necklines, padded cups, and prince-cut finishes customized to your saree palette.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    displayOrder: 5,
  },
  {
    name: 'Festive & Party Wear',
    slug: 'festive-wear',
    tag: 'Celebrations',
    description: 'Fusion draped gowns, peplum sharara sets, and festive coordinate ensembles that radiate celebration sparkle.',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80',
    displayOrder: 6,
  },
];

const INITIAL_PRODUCTS = [
  // ── DESIGNER KURTIS ──────────────────────────────────────────────────────────
  {
    name: 'Embroidered Chanderi Kurti Set',
    slug: 'embroidered-chanderi-kurti-set',
    categorySlug: 'kurtis',
    categoryName: 'Designer Kurtis',
    description: 'Fine resham threadwork detailing with side slits, breathable Chanderi silk fabric, and organza cuff styling. Perfect for intimate family ceremonies and festive gatherings.',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 285000, // ₹2,850
    discountedPriceInPaise: 249900, // ₹2,499
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Maroon', 'Mustard Gold', 'Teal'],
    sku: 'PFD-KRT-001',
    inventoryQuantity: 25,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },
  {
    name: 'Angrakha Tussar Silk Kurti',
    slug: 'angrakha-tussar-silk-kurti',
    categorySlug: 'kurtis',
    categoryName: 'Designer Kurtis',
    description: 'Traditional overlap wrap design with handcrafted latkan tassels, hand-printed ethnic motifs, and comfortable cotton lining. A timeless silhouette for festive outings.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 345000, // ₹3,450
    discountedPriceInPaise: null,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Ochre Yellow', 'Rust Orange', 'Forest Green'],
    sku: 'PFD-KRT-002',
    inventoryQuantity: 22,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },
  {
    name: 'Printed Cotton A-Line Kurti',
    slug: 'printed-cotton-a-line-kurti',
    categorySlug: 'kurtis',
    categoryName: 'Designer Kurtis',
    description: 'Breathable premium cotton with block-print geometric motifs, round neck, and 3/4-length sleeves. An everyday essential that pairs beautifully with palazzos or leggings.',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 169900, // ₹1,699
    discountedPriceInPaise: 149900, // ₹1,499
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Indigo Blue', 'Earthy Red', 'Sage Green'],
    sku: 'PFD-KRT-003',
    inventoryQuantity: 40,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },
  {
    name: 'Jacket-Style Embroidered Kurti Set',
    slug: 'jacket-style-embroidered-kurti-set',
    categorySlug: 'kurtis',
    categoryName: 'Designer Kurtis',
    description: 'Sleeveless inner kurti with a detachable floral-embroidered jacket overlay. Comes with wide-leg palazzos and a matching dupatta for a complete three-piece ensemble.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 459000, // ₹4,590
    discountedPriceInPaise: 399000, // ₹3,990
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Royal Blue', 'Wine Red', 'Ivory & Gold'],
    sku: 'PFD-KRT-004',
    inventoryQuantity: 16,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },

  // ── SAREES ───────────────────────────────────────────────────────────────────
  {
    name: 'Royal Burgundy Banarasi Saree',
    slug: 'royal-burgundy-banarasi-saree',
    categorySlug: 'sarees',
    categoryName: 'Sarees',
    description: 'Woven zari jaal motifs across rich katan silk, royal heavy pallu, and an unstitched contrast designer blouse piece. Handcrafted heritage drape.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 690000, // ₹6,900
    discountedPriceInPaise: null,
    sizes: ['Free Size (5.5m + 0.8m Blouse)'],
    colors: ['Deep Burgundy', 'Wine Red', 'Emerald Green'],
    sku: 'PFD-SAR-005',
    inventoryQuantity: 18,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },
  {
    name: 'Organza Floral Embroidery Saree',
    slug: 'organza-floral-embroidery-saree',
    categorySlug: 'sarees',
    categoryName: 'Sarees',
    description: 'Sheer organza base with delicate 3D floral embroidery, satin lining for comfort, and a contrast silk blouse piece. A bestseller for receptions and engagements.',
    images: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 895000, // ₹8,950
    discountedPriceInPaise: 799000, // ₹7,990
    sizes: ['Free Size (5.5m + 0.8m Blouse)'],
    colors: ['Powder Pink', 'Mint & Gold', 'Sky Blue'],
    sku: 'PFD-SAR-006',
    inventoryQuantity: 14,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },
  {
    name: 'Soft Linen Handwoven Saree',
    slug: 'soft-linen-handwoven-saree',
    categorySlug: 'sarees',
    categoryName: 'Sarees',
    description: 'Artisanal handloom linen saree with zari accents along the border and pallu, paired with an unstitched block-print cotton blouse piece. Comfortable enough for daily wear.',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 349000, // ₹3,490
    discountedPriceInPaise: null,
    sizes: ['Free Size (5.5m + 0.8m Blouse)'],
    colors: ['Natural Ivory', 'Steel Grey', 'Terracotta'],
    sku: 'PFD-SAR-007',
    inventoryQuantity: 25,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },

  // ── LEHENGAS ─────────────────────────────────────────────────────────────────
  {
    name: 'Floral Georgette Flared Lehenga',
    slug: 'floral-georgette-flared-lehenga',
    categorySlug: 'lehengas',
    categoryName: 'Lehengas',
    description: 'Subtle mirror accents, 16-kali multi-paneled flare, soft inner lining, and scalloped border organza dupatta. Lightweight grandeur for sangeet and weddings.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 1450000, // ₹14,500
    discountedPriceInPaise: 1290000, // ₹12,900
    sizes: ['Custom Fitting', 'S', 'M', 'L'],
    colors: ['Pastel Rose', 'Dusty Lavender', 'Ivory Gold'],
    sku: 'PFD-LHG-008',
    inventoryQuantity: 10,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },
  {
    name: 'Velvet Zardozi Bridal Lehenga',
    slug: 'velvet-zardozi-bridal-lehenga',
    categorySlug: 'lehengas',
    categoryName: 'Lehengas',
    description: 'Luxurious velvet skirt adorned with heavy zardozi and sequin work. Comes with a matching heavily-embroidered blouse and a sheer embellished dupatta with tassel edging.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 2990000, // ₹29,900
    discountedPriceInPaise: null,
    sizes: ['Custom Fitting Only'],
    colors: ['Bridal Red', 'Royal Maroon', 'Midnight Blue'],
    sku: 'PFD-LHG-009',
    inventoryQuantity: 5,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },
  {
    name: 'Printed Semi-Stitched Lehenga Set',
    slug: 'printed-semi-stitched-lehenga-set',
    categorySlug: 'lehengas',
    categoryName: 'Lehengas',
    description: 'Vibrant digital-print semi-stitched cotton lehenga with gota-patti detailing on the border. A festive choice for Navratri, Diwali, and mehendi functions.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 599000, // ₹5,990
    discountedPriceInPaise: 499000, // ₹4,990
    sizes: ['S', 'M', 'L', 'XL', 'Custom'],
    colors: ['Saffron & Pink', 'Turquoise & Gold', 'Pink & Parrot Green'],
    sku: 'PFD-LHG-010',
    inventoryQuantity: 20,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },

  // ── SALWAR SUITS ─────────────────────────────────────────────────────────────
  {
    name: 'Raw Silk Anarkali Suit Set',
    slug: 'raw-silk-anarkali-suit-set',
    categorySlug: 'salwar-suits',
    categoryName: 'Salwar Suits',
    description: 'Full-length flare Anarkali kurta crafted in rich raw silk, paired with matching churidar and a hand-woven Banarasi dupatta.',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 540000, // ₹5,400
    discountedPriceInPaise: null,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Royal Blue', 'Rani Pink', 'Ivory'],
    sku: 'PFD-SLW-011',
    inventoryQuantity: 20,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },
  {
    name: 'Pastel Zari Palazzo Suit',
    slug: 'pastel-zari-palazzo-suit',
    categorySlug: 'salwar-suits',
    categoryName: 'Salwar Suits',
    description: 'Straight hemline with zari cut-work sleeves, comfortable wide-leg flared palazzos, and matching lightweight chiffon dupatta.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 420000, // ₹4,200
    discountedPriceInPaise: null,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Mint Green', 'Powder Blue', 'Peach'],
    sku: 'PFD-SLW-012',
    inventoryQuantity: 18,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },
  {
    name: 'Chikankari Lucknowi Suit Set',
    slug: 'chikankari-lucknowi-suit-set',
    categorySlug: 'salwar-suits',
    categoryName: 'Salwar Suits',
    description: 'Authentic Lucknow chikankari hand embroidery on soft georgette fabric. Straight kurta with subtle shadow-work detailing, matching santoon pants, and organza dupatta.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 479000, // ₹4,790
    discountedPriceInPaise: 429000, // ₹4,290
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Off-White', 'Soft Pink', 'Sky Blue'],
    sku: 'PFD-SLW-013',
    inventoryQuantity: 24,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },

  // ── DESIGNER BLOUSES ─────────────────────────────────────────────────────────
  {
    name: 'Aari Work Bridal Silk Blouse',
    slug: 'aari-work-bridal-silk-blouse',
    categorySlug: 'blouses',
    categoryName: 'Designer Blouses',
    description: 'Intricate Maggam & Aari beadwork neckline, elbow-length sleeves with zardozi borders, padded cups, and custom deep back tying dori.',
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 320000, // ₹3,200
    discountedPriceInPaise: null,
    sizes: ['32', '34', '36', '38', '40', '42'],
    colors: ['Burgundy', 'Crimson Red', 'Golden Yellow'],
    sku: 'PFD-BLS-014',
    inventoryQuantity: 30,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },
  {
    name: 'Mirror & Sequin Designer Blouse',
    slug: 'mirror-sequin-designer-blouse',
    categorySlug: 'blouses',
    categoryName: 'Designer Blouses',
    description: 'Densely embellished front and back yoke with hand-set mirror work and tiny sequins. Features a boat neckline and stylish open back with layered lace edging.',
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 249000, // ₹2,490
    discountedPriceInPaise: 219000, // ₹2,190
    sizes: ['32', '34', '36', '38', '40'],
    colors: ['Rose Gold', 'Gunmetal Silver', 'Antique Copper'],
    sku: 'PFD-BLS-015',
    inventoryQuantity: 35,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },
  {
    name: 'Padded Prince-Cut Silk Blouse',
    slug: 'padded-prince-cut-silk-blouse',
    categorySlug: 'blouses',
    categoryName: 'Designer Blouses',
    description: 'Structured prince-cut silhouette in pure dupion silk with a sweetheart neckline and three-quarter sleeves. Fully padded and lined for a sleek, sculpted fit.',
    images: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 189000, // ₹1,890
    discountedPriceInPaise: null,
    sizes: ['32', '34', '36', '38', '40', '42', 'Custom'],
    colors: ['Ivory', 'Blush Pink', 'Bottle Green'],
    sku: 'PFD-BLS-016',
    inventoryQuantity: 28,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },

  // ── FESTIVE & PARTY WEAR ──────────────────────────────────────────────────────
  {
    name: 'Sequinned Sharara Party Ensemble',
    slug: 'sequinned-sharara-party-ensemble',
    categorySlug: 'festive-wear',
    categoryName: 'Festive & Party Wear',
    description: 'Short flared peplum kurti paired with tier-layered georgette sharara bottoms, accented with delicate self-sequin embroidery.',
    images: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 495000, // ₹4,950
    discountedPriceInPaise: 445000, // ₹4,450
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Emerald Green', 'Wine Purple', 'Champagne'],
    sku: 'PFD-FST-017',
    inventoryQuantity: 15,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },
  {
    name: 'Indo-Western Crop Top & Flared Skirt',
    slug: 'indo-western-crop-top-flared-skirt',
    categorySlug: 'festive-wear',
    categoryName: 'Festive & Party Wear',
    description: 'Trendy bralette-style crop top with gota-patti lace trim paired with a high-waist floor-length flared skirt. A fusion look perfect for cocktail parties and sangeet nights.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 399000, // ₹3,990
    discountedPriceInPaise: 349000, // ₹3,490
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Hot Pink', 'Electric Blue', 'Gold & Black'],
    sku: 'PFD-FST-018',
    inventoryQuantity: 18,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },
  {
    name: 'Embroidered Velvet Cape Dress',
    slug: 'embroidered-velvet-cape-dress',
    categorySlug: 'festive-wear',
    categoryName: 'Festive & Party Wear',
    description: 'Floor-length flared gown with an attached embellished cape overlay. Heavy embroidered bodice, mermaid flare at the hem, and concealed back zipper for a sleek finish.',
    images: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 1190000, // ₹11,900
    discountedPriceInPaise: 999000, // ₹9,990
    sizes: ['S', 'M', 'L', 'Custom Fitting'],
    colors: ['Midnight Black & Gold', 'Deep Teal', 'Sangria'],
    sku: 'PFD-FST-019',
    inventoryQuantity: 8,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },
  {
    name: 'Diwali Special Banarasi Coord Set',
    slug: 'diwali-special-banarasi-coord-set',
    categorySlug: 'festive-wear',
    categoryName: 'Festive & Party Wear',
    description: 'Coordinated festive set featuring a Banarasi brocade short kurta, matching high-waist straight pants, and a sheer silk dupatta with handwoven pallu. Celebrate in style.',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    ],
    priceInPaise: 675000, // ₹6,750
    discountedPriceInPaise: 599000, // ₹5,990
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Festive Red & Gold', 'Ivory & Silver', 'Purple & Gold'],
    sku: 'PFD-FST-020',
    inventoryQuantity: 20,
    availabilityStatus: 'in_stock',
    isDemonstrationData: true,
  },
];

async function seedDatabase() {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(ENV.MONGODB_URI);
    console.log('[Seed] Connected successfully.');

    console.log('[Seed] Seeding categories...');
    const categoryMap = {};

    for (const catData of INITIAL_CATEGORIES) {
      const category = await Category.findOneAndUpdate(
        { slug: catData.slug },
        catData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      categoryMap[catData.slug] = category._id;
      console.log(`  ✔ Category: ${catData.name}`);
    }

    console.log('[Seed] Seeding demonstration products...');
    for (const prodData of INITIAL_PRODUCTS) {
      const categoryId = categoryMap[prodData.categorySlug];
      const productPayload = {
        ...prodData,
        category: categoryId,
      };
      delete productPayload.categorySlug;

      await Product.findOneAndUpdate(
        { sku: prodData.sku },
        productPayload,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`  ✔ Product: ${prodData.name} (${prodData.sku})`);
    }

    console.log('\n==================================================');
    console.log(' ✨ Catalogue seeded successfully!');
    console.log(` 📦 Categories: ${INITIAL_CATEGORIES.length}`);
    console.log(` 👗 Products:   ${INITIAL_PRODUCTS.length}`);
    console.log('==================================================\n');
  } catch (error) {
    console.error('[Seed] Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] Disconnected cleanly.');
  }
}

seedDatabase();
