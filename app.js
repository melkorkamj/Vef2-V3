require('dotenv').config();

const passport = require('passport');
const { Strategy } = require('passport-local');
const path = require('path');
const express = require('express');
const session = require('express-session');
const apply = require('./apply');
const register = require('./register');
const admin = require('./admin');
const applications = require('./applications');
const login = require('./login');
const users = require('./users');

const app = express();

// const sessionSecret = process.env.SESSION_SECRET;
const sessionSecret = 'test';

if (!sessionSecret) {
  console.error('Add SESSION_SECRET to .env');
  process.exit(1);
}

app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  maxAge: 20 * 10000,
}));

/**
 * Athugar hvort username og password sé til í notandakerfi.
 * Callback tekur við villu sem fyrsta argument, annað argument er
 * - `false` ef notandi ekki til eða lykilorð vitlaust
 * - Notandahlutur ef rétt
 *
 * @param {string} username Notandanafn til að athuga
 * @param {string} password Lykilorð til að athuga
 * @param {function} done Fall sem kallað er í með niðurstöðu
 */
async function strat(username, password, done) {
  try {
    const user = await users.findByUsername(username);
    if (!user) {
      return false;
    }
    const passwordValid = await users.comparePasswords(password, user);
    done(null, passwordValid);
  } catch (err) {
    done(null, err);
  }

  return false;
}

passport.use(new Strategy(strat));

// Geymum id á notanda í session, það er nóg til að vita hvaða notandi þetta er
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Sækir notanda út frá id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await users.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use(passport.initialize());
app.use(passport.session());

// Til að geta notað user í view-um
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}


/**
 * Hjálparfall til að athuga hvort reitur sé gildur eða ekki.
 *
 * @param {string} field Middleware sem grípa á villur fyrir
 * @param {array} errors Fylki af villum frá express-validator pakkanum
 * @returns {boolean} `true` ef `field` er í `errors`, `false` annars
 */
function isInvalid(field, errors) {
  return Boolean(errors.find(i => i.param === field));
}

app.locals.isInvalid = isInvalid;

app.use('/', apply);
app.use('/register', register);
app.use('/login', login);
app.use('/applications', ensureLoggedIn, applications);
app.use('/admin', admin);


function errorHandler(error, req, res, next) { // eslint-disable-line
  console.error(error);
  res.status(500).render('error', { page: 'error', f: 'Villa', error });
}

app.use(errorHandler);

app.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureMessage: 'Virkar ekki að logga inn',
  }),
  (req, res) => {
    res.redirect('/admin');
  },
);

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`Server running at http://${hostname}:${port}/`);
});
