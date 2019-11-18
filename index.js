if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const expressFlash = require('express-flash');
const expressSession = require('express-session');
const methodOverride = require('method-override');

// Controllers
const userController = require('./controllers/usersControllers.js');
// Routes
const professionalsRoutes = require('./api/professionals.js');
const slotsRoutes = require('./api/slots.js');
const sessionsRoutes = require('./api/sessions.js');
// Init app
const initializePassport = require('./utils/passport-config')
initializePassport(
  passport,
  userController.getUserByEmail,
  userController.getUserById
);
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(expressFlash());
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false // Don't save empty values
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// Set middlewares, only proceed to routes if user is authenticaded
app.use('/professionals', checkAuthenticated, professionalsRoutes);
app.use('/slots', checkAuthenticated, slotsRoutes);
app.use('/sessions', checkAuthenticated, sessionsRoutes);

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'hbs');

hbs.registerPartial('headers', fs.readFileSync('./views/headers.hbs').toString());
hbs.registerPartial('logout', fs.readFileSync('./views/logout.hbs').toString());

app.get('/', checkAuthenticated, (req, res) => {
    if (userController.isUserProfessional(req.user)) res.redirect('/professionals/' + req.user.id);
    else res.render('userProfile.hbs', req.user);
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.hbs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.hbs');
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        userController.tryRegister(req.body);
        res.redirect('/login');
    } catch (error) {
        res.redirect('/register');
    }    
});

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

/**
 * Redirect not autheticated users to Login page
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

/**
 * Redirect authenticated users to Home page
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

app.use((error, req, res, next) =>{
    console.log(error);
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening on: ' + port));