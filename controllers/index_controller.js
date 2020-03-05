var auth_helper = require('../helpers/auth');

exports.render_get = async function(req, res, next) {
    let params = {title: 'Home', active: { home: true }};

    const accessToken = await auth_helper.getAccessToken(req.cookies, res)
    const userName = req.cookies.graph_user_name;

    //IF THE USERS CREDENTIALS ISN'T IN COOKIES GET THE AUTH URL
    if(accessToken && userName){
        params.user = userName;
    }else{
        params.signInUrl = auth_helper.getAuthUrl();
    }

    res.render('index', params);
  }