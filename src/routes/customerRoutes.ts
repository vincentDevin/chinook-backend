// src/routes/customerRoutes.ts

import { Router } from 'express';
import * as customerController from '../controllers/customerController';

const router = Router();

router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;
