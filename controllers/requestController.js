const { User } = require('../models/user.js');
const { Scheduling } = require('../models/request.js');
const { Pet } = require('../models/Pets.js');
const { Op } = require('sequelize');
const { AdminUsers } = require('../models/admin.js');


class RequestController {

    static async getDayRequest(req, res) {
        const { year, month, day } = req.params;
        const userId = req.session.userid;
        const realMonth = parseInt(month) + 1
        // Obtém os horários fixos disponíveis
        const availableHours = [
            "10:00", "10:30", "11:00", "11:30",
            "14:00", "14:30", "15:00", "15:30",
            "16:00", "16:30", "17:00", "17:30"
        ].sort();

        // Obtém os horários já agendados para a data específica
        const scheduledAppointments = await Scheduling.findAll({
            where: {
                // date:date
                date: {
                    [Op.gte]: new Date(`${year}-${month}-${day}`),
                    [Op.lt]: new Date(`${year}-${month}-${day} 23:59:59`)
                }
            },
            attributes: ['hour', 'UserId']
        });

        // Mapeia os horários ocupados para facilitar a verificação
        const occupiedHours = scheduledAppointments.map(appointment => appointment.hour);
        const occupiedHoursSet = new Set(occupiedHours);

        // Mapeia os horários disponíveis e verifica o usuário para cada hora
        const hoursWithAvailability = availableHours.map((hour) => {
            const isAvailable = !occupiedHoursSet.has(hour);
            const isVerifiedUser = (userId < 50) || scheduledAppointments.some(appointment => {
                return appointment.UserId === userId && appointment.hour === hour;
            });

            return {
                hour: hour,
                isAvailable: isAvailable,
                verifiedUser: isVerifiedUser,
            };
        });
        // Obtém a lista de Pets do usuário logado
        const user = await User.findOne({
            where: { id: userId },
            plain: true
        });

        const adminUser = await AdminUsers.findOne({
            where: { id: userId },
            plain: true
        })

        let userName

        if (user && user.name !== null && user.name !== undefined) {
            userName = user.name;
        } else if (adminUser && adminUser.name !== null && adminUser.name !== undefined) {
            userName = adminUser.name;
        }

        // Renderiza a página com as informações necessárias
        res.render('calendar/dayRequest', {
            messages: req.flash(),
            realMonth,
            year,
            month,
            day,
            hoursWithAvailability,
            userName
        });
    }

    static async localeDayRequest(req, res) {
        const { month, day, year, hour } = req.body
        res.redirect(`/${year}/${month}/${day}/${hour}`)
    }

    static async requestHour(req, res) {
        const { year, month, day, hour } = req.params;
        const userId = req.session.userid;
        const realMonth = parseInt(month) + 1

        // Obtem o id da requisição caso ele exista
        let requestId;
        let scheduledPet = null

        const scheduledAppointments = await Scheduling.findOne({
            where: {
                date: {
                    [Op.gte]: new Date(`${year}-${month}-${day}`),
                    [Op.lt]: new Date(`${year}-${month}-${day} 23:59:59`)
                },
                hour: hour
            },
            attributes: ['UserId', 'id', 'pet']
        });

        // Verifica se scheduledAppointments é diferente de null antes de acessar a propriedade 'id'
        if (scheduledAppointments !== null && scheduledAppointments.id) {
            requestId = scheduledAppointments.id;
            scheduledPet = scheduledAppointments.pet;
        }

        // Obtém a lista de Pets do usuário logado
        const user = await User.findOne({
            where: { id: userId },
            include: Pet,
            plain: true
        });

        const adminUser = await AdminUsers.findOne({
            where: { id: userId },
            plain: true
        })

        let userName
        let pets

        if (userId >= 50) {
            userName = user.name;
            pets = user.Pets.map(pet => pet.dataValues);

        } else {

            if (scheduledAppointments !== null) {
                const scheduledUser = await User.findOne({
                    where: { id: scheduledAppointments.UserId },
                    include: Pet,
                    plain: true
                });

                userName = scheduledUser.name;
                pets = scheduledUser.Pets.map(pet => pet.dataValues);
            } else {
                userName = adminUser.name;
            }
        }


        res.render('calendar/requestHour', {
            year,
            month,
            realMonth,
            day,
            pets,
            hour,
            userName,
            requestId,
            scheduledPet,
            userId
        });
    }

    static async requestPost(req, res) {
        const { pet, year, month, day, hour } = req.body;
        const userId = req.session.userid;
        const normalizedDate = `${year}-${month}-${day}`;
        const normalizedHour = hour;
        try {
            const existingAppointment = await Scheduling.findOne({
                where: {
                    date: {
                        [Op.gte]: new Date(`${year}-${month}-${day}`),
                        [Op.lt]: new Date(`${year}-${month}-${day} 23:59:59`)
                    },
                    pet: pet,
                    UserId: userId
                }
            });
            if (existingAppointment) {
                req.flash('message', 'Este pet já possui um agendamento para este dia. Não é possível agendar mais de uma consulta para o mesmo pet no mesmo dia.');
                return req.session.save(() => {
                    res.redirect(`/${year}/${month}/${day}`);
                  })
            }
            const AdmUserId = 1
            // Caso não exista um agendamento para o mesmo pet na data especificada, crie o novo agendamento normalmente.
            await Scheduling.create({
                date: normalizedDate,
                pet: pet,
                hour: normalizedHour,
                UserId: userId,
                AdmUserId: AdmUserId
            });

            req.flash('message', 'Você Agendou seu horário com sucesso');
            req.session.save(() => {
                res.redirect(`/${year}/${month}/${day}`);
              })
        } catch (error) {
            console.log(error);
        }
    }

    static async removeRequest(req, res) {
        const { year, month, day, hour, requestId } = req.body
        const UserId = req.session.userid

        try {
            await Scheduling.destroy({ where: { id: requestId, UserId: UserId, hour: hour } })
            req.flash('message', 'Você cancelou seu agendamento com sucesso');
            req.session.save(() => {
                res.redirect(`/${year}/${month}/${day}`);
              })
        } catch (error) { console.log(error) }
    }
}

module.exports = { RequestController };