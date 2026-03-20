"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { CartItem, Product } from "@/lib/types";
import { normalizeProductSizes } from "@/lib/utils";

const CART_STORAGE_KEY = "muzz-cart";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, options?: { size?: string }) => void;
  increaseItem: (cartKey: string) => void;
  decreaseItem: (cartKey: string) => void;
  removeItem: (cartKey: string) => void;
  updateItemSize: (cartKey: string, size: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

      if (storedCart) {
        setItems(normalizeStoredItems(JSON.parse(storedCart) as CartItem[]));
      }
    } catch {
      setItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [isHydrated, items]);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  const value = {
    items,
    itemCount,
    subtotal,
    addItem: (product: Product, options?: { size?: string }) => {
      setItems((currentItems) => {
        const normalizedSizes = normalizeProductSizes(product.available_sizes);
        const normalizedSize = options?.size?.trim() || undefined;
        const cartKey = buildCartKey(product.id, normalizedSize);
        const existingItem = currentItems.find((item) => item.cartKey === cartKey);

        if (existingItem) {
          return currentItems.map((item) =>
            item.cartKey === cartKey
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }

        return [
          ...currentItems,
          {
            cartKey,
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.primary_image || product.image,
            primary_image: product.primary_image,
            product_type: product.product_type,
            is_digital: product.is_digital,
            digital_tracks: product.digital_tracks,
            has_size_options: product.has_size_options,
            available_sizes: normalizedSizes.length > 0 ? product.available_sizes : undefined,
            size: normalizedSize,
            quantity: 1,
          },
        ];
      });
    },
    increaseItem: (cartKey: string) => {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
    },
    decreaseItem: (cartKey: string) => {
      setItems((currentItems) =>
        currentItems
          .map((item) =>
            item.cartKey === cartKey
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      );
    },
    removeItem: (cartKey: string) => {
      setItems((currentItems) => currentItems.filter((item) => item.cartKey !== cartKey));
    },
    updateItemSize: (cartKey: string, size: string) => {
      setItems((currentItems) => {
        const itemToUpdate = currentItems.find((item) => item.cartKey === cartKey);

        if (!itemToUpdate) {
          return currentItems;
        }

        const nextSize = size.trim() || undefined;
        const nextCartKey = buildCartKey(itemToUpdate.id, nextSize);

        if (nextCartKey === cartKey) {
          return currentItems;
        }

        const remainingItems = currentItems.filter((item) => item.cartKey !== cartKey);
        const existingTarget = remainingItems.find((item) => item.cartKey === nextCartKey);

        if (existingTarget) {
          return remainingItems.map((item) =>
            item.cartKey === nextCartKey
              ? { ...item, quantity: item.quantity + itemToUpdate.quantity }
              : item,
          );
        }

        return [
          ...remainingItems,
          {
            ...itemToUpdate,
            cartKey: nextCartKey,
            size: nextSize,
          },
        ];
      });
    },
    clearCart: () => setItems([]),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function buildCartKey(productId: number, size?: string) {
  return `${productId}:${size || "default"}`;
}

function normalizeStoredItems(items: CartItem[]) {
  return items.map((item) => ({
    ...item,
    cartKey: item.cartKey || buildCartKey(item.id, item.size),
  }));
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
