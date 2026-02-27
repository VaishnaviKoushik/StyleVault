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
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1080',
    description: 'A breathable white linen shirt, perfect for summer days.'
  },
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
  },
  {
    id: '5',
    name: 'Silk Floral Scarf',
    category: 'accessory',
    color: 'Multi',
    brand: 'Hermès',
    occasion: ['formal', 'casual'],
    imageUrl: 'https://images.unsplash.com/photo-1677478863154-55ecce8c7536?q=80&w=1080',
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
    items: ['6', '3', '5'],
    occasion: 'night out',
    createdAt: '2024-03-21T18:00:00Z'
  }
];