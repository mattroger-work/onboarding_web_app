exports.render_create_sharepoint = async function(client, res){
    let params = { title: 'HQ Onboarding Tracker', active: { create: true }};

    res.render('sharepoint_form', params);
}