# 🛒 PERN Stack E-Commerce Platform 🚀

![Demo App](/frontend/public/screenshot-for-readme.png)

---

## ✨ Highlights:

- 🛒 Full Stack E-Commerce App built from scratch
- ⚛️ Frontend with React, TanStack Query, Tailwind CSS & DaisyUI
- 🚀 Backend with Express.js & TypeScript
- 🔐 Secure Authentication with Clerk
- 🗄️ PostgreSQL Database hosted on Neon
- 💳 Payments integration with Polar
- 📦 Product, Cart & Order Management
- 📊 Admin Dashboard to manage products
- 💬 Real-time Customer Support Chat with Stream
- 📹 Video Calling powered by Stream
- ⌨️ Typing Indicators in chat
- 😀 Message Reactions
- 🧵 Threaded Conversations
- 📁 File Uploads in chat
- 🎞️ GIF Support inside messages
- 🔔 Webhooks explained and implemented step-by-step
- 📤 Image Uploads & Optimization with ImageKit
- 🚨 Monitoring, Error Tracking & Performance Tracking with Sentry
- 📋 Structured Logs for debugging and analysis
- ⚡ Modern SaaS / E-Commerce Architecture
- 🌐 Deploy your app with a live URL
- 🆓 100% Free Setup to get started
- 📂 Full Source Code Provided
- 🎯 Resume-ready production-style project

---

## 🧪 Environment Variables

### Backend (`/backend`)

```bash
PORT=<your_port>
NODE_ENV=<development_or_production>

DATABASE_URL=<your_postgresql_connection_string>

CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
CLERK_SECRET_KEY=<your_clerk_secret_key>
CLERK_WEBHOOK_SECRET=<your_clerk_webhook_secret>

SENTRY_DSN=<your_sentry_dsn>

STREAM_API_KEY=<your_stream_api_key>
STREAM_API_SECRET=<your_stream_api_secret>

IMAGEKIT_PUBLIC_KEY=<your_imagekit_public_key>
IMAGEKIT_PRIVATE_KEY=<your_imagekit_private_key>
IMAGEKIT_URL_ENDPOINT=<your_imagekit_url_endpoint>

FRONTEND_URL=<your_frontend_url>

POLAR_ACCESS_TOKEN=<your_polar_access_token>
POLAR_WEBHOOK_SECRET=<your_polar_webhook_secret>
POLAR_API_BASE=<your_polar_api_base_url>

POLAR_CHECKOUT_PRODUCT_ID=<your_product_id>
```

### Frontend (`/frontend`)

```bash
VITE_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
VITE_SENTRY_DSN=<your_sentry_dsn>
VITE_API_URL=<your_backend_api_url>
```
