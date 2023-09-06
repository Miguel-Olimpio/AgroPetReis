const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const { db } = require('./db/conn.js');
const moment = require('moment');
const path = require('path');

// Models
const { Scheduling } = require('./models/request.js');
const { User } = require('./models/user.js');
const { AdminUsers } = require('./models/admin.js');
const { Pet } = require('./models/Pets.js');
const { VeterinaryRecord } = require('./models/veterinaryRecord.js');

// import Routes
const { calendarRouter } = require('./routes/calendarRoutes.js');
const { authRouter } = require('./routes/authRoutes.js');
const { petsRouter } = require('./routes/petsRoutes.js');
const { veterinaryRecordRouter } = require('./routes/veterinaryRecordRoutes.js');
const { requestRouter } = require('./routes/requestRoutes.js');
const { adminRouter } = require('./routes/adminRoutes.js');

// import controller
const { RequestController } = require('./controllers/requestController.js');
const { CalendarController } = require('./controllers/calendarController.js');

// Import Helper
const {
  checkAuth,
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
  checkAdmAuth
} = require('./helpers/helpers.js');

// const __filename = new URL(import.meta.url).pathname;
// const __dirname = path.dirname(__filename);

moment.locale('pt-br');

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// Receber resposta do body
app.use(express.urlencoded({
    extended:true
})
)
app.use(express.json())

const sessionsPath = path.join(__dirname, 'sessions');

// session midleware
app.use(
    session({
      name: 'session',
      secret: 'nosso_secret',
      resave: false,
      saveUninitialized: false,
      store: new FileStore({
        logFn: function () {},
        path: sessionsPath,
    }),
      cookie: {
        secure: false,
        maxAge: 3600000,
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
      },
    }),
  )

// Flash messages
app.use(flash())

// public path
app.use(express.static('public'))
// app.use(express.static(path.join(__dirname, 'public')));

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
// .then(()=>{
//     app.listen(process.env.PORT)
// }).catch((err)=> console.log(err))

.then(()=>{
    app.listen(3000)
}).catch((err)=> console.log(err))