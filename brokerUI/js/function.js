function logout(){
    var urlStrPapername = "http://349624222.wicp.net:25995/broker/logout";
    $.ajax({
        url: urlStrPapername,
        contentType: "application/x-www-form-urlencoded",
        type: "GET",
        async: false,
        xhrFields: {
            withCredentials: true
        },
        error: function (data) {
            alert(JSON.stringify(data));
        },
        success: function(data, status, e) {
            var json_data = JSON.parse(data);
            if(data.result == 1){

            }
        }
    });
    removeCookieByKey("username");
}

function getPendingOrders(){
    //var urlStrPapername = "http://192.168.0.120:8081/broker/getDispatchStatus0";
    var urlStrPapername = "http://349624222.wicp.net:25995/broker/getDispatchStatus0";
    var result;
    $.ajax({
        url: urlStrPapername,
        contentType: "application/x-www-form-urlencoded",
        type: "GET",
        async: false,
        xhrFields: {
            withCredentials: true
        },
        error: function (data) {
            alert(JSON.stringify(data));
        },
        success: function(data, status, e) {
            //alert(data);
            result = data;
        }
    });
    return result;
}

function getProcessedOrder(){
    //var urlStrPapername = "http://192.168.0.120:8081/broker/getDispatchStatus1";
    var urlStrPapername = "http://349624222.wicp.net:25995/broker/getDispatchStatus1";
    var result;
    $.ajax({
        url: urlStrPapername,
        contentType: "application/x-www-form-urlencoded",
        type: "GET",
        async: false,
        xhrFields: {
            withCredentials: true
        },
        error: function (data) {
            alert(JSON.stringify(data));
        },
        success: function(data, status, e) {
            //alert(data);
            result = data;
        }
    });
    return result;
}

function getBuyOrder(){
    var result = getPendingOrders();
    //alert("length");
    //alert(result.name);
    var json_data = JSON.parse(result);
    //alert(json_data.name);

    return result;
}

function getSellOrder(){
    var result = getPendingOrders();
    for(var i = 0; i < result.length; ++i){
        if(result[i].buyorsell == "buy"){
            result.remove(i);
        }
    }
    return result;
}

function initNavbar(){
    var username = getCookieByKey("username");
    if(username != ""){
        document.getElementById("signin").innerHTML = username;
        document.getElementById("signin").href = "javascritp:void(0);";

        document.getElementById("signup").innerHTML = "logout";
        document.getElementById("signup").setAttribute("onclick", "logoutAndRefresh();return false");
        document.getElementById("signup").href = "javascritp:void(0);";
        //alert(document.getElementById("credit").style.display);
        document.getElementById("credit").style.display = "block";
        //alert(document.getElementById("credit").style.display);
    }
}




function isLogin(){
    //var urlStrPapername = "http://192.168.0.120:8081/broker/getSession";
    var urlStrPapername = "http://349624222.wicp.net:25995/broker/getSession";
    var result = false;
    $.ajax({
        url: urlStrPapername,
        contentType: "application/x-www-form-urlencoded",
        type: "GET",
        async: false,
        xhrFields: {
            withCredentials: true
        },
        error: function (data) {
            alert(JSON.stringify(data));
            //return false;
        },
        success: function(data, status, e) {
            var json_data = JSON.parse(data);
            result = json_data.hasOwnProperty("logname");
        }
    });
    return result;
}

function cancelOrder(orderid){
    var urlStrPapername = "http://349624222.wicp.net:25995/broker/cancelOrder";
    //var urlStrPapername = "http://192.168.0.120:8081/order/delete";
    //alert(orderid);
    var userData={
        "orderid": orderid
    };
    $.ajax({
        url: urlStrPapername,
        type: "POST",
        data:userData,
        async: false,
        xhrFields: {
            withCredentials: true
        },
        error: function (data) {
            alert(JSON.stringify(data));
            //return false;
        },
        success: function(data, status, e) {
            //alert(JSON.stringify(data));
            var json_data = JSON.parse(data);
        }
    });
}

function dealOrder(orderid){
    var urlStrPapername = "http://349624222.wicp.net:25995/broker/dealOrder";
    //var urlStrPapername = "http://192.168.0.120:8081/order/delete";
    //(orderid);
    var userData={
        "orderid": orderid
    };
    $.ajax({
        url: urlStrPapername,
        type: "POST",
        data:userData,
        async: false,
        xhrFields: {
            withCredentials: true
        },
        error: function (data) {
            alert(JSON.stringify(data));
            //return false;
        },
        success: function(data, status, e) {
            //alert(JSON.stringify(data));
            var json_data = JSON.parse(data);
            window.location.reload();
        }
    });
}

function getWare(wareid){
    var urlStrPapername = "http://349624222.wicp.net:25995/ware/getByIdr";
    //var urlStrPapername = "http://192.168.0.120:8081/order/delete";
    alert(orderid);
    var userData={
        "wareid": wareid
    };
    $.ajax({
        url: urlStrPapername,
        type: "GET",
        data:userData,
        async: false,
        xhrFields: {
            withCredentials: true
        },
        error: function (data) {
            alert(JSON.stringify(data));

        },
        success: function(data, status, e) {
            alert(JSON.stringify(data));
            var json_data = JSON.parse(data);
        }
    });
}

function matchOrder(orderid1, orderid2, type1, type2, number, price){
    //alert(orderid1);
    //alert(orderid2);
    //alert(type1);
    //alert(type2);
    var urlStrPapername = "http://349624222.wicp.net:25995/broker/match";
    //var urlStrPapername = "http://192.168.0.120:8081/order/delete";
    var id1, id2;

    if(type1 == "buy"){
        id1 = orderid1;
        id2 = orderid2;
    }else{
        id1 = orderid2;
        id2 = orderid1;
    }
    var data={
        "buyid": id1,
        "sellid": id2,
        "volume": number,
        "price": price
    };
    $.ajax({
        url: urlStrPapername,
        type: "POST",
        data:data,
        async: true,
        xhrFields: {
            withCredentials: true
        },
        error: function (data) {
            //alert(JSON.stringify(data));
            //return false;
        },
        success: function(data, status, e) {
            //alert(JSON.stringify(data));
            //var json_data = JSON.parse(data);
            //window.location.reload();
        }
    });
    
}

