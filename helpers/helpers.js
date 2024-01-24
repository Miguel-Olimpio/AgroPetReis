import moment from 'moment';
import Handlebars from 'handlebars';
import { User } from '../models/user.js';
import { Pet } from '../models/Pets.js';

function isEqual(v1, v2, options) {
  if (v1 === v2) {
    if (options && options.fn) {
      return options.fn(this);
    }
  } else {
    if (options && options.inverse) {
      return options.inverse(this);
    }
  }
  return '';
}

function isEqual2(v1, v2) {
  return v1 === v2;
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

function isLess2(v1, v2) {
  return v1 < v2;
}

function isBigger(v1, v2, options) {
  if (v1 > v2) {
    return options.fn(this);
  }
  return options.inverse(this);
}

function isBigger2(v1, v2) {
  return v1 > v2;
}

function isCurrentMonth(currentMonth, targetMonth, options) {
  if (currentMonth === targetMonth) {
    return options.fn(this);
  }
  if (options.inverse) {
    return options.inverse(this);
  }
  return '';
}

function log(context) {
  console.log(`-------------------------${context}-------------------------`);
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
    req.flash('message', 'Usuario deve estar logado para realizar esta ação...');
    return req.session.save(() => {
      res.redirect('/loginUser');
    });
  }
  next();
}

async function checkAdmAuth(req, res, next) {
  const userid = req.session.userid;

  if (userid !== 1) {
    req.flash('message', 'Você acessou como administrador visitante e não tem permissão para realizar esta ação...');
    return req.session.save(() => {
      res.redirect('/allChips');
    });
  }
  next();
}

async function checkPetRegistered(req, res, next) {
  const userid = req.session.userid;
  const currentPath = req.originalUrl;

  if (!userid) {
    req.flash('message', 'Usuário deve estar logado para visualizar os horários disponíveis e realizar o agendamento...');
    return req.session.save(() => {
      res.redirect('/loginUser');
    });
  }

  if (userid < 50) {
    return next();
  }

  const userPets = await Pet.findAll({ where: { UserId: userid } });

  if (userPets.length === 0 && currentPath !== '/registerPet') {
    req.flash('message', 'É necessário ter um pet cadastrado para visualizar os horários disponíveis e realizar o agendamento...');
    return req.session.save(() => {
      res.redirect('/registerPet');
    });
  }
  next();
}

function formatDate(dateString) {
  const date = moment(dateString, 'DD-MM-YYYY');
  const month = date.month() + 1;
  const formattedDate = `${date.date()}-${month}-${date.year()}`;
  return formattedDate;
}

function formatarData(dataOriginal) {
  const dateFormatOriginal = 'ddd MMM DD YYYY HH_mm_ss GMTZ (ZZ)';
  const dateFormatDesejado = 'DD-MM-YYYY';
  const dataFormatada = moment(dataOriginal, dateFormatOriginal).format(dateFormatDesejado);
  return dataFormatada;
}

function verifyWeekend(day, arrayDays) {
  return arrayDays.includes(day);
}

function formatMonth(month) {
  const formattedMonth = String(month + 1).padStart(2, '0');
  return { monthString: formattedMonth };
}

function checkIfAdm(var1) {
  return var1 === 'admin' || var1 === 'admin visitante';
}

function isSundayOrMonday(day, today) {
  const weekday = moment({ year: today.year(), month: today.month(), date: day }).day();
  return weekday === 0 || weekday === 1;
}

function ifThreeConditions(v1, v2, v3, v4) {
  return v1 || v2 || v3;
}

function lessOrEqual(v1, v2) {
  return v1 <= v2;
}

function ifOr(v1, v2, options) {
  return v1 || v2 ? options.fn(this) : options.inverse(this);
}

function ifAnd(v1, v2, options) {
  return v1 && v2;
}

function ifNotEqual(v1, v2, options) {
  return v1 !== v2;
}

export {
  Handlebars,
  isNullOrUndefined,
  isEqual,
  isGreaterOrEqual,
  isBigger,
  log,
  isOccupied,
  checkPetRegistered,
  formatDate,
  formatMonth,
  isLess,
  checkAdmAuth,
  checkAuth,
  formatarData,
  verifyWeekend,
  checkIfAdm,
  isSundayOrMonday,
  isCurrentMonth,
  isLess2,
  isEqual2,
  isBigger2,
  ifThreeConditions,
  ifOr,
  ifNotEqual,
  ifAnd,
  lessOrEqual,
};
