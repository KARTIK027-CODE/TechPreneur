const express = require('express');
const {
    createStartup,
    getStartupProfile,
    updateStartup,
    addTeamMember,
    removeTeamMember,
} = require('../controllers/startupController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

const router = express.Router();

router.post('/create', protect, createStartup);
router.get('/profile', protect, getStartupProfile);
router.put('/update', protect, checkRole('founder'), updateStartup);
router.post('/add-member', protect, addTeamMember);
router.delete('/remove-member/:userId', protect, checkRole('founder'), removeTeamMember);

module.exports = router;
