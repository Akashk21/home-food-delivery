import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

interface OrderEmailData {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  preferredTime: string;
  notes: string;
}

export async function sendOrderEmail(data: OrderEmailData) {
  const cookEmail = process.env.COOK_EMAIL || '';
  if (!cookEmail || !process.env.RESEND_API_KEY) {
    console.log('Email not configured. Skipping email send.');
    return;
  }

  const itemsList = data.items
    .map((item) => `  • ${item.name} × ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');

  try {
    await resend.emails.send({
      from: 'Food Order <onboarding@resend.dev>',
      to: cookEmail,
      subject: `🧑‍🍳 New Order #${data.orderId.slice(0, 8)} from ${data.customerName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c;">🆕 New Order Received!</h2>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <hr />
          <h3>👤 Customer Details</h3>
          <p><strong>Name:</strong> ${data.customerName}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Address:</strong> ${data.address}</p>
          <p><strong>Preferred Time:</strong> ${data.preferredTime}</p>
          ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
          <hr />
          <h3>🛒 Order Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 8px; text-align: left;">Item</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Price</th>
                <th style="padding: 8px; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${data.items
                .map(
                  (item) => `
                <tr>
                  <td style="padding: 8px;">${item.name}</td>
                  <td style="padding: 8px; text-align: center;">${item.quantity}</td>
                  <td style="padding: 8px; text-align: right;">₹${item.price.toFixed(2)}</td>
                  <td style="padding: 8px; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>`
                )
                .join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 8px; text-align: right; font-weight: bold; color: #ea580c;">₹${data.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          <hr />
          <p style="color: #6b7280; font-size: 14px;">
            This order was placed via your home kitchen website. Please confirm with the customer.
          </p>
        </div>
      `,
    });
    console.log('Order email sent successfully');
  } catch (error) {
    console.error('Failed to send order email:', error);
  }
}