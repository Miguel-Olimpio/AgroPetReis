import { Pet } from "../models/Pets.js";
import { VeterinaryRecord } from "../models/veterinaryRecord.js";
import { Scheduling } from "../models/request.js";
import { User } from "../models/user.js";
import moment from "moment";

class VeterinaryRecordController {
  
  static async showVeterinaryRecord(req, res) {
    const id = req.params.id;
    const userId = req.session.userid;

    try {
      // Encontra o usuário logado e seus pets associados
      const user = await User.findOne({
        where: { id: userId },
        include: {
          model: Pet,
          where: { id: id },
          include: {
            model: VeterinaryRecord,
            order: [['date', 'ASC']]
          }
        },
      });

      if (!user) {
        await req.flash('message', 'Este Pet não está cadastrado para este usuário...');
        return res.redirect(`/pets`);
      }

      const pet = user.Pets.map(result => result.dataValues);
      const petName = pet[0].PetName;

      res.render('records/veterinaryRecord', {
        user,
        petName,
        id,
      });
    } catch (error) {
      console.log(error);
    }
}

  static async showVeterinaryRecordDate(req,res){
    const {id, date,petName} = req.params
    const veterinaryRecord = await VeterinaryRecord.findOne({where: {PetId: id, date:date}})
    const weight = veterinaryRecord.Weight
    const report = veterinaryRecord.report
    const revenue = veterinaryRecord.revenue
    const convertDate = veterinaryRecord.date    
    res.render('records/veterinaryRecordDate',{weight, convertDate, report, revenue, petName})
  }

  static async registerVeterinaryRecord(req, res) {
    const requestId = req.params
    const schedule = await Scheduling.findOne({
      where: { id: requestId.id },
      includes: User
    });

    const request = schedule.dataValues
    const date = request.date
    const petName = request.pet
    const pet = await Pet.findOne({ where: { PetName: petName } })
    const petId = pet.dataValues.id
 
    // Criar arrays com os valores dos dias, meses e anos
    const days = Array.from({ length: 31 }, (_, index) => index + 1);
    const months = moment.months();
    const currentYear = moment().year();
    const years = Array.from({ length: 6 }, (_, index) => currentYear + index);

    res.render("records/registerVeterinaryRecord", {
      petId,
      date,
      petName,
      days,
      months,
      years,
    });
  }

  static async registerVeterinaryRecordPost(req, res) {
    const { date, month, day, year, weight, report, revenue, PetId, petName } = req.body;
    const nextAppointment = `${year}-${month}-${day}`
    
    try {
      // Criar um novo registro veterinário para o pet
      await VeterinaryRecord.create({
        date,
        Weight: weight,
        report,
        revenue,
        nextAppointment,
        PetId,
      });

      await Scheduling.destroy({where: {pet: petName, date:date}})
      await req.flash('message', 'Registro veterinário criado com sucesso!');
      return res.redirect(`/allchips`);
    } catch (error) {
      console.log(error);
      return res.redirect(`/pets`);
    }
  }

  static async editVeterinaryRecord(req,res){
    const {id} = req.params

    const veterinaryRecord = await VeterinaryRecord.findOne({where: {id:id}})
    const resumeVeterinaryRecord = veterinaryRecord.dataValues
    
    const pet = await Pet.findOne({where: {id: resumeVeterinaryRecord.PetId}})
    const resumePet = pet.dataValues
    
    // Criar arrays com os valores dos dias, meses e anos
    const days = Array.from({ length: 31 }, (_, index) => index + 1);
    const months = moment.months();
    const currentYear = moment().year();
    const years = Array.from({ length: 6 }, (_, index) => currentYear + index);

    res.render('records/editVeterinaryRecord',{
      resumeVeterinaryRecord,
      resumePet,
      days,
      months,
      years,
      id,
    })
  }

  static async editVeterinaryRecordPost(req,res){
    const id = req.body.id
    console.log(id)
    const day = req.body.day
    const month = req.body.month
    const year = req.body.year

    const nextAppointment = `${year}-${month}-${day}`
    
    const veterinaryRecord = {
      Weight: req.body.Weight,
      report: req.body.report,
      revenue: req.body.revenue,
      nextAppointment: nextAppointment
    }
    try{
      await VeterinaryRecord.update(veterinaryRecord,{where: {id: id}})
      await req.flash('message', 'Registro veterinário editado com sucesso!');
      res.redirect('/allChips')
    }catch(error){console.log(error)}
  }
}

export { VeterinaryRecordController }