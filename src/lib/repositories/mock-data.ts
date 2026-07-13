import { Brand, Category, Collection, Product } from '@/types';

// Helper to generate clean, minimalist studio product SVG data URL
function createStudioImage(title: string, subtitle: string = '', theme: 'dark' | 'light' = 'light'): string {
  const bg = theme === 'dark' ? '#18181b' : '#f4f4f5';
  const fg = theme === 'dark' ? '#ffffff' : '#09090b';
  const subFg = theme === 'dark' ? '#a1a1aa' : '#71717a';
  const border = theme === 'dark' ? '#27272a' : '#e4e4e7';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <rect width="800" height="800" fill="${bg}"/>
    <rect x="40" y="40" width="720" height="720" rx="32" fill="none" stroke="${border}" stroke-width="2"/>
    <circle cx="400" cy="340" r="140" fill="${theme === 'dark' ? '#27272a' : '#e4e4e7'}" opacity="0.6"/>
    <!-- Stylized Apparel Silhouette -->
    <path d="M280 260 L330 220 L470 220 L520 260 L560 380 L480 390 L480 560 L320 560 L320 390 L240 380 Z" fill="${fg}" opacity="0.12"/>
    <text x="400" y="470" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" fill="${fg}" text-anchor="middle">${title}</text>
    ${subtitle ? `<text x="400" y="510" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="500" fill="${subFg}" text-anchor="middle">${subtitle}</text>` : ''}
    <text x="400" y="710" font-family="monospace" font-size="13" font-weight="600" fill="${subFg}" text-anchor="middle" letter-spacing="3">ALLTHINGSMERCH OFFICIAL</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

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
    description: 'Official driver polos, jackets, and championship caps with integrated Authenticity TAGs.',
    imageUrl: createStudioImage('F1 GRAND PRIX 2026', 'Trackside Authentic Gear', 'light'),
    itemCount: 8,
  },
  {
    id: 'col-world-tour',
    title: 'Stadium Tour Essentials',
    slug: 'stadium-tour-essentials',
    subtitle: 'Limited Artist Merch',
    description: 'Heavyweight vintage wash tees and boxy hoodies from sold-out arena tours worldwide.',
    imageUrl: createStudioImage('STADIUM TOUR ESSENTIALS', 'Limited Artist Merch', 'light'),
    itemCount: 6,
  },
  {
    id: 'col-retro-kits',
    title: 'Heritage Club Match Kits',
    slug: 'heritage-club-match-kits',
    subtitle: 'Player Issue Authentic',
    description: 'Engineered authentic player jerseys and pre-match anthems verified for licensing royalty.',
    imageUrl: createStudioImage('HERITAGE MATCH KITS', 'Player Issue Authentic', 'light'),
    itemCount: 5,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  // --- Formula 1 ---
  {
    id: 'prod-f1-redbull-polo',
    brandId: 'brand-f1-redbull',
    categoryId: 'cat-f1',
    name: 'Red Bull Racing 2026 Team Polo',
    slug: 'red-bull-racing-2026-team-polo',
    description:
      'Official Oracle Red Bull Racing team polo shirt engineered with breathable performance fabric, featuring championship team and sponsor branding across chest and sleeves. Integrated Authenticity TAG verification.',
    status: 'active',
    isPreorder: false,
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-07-01T10:00:00Z',
    tagline: 'Official Team Issue Polo',
    featuredImage: createStudioImage('RED BULL RACING POLO', '2026 Official Teamwear', 'light'),
    minPrice: 3990,
    maxPrice: 3990,
    variants: [
      { id: 'var-rbr-p-s', productId: 'prod-f1-redbull-polo', sku: 'RBR-POLO26-S', size: 'S', color: 'Night Navy', price: 3990, stockQuantity: 10, lowStockThreshold: 3, isActive: true },
      { id: 'var-rbr-p-m', productId: 'prod-f1-redbull-polo', sku: 'RBR-POLO26-M', size: 'M', color: 'Night Navy', price: 3990, stockQuantity: 15, lowStockThreshold: 3, isActive: true },
      { id: 'var-rbr-p-l', productId: 'prod-f1-redbull-polo', sku: 'RBR-POLO26-L', size: 'L', color: 'Night Navy', price: 3990, stockQuantity: 8, lowStockThreshold: 3, isActive: true },
    ],
    images: [
      { id: 'img-rbr-p1', productId: 'prod-f1-redbull-polo', storagePath: createStudioImage('RED BULL RACING POLO', 'Front View', 'light'), altText: 'Red Bull Racing Team Polo Front', sortOrder: 1 },
      { id: 'img-rbr-p2', productId: 'prod-f1-redbull-polo', storagePath: createStudioImage('RED BULL RACING POLO', 'Back View', 'light'), altText: 'Red Bull Racing Team Polo Back', sortOrder: 2 },
    ],
  },
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
    createdAt: '2026-06-02T10:00:00Z',
    updatedAt: '2026-07-01T10:00:00Z',
    tagline: 'Trackside Championship Edition',
    featuredImage: createStudioImage('SCUDERIA FERRARI JACKET', 'Softshell Team Edition', 'light'),
    minPrice: 6490,
    maxPrice: 6490,
    variants: [
      { id: 'var-ferrari-j-m', productId: 'prod-f1-ferrari-jacket', sku: 'FER-J26-M', size: 'M', color: 'Rosso Corsa Red', price: 6490, stockQuantity: 12, lowStockThreshold: 3, isActive: true },
      { id: 'var-ferrari-j-l', productId: 'prod-f1-ferrari-jacket', sku: 'FER-J26-L', size: 'L', color: 'Rosso Corsa Red', price: 6490, stockQuantity: 5, lowStockThreshold: 3, isActive: true },
      { id: 'var-ferrari-j-xl', productId: 'prod-f1-ferrari-jacket', sku: 'FER-J26-XL', size: 'XL', color: 'Rosso Corsa Red', price: 6490, stockQuantity: 2, lowStockThreshold: 3, isActive: true },
    ],
    images: [
      { id: 'img-ferrari-1', productId: 'prod-f1-ferrari-jacket', storagePath: createStudioImage('SCUDERIA FERRARI JACKET', 'Front View', 'light'), altText: 'Ferrari Softshell Jacket Front', sortOrder: 1 },
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
    featuredImage: createStudioImage('FERRARI LECLERC CAP', 'Special Edition #16', 'light'),
    minPrice: 1890,
    maxPrice: 1890,
    variants: [
      { id: 'var-ferrari-c-one', productId: 'prod-f1-ferrari-cap', sku: 'FER-C26-ONE', size: 'One Size', color: 'Monaco White / Red', price: 1890, stockQuantity: 24, lowStockThreshold: 5, isActive: true },
    ],
    images: [
      { id: 'img-ferrari-c1', productId: 'prod-f1-ferrari-cap', storagePath: createStudioImage('FERRARI LECLERC CAP', 'Front View', 'light'), altText: 'Leclerc Special Edition Cap', sortOrder: 1 },
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
    featuredImage: createStudioImage('UTOPIA CIRCUS MAXIMUS', 'Heavyweight Vintage Tee', 'light'),
    minPrice: 2890,
    maxPrice: 2890,
    variants: [
      { id: 'var-utopia-m', productId: 'prod-music-utopia-tee', sku: 'UTP-TEE-M', size: 'M', color: 'Charcoal Vintage Wash', price: 2890, stockQuantity: 15, lowStockThreshold: 4, isActive: true },
      { id: 'var-utopia-l', productId: 'prod-music-utopia-tee', sku: 'UTP-TEE-L', size: 'L', color: 'Charcoal Vintage Wash', price: 2890, stockQuantity: 1, lowStockThreshold: 4, isActive: true },
    ],
    images: [
      { id: 'img-utopia-1', productId: 'prod-music-utopia-tee', storagePath: createStudioImage('UTOPIA CIRCUS MAXIMUS', 'Front View', 'light'), altText: 'Utopia Circus Maximus Tee Front', sortOrder: 1 },
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
    featuredImage: createStudioImage('AFTER HOURS STADIUM HOODIE', 'XO Official Tour Drop', 'light'),
    minPrice: 4590,
    maxPrice: 4590,
    variants: [
      { id: 'var-xo-h-l', productId: 'prod-music-afterhours-hoodie', sku: 'XO-H26-L', size: 'L', color: 'Midnight Black', price: 4590, stockQuantity: 10, lowStockThreshold: 3, isActive: true },
      { id: 'var-xo-h-xl', productId: 'prod-music-afterhours-hoodie', sku: 'XO-H26-XL', size: 'XL', color: 'Midnight Black', price: 4590, stockQuantity: 0, lowStockThreshold: 3, isActive: true },
    ],
    images: [
      { id: 'img-xo-1', productId: 'prod-music-afterhours-hoodie', storagePath: createStudioImage('AFTER HOURS STADIUM HOODIE', 'Front View', 'light'), altText: 'After Hours Hoodie Front', sortOrder: 1 },
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
    featuredImage: createStudioImage('CACTUS JACK TRUCKER', 'Fragment Heritage Cap', 'light'),
    minPrice: 2190,
    maxPrice: 2190,
    variants: [
      { id: 'var-cj-hat-1', productId: 'prod-music-travis-cap', sku: 'CJ-FRG-HAT', size: 'One Size', color: 'Mocha / Royal Blue', price: 2190, stockQuantity: 14, lowStockThreshold: 4, isActive: true },
    ],
    images: [
      { id: 'img-cj-h1', productId: 'prod-music-travis-cap', storagePath: createStudioImage('CACTUS JACK TRUCKER', 'Front View', 'light'), altText: 'Cactus Jack Trucker Cap', sortOrder: 1 },
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
    featuredImage: createStudioImage('REAL MADRID HOME KIT', '26/27 Authentic Jersey', 'light'),
    minPrice: 4890,
    maxPrice: 4890,
    variants: [
      { id: 'var-rma-j-m', productId: 'prod-football-real-home', sku: 'RMA-H26-M', size: 'M', color: 'Royal White / Gold', price: 4890, stockQuantity: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var-rma-j-l', productId: 'prod-football-real-home', sku: 'RMA-H26-L', size: 'L', color: 'Royal White / Gold', price: 4890, stockQuantity: 11, lowStockThreshold: 5, isActive: true },
    ],
    images: [
      { id: 'img-rma-1', productId: 'prod-football-real-home', storagePath: createStudioImage('REAL MADRID HOME KIT', 'Front View', 'light'), altText: 'Real Madrid Jersey Front', sortOrder: 1 },
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
    featuredImage: createStudioImage('ARSENAL ANTHEM JACKET', 'Pre-Match Heritage Edition', 'light'),
    minPrice: 3890,
    maxPrice: 3890,
    variants: [
      { id: 'var-ars-j-m', productId: 'prod-football-arsenal-anthem', sku: 'ARS-JKT-M', size: 'M', color: 'Highbury Red / Navy', price: 3890, stockQuantity: 9, lowStockThreshold: 3, isActive: true },
      { id: 'var-ars-j-l', productId: 'prod-football-arsenal-anthem', sku: 'ARS-JKT-L', size: 'L', color: 'Highbury Red / Navy', price: 3890, stockQuantity: 4, lowStockThreshold: 3, isActive: true },
    ],
    images: [
      { id: 'img-ars-1', productId: 'prod-football-arsenal-anthem', storagePath: createStudioImage('ARSENAL ANTHEM JACKET', 'Front View', 'light'), altText: 'Arsenal Anthem Jacket', sortOrder: 1 },
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
    featuredImage: createStudioImage('REAL MADRID 1998 RETRO', 'Centenary Heritage Kit', 'light'),
    minPrice: 3990,
    maxPrice: 3990,
    variants: [
      { id: 'var-rma-retro-m', productId: 'prod-football-real-retro', sku: 'RMA-98-M', size: 'M', color: 'Vintage White', price: 3990, stockQuantity: 50, lowStockThreshold: 10, isActive: true },
      { id: 'var-rma-retro-l', productId: 'prod-football-real-retro', sku: 'RMA-98-L', size: 'L', color: 'Vintage White', price: 3990, stockQuantity: 50, lowStockThreshold: 10, isActive: true },
    ],
    images: [
      { id: 'img-rma-retro1', productId: 'prod-football-real-retro', storagePath: createStudioImage('REAL MADRID 1998 RETRO', 'Front View', 'light'), altText: 'Real Madrid 1998 Retro Kit', sortOrder: 1 },
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
    featuredImage: createStudioImage('KAWS COMPANION FLAYED', 'Open Edition 11-Inch', 'light'),
    minPrice: 14900,
    maxPrice: 14900,
    variants: [
      { id: 'var-kaws-comp-grey', productId: 'prod-collect-kaws-companion', sku: 'KAWS-FLAY-GRY', size: '11 Inch', color: 'Monotone Grey', price: 14900, stockQuantity: 3, lowStockThreshold: 2, isActive: true },
    ],
    images: [
      { id: 'img-kaws-1', productId: 'prod-collect-kaws-companion', storagePath: createStudioImage('KAWS COMPANION FLAYED', 'Front View', 'light'), altText: 'KAWS Companion Figure', sortOrder: 1 },
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
    featuredImage: createStudioImage('BE@RBRICK DAFT PUNK', 'Discovery 400% Twin Set', 'light'),
    minPrice: 19500,
    maxPrice: 19500,
    variants: [
      { id: 'var-bb-daft-400', productId: 'prod-collect-bearbrick-daftpunk', sku: 'BB-DP-400', size: '400% (28cm)', color: 'Gold / Chrome', price: 19500, stockQuantity: 2, lowStockThreshold: 2, isActive: true },
    ],
    images: [
      { id: 'img-bb-1', productId: 'prod-collect-bearbrick-daftpunk', storagePath: createStudioImage('BE@RBRICK DAFT PUNK', 'Front View', 'light'), altText: 'Daft Punk BE@RBRICK 400%', sortOrder: 1 },
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
    featuredImage: createStudioImage('KAWS:HOLIDAY FUJI', 'Pink Vinyl Edition', 'light'),
    minPrice: 11900,
    maxPrice: 11900,
    variants: [
      { id: 'var-kaws-fuji-p', productId: 'prod-collect-kaws-holiday', sku: 'KAWS-FUJI-PNK', size: '8.5 Inch', color: 'Sakura Pink', price: 11900, stockQuantity: 4, lowStockThreshold: 2, isActive: true },
    ],
    images: [
      { id: 'img-kaws-f1', productId: 'prod-collect-kaws-holiday', storagePath: createStudioImage('KAWS:HOLIDAY FUJI', 'Front View', 'light'), altText: 'KAWS Holiday Fuji Figure', sortOrder: 1 },
    ],
  },
];

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
