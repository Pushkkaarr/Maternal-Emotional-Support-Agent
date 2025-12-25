const express = require('express');
const router = express.Router();

const motherController = require('../controllers/motherController')
// Route to generate a response from the Gemini model

router.post('/mother', motherController.generateResponse);

module.exports = router;