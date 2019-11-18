const express = require('express');
const router = express.Router();

let sessionController = require('../controllers/sessionController.js');
let professionalControllers = require('../controllers/professionalsController.js');

/**
 * Return all sessions the logged user has scheduled
 */
router.get('/', (req, res, next) => {
    res.status(200).json(sessionController.getSessionsByUserId(req.user.id));
});

/**
 * Create a new session
 */
router.post('/', (req, res, next) => {
    const data = req.body;
    // Add aditional fields we need to create the Session
    data.userId = req.user.id;
    data.professionalName = professionalControllers.getProfessional(data.professionalId).name;
    // Try to book it
    var success = sessionController.tryBookSession(data);
    res.status(success ? 200 : 404).json({
        'message': success ? 'Session creation was successfull' : 'Session failed to create', 
        'sessions': sessionController.getSessionsByUserId(req.user.id)
    });
});

module.exports = router;