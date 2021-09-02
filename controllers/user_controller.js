require('isomorphic-fetch');

  
  exports.get_user = async function(client, principal_name, id) {
        //this gets the user id based on the principal name
        try{
          
          const result = await client
          .api('/users/'+principal_name)
          .version('v1.0')
          .get();
  
          console.log('User ID Collected');
          
          if(id){
            return result.id;
          }else{
            return result;
          }
  
        } catch (err) {
          console.log('user id err');
          console.log(err)
          return err;
        }
    }

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
    return err;
  }
}


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
            return err;
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

    exports.create_user = async function(client, displayName, mailNickname, upn, pass){
      try{
        user = {
          accountEnabled: true,
          displayName: displayName,
          mailNickname: mailNickname,
          userPrincipalName: upn,
          passwordProfile: {
            forceChangePasswordNextSignIn: true,
            password: pass
          }
        }

        result = await client
          .api('/users')
          .post(user);

          return true
          
      }catch(err){
        console.log("create user err")
        console.log(err)
        return err
      }
    }

    exports.update_user = async function(client, user_id, first_name, last_name, job_title, phone_number, department, contract){
      try{
        user = {
          givenName: first_name,
          surname: last_name,
          jobTitle: job_title,
          mobilePhone: phone_number,
          department: department,
          officeLocation: contract,
          companyName: "Teksynap"
        }

        result = await client
          .api('/users/'+user_id)
          .update(user)

          console.log("User Updated")

          return result;
          
      }catch(err){
        console.log("update user error")
      }
    }

    exports.assign_manager = async function(client, employee_id, manager_id){
      try{
        directoryObject ={
          '@odata.id': 'https://graph.microsoft.com/v1.0/users/'+manager_id
        }

        result = await client
          .api('/users/'+employee_id+'/manager/$ref')
          .put(directoryObject)

          console.log("Manager Assigned")

          return result;
          
      }catch(err){
        console.log("assign manager error")
      }
    }