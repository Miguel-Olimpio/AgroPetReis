import express from 'express';
import { AuthController } from '../controllers/authController.js';
import { checkAuth } from '../helpers/helpers.js';

const authRouter = express.Router();

// Adm
authRouter.get('/loginAdm', AuthController.loginAdmin);
authRouter.post('/loginAdm', AuthController.loginAdminPost);

// User
authRouter.get('/loginUser', AuthController.loginUser);
authRouter.post('/loginUser', AuthController.loginUserPost);
authRouter.get('/registerUser', AuthController.registerUser);
authRouter.post('/registerUser', AuthController.registerUserPost);
authRouter.get('/editUser',checkAuth, AuthController.editUser);
authRouter.post('/editUser',checkAuth, AuthController.editUserPost);

// logout
authRouter.get('/logout', AuthController.logout);

export { authRouter };
