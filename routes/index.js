const express = require('express');
const router = express.Router();
const { ensureUserLoggedIn } = require('../middleware/guards');
const db = require("../model/helper");


/**
 * GET /
 **/

router.get('/', function(req, res) {
    res.send({ message: 'Welcome to the AuthAuth homepage!' });
});




module.exports = router;