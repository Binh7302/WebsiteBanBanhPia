var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const rateLimit = require("express-rate-limit");
const cors = require('cors');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});


var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();
require('dotenv').config();

const redisStore = require('connect-redis').default;
const clientRedis = require('./middleware/redis');
const sessStore = new redisStore({ client: clientRedis });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_KEY,
  store: sessStore,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    // sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 1
  }
}));
app.use(limiter);
app.use(cors());
app.use('/', userRouter);
app.use('/admin', adminRouter);

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
  .catch(err => console.log('>>>>>>>>> DB Error: ', err));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
