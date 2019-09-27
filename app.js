



const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const keys = require('./config/keys');

const routes = require('./routes/index');
const auth = require('./routes/auth');
const profile = require('./routes/profile');
const search = require('./routes/search');
const trace = require('./routes/trace');

require('./config/mongo-connect');
require('./config/passport-setup');
require('./steamItemsData/save-data');


const app = express();

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup

app.engine('handlebars', exphbs({
	defaultLayout: 'main',
	partialsDir: ['views/partials/']
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({
	maxAge:24*3600000,
	keys:[keys.session.cookieKey]
}));


app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);
app.use('/auth', auth);
app.use('/profile', profile);
app.use('/search', search);
app.use('/trace', trace);


/// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err,
			title: 'error'
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {},
		title: 'error'
	});
});

module.exports = app;
