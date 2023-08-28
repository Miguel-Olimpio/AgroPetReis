const express = require('express');
const { checkAuth } = require('../helpers/helpers.js');
const { AdminController } = require('../controllers/adminController.js');


const adminRouter = express.Router();

adminRouter.get('/queries',checkAuth, AdminController.showQueries);
adminRouter.get('/allchips',checkAuth, AdminController.showRecords);
adminRouter.post('/removeAdmin',checkAuth, AdminController.removeRequestAdmin);
adminRouter.post('/:year/:month/:day/:hour/adminRequest',checkAuth, AdminController.requestAdminPost);

module.exports = { adminRouter }