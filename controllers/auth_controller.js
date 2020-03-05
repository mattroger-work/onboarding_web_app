var auth_helper = require('../helpers/auth');

exports.authorize = async function(req, res, next){
    // Get auth code
    const code = req.query.code;
  
    // If code is present, use it
    if (code) {
      try {
        await auth_helper.getTokenFromCode(code, res);
        // Redirect to home
        res.redirect('/');
      } catch (error) {
        res.render('error', { title: 'Error', message: 'Error exchanging code for token', error: error });
      }
    } else {
      // Otherwise complain
      res.render('error', { title: 'Error', message: 'Authorization error', error: { status: 'Missing code parameter' } });
    }
  }

  exports.signout =  function(req, res, next) {
    auth_helper.clearCookies(res);
  
    // Redirect to home
    res.redirect('/');

}