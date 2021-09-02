var auth_helper = require('../helpers/auth');
var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

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

exports.get_client = async function(res, cookies){
  const accessToken = await auth_helper.getAccessToken(cookies, res);
  const userName = cookies.graph_user_name;
  
    if (accessToken && userName) {

      // Initialize Graph client
      const client = graph.Client.init({
        authProvider: (done) => {
          done(null, accessToken);
        }
      });

      return client;
      
    } else {
      // Redirect to home
      res.redirect('/');
      return false;
    }
}