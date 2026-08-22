export type PaymentMethod = "polar" | "cod" | "esewa";

export interface Address {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  region?: string;
  country?: string;
  notes?: string;
}

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface CreateCheckoutInput {
  clerkUserId: string;
  items: CartItemInput[];
  paymentMethod: PaymentMethod;
  shippingAddress?: Address;
  billingAddress?: Address;
}
