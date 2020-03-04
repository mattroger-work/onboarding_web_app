var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

exports.reset_password = async function(client, principal_name, pass) {
  
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
        console.log('password reset');
        console.log(err);
        return false;
      }
  }
  
  
  exports.get_id = async function(client, principal_name) {
    
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
    }

    exports.set_usage_location = async function(client, principal_name){
        
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
        }catch{
            console.log("location err");
            console.log(err);
            return false;
        }

    }