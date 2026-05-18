// Cart utility functions using localStorage for persistence

export interface CartItem {
  id: string;
  name: string;
  seller: string;
  price: number;
  quantity: number;
  image: string;
}

const CART_KEY = 'beachakena_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, 'quantity'>): void {
  const cart = getCart();
  const existing = cart.find(c => c.id === item.id);
  if (existing) {
    existing.quantity += 1;
    saveCart(cart);
  } else {
    saveCart([...cart, { ...item, quantity: 1 }]);
  }
}

export function removeFromCart(id: string): CartItem[] {
  const cart = getCart().filter(c => c.id !== id);
  saveCart(cart);
  return cart;
}

export function updateCartQuantity(id: string, change: number): CartItem[] {
  const cart = getCart().map(c =>
    c.id === id ? { ...c, quantity: Math.max(1, c.quantity + change) } : c
  );
  saveCart(cart);
  return cart;
}

export function getCartCount(): number {
  return getCart().reduce((acc, item) => acc + item.quantity, 0);
}
