import express from 'express'
import { AuthController } from '../controllers/authController.js'

const authRouter = express.Router()

// Adm
authRouter.get('/loginAdm', AuthController.loginAdmin )
authRouter.post('/loginAdm', AuthController.loginAdminPost )
authRouter.get('/registerAdm', AuthController.registerAdmin )
authRouter.post('/registerAdm', AuthController.registerAdminPost)

// User
authRouter.get('/loginUser', AuthController.loginUser )
authRouter.post('/loginUser', AuthController.loginUserPost )
authRouter.get('/registerUser', AuthController.registerUser )
authRouter.post('/registerUser', AuthController.registerUserPost)

// logout
authRouter.get('/logout', AuthController.logout)

export { authRouter }