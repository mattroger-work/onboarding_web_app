var express = require('express');
var router = express.Router();
var license_con = require('../controllers/license_controller');
var base_con = require('../controllers/base_controller')

router.post('/', license_con.assign_licenses);
router.get('/', base_con.send_no_get);

module.exports = router;