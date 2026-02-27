
export interface WardrobeItem {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'shoes' | 'accessory' | 'outerwear';
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
  {
    id: '1',
    name: 'White Linen Shirt',
    category: 'top',
    color: 'White',
    brand: 'Everlane',
    occasion: ['work', 'casual'],
    imageUrl: 'https://picsum.photos/seed/clothing1/400/500',
    description: 'A breathable white linen shirt, perfect for summer days.'
  },
  {
    id: '2',
    name: 'Blue Denim Jeans',
    category: 'bottom',
    color: 'Blue',
    brand: 'Levi\'s',
    occasion: ['casual'],
    imageUrl: 'https://picsum.photos/seed/clothing2/400/500',
    description: 'Classic straight-leg denim jeans in a medium wash.'
  },
  {
    id: '3',
    name: 'Black Leather Boots',
    category: 'shoes',
    color: 'Black',
    brand: 'Dr. Martens',
    occasion: ['casual', 'work', 'night out'],
    imageUrl: 'https://picsum.photos/seed/clothing3/400/500',
    description: 'Durable black leather boots with signature stitching.'
  },
  {
    id: '4',
    name: 'Beige Trench Coat',
    category: 'outerwear',
    color: 'Beige',
    brand: 'Burberry',
    occasion: ['formal', 'work'],
    imageUrl: 'https://picsum.photos/seed/clothing4/400/500',
    description: 'A timeless beige trench coat for rainy or windy weather.'
  },
  {
    id: '5',
    name: 'Silk Floral Scarf',
    category: 'accessory',
    color: 'Multi',
    brand: 'Hermès',
    occasion: ['formal', 'casual'],
    imageUrl: 'https://picsum.photos/seed/clothing5/400/500',
    description: 'Elegant silk scarf with a vibrant floral pattern.'
  },
  {
    id: '6',
    name: 'Black Turtleneck',
    category: 'top',
    color: 'Black',
    brand: 'Uniqlo',
    occasion: ['work', 'formal', 'casual'],
    imageUrl: 'https://picsum.photos/seed/clothing6/400/500',
    description: 'Soft merino wool turtleneck in classic black.'
  },
  {
    id: '7',
    name: 'Pleated Midi Skirt',
    category: 'bottom',
    color: 'Forest Green',
    brand: 'Zara',
    occasion: ['work', 'formal'],
    imageUrl: 'https://picsum.photos/seed/clothing7/400/500',
    description: 'Forest green pleated skirt with a slight shimmer.'
  }
];

export const MOCK_OUTFITS: Outfit[] = [
  {
    id: 'o1',
    name: 'Casual Work Day',
    items: ['1', '2', '3'],
    occasion: 'work',
    createdAt: '2024-03-20T10:00:00Z'
  },
  {
    id: 'o2',
    name: 'Evening Out',
    items: ['6', '7', '3', '5'],
    occasion: 'night out',
    createdAt: '2024-03-21T18:00:00Z'
  }
];
