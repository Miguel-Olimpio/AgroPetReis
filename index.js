import express from 'express'
import exphbs from 'express-handlebars'
import session from 'express-session'
import sessionFileStore from 'session-file-store';
import flash from 'connect-flash';
import { db } from './db/conn.js'
import os from 'os';
import path from 'path';
import moment from 'moment';
import fs from 'fs';


// Models
import { Scheduling } from './models/request.js';
import { User } from './models/user.js';
import { AdminUsers } from './models/admin.js';
import { Pet } from './models/Pets.js';
import { VeterinaryRecord } from './models/veterinaryRecord.js';

// import Routes
import { calendarRouter } from './routes/calendarRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { petsRouter } from './routes/petsRoutes.js';
import { veterinaryRecordRouter } from './routes/veterinaryRecordRoutes.js';
import { requestRouter } from './routes/requestRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';


// import controller
import { RequestController } from './controllers/requestController.js';
import { CalendarController } from './controllers/calendarController.js';


// Import Helper
import { checkAuth, isNullOrUndefined, isEqual, isGreaterOrEqual,isBigger, log, isOccupied, checkPetRegistered,formatDate,formatMonth, isLess, checkAdmAuth } from './helpers/helpers.js';

moment.locale('pt-br');
const tmpDir = os.tmpdir();
const sessionsDir = path.join(tmpDir, 'sessions');
const FileStore = sessionFileStore(session);

const privateKey = fs.readFileSync('path/to/private/key.pem', 'utf8');
const certificate = fs.readFileSync('path/to/certificate.pem', 'utf8');
const ca = fs.readFileSync('path/to/ca.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// Receber resposta do body
app.use(express.urlencoded({
    extended:true
})
)
app.use(express.json())

// session midleware
app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function(){},
            path: sessionsDir,
        }),
        cookie:{
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    }),
)
// Flash messages
app.use(flash())

// public path
app.use(express.static('public'))

// set session to res
app.use((req,res,next)=>{
    if(req.session.userid){
        res.locals.session = req.session
    }
    next()
})

// Register Helper
const hbs = exphbs.create({ helpers: { isNullOrUndefined, isEqual, isGreaterOrEqual, isBigger,log, isOccupied, checkPetRegistered,formatDate,formatMonth, isLess, checkAdmAuth, checkAuth } });
app.engine('handlebars', hbs.engine);

// Routes
app.use('/', authRouter)

app.use('/', veterinaryRecordRouter)

app.use('/calendar', calendarRouter)
app.get('/', CalendarController.showCalendar )
app.get('/prev-month', CalendarController.getPreviousMonth);
app.get('/next-month', CalendarController.getNextMonth);

app.use('/', requestRouter)

app.use('/', adminRouter)

app.use('/', petsRouter)

db
// .sync({force:true})
.sync()
.then(()=>{
    const server = https.createServer(credentials, app);

    server.listen(443, () => {
      console.log('Server is running on port 443');
    });
}).catch((err)=> console.log(err))
