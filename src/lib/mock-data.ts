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
    imageUrl: 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?q=80&w=1080',
    description: 'Soft merino wool turtleneck in classic black.'
  },
  {
    id: '7',
    name: 'Little Black Dress',
    category: 'dress',
    color: 'Black',
    brand: 'Chanel',
    occasion: ['formal', 'night out'],
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1080',
    description: 'A sophisticated and timeless A-line black dress for elegant evenings.'
  },
  {
    id: '8',
    name: 'Floral Summer Maxi',
    category: 'dress',
    color: 'Multi',
    brand: 'Reformation',
    occasion: ['casual', 'party'],
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1080',
    description: 'A breezy floral maxi dress with a side slit, perfect for garden parties.'
  },
  {
    id: '9',
    name: 'Red Cocktail Dress',
    category: 'dress',
    color: 'Red',
    brand: 'Self-Portrait',
    occasion: ['formal', 'party', 'night out'],
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1080',
    description: 'A stunning red cocktail dress with lace detailing and a flared hem.'
  },
  {
    id: '10',
    name: 'Denim Pinafore Dress',
    category: 'dress',
    color: 'Blue',
    brand: 'Madewell',
    occasion: ['casual'],
    imageUrl: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=1080',
    description: 'A versatile denim pinafore dress, easy to layer over tees or turtlenecks.'
  },
  {
    id: '11',
    name: 'Silk Slip Dress',
    category: 'dress',
    color: 'Emerald',
    brand: 'Cuyana',
    occasion: ['night out', 'formal'],
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1080',
    description: 'A luxurious emerald green silk slip dress with a minimalist silhouette.'
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
  },
  {
    id: 'o3',
    name: 'Summer Gala',
    items: ['9', '3', '5'],
    occasion: 'formal',
    createdAt: '2024-03-22T14:00:00Z'
  }
];
