/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in USD
  category: string;
  image: string;
  tags: string[];
  spicyLevel?: number; // 0 (non-spicy) to 3 (very spicy)
  isAvailable: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SectorInfo {
  id: string;
  name: string;
  fee: number; // in USD
  deliveryMinutes: number;
  coords: Coordinates;
}

export type DeliveryType = 'delivery' | 'pickup';

export type PaymentMethod = 'pagomovil' | 'zelle' | 'efectivo' | 'paypal';

export type OrderStatus = 'received' | 'preparing' | 'on_the_way' | 'delivered';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  paymentDetails?: string; // Reference code, phone number, etc.
  sector?: string; // e.g., 'Alta Vista', 'Los Olivos'
  address?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryMinutes: number;
  driverCoords?: Coordinates;
  restaurantCoords: Coordinates;
  deliveryCoords?: Coordinates;
  isSimulated?: boolean;
  paymentScreenshot?: string; // Base64 data URL for mobile payment receipt screenshot
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  suggestedItems?: string[]; // IDs of menu items suggested here
  timestamp: string;
}
