import nodemailer from 'nodemailer';
import { env } from '../config/env';
import type { QuoteRequest, ContactMessage } from '../models/types';

let transporter: nodemailer.Transporter | null = null;

export function initEmail(): void {
  if (!env.email.user || !env.email.pass) {
    console.log('  Email: DEMO MODE (emails logged to console only)');
    return;
  }

  transporter = nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    secure: env.email.secure,
    auth: { user: env.email.user, pass: env.email.pass },
  });

  console.log('  Email: Connected via', env.email.host);
}

async function send(options: nodemailer.SendMailOptions): Promise<void> {
  if (!transporter) {
    // Demo mode — log to console instead
    console.log('\n📧 [DEMO EMAIL]');
    console.log('  To:', options.to);
    console.log('  Subject:', options.subject);
    console.log('  Body (text):', typeof options.text === 'string' ? options.text.substring(0, 200) + '...' : '(html only)');
    console.log();
    return;
  }

  await transporter.sendMail({ from: env.email.from, ...options });
}

// ─── Quote Confirmation (to customer) ────────────────────────────────────────

export async function sendQuoteConfirmation(quote: QuoteRequest): Promise<void> {
  const subject = `Quote Request Received — ${quote.id}`;
  const text = `
Hi ${quote.name},

Thank you for reaching out to MoveMaster Pro! We have received your quote request and a coordinator will call you within 2 hours to confirm details.

Your Quote Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Confirmation ID : ${quote.id}
Move Date       : ${quote.moveDate || 'To be confirmed'}
Service         : ${quote.serviceType}
Move Size       : ${quote.moveSize}
From            : ${quote.originCity}
To              : ${quote.destinationCity}
Packing Service : ${quote.needsPacking ? 'Yes' : 'No'}
Storage         : ${quote.needsStorage ? 'Yes' : 'No'}
${quote.estimatedPrice ? `Estimated Price : $${quote.estimatedPrice.toLocaleString()} CAD (±15%)` : ''}
${quote.depositAmount ? `Deposit (20%)   : $${quote.depositAmount.toLocaleString()} CAD` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What Happens Next:
1. Our coordinator calls you within 2 hours
2. We confirm your move details and answer questions
3. Pay the 20% deposit to lock in your date
4. We show up on time and handle everything

Questions? Call us any time: 1-800-MOVE-PRO
Or reply to this email.

The MoveMaster Pro Team
Southern Ontario's Most Trusted Movers
  `.trim();

  await send({ to: quote.email, subject, text });
}

// ─── New Quote Alert (to admin) ───────────────────────────────────────────────

export async function sendAdminQuoteAlert(quote: QuoteRequest): Promise<void> {
  const subject = `🚛 New Quote Request — ${quote.id} (${quote.originCity} → ${quote.destinationCity})`;
  const text = `
New quote request received — action required within 2 hours.

CLIENT DETAILS
━━━━━━━━━━━━━━━━━━━━
Name    : ${quote.name}
Email   : ${quote.email}
Phone   : ${quote.phone}
Heard   : ${quote.hearAboutUs || 'Not specified'}

MOVE DETAILS
━━━━━━━━━━━━━━━━━━━━
Quote ID    : ${quote.id}
Service     : ${quote.serviceType}
Move Size   : ${quote.moveSize}
Move Date   : ${quote.moveDate || 'Flexible'}
From        : ${quote.originAddress}, ${quote.originCity}
To          : ${quote.destinationAddress}, ${quote.destinationCity}
Floor (from): ${quote.floorOrigin} ${quote.hasElevator ? '(elevator available)' : '(no elevator)'}
Floor (to)  : ${quote.floorDestination}
Packing     : ${quote.needsPacking ? 'YES' : 'No'}
Storage     : ${quote.needsStorage ? 'YES' : 'No'}
Specialty   : ${quote.hasSpecialtyItems ? 'YES — ' + (quote.specialtyDetails || 'see notes') : 'No'}

PRICING
━━━━━━━━━━━━━━━━━━━━
${quote.estimatedPrice ? `Estimated : $${quote.estimatedPrice.toLocaleString()}` : 'Estimated : TBD'}
${quote.depositAmount ? `Deposit   : $${quote.depositAmount.toLocaleString()}` : ''}

${quote.notes ? 'CLIENT NOTES\n━━━━━━━━━━━━━━━━━━━━\n' + quote.notes : ''}

Submitted: ${new Date(quote.createdAt).toLocaleString('en-CA', { timeZone: 'America/Toronto' })}
  `.trim();

  await send({ to: env.email.adminEmail, subject, text });
}

// ─── Booking Confirmation ─────────────────────────────────────────────────────

export async function sendBookingConfirmation(quote: QuoteRequest, bookingRef: string): Promise<void> {
  const subject = `Booking Confirmed — ${bookingRef}`;
  const text = `
Hi ${quote.name},

Your deposit has been received and your move is officially booked with MoveMaster Pro!

BOOKING REFERENCE: ${bookingRef}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Move Date   : ${quote.moveDate}
Route       : ${quote.originCity} → ${quote.destinationCity}
Service     : ${quote.serviceType}
Deposit Paid: $${quote.depositAmount?.toLocaleString() ?? 0} CAD ✓

Your coordinator will call you 48 hours before your move to confirm the exact arrival window and answer any last-minute questions.

On Moving Day:
• Our crew will arrive in a clearly marked MoveMaster Pro truck
• Have any parking arrangements ready in advance
• The remaining balance is due on completion of the move

Need to make changes? Contact us at least 72 hours in advance.
Phone: 1-800-MOVE-PRO | Email: hello@movemasterpro.ca

See you on moving day!
The MoveMaster Pro Team
  `.trim();

  await send({ to: quote.email, subject, text });
}

// ─── Contact Message Confirmation ────────────────────────────────────────────

export async function sendContactConfirmation(msg: ContactMessage): Promise<void> {
  await send({
    to: msg.email,
    subject: 'We received your message — MoveMaster Pro',
    text: `Hi ${msg.name},\n\nThank you for contacting MoveMaster Pro. We will get back to you within 24 hours.\n\nYour message:\n"${msg.message}"\n\nThe MoveMaster Pro Team`,
  });

  await send({
    to: env.email.adminEmail,
    subject: `New Contact Message from ${msg.name}`,
    text: `From: ${msg.name} <${msg.email}>\nPhone: ${msg.phone || 'N/A'}\nService: ${msg.serviceType || 'N/A'}\n\n${msg.message}`,
  });
}

// ─── Password Reset ────────────────────────────────────────────────────────────

export async function sendPasswordReset(email: string, resetLink: string): Promise<void> {
  await send({
    to: email,
    subject: 'Reset Your MoveMaster Pro Password',
    text: `Click this link to reset your password (expires in 1 hour):\n\n${resetLink}\n\nIf you did not request this, ignore this email.`,
  });
}
