const express = require('express');
const { CalendarController } = require('../controllers/calendarController.js');

const calendarRouter = express.Router();

calendarRouter.get('/prev-month', CalendarController.getPreviousMonth);
calendarRouter.get('/next-month', CalendarController.getNextMonth);
calendarRouter.get('/', CalendarController.showCalendar);

module.exports = { calendarRouter };