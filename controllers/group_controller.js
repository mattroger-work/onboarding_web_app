require('isomorphic-fetch');
var user = require('./user_controller');
var obj_api = "https://graph.microsoft.com/v1.0/directoryObjects/"

const groups = {
    "full_time": "8c1246a2-97a8-4217-ba06-77f5c6515511",
    "customers": "8f0676d6-134a-4b5b-ab82-c93fd5d06a11"
}





exports.assign_groups = async function(client, tek_email) {
      try{

        id = await user.get_id(client, tek_email);

        obj = {
            "@odata.id": obj_api + id
        };

        /*
        I can't assign this license because it is a DL rather than an O365 group
        //add to full-time group
        var result = await client
        .api('/groups/'+groups["full_time"]+'/members/$ref')
        .version('v1.0')
        .post(obj);
        console.log('full-time added');
        */
       
        //add to customers group
        var result = await client
        .api('/groups/'+groups["customers"]+'/members/$ref')
        .version('v1.0')
        .post(obj);
        console.log('customers added')
        
        console.log('Groups added');

        return true;

        
      } catch (err) {
        console.log('group err');
        console.log(err)
        return false;
      }
  }
