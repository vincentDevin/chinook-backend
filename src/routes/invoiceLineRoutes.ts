// src/routes/invoiceLineRoutes.ts

import { Router } from 'express';
import * as invoiceLineController from '../controllers/invoiceLineController';

const router = Router();

router.get('/', invoiceLineController.getAllInvoiceLines);
router.get('/:id', invoiceLineController.getInvoiceLineById);
router.post('/', invoiceLineController.createInvoiceLine);
router.put('/:id', invoiceLineController.updateInvoiceLine);
router.delete('/:id', invoiceLineController.deleteInvoiceLine);

export default router;
