import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOrderEmail } from '@/lib/email';

function isOperatingDay(): boolean {
  const day = new Date().getDay();
  return day !== 2 && day !== 4; // Closed Tue (2) and Thu (4)
}

function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.split(' ')[1];
  return token === (process.env.ADMIN_SECRET || 'admin123');
}

export async function POST(request: NextRequest) {
  try {
    // Check operating day
    if (!isOperatingDay()) {
      return NextResponse.json(
        { error: 'We are closed today (Tuesday & Thursday). Please order on another day.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { customerName, phone, address, items, total, preferredTime, notes } = body;

    // Validate required fields
    if (!customerName || !phone || !address || !items || !preferredTime) {
      return NextResponse.json(
        { error: 'Missing required fields: customerName, phone, address, items, preferredTime' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        customerName,
        phone,
        address,
        items: JSON.stringify(items),
        total,
        preferredTime,
        notes: notes || '',
        status: 'pending',
      },
    });

    // Send email notification (async - don't block response)
    sendOrderEmail({
      orderId: order.id,
      customerName,
      phone,
      address,
      items,
      total,
      preferredTime,
      notes: notes || '',
    });

    return NextResponse.json(
      { orderId: order.id, message: 'Order placed successfully!' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Parse items JSON for each order
    const parsedOrders = orders.map((order) => ({
      ...order,
      items: JSON.parse(order.items),
    }));

    return NextResponse.json({ orders: parsedOrders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}