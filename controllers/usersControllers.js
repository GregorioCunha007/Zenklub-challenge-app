const bcrypt = require('../utils/custom-bcrypt.js');

const professionalController = require('./professionalsController.js');

let usersArray = [];

/**
 * Async function because bcrypt hashing 
 * Tries to create an user client or professional
 * @param {*} data User credentials { email, password }
 */
function tryRegister (data) {
    try {
        const hashedPassword = bcrypt.hash(data.password);
        let userId = Date.now().toString();
        usersArray.push({
            id: userId,
            email: data.email,
            password: hashedPassword
        });
        // It's a professional user
        if (data.professional){
            data.id = userId;
            professionalController.addProfessional(data);
        }
    }catch(err){
        // Pickup exception in the outer catch
        throw err;
    }    
}

/**
 * Get all Users
 */
function getUsers(){
    return usersArray;
}

/**
 * Get user by ID
 * @param {*} id User ID
 */
function getUserById(id){
    return usersArray.find(u => u.id == id);
}

/**
 * Get user by email
 * @param {*} email User email
 */
function getUserByEmail(email){
    return usersArray.find(u => u.email == email);
}

/**
 * Check if a User's professional
 * @param {*} user User object
 */
function isUserProfessional(user){
    if (!user) return false;
    if (professionalController.getProfessional(user.id)){
        return true;
    }
    return false;
}

module.exports.getUsers = getUsers;
module.exports.tryRegister = tryRegister;
module.exports.getUserByEmail = getUserByEmail;
module.exports.getUserById = getUserById;
module.exports.isUserProfessional = isUserProfessional;