import { Brand, Category, Collection, Product } from '@/types';

export const MOCK_BRANDS: Brand[] = [
  {
    id: 'brand-f1-ferrari',
    name: 'Scuderia Ferrari F1',
    slug: 'scuderia-ferrari-f1',
    description: 'Official Scuderia Ferrari Formula 1 racing apparel & teamwear.',
    isActive: true,
  },
  {
    id: 'brand-f1-redbull',
    name: 'Oracle Red Bull Racing',
    slug: 'oracle-red-bull-racing',
    description: 'Championship Formula 1 team apparel & collector jerseys.',
    isActive: true,
  },
  {
    id: 'brand-music-travis',
    name: 'Cactus Jack Merch',
    slug: 'cactus-jack-merch',
    description: 'Official tour and album limited apparel drops.',
    isActive: true,
  },
  {
    id: 'brand-music-weeknd',
    name: 'XO Records',
    slug: 'xo-records',
    description: 'After Hours & Stadium Tour official merchandise.',
    isActive: true,
  },
  {
    id: 'brand-football-real',
    name: 'Real Madrid Official',
    slug: 'real-madrid-official',
    description: 'Authentic UEFA Champions League jerseys & club jackets.',
    isActive: true,
  },
  {
    id: 'brand-football-arsenal',
    name: 'Arsenal FC',
    slug: 'arsenal-fc',
    description: 'Official Gunners matchday kits and retro streetwear editions.',
    isActive: true,
  },
  {
    id: 'brand-collect-kaws',
    name: 'KAWS Collectibles',
    slug: 'kaws-collectibles',
    description: 'Limited edition vinyl sculptures and art collectibles.',
    isActive: true,
  },
  {
    id: 'brand-collect-bearbrick',
    name: 'Medicom Toy BE@RBRICK',
    slug: 'medicom-toy-bearbrick',
    description: '400% & 1000% collectible art figures.',
    isActive: true,
  },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-f1', name: 'Formula 1 Apparel', slug: 'formula-1' },
  { id: 'cat-music', name: 'Artist & Concert Merch', slug: 'music-merch' },
  { id: 'cat-football', name: 'Football Kits & Jackets', slug: 'football-kits' },
  { id: 'cat-collectibles', name: 'Art Toys & Collectibles', slug: 'collectibles' },
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col-f1-gp-2026',
    title: 'F1 Grand Prix 2026 Drops',
    slug: 'f1-grand-prix-2026',
    subtitle: 'Trackside Authentic Gear',
    description: 'Official driver hoodies, technical polos, and championship caps with integrated Authenticity TAGs.',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    itemCount: 8,
  },
  {
    id: 'col-world-tour',
    title: 'Stadium Tour Essentials',
    slug: 'stadium-tour-essentials',
    subtitle: 'Limited Artist Merch',
    description: 'Heavyweight vintage wash tees and boxy hoodies from sold-out arena tours worldwide.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    itemCount: 6,
  },
  {
    id: 'col-retro-kits',
    title: 'Heritage Club Match Kits',
    slug: 'heritage-club-match-kits',
    subtitle: 'Player Issue Authentic',
    description: 'Engineered authentic player jerseys and pre-match anthems verified for licensing royalty.',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    itemCount: 5,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  // --- Formula 1 ---
  {
    id: 'prod-f1-ferrari-jacket',
    brandId: 'brand-f1-ferrari',
    categoryId: 'cat-f1',
    name: 'Scuderia Ferrari 2026 Team Softshell Jacket',
    slug: 'scuderia-ferrari-2026-team-softshell-jacket',
    description:
      'Official Scuderia Ferrari team softshell jacket crafted with water-resistant stretch polyester, featuring high-density team and sponsor logos across the chest and arms. Equipped with an internal encrypted Authenticity TAG embedded at the hem.',
    status: 'active',
    isPreorder: false,
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-07-01T10:00:00Z',
    tagline: 'Trackside Championship Edition',
    featuredImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    minPrice: 6490,
    maxPrice: 6490,
    variants: [
      { id: 'var-ferrari-j-m', productId: 'prod-f1-ferrari-jacket', sku: 'FER-J26-M', size: 'M', color: 'Rosso Corsa Red', price: 6490, stockQuantity: 12, lowStockThreshold: 3, isActive: true },
      { id: 'var-ferrari-j-l', productId: 'prod-f1-ferrari-jacket', sku: 'FER-J26-L', size: 'L', color: 'Rosso Corsa Red', price: 6490, stockQuantity: 5, lowStockThreshold: 3, isActive: true },
      { id: 'var-ferrari-j-xl', productId: 'prod-f1-ferrari-jacket', sku: 'FER-J26-XL', size: 'XL', color: 'Rosso Corsa Red', price: 6490, stockQuantity: 2, lowStockThreshold: 3, isActive: true },
    ],
    images: [
      { id: 'img-ferrari-1', productId: 'prod-f1-ferrari-jacket', storagePath: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80', altText: 'Ferrari Softshell Jacket Front', sortOrder: 1 },
    ],
  },
  {
    id: 'prod-f1-redbull-hoodie',
    brandId: 'brand-f1-redbull',
    categoryId: 'cat-f1',
    name: 'Oracle Red Bull Racing Driver Graphic Hoodie',
    slug: 'oracle-red-bull-racing-driver-graphic-hoodie',
    description:
      'Heavyweight 450GSM French Terry cotton pullover hoodie featuring bold Oracle Red Bull Racing driver number artwork and reflective night-track detailing. Every piece carries an official royalty tracking Authenticity TAG.',
    status: 'active',
    isPreorder: false,
    createdAt: '2026-06-05T10:00:00Z',
    updatedAt: '2026-07-02T10:00:00Z',
    tagline: '450GSM Heavyweight French Terry',
    featuredImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    minPrice: 4290,
    maxPrice: 4290,
    variants: [
      { id: 'var-rbr-h-m', productId: 'prod-f1-redbull-hoodie', sku: 'RBR-H26-M', size: 'M', color: 'Night Navy', price: 4290, stockQuantity: 18, lowStockThreshold: 5, isActive: true },
      { id: 'var-rbr-h-l', productId: 'prod-f1-redbull-hoodie', sku: 'RBR-H26-L', size: 'L', color: 'Night Navy', price: 4290, stockQuantity: 8, lowStockThreshold: 5, isActive: true },
    ],
    images: [
      { id: 'img-rbr-1', productId: 'prod-f1-redbull-hoodie', storagePath: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80', altText: 'Red Bull Racing Hoodie Front', sortOrder: 1 },
    ],
  },
  {
    id: 'prod-f1-ferrari-cap',
    brandId: 'brand-f1-ferrari',
    categoryId: 'cat-f1',
    name: 'Scuderia Ferrari Leclerc Special Edition Cap',
    slug: 'scuderia-ferrari-leclerc-special-edition-cap',
    description:
      'Monaco Grand Prix Special Edition cap worn by Charles Leclerc. Features embroidered driver number 16 under the brim and laser-perforated side ventilation panels.',
    status: 'active',
    isPreorder: false,
    createdAt: '2026-06-10T10:00:00Z',
    updatedAt: '2026-07-03T10:00:00Z',
    tagline: 'Monaco GP Driver Issue',
    featuredImage: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    minPrice: 1890,
    maxPrice: 1890,
    variants: [
      { id: 'var-ferrari-c-one', productId: 'prod-f1-ferrari-cap', sku: 'FER-C26-ONE', size: 'One Size', color: 'Monaco White / Red', price: 1890, stockQuantity: 24, lowStockThreshold: 5, isActive: true },
    ],
    images: [
      { id: 'img-ferrari-c1', productId: 'prod-f1-ferrari-cap', storagePath: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80', altText: 'Leclerc Special Edition Cap', sortOrder: 1 },
    ],
  },

  // --- Music & Concert Merch ---
  {
    id: 'prod-music-utopia-tee',
    brandId: 'brand-music-travis',
    categoryId: 'cat-music',
    name: 'Utopia Circus Maximus Vintage Wash Boxy Tee',
    slug: 'utopia-circus-maximus-vintage-wash-boxy-tee',
    description:
      'Custom garment-dyed heavyweight vintage tee from the Circus Maximus World Tour. Features cracked screen-printed front artwork and puff-printed back tour dates.',
    status: 'active',
    isPreorder: false,
    createdAt: '2026-06-02T10:00:00Z',
    updatedAt: '2026-07-04T10:00:00Z',
    tagline: 'Official World Tour Drop',
    featuredImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    minPrice: 2890,
    maxPrice: 2890,
    variants: [
      { id: 'var-utopia-m', productId: 'prod-music-utopia-tee', sku: 'UTP-TEE-M', size: 'M', color: 'Charcoal Vintage Wash', price: 2890, stockQuantity: 15, lowStockThreshold: 4, isActive: true },
      { id: 'var-utopia-l', productId: 'prod-music-utopia-tee', sku: 'UTP-TEE-L', size: 'L', color: 'Charcoal Vintage Wash', price: 2890, stockQuantity: 1, lowStockThreshold: 4, isActive: true },
    ],
    images: [
      { id: 'img-utopia-1', productId: 'prod-music-utopia-tee', storagePath: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', altText: 'Utopia Circus Maximus Tee Front', sortOrder: 1 },
    ],
  },
  {
    id: 'prod-music-afterhours-hoodie',
    brandId: 'brand-music-weeknd',
    categoryId: 'cat-music',
    name: 'After Hours Til Dawn Stadium Tour Hoodie',
    slug: 'after-hours-til-dawn-stadium-tour-hoodie',
    description:
      'Official XO Records chrome logo oversized pullover hoodie. Custom 500GSM brushed fleece interior with metallic foil chest emblem and tour locations on the reverse.',
    status: 'active',
    isPreorder: false,
    createdAt: '2026-06-04T10:00:00Z',
    updatedAt: '2026-07-05T10:00:00Z',
    tagline: '500GSM Brushed Fleece',
    featuredImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
    minPrice: 4590,
    maxPrice: 4590,
    variants: [
      { id: 'var-xo-h-l', productId: 'prod-music-afterhours-hoodie', sku: 'XO-H26-L', size: 'L', color: 'Midnight Black', price: 4590, stockQuantity: 10, lowStockThreshold: 3, isActive: true },
      { id: 'var-xo-h-xl', productId: 'prod-music-afterhours-hoodie', sku: 'XO-H26-XL', size: 'XL', color: 'Midnight Black', price: 4590, stockQuantity: 0, lowStockThreshold: 3, isActive: true },
    ],
    images: [
      { id: 'img-xo-1', productId: 'prod-music-afterhours-hoodie', storagePath: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80', altText: 'After Hours Hoodie Front', sortOrder: 1 },
    ],
  },
  {
    id: 'prod-music-travis-cap',
    brandId: 'brand-music-travis',
    categoryId: 'cat-music',
    name: 'Cactus Jack x Fragment Design Heritage Trucker',
    slug: 'cactus-jack-fragment-design-heritage-trucker',
    description:
      'Collaborative 5-panel foam trucker hat featuring puff embroidery and distress treatment along the brim.',
    status: 'active',
    isPreorder: false,
    createdAt: '2026-06-08T10:00:00Z',
    updatedAt: '2026-07-06T10:00:00Z',
    tagline: 'Collab Exclusive Drop',
    featuredImage: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
    minPrice: 2190,
    maxPrice: 2190,
    variants: [
      { id: 'var-cj-hat-1', productId: 'prod-music-travis-cap', sku: 'CJ-FRG-HAT', size: 'One Size', color: 'Mocha / Royal Blue', price: 2190, stockQuantity: 14, lowStockThreshold: 4, isActive: true },
    ],
    images: [
      { id: 'img-cj-h1', productId: 'prod-music-travis-cap', storagePath: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80', altText: 'Cactus Jack Trucker Cap', sortOrder: 1 },
    ],
  },

  // --- Football Kits & Jackets ---
  {
    id: 'prod-football-real-home',
    brandId: 'brand-football-real',
    categoryId: 'cat-football',
    name: 'Real Madrid 26/27 Authentic Home Player Jersey',
    slug: 'real-madrid-26-27-authentic-home-player-jersey',
    description:
      'Official matchday HEAT.RDY engineered jersey worn by players at Estadio Santiago Bernabéu. Slim athletic cut with gold heat-applied crest and verified licensing Authenticity TAG.',
    status: 'active',
    isPreorder: false,
    createdAt: '2026-06-03T10:00:00Z',
    updatedAt: '2026-07-07T10:00:00Z',
    tagline: 'Official Player Issue Kit',
    featuredImage: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80',
    minPrice: 4890,
    maxPrice: 4890,
    variants: [
      { id: 'var-rma-j-m', productId: 'prod-football-real-home', sku: 'RMA-H26-M', size: 'M', color: 'Royal White / Gold', price: 4890, stockQuantity: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var-rma-j-l', productId: 'prod-football-real-home', sku: 'RMA-H26-L', size: 'L', color: 'Royal White / Gold', price: 4890, stockQuantity: 11, lowStockThreshold: 5, isActive: true },
    ],
    images: [
      { id: 'img-rma-1', productId: 'prod-football-real-home', storagePath: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80', altText: 'Real Madrid Jersey Front', sortOrder: 1 },
    ],
  },
  {
    id: 'prod-football-arsenal-anthem',
    brandId: 'brand-football-arsenal',
    categoryId: 'cat-football',
    name: 'Arsenal FC Pre-Match Anthem Track Jacket',
    slug: 'arsenal-fc-pre-match-anthem-track-jacket',
    description:
      'Retro-inspired woven track jacket celebrating 1990s Gunners heritage. Features full-zip stand collar, embroidered cannon crest, and ribbed cuffs.',
    status: 'active',
    isPreorder: false,
    createdAt: '2026-06-06T10:00:00Z',
    updatedAt: '2026-07-08T10:00:00Z',
    tagline: 'Heritage Woven Edition',
    featuredImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    minPrice: 3890,
    maxPrice: 3890,
    variants: [
      { id: 'var-ars-j-m', productId: 'prod-football-arsenal-anthem', sku: 'ARS-JKT-M', size: 'M', color: 'Highbury Red / Navy', price: 3890, stockQuantity: 9, lowStockThreshold: 3, isActive: true },
      { id: 'var-ars-j-l', productId: 'prod-football-arsenal-anthem', sku: 'ARS-JKT-L', size: 'L', color: 'Highbury Red / Navy', price: 3890, stockQuantity: 4, lowStockThreshold: 3, isActive: true },
    ],
    images: [
      { id: 'img-ars-1', productId: 'prod-football-arsenal-anthem', storagePath: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80', altText: 'Arsenal Anthem Jacket', sortOrder: 1 },
    ],
  },
  {
    id: 'prod-football-real-retro',
    brandId: 'brand-football-real',
    categoryId: 'cat-football',
    name: 'Real Madrid 1998 Legends Heritage Kit (Pre-Order)',
    slug: 'real-madrid-1998-legends-heritage-kit',
    description:
      'Remastered 1998 Champions League centenary edition jersey crafted from heavyweight textured polyester with flocked vintage crest.',
    status: 'active',
    isPreorder: true,
    preorderReleaseAt: '2026-08-15T00:00:00Z',
    createdAt: '2026-06-11T10:00:00Z',
    updatedAt: '2026-07-09T10:00:00Z',
    tagline: 'Pre-Order Drop • Releases Aug 15',
    featuredImage: 'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=800&q=80',
    minPrice: 3990,
    maxPrice: 3990,
    variants: [
      { id: 'var-rma-retro-m', productId: 'prod-football-real-retro', sku: 'RMA-98-M', size: 'M', color: 'Vintage White', price: 3990, stockQuantity: 50, lowStockThreshold: 10, isActive: true },
      { id: 'var-rma-retro-l', productId: 'prod-football-real-retro', sku: 'RMA-98-L', size: 'L', color: 'Vintage White', price: 3990, stockQuantity: 50, lowStockThreshold: 10, isActive: true },
    ],
    images: [
      { id: 'img-rma-retro1', productId: 'prod-football-real-retro', storagePath: 'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=800&q=80', altText: 'Real Madrid 1998 Retro Kit', sortOrder: 1 },
    ],
  },

  // --- Collectibles & Art Toys ---
  {
    id: 'prod-collect-kaws-companion',
    brandId: 'brand-collect-kaws',
    categoryId: 'cat-collectibles',
    name: 'KAWS Companion Flayed Open Edition Figure (Grey)',
    slug: 'kaws-companion-flayed-open-edition-figure-grey',
    description:
      '11-inch vinyl collectible figure by KAWS. Features anatomical dissection detailing on one half with signature X-ed out eyes. Comes sealed with verified serial number and Authenticity TAG.',
    status: 'active',
    isPreorder: false,
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-07-10T10:00:00Z',
    tagline: 'Verified Authentic Art Sculpture',
    featuredImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    minPrice: 14900,
    maxPrice: 14900,
    variants: [
      { id: 'var-kaws-comp-grey', productId: 'prod-collect-kaws-companion', sku: 'KAWS-FLAY-GRY', size: '11 Inch', color: 'Monotone Grey', price: 14900, stockQuantity: 3, lowStockThreshold: 2, isActive: true },
    ],
    images: [
      { id: 'img-kaws-1', productId: 'prod-collect-kaws-companion', storagePath: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80', altText: 'KAWS Companion Figure', sortOrder: 1 },
    ],
  },
  {
    id: 'prod-collect-bearbrick-daftpunk',
    brandId: 'brand-collect-bearbrick',
    categoryId: 'cat-collectibles',
    name: 'Medicom Toy BE@RBRICK Daft Punk Discovery Ver. 400%',
    slug: 'medicom-toy-bearbrick-daft-punk-discovery-400',
    description:
      'Set of two 400% BE@RBRICK figures celebrating Guy-Manuel and Thomas Bangalter in Discovery era metallic helmets and suits.',
    status: 'active',
    isPreorder: false,
    createdAt: '2026-06-07T10:00:00Z',
    updatedAt: '2026-07-11T10:00:00Z',
    tagline: 'Collector 400% Twin Pack',
    featuredImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    minPrice: 19500,
    maxPrice: 19500,
    variants: [
      { id: 'var-bb-daft-400', productId: 'prod-collect-bearbrick-daftpunk', sku: 'BB-DP-400', size: '400% (28cm)', color: 'Gold / Chrome', price: 19500, stockQuantity: 2, lowStockThreshold: 2, isActive: true },
    ],
    images: [
      { id: 'img-bb-1', productId: 'prod-collect-bearbrick-daftpunk', storagePath: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80', altText: 'Daft Punk BE@RBRICK 400%', sortOrder: 1 },
    ],
  },
  {
    id: 'prod-collect-kaws-holiday',
    brandId: 'brand-collect-bearbrick',
    categoryId: 'cat-collectibles',
    name: 'KAWS:HOLIDAY Fuji Vinyl Figure (Pink Edition)',
    slug: 'kaws-holiday-fuji-vinyl-figure-pink-edition',
    description:
      'Limited edition 8.5-inch plush and vinyl figure commemorating the KAWS:HOLIDAY Japan exhibition near Mount Fuji.',
    status: 'active',
    isPreorder: false,
    createdAt: '2026-06-09T10:00:00Z',
    updatedAt: '2026-07-12T10:00:00Z',
    tagline: 'Exhibition Exclusive',
    featuredImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    minPrice: 11900,
    maxPrice: 11900,
    variants: [
      { id: 'var-kaws-fuji-p', productId: 'prod-collect-kaws-holiday', sku: 'KAWS-FUJI-PNK', size: '8.5 Inch', color: 'Sakura Pink', price: 11900, stockQuantity: 4, lowStockThreshold: 2, isActive: true },
    ],
    images: [
      { id: 'img-kaws-f1', productId: 'prod-collect-kaws-holiday', storagePath: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80', altText: 'KAWS Holiday Fuji Figure', sortOrder: 1 },
    ],
  },
];

// Helper functions for mock data query
export function getAllProducts(): Product[] {
  return MOCK_PRODUCTS.map((prod) => ({
    ...prod,
    brand: MOCK_BRANDS.find((b) => b.id === prod.brandId),
    category: MOCK_CATEGORIES.find((c) => c.id === prod.categoryId),
  }));
}

export function getProductBySlug(slug: string): Product | undefined {
  const prod = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!prod) return undefined;
  return {
    ...prod,
    brand: MOCK_BRANDS.find((b) => b.id === prod.brandId),
    category: MOCK_CATEGORIES.find((c) => c.id === prod.categoryId),
  };
}
