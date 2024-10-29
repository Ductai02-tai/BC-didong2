import React, { createContext, useState, ReactNode } from 'react';

export type Product = {
  id: number;
  name: string;
  price: string; // Bạn có thể thay đổi kiểu về number nếu cần
  imageUrl?: string;
  quantity?: number; // Thêm quantity cho sản phẩm trong giỏ hàng
};

type CartContextType = {
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
  updateStockQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
};

// Thay đổi tên export từ AppContext thành CartContext
export const AppContext = createContext<CartContextType | undefined>(undefined);

// Đổi tên thành CartProvider
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const updateStockQuantity = (id: number, quantity: number) => {
    setCart(prevCart => {
      return prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  return (
    <AppContext.Provider value={{ cart, setCart, updateStockQuantity, removeFromCart }}>
      {children}
    </AppContext.Provider>
  );
};
