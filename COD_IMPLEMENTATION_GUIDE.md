# Cash on Delivery (COD) Implementation Guide

This document explains how the cash-on-delivery flow was added to the app.

## Overview

The store now supports two checkout methods:

- Polar checkout (online payment)
- Cash on Delivery (COD)

For COD, the user can:

1. Add items to the cart
2. Fill in a shipping address
3. Place the order
4. See the order in their orders list
5. Cancel the order if it is still pending

Admins can:

- update the order status to delivered
- cancel an order from the admin order flow
- review all orders from a dedicated admin orders page
- update order status directly from the admin orders table

---

## Backend changes

### 1. Order model updates

The order schema was extended to support:

- `paymentMethod` (`polar` or `cod`)
- `shippingAddress`
- extra statuses: `delivered` and `cancelled`

### 2. Checkout controller

The checkout endpoint now accepts:

- `paymentMethod`
- optional `shippingAddress` for COD

If `paymentMethod === "cod"`, the backend:

- validates that a shipping address is provided
- creates an order with status `pending`
- stores the shipping address on the order

### 3. Admin order update endpoint

An admin-only endpoint was added so staff can change an order status.

### 4. Admin orders page

The frontend now includes a dedicated admin orders screen at `/admin/orders` for reviewing all orders and updating their status from one place.

### 5. Customer cancel endpoint

Customers can cancel a COD order only when:

- the order uses COD
- the order is still `pending`

---

## Frontend changes

### 1. Cart page

The cart page now shows:

- the usual checkout button for Polar
- a COD button
- a shipping-address form for COD

### 2. Order detail page

The order detail page now shows:

- shipping details for COD orders
- a Cancel COD order button for customers when the order is pending
- admin controls to mark the order delivered or cancelled

### 3. Admin orders page

The admin orders page adds:

- a list of all orders
- order status badges
- payment method tags
- shipping-address details
- inline status update controls for admins

### 4. Navigation updates

The navbar now includes direct admin links for:

- Products management
- Orders management

---

## Flow example

### Customer flow

1. Open cart
2. Choose Cash on Delivery
3. Fill in shipping details
4. Submit order
5. Open the order page
6. Cancel it if needed while it is pending

### Admin flow

1. Open the admin orders page
2. Review the order list and status badges
3. Update an order status directly from the table
4. Or open an individual order to mark it delivered or cancelled

---

## Notes

This implementation keeps the existing Polar payment flow intact while adding COD as a simpler offline fulfillment option.
