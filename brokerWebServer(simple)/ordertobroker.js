/**
 * Created by czh on 2016/5/31.
 */
//status 0未处理，1已处理，buyorsell buy买订单，sell卖订单
//type 0市价订单, 1限价订单
var mysql  = require('mysql');
var async = require('async');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'etc',
    port: 3306
});
conn.connect();
exports.dispatch=function(orderid, traderid, brokerid, res) {
    console.log("ordertobrokerDispatch");
    console.log(orderid);
    console.log(traderid);
    console.log(brokerid);
    var brokerids = JSON.parse(brokerid);
    async.eachSeries(brokerids, function (item, callback) {
        var query_str = "insert into ordertobroker(orderid, traderid, brokerid) values("+orderid
        +","+traderid+","+item+")";
        console.log(query_str);
        conn.query(query_str, function (err, rows) {
            if(err){
                console.log("mysql  err");
                return;
            }
            callback(err, rows);
            var query_str = "select * from etc.order as A join trader as B on A.traderid=B.id and A.id="+orderid;
            console.log(query_str);
            conn.query(query_str, function (err, rows) {
                if(err){
                    console.log("mysql  err");
                    return;
                }
                require('./server').informBrokerOrder(item, JSON.stringify(rows[0]));
            });
        });
    }, function (err) {
        if(!err) {
            var result = {success: 1};
            res.json(JSON.stringify(result));
        }
        else{
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
        }
    });
};

exports.cancel=function(brokerid, orderid, res){
    console.log("ordertobrokerCancel");
    var query_str="delete from etc.ordertobroker where orderid="+orderid+" and brokerid="+brokerid;
    doSql("delete from etc2.ordertobroker where orderid="+orderid+" and brokerid="+brokerid);
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log("mysql  err");
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
            return;
        }
        var result={result:1};
        res.json(JSON.stringify(result));
    });
};

function doSql(query_str){
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if (err) {
            console.log("mysql  err");
            return;
        }
    });
}