var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

//----------------------------------------------------------------------------
//this is not working for new people for some reason.........
exports.reset_password = async function(client, principal_name, pass) {
      //RESETS THE USER PASSWORD TO WHAT THE PASS GEN MADE AND REQUIRES THEM TO CHANGE
      //IT AND SIGN IN WITH MFA 
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
        return true;
  
      } catch (err) {
        console.log('password reset err');
        console.log(err);
        return false;
      }
  }
  //-----------------------------------------------------------------------------
  
  exports.get_id = async function(client, principal_name) {
        //this gets the user id based on the principal name
        try{
          const result = await client
          .api('/users/'+principal_name)
          .version('v1.0')
          .select('id')
          .get();
  
          console.log('User ID Collected');
  
          return result.id;
  
        } catch (err) {
          console.log('user id err');
          console.log(err)
          return err;
        }
    }

    exports.set_usage_location = async function(client, principal_name){
        //this change the users location which is required in order to assign 
        //the users licenses
        try{
        user_location ={
            usageLocation: "US"
          }
  
          //change the user location
          var result = await client
          .api('/users/'+principal_name)
          .version('v1.0')
          .update(user_location);

          console.log("Location Added")
          return true;
        }catch(err){
            console.log("location err");
            console.log(err);
            return false;
        }

    }

    exports.get_me = function(client){
      try{
        //change the user location
        var result = await client
        .api('me')
        .version('v1.0')
        .get();

        console.log("me got")
      }catch(err){
        console.log("user err")
        console.log(err)
      }
    }