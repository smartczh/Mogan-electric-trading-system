/**
 * Created by czh on 2016/5/29.
 */
//status 0未处理，1已处理，buyorsell buy买订单，sell卖订单
    //type 0市价订单, 1限价订单
var mysql  = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'etc2',
    port: 3306
});
conn.connect();
exports.create=function(type, price, number, wareid, status, traderid, buyorsell, time, res) {
    console.log("orderCreate");
    var query_str="insert into etc2.order(type, price, number, now, wareid, status, traderid, buyorsell, time) values('" +
        type+"',"+price+","+number+","+number+","+wareid+",'"+status+"',"+traderid+",'"+buyorsell+"','"+time+
        "')";
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log("mysql  err");
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
            return;
        }
        var result={success:1 ,orderid:rows.insertId};
        res.json(JSON.stringify(result));
    });
};
exports.delete=function(id, res) {
    console.log("orderDelete");
    var query_str="delete from etc.order where orderid="+id;
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
exports.getAll=function(res){
    console.log("orderGetAll");
    var query_str="select * from etc.order";
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log("mysql  err");
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
            return;
        }
        //res.writeHead(200, {'Content-Type': 'text/plain'});
        res.json(JSON.stringify(rows));
    });
};

exports.getAllOrderByTradeId=function(traderid, res){
    console.log("orderGetAllOrderByTradeId");
    var query_str="select * from etc.order where traderid="+traderid;
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

exports.getSellByWareidAndBrokerid=function(wareid, brokerid, res) {
    console.log("orderGetSellByWareidAndBrokerid");
    var query_str="select price,SUM(number) as number from etc.order as A join ordertobroker as B on A.id=B.orderid " +
        "where wareid="+wareid+" and buyorsell='sell' and brokerid="+brokerid+" group by price";
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log("mysql  err");
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
            return;
        }
        console.log(rows);
        res.json(JSON.stringify(rows));
    });
};

exports.getBuyByWareidAndBrokerid=function(wareid, brokerid, res) {
    console.log("orderGetBuyByWareidAndBrokerid");
    var query_str="select price,SUM(number) as number from etc.order as A join ordertobroker as B on A.id=B.orderid " +
        "where wareid="+wareid+" and buyorsell='buy' and brokerid="+brokerid+" group by price";
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log("mysql  err");
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
            return;
        }
        console.log(rows);
        res.json(JSON.stringify(rows));
    });
};

exports.getSellWareNumber=function(id, res) {
    console.log("orderGetSellWareNumber");
    var query_str="select wareid,SUM(number) as number from etc2.order as A join ordertobroker as B on A.id=B.orderid" +
        " where buyorsell='sell' and brokerid="+id+" and status=0 group by wareid";
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log("mysql  err");
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
            return;
        }
        console.log(rows);
        res.json(JSON.stringify(rows));
    });
};

