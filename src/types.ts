export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'pre-workout' | 'protein' | 'recovery' | 'stacks';
  image: string;
  description: string;
  isBestSeller?: boolean;
  isSale?: boolean;
  isSoldOut?: boolean;
  servings?: number[];
  flavors?: string[];
  ingredients?: { name: string; amount: string }[];
  includedItems?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedFlavor?: string;
  selectedServings?: number;
}
