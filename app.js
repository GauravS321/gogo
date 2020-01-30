const bodyParser = require('body-parser');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const express = require('express');
const expressHbs = require('express-handlebars');
const expressFileupload = require('express-fileupload');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');

require('dotenv').config({ path: __dirname + '/.env' });

const userRoutes = require('./src/web/routes/users');
const componentsRoutes = require('./src/web/routes/components');
const bgRoutes = require('./src/web/routes/plugins/dave/bank-guarantee');
const academicRoutes = require('./src/web/routes/plugins/dave/academic');
const loyaltyRoutes = require('./src/web/routes/plugins/sam/loyalty');
const p2pRoutes = require('./src/web/routes/plugins/sam/p2p');
const shoppermitsRoutes = require('./src/web/routes/plugins/primemason/shoppermits');

const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

//app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.APPLICATION_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 }, // one week in milliseconds 1209600000
  store: new MongoStore({
    url: process.env.MONGODB_URI
  })
}));
app.use(expressFileupload());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport');
app.use(flash());

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/src/web/views'));
app.engine('hbs', expressHbs({
  extname: 'hbs',
  layoutsDir: path.join(__dirname, '/src/web/views', 'layouts'),
  defaultLayout: 'layout.hbs'
}))
expressHbs.create({
  partialsDir: [__dirname, '/src/web/views/partials']
});

app.use('/web', express.static(path.join(__dirname, '/src/web/public')));

app.use((req, res, next) => {
  res.locals.user = req.isAuthenticated();
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.errors = req.flash('errors');
  next();
});



app.use('/', userRoutes);
app.use('/components', componentsRoutes);
app.use('/plugins/dave/bank-guarantee', bgRoutes);
app.use('/plugins/dave/academic', academicRoutes);
app.use('/plugins/sam/loyalty', loyaltyRoutes);
app.use('/plugins/sam/p2p', p2pRoutes);
app.use('/plugins/primemason/shoppermits', shoppermitsRoutes);

app.get('/', function (req, res) {
  return res.redirect('/login');
});

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  
  // set locals, only providing error in development
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
