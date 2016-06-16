var app = angular.module("trade-App", []);
app.controller("trade-Ctrl", function ($scope, $http) {
    var urlStr = "http://a349624222.6655.la:19347/trader/getSession";
    var username = null;
    $.ajax({
        url: urlStr,
        contentType: "application/x-www-form-urlencoded",
        type: "GET",
        xhrFields: {
            withCredentials: true
        },
        error: function (data) {
            alert(data);
        },
        success: function (data, status, e) {
            var Tdata = JSON.parse(data);
            username = Tdata.logname;
            idd = Tdata.idd;
            if (username == null) {
            }
            else {
                $scope.username = username;

                var urlStr3 = "http://a349624222.6655.la:19347/trader/get?logname=" + username;
                $http.get(urlStr3).success(function (data) {
                    var Tdata = JSON.parse(data);

                    var email = Tdata.email.split("@");
                    $scope.email_prev = email[0];
                    $scope.email_next = email[1];
                    $scope.user = Tdata;
                });

            }
        }
    });

    var urlStr1 = "http://a349624222.6655.la:19347/trader/getAllBroker";
    $http.get(urlStr1).success(function (data) {
        var Tdata = JSON.parse(data);
        $scope.brokers = Tdata;
    });

    var urlStr2 = "http://a349624222.6655.la:19347/ware/getAll";
    $http.get(urlStr2).success(function (data) {
    });

    setInterval("getSelfTrade()",1000);


});


function getSelfTrade() {

    var urlStr = "http://a349624222.6655.la:19347/trader/getSession";
    var userid = null;
    $.ajax({
        url: urlStr,
        contentType: "application/x-www-form-urlencoded",
        type: "GET",
        xhrFields: {
            withCredentials: true
        },
        async: false,
        error: function (data) {
            alert(data);
        },
        success: function (data, status, e) {
            var Tdata = JSON.parse(data);
            userid = Tdata.idd;
        }
    });


    var url1 = "http://a349624222.6655.la:19347/trader/getAllOrderByTradeId?traderid=" + userid;

    $.ajax({
        url: url1,
        type: "GET",
        xheFields: {
            withCredentials: true
        },
        error: function (data) {
            alert("error2");
        },
        success: function (data, status, e) {
            var Tdata = JSON.parse(data);

            var size = Tdata.length;

            var table = document.getElementById("selfTradeTable");
            var trString = "";
            for (var i = 0; i < size; i++) {
                trString += "<tr class=\"active\">";

                trString += "<td>" + Tdata[i].id + "</td>";


                if(Tdata[i].type == 0){
                    trString += "<td>" + "市价订单" + "</td>";
                }
                else if(Tdata[i].type == 1){
                    trString += "<td>" + "限价订单" + "</td>";
                }
                else{
                    trString += "<td>" + "止损订单" + "</td>";
                }



                trString += "<td>" + Tdata[i].buyorsell + "</td>";

                trString += "<td>" + Tdata[i].price + "</td>";
                trString += "<td>" + Tdata[i].number + "</td>";

                if(Tdata[i].wareid == 1){
                    trString += "<td>" + "黄金" + "</td>";
                }
                else if(Tdata[i].wareid == 2){
                    trString += "<td>" + "白银" + "</td>";
                }
                else if(Tdata[i].wareid == 3){
                    trString += "<td>" + "黄铜" + "</td>";
                }
                else {
                    trString += "<td>" + "首饰" + "</td>";
                }

                if(Tdata[i].status == 0){
                    trString += "<td>" + "正在处理" + "</td>";
                }
                else if(Tdata[i].status == 1){
                    trString += "<td>" + "已处理" + "</td>";
                }

                trString += "<td>" + Tdata[i].time + "</td></tr>";
                /*                table.appendChild(tr);*/

            }

            table.innerHTML = trString;
        }

    })

}