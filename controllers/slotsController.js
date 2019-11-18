const moment = require('moment');
const sessionController = require('../controllers/sessionController.js');

/**
 * Return all slots as Available for a given professional's schedule
 * @param {*} startDate Initial date to be considered
 * @param {*} endDate Final date to be considered
 * @param {*} availablePeriods Periods that the professional is available to book sessions
 */
var allSlotsBetweenPeriods = function(startDate, endDate, availablePeriods) {
    var slots = [];
    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');
    do {
        // Check if the current date is a desirable week day
        let period = availablePeriods.find(p => p.weekDay == currDate.format('dddd'));
        if (period) {
            var startHours = parseInt(period.startTime.split(":")[0]); 
            // Subtract by 1 because all sessions have 1 hour duration
            var endHours = parseInt(period.endTime.split(":")[0]) - 1;
            // Must use clone() because "add" mutates the original moment
            var initialSlot = currDate.clone().add(startHours, "hours");
            var lastSlot = currDate.clone().add(endHours, "hours");
            // Create slots of time for each day
            do {
                // Create a new entry for this day inside the slots array
                if (!slots[initialSlot.format("YYYY-MM-DD")]) {
                    slots[initialSlot.format("YYYY-MM-DD")] = [];
                }
                // Insert time slots inside the given day: 8:00 , 8:30, 9:00 etc..
                slots[initialSlot.format("YYYY-MM-DD")][initialSlot.format("HH:mm")] = "Available";
            
            } while (initialSlot.add(30, 'minutes').diff(lastSlot, 'seconds') <= 0);
        }
    } while (currDate.add(1, 'days').diff(lastDate) < 0)
    
    return slots;
};

/**
 * Gives the updated professional's schedule 
 * @param {*} startDate First day to mark the start of the interval. Format: "YYYY-MM-dd"  
 * @param {*} endDate Last day to mark the end of the interval. Format: "YYYY-MM-dd"
 * @param {*} availablePeriods Availabilities of a given professional
 * @param {*} professionalId ID of the professional
 * @param {*} jsonResponse Return value in json
 */
var availableSlots = function(startDate, endDate, availablePeriods, professionalId, jsonResponse) {
    console.log('Available slots');
    // In case a interval is not passed, just check the availability for the day in startDate
    if (!endDate) endDate = startDate;
    var allSlots = allSlotsBetweenPeriods(startDate, endDate, availablePeriods);
    // Sessions booked inside the the range [startTime;endTime]
    var sessionsToBeConsidered = sessionController.getSessions().filter(s => s.professionalId == professionalId && compareDates(s.day, startDate) && compareDates(endDate, s.day));   
    // Return every slot if no session is booked
    if (!sessionsToBeConsidered) return allSlots;    
    
    for (const[day,slots] of Object.entries(allSlots)){
        // Sessions to occur in this day
        let matchingSessions = wrapInArray(sessionsToBeConsidered).filter(ss => ss.day == day);
        // In case there are sessions, update the schedule
        wrapInArray(matchingSessions).forEach(session => {        
            var slotsKeys = Object.keys(slots);            
            for(let i = 0; i < slotsKeys.length; ++i) {
                // Obtain slot startime
                let startTime = slotsKeys[i];
                // Compare slot startTime with session startTime
                if (moment(startTime,'HH:mm').diff(moment(session.startTime,'HH:mm')) == 0) {
                    // Book this time slot
                    slots[slotsKeys[i]] = 'Booked';
                    // Mark the previous availability period as Unavailable
                    if (slots[slotsKeys[i-1]]) slots[slotsKeys[i-1]] = 'Unavailable';
                    // Mark the next half hour aswell if possible
                    if (slots[slotsKeys[i+1]]) slots[slotsKeys[++i]] = 'Booked';
                } 
            }            
        });
    }
    
    // Make the return object valid json
    if (jsonResponse){
        let json = {};
        for (const[day,daySlots] of Object.entries(allSlots)){
            json[day] = {...daySlots};
        }
        return json;
    }

    return allSlots;
}

/**
 * Returns true date1 >= date2 
 * @param {*} date1 
 * @param {*} date2 
 */
function compareDates(date1, date2) {
    var _date1 = moment(date1);
    var _date2 = moment(date2);
    return _date1.diff(_date2) >= 0;
}

/**
 * Wraps object into an array 
 * @param {*} object 
 */
function wrapInArray(object){
    if (!object) return [];
    if (!(object instanceof Array)){
        object = [object];
    }
    return object;
}

module.exports.availableSlots = availableSlots;