import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import flash from 'connect-flash';
import FileStore from 'session-file-store';
import { db } from './db/conn.js';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter o caminho do diretório atual do arquivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Models
import { Scheduling } from './models/request.js';
import { User } from './models/user.js';
import { AdminUsers } from './models/admin.js';
import { Pet } from './models/Pets.js';
import { VeterinaryRecord } from './models/veterinaryRecord.js';

// Import Routes
import { calendarRouter } from './routes/calendarRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { petsRouter } from './routes/petsRoutes.js';
import { veterinaryRecordRouter } from './routes/veterinaryRecordRoutes.js';
import { requestRouter } from './routes/requestRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';

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

const FileStoreSession = FileStore(session);

const app = express();

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

const sessionsPath = path.join(__dirname, './sessions');

function removeExpiredSessions() {
  const now = new Date().getTime();
  fs.readdir(sessionsPath, (err, files) => {
    if (err) {
      console.error('Erro ao listar diretório de sessões:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(sessionsPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Erro ao obter informações do arquivo:', err);
          return;
        }

        if (stats.mtime.getTime() + 3600000 < now) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Erro ao excluir arquivo de sessão expirada:', err);
            } else {
              console.log('Sessão expirada removida:', file);
            }
          });
        }
      });
    });
  });
}

setInterval(removeExpiredSessions, 3600000);

app.use(
  session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStoreSession({
      logFn: function () {},
      path: sessionsPath,
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
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
    app.listen(3000);
  })
  .catch((err) => console.log(err));
