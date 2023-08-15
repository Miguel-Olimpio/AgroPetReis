import express from 'express';
import { CalendarController } from '../controllers/calendarController.js';

const calendarRouter = express.Router();

calendarRouter.get('/prev-month', CalendarController.getPreviousMonth);
calendarRouter.get('/next-month', CalendarController.getNextMonth);
calendarRouter.get('/', CalendarController.showCalendar);

export { calendarRouter };