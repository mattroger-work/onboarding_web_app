var express = require('express');
var router = express.Router();
var onboard_con = require('../controllers/onboard_controller');

//GET ONBOARDING HOMEPAGE
router.get('/', onboard_con.render_get);
//GET SUB-CONTRACTOR ONBOARDING HOMEPAGE 
router.get('/sub', onboard_con.get_sub_onboardings);
router.get('/hq', onboard_con.get_hq_onboardings)
//POST DATA TO START THE ONBOARDING PROCESS
router.post('/', onboard_con.complete_onboarding);

module.exports = router;