/**
 * Created by lisheng on 2016/6/1.
 */
var uri = window.location.href;
var para = uri.split("brokerid=");
var brokerid = para[1];

var app = angular.module("marketDepth-App", []);
app.controller("marketDepth-Ctrl", function ($scope, $http) {
    var urlStr = "http://a349624222.6655.la:19347/trader/getSession";
    var username = null;

    /*    $http.get(urlStr).success(function (responce) {
     var Tdata = JSON.parse(responce);
     username = Tdata.logname;
     $scope.username = username;
     alert(responce);
     });*/

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
            $scope.username = username;
        }
    });

    var urlStr3 = "http://a349624222.6655.la:19347/trader/getBrokerById?brokerid=" + brokerid;
    $http.get(urlStr3).success(function (responce) {
        var Tdata2 = JSON.parse(responce);
        $scope.broker = Tdata2;
    });

    setInterval("getMarketDepth2()",5000);

});


function getMarketDepth2() {

    var ware = ["gold", "silver", "copper", "jewel"];

    for (var wareid = 1; wareid <= 4; wareid++) {
        var url1 = "http://a349624222.6655.la:19347/order/getSellByWareidAndBrokerid?wareid=" + wareid + "&brokerid=" + brokerid;

        $.ajax({
            url: url1,
            type: "GET",
            xheFields: {
                withCredentials: true
            },
            crossDomain: true,
            async: false,
            error: function (data) {
                alert("error2");
            },
            success: function (data, status, e) {
                var Tdata = JSON.parse(data);
                var sizeSell = Tdata.length;

                var url2 = "http://a349624222.6655.la:19347/order/getBuyByWareidAndBrokerid?wareid=" + wareid + "&brokerid=" + brokerid;

                $.ajax({
                    url: url2,
                    type: "GET",
                    xheFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    async: false,
                    error: function (data) {
                        alert("error2");
                    },
                    success: function (data2, status, e) {

                        var arrNumber = new Array();
                        var arrPrice = new Array();


                        var Tdata2 = JSON.parse(data2);
                        var sizeBuy = Tdata2.length;


                        for (var i = 0; i < sizeBuy + sizeSell; i++) {
                            arrNumber[i] = new Array();
                        }


                        var table = document.getElementById("table-" + ware[wareid]);
                        var trString = "";
                        for (var i = 0; i < sizeSell; i++) {

                            trString += "<tr class=\"active\">";
                            trString += "<td></td>";
                            trString += "<td></td>";
                            trString += "<td>" + Tdata[sizeSell - i - 1].price + "</td>";
                            trString += "<td>" + Tdata[sizeSell - i - 1].number + "</td>";
                            trString += "<td>" + (sizeSell - i) + "</td></tr>";
                            /*                table.appendChild(tr);*/

                            arrNumber[i][0] = 0;
                            arrNumber[i][1] = Tdata[sizeSell - i - 1].number;

                            arrPrice[sizeBuy - 1 + i] = Tdata[i].price;
                        }


                        for (var i = 0; i < sizeBuy; i++) {

                            trString += "<tr class=\"active\">";
                            trString += "<td>" + (i + 1) + "</td>";
                            trString += "<td>" + Tdata2[sizeBuy - i - 1].number + "</td>";
                            trString += "<td>" + Tdata2[sizeBuy - i - 1].price + "</td>";
                            trString += "<td></td>";
                            trString += "<td></td></tr>";
                            /*                table.appendChild(tr);*/

                            arrNumber[sizeSell + i][0] = 0 - Tdata2[sizeBuy - i - 1].number;
                            arrNumber[sizeSell + i][1] = 0;

                            arrPrice[i] = Tdata2[i].price;

                        }

                        table.innerHTML = trString;
                        draw(arrPrice, arrNumber, wareid);
                    }

                })
            }
        })
    }
}

function draw(arr1, arr2, wareid) {

    if(wareid == 0) {

        $("#con-gold").highcharts({

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
    else if(wareid == 1){
        $("#con-silver").highcharts({

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
    else if(wareid == 2){
        $("#con-copper").highcharts({

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
    else if(wareid == 3){
        $("#con-jewel").highcharts({

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
    else{
        alert("false");
    }


}






