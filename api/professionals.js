const express = require('express');
const router = express.Router();

const professionalsController = require('../controllers/professionalsController.js');

router.get('/', (req, res, next) => { 
    res.json(professionalsController.professionalsArray);
});

// Redirect from profissionals/availabilities to the professional's page of availabilities
router.all('/availabilities', checkIfProfessional, (req, res, next) => {    
    res.redirect('/professionals/' + req.user.id + '/availabilities');
});

// Show professional's profile
router.get('/:professionalId/', checkIfProfessional, (req, res, next) => {
    const professional = professionalsController.getProfessional(req.params.professionalId);
    if (professional) res.render('professionalProfile', professional);
    else {
        res.status(404).send();
    }
});

// CRUD OPERATIONS ON AVAILABILITIES

/**
 * Get All availabilities for the given professional
 */
router.get('/:professionalId/availabilities', checkIfProfessional, (req, res, next) => {
    const professional = professionalsController.getProfessional(req.params.professionalId);
    if (professional){
        res.render('professionalAvailability', professional);
    } else {
        res.status(404).send();
    }
});

/**
 * Create new availability for the given professional
 */
router.post('/:professionalId/availabilities', checkIfProfessional, (req, res, next) => {
    const professional = professionalsController.addAvailabilityForProfessional(req.params.professionalId, req.body);
    res.redirect(req.get('referer'));
});

/**
 * Get single availability
 */
router.get('/:professionalId/availabilities/:availabilityId', checkIfProfessional, (req, res, next) => {
    const availability = professionalsController.getAvailabilityForProfessional(req.params.professionalId, req.params.availabilityId);
    if (availability){
        res.json(availability);
    } else {
        res.status(404).send();
    }
});

/**
 * Update single availability
 */
router.put('/:professionalId/availabilities/:availabilityId', checkIfProfessional, (req, res, next) => {
    const professional = professionalsController.updateAvailabilityForProfessional(req.params.professionalId, req.params.availabilityId, req.body);
    res.redirect(req.get('referer'));
});

/**
 * Delete single availability
 */
router.delete('/:professionalId/availabilities/:availabilityId', checkIfProfessional, (req, res, next) => {   
    professionalsController.deleteAvailabilityForProfessional(req.params.professionalId, req.params.availabilityId);
    res.redirect(req.get('referer'));
});

/**
 * Redirect non-professional users to Home page
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function checkIfProfessional(req, res, next) {
    if (!professionalsController.getProfessional(req.user.id)) {
        return res.redirect('/');
    }
    next();
}

module.exports = router;

