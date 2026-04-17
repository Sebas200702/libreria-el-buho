import { z } from 'zod';

export const orderItemSchema = z.object({
  book_id: z.string().uuid(),
  quantity: z.coerce.number().int().min(1),
});
export type OrderItemInput = z.infer<typeof orderItemSchema>;

export const orderInputSchema = z.object({
  customer_name: z.string().min(2, 'Nombre requerido').max(120),
  customer_email: z.string().email('Email inválido').max(200),
  customer_phone: z.string().max(40).optional().or(z.literal('')),
  notes: z.string().max(600).optional().or(z.literal('')),
  items: z.array(orderItemSchema).min(1, 'El carrito está vacío'),
});
export type OrderInput = z.infer<typeof orderInputSchema>;

export const orderSchema = z.object({
  id: z.string().uuid(),
  customer_name: z.string(),
  customer_email: z.string(),
  customer_phone: z.string().nullable(),
  notes: z.string().nullable(),
  status: z.enum(['pending', 'completed', 'canceled']),
  total: z.coerce.number(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Order = z.infer<typeof orderSchema>;

export const newsletterSchema = z.object({
  email: z.string().email('Email inválido'),
});
