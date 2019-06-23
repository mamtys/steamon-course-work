/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {var express = __webpack_require__(/*! express */ "express");

var passport = __webpack_require__(/*! passport */ "passport");

var session = __webpack_require__(/*! express-session */ "express-session");

var path = __webpack_require__(/*! path */ "path");

var favicon = __webpack_require__(/*! serve-favicon */ "serve-favicon");

var logger = __webpack_require__(/*! morgan */ "morgan");

var cookieParser = __webpack_require__(/*! cookie-parser */ "cookie-parser");

var cookieSession = __webpack_require__(/*! cookie-session */ "cookie-session");

var bodyParser = __webpack_require__(/*! body-parser */ "body-parser");

var exphbs = __webpack_require__(/*! express-handlebars */ "express-handlebars");

var keys = __webpack_require__(/*! ./config/keys */ "./config/keys.js");

var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

mongoose.connect(keys.mongodb.dbURI, {
  useNewUrlParser: true
}).then(function () {
  return console.log('Mongo connected');
})["catch"](function () {
  return console.log('Mongo connection err');
});

var routes = __webpack_require__(/*! ./routes/index */ "./routes/index.js");

var users = __webpack_require__(/*! ./routes/user */ "./routes/user.js");

var auth = __webpack_require__(/*! ./routes/auth */ "./routes/auth.js");

var profile = __webpack_require__(/*! ./routes/profile */ "./routes/profile.js");

var passportSetup = __webpack_require__(/*! ./config/passport-setup */ "./config/passport-setup.js");

var app = express();
var env = "development" || false;
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development'; // view engine setup

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: ['views/partials/']
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars'); // app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express["static"](path.join(__dirname, 'public')));
app.use(cookieSession({
  maxAge: 24 * 3600000,
  keys: [keys.session.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);
app.use('/profile', profile); /// catch 404 and forward to error handler

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
}); /// error handlers
// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error'
    });
  });
} // production error handler
// no stacktraces leaked to user


app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: 'error'
  });
});
module.exports = app;
/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./config/keys.js":
/*!************************!*\
  !*** ./config/keys.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  mongodb: {
    dbURI: 'mongodb+srv://admin:0216admin@cluster0-bhki0.mongodb.net/test?retryWrites=true'
  },
  session: {
    cookieKey: 'somecookiekeymbencr'
  }
};

/***/ }),

/***/ "./config/passport-setup.js":
/*!**********************************!*\
  !*** ./config/passport-setup.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var passport = __webpack_require__(/*! passport */ "passport");

var SteamStrategy = __webpack_require__(/*! passport-steam */ "passport-steam").Strategy;

var User = __webpack_require__(/*! ../models/user-model */ "./models/user-model.js");

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    //	console.log("deserialize:>>"+id);
    if (err) done(err);else done(null, user);
  });
});
passport.use(new SteamStrategy({
  returnURL: 'http://localhost:3000/auth/steam/return',
  realm: 'http://localhost:3000/',
  apiKey: '0E85BB8884ECE2534C417A4F4A6A7CF8'
}, function (identifier, profile, done) {
  //	console.log(profile);
  //console.log(profile.id+ ' '+profile.displayName);
  User.findById(profile.id).then(function (curUser) {
    console.log(curUser);

    if (curUser) {
      console.log("duplicate" + curUser);
      done(null, curUser);
    } else {
      var user = new User({
        _id: profile.id,
        displayName: profile.displayName,
        smallAvatar: profile.smallAvatar
      });
      user.save(function (err, userObj) {
        if (err) {
          console.error(err);
        }

        console.log(userObj, " registred ", Date.now());
      });
      done(null, user);
    }
  });
}));

/***/ }),

/***/ "./models/item-model.js":
/*!******************************!*\
  !*** ./models/item-model.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var Schema = mongoose.Schema;
var userSchema = new Schema({
  itemName: String,
  gameName: String,
  smallPhoto: String,
  url: String
}, {
  versionKey: false
});
var Item = mongoose.model('item', userSchema);
module.exports = Item;

/***/ }),

/***/ "./models/res-info-model.js":
/*!**********************************!*\
  !*** ./models/res-info-model.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var Schema = mongoose.Schema;
var userSchema = new Schema({
  _id: {
    type: String,
    ref: 'User'
  },
  telegram: {
    type: String,
    unique: true
  },
  currancy: String
}, {
  versionKey: false
});
var resInfo = mongoose.model('resInfo', userSchema);
module.exports = resInfo;

/***/ }),

