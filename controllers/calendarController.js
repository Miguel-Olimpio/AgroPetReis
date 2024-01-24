import moment from 'moment';
import { User } from '../models/user.js';

function realDate() {
  let dataAtualMoment = moment();
  return dataAtualMoment;
}

class CalendarController {

  static async showCalendar(req, res) {
    let referenceDate;

    if (!req.session.referenceDate) {
      referenceDate = moment();  // Inicializa com a data atual
      req.session.referenceDate = referenceDate.clone();
    } else {
      referenceDate = moment(req.session.referenceDate);
    }

    const currentYear = referenceDate.year();
    const currentMonth = referenceDate.month();
    const currentDay = referenceDate.date();

    if (!req.session.currentMonth) {
      req.session.currentMonth = currentMonth;
    } else {
      req.session.currentMonth = null;
      req.session.currentMonth = currentMonth;
    }

    const fixedCurrentdate = realDate();

    const realCurrentYear = fixedCurrentdate.year();
    const realCurrentMonth = fixedCurrentdate.month() + 1;
    const realCurrentDay = fixedCurrentdate.date();    

    const currentData = CalendarController.generateCalendarData(
      currentYear,
      currentMonth,
      currentDay,
      fixedCurrentdate,
      realCurrentYear,
      realCurrentMonth,
      realCurrentDay
    );

    res.render('calendar/home', currentData);
  }

  static generateCalendarData(year, month, currentDay = 1, fixedCurrentMonth, realCurrentYear, realCurrentMonth, realCurrentDay) {
    const currentDate = moment({ year, month, date: currentDay });
    const firstDayOfMonth = currentDate.clone().startOf('month');
    const daysInMonth = firstDayOfMonth.daysInMonth();
    const firstDayWeekday = firstDayOfMonth.day();
    const calendarMatrix = [];
    let currentWeek = [];
    let sundayOrMonday = [];

    // Preenche os dias em branco no início do mês
    for (let i = 0; i < firstDayWeekday; i++) {
      currentWeek.push(null);
    }

    month = month + 1;

    // Preenche os dias do mês no calendário
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push({
        day,
        year,
        month,
      });

      if (currentWeek.length === 7) {
        calendarMatrix.push(currentWeek);
        currentWeek = [];
      }
    }

    // Adiciona os últimos dias em branco no final do mês
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    calendarMatrix.push(currentWeek);

    for (let i = 0; i <= 5; i++) {
      if (calendarMatrix[i] && calendarMatrix[i].length === 6 && calendarMatrix[i][0] != null) {
        let day = calendarMatrix[i][0].day;
        sundayOrMonday.push(day);
      } else if (calendarMatrix[i] && calendarMatrix[i].length === 7 && calendarMatrix[i][0] != null && calendarMatrix[i][1] != null) {
        let day1 = calendarMatrix[i][0].day;
        let day2 = calendarMatrix[i][1].day;
        sundayOrMonday.push(day1, day2);
      }
    }

    let correctMonth = realCurrentMonth + (realCurrentYear * 12);
    let displayedMonth = month + (year * 12);

    return {
      monthName: currentDate.format('MMMM'),
      year: currentDate.year(),
      calendarMatrix,
      currentDay,
      sundayOrMonday,
      correctMonth: correctMonth,
      displayedMonth: displayedMonth,
      realCurrentDay: realCurrentDay,
    };
  }

  static async getNextMonth(req, res) {
    req.session.referenceDate = moment(req.session.referenceDate).add(1, 'month');
    await CalendarController.saveSession(req);
    res.redirect('/');
  }

  static async getPreviousMonth(req, res) {
    req.session.referenceDate = moment(req.session.referenceDate).subtract(1, 'month');
    await CalendarController.saveSession(req);
    res.redirect('/');
  }

  static saveSession(req) {
    return new Promise((resolve) => {
      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
        }
        resolve();
      });
    });
  }
}

export { CalendarController };
