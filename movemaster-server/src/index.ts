import 'express-async-errors';
import express, { Request, Response, Router, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { body } from 'express-validator';

import { env } from './config/env';
import { isSeeded } from './database/db';
import { initEmail } from './services/email';
import { validate } from './middleware/validate.middleware';
import { authenticate, requireAdmin } from './middleware/auth.middleware';
import type { AuthRequest } from './middleware/auth.middleware';
import {
  registerUser, loginUser, refreshTokens,
  getUserById, updateUser, getAllUsers,
} from './services/auth.service';
import { calculateQuote } from './utils/pricing';
import {
  ok, created, badRequest, unauthorized, notFound, serverError,
} from './utils/response';
import {
  readCollection, findOne, insertOne, updateOne,
} from './database/db';
import { generateId, generateQuoteId, generateInvNum } from './utils/id';
import bookkeepingRoutes from './routes/bookkeeping.routes';
import type { Job, Invoice, ContactMessage, BookingStatus, MoveSize, ServiceType, QuoteInput } from './models/types';

// ─── Auth Router ──────────────────────────────────────────────────────────────
const authRouter = Router();

authRouter.post('/register',
  body('name').trim().isLength({ min: 2 }).withMessage('Name required'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Min 6 characters'),
  validate,
  async (req: Request, res: Response) => {
    try {
      const { user, tokens } = await registerUser(req.body.name, req.body.email, req.body.password);
      created(res, { user: { uid:user.uid, displayName:user.displayName, email:user.email, role:user.role }, tokens });
    } catch (e: unknown) { badRequest(res, (e as Error).message); }
  }
);

authRouter.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate,
  async (req: Request, res: Response) => {
    try {
      const { user, tokens } = await loginUser(req.body.email, req.body.password);
      ok(res, { user: { uid:user.uid, displayName:user.displayName, email:user.email, role:user.role }, tokens });
    } catch (e: unknown) { unauthorized(res, (e as Error).message); }
  }
);

authRouter.post('/refresh', async (req: Request, res: Response) => {
  if (!req.body.refreshToken) { badRequest(res, 'refreshToken required'); return; }
  try {
    const { user, tokens } = await refreshTokens(req.body.refreshToken);
    ok(res, { user: { uid:user.uid, displayName:user.displayName, email:user.email, role:user.role }, tokens });
  } catch (e: unknown) { unauthorized(res, (e as Error).message); }
});

authRouter.post('/demo', async (_req: Request, res: Response) => {
  try {
    const { user, tokens } = await loginUser('demo@movemaster.pro', 'demo1234');
    ok(res, { user: { uid:user.uid, displayName:user.displayName, email:user.email, role:user.role }, tokens });
  } catch (e: unknown) { unauthorized(res, (e as Error).message); }
});

authRouter.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  const user = getUserById(req.user!.uid);
  if (!user) { notFound(res,'User not found'); return; }
  ok(res, { uid:user.uid, displayName:user.displayName, email:user.email, phone:user.phone, preferredCity:user.preferredCity, role:user.role });
});

authRouter.patch('/me', authenticate, (req: AuthRequest, res: Response) => {
  const u = updateUser(req.user!.uid, { displayName:req.body.displayName, phone:req.body.phone, preferredCity:req.body.preferredCity });
  if (!u) { notFound(res,'User not found'); return; }
  ok(res, { uid:u.uid, displayName:u.displayName, email:u.email, phone:u.phone, preferredCity:u.preferredCity, role:u.role });
});

// ─── Quotes Router ────────────────────────────────────────────────────────────
const VALID_SIZES: MoveSize[] = ['studio','1-bedroom','2-bedroom','3-bedroom','4-bedroom','office-small','office-large'];
const VALID_SVCS:  ServiceType[] = ['residential','commercial','long-distance','packing','storage','specialty','last-minute','senior'];
const quotesRouter = Router();

quotesRouter.post('/estimate',
  body('moveSize').isIn(VALID_SIZES),
  body('serviceType').isIn(VALID_SVCS),
  validate,
  (req: Request, res: Response) => {
    const input: QuoteInput = {
      serviceType:req.body.serviceType, moveSize:req.body.moveSize,
      originCity:req.body.originCity??'', destinationCity:req.body.destinationCity??'',
      needsPacking:!!req.body.needsPacking, needsStorage:!!req.body.needsStorage,
      hasSpecialtyItems:!!req.body.hasSpecialtyItems,
      floorOrigin:req.body.floorOrigin??1, floorDestination:req.body.floorDestination??1,
      hasElevator:req.body.hasElevator!==false,
    };
    ok(res, calculateQuote(input));
  }
);

