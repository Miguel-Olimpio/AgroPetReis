import express from 'express';
import { checkAuth } from '../helpers/helpers.js';
import { AdminController } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/loading', checkAuth, AdminController.whatsConfirmationDay);
adminRouter.post('/whatsconfirm', checkAuth, AdminController.whatsConfirmationDayPost);
adminRouter.post('/whatsverification', checkAuth, AdminController.whatsVerificationVacinePost);
adminRouter.get('/success', checkAuth, AdminController.success);
adminRouter.get('/queries', checkAuth, AdminController.showQueries);
adminRouter.get('/allchips', checkAuth, AdminController.showRecords);
adminRouter.post('/removeAdmin', checkAuth, AdminController.removeRequestAdmin);
adminRouter.post('/:year/:month/:day/:hour/adminRequest', checkAuth, AdminController.requestAdminPost);

export { adminRouter };
