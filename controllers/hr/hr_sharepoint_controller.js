require('isomorphic-fetch');
const onboarding_id = 'synaptekcorp1.sharepoint.com,8a01d30a-1420-471d-9ecd-c82887f3084e,d6b56455-a47a-4f3e-8ccb-26af1125e45f';
const hqOnboarding_id = '/169af5d4-390e-47f2-8a86-8970695cd407';
const time = require('../../helpers/time');

exports.get_hq_onboardings = async function(client, amount) {

    var filter_str = "fields/DueDate ge " + time.get_now() +
        " and fields/Welcome_x0020_Email_x0020_Sent ne 'YES'" +
        " and fields/Welcome_x0020_Email_x0020_Sent ne 'COMPLETE'" +
        "and fields/Welcome_x0020_Email_x0020_Sent ne 'tb'";

    try{
        // ms graph can't read empty text fields or null so I have to do a != to find them
      //get hq onboarding items
      //this will still get those that are completed also the date is kinda messed up.
      //I'm thinking with the date I am not getting the correct nums because arr start 0 lol
      const result = await client
      .api('sites/'+onboarding_id+'/lists'+hqOnboarding_id+'/items')
      .version('v1.0')
      .expand('fields')
      .header('Prefer', 'HonorNonIndexedQueriesWarningMayFailRandomly')
      .filter(filter_str)
      .orderby('fields/DueDate')
      .top(50)
      .get();

      return result.value;

    } catch (err) {
      return err;
    }
}
