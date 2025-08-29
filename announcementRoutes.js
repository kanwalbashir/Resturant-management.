const express = require('express');
const router = express.Router();
const { createAnnouncement,getStats, getLatestAnnouncement } = require('../controller/announcementController');

router.post('/', createAnnouncement); // Add announcement
router.get('/', getLatestAnnouncement); // Fetch latest announcement
router.get("/stats", getStats);

module.exports = router;
