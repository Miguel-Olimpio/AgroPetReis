const moment = require('moment');

class CalendarController {

  static async showCalendar(req, res) {
    const userid = req.session.userid;
    console.log(userid);
    let currentDate;
    if (!req.session.currentDate) {
      currentDate = moment();
      req.session.currentDate = currentDate.format();
    } else {
      currentDate = moment(req.session.currentDate);
    }
  
    const currentYear = currentDate.year();
    const currentMonth = currentDate.month();
    const realMonth = parseInt(currentMonth) + 1
    const currentDay = currentDate.date();
  
    if (!req.session.currentMonth) {
      req.session.currentMonth = currentMonth;
    }
  
    const fixedCurrentMonth = req.session.currentMonth;
    
    const currentData = CalendarController.generateCalendarData(
      currentYear,
      currentMonth,
      currentDay,
      fixedCurrentMonth
    );
  
    res.render('calendar/home', currentData);
  }

  static generateCalendarData(year, month, currentDay = 1, fixedCurrentMonth) {
    
    const currentDate = moment({ year, month, date: currentDay });
    const firstDayOfMonth = currentDate.clone().startOf('month');
    const daysInMonth = firstDayOfMonth.daysInMonth();
    const firstDayWeekday = firstDayOfMonth.day();
    const calendarMatrix = [];
    let currentWeek = [];

    // Preenche os dias em branco no início do mês
    for (let i = 0; i < firstDayWeekday; i++) {
      currentWeek.push(null);
    }

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

    return {
      monthName: currentDate.format('MMMM'),
      year: currentDate.year(),
      calendarMatrix,
      currentDay,
      currentMonth: fixedCurrentMonth,
    };
  }

  static async getNextMonth(req, res) {
    let currentDate = moment(req.session.currentDate);
    currentDate = currentDate.add(1, 'month');
    req.session.currentDate = currentDate.format();
    await new Promise((resolve) => {
      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
        }
        resolve();
      });
    });
    res.redirect('/');
  }

  static async getPreviousMonth(req, res) {
    let currentDate = moment(req.session.currentDate);
    currentDate = currentDate.subtract(1, 'month');
    req.session.currentDate = currentDate.format();
    await new Promise((resolve) => {
      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
        }
        resolve();
      });
    });
    res.redirect('/');
  }

}

module.exports = { CalendarController };

