const express = require('express');
const { checkPetRegistered } = require('../helpers/helpers.js');
const { RequestController } = require('../controllers/requestController.js');

const requestRouter = express.Router();

requestRouter.get('/:year/:month/:day',checkPetRegistered, RequestController.getDayRequest);
requestRouter.get('/:year/:month/:day/:hour',checkPetRegistered, RequestController.requestHour);
requestRouter.post('/:year/:month/:day',checkPetRegistered, RequestController.localeDayRequest);
requestRouter.post('/:year/:month/:day/:hour',checkPetRegistered, RequestController.requestPost);
requestRouter.post('/remove',checkPetRegistered, RequestController.removeRequest);


module.exports = { requestRouter }
