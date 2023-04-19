var express = require('express');
var router = express.Router();

const authentication = require('../middleware/authentication.js');

/* GET home page. */
router.get('/', authentication, function(req, res, next) {
    if (req.user) {
        let time = new Date().toLocaleTimeString()
        global.user = {
            data: req.user,
            loginAt: new Date().toLocaleTimeString()
        }
    }

    res.render('index', {
        title: 'Chat',
        username: req.user.name
    });
});

router.get('/chat/:id', authentication, function(req, res, next) {

    res.render('chat', {
        title: 'Chat',
        username: req.user.name
    });
});

module.exports = router;