quotesRouter.post('/',
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').notEmpty(),
  body('moveSize').isIn(VALID_SIZES),
  body('serviceType').isIn(VALID_SVCS),
  body('originCity').notEmpty(),
  body('destinationCity').notEmpty(),
  validate,
  (req: Request, res: Response) => {
    const b = req.body;
    const est = calculateQuote({
      serviceType:b.serviceType, moveSize:b.moveSize,
      originCity:b.originCity, destinationCity:b.destinationCity,
      needsPacking:!!b.needsPacking, needsStorage:!!b.needsStorage,
      hasSpecialtyItems:!!b.hasSpecialtyItems,
      floorOrigin:b.floorOrigin??1, floorDestination:b.floorDestination??1,
      hasElevator:b.hasElevator!==false,
    });
    const id  = generateQuoteId();
    const inv = generateInvNum();
    const now = new Date().toISOString();
    const job: Job = {
      id, name:b.name, email:b.email, phone:b.phone,
      moveDate:b.moveDate, moveSize:b.moveSize, serviceType:b.serviceType,
      originAddress:b.originAddress, originCity:b.originCity,
      destinationAddress:b.destinationAddress, destinationCity:b.destinationCity,
      needsPacking:!!b.needsPacking, needsStorage:!!b.needsStorage,
      hasSpecialtyItems:!!b.hasSpecialtyItems, specialtyDetails:b.specialtyDetails,
      floorOrigin:b.floorOrigin??1, floorDestination:b.floorDestination??1,
      hasElevator:b.hasElevator!==false,
      estimatedHours:est.estimatedHours, hourlyRate:est.hourlyRate,
      estimatedPrice:est.totalMin, depositAmount:est.depositAmount,
      status:'pending', depositPaid:false, invoiceNumber:inv,
      hearAboutUs:b.hearAboutUs, notes:b.notes, createdAt:now, updatedAt:now,
    };
    insertOne('jobs', job);
    const invoice: Invoice = {
      id:`inv-${id}`, invoiceNumber:inv, jobId:id,
      clientName:b.name, clientEmail:b.email, clientPhone:b.phone,
      serviceType:b.serviceType, moveDate:b.moveDate,
      route:`${b.originCity} → ${b.destinationCity}`,
      subtotal:est.totalMin, depositPaid:0, balanceDue:est.totalMin,
      status:'unpaid', issuedAt:now,
      lineItems:[{ description:`${b.serviceType} Move (${b.moveSize})`, hours:est.estimatedHours, rate:est.hourlyRate, amount:est.basePrice }],
      notes:b.notes, createdAt:now,
    };
    insertOne('invoices', invoice);
    created(res, job, 'Quote submitted. We will call you within 2 hours.');
  }
);

quotesRouter.get('/mine', authenticate, (req: AuthRequest, res: Response) => {
  ok(res, readCollection<Job>('jobs').filter(j=>j.email===req.user!.email));
});

quotesRouter.get('/', authenticate, requireAdmin, (req: Request, res: Response) => {
  let jobs = readCollection<Job>('jobs');
  const { status } = req.query as { status?: string };
  if (status) jobs = jobs.filter(j=>j.status===status);
  ok(res, jobs);
});

quotesRouter.get('/:id', authenticate, (req: AuthRequest, res: Response) => {
  const job = findOne<Job>('jobs', j=>j.id===req.params.id);
  if (!job) { notFound(res,'Quote not found'); return; }
  ok(res, job);
});

quotesRouter.patch('/:id/status', authenticate, requireAdmin, (req: Request, res: Response) => {
  const VALID: BookingStatus[] = ['pending','confirmed','in-progress','completed','cancelled'];
  if (!VALID.includes(req.body.status)) { badRequest(res,'Invalid status'); return; }
  const now = new Date().toISOString();
  const updated = updateOne<Job>('jobs', req.params.id, { status:req.body.status, updatedAt:now, ...(req.body.status==='completed'?{completedAt:now}:{}) });
  if (!updated) { notFound(res,'Quote not found'); return; }
  if (req.body.status==='completed') updateOne<Invoice>('invoices', `inv-${req.params.id}`, { status:'paid', paidAt:now, balanceDue:0 });
  ok(res, updated, `Status updated to ${req.body.status}`);
});

