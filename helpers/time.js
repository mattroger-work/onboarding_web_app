exports.get_now = function(){
    var now = new Date()
    date = now.getDate()
    month = now.getMonth()
    year = now.getFullYear()


    now = '\'' + year + '-' + month + '-' + date + 'T00:00:00Z' + '\''

    return now;
}