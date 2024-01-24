import { Pet } from '../models/Pets.js';
import { User } from '../models/user.js';

class PetsController {
  static async pets(req, res) {
    const userId = req.session.userid;
    const user = await User.findOne({
      where: { id: userId },
      include: Pet,
      plain: true
    });
    const Pets = user.Pets.map((result) => result.dataValues);
    res.render('pets/pets', { Pets, messages: req.flash() });
  }

  static async registerPet(req, res) {
    await res.render('pets/registerPet');
  }

  static async registerPetPost(req, res) {
    const animal = {
      PetName: req.body.PetName,
      species: req.body.species,
      race: req.body.race,
      UserId: req.session.userid
    };
    const pet = await Pet.findOne({ where: { PetName: animal.PetName, UserId: animal.UserId } });
    if (pet) {
      res.render('pets/registerPet', { message: 'Este pet já está cadastrado...' });
      return;
    }
    await Pet.create(animal);
    try {
      res.redirect('/pets');
    } catch (err) {
      console.log(err);
    }
  }
}

export { PetsController };
