//Cookie Session and web token
let secret = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";
let jwt = require('jsonwebtoken');

//input username
exports.generateToken = function (username){
    let two_hrs_sec = 2 * 60 * 60;
    let exp_time = Math.round((new Date()).getTime() / 1000 + two_hrs_sec);
    let payload = {"exp" : exp_time, "usr" : username};
    const signed = jwt.sign(payload, secret, {noTimestamp: true});
    return signed;
}

//input: token from the client, req, res, callback function for successful authentication and wrong authentication
exports.verifyToken = function (token, req, res, authFail ,authSucess){
    jwt.verify(token, secret, (err, decode)=>{
        console.log('request: ',req.body,"\n","decode: ",decode);
        if (err){
            authFail(req, res);
        }
        else {//both the time and the username
            if(req.params.username == decode.usr && decode.exp >= Math.round((new Date()).getTime() / 1000)) {
                authSucess(req, res);
            }
            else {
                authFail(req, res);
            }
        }
    })
}
//write validate function
//this is used to validate the cookie session