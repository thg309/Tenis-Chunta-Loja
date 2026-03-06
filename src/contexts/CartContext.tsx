import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export const shoes = [
  { src: "/images/azul1.webp", name: "Azul" },
  { src: "/images/bege1.webp", name: "Bege" },
  { src: "/images/branco1.webp", name: "Branco" },
  { src: "/images/rosa1.webp", name: "Rosa" },
  { src: "/images/verde1.webp", name: "Verde" },
];

export interface CartItem {
  id: string;
  colorIndex: number;
  colorName: string;
  size: number;
  quantity: number;
  unitPrice: number;
  image: string;
}

interface StoredCartItem {
  id: string;
  colorIndex: number;
  colorName: string;
  size: number;
  quantity: number;
  unitPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (colorIndex: number, size: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const UNIT_PRICE = 49.99;
const STORAGE_KEY = "worldtennis-cart";

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: StoredCartItem[] = JSON.parse(stored);
    return parsed.map((item) => ({
      ...item,
      image: shoes[item.colorIndex]?.src || shoes[0].src,
    }));
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    const toStore: StoredCartItem[] = items.map(({ image, ...rest }) => rest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    // Silently fail if localStorage is unavailable
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());

  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const addItem = useCallback((colorIndex: number, size: number) => {
    setItems((prev) => {
      const existingItem = prev.find(
        (item) => item.colorIndex === colorIndex && item.size === size
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      const shoe = shoes[colorIndex];
      const newItem: CartItem = {
        id: `${colorIndex}-${size}-${Date.now()}`,
        colorIndex,
        colorName: shoe.name,
        size,
        quantity: 1,
        unitPrice: UNIT_PRICE,
        image: shoe.src,
      };
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
