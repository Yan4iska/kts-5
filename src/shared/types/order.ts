export type OrderItem = {
  documentId: string;
  productId: number;
  quantity: number;
  price: number;
  title: string;
  imageUrl: string;
};

export type Order = {
  orderId: string;
  userId: number;
  items: OrderItem[];
  discountPercent: number | null;
  totalCents: number;
  paymentStatus: string;
  createdAt: string;
};

export type CreateOrderPayload = {
  userId: number;
  items: OrderItem[];
  discountPercent: number | null;
  totalCents: number;
};