quotesRouter.post('/:id/confirm-deposit', authenticate, (req: Request, res: Response) => {
  const now = new Date().toISOString();
  const updated = updateOne<Job>('jobs', req.params.id, { depositPaid:true, depositPaidAt:now, status:'confirmed', updatedAt:now });
  if (!updated) { notFound(res,'Quote not found'); return; }
  ok(res, updated, 'Deposit confirmed. Booking locked in.');
});

// ─── Contact Router ───────────────────────────────────────────────────────────
const contactRouter = Router();

contactRouter.post('/',
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('message').trim().isLength({ min: 10 }),
  validate,
  (req: Request, res: Response) => {
    const msg: ContactMessage = {
      id:generateId(), name:req.body.name, email:req.body.email,
      phone:req.body.phone, serviceType:req.body.serviceType,
      message:req.body.message, read:false, createdAt:new Date().toISOString(),
    };
    insertOne('messages', msg);
    created(res, { id:msg.id }, 'Message received. We will respond within 24 hours.');
  }
);

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();

app.use(helmet({ crossOriginResourcePolicy:{ policy:'cross-origin' } }));
app.use(cors({
  origin: (origin, cb) => (!origin||env.cors.allowedOrigins.includes(origin)||env.isDev) ? cb(null,true) : cb(new Error('CORS blocked')),
  credentials:true, methods:['GET','POST','PATCH','PUT','DELETE','OPTIONS'],
  allowedHeaders:['Content-Type','Authorization'],
}));
app.use(compression());
app.use(morgan(env.isDev ? 'dev' : 'combined'));
app.use(express.json({ limit:'2mb' }));
app.use(express.urlencoded({ extended:true }));

const base = `/api/${env.apiVersion}`;

app.get('/health', (_req, res) => res.json({ status:'ok', service:'movemaster-pro-api', version:env.apiVersion, timestamp:new Date().toISOString(), uptime:process.uptime() }));
app.get('/', (_req, res) => res.json({ name:'MoveMaster Pro API', version:env.apiVersion, health:'/health', api:base }));

app.use(`${base}/auth`,        authRouter);
app.use(`${base}/quotes`,      quotesRouter);
app.use(`${base}/contact`,     contactRouter);
app.use(`${base}/bookkeeping`, bookkeepingRoutes);

// 404
app.use((req:Request, res:Response) => res.status(404).json({ success:false, error:`Route not found: ${req.method} ${req.path}`, code:'NOT_FOUND' }));

// Error handler
app.use((err:Error, req:Request, res:Response, _next:NextFunction) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  if (err.name==='JsonWebTokenError'||err.name==='TokenExpiredError') {
    res.status(401).json({ success:false, error:'Invalid or expired token', code:'UNAUTHORIZED' }); return;
  }
  serverError(res, env.isDev ? err.message : 'Internal server error');
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
async function boot(): Promise<void> {
  console.log('\n🚛  MoveMaster Pro API');
  console.log('━'.repeat(44));
  console.log(`  Env      : ${env.nodeEnv}`);
  console.log(`  Port     : ${env.port}`);
  console.log(`  API Base : ${base}`);
  console.log(`  Storage  : JSON files in ./data/`);
  console.log('━'.repeat(44));

  if (!isSeeded()) {
    console.log('\n  ⚠  No data found. Running npm run db:seed first...\n');
    const { execSync } = require('child_process');
    try {
      execSync('npm run db:seed', { stdio:'inherit' });
    } catch {
      console.log('  Auto-seed failed. Run: npm run db:seed manually\n');
    }
  } else {
    const jobs = readCollection('jobs');
    console.log(`\n  ✓ Data ready — ${jobs.length} jobs in database`);
  }

  initEmail();

  app.listen(env.port, () => {
    console.log(`\n✅  Server running at http://localhost:${env.port}`);
    console.log(`   Health : http://localhost:${env.port}/health`);
    console.log(`   API    : http://localhost:${env.port}${base}\n`);
  });
}

boot().catch((err) => { console.error('Boot failed:', err); process.exit(1); });

export default app;
