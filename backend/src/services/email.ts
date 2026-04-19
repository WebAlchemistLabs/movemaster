import nodemailer from 'nodemailer';
import { env } from '../config/env';
import type { Job } from '../models/types';

let transporter: nodemailer.Transporter | null = null;

export function initEmail(): void {
  if (!env.email.user || !env.email.pass) {
    console.log('  Email: DEMO MODE (logged to console)');
    return;
  }
  transporter = nodemailer.createTransport({
    host: env.email.host, port: env.email.port, secure: env.email.secure,
    auth: { user: env.email.user, pass: env.email.pass },
  });
  console.log('  Email: Connected via', env.email.host);
}

async function send(opts: nodemailer.SendMailOptions): Promise<void> {
  if (!transporter) {
    console.log(`\n📧 [DEMO EMAIL] To: ${opts.to} | Subject: ${opts.subject}`);
    return;
  }
  await transporter.sendMail({ from: env.email.from, ...opts });
}

export async function sendQuoteConfirmation(job: Job): Promise<void> {
  await send({
    to: job.email,
    subject: `Quote Received — ${job.id} | MoveMaster Pro`,
    text: `Hi ${job.name},\n\nWe received your quote request.\n\nRef: ${job.id}\nRoute: ${job.originCity} → ${job.destinationCity}\nDate: ${job.moveDate || 'TBD'}\nEstimate: $${job.estimatedPrice?.toLocaleString()} CAD\nDeposit: $${job.depositAmount?.toLocaleString()} CAD\n\nWe will call you within 2 hours.\n\nMoveMaster Pro\n1-800-MOVE-PRO`,
  });
}

export async function sendAdminAlert(job: Job): Promise<void> {
  await send({
    to: env.email.adminEmail,
    subject: `🚛 New Quote — ${job.id} | ${job.originCity} → ${job.destinationCity}`,
    text: `New quote submitted.\n\nClient: ${job.name}\nEmail: ${job.email}\nPhone: ${job.phone}\nRoute: ${job.originCity} → ${job.destinationCity}\nDate: ${job.moveDate}\nSize: ${job.moveSize}\nService: ${job.serviceType}\nEstimate: $${job.estimatedPrice?.toLocaleString()}\nNotes: ${job.notes || 'None'}`,
  });
}

export async function sendBookingConfirmation(job: Job, bookingRef: string): Promise<void> {
  await send({
    to: job.email,
    subject: `Booking Confirmed — ${bookingRef} | MoveMaster Pro`,
    text: `Hi ${job.name},\n\nYour move is CONFIRMED!\n\nBooking Ref: ${bookingRef}\nRoute: ${job.originCity} → ${job.destinationCity}\nDate: ${job.moveDate}\nDeposit Paid: $${job.depositAmount?.toLocaleString()} ✓\n\nYour coordinator will call 48hrs before your move.\n\nMoveMaster Pro`,
  });
}

export async function sendContactConfirmation(name: string, email: string, message: string): Promise<void> {
  await send({ to: email, subject: 'Message Received — MoveMaster Pro', text: `Hi ${name},\n\nThanks for reaching out. We will reply within 24 hours.\n\nYour message: "${message}"\n\nMoveMaster Pro` });
  await send({ to: env.email.adminEmail, subject: `Contact from ${name}`, text: `From: ${name} <${email}>\n\n${message}` });
}
