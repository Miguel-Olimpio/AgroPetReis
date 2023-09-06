const express = require('express');
const { AuthController } = require('../controllers/authController.js');

const authRouter = express.Router()

// Adm
authRouter.get('/loginAdm', AuthController.loginAdmin )
authRouter.post('/loginAdm', AuthController.loginAdminPost )

// User
authRouter.get('/loginUser', AuthController.loginUser )
authRouter.post('/loginUser', AuthController.loginUserPost )
authRouter.get('/registerUser', AuthController.registerUser )
authRouter.post('/registerUser', AuthController.registerUserPost)

// logout
authRouter.get('/logout', AuthController.logout)

module.exports = { authRouter }