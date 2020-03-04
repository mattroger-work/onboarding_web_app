require('isomorphic-fetch');

const license_id = {
    "e1": "18181a46-0d4e-45cd-891e-60aabd171b4e",
    "p1": "078d2b04-f1bd-4111-bbd4-b4b1b354cef4",
    "e3": "6fd2c87f-b296-42f0-b197-1e91e994b900",
    "power_bi": "a403ebcc-fae0-4ca2-8c8c-7a907fd6c235",
    "e5": "ProductSkuId_c7df2760-2c81-4ef7-b578-5b5392b571df",
    "acrobat": "",
    "project": "",
    "visio": "c5928f49-12ba-48f7-ada3-0d743a3601d5",
    "bluebeam": "",
    "air_magnet": ""
}

exports.assign_licenses = async function(client, license_obj, principal_name) {
      try{
        let licenses_needed = await order_licenses(license_obj);
        license_query_obj = [];

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
        
        console.log('Licenses Added!')
        return true;
        

      } catch (err) {
        console.log('license err')
        console.log(err)
        return false;
      }
  }

  async function order_licenses(license_obj){
    let licenses_need = [];
    ctr = 0;

    for(i=0; i < license_obj.length; i++){
      if(license_obj[i].bool){
        licenses_need.push(license_obj[i].name);
      }
    }

    licenses_need.push("p1");

    for(i=0; i < licenses_need.length; i++){
      if(licenses_need[i] != 'e3' && licenses_need != 'e5'){
        ctr++;
      }else{
      }
    }


    if(ctr == licenses_need.length){
      licenses_need.push("e1");
    }


    return licenses_need;
  }
