import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.split(' ')[1];
  return token === (process.env.ADMIN_SECRET || 'admin123');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'delivered'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({
      order: { ...order, items: JSON.parse(order.items) },
      message: `Order status updated to ${status}`,
    });
  } catch (error: any) {
    console.error('Error updating order:', error);

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}