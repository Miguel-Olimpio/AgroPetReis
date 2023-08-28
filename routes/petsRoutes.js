const { PetsController } = require('../controllers/petsController.js');
const { checkAuth } = require('../helpers/helpers.js');
const express = require('express');

const petsRouter = express.Router()

// Pets
petsRouter.get('/pets',checkAuth, PetsController.pets )
petsRouter.get('/registerPet',checkAuth, PetsController.registerPet )
petsRouter.post('/registerPet',checkAuth, PetsController.registerPetPost)

module.exports = { petsRouter }