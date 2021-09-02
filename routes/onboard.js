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
//POST DATA TO SEND MAIL
router.post('/sendmail', onboard_con.send_mail);
//POST DATA TO ASSIGNLICENSES
router.post('/assignlicenses', onboard_con.assign_licenses);
//POST DATA TO START THE SUB-CONTRACTOR ONBOARDING
router.post('/sub', onboard_con.complete_onboarding_sub)
//post data to create user
router.post('/create', onboard_con.create_user)
//post data to create sub
router.post('/create/sub',onboard_con.create_user_sub);

module.exports = router;