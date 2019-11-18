const Professional = require('../models/Professional.js');
const Availability = require('../models/Availability.js');

let professionalsArray = [];

/**
 * Get a Professional
 * @param {*} id ID of the professional
 */
function getProfessional(id){
    return professionalsArray.find(p => p.id == id);
}

/**
 * Add a professional
 * @param {*} data Data to construct the professional
 */
function addProfessional(data){
    let p = new Professional(data);
    professionalsArray.push(p);
}

/**
 * Create a new availability for the professional
 * @param {*} professionalId Professional ID
 * @param {*} availabilityData Data to construct the availability 
 */
function addAvailability(professionalId, availabilityData){
    let availability = new Availability(availabilityData);
    let professional = getProfessional(professionalId);
    professional.addAvailability(availability);
    return professional;
}

/**
 * Get availability from professional
 * @param {*} professionalId Professional ID
 * @param {*} availabilityId Availability ID
 */
function getAvailability(professionalId, availabilityId){
    let professional = getProfessional(professionalId);    
    return professional.getAvailability(availabilityId);
}

/**
 * Update availability in professional availabilities
 * @param {*} professionalId Professional ID
 * @param {*} availabilityId Availability ID
 * @param {*} availabilityData Data to update the availability
 */
function updateAvailabilityForProfessional(professionalId, availabilityId, availabilityData){
    let professional = getProfessional(professionalId);
    professional.updateAvailability(availabilityId, availabilityData);
    return professional;
}

/**
 * Delete availability in professional availabilities
 * @param {*} professionalId Professional ID
 * @param {*} availabilityId Availability ID
 */
function deleteAvailabilityForProfessional(professionalId, availabilityId){
    let professional = getProfessional(professionalId);
    professional.deleteAvailability(availabilityId);
    return professional;
}

module.exports.professionalsArray = professionalsArray;
module.exports.addProfessional = addProfessional;
module.exports.getProfessional = getProfessional;
module.exports.addAvailabilityForProfessional = addAvailability;
module.exports.getAvailabilityForProfessional = getAvailability;
module.exports.updateAvailabilityForProfessional = updateAvailabilityForProfessional;
module.exports.deleteAvailabilityForProfessional = deleteAvailabilityForProfessional;