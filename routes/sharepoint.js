var express = require('express');
var router = express.Router();
var sharepoint_con = require('../controllers/sharepoint_controller');
var base_con = require('../controllers/base_controller')

router.post('/', sharepoint_con.onboard_person);
router.get('/', base_con.send_no_get)

module.exports = router;
