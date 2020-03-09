var express = require('express');
var router = express.Router();
var create_con = require('../controllers/create_controller')


//bring to sharepoint design form
router.get('/sharepoint', create_con.render_create_sharepoint);


module.exports = router;