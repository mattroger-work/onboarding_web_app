var express = require('express');
var router = express.Router();
var hr_con = require('../../controllers/hr/hr_onbord_controller')


//bring to sharepoint design form
router.get('/', hr_con.render_get);
router.post('/', hr_con.onboard);
router.get('/get', hr_con.get_hq_onboardings)


module.exports = router;