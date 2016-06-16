/**
 * Created by lisheng on 2016/6/1.
 */
var marketDepth;
var app = angular.module("trade-App",[]);
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
            if(username == null) {
            }
            else{
                $scope.username = username;
                var urlStr1 = "http://a349624222.6655.la:19347/trader/getAllBroker";
                $http.get(urlStr1).success(function (data){
                    var Tdata = JSON.parse(data);
                    $scope.brokers = Tdata;
                });

                var urlStr2 = "http://a349624222.6655.la:19347/ware/getAll";
                $http.get(urlStr2).success(function (data) {
                    wares = JSON.parse(data);
                    $scope.wares = wares;
                });
            }
        }
    });

//    setInterval("getMarketDepth()",5000);


});

$(document).ready(function(){


    $("#btn-buy").click(function () {
        $(this).addClass("active");
        $("#btn-sell").removeClass("active");
    });
    $("#btn-sell").click(function () {
        $(this).addClass("active");
        $("#btn-buy").removeClass("active");
    });

    $("#confirm-btn").click(function () {
        $("#confirm-btn").attr("disabled", true);
        $("#ok").attr("disabled", false);
        $("#cancel").attr("disabled", false);
    });

    $("#cancel").click(function () {
        $("#cancel").attr("disabled", true);
        $("#ok").attr("disabled", true);
        $("#confirm-btn").attr("disabled", false);
    });
    
    $("#confirmBroker-btn").click(function () {
        var str = "";
        var strTmp = "";
        $("#brokers option:selected").each(function () {
            var raw = $(this).text();
            var ids = raw.split(":");

            str += ids[0];
            str += ",";
        });

        $("#brokernames")[0].value = str.substr(0, str.length-1);
    });

    $('#warename').change(function () {
        var wareName = $("#warename")[0].value;
        for(var i = 0; i < wares.length; i++) {
            if (wares[i].name == wareName) {
                $("#itemcode")[0].value = wares[i].id;
                return;
            }
        }
    });

    $("#orderType").change(function () {
        if($("#orderType")[0].value == "市价订单") {
            $("#price").addClass("hidden");
            $("#priceLabel").addClass("hidden");

        }
        else {
            $("#price").removeClass("hidden");
            $("#priceLabel").removeClass("hidden");
        }
    })
    $("#inuse").click(function () {
        $(this).addClass("hidden");
        $("#nouse").removeClass("hidden");
    });
    $("#nouse").click(function () {
        $(this).addClass("hidden");
        $("#inuse").removeClass("hidden");
    });

});


function sendOrder() {
    var urlStr = "http://a349624222.6655.la:19347/order/create";

    var iceberg = 0;
    if($("#nouse").hasClass("hidden"))
        iceberg = 1;
    else
        iceberg = 0;

    alert("senorder");

    var type = $("#orderType")[0].value;
    var price;
    if(type == "市价订单") {
        type = 0;
        price = 0;
    }
    else if(type == "限价订单"){
        type = 1;
        price = $("#price")[0].value;
    }
    else {
        type = 2;
        price = $("#price")[0].value;
    }
    var brokers = "[" + $("#brokernames")[0].value + "]";

    var number = $("#quantity")[0].value;
    var wareid = $("#itemcode")[0].value;
    var buyorsell;
    var time = "";
    var t = new Date();
    time += t.getFullYear() + ".";
    time += (t.getMonth() + 1) + ".";
    time += t.getDate() + ",";
    time += t.getHours() + ":";
    time += t.getMinutes() + ":";
    time += t.getSeconds();

    if($("#btn-sell").hasClass("active")){
        buyorsell = "sell";
    }
    else
        buyorsell = "buy";

    var orderData = {
        "type": type,
        "price": price,
        "number": number,
        "wareid": wareid,
        "buyorsell": buyorsell,
        "time": time,
        "iceberg": iceberg
    };

    alert("before create");

    $.ajax({
        url: urlStr,
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        data: orderData,
        xhrFields: {
            withCredentials: true
        },
        error: function (data) {
            alert(data);
        },
        success: function (data, status, e) {
            alert(data);
            var Tdata = JSON.parse(data);
            var orderid = Tdata.orderid;
            var dispatchData = {
                "orderid": orderid,
                "brokerid": brokers
            };


            alert("before dispatch");

            if(iceberg == 0) {

                alert("in iceberg 0");

                var subUrl = "http://a349624222.6655.la:19347/ordertobroker/dispatch";
                $.ajax({
                    url: subUrl,
                    contentType: "application/x-www-form-urlencoded",
                    type: "POST",
                    data: dispatchData,
                    async: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    error: function (data) {
                        alert(data);
                    },
                    success: function (data) {
                        alert(data);
                        location.href = "trade.html";
                    }

                });
            }
            else {

                alert("in iceberg 1");
                var subUrl2 = "http://a349624222.6655.la:19347/ordertobroker/dispatchIceberg";
                $.ajax({
                    url: subUrl2,
                    contentType: "application/x-www-form-urlencoded",
                    type: "POST",
                    data: dispatchData,
                    async: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    error: function (data) {
                        alert(data);
                    },
                    success: function (data) {
                        alert(data);
                        location.href = "trade.html";
                    }

                });
            }
        }
    });
}

