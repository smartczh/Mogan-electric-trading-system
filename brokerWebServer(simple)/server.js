/**
 * Created by czh on 2016/5/28.
 */
//var trader = require("./trader");
var trade = require("./trade");
var broker = require("./broker");
var order = require("./order");
var ordertobroker=require('./ordertobroker');
//var ware = require('./ware');
var express = require('express');
var session = require('express-session');

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


app.post('/broker/register', urlencodedParser, function (req, res) {//broker注册
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    var logname = req.body.logname;
    var password = req.body.password;
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    if(logname&&password&&name&&phone&&email) {
        broker.register(logname, password, name, phone, email, req, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments"};
        res.json(JSON.stringify(result));
        return;
    }
});
app.get('/broker/get', function (req, res) {//broker根据logname获取
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    var logname =  req.query.logname;
    if(logname) {
        broker.get(logname, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments, logname needed"};
        res.json(JSON.stringify(result));
        return;
    }
});
app.get('/broker/getById', function (req, res) {//根据id获取broker
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    var brokerid = req.query.brokerid;
    if(brokerid) {
        broker.getById(brokerid, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments, brokerid needed"};
        res.json(JSON.stringify(result));
        return;
    }
});
app.get('/broker/getAll', function (req, res) {//获取所有broker
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    broker.getAll(res);
});
app.post('/broker/login', urlencodedParser, function (req, res) {//broker登录
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    var logname =  req.body.logname;
    var password = req.body.password;
    if(logname&&password) {
        broker.login(logname, password, req, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments"};
        res.json(JSON.stringify(result));
        return;
    }
});
app.get('/broker/logout', urlencodedParser, function (req, res) {//broker注销
    //res.setHeader("Access-Control-Allow-Origin","*");
    console.log("brokerLogout");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    if(!req.session.idd){//未登录
        var result = {result: 0, info:"not login"};
        res.json(JSON.stringify(result));
        return;
    }
    var brokerid = req.session.idd;
    req.session.destroy();
    delete brokers[brokerid];
    var result = {result: 1};
    res.json(JSON.stringify(result));
});
app.get('/broker/getDispatchStatus0', function (req, res) {//获取该broker未处理订单
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    if(!req.session.idd){//未登录
        var result = {result: 0, info:"not login"};
        res.json(JSON.stringify(result));
        return;
    }
    var brokerid = req.session.idd;
    broker.getDispatchStatus0(brokerid, res);
});
app.get('/broker/getDispatchStatus1', function (req, res) {//获取该broker已处理订单
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    if(!req.session.idd){//未登录
        var result = {result: 0, info:"not login"};
        res.json(JSON.stringify(result));
        return;
    }
    var brokerid = req.session.idd;
    broker.getDispatchStatus1(brokerid, res);
});
app.get('/broker/getDispatch', function (req, res) {//获取该broker所有订单
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    if(!req.session.idd){//未登录
        var result = {result: 0, info:"not login"};
        res.json(JSON.stringify(result));
        return;
    }
    var brokerid = req.session.idd;
    broker.getDispatch(brokerid, res);
});
app.get('/broker/getSession', function (req, res) {//broker获取session
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    console.log("brokerGetSession");
    res.json(JSON.stringify(req.session));
});
app.get('/broker/getMyself', function (req, res) {//broker获取自己的信息
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    if(!req.session.idd){//未登录
        var result = {result: 0, info:"not login"};
        res.json(JSON.stringify(result));
        return;
    }
    var brokerid = req.session.idd;
    broker.getById(brokerid, res);
});
app.get('/broker/getSellWareNumber', function (req, res) {//登录broker获取所有卖商品库存
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
app.post('/broker/match', urlencodedParser, function (req, res) {//匹配两个订单
    //res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    res.setHeader("Access-Control-Allow-Credentials","true");
    var buyid = req.body.buyid;
    var sellid = req.body.sellid;
    var volume = req.body.volume;
    var price = req.body.price;
    if(!req.session.idd){//未登录
        var result = {result: 0, info:"not login"};
        res.json(JSON.stringify(result));
        return;
    }
    var brokerid = req.session.idd;
    if(buyid&&sellid&&volume&&price) {
        trade.match(buyid, sellid, volume, price, brokerid, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments"};
        res.json(JSON.stringify(result));
        return;
    }
});
app.post('/broker/dealOrder', urlencodedParser, function (req, res) {//处理登录broker的订单
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
    if(orderid) {
        broker.dealOrder(orderid, brokerid, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments, orderid needed"};
        res.json(JSON.stringify(result));
        return;
    }
});
app.post('/broker/cancelOrder', urlencodedParser, function (req, res) {//退回订单
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
    if(orderid) {
        ordertobroker.cancel(brokerid, orderid, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments, orderid needed"};
        res.json(JSON.stringify(result));
        return;
    }
});

app.use('/',  express.static(__dirname +'/'));

var brokers = {};//存储已连接websocket的broker
var io = require('socket.io')(http_server);
io.on('connection', function(socket){
    console.log('a broker connected');
    socket.on('brokerLogin', function(msg){//msg为brokerid
        console.log("brokerid="+msg+" login");
        if(msg!=null) {
            brokers[msg] = socket;
        }
    });
});

app.post('/broker/informOrder', urlencodedParser, function (req, res) {//通知已经登录broker有新的订单
    res.setHeader("Access-Control-Allow-Origin","*");
    //res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    //res.setHeader("Access-Control-Allow-Credentials","true");
    console.log("brokerInformOrder");
    var brokerid = req.body.brokerid;
    var msg = req.body.msg;
    if(brokerid in brokers){
        console.log("informBrokerOrder success");
        brokers[brokerid].emit("new order", msg);
    }
    var result = {result: 1, info:"ok"};
    res.json(JSON.stringify(result));
});

app.post('/order/create', urlencodedParser, function (req, res) {//创建新订单
    res.setHeader("Access-Control-Allow-Origin","*");
    console.log("brokerOrderCreate");
    //res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
    //res.setHeader("Access-Control-Allow-Credentials","true");
    var type = req.body.type;
    var price = req.body.price;
    var number = req.body.number;
    var wareid = req.body.wareid;
    var status = 0;
    var traderid = req.body.traderid;
    var buyorsell = req.body.buyorsell;
    var time = req.body.time;
    if(type&&price&&number&&wareid&&traderid&&buyorsell&&time) {
        order.create(type, price, number, wareid, status, traderid, buyorsell, time, res);
    }
    else{
        var result = {result: 0, info:"not enough arguments"};
        res.json(JSON.stringify(result));
        return;
    }
});

var server = http_server.listen(8082, function () {
    console.log("server启动");
});

// exports.informBrokerOrder = function(brokerid, msg){
//     console.log("informBrokerOrder");
//     if(brokerid in brokers){
//         console.log("informBrokerOrder success");
//         brokers[brokerid].emit("new order", msg);
//     }
// };