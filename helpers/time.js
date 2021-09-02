//GETS THE DATE AND RETURNS IT AS A STRING FUNCTION
exports.get_now = function(){
    var now = new Date()
    date = now.getDate()
    month = now.getMonth() + 1;
    year = now.getFullYear()


    now = '\'' + year + '-' + month + '-' + date + 'T00:00:00Z' + '\''

    return now;
}