/***/ "./models/user-model.js":
/*!******************************!*\
  !*** ./models/user-model.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var Schema = mongoose.Schema;
var userSchema = new Schema({
  _id: String,
  displayName: String,
  smallAvatar: String
}, {
  versionKey: false
});
var User = mongoose.model('user', userSchema);
module.exports = User;

/***/ }),

/***/ "./routes/auth.js":
/*!************************!*\
  !*** ./routes/auth.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var express = __webpack_require__(/*! express */ "express");

var router = express.Router();

var passport = __webpack_require__(/*! passport */ "passport");

router.get('/steam', passport.authenticate('steam', {
  failureRedirect: '/'
}), function (req, res) {
  res.redirect('/');
});
router.get('/steam/return', passport.authenticate('steam', {
  failureRedirect: '/'
}), function (req, res) {
  res.redirect('/');
});
module.exports = router;

/***/ }),

/***/ "./routes/index.js":
/*!*************************!*\
  !*** ./routes/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var express = __webpack_require__(/*! express */ "express");

var router = express.Router();

var passport = __webpack_require__(/*! passport */ "passport");

var Item = __webpack_require__(/*! ../models/item-model */ "./models/item-model.js");

var resInfo = __webpack_require__(/*! ../models/res-info-model */ "./models/res-info-model.js");
/* GET home page. */


router.get('/', function (req, res) {
  getItems("-nameItem", 10, function (item) {
    if (req.user) getSettings(req.user.id, function (sets) {
      res.render('index', {
        user: req.user,
        title: "Steamon",
        items: item,
        sets: sets
      });
    });else res.render('index', {
      user: req.user,
      title: "Steamon",
      items: item
    });
  });
});
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
router.get('/search', function (req, res) {
  res.redirect('/');
});

function getItems(sortpar, maxNumb, callback) {
  Item.find({}).sort(sortpar).limit(maxNumb).exec(function (err, items) {
    if (err) console.error(err);else callback(items);
  });
}

function getSettings(id, callback) {
  resInfo.findById(id, function (err, sets) {
    if (err) console.error(err);else callback(sets);
  });
}

module.exports = router;

/***/ }),

/***/ "./routes/profile.js":
/*!***************************!*\
  !*** ./routes/profile.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var router = __webpack_require__(/*! express */ "express").Router();

var resInfo = __webpack_require__(/*! ../models/res-info-model */ "./models/res-info-model.js");

var checkAuth = function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
};

router.get('/', checkAuth, function (req, res) {
  res.render('profile', {
    user: req.user
  });
});
router.get('/settings', function (req, res) {
  res.render('profile', {
    user: req.user
  });
});
router.post('/', checkAuth, function (req, res) {
  resInfo.findById(req.user.id, function (err, curInfo) {
    if (err) console.error(err);else if (curInfo) {
      console.log("duplicate" + curInfo);
      curInfo.telegram = req.body.tel;
      curInfo.currancy = req.body.cur;
      curInfo.save();
    } else {
      var info = new resInfo({
        _id: req.user.id,
        telegram: req.body.tel,
        currancy: req.body.cur
      });
      info.save(function (err, Info) {
        if (err) {
          console.error(err);
        }

        console.log(Info + "created");
      });
    }
  });
  console.log(req.user);
  res.redirect('/profile');
});
module.exports = router;

/***/ }),

/***/ "./routes/user.js":
/*!************************!*\
  !*** ./routes/user.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var express = __webpack_require__(/*! express */ "express");

var router = express.Router();
/* GET users listing. */

router.get('/', function (req, res) {
  res.send('respond with a resource');
});
module.exports = router;

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),

/***/ "cookie-session":
/*!*********************************!*\
  !*** external "cookie-session" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cookie-session");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-handlebars":
/*!*************************************!*\
  !*** external "express-handlebars" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-handlebars");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),

/***/ "passport-steam":
/*!*********************************!*\
  !*** external "passport-steam" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport-steam");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "serve-favicon":
/*!********************************!*\
  !*** external "serve-favicon" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("serve-favicon");

/***/ })

/******/ });
//# sourceMappingURL=build.js.map