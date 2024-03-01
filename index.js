import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import flash from 'connect-flash';
import { db } from './db/conn.js';
import moment from 'moment';
import SequelizeStore from 'connect-session-sequelize';

// Models
import { Scheduling } from './models/request.js';
import { User } from './models/user.js';
import { AdminUsers } from './models/admin.js';
import { Pet } from './models/Pets.js';
import { VeterinaryRecord } from './models/veterinaryRecord.js';
import { Session } from './models/sessions.js';

// Import Routes
import { calendarRouter } from './routes/calendarRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { petsRouter } from './routes/petsRoutes.js';
import { veterinaryRecordRouter } from './routes/veterinaryRecordRoutes.js';
import { requestRouter } from './routes/requestRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';
import { checkHealthrouter } from './routes/healthRoutes.js'

// Import Controllers
import { RequestController } from './controllers/requestController.js';
import { CalendarController } from './controllers/calendarController.js';

// Import Helpers
import {
  isNullOrUndefined,
  isEqual,
  isGreaterOrEqual,
  isBigger,
  log,
  isOccupied,
  checkPetRegistered,
  checkAuth,
  formatDate,
  formatMonth,
  isLess,
  checkAdmAuth,
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
  lessOrEqual
} from './helpers/helpers.js';

moment.locale('pt-br');

const app = express();

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

const SequelizeStoreSession = SequelizeStore(session.Store);
const sessionStore = new SequelizeStoreSession({
  db: db,
  expiration: 3600000,
});

app.use(
  session({
    secret: 'seu_segredo_aqui',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      // secure: false, caso o app esteja rodando na maquina local e true caso o app esteja rodando num servidor https
      secure: false,
      // secure: false,
    },
  })
);

app.use(flash());

app.use(express.static('public'));

app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }
  next();
});

const hbs = exphbs.create({
  helpers: {
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
  },
});

app.engine('handlebars', hbs.engine);

app.use('/',checkHealthrouter, (req, res, next) => {
  next();
});

app.use('/', authRouter);

app.use('/', veterinaryRecordRouter);

app.use('/calendar', calendarRouter);
app.get('/', CalendarController.showCalendar);
app.get('/prev-month', CalendarController.getPreviousMonth);
app.get('/next-month', CalendarController.getNextMonth);

app.use('/', requestRouter);

app.use('/', adminRouter);

app.use('/', petsRouter);

// db.sync({force: true})
db.sync()
  .then(() => {
    // caso estiver rodando em uma maquina local o app.listen(3000)
    app.listen(3001);

  })
  .catch((err) => console.log(err));
