# 🍗 AIG Chicken - Home Cooked Food Delivery

A web application for a home-cooked chicken delivery service operating from **Gaur City AIG Park Avenue**. Customers can order Butter Chicken and Kadhai Chicken, and the cook receives order notifications via email and WhatsApp.

## Features

- 🏪 **Menu Display** - Two chicken dishes with prices, descriptions, and emoji placeholders
- 🛒 **Shopping Cart** - Add/remove items, adjust quantities with a slide-in cart drawer
- 📋 **Checkout Form** - Customer details, address, preferred delivery time slot, and notes
- 📧 **Email Notifications** - Automatic email to the cook when an order is placed (via Resend)
- 💬 **WhatsApp Integration** - Clickable wa.me link pre-filled with order details on success page
- 📅 **Operating Days** - Ordering disabled on Tuesday & Thursday with clear banners
- 🔐 **Admin Dashboard** - View all orders, update status (pending → confirmed → preparing → delivered)
- 📱 **Mobile-First Design** - Responsive layout from 320px to 1920px
- 🎨 **CSS Animations** - Bounce on cart add, fade-in elements, smooth transitions

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + React 18 + TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Database:** Prisma + SQLite (local) / Vercel Postgres (production)
- **Email:** Resend API
- **Deployment:** Vercel

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+ and npm/pnpm
- Git

### 1. Clone & Install

```bash
git clone <your-repo-url> home-chicken-delivery
cd home-chicken-delivery
npm install
```

### 2. Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# For local SQLite database (no setup needed)
DATABASE_URL="file:./prisma/dev.db"

# Admin dashboard password (change this!)
ADMIN_SECRET=my-secret-password

# Cook's email for order notifications
COOK_EMAIL=cook@example.com

# Resend API key (get one free at https://resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Cook's WhatsApp number (with country code, no + or spaces)
WHATSAPP_NUMBER=919XXXXXXXXX
NEXT_PUBLIC_WHATSAPP_NUMBER=919XXXXXXXXX
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to SQLite database
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Access Admin Dashboard

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) and enter the password from your `ADMIN_SECRET` env variable.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── admin/login/route.ts    # Admin authentication
│   │   └── orders/
│   │       ├── route.ts            # Create & list orders
│   │       └── [id]/route.ts       # Update order status
│   ├── admin/
│   │   ├── login/page.tsx          # Admin login page
│   │   └── page.tsx                # Admin dashboard
│   ├── checkout/page.tsx           # Checkout form
│   ├── success/page.tsx            # Order success page
│   ├── page.tsx                    # Home page / menu
│   ├── layout.tsx                  # Root layout (cart drawer + button)
│   └── globals.css                 # Global styles
├── components/
│   ├── CartDrawer.tsx              # Slide-in cart drawer
│   └── CartFloatingButton.tsx      # Floating cart button
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── email.ts                    # Email sending (Resend)
│   └── utils.ts                    # Constants & helpers
├── store/
│   └── cart.ts                     # Zustand cart store
├── prisma/
│   └── schema.prisma               # Database schema
├── public/                         # Static assets
├── vercel.json                     # Vercel deployment config
└── .env.example                    # Environment variable template
```

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/home-chicken-delivery.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repository
2. The `vercel.json` file will auto-detect the framework and build settings

### 3. Environment Variables in Vercel

In the Vercel project dashboard → Settings → Environment Variables, add:

| Name | Value | Description |
|------|-------|-------------|
| `DATABASE_URL` | `postgres://...` | **Vercel Postgres** connection string (or your own PostgreSQL URL) |
| `ADMIN_SECRET` | `your-secret-password` | Password for the admin dashboard |
| `COOK_EMAIL` | `cook@example.com` | Email where order notifications are sent |
| `RESEND_API_KEY` | `re_...` | Resend API key for sending emails |
| `WHATSAPP_NUMBER` | `919XXXXXXXXX` | Cook's WhatsApp number (country code + number) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919XXXXXXXXX` | Same as above (exposed to client-side) |

### 4. Database Migration on Vercel

For **Vercel Postgres**, you'll need to run migrations after deployment:

```bash
# Option 1: Use Vercel CLI
vercel env pull
npx prisma generate
npx prisma db push

# Option 2: SSH into a hobby plan? Not possible — 
# Instead, set the build command in vercel.json to auto-migrate:
# "buildCommand": "npx prisma generate && npx prisma db push && next build"
```

> **Note:** For production with Vercel Postgres, update the `DATABASE_URL` in your `.env.example` and `vercel.json` appropriately. The SQLite setup is for local development only.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | No | Create a new order (validates operating day) |
| GET | `/api/orders` | Bearer Token | List all orders (admin only) |
| PATCH | `/api/orders/[id]` | Bearer Token | Update order status (admin only) |
| POST | `/api/admin/login` | No | Authenticate admin (returns token) |

## Operating Days

- ✅ **Open:** Sunday, Monday, Wednesday, Thursday, Friday, Saturday
- ❌ **Closed:** Tuesday, Thursday

The website automatically checks the current day and:
- Shows a red banner with "Closed" message on non-operating days
- Disables "Add to Cart" buttons on closed days
- Blocks order creation at the API level

## License

This project is for personal/commercial use. Built with Next.js, Tailwind CSS, Prisma, and Zustand.