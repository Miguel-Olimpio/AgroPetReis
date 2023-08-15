import { PetsController } from '../controllers/petsController.js'
import { checkAuth } from '../helpers/helpers.js'
import express from 'express'

const petsRouter = express.Router()

// Pets
petsRouter.get('/pets',checkAuth, PetsController.pets )
petsRouter.get('/registerPet',checkAuth, PetsController.registerPet )
petsRouter.post('/registerPet',checkAuth, PetsController.registerPetPost)

export { petsRouter }