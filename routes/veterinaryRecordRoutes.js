import express from 'express';
import { VeterinaryRecordController } from '../controllers/veterinaryRecordController.js';
import { checkAuth, checkAdmAuth } from '../helpers/helpers.js';

const veterinaryRecordRouter = express.Router();

// veterinaryRecord
veterinaryRecordRouter.get('/veterinaryRecordDate/:id/:petName/:date', checkAuth, VeterinaryRecordController.showVeterinaryRecordDate);
veterinaryRecordRouter.get('/veterinaryRecord/:id', checkAuth, VeterinaryRecordController.showVeterinaryRecord);
veterinaryRecordRouter.get('/registerVeterinaryRecord/:id', checkAuth, VeterinaryRecordController.registerVeterinaryRecord);
veterinaryRecordRouter.post('/registerVeterinaryRecord/:id', checkAdmAuth, VeterinaryRecordController.registerVeterinaryRecordPost);
veterinaryRecordRouter.get('/editVeterinaryRecord/:id', checkAuth, VeterinaryRecordController.editVeterinaryRecord);
veterinaryRecordRouter.post('/editVeterinaryRecord', checkAdmAuth, VeterinaryRecordController.editVeterinaryRecordPost);
veterinaryRecordRouter.get('/downloadRecipe/:id', VeterinaryRecordController.downloadRecipe);

export { veterinaryRecordRouter };

