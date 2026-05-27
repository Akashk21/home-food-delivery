export const MENU_ITEMS = [
  {
    id: 'butter-chicken',
    name: 'Butter Chicken',
    price: 250,
    description: 'Creamy, rich tomato-based gravy with tender chicken pieces. A classic North Indian delicacy!',
    emoji: '🍛',
    category: 'Non-Veg',
  },
  {
    id: 'kadhai-chicken',
    name: 'Kadhai Chicken',
    price: 280,
    description: 'Spicy, tangy chicken cooked in a traditional wok with bell peppers and aromatic spices.',
    emoji: '🍗',
    category: 'Non-Veg',
  },
] as const;

export const OPERATING_DAYS = [1, 3, 4, 5, 6]; // Mon=1, Wed=3, Thu=4, Fri=5, Sat=6 (closed Tue=2, Sun=0?)
// Actually: Tuesday=2, Thursday=4 are closed
// Sunday=0 is open, Monday=1 open, Tuesday=2 CLOSED, Wednesday=3 open, Thursday=4 CLOSED, Friday=5 open, Saturday=6 open

export function isOperatingDay(date: Date = new Date()): boolean {
  const day = date.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  // Closed on Tuesday (2) and Thursday (4)
  return day !== 2 && day !== 4;
}

export function getDayName(date: Date = new Date()): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

export const TIME_SLOTS = [
  { label: 'Lunch (12:00 PM - 2:00 PM)', value: 'Lunch (12:00 PM - 2:00 PM)' },
  { label: 'Dinner (7:00 PM - 9:00 PM)', value: 'Dinner (7:00 PM - 9:00 PM)' },
] as const;

export const COOK_LOCATION = 'Gaur City AIG Park Avenue';

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export function getWhatsAppUrl(phone: string, text: string): string {
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodedText}`;
}