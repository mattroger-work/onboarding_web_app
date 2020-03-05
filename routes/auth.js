var express = require('express');
var router = express.Router();
var auth_con= require('../controllers/auth_controller')

router.get('/', auth_con.authorize);

  /* GET /authorize/signout */
router.get('/signout', auth_con.signout);
  

module.exports = router;