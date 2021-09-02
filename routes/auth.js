var express = require('express');
var router = express.Router();
var auth_con = require('../controllers/auth_controller')

//REDIRECT URI FOR THE MICROSOFT APP
router.get('/', auth_con.authorize);
//GET TO SIGN DESTROY THE COOKIES WITH THE ACCESS TOKEN
router.get('/signout', auth_con.signout);
  

module.exports = router;