/**
 * Created by czh on 2016/5/28.
 */
var mysql  = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'etc',
    port: 3306
});
conn.connect();
exports.register=function(logname, password, name, phone, email, req, res) {
    console.log("traderRegister");
    var query_str="select * from trader where logname='"+logname+"'";
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log("mysql  err");
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
            return;
        }
        if(rows.length!=0){//该用户名已经被注册
            var result = {result: 0, info:"logname has been used"};
            res.json(JSON.stringify(result));
            return;
        }
        else{
            var query_str="insert into trader(logname, password, name, phone, email) values('" +
                logname+"','"+password+"','"+name+"','"+phone+"','"+email+"')";
            console.log(query_str);
            conn.query(query_str, function (err, rows) {
                if(err){
                    console.log("mysql  err");
                    var result={result:0, info:"server mysql error"};
                    res.json(JSON.stringify(result));
                    return;
                }
                console.log(rows);
                var result = {result: 1};
                res.json(JSON.stringify(result));
            });
        }
    });
};
exports.login=function login(logname, password, req, res){
    console.log("traderLogin");
    var query_str="select password from trader where logname='"+logname+"'";
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log("mysql  err");
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
            return;
        }
        if(rows.length==0){
            var result = {result: 0 ,info:"logname does not exist"};
            res.json(JSON.stringify(result));
            return;
        }
        var real_password = rows[0].password;
        if(password==real_password){
            var get_id_str="select id from trader where logname='"+logname+"'";
            console.log(get_id_str);
            conn.query(get_id_str, function (err, rows) {
                if (err) {
                    console.log("mysql  err");
                    var result={result:0, info:"server mysql error"};
                    res.json(JSON.stringify(result));
                    return;
                }
                var result = {result: 1};
                req.session.logname = logname;
                req.session.idd=rows[0].id;
                res.json(JSON.stringify(result));
            });
        }
        else{
            var result = {result: 0, info:"password error"};
            res.json(JSON.stringify(result));
        }
    });
};
exports.get=function(logname, res){
    console.log("traderGet");
    var query_str="select * from trader where logname='"+logname+"'";
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log("mysql  err");
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
            return;
        }
        res.json(JSON.stringify(rows[0]));
    });
};
exports.getById=function(id, res){
    console.log("traderGetById");
    var query_str="select * from trader where id="+id;
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log("mysql  err");
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
            return;
        }
        res.json(JSON.stringify(rows[0]));
    });
};
// exports.getAllBroker=function(res){
//     console.log("traderGetAllBroker");
//     var query_str="select * from broker";
//     console.log(query_str);
//     conn.query(query_str, function (err, rows) {
//         if(err){
//             console.log("mysql  err");
//             var result={result:0, info:"server mysql error"};
//             res.json(JSON.stringify(result));
//             return;
//         }
//         res.json(JSON.stringify(rows));
//     });
// };