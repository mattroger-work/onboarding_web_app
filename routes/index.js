var express = require('express');
var router = express.Router();
var index_con = require('../controllers/index_controller');

//GET HOME PAGE
router.get('/', index_con.render_get);

module.exports = router;
