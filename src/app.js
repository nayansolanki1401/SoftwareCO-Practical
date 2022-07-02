const ejs = require('ejs');
const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const { jwtStrategy } = require('./config/passport');
const routes = require('./routes/v1');
const morgan = require('./config/morgan');
const { errorConverter, errorHandler } = require('./middlewares/error');
const AppError = require('./utils/AppError');

const app = express();

app.use(express.static(__dirname + '/public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/public');

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Morgon logger
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());


// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// v1 api routes
app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
	next(new AppError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to AppError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
