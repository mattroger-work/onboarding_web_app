require('isomorphic-fetch');

const license_id = {
    "e1": "18181a46-0d4e-45cd-891e-60aabd171b4e",
    "p1": "078d2b04-f1bd-4111-bbd4-b4b1b354cef4",
    "e3": "6fd2c87f-b296-42f0-b197-1e91e994b900",
    "power_bi": "a403ebcc-fae0-4ca2-8c8c-7a907fd6c235",
    "e5": "c7df2760-2c81-4ef7-b578-5b5392b571df",
    "project": "09015f9f-377f-4538-bbb5-f75ceb09358a",
    "visio": "c5928f49-12ba-48f7-ada3-0d743a3601d5",
    "enterprise_mob": "efccb6f7-5641-4e0e-bd10-b4976e1bf68e",
    "win10_e5": "1e7e1070-8ccb-4aca-b470-d7cb538cb07e"
}

exports.assign_licenses = async function(client, license_obj, principal_name, retry_order_licenses) {
      try{
        var licenses_needed = await retry_order_licenses ||  await order_licenses(license_obj, false);
        license_query_obj = [];

        //THIS CREATES AND ARR OF AN OBJ THAT IS NEED FOR THE ADDLICENSES VAR
        for(i = 0; i < licenses_needed.length; i++){
          license_query_obj.push({
            disabledPlans: [],
            skuId: license_id[licenses_needed[i]]
          })
        }

        base_licenses = {
            addLicenses: license_query_obj,
            removeLicenses: []
        }

        //assign licenses
        var result = await client
        .api('/users/'+principal_name+'/assignLicense')
        .version('v1.0')
        .post(base_licenses);
        
        console.log('Licenses Added');
        return true;
        

      } catch (err) {
        console.log("catch");
        //if we find a p1 license we only tried it one time so we send it back as retry=true
        //if we find an enterprise mob then we know we tried it twice so when just send back a false
        let ctr = 0;
        for(var i=0; i<licenses_needed.length; i++){
          console.log("for loop");
          if(licenses_needed[i] == "p1"){
            console.log("p1 found");
            ctr++;
          }
        }//end of for loop
        if(ctr == licenses_needed.length){
          console.log('license err');
          console.log(err);
          return false;
        }else{
          console.log("re-order license")
          let result = order_licenses(license_obj,true)
          try{
            exports.assign_licenses(client, license_obj, principal_name, result);
            return true;
          }catch(err2){
            console.log('license err');
            console.log(err2);
            return false;
          }
        }
      }
  }

  //THIS FUCNTION CREATES AN ARR WITH ALL THE LICENSE NAMES THAT THE USER NEEDS
  async function order_licenses(license_obj, retry){
    let licenses_need = [];
    ctr = 0;

    for(i=0; i < license_obj.length; i++){
      if(license_obj[i].bool){
        licenses_need.push(license_obj[i].name);
        //new addition those with e3 need windows 10 enterpirse e5 license
      }
    }

    licenses_need.forEach((ele)=>{
      if(ele == 'e3'){
        licenses_need.push('win10_e5')
      }
    })

    //new param retry will let the function know if we tried before if retry=true then we are trying a second
    //time with the enterprise_mob license
    if(!retry){
      licenses_need.push("p1");
    }else if(retry){
      licenses_need.push("enterprise_mob");
    }

    for(i=0; i < licenses_need.length; i++){
      if(licenses_need[i] != 'e3' && licenses_need[i] != 'e5'){
        ctr++;
      }else{}
    }

    if(ctr == licenses_need.length){
      licenses_need.push("e1");
    }

    return licenses_need;
  }
