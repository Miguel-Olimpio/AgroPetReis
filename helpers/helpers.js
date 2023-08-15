import { Pet } from "../models/Pets.js";
import { User } from "../models/user.js";
import moment from "moment";
import IMask from "imask/holder";

function isEqual(v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
}

function isGreaterOrEqual(v1, v2, options) {
  if (v1 >= v2) {
    return options.fn(this);
  }
  return options.inverse(this);
}

function isLess(v1, v2, options) {
  if (v1 < v2) {
    return options.fn(this);
  }
  return options.inverse(this);
}

function isBigger(v1, v2, options) {
  if (v1 > v2) {
    return options.fn(this);
  }
  return options.inverse(this);
}

function log(context) {
  console.log(context);
}

function isOccupied(time, occupiedHours) {
  return occupiedHours.includes(time);
}

function isNullOrUndefined(value) {
  return value === null || value === undefined;
}

async function checkAuth(req, res, next) {
  const userid = req.session.userid;

  if (!userid) {
    await req.flash('message', 'Usuario deve estar logado para realizar esta ação...');
    return res.redirect('/loginUser');
  }
  next();
}

async function checkAdmAuth(req,res,next){
  const userid = req.session.userid;

  if (userid != 1) {
    await req.flash('message', 'Você acessou como administrador visitante e não tem permição para realizar esta ação...');
    return await res.redirect('/allChips');
  }
  next();
}

async function checkPetRegistered(req, res, next) {
  const userid = req.session.userid;
  const currentPath = req.originalUrl;

  if (!userid) {
    await req.flash('message', 'Usuário deve estar logado para visualizar os horários disponíveis e realizar o agendamento...');
    return res.redirect('/loginUser');
  }

  const userPets = await Pet.findAll({ where: { UserId: userid } });

  if (userPets.length === 0 && currentPath !== '/registerPet') {
    await req.flash('message', 'É necessário ter um pet cadastrado para visualizar os horários disponíveis e realizar o agendamento...');
    return res.redirect('/registerPet');
  }

  next();
}

function formatDate(dateString) {
  const date = moment(dateString, "DD-MM-YYYY");
  const month = date.month() + 2; 
  const formattedDate = `${date.date()}-${month}-${date.year()}`;
  return formattedDate;
}

function formatMonth(month){
  const formattedMonth = String(month + 1).padStart(2, '0');
  return { monthString: formattedMonth };
}

export { isNullOrUndefined, checkAuth, isEqual, isGreaterOrEqual, isBigger, log, isOccupied, checkPetRegistered, formatDate,formatMonth, isLess, checkAdmAuth };