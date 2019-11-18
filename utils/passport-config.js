const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('./custom-bcrypt.js')
const userController = require('../controllers/usersControllers.js');

/**
 * Initialize passport configurations
 * @param {*} passport Passport instance
 * @param {*} getUserByEmail Function to get an User given his email
 * @param {*} getUserById Function to get an User given his Id
 */
function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = (email, password, done) => {
        const user = getUserByEmail(email);
        if (user == null) {
            return done(null, false, { message: 'No user with that email' });
        }
        try {
            if (bcrypt.compare(password, user.password)) {
                // Successfull login
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (e) {
            return done(e);
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    // Serialize user inside the session
    passport.serializeUser((user, done) => done(null, user.id));
    // Deserialize user 
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    });
}

module.exports = initialize