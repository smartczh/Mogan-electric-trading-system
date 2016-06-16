/**
 * Created by czh on 2016/5/30.
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
exports.getAll=function(res){
    console.log("wareGetAll");
    var query_str="select * from etc.ware";
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log("mysql  err");
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
            return;
        }
        res.json(JSON.stringify(rows));
    });
};

exports.getById=function(wareid, res){
    console.log("wareGetById");
    var query_str="select * from etc.ware where id="+wareid;
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log("mysql  err");
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
            return;
        }
        res.json(JSON.stringify(rows));
    });
};