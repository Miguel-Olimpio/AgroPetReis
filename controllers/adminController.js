import { Pet } from "../models/Pets.js";
import { User } from "../models/user.js";
import { Op } from "sequelize";
import { Scheduling } from "../models/request.js";
import { VeterinaryRecord } from "../models/veterinaryRecord.js";
import moment from "moment";

// Função para agrupar as requisições por data
function groupSchedulesByDate(schedules) {
  const groupedSchedules = {};

  schedules.forEach((schedule) => {
    const date = moment(schedule.date).format("DD-MM-YYYY");
    if (!groupedSchedules[date]) {
      groupedSchedules[date] = [];
    }

    groupedSchedules[date].push({
      hour: schedule.hour,
      userName: schedule.User.name,
      petName: schedule.pet,
      id: schedule.id
    });
  });

  return groupedSchedules;
}



class AdminController {

  static async showQueries(req, res) {
    // Buscar todas as requisições no banco de dados, incluindo as informações do usuário associado
    const allSchedules = await Scheduling.findAll({
      include: [User],
      order: [["date", "ASC"], ["hour", "ASC"]], // Ordenar por data e hora
    });

    // Agrupar as requisições por data
    const groupedSchedules = groupSchedulesByDate(allSchedules);

    // Renderizar o template Handlebars com as requisições agrupadas
    res.render('admin/adminQueries', { groupedSchedules });
  }

  static async showRecords(req, res) {

    let search = '';

    if(req.query.search){
      search = req.query.search
    }

    try {
      // Buscar todos os usuários no banco de dados, incluindo seus pets e suas fichas veterinárias
      const allUsers = await User.findAll({
        include: [{
          model: Pet,
          include: [VeterinaryRecord],
        }],
        where:{
          name: {[Op.like]: `%${search}%`}
        },
      });
      const allUsersResume = allUsers.map(results => results.dataValues)
      await res.render('admin/adminRecords', { allUsersResume, messages: req.flash() });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao buscar as fichas veterinárias.");
    }
  }

  static async removeRequestAdmin(req, res) {

      const { year, month, day, hour,requestId } = req.body
      const UserId = req.session.userid

      try {
          await Scheduling.destroy({ where: { id: requestId, AdmUserId: UserId, hour: hour } })
          await req.flash('message', 'Você cancelou seu agendamento com sucesso');
          await res.redirect(`/${year}/${month}/${day}/`);
      } catch (error) { console.log(error) }
  }
  
  static async requestAdminPost(req, res) {
    const { year, month, day, hour } = req.body;
        const AdmUserId = req.session.userid;
        const normalizedDate = `${year}-${month}-${day}`;
        const normalizedHour = hour;
        const pet = "admin"
        const userId = null;
        try {
            await Scheduling.create({
                date: normalizedDate,
                pet: pet,
                hour: normalizedHour,
                UserId: userId,
                AdmUserId: AdmUserId
            });
    
            await req.flash('message', 'horario indisponivel');
            await res.redirect(`/${year}/${month}/${day}`);
        } catch (error) {
            console.log(error);
        }
  }
}

export { AdminController }