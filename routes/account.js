var express = require('express');
var router = express.Router();
const passport = require('passport');

const accountController = require('../controllers/AccountController.js')

/* GET home page. */
router.get('/login', accountController.showLogin);

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/account/login');
})

module.exports = router;