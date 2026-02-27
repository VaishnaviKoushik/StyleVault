
export interface WardrobeItem {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'shoes' | 'accessory' | 'outerwear' | 'dress';
  color: string;
  brand?: string;
  occasion: string[];
  imageUrl: string;
  description: string;
}

export interface Outfit {
  id: string;
  name: string;
  items: string[]; // item IDs
  occasion: string;
  createdAt: string;
}

export const MOCK_WARDROBE: WardrobeItem[] = [
  // --- TOPS ---
  {
    id: '1',
    name: 'White Linen Shirt',
    category: 'top',
    color: 'White',
    brand: 'Everlane',
    occasion: ['work', 'casual'],
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1080',
    description: 'A breathable white linen shirt, perfect for summer days.'
  },
  {
    id: 't1',
    name: 'Red Track Jacket',
    category: 'top',
    color: 'Red',
    brand: 'Adidas',
    occasion: ['sporty', 'casual'],
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1080',
    description: 'A vibrant red zip-up jacket for active days.'
  },
  {
    id: 't2',
    name: 'Purple Oversized Hoodie',
    category: 'top',
    color: 'Purple',
    brand: 'Champion',
    occasion: ['casual'],
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1080',
    description: 'Cozy purple hoodie with a relaxed fit.'
  },
  {
    id: 't3',
    name: 'Yellow V-Neck Sweater',
    category: 'top',
    color: 'Yellow',
    brand: 'Zara',
    occasion: ['work', 'casual'],
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1080',
    description: 'A bright yellow knit sweater with a flattering v-neck.'
  },
  {
    id: 't4',
    name: 'Orange Puffer Vest',
    category: 'top',
    color: 'Orange',
    brand: 'North Face',
    occasion: ['casual', 'sporty'],
    imageUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1080',
    description: 'Quilted orange vest for layering in transition weather.'
  },
  {
    id: 't5',
    name: 'Green Cardigan',
    category: 'top',
    color: 'Green',
    brand: 'Uniqlo',
    occasion: ['work', 'casual'],
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1080',
    description: 'Classic button-up cardigan in a deep sage green.'
  },

  // --- BOTTOMS ---
  {
    id: '2',
    name: 'Blue Denim Jeans',
    category: 'bottom',
    color: 'Blue',
    brand: 'Levi\'s',
    occasion: ['casual'],
    imageUrl: 'https://images.unsplash.com/photo-1714143136372-ddaf8b606da7?q=80&w=1080',
    description: 'Classic straight-leg denim jeans in a medium wash.'
  },
  {
    id: 'b1',
    name: 'Orange Slim Trousers',
    category: 'bottom',
    color: 'Orange',
    brand: 'COS',
    occasion: ['work', 'formal'],
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1080',
    description: 'Tailored trousers in a bold sunset orange hue.'
  },
  {
    id: 'b2',
    name: 'Grey Cotton Joggers',
    category: 'bottom',
    color: 'Grey',
    brand: 'Nike',
    occasion: ['casual', 'sporty'],
    imageUrl: 'https://images.unsplash.com/photo-1552664199-fd31f7431a55?q=80&w=1080',
    description: 'Comfortable grey joggers with elasticated cuffs.'
  },
  {
    id: 'b3',
    name: 'Pink Athletic Leggings',
    category: 'bottom',
    color: 'Pink',
    brand: 'Lululemon',
    occasion: ['sporty'],
    imageUrl: 'https://images.unsplash.com/photo-1506629082925-ef3194572242?q=80&w=1080',
    description: 'High-waisted compression leggings in bright pink.'
  },
  {
    id: 'b4',
    name: 'Light Blue Midi Skirt',
    category: 'bottom',
    color: 'Blue',
    brand: '& Other Stories',
    occasion: ['casual', 'date night'],
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1080',
    description: 'Breezy light blue skirt with a subtle floral texture.'
  },
  {
    id: 'b5',
    name: 'Beige Chino Pants',
    category: 'bottom',
    color: 'Beige',
    brand: 'J.Crew',
    occasion: ['work', 'casual'],
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa804b8696bd?q=80&w=1080',
    description: 'Versatile beige chinos for a clean, classic look.'
  },

  // --- ACCESSORIES ---
  {
    id: 'a1',
    name: 'Pink Quilted Handbag',
    category: 'accessory',
    color: 'Pink',
    brand: 'Gucci',
    occasion: ['formal', 'night out'],
    imageUrl: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1080',
    description: 'A luxurious pink quilted leather bag with a gold chain strap.'
  },
  {
    id: 'a2',
    name: 'Blue Leather Satchel',
    category: 'accessory',
    color: 'Blue',
    brand: 'Prada',
    occasion: ['work', 'casual'],
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1080',
    description: 'Sophisticated light blue satchel for professional outings.'
  },
  {
    id: 'a3',
    name: 'Classic Black Glasses',
    category: 'accessory',
    color: 'Black',
    brand: 'Ray-Ban',
    occasion: ['work', 'casual'],
    imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=1080',
    description: 'Minimalist black-rimmed glasses for a sharp, intellectual look.'
  },
  {
    id: 'a4',
    name: 'Gold Mesh Watch',
    category: 'accessory',
    color: 'Gold',
    brand: 'Cluse',
    occasion: ['work', 'formal'],
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-09912d619dce?q=80&w=1080',
    description: 'Elegant rose gold mesh watch with a clean white dial.'
  },
  {
    id: 'a5',
    name: 'Retro White Sunglasses',
    category: 'accessory',
    color: 'White',
    brand: 'Celine',
    occasion: ['casual', 'party'],
    imageUrl: 'https://images.unsplash.com/photo-1511499767390-a73953f46ca2?q=80&w=1080',
    description: 'Bold white-framed sunglasses for a vintage-chic summer vibe.'
  },

  // --- OTHERS ---
  {
    id: '3',
    name: 'Black Leather Boots',
    category: 'shoes',
    color: 'Black',
    brand: 'Dr. Martens',
    occasion: ['casual', 'work', 'night out'],
    imageUrl: 'https://images.unsplash.com/photo-1710632609125-da337a1e1ddd?q=80&w=1080',
    description: 'Durable black leather boots with signature stitching.'
  },
  {
    id: '4',
    name: 'Beige Trench Coat',
    category: 'outerwear',
    color: 'Beige',
    brand: 'Burberry',
    occasion: ['formal', 'work'],
    imageUrl: 'https://images.unsplash.com/photo-1589400445193-c881a4b0b38a?q=80&w=1080',
    description: 'A timeless beige trench coat for rainy or windy weather.'
  }
];

export const MOCK_OUTFITS: Outfit[] = [
  {
    id: 'o1',
    name: 'Casual Work Day',
    items: ['1', '2', '3', 'a3'],
    occasion: 'work',
    createdAt: '2024-03-20T10:00:00Z'
  },
  {
    id: 'o2',
    name: 'Sporty Weekend',
    items: ['t1', 'b2', '3'],
    occasion: 'sporty',
    createdAt: '2024-03-21T18:00:00Z'
  },
  {
    id: 'o3',
    name: 'Cozy Evening',
    items: ['t2', 'b3', 'a5'],
    occasion: 'casual',
    createdAt: '2024-03-22T14:00:00Z'
  }
];
