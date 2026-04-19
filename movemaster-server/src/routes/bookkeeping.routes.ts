import { Router } from 'express';
import {
  getDashboardStats,
  listJobs, getJob, updateJobStatus,
  listClients, getClient,
  listInvoices, getInvoice,
  listTransactions, recordTransaction,
  getFinancialReport,
  listMessages, markMessageRead,
} from '../controllers/bookkeeping.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate, requireAdmin);

// Dashboard
router.get('/dashboard',         getDashboardStats);

// Jobs
router.get('/jobs',              listJobs);
router.get('/jobs/:id',          getJob);
router.patch('/jobs/:id/status', updateJobStatus);

// Clients
router.get('/clients',           listClients);
router.get('/clients/:id',       getClient);

// Invoices
router.get('/invoices',          listInvoices);
router.get('/invoices/:id',      getInvoice);

// Transactions
router.get('/transactions',      listTransactions);
router.post('/transactions',     recordTransaction);

// Financial report
router.get('/report',            getFinancialReport);

// Messages
router.get('/messages',          listMessages);
router.patch('/messages/:id/read', markMessageRead);

export default router;
