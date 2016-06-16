/**
 * Created by lisheng on 2016/6/2.
 */
var app = angular.module("index-App", []);
app.controller("index-Ctrl", function ($scope) {
//    var urlStr = "http://a349624222.6655.la:19347/trader/getSession";

    var urlStr = "http://a349624222.6655.la:19347/trader/getSession";
    var username = null;
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
            username = Tdata.logname;
            if (username == null) {
            }
            else {
                $scope.username = username;
            }
        }
    });

    setInterval("getTrades()", 1000);
});


function getTrades() {
    var url1 = "http://a349624222.6655.la:19347/order/getAll";
    $.ajax({
        url: url1,
        type: "GET",
        xheFields: {
            withCredentials: true
        },
        async: false,
        error: function (data) {
            alert("error2");
        },

        success: function (data, status, e) {

            var Tdata = JSON.parse(data);
            var size = Tdata.length;
            var table = document.getElementById("historyTable");
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

                if(status == 0){
                    trString += "<td>" + "正在处理" + "</td>";
                }
                else if(status == 1){
                    trString += "<td>" + "已处理" + "</td>";
                }

                trString += "<td>" + Tdata[i].time + "</td></tr>";
                /*                table.appendChild(tr);*/

            }

            table.innerHTML = trString;
        }

    })

}