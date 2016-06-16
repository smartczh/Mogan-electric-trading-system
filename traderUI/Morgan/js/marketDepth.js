/**
 * Created by lisheng on 2016/5/31.
 */
var uri = window.location.href;
var para = uri.split("pageid=");
var pageid = para[1];

var app = angular.module("marketDepth-App", []);
app.controller("marketDepth-Ctrl", function ($scope, $http) {
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
            }
        }
    });



    urlStr = "http://a349624222.6655.la:19347/trader/getAllBroker";
    $http.get(urlStr).success(function (data) {

        var Tdata = JSON.parse(data);
        var size = Tdata.length;

        var pageNum_rem = size % 3;
        var pageNum = (size - pageNum_rem) / 3;

        if(pageid == pageNum+1){
            var pack = "[";

            for(var i = 0; i < pageNum_rem-1; i++){
                var first = JSON.stringify(Tdata[(pageid-1)*3 + i]);
                pack += first + ",";
            }

            pack += JSON.stringify(Tdata[(pageid-1)*3 + pageNum_rem - 1]);
            pack += "]";
            $scope.prevNum = parseInt(pageid)-1 < 1 ? 1 : parseInt(pageid)-1;
            $scope.nextNum = parseInt(pageid)+1 > parseInt(pageNum)+1 ? parseInt(pageNum)+1 : parseInt(pageid)+1;

            $scope.brokers = JSON.parse(pack);
            var pageArrTmp = [];
            for(var i = 1; i <= pageNum+1; i++){
                pageArrTmp[i-1] = i;
            }
            $scope.pageNum = pageArrTmp;
            return;
        }


        if(pageNum == 0) {
            $scope.brokers = Tdata;
            $scope.pageNum = ["1"];
            $scope.prevNum = 1;
            $scope.nextNum = 1;
            return;
        }

        var pageArr = [];
        for(var i = 1; i <= pageNum+1; i++){
            pageArr[i-1] = i;
        }

        $scope.pageNum = pageArr;
        var first = JSON.stringify(Tdata[(pageid-1)*3]);
        var second = JSON.stringify(Tdata[(pageid-1)*3+1]);
        var third = JSON.stringify(Tdata[(pageid-1)*3+2]);
        var pack = "[" + first + "," + second + "," + third + "]";

        $scope.prevNum = parseInt(pageid)-1 < 1 ? 1 : parseInt(pageid)-1;
        $scope.nextNum = parseInt(pageid)+1 > parseInt(pageNum)+1 ? parseInt(pageNum)+1 : parseInt(pageid)+1;
        $scope.brokers = JSON.parse(pack);
    });



    
});


