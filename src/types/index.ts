// Type definitions for the application

export interface ClothingItem {
  id: string;
  itemCode: string;
  name: string;
  category: "Men" | "Women" | "Kids" | "Accessories";
  price: number;
  imageUrl: string;
  isSold: boolean;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface ItemFormData {
  name: string;
  category: "Men" | "Women" | "Kids" | "Accessories";
  price: number;
  description?: string;
  image?: File;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