function getMarketDepth(){
    var brokers = $("#brokernames")[0].value.split(",")[0];
    var wareid = $("#itemcode")[0].value;

    var url1 = "http://a349624222.6655.la:19347/order/getSellByWareidAndBrokerid?wareid=" + wareid + "&brokerid=" + brokers;
    $.ajax({
        url: url1,
        type: "GET",
        xheFields: {
            withCredentials: true
        },
        crossDomain: true,
        error: function (data) {
            alert("error2");
        },
        success: function (data, status, e) {
            var Tdata = JSON.parse(data);
            var sizeSell = Tdata.length;

            var url1 = "http://a349624222.6655.la:19347/order/getBuyByWareidAndBrokerid?wareid=" + wareid + "&brokerid=" + brokers;
            $.ajax({
                url: url1,
                type: "GET",
                xheFields: {
                    withCredentials: true
                },
                crossDomain: true,
                error: function (data) {
                    alert("error2");
                },
                success: function (data2, status, e) {

                    var arrNumber = new Array();
                    var arrPrice = new Array();


                    var Tdata2 = JSON.parse(data2);
                    var sizeBuy = Tdata2.length;


                    for(var i = 0; i < sizeBuy + sizeSell; i++){
                        arrNumber[i] = new Array();
                    }





                    var table = document.getElementById("mdtable");
                    var trString = "";
                    for (var i = 0; i < sizeSell; i++) {

                        trString += "<tr class=\"active\">";
                        trString += "<td></td>";
                        trString += "<td></td>";
                        trString += "<td>" + Tdata[sizeSell-i-1].price + "</td>";
                        trString += "<td>" + Tdata[sizeSell-i-1].number + "</td>";
                        trString += "<td>" + (sizeSell - i) + "</td></tr>";
                        /*                table.appendChild(tr);*/

                        arrNumber[i][0] = 0;
                        arrNumber[i][1] = Tdata[sizeSell-i-1].number;

                        arrPrice[sizeBuy-1+i] = Tdata[i].price;
                    }



                    for (var i = 0; i < sizeBuy; i++) {

                        trString += "<tr class=\"active\">";
                        trString += "<td>" + (i+1) + "</td>";
                        trString += "<td>" + Tdata2[sizeBuy-i-1].number + "</td>";
                        trString += "<td>" + Tdata2[sizeBuy-i-1].price + "</td>";
                        trString += "<td></td>";
                        trString += "<td></td></tr>";
                        /*                table.appendChild(tr);*/

                        arrNumber[sizeSell+i][0] = 0 - Tdata2[sizeBuy-i-1].number;
                        arrNumber[sizeSell+i][1] = 0;

                        arrPrice[i] = Tdata2[i].price;

                    }

                    table.innerHTML = trString;
                    draw(arrPrice, arrNumber);
                }

            })
        }
    })
}

function draw(arr1, arr2){

    $('#con').highcharts({

        chart: {
            type: 'columnrange',
            inverted: true
        },

        title: {
            text: 'Market Depth'
        },

        subtitle: {
            text: ''
        },

        xAxis: {
            categories: arr1
        },

        yAxis: {
            title: {
                text: ''
            }
        },

        tooltip: {
            valueSuffix: ''
        },

        plotOptions: {
            columnrange: {
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return this.y + '';
                    }
                }
            }
        },

        legend: {
            enabled: false
        },

        series: [{
            name: 'Temperatures',
            data: arr2
        }]

    });
}




