/**
 * Created by czh on 2016/5/30.
 */
var mysql  = require('mysql');
var async = require('async');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'etc2',
    port: 3306
});
conn.connect();

//status 0未匹配,1匹配
exports.match=function(buyid, sellid, volume, price, brokerid, res) {
    console.log("BrokerMatch");
    async.series([function(cb) {
        var get_buyorder_str = "select * from etc2.order where id=" + buyid;
        console.log(get_buyorder_str);
        conn.query(get_buyorder_str, function (err, rows) {
            if (err) {
                console.log("mysql  err");
                return;
            }
            var now = rows[0].now;
            var iceberg = rows[0].iceberg;
            if (now == volume||now<volume) {
                var query_str = "UPDATE etc.order SET status=1, now=0 WHERE id = " + buyid;
                doSql(query_str);
                var query_str = "UPDATE etc2.order SET status=1, now=0 WHERE id = " + buyid;
                doSql(query_str);
                if(iceberg){
                    dealIceberg(buyid, iceberg);
                }
            }
            else {
                var query_str = "UPDATE etc.order SET now=" + Math.abs(now - volume) + " WHERE id = " + buyid;
                doSql(query_str);
                var query_str = "UPDATE etc2.order SET now=" + Math.abs(now - volume) + " WHERE id = " + buyid;
                doSql(query_str);
            }
            cb(null, "success");
        });
        },function(cb) {
            var get_sellorder_str = "select * from etc2.order where id=" + sellid;
            console.log(get_sellorder_str);
            conn.query(get_sellorder_str, function (err, rows) {
                if (err) {
                    console.log("mysql  err");
                    return;
                }
                var now = rows[0].now;
                var iceberg = rows[0].iceberg;
                if (now == volume||now<volume) {
                    var query_str = "UPDATE etc.order SET status=1, now=0 WHERE id = " + sellid;
                    doSql(query_str);
                    var query_str = "UPDATE etc2.order SET status=1, now=0 WHERE id = " + sellid;
                    doSql(query_str);
                    if(iceberg){
                        dealIceberg(sellid, iceberg);
                    }
                }
                else {
                    var query_str = "UPDATE etc.order SET now=" + Math.abs(now - volume) + " WHERE id = " + sellid;
                    doSql(query_str);
                    var query_str = "UPDATE etc2.order SET now=" + Math.abs(now - volume) + " WHERE id = " + sellid;
                    doSql(query_str);
                }
                cb(null, "success");
            });
        },
        // function(cb) {
        //     var query_str3 = "insert into etc.trade(buyid, sellid, number, brokerid) values(" + buyid + "," + sellid + "," + volume + "," + brokerid + ")";
        //     console.log(query_str3);
        //     conn.query(query_str3, function (err, rows) {
        //         if (err) {
        //             console.log("mysql  err");
        //             return;
        //         }
        //     })
        // },
        function(cb) {
            var query_str3 = "insert into etc2.trade(buyid, sellid, number, brokerid, price) values(" + buyid + "," + sellid + "," + volume + "," + brokerid + ","+price+")";
            console.log(query_str3);
            conn.query(query_str3, function (err, rows) {
                if (err) {
                    console.log("mysql  err");
                    return;
                }
                cb(null, "success");
            })
        }],
        function (err, results) {
            if (err) {
                console.log("mysql  err");
                var result={result:0, info:"server mysql error"};
                res.json(JSON.stringify(result));
                return;
            }
            else{
                var result = {success: 1};
                res.json(JSON.stringify(result));
            }
        });
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