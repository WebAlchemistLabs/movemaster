import { Request, Response } from 'express';
import { readCollection, findOne, updateOne, insertOne } from '../database/db';
import { ok, notFound, badRequest, created } from '../utils/response';
import { generateId } from '../utils/id';
import type { AuthRequest } from '../middleware/auth.middleware';
import type { Job, Client, Invoice, Transaction, ContactMessage, BookingStatus } from '../models/types';

// ─── Dashboard ────────────────────────────────────────────────────────────────
export async function getDashboardStats(_req: Request, res: Response): Promise<void> {
  const jobs  = readCollection<Job>('jobs');
  const txns  = readCollection<Transaction>('transactions');
  const msgs  = readCollection<ContactMessage>('messages');
  const clients = readCollection<Client>('clients');

  const now = new Date();
  const todayStr  = now.toISOString().split('T')[0];
  const monthStr  = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;

  const totalCollected = txns.filter(t=>t.status==='completed').reduce((s,t)=>s+t.amount,0);
  const thisMonthRev   = txns.filter(t=>t.status==='completed'&&t.createdAt.startsWith(monthStr)).reduce((s,t)=>s+t.amount,0);
  const pipeline = jobs.filter(j=>['pending','confirmed','in-progress'].includes(j.status)).reduce((s,j)=>s+(j.estimatedPrice||0),0);

  const svcBreakdown = ['residential','commercial','long-distance','packing','storage','specialty','last-minute','senior'].map(type=>({
    type, count: jobs.filter(j=>j.serviceType===type).length,
    revenue: jobs.filter(j=>j.serviceType===type&&j.depositPaid).reduce((s,j)=>s+(j.depositAmount||0),0),
  })).filter(s=>s.count>0);

  const cityMap: Record<string,number> = {};
  jobs.forEach(j=>{ cityMap[j.originCity]=(cityMap[j.originCity]||0)+1; cityMap[j.destinationCity]=(cityMap[j.destinationCity]||0)+1; });
  const cityBreakdown = Object.entries(cityMap).map(([city,count])=>({city,count})).sort((a,b)=>b.count-a.count).slice(0,10);

  ok(res, {
    jobs: {
      total: jobs.length,
      pending:    jobs.filter(j=>j.status==='pending').length,
      confirmed:  jobs.filter(j=>j.status==='confirmed').length,
      inProgress: jobs.filter(j=>j.status==='in-progress').length,
      completed:  jobs.filter(j=>j.status==='completed').length,
      cancelled:  jobs.filter(j=>j.status==='cancelled').length,
      today:      jobs.filter(j=>j.createdAt.startsWith(todayStr)).length,
      thisMonth:  jobs.filter(j=>j.createdAt.startsWith(monthStr)).length,
    },
    revenue: { totalCollected, thisMonth: thisMonthRev, pipeline },
    clients: clients.length,
    unreadMessages: msgs.filter(m=>!m.read).length,
    recentJobs:  jobs.slice(0,10),
    upcoming:    jobs.filter(j=>['confirmed','in-progress'].includes(j.status)).slice(0,6),
    serviceBreakdown: svcBreakdown,
    cityBreakdown,
  });
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export async function listJobs(req: Request, res: Response): Promise<void> {
  let jobs = readCollection<Job>('jobs');
  const { status, city, service, search } = req.query as Record<string,string>;
  if (status)  jobs = jobs.filter(j=>j.status===status);
  if (city)    jobs = jobs.filter(j=>j.originCity===city||j.destinationCity===city);
  if (service) jobs = jobs.filter(j=>j.serviceType===service);
  if (search) {
    const s = search.toLowerCase();
    jobs = jobs.filter(j=>j.name.toLowerCase().includes(s)||j.email.toLowerCase().includes(s)||j.phone.includes(s)||(j.invoiceNumber||'').toLowerCase().includes(s));
  }
  ok(res, jobs);
}

export async function getJob(req: Request, res: Response): Promise<void> {
  const job = findOne<Job>('jobs', j=>j.id===req.params.id);
  if (!job) { notFound(res,'Job not found'); return; }
  const invoice = findOne<Invoice>('invoices', i=>i.jobId===req.params.id);
  const transactions = readCollection<Transaction>('transactions').filter(t=>t.jobId===req.params.id);
  const client = job.clientId ? findOne<Client>('clients', c=>c.id===job.clientId) : null;
  ok(res, { job, invoice, transactions, client });
}

export async function updateJobStatus(req: Request, res: Response): Promise<void> {
  const VALID: BookingStatus[] = ['pending','confirmed','in-progress','completed','cancelled'];
  const { status, finalPrice, assignedCrew, notes } = req.body as Record<string,string>;
  if (!VALID.includes(status as BookingStatus)) { badRequest(res,`Invalid status. Must be: ${VALID.join(', ')}`); return; }

  const now = new Date().toISOString();
  const updates: Partial<Job> = { status: status as BookingStatus, updatedAt: now };
  if (status==='completed') updates.completedAt = now;
  if (finalPrice)   updates.finalPrice   = parseFloat(finalPrice);
  if (assignedCrew) updates.assignedCrew = assignedCrew;
  if (notes)        updates.notes        = notes;

  const updated = updateOne<Job>('jobs', req.params.id, updates);
  if (!updated) { notFound(res,'Job not found'); return; }

  if (status==='completed') {
    updateOne<Invoice>('invoices', `inv-${req.params.id}`, { status:'paid', paidAt:now, balanceDue:0 });
  }
  ok(res, updated, `Job updated to ${status}`);
}

// ─── Clients ──────────────────────────────────────────────────────────────────
export async function listClients(req: Request, res: Response): Promise<void> {
  let clients = readCollection<Client>('clients');
  const { search, city } = req.query as Record<string,string>;
  if (search) { const s=search.toLowerCase(); clients=clients.filter(c=>c.fullName.toLowerCase().includes(s)||c.email.toLowerCase().includes(s)||c.phone.includes(s)); }
  if (city) clients = clients.filter(c=>c.city===city);
  ok(res, clients);
}

export async function getClient(req: Request, res: Response): Promise<void> {
  const client = findOne<Client>('clients', c=>c.id===req.params.id);
  if (!client) { notFound(res,'Client not found'); return; }
  const jobs = readCollection<Job>('jobs').filter(j=>j.clientId===req.params.id);
  const txns = readCollection<Transaction>('transactions').filter(t=>t.clientId===req.params.id);
  const stats = {
    totalSpent: txns.reduce((s,t)=>s+t.amount,0),
    totalMoves: jobs.length,
    avgJobValue: jobs.length>0 ? jobs.reduce((s,j)=>s+(j.estimatedPrice||0),0)/jobs.length : 0,
  };
  ok(res, { client, jobs, transactions: txns, stats });
}

// ─── Invoices ─────────────────────────────────────────────────────────────────
export async function listInvoices(req: Request, res: Response): Promise<void> {
  let invoices = readCollection<Invoice>('invoices');
  const { status } = req.query as Record<string,string>;
  if (status) invoices = invoices.filter(i=>i.status===status);
  ok(res, invoices);
}

export async function getInvoice(req: Request, res: Response): Promise<void> {
  const invoice = findOne<Invoice>('invoices', i=>i.id===req.params.id||i.invoiceNumber===req.params.id);
  if (!invoice) { notFound(res,'Invoice not found'); return; }
  const txns = readCollection<Transaction>('transactions').filter(t=>t.invoiceId===invoice.id);
  ok(res, { invoice, transactions: txns });
}

// ─── Transactions ─────────────────────────────────────────────────────────────
export async function listTransactions(req: Request, res: Response): Promise<void> {
  let txns = readCollection<Transaction>('transactions');
  const { type } = req.query as Record<string,string>;
  if (type) txns = txns.filter(t=>t.type===type);
  ok(res, txns);
}

export async function recordTransaction(req: AuthRequest, res: Response): Promise<void> {
  const { jobId, invoiceId, clientId, type, amount, method, description } = req.body as Record<string,string>;
  if (!type||!amount||!description) { badRequest(res,'type, amount and description required'); return; }

  const txn: Transaction = {
    id: generateId(), jobId: jobId||undefined, invoiceId: invoiceId||undefined,
    clientId: clientId||undefined, type: type as Transaction['type'],
    amount: parseFloat(amount), method: method||'card', description,
    status: 'completed', createdAt: new Date().toISOString(),
  };
  insertOne('transactions', txn);

  if (type==='balance'&&invoiceId) updateOne<Invoice>('invoices', invoiceId, { status:'paid', paidAt:new Date().toISOString(), balanceDue:0 });
  if (type==='deposit'&&jobId)     updateOne<Job>('jobs', jobId, { depositPaid:true, depositPaidAt:new Date().toISOString() });

  created(res, txn, 'Transaction recorded');
}

// ─── Financial Report ─────────────────────────────────────────────────────────
export async function getFinancialReport(req: Request, res: Response): Promise<void> {
  const { year = String(new Date().getFullYear()) } = req.query as { year?: string };
  const txns = readCollection<Transaction>('transactions').filter(t=>t.createdAt.startsWith(year)&&t.status==='completed');
  const jobs  = readCollection<Job>('jobs').filter(j=>j.status==='completed'&&(j.completedAt||'').startsWith(year));
  const clients = readCollection<Client>('clients');

  const monthly = Array.from({length:12},(_,i)=>{
    const m = String(i+1).padStart(2,'0');
    const prefix = `${year}-${m}`;
    const rev = txns.filter(t=>t.createdAt.startsWith(prefix)).reduce((s,t)=>s+t.amount,0);
    const cnt = jobs.filter(j=>(j.completedAt||'').startsWith(prefix)).length;
    return { month:m, revenue:rev, jobs:cnt };
  });

  const byService = ['residential','commercial','long-distance','packing','storage','specialty','last-minute','senior'].map(type=>({
    type, jobs: jobs.filter(j=>j.serviceType===type).length,
    revenue: jobs.filter(j=>j.serviceType===type).reduce((s,j)=>s+(j.finalPrice||0),0),
    avgValue: (() => { const jj=jobs.filter(j=>j.serviceType===type); return jj.length>0?jj.reduce((s,j)=>s+(j.finalPrice||0),0)/jj.length:0; })(),
  })).filter(s=>s.jobs>0);

  const topClients = [...clients].sort((a,b)=>b.totalSpent-a.totalSpent).slice(0,10);
  const totals = { totalRevenue: txns.reduce((s,t)=>s+t.amount,0), totalJobs: jobs.length, avgJobValue: jobs.length>0?jobs.reduce((s,j)=>s+(j.finalPrice||0),0)/jobs.length:0 };

  ok(res, { year, monthly, byService, topClients, totals });
}

// ─── Messages ─────────────────────────────────────────────────────────────────
export async function listMessages(_req: Request, res: Response): Promise<void> {
  ok(res, readCollection<ContactMessage>('messages'));
}

export async function markMessageRead(req: Request, res: Response): Promise<void> {
  const updated = updateOne<ContactMessage>('messages', req.params.id, { read: true });
  if (!updated) { notFound(res,'Message not found'); return; }
  ok(res, { id: req.params.id, read: true });
}
