require('isomorphic-fetch');

const license_id = {
    "e1": "18181a46-0d4e-45cd-891e-60aabd171b4e",
    "p1": "078d2b04-f1bd-4111-bbd4-b4b1b354cef4",
    "not_e3": "6fd2c87f-b296-42f0-b197-1e91e994b900", // really office 365 e3
    "power_bi": "a403ebcc-fae0-4ca2-8c8c-7a907fd6c235",
    "e5": "c7df2760-2c81-4ef7-b578-5b5392b571df",
    "project": "09015f9f-377f-4538-bbb5-f75ceb09358a",
    "visio": "c5928f49-12ba-48f7-ada3-0d743a3601d5",
    "ems_e3": "efccb6f7-5641-4e0e-bd10-b4976e1bf68e",
    "win10_e5": "1e7e1070-8ccb-4aca-b470-d7cb538cb07e",
    "intune": "061f9ace-7d42-4136-88ac-31dc755f143f",
    "e3": "05e9a617-0261-4cee-bb44-138d3ef5d965" // really microsoft e3
}

exports.assign_licenses = async function(client, license_obj, principal_name) {

    try{
        var licenses_needed = await exports.order_licenses(license_obj);

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

        return true;

    }catch(err){
        console.log('license err');
        console.log(err)
        return err
    }
    
}

exports.order_licenses = async function(license_obj){
    licenses_need = [];
    e3ctr = 0;
    e1ctr = 0;

    for(i=0; i<license_obj.length; i++){
        if(license_obj[i].bool){
            licenses_need.push(license_obj[i].name);
        }
    }

    for(i=0; i<licenses_need.length; i++){
        if(licenses_need[i] == "e5"){
            licenses_need.push("ems_e3")
            e3ctr++;
        }
        if(licenses_need[i] == "e3" || licenses_need[i] == "e5"){
            e3ctr++;
        }
        if(licenses_need[i] == "e1"){
            e1ctr++;
        }
    }

    if(e3ctr == 0){
        licenses_need.push("p1");
        if(e1ctr == 0){
            licenses_need.push("e1");
        } 
    }

    return licenses_need
}