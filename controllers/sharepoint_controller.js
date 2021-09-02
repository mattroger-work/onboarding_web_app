require('isomorphic-fetch');
const onboarding_id = 'synaptekcorp1.sharepoint.com,8a01d30a-1420-471d-9ecd-c82887f3084e,d6b56455-a47a-4f3e-8ccb-26af1125e45f';
const hqOnboarding_id = '169af5d4-390e-47f2-8a86-8970695cd407';
const subOnboarding_id = 'c13b82c3-22d1-4618-81bd-03000a2c2aee';
const userInfoList_id = "686d4c23-168c-437e-a198-8135c0fd2b83";
const time = require('../helpers/time');



/*
  //changes to AD and checks welcome email
  exports.onboard_person = async function(client, share_id){
    
        try {
          obj = {
            "Active_x0020_Directory_x0020_Imp" : true,
            "IT_x0020_Welcome_x0020_Email_x00" : true
          }

          //SET THE VARS OF THE OBJ ON SHAREPOINT
          const result = await client
          .api('sites/'+onboarding_id+'/lists/'+hqOnboarding_id+'/items/'+share_id+'/fields')
          .update(obj);

          
          console.log('AD and IT Email Updated');
          return true;

        } catch (err) {
          console.log( 'sharepoint err')
          console.log(err)
          return err;
        }
  }*/

  exports.check_welcome_letter_sent = async function(client, share_id){
    try {
      obj = {
        "IT_x0020_Welcome_x0020_Email_x00" : true
      }

      //SET THE VARS OF THE OBJ ON SHAREPOINT
      const result = await client
      .api('sites/'+onboarding_id+'/lists/'+hqOnboarding_id+'/items/'+share_id+'/fields')
      .update(obj);

      
      console.log('IT Email Updated');
      return true;

    } catch (err) {
      console.log( 'sharepoint err')
      console.log(err)
      return err;
    }
  }

  exports.check_ad_import = async function(client, share_id){
    try {
      obj = {
        "Active_x0020_Directory_x0020_Imp" : true
      }

      //SET THE VARS OF THE OBJ ON SHAREPOINT
      const result = await client
      .api('sites/'+onboarding_id+'/lists/'+hqOnboarding_id+'/items/'+share_id+'/fields')
      .update(obj);

      
      console.log('AD Import Updated');
      return true;

    } catch (err) {
      console.log( 'sharepoint err')
      console.log(err)
      return err;
    }
  }

  exports.check_licenses_assigned = async function(client, share_id){
    try {
      obj = {
        "Licensing_x0020_Assigned_x0020__" : true
      }

      //SET THE VARS OF THE OBJ ON SHAREPOINT
      const result = await client
      .api('sites/'+onboarding_id+'/lists/'+hqOnboarding_id+'/items/'+share_id+'/fields')
      .update(obj);

      
      console.log('');
      return true;

    } catch (err) {
      console.log( 'sharepoint err')
      console.log(err)
      return err;
    }
  }


  exports.get_hq_onboardings = async function(client, amount) {
    time_now = await time.get_now();
      
    filter_str = "fields/DueDate ge "+time_now+
    " and fields/Active_x0020_Directory_x0020_Imp eq 'false' or fields/DueDate ge "+time_now+
    " and fields/IT_x0020_Welcome_x0020_Email_x00 eq 'false' or fields/DueDate ge "+time_now+
    " and fields/Licensing_x0020_Assigned_x0020__ eq 'false'";
    
      try{
        //get hq onboarding items
        const result = await client
        .api('sites/'+onboarding_id+'/lists/'+hqOnboarding_id+'/items')
        .version('v1.0')
        .expand('fields')
        .header('Prefer', 'HonorNonIndexedQueriesWarningMayFailRandomly')
        .filter(filter_str)
        .orderby('fields/DueDate')
        .top(50)
        .get();

        return result.value

      } catch (err) {
        return err;
      }
  }

  exports.get_sub_onboardings = async function(client, amount) {
      try{

        //get sub onboarding items
        const result = await client
        .api('sites/'+onboarding_id+'/lists/'+subOnboarding_id+'/items')
        .version('v1.0')
        .expand('fields')
        .header('Prefer', 'HonorNonIndexedQueriesWarningMayFailRandomly')
        .filter("fields/Start_x0020_Date ge " + time.get_now() + "and fields/TBD_x003f_ eq 'false'")
        .orderby('fields/Start_x0020_Date')
        .top(amount)
        .get();

        return result.value;

      } catch (err) {
        return err;
      }
  }

  exports.get_manager_by_lookup_id = async function(client, pm_id){
    try{
      //get hq onboarding items
      const result = await client
      .api('sites/'+onboarding_id+'/lists/'+userInfoList_id+'/items/'+pm_id)
      .version('v1.0')
      .get()

      return result.fields.EMail

    } catch (err) {
      return err;
    }
  }