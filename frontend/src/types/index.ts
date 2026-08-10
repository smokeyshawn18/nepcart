export type OrderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "delivered"
  | "cancelled";

export type OrderPaymentMethod = "polar" | "cod";

export type UserRole = "customer" | "support" | "admin";

export type Currency = string;

export interface User {
  id: string;
  clerkUserId: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  priceCents: number;
  currency: Currency;
  imageUrl: string | null;
  imageKitFileId: string | null;
  active: boolean;
  featured: boolean;
  createdAt: string;
}

export interface CheckoutSessionLine {
  productId: string;
  quantity: number;
  unitPriceCents: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  city: string;
  postalCode: string;
  region?: string;
  country?: string;
  notes?: string;
}

export interface CheckoutSession {
  id: string;
  userId: string;
  polarCheckoutId: string | null;
  shippingAddress: ShippingAddress | null;
  lines: CheckoutSessionLine[];
  totalCents: number;
  currency: Currency;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  paymentMethod: OrderPaymentMethod;
  shippingAddress: ShippingAddress | null;
  polarCheckoutId: string | null;
  polarOrderId: string | null;
  totalCents: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPriceCents: number;
}
