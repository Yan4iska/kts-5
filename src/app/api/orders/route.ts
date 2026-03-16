import { NextResponse } from 'next/server';
import type { Order } from 'types/order';

const ordersByUser = new Map<number, Order[]>();

function generateOrderId(): string {
  return `ord_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export type CreateOrderBody = {
  userId: number;
  items: Array<{
    documentId: string;
    productId: number;
    quantity: number;
    price: number;
    title: string;
    imageUrl: string;
  }>;
  discountPercent: number | null;
  totalCents: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderBody;
    const { userId, items, discountPercent, totalCents } = body;
    if (!userId || !Array.isArray(items) || items.length === 0 || typeof totalCents !== 'number') {
      return NextResponse.json(
        { error: 'Invalid payload: userId, non-empty items, and totalCents required' },
        { status: 400 }
      );
    }
    const order: Order = {
      orderId: generateOrderId(),
      userId,
      items,
      discountPercent: discountPercent ?? null,
      totalCents,
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
    };
    const list = ordersByUser.get(userId) ?? [];
    list.unshift(order);
    ordersByUser.set(userId, list);
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userIdParam = searchParams.get('userId');
  const userId = userIdParam ? parseInt(userIdParam, 10) : NaN;
  if (!Number.isFinite(userId)) {
    return NextResponse.json({ error: 'userId query required' }, { status: 400 });
  }
  const orders = ordersByUser.get(userId) ?? [];
  return NextResponse.json({ orders });
}
