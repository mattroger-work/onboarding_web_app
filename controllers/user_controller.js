require('isomorphic-fetch');

  
  exports.get_user = async function(client, principal_name) {
        //this gets the user id based on the principal name
        try{
          const result = await client
          .api('/users/'+principal_name)
          .version('v1.0')
          .get();
  
          console.log('User ID Collected');
  
          return result;
  
        } catch (err) {
          console.log('user id err');
          console.log(err)
          return err;
        }
    }

    async function get_password_id(client, principal_name){
      try{
    
        const result = await client
        .api('/users/'+principal_name+'/authentication/passwordMethods/')
        .version('beta')
        .get();
    
        return result.value[0].id;
    
      } catch (err) {
        console.log('password reset err');
        console.log(err);
        return false;
      }

    }

//----------------------------------------------------------------------------
//I changed this and still have no idea if it works
//https://docs.microsoft.com/en-us/graph/api/passwordauthenticationmethod-resetpassword?view=graph-rest-beta&tabs=javascript
exports.reset_password = async function(client, principal_name, pass) {
  //RESETS THE USER PASSWORD TO WHAT THE PASS GEN MADE
  try{
    const passwordResetResponse = {
      newPassword: pass
    };

    pass_id = get_password_id(client, principal_name)

    //should gen a random password, try this out
    const result = await client
    .api('/users/'+principal_name+'/authentication/passwordMethods/'+pass_id+'/resetPassword')
    .version('beta')
    .post(passwordResetResponse);

    console.log('new password: ' + result)

    console.log('Password Reset!');
    return true;

  } catch (err) {
    console.log('password reset err');
    console.log(err);
    return false;
  }
}
//-----------------------------------------------------------------------------

    exports.set_usage_location = async function(client, principal_name){
        //this change the users location which is required in order to assign 
        //the users licenses
        try{
        user_location = {
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
    exports.get_me = async function(client){
      try{
        //this gets the user information to construct the signature
        var result = await client
        .api('me')
        .version('v1.0')
        .get();

        console.log("me got")
        return result
        
      }catch(err){
        console.log("user err")
        console.log(err)
        return false
      }
    }