// src/routes/invoiceRoutes.ts

import { Router } from 'express';
import * as invoiceController from '../controllers/invoiceController';

const router = Router();

router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.post('/', invoiceController.createInvoice);
router.put('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);

export default router;
