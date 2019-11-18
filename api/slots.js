const express = require('express');
const router = express.Router();

const slotsController = require('../controllers/slotsController.js');
const professionalsController = require('../controllers/professionalsController.js');

// List slots for professional ID
router.get('/', (req, res, next) => { 
    // Collect URL parameters 
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    var professionalId = req.query.professionalId;
    // Always require a start date and professional ID
    if (!startDate || !professionalId) res.status(400).send();
    let slots = {};
    // Find the available schedule
    var availableSchedule = professionalsController.getProfessional(professionalId).availabilities;
    slots = slotsController.availableSlots(startDate, endDate, availableSchedule, professionalId, true);
    res.send(slots);
});

module.exports = router;