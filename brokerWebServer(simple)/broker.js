/**
 * Created by czh on 2016/5/29.
 */
var mysql  = require('mysql');
var request = require('request');
var async = require('async');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'etc2',
    port: 3306
});
conn.connect();
exports.register=function(logname, password, name, phone, email, req, res) {
    console.log("brokerRegister");
    var query_str="select * from broker where logname='"+logname+"'";
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if (err) {
            console.log("mysql  err");
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
            return;
        }
        if (rows.length != 0) {//该用户名已经被注册
            var result = {result: 0,info:"logname has been used"};
            res.json(JSON.stringify(result));
            return;
        }
        else {
            var query_str = "insert into broker(logname, password, name, phone, email) values('" +
                logname + "','" + password + "','" + name + "','" + phone + "','" + email + "')";
            console.log(query_str);
            conn.query(query_str, function (err, rows) {
                if (err) {
                    console.log("mysql  err");
                    var result={result:0, info:"server mysql error"};
                    res.json(JSON.stringify(result));
                    return;
                }
                var result = {result: 1};
                res.json(JSON.stringify(result));
            });
        }
    });
};
exports.login=function login(logname, password, req, res){
    console.log("brokerLogin");
    var query_str="select password from broker where logname='"+logname+"'";
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log("mysql  err");
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
            return;
        }
        if(rows.length==0){
            var result = {result: 0, info:"logname does not exist"};
            res.json(JSON.stringify(result));
            return;
        }
        var real_password = rows[0].password;
        if(password==real_password){
            var get_id_str="select id from broker where logname='"+logname+"'";
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
                res.json(result);
            });
        }
        else{
            var result = {result: 0, info:"password error"};
            res.json(JSON.stringify(result));
        }
    });
};
exports.get=function(logname, res){
    console.log("brokerGet");
    var query_str="select * from broker where logname='"+logname+"'";
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log("mysql  err");
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
            return;
        }
        console.log(rows[0]);
        //res.writeHead(200, {'Content-Type': 'text/plain'});
        res.json(JSON.stringify(rows[0]));
    });
};
exports.getById=function(brokerid, res){
    console.log("brokerGetById");
    var query_str="select * from etc2.broker where brokerid="+brokerid;
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log("mysql  err");
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
            return;
        }
        var mark = 10*rows.length;//更新积分
        var query_str="update etc2.broker set mark="+mark+" where id="+brokerid;
        console.log(query_str);
        conn.query(query_str, function (err, rows) {
            if(err){
                console.log("mysql  err");
                var result={result:0, info:"server mysql error"};
                res.json(JSON.stringify(result));
                return;
            }
            var query_str="select * from broker where id="+brokerid;
            console.log(query_str);
            conn.query(query_str, function (err, rows) {
                if(err){
                    console.log("mysql  err");
                    var result={result:0, info:"server mysql error"};
                    res.json(JSON.stringify(result));
                    return;
                }
                console.log(rows[0]);
                res.json(JSON.stringify(rows[0]));
            });
        });
    });
};
exports.getAll=function(res){
    console.log("brokerGetAll2");
    var query_str="select * from etc2.broker";
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
exports.getDispatch=function(brokerid, res){
    console.log("brokerGetDispatch");
    var query_str="select * from etc2.ordertobroker as A inner join etc2.order as B on A.orderid=B.id where brokerid="+
        brokerid;
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
exports.getDispatchStatus0=function(brokerid, res){
    console.log("brokerGetDispatchStatus0");
    var query_str="select B.id as orderid,B.price,B.number,B.now,B.type,C.name,D.logname,D.phone,B.buyorsell from etc2.ordertobroker as A inner join etc2.order as B on A.orderid=B.id and brokerid="+
        brokerid+" and status=0 join etc2.ware as C on B.wareid=C.id join etc.trader as D on B.traderid=D.id";
    //var query_str="(select * from ordertobroker as A inner join etc.order as B on A.orderid=B.id where brokerid="+
    //    brokerid+" and status=0) as C join (select * from trader) as D on C.traderid=D.id";
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log(err);
            var result={result:0, info:"server mysql error"};
            res.json(JSON.stringify(result));
            return;
        }
        res.json(JSON.stringify(rows));
    });
};

