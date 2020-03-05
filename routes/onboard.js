var express = require('express');
var router = express.Router();
var onboard_con = require('../controllers/onboard_controller');

router.get('/', onboard_con.get_hq_onboardings);
router.get('/sub', onboard_con.get_sub_onboardings);

module.exports = router;