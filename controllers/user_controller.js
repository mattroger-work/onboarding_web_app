var auth_helper = require('../helpers/auth');
var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

exports.reset_password = async function(req, res, principal_name, pass) {
  let params = { title: 'Reset Password', active: { Reset: true } };

  const accessToken = await auth_helper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    params.user = userName;

    // Initialize Graph client
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    try{

      var passwordProfile = {
        "forceChangePasswordNextSignIn": true,
        "forceChangePasswordNextSignInWithMfa": true,
        "password": pass
      };

      user = {
        passwordProfile: passwordProfile
      };

      const result = await client
      .api('/users/'+principal_name)
      .version('v1.0')
      .update(user);

      console.log('Password Reset!');


    } catch (err) {
      console.log('password reset')
      console.log(err)
    }

  } else {
    console.log('No access token or user name');
  }
}


exports.get_id = async function(res, req, principal_name) {
    let params = { title: 'User ID', active: { user: true } };
    console.log('get id')
  
    const accessToken = await auth_helper.getAccessToken(req.cookies, res);
    const userName = req.cookies.graph_user_name;
  
    if (accessToken && userName) {
      params.user = userName;
  
      // Initialize Graph client
      const client = graph.Client.init({
        authProvider: (done) => {
          done(null, accessToken);
        }
      });
  
      try{

        const result = await client
        .api('/users/'+principal_name)
        .version('v1.0')
        .select('id')
        .get();

        console.log('User ID Collected');
        console.log('user id ' + result.id)

        return result.id;

      } catch (err) {
        console.log('user id');
        console.log(err)
        return err;
      }
  
    } else {
      return null;
    }
  }