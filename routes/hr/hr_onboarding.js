var express = require('express');
var router = express.Router();
var hr_con = require('../../controllers/hr/hr_onbord_controller')


//bring to sharepoint design form
router.get('/', hr_con.render_hello);


module.exports = router;