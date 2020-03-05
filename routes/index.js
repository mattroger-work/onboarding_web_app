var express = require('express');
var router = express.Router();
var index_con = require('../controllers/index_controller');

/* GET home page. */
router.get('/', index_con.render_get);

module.exports = router;
