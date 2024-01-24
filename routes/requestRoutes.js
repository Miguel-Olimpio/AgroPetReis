import express from 'express';
import { checkPetRegistered } from '../helpers/helpers.js';
import { RequestController } from '../controllers/requestController.js';

const requestRouter = express.Router();

requestRouter.get('/:year/:month/:day', checkPetRegistered, RequestController.getDayRequest);
requestRouter.get('/:year/:month/:day/:hour', checkPetRegistered, RequestController.requestHour);
requestRouter.post('/:year/:month/:day', checkPetRegistered, RequestController.localeDayRequest);
requestRouter.post('/:year/:month/:day/:hour', checkPetRegistered, RequestController.requestPost);
requestRouter.post('/remove', checkPetRegistered, RequestController.removeRequest);

export { requestRouter };

