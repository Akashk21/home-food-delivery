import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import CartDrawer from '@/components/CartDrawer';
import CartFloatingButton from '@/components/CartFloatingButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AIG Chicken - Home Cooked Chicken Delivery',
  description: 'Freshly home-cooked Butter Chicken & Kadhai Chicken, delivered to your doorstep in Gaur City AIG Park Avenue.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <CartDrawer />
        <CartFloatingButton />
      </body>
    </html>
  );
}