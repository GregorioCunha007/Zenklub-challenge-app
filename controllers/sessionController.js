const moment = require('moment');

const Session = require('../models/Session.js');
const slotsController = require('../controllers/slotsController.js');
const professionalsController = require('../controllers/professionalsController.js');

let sessions = [];

/**
 * Book session
 * @param {*} data session data 
 */
function addSession (data) {
    sessions.push(new Session(data));
}

/**
 * Return all booked sessions
 */
function getSessions (){
    return sessions;
}

/**
 * Return all booked sessions for a given user id
 * @param {*} id 
 */
function getSessionsByUserId (id){
    if (!sessions) return [];
    return sessions.filter(s => s.userId == id);
}

/**
 * Returns true if the session was successfully booked, false otherwise
 * @param {*} data session data
 */
function tryBookSession (data) {
    // Get professional availabilities
    let availabilities = professionalsController.getProfessional(data.professionalId).availabilities;
    // Get all slots for the given day
    let slotsForTheDay = slotsController.availableSlots(data.day, null, availabilities, data.professionalId)[data.day];
    // Check if the desired session time is available
    if (slotsForTheDay[data.startTime] == 'Available') {
        // Now check the next half hour
        var nextHalfHour = moment(data.startTime, 'HH:mm').add(30, 'minutes').format('HH:mm');
        if (slotsForTheDay[nextHalfHour] != 'Booked') {
            // There's room for a session of 1 hour so lets book it!
            addSession (data);
            return true;
        }
    }
    return false;
}

module.exports.getSessions = getSessions;
module.exports.tryBookSession = tryBookSession;
module.exports.getSessionsByUserId = getSessionsByUserId;