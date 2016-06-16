/**
 * Created by czh on 2016/5/28.
 */
var trader = require("./trader");
//var trade = require("./trade");
//var broker = require("./broker");
var order = require("./order");
var ordertobroker=require('./ordertobroker');
var ware = require('./ware');
var express = require('express');
var session = require('express-session');
var request = require('request');

var app = express();
var http_server = require('http').Server(app);

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

 var bodyParser = require('body-parser');
// // 创建 application/x-www-form-urlencoded 编码解析
 var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/trader/register', urlencodedParser, function (req, res) {//trader注册
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    var logname = req.body.logname;
    var password = req.body.password;
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    if(logname&&password&&name&&phone&&email) {
        trader.register(logname, password, name, phone, email, req, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments"};
        res.json(JSON.stringify(result));
        return;
    }
});
app.get('/trader/get', function (req, res) {//trader根据logname获取
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    var logname =  req.query.logname;
    if(logname) {
        trader.get(logname, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments"};
        res.json(JSON.stringify(result));
        return;
    }
});
app.get('/trader/getById', function (req, res) {//trader根据id获取
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    var id =  req.query.id;
    if(id) {
        trader.getById(id, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments"};
        res.json(JSON.stringify(result));
        return;
    }
});
app.get('/trader/getAllBroker', function (req, res) {//trader获取所有brokers
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    console.log("traderGetAllBroker");
    request.get('http://localhost:8082/broker/getAll', function (error, response, body) {
        if (!error) {
            //res.send(body);//两百多个对象，对象不是默认json
            //res.json(JSON.stringify(JSON.parse(body)));//多了引号
            res.json(JSON.parse(body));
        }
    });
    //trader.getAllBroker(res);
});
app.get('/trader/getBrokerById', function (req, res) {//trader获取指定id的brokers
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    console.log("traderGetBrokerById");
    var brokerid = req.query.brokerid;
    if(brokerid) {
        request.get('http://localhost:8082/broker/getById?brokerid=' + brokerid, function (error, response, body) {
            if (!error) {
                res.json(JSON.parse(body));
            }
        });
    }
    else{
        var result = {result: 0, info:"not enough arguments, brokerid needed"};
        res.json(JSON.stringify(result));
        return;
    }
    //trader.getAllBroker(res);
});
app.post('/trader/login', urlencodedParser, function (req, res) {//trader登录
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    var logname =  req.body.logname;
    var password = req.body.password;
    if(logname&&password) {
        trader.login(logname, password, req, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments"};
        res.json(JSON.stringify(result));
        return;
    }
});
app.get('/trader/getSession', function (req, res) {//trader获取session
    ///res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    console.log("traderGetSession");
    console.log(req.sessionID);
    res.json(JSON.stringify(req.session));
});
app.get('/trader/getBuyByWareid', function (req, res) {//获取buy订单指定物品价格数量
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    var wareid =  req.query.wareid;
    if(wareid) {
        order.getBuyByWareid(wareid, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments, wareid needed"};
        res.json(JSON.stringify(result));
        return;
    }
});
app.get('/trader/getAllOrderByTradeId', function (req, res) {//获取指定id的trader的所有订单
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    var traderid = req.query.traderid;
    if(traderid) {
        order.getAllOrderByTradeId(traderid, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments, traderid needed"};
        res.json(JSON.stringify(result));
        return;
    }
});
app.post('/trader/cancelOrder', urlencodedParser, function (req, res) {//退回订单
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    if(!req.session.idd){//未登录
        var result = {result: 0, info:"not login"};
        res.json(JSON.stringify(result));
        return;
    }
    var brokerid = req.session.idd;
    var orderid = req.body.orderid;
    if(brokerid&&orderid) {
        ordertobroker.cancel(brokerid, orderid, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments"};
        res.json(JSON.stringify(result));
        return;
    }
});

app.post('/order/create', urlencodedParser, function (req, res) {//创建订单
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    var type = req.body.type;
    var price = req.body.price;
    var number = req.body.number;
    var wareid = req.body.wareid;
    var status = 0;
    if(!req.session.idd){//未登录
        var result = {result: 0, info:"not login"};
        res.json(JSON.stringify(result));
        return;
    }
    var traderid = req.session.idd;
    var buyorsell = req.body.buyorsell;
    var time = req.body.time;
    var iceberg = req.body.iceberg;
    if(type&&price&&number&&wareid&&traderid&&buyorsell&&time&&iceberg) {
        order.create(type, price, number, wareid, status, traderid, buyorsell, time, iceberg, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments"};
        res.json(JSON.stringify(result));
        return;
    }
});
app.get('/order/getAll', function (req, res) {//获取所有订单
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    order.getAll(res);
});
app.get('/order/getSellByWareidAndBrokerid', function (req, res) {//获取sell订单指定物品指定broker价格数量
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    var wareid =  req.query.wareid;
    var brokerid = req.query.brokerid;
    if(!wareid || !brokerid){
        var result={result:0, info:"not enough arguments"};
        res.json(JSON.stringify(result));
        return ;
    }
    order.getSellByWareidAndBrokerid(wareid, brokerid, res);
});
app.get('/order/getBuyByWareidAndBrokerid', function (req, res) {//获取buy订单指定物品指定broker价格数量
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    var wareid =  req.query.wareid;
    var brokerid = req.query.brokerid;
    if(!wareid || !brokerid){
        var result={result:0, info:"not enough arguments"};
        res.json(JSON.stringify(result));
        return ;
    }
    order.getBuyByWareidAndBrokerid(wareid, brokerid, res);
});
app.get("/order/getSellWareNumber", function (req, res) {//登录broker获取所有卖商品库存
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    if(!req.session.idd){//未登录
        var result = {result: 0, info:"not login"};
        res.json(JSON.stringify(result));
        return;
    }
    var id = req.session.idd;
    order.getSellWareNumber(id, res);
});

app.post('/ordertobroker/dispatch', urlencodedParser, function (req, res) {//trader分发订单
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    if(!req.session.idd){//未登录
        var result = {result: 0, info:"not login"};
        res.json(JSON.stringify(result));
        return;
    }
    var orderid = req.body.orderid;
    var traderid = req.session.idd;
    var brokerid = req.body.brokerid;
    if(orderid&&traderid&&brokerid) {
        ordertobroker.dispatch(orderid, traderid, brokerid, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments"};
        res.json(JSON.stringify(result));
        return;
    }
});

app.post('/ordertobroker/dispatchIceberg', urlencodedParser, function (req, res) {//trader分发订单
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    if(!req.session.idd){//未登录
        var result = {result: 0, info:"not login"};
        res.json(JSON.stringify(result));
        return;
    }
    var orderid = req.body.orderid;
    var traderid = req.session.idd;
    var brokerid = req.body.brokerid;
    if(orderid&&traderid&&brokerid) {
        ordertobroker.dispatchIceberg(orderid, traderid, brokerid, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments"};
        res.json(JSON.stringify(result));
        return;
    }
});

app.get('/ware/getAll', function (req, res) {//获取所有商品
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    ware.getAll(res);
});
app.get('/ware/getById', function (req, res) {//获取id获取商品
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    var wareid = req.query.wareid;
    if(wareid) {
        ware.getById(wareid, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments, wareid needed"};
        res.json(JSON.stringify(result));
        return;
    }
});


app.use('/',  express.static(__dirname +'/'));

var brokers = {};
var io = require('socket.io')(http_server);
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('brokerLogin', function(msg){//msg为brokerid
        console.log("brokerid="+msg+" login");
        brokers[msg] = socket;
    });
});

var server = http_server.listen(8081, function () {
    console.log("server启动");
});

exports.informBrokerOrder = function(brokerid, msg){
    console.log("traderInformBrokerOrder");
    request.post({url:'http://localhost:8082/broker/informOrder', form: {brokerid:brokerid, msg:msg}}, function(err,httpResponse,body){
        if (!err) {
        }
    });
    // console.log("informBrokerOrder");
    // if(brokerid in brokers){
    //     console.log("informBrokerOrder success");
    //     brokers[brokerid].emit("new order", msg);
    // }
};

