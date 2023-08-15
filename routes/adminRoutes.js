import express from 'express'
import { checkAuth } from '../helpers/helpers.js';
import { AdminController } from '../controllers/adminController.js'

const adminRouter = express.Router();

adminRouter.get('/queries',checkAuth, AdminController.showQueries);
adminRouter.get('/allchips',checkAuth, AdminController.showRecords);

export { adminRouter }