var express = require('express');
var router = express.Router();
var group_con = require('../controllers/group_controller');
var base_con = require('../controllers/base_controller')

router.post('/', group_con.assign_groups);
router.get('/', base_con.send_no_get);

module.exports = router;