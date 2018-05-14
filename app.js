/*
 * Project dependencies
 */
let createError = require('http-errors'),
	express = require('express'),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	logger = require('morgan'),
	debug = require('debug')('nodesaken:server'),
	session = require('express-session'),
	MongoDBStore = require('connect-mongodb-session')(session),
	mongoose = require('mongoose');

/*
 * Routers
 */
let indexRouter = require('./routes/index'),
	characterRouter = require('./routes/characters'),
	userRouter = require('./routes/users');

let app = express();

/*
 * Set up the sesssions
 */
let store = new MongoDBStore({
	uri: `mongodb://session_database_dba:${encodeURIComponent('session_database_pwd_#12345#fish#sandwich#AMSTERDAM')}@localhost:27017/connect_mongodb_sessions`,
	databaseName: 'connect_mongodb_sessions',
	collection:'nodesaken_sessions'
});

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
 * connect to mongoose
 */

/*
 * Setting mongoose up
 */

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://nodesaken_dba:${encodeURIComponent('nodesaken_dba_pwd#6666#8653#MONTREAL')}@localhost:27017/wing_nodesaken`)
	.then(
		()=>{
			debug('Mongoose raised');
		}
	).catch(
	(err)=>{
		debug(err);
	}
);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*
 * Expose popper.js for bootstrap
 */
app.use('/js', express.static(__dirname+'/node_modules/popper.js/dist/umd'));

/*
 * Compile and expose the shared character model files
 */
let browserify = require('browserify-middleware');
app.get('/js/frontendUI.js', browserify(__dirname + '/character model/frontendUI.js',  {
	cache: true,
	precompile: true
}));

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
