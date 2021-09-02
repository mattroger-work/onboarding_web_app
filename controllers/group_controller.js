require('isomorphic-fetch');

exports.add_to_intune_pilot = async function(client, id){

    directoryObject ={
        '@odata.id': 'https://graph.microsoft.com/v1.0/directoryObjects/' + id
    }

    try{
        //add user to group
        var result = await client
        .api('groups/76024cfb-d8b7-4bda-be60-33e932350245/members/$ref')
        .version('v1.0')
        .post(directoryObject);

        return true;

    }catch(err){
        console.log('group err');
        console.log(err)
        return err
    }

}

exports.add_to_windows_10_new = async function(client, id){

    directoryObject ={
        '@odata.id': 'https://graph.microsoft.com/v1.0/directoryObjects/' + id
    }

    try{
        //add user to group
        var result = await client
        .api('groups/81251daf-6228-4442-ae03-a8e64d89c189/members/$ref')
        .version('v1.0')
        .post(directoryObject);

        return true;

    }catch(err){
        console.log('group err');
        console.log(err)
        return err
    }

}