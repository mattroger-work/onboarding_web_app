var express = require('express');
var router = express.Router();
var onboard_con = require('../controllers/onboard_controller');

//GET ONBOARDING HOMEPAGE
router.get('/', onboard_con.render_hq_get);
//GET SUB-CONTRACTOR ONBOARDING HOMEPAGE 
router.get('/sub', onboard_con.render_sub_get);
//get data for sub table 
router.get('/sub/get', onboard_con.get_sub_onboardings);
//this is the get request for the table info
router.get('/get', onboard_con.get_hq_onboardings)
//POST DATA TO START THE ONBOARDING PROCESS
router.post('/', onboard_con.complete_onboarding);

module.exports = router;