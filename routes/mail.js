var express = require('express');
var router = express.Router();
var mail_con = require('../controllers/mail_controller');
var base_con = require('../controllers/base_controller');

router.post('/', mail_con.send_mail);
router.get('/', base_con.send_no_get);

module.exports = router;