exports.getDispatchStatus1=function(brokerid, res){
    console.log("brokerGetDispatchStatus1");
    var query_str="select B.id as orderid,B.price,B.number,B.now,B.type,C.name,D.logname,D.phone,B.buyorsell from etc2.ordertobroker as A inner join etc2.order as B on A.orderid=B.id and brokerid="+
        brokerid+" and status=1 join etc2.ware as C on B.wareid=C.id join etc.trader as D on B.traderid=D.id";
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

// exports.getById=function (brokerid, res){
//     console.log("brokerGetById");
//     var query_str="select * from broker where id="+brokerid;
//     console.log(query_str);
//     conn.query(query_str, function(err, rows){
//         if(err){
//             console.log("mysql  err");
//             var result={result:0, info:"server mysql error"};
//             res.json(JSON.stringify(result));
//             return;
//         }
//         res.json(JSON.stringify(rows[0]));
//     });
// };

exports.dealOrder = function (orderid, brokerid, res) {//处理指定id的订单
    console.log("brokerDealOrder");
    var query_str = "select * from etc2.order where id="+orderid;
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log("mysql  err");
            return;
        }
        var type = rows[0].type;
        var buyorsell = rows[0].buyorsell;
        var price = rows[0].price;//该订单价格
        var now = rows[0].now;//该订单现有数量
        var wareid = rows[0].wareid;
        var iceberg = rows[0].iceberg;
        if (type == 0) {//市价订单
            if (buyorsell == "buy") {
                var query_str = "select * from etc2.order as A join ordertobroker as B on A.id=B.orderid" +
                    " and B.brokerid ="+brokerid+" and A.wareid="+wareid+" and A.buyorsell='sell'" +
                    " and A.status=0 and (A.type=1 or A.type=2) order by price";
                console.log(query_str);
                conn.query(query_str, function (err, rows) {
                    if (err) {
                        console.log("mysql  err");
                        return;
                    }
                    console.log(rows);
                    var length = rows.length;
                    var buy_now = now;
                    for (var i = 0; i < length; i++){
                        var sell_type = rows[i].type;
                        var sell_now = rows[i].now;
                        var sellid = rows[i].id;
                        var sell_price = rows[i].price;
                        var iceberg2 = rows[i].iceberg;
                        var gap = sell_now-buy_now;
                        if(gap>0){
                            doSql("update etc.order set now=0, status=1 where id="+orderid);
                            doSql("update etc.order set now="+gap+" where id="+sellid);
                            //doSql("insert into trade(buyid, sellid, number, brokerid) values("+orderid+","+sellid+","+buy_now+","+brokerid+")");
                            doSql("update etc2.order set now=0, status=1 where id="+orderid);
                            doSql("update etc2.order set now="+gap+" where id="+sellid);
                            if(iceberg){
                                dealIceberg(orderid, iceberg);
                            }
                            doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+orderid+","+sellid+","+buy_now+","+brokerid+","+sell_price+")");
                            break;
                        }
                        if(gap==0){
                            doSql("update etc.order set now=0, status=1 where id="+orderid);
                            doSql("update etc.order set now=0, status=1 where id="+sellid);
                            //doSql("insert into trade(buyid, sellid, number, brokerid) values("+orderid+","+sellid+","+buy_now+","+brokerid+")");
                            doSql("update etc2.order set now=0, status=1 where id="+orderid);
                            doSql("update etc2.order set now=0, status=1 where id="+sellid);
                            if(iceberg){
                                dealIceberg(orderid, iceberg);
                            }
                            if(iceberg2){
                                dealIceberg(sellid, iceberg2);
                            }
                            doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+orderid+","+sellid+","+buy_now+","+brokerid+","+sell_price+")");
                            break;
                        }
                        if(gap<0){
                            buy_now = buy_now-sell_now;
                            doSql("update etc.order set now="+(-gap)+" where id="+orderid);
                            doSql("update etc.order set now=0, status=1 where id="+sellid);
                            //doSql("insert into trade(buyid, sellid, number, brokerid) values("+orderid+","+sellid+","+sell_now+","+brokerid+")");
                            doSql("update etc2.order set now="+(-gap)+" where id="+orderid);
                            doSql("update etc2.order set now=0, status=1 where id="+sellid);
                            if(iceberg2){
                                dealIceberg(sellid, iceberg2);
                            }
                            doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+orderid+","+sellid+","+sell_now+","+brokerid+","+sell_price+")");
                            continue;
                        }
                    }
                });
            }
            if(buyorsell == "sell") {
                var query_str = "select * from etc2.order as A join ordertobroker as B on A.id=B.orderid" +
                    " and B.brokerid ="+brokerid+" and A.wareid="+wareid+" and A.buyorsell='buy'" +
                    " and A.status=0 and (A.type=1 or A.type=2) order by price desc";
                console.log(query_str);
                conn.query(query_str, function (err, rows) {
                    if (err) {
                        console.log("mysql  err");
                        return;
                    }
                    console.log(rows);
                    var length = rows.length;
                    var sell_now = now;
                    for (var i = 0; i < length; i++){
                        var buy_type = rows[i].type;
                        var buy_now = rows[i].now;
                        var buyid = rows[i].id;
                        var buy_price = rows[i].price;
                        var iceberg2 = rows[i].iceberg;
                        var gap = buy_now-sell_now;
                        if(gap>0){
                            doSql("update etc.order set now=0, status=1 where id="+orderid);
                            doSql("update etc.order set now="+gap+" where id="+buyid);
                            //doSql("insert into trade(buyid, sellid, number, brokerid) values("+buyid+","+orderid+","+sell_now+","+brokerid+")");
                            doSql("update etc2.order set now=0, status=1 where id="+orderid);
                            doSql("update etc2.order set now="+gap+" where id="+buyid);
                            if(iceberg){
                                dealIceberg(orderid, iceberg);
                            }
                            doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+buyid+","+orderid+","+sell_now+","+brokerid+","+buy_price+")");
                            break;
                        }
                        if(gap==0){
                            doSql("update etc.order set now=0, status=1 where id="+orderid);
                            doSql("update etc.order set now=0, status=1 where id="+buyid);
                            //doSql("insert into trade(buyid, sellid, number, brokerid) values("+buyid+","+orderid+","+sell_now+","+brokerid+")");
                            doSql("update etc2.order set now=0, status=1 where id="+orderid);
                            doSql("update etc2.order set now=0, status=1 where id="+buyid);
                            if(iceberg){
                                dealIceberg(orderid, iceberg);
                            }
                            if(iceberg2){
                                dealIceberg(buyid, iceberg2);
                            }
                            doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+buyid+","+orderid+","+sell_now+","+brokerid+","+buy_price+")");
                            break;
                        }
                        if(gap<0){
                            sell_now = sell_now-buy_now;
                            doSql("update etc.order set now="+(-gap)+" where id="+orderid);
                            doSql("update etc.order set now=0, status=1 where id="+buyid);
                            //doSql("insert into trade(buyid, sellid, number, brokerid) values("+buyid+","+orderid+","+buy_now+","+brokerid+")");
                            doSql("update etc2.order set now="+(-gap)+" where id="+orderid);
                            doSql("update etc2.order set now=0, status=1 where id="+buyid);
                            if(iceberg2){
                                dealIceberg(buyid, iceberg2);
                            }
                            doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+buyid+","+orderid+","+buy_now+","+brokerid+","+buy_price+")");
                            continue;
                        }
                    }
                });
            }
        }
        if (type == 1||type==2) {//限价订单或者是止损单
            if (buyorsell == "buy") {
                var query_str = "select * from etc2.order as A join ordertobroker as B on A.id=B.orderid" +
                    " and B.brokerid ="+brokerid+" and A.wareid="+wareid+" and A.buyorsell='sell'" +
                    " and A.status=0 order by (case when type=0 then 1 else 2 end), price";
                console.log(query_str);
                conn.query(query_str, function (err, rows) {
                    if (err) {
                        console.log("mysql  err");
                        return;
                    }
                    console.log(rows);
                    var length = rows.length;
                    var buy_now = now;
                    var buy_price = price;
                    for (var i = 0; i < length; i++){
                        var sell_type = rows[i].type;
                        var sell_now = rows[i].now;
                        var sell_price = rows[i].price;
                        var sellid = rows[i].id;
                        var iceberg2 = rows[i].iceberg;
                        if(sell_type==0){
                            var gap = sell_now-buy_now;
                            if(gap>0){
                                doSql("update etc.order set now=0, status=1 where id="+orderid);
                                doSql("update etc.order set now="+gap+" where id="+sellid);
                                //doSql("insert into trade(buyid, sellid, number, brokerid) values("+orderid+","+sellid+","+buy_now+","+brokerid+")");
                                doSql("update etc2.order set now=0, status=1 where id="+orderid);
                                doSql("update etc2.order set now="+gap+" where id="+sellid);
                                if(iceberg){
                                    dealIceberg(orderid, iceberg);
                                }
                                doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+orderid+","+sellid+","+buy_now+","+brokerid+","+buy_price+")");
                                break;
                            }
                            if(gap==0){
                                doSql("update etc.order set now=0, status=1 where id="+orderid);
                                doSql("update etc.order set now=0, status=1 where id="+sellid);
                                //doSql("insert into trade(buyid, sellid, number, brokerid) values("+orderid+","+sellid+","+buy_now+","+brokerid+")");
                                doSql("update etc2.order set now=0, status=1 where id="+orderid);
                                doSql("update etc2.order set now=0, status=1 where id="+sellid);
                                if(iceberg){
                                    dealIceberg(orderid, iceberg);
                                }
                                if(iceberg2){
                                    dealIceberg(sellid, iceberg2);
                                }
                                doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+orderid+","+sellid+","+buy_now+","+brokerid+","+buy_price+")");
                                break;
                            }
                            if(gap<0){
                                buy_now = buy_now-sell_now;
                                doSql("update etc.order set now="+(-gap)+" where id="+orderid);
                                doSql("update etc.order set now=0, status=1 where id="+sellid);
                                //doSql("insert into trade(buyid, sellid, number, brokerid) values("+orderid+","+sellid+","+sell_now+","+brokerid+")");
                                doSql("update etc2.order set now="+(-gap)+" where id="+orderid);
                                doSql("update etc2.order set now=0, status=1 where id="+sellid);
                                if(iceberg2){
                                    dealIceberg(sellid, iceberg2);
                                }
                                doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+orderid+","+sellid+","+sell_now+","+brokerid+","+buy_price+")");
                                continue;
                            }
                        }
                        if(sell_type==1||sell_type==2){
                            if(sell_price>buy_price)
                                break;
                            var gap = sell_now-buy_now;
                            if(gap>0){
                                doSql("update etc.order set now=0, status=1 where id="+orderid);
                                doSql("update etc.order set now="+gap+" where id="+sellid);
                                //doSql("insert into trade(buyid, sellid, number, brokerid) values("+orderid+","+sellid+","+buy_now+","+brokerid+")");
                                doSql("update etc2.order set now=0, status=1 where id="+orderid);
                                doSql("update etc2.order set now="+gap+" where id="+sellid);
                                if(iceberg){
                                    dealIceberg(orderid, iceberg);
                                }
                                doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+orderid+","+sellid+","+buy_now+","+brokerid+","+buy_price+")");
                                break;
                            }
                            if(gap==0){
                                doSql("update etc.order set now=0, status=1 where id="+orderid);
                                doSql("update etc.order set now=0, status=1 where id="+sellid);
                                //doSql("insert into trade(buyid, sellid, number, brokerid) values("+orderid+","+sellid+","+buy_now+","+brokerid+")");
                                doSql("update etc2.order set now=0, status=1 where id="+orderid);
                                doSql("update etc2.order set now=0, status=1 where id="+sellid);
                                if(iceberg){
                                    dealIceberg(orderid, iceberg);
                                }
                                if(iceberg2){
                                    dealIceberg(sellid, iceberg2);
                                }
                                doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+orderid+","+sellid+","+buy_now+","+brokerid+","+buy_price+")");
                                break;
                            }
                            if(gap<0){
                                buy_now = buy_now-sell_now;
                                doSql("update etc.order set now="+(-gap)+" where id="+orderid);
                                doSql("update etc.order set now=0, status=1 where id="+sellid);
                                //doSql("insert into trade(buyid, sellid, number, brokerid) values("+orderid+","+sellid+","+sell_now+","+brokerid+")");
                                doSql("update etc2.order set now="+(-gap)+" where id="+orderid);
                                doSql("update etc2.order set now=0, status=1 where id="+sellid);
                                if(iceberg2){
                                    dealIceberg(sellid, iceberg2);
                                }
                                doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+orderid+","+sellid+","+sell_now+","+brokerid+","+buy_price+")");
                                continue;
                            }
                        }
                    }
                });
            }
            if(buyorsell == "sell") {
                var query_str = "select * from etc2.order as A join ordertobroker as B on A.id=B.orderid" +
                    " and B.brokerid ="+brokerid+" and A.wareid="+wareid+" and A.buyorsell='buy'" +
                    " and A.status=0 order by (case when type=0 then 1 else 2 end), price desc";
                console.log(query_str);
                conn.query(query_str, function (err, rows) {
                    if (err) {
                        console.log("mysql  err");
                        return;
                    }
                    console.log(rows);
                    var length = rows.length;
                    var sell_now = now;
                    var sell_price = price;
                    for (var i = 0; i < length; i++){
                        var buy_type = rows[i].type;
                        var buy_now = rows[i].now;
                        var buy_price = rows[i].price;
                        var buyid = rows[i].id;
                        var iceberg2 = rows[i].iceberg;
                        if(buy_type==0){
                            var gap = buy_now-sell_now;
                            if(gap>0){
                                doSql("update etc.order set now=0, status=1 where id="+orderid);
                                doSql("update etc.order set now="+gap+" where id="+buyid);
                                //doSql("insert into trade(buyid, sellid, number, brokerid) values("+buyid+","+orderid+","+sell_now+","+brokerid+")");
                                doSql("update etc2.order set now=0, status=1 where id="+orderid);
                                doSql("update etc2.order set now="+gap+" where id="+buyid);
                                if(iceberg){
                                    dealIceberg(orderid, iceberg);
                                }
                                doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+buyid+","+orderid+","+sell_now+","+brokerid+","+sell_price+")");
                                break;
                            }
                            if(gap==0){
                                doSql("update etc.order set now=0, status=1 where id="+orderid);
                                doSql("update etc.order set now=0, status=1 where id="+buyid);
                                //doSql("insert into trade(buyid, sellid, number, brokerid) values("+buyid+","+orderid+","+sell_now+","+brokerid+")");
                                doSql("update etc2.order set now=0, status=1 where id="+orderid);
                                doSql("update etc2.order set now=0, status=1 where id="+buyid);
                                if(iceberg){
                                    dealIceberg(orderid, iceberg);
                                }
                                if(iceberg2){
                                    dealIceberg(buyid, iceberg2);
                                }
                                doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+buyid+","+orderid+","+sell_now+","+brokerid+","+sell_price+")");
                                break;
                            }
                            if(gap<0){
                                sell_now = sell_now-buy_now;
                                doSql("update etc.order set now="+(-gap)+" where id="+orderid);
                                doSql("update etc.order set now=0, status=1 where id="+buyid);
                                //doSql("insert into trade(buyid, sellid, number, brokerid) values("+buyid+","+orderid+","+buy_now+","+brokerid+")");
                                doSql("update etc2.order set now="+(-gap)+" where id="+orderid);
                                doSql("update etc2.order set now=0, status=1 where id="+buyid);
                                if(iceberg2){
                                    dealIceberg(buyid, iceberg2);
                                }
                                doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+buyid+","+orderid+","+buy_now+","+brokerid+","+sell_price+")");
                                continue;
                            }
                        }
                        if(buy_type==1||buy_type==2){
                            if(buy_price<sell_price){
                                break;
                            }
                            var gap = buy_now-sell_now;
                            if(gap>0){
                                doSql("update etc.order set now=0, status=1 where id="+orderid);
                                doSql("update etc.order set now="+gap+" where id="+buyid);
                                //doSql("insert into trade(buyid, sellid, number, brokerid) values("+buyid+","+orderid+","+sell_now+","+brokerid+")");
                                doSql("update etc2.order set now=0, status=1 where id="+orderid);
                                doSql("update etc2.order set now="+gap+" where id="+buyid);
                                if(iceberg) {
                                    dealIceberg(orderid, iceberg);
                                }
                                doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+buyid+","+orderid+","+sell_now+","+brokerid+","+sell_price+")");
                                break;
                            }
                            if(gap==0){
                                doSql("update etc.order set now=0, status=1 where id="+orderid);
                                doSql("update etc.order set now=0, status=1 where id="+buyid);
                                //doSql("insert into trade(buyid, sellid, number, brokerid) values("+buyid+","+orderid+","+sell_now+","+brokerid+")");
                                doSql("update etc2.order set now=0, status=1 where id="+orderid);
                                doSql("update etc2.order set now=0, status=1 where id="+buyid);
                                if(iceberg){
                                    dealIceberg(orderid, iceberg);
                                }
                                if(iceberg2){
                                    dealIceberg(buyid, iceberg2);
                                }
                                doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+buyid+","+orderid+","+sell_now+","+brokerid+","+sell_price+")");
                                break;
                            }
                            if(gap<0){
                                sell_now = sell_now-buy_now;
                                doSql("update etc.order set now="+(-gap)+" where id="+orderid);
                                doSql("update etc.order set now=0, status=1 where id="+buyid);
                                //doSql("insert into trade(buyid, sellid, number, brokerid) values("+buyid+","+orderid+","+buy_now+","+brokerid+")");
                                doSql("update etc2.order set now="+(-gap)+" where id="+orderid);
                                doSql("update etc2.order set now=0, status=1 where id="+buyid);
                                if(iceberg2){
                                    dealIceberg(buyid, iceberg2);
                                }
                                doSql("insert into etc2.trade(buyid, sellid, number, brokerid, price) values("+buyid+","+orderid+","+buy_now+","+brokerid+","+sell_price+")");
                                continue;
                            }
                        }
                    }
                });
            }
        }
    });
    var result={result:1};
    res.json(JSON.stringify(result));
};

function dealIceberg(orderid, iceberg){
    console.log("dealIceberg");
    var query_str = "select * from etc2.order where iceberg="+iceberg+" and status=0";
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if(err){
            console.log("mysql  err");
            return;
        }
        if(rows[0].id){
            var orderid = rows[0].id;
            var query_str = "insert into etc2.ordertobroker select * from etc.ordertobroker where orderid="+orderid;
            doSql(query_str);
        }
    });
}

function doSql(query_str){
    console.log(query_str);
    conn.query(query_str, function (err, rows) {
        if (err) {
            console.log("mysql  err");
            return;
        }
    });
}