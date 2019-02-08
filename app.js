'use strict';

/*
 * Project dependencies
 */
const	createError = require('http-errors'),
		express = require('express'),
		path = require('path'),
		cookieParser = require('cookie-parser'),
		logger = require('morgan'),
		debug = require('debug')('nodesaken:server'),
		session = require('express-session'),
		MongoDBStore = require('connect-mongodb-session')(session),
		mongoose = require('mongoose'),
		conf = require('./conf'),
/*
 * Routers
 */
		indexRouter = require('./routes/index'),
		characterRouter = require('./routes/characters'),
		userRouter = require('./routes/users'),
		app = express();
/*
 * Set up the sesssions
 */
console.log("Establishing Mongo Session Store");
	let store = new MongoDBStore({
		uri: conf.sessionStore.getURI(),
		databaseName: 'connect_mongodb_sessions',
		collection:'nodesaken_sessions'
	});
console.log("Mongo Session Store Established");

store.on('error', (error)=>{
	console.log(error);
});

app.use(require('express-session')({
	secret:'I never really know how to generate session secrets. What makes a good secret?',
	cookie:{maxAge:1000 * 60 * 60 * 24 * 7},
	resave:true,
	saveUninitialized:true,
	store:store
}));

app.use(function(req, res, next) {
	res.locals.sessionUser = req.session.user;
	res.locals.host = `${req.protocol}://${req.get('Host')}`;
	next();
});

/*
 * Setting mongoose up
 */

console.log("Setting Mongoose up");

mongoose.Promise = global.Promise;

mongoose.connect(conf.mongoose.getURI(), {useNewUrlParser:true})
	.then(
		()=>{
			debug('Mongoose raised');
		}
	).catch(
	(err)=>{
		debug(err);
	}
);
console.log("Mongoose set up");

global.appRoot = path.resolve(__dirname);

/**
 * CoDie stuff
 */
require('./DiscordBot/hoist.js');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*
 * Expose popper.js for bootstrap
 */
app.use('/js', express.static(__dirname+'/node_modules/popper.js/dist/umd'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/characters/', characterRouter);
app.use('/users/', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
