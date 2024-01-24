import { Op } from 'sequelize';
import moment from 'moment';
import { Scheduling } from '../models/request.js';
import { VeterinaryRecord } from '../models/veterinaryRecord.js';
import { AdminUsers } from '../models/admin.js';
import { WhatsController } from '../controllers/whatsController.js';
import { User } from '../models/user.js';
import { Pet } from '../models/Pets.js';

const confirmDay = WhatsController.confirmDay;
const verification = WhatsController.vaccineWarning

// Função para agrupar as requisições por data
function groupSchedulesByDate(schedules) {
  const groupedSchedules = {};

  schedules.forEach((schedule) => {
    const date = moment(schedule.date).format("DD-MM-YYYY");
    if (!groupedSchedules[date]) {
      groupedSchedules[date] = [];
    }

    const userName = schedule.User ? schedule.User.dataValues.name : 'admin';

    groupedSchedules[date].push({
      hour: schedule.hour,
      userName: userName,
      petName: schedule.pet,
      id: schedule.id
    });
  });

  return groupedSchedules;
}

class AdminController {

  static async whatsConfirmationDay(req, res) {
    res.render('admin/loading');
  }

  static async success(req,res){
    res.render('admin/success')
  }

  static async whatsVerificationVacinePost(req, res) {
    try {
      await verification();
      res.redirect('/success');

    } catch (e) {
      console.log(`----------------------------ta aqui desgraça -> ${e}-------------------------------------`);
    }
  }

  static async whatsConfirmationDayPost(req, res) {
    try {
      await confirmDay();
      res.redirect('/success');

    } catch (e) {
      console.log(`----------------------------ta aqui desgraça -> ${e}-------------------------------------`);
    }
  }

  static async showQueries(req, res) {
    // Buscar todas as requisições no banco de dados, incluindo as informações do usuário associado
    const allSchedules = await Scheduling.findAll({
      include: [User],
      order: [["date", "ASC"], ["hour", "ASC"]], // Ordenar por data e hora
    });

    // Agrupar as requisições por data
    const groupedSchedules = groupSchedulesByDate(allSchedules);

    // console.log(groupedSchedules)

    for (const data in groupedSchedules) {

      // Data atual

      const atualDate = moment();
      const atualDay = atualDate.date();
      const atualMonth = atualDate.month() + 1;
      const atualYear = atualDate.year();

      // Data das consultas

      const partesDate = data.split('-');

      const valueDay = partesDate[0];
      const intDay = parseInt(valueDay, 10);

      const valueMonth = partesDate[1];
      const intMonth = parseInt(valueMonth, 10);

      const valueYear = partesDate[2];
      const intYear = parseInt(valueYear);

      if (atualDay > valueDay && atualMonth >= valueMonth && atualYear >= valueYear) {
        for (const compromissos of groupedSchedules[data]) {

          if (compromissos.petName === 'admin') {
            await Scheduling.destroy({ where: { pet: compromissos.petName, } });
          }
        }
      }
    }

    // Buscar informações do adm
    const admInfo = await AdminUsers.findAll();

    const resumeAdmInfo = admInfo.map((result) => result.dataValues);

    // verificacao()

    // Renderizar o template Handlebars com as requisições agrupadas
    res.render('admin/adminQueries', { groupedSchedules, resumeAdmInfo });
  }

  static async showRecords(req, res) {

    let search = '';

    if (req.query.search) {
      search = req.query.search;
    }

    try {
      // Buscar todos os usuários no banco de dados, incluindo seus pets e suas fichas veterinárias
      const allUsers = await User.findAll({
        include: [{
          model: Pet,
          include: [VeterinaryRecord],
        }],
        where: {
          name: { [Op.like]: `%${search}%` }
        },
      });

      const allUsersResume = allUsers.map(results => results.dataValues);

      await res.render('admin/adminRecords', { allUsersResume });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao buscar as fichas veterinárias.");
    }
  }

  static async removeRequestAdmin(req, res) {

    const { year, month, day, hour, requestId, } = req.body;

    try {
      await Scheduling.destroy({ where: { id: requestId, hour: hour } });
      req.flash('message', 'Você cancelou o agendamento com sucesso');
      return req.session.save(() => {
        res.redirect(`/${year}/${month}/${day}/`);
      });
    } catch (error) { console.log(error) }
  }

  static async requestAdminPost(req, res) {
    const { year, month, day, hour } = req.body;
    const AdmUserId = req.session.userid;
    const normalizedDate = `${year}-${month}-${day}`;
    const normalizedHour = hour;
    const pet = "admin";
    const userId = null;
    try {
      await Scheduling.create({
        date: normalizedDate,
        pet: pet,
        hour: normalizedHour,
        UserId: userId,
        AdmUserId: AdmUserId
      });

      req.flash('message', 'horario indisponivel');

      return req.session.save(() => {
        res.redirect(`/${year}/${month}/${day}`);
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export { AdminController };
