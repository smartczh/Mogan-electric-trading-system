/**
 * Created by lisheng on 2016/5/30.
 */
var app = angular.module("index-App", []);
app.controller("index-Ctrl", function ($scope) {
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
                location.href = "marketDepth.html?pageid=1";
            }
        }
    });

});



$(document).ready(function () {
    $().UItoTop({easingType: 'easeOutQuart'});
});

$(document).ready(function(){
    $("#btn-log").click(function () {
        $(this).addClass("active");
        $("#btn-reg").removeClass("active");
        $("#form-reg").addClass("hidden");
        $("#form-log").removeClass("hidden");
    });
    $("#btn-reg").click(function () {
        $(this).addClass("active");
        $("#btn-log").removeClass("active");
        $("#form-log").addClass("hidden");
        $("#form-reg").removeClass("hidden");
    });
});

function showHint(){
    var usernameReg = $("#username")[0].value;
    var urlStr = "http://a349624222.6655.la:19347/trader/get?logname=" + usernameReg;

    if(usernameReg == ""){
        $("#suc").addClass("hidden");
        $("#fai").removeClass("hidden");

        $("#reg").attr("disabled", true);
        return;
    }

    $.ajax({
        url: urlStr,
        contentType: "application/x-www-form-urlencoded",
        type: "GET",
        xhrFields: {
            withCredentials: true
        },
        error: function (data) {
            $("#fai").addClass("hidden");
            $("#suc").removeClass("hidden");

            var password = $("#password")[0].value;
            var password_confirm = $("#password-confirm")[0].value;

            if(password != "" && password == password_confirm){
                $("#reg").attr("disabled", false);
            }
            else{
                $("#reg").attr("disabled", true);
            }


        },
        success: function (data, status, e) {
            $("#suc").addClass("hidden");
            $("#fai").removeClass("hidden");

            $("#reg").attr("disabled", true);



        }
    });

}

function showEqual(){
    var password = $("#password")[0].value;
    var password_confirm = $("#password-confirm")[0].value;

    if(password == "" || password_confirm == ""){
        return;
    }

    if(password == password_confirm){
        $("#equal").removeClass("hidden");
        $("#notequal").addClass("hidden");

        if($("#fai").hasClass("hidden")) {
            $("#reg").attr("disabled", false);
        }
        else{
            $("#reg").attr("disabled", true);
        }

    }
    else{
        $("#notequal").removeClass("hidden");
        $("#equal").addClass("hidden");
        $("#reg").attr("disabled", true);

    }

}



function userLogin() {
    var usernameLog = $("#username-log")[0].value;
    var passwordLog = $("#password-log")[0].value;

    var urlStr = "http://a349624222.6655.la:19347/trader/login";

    var userData = {
        "logname": usernameLog,
        "password": passwordLog
    };


    $.ajax({
        url: urlStr,
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        data: userData,

        xhrFields: {
            withCredentials: true
        },

        error: function (data) {
            alert("用户名不存在");
        },
        success: function (data, status, e) {
            var Tdata = JSON.parse(data);
            if(Tdata.result == 1) {
                document.cookie = "username=" + usernameLog;
                location.href = "marketDepth.html?pageid=1";


            }
        }
    });
}

function userRegister() {
    var username = $("#username")[0].value;
    var name = $("#name")[0].value;
    var password = $("#password")[0].value;
    var password_confirm = $("#password-confirm")[0].value;
    var email_prev = $("#email-prev")[0].value;
    var email_next = $("#email-next")[0].value;
    var phone = $("#phone")[0].value;

    var email = email_prev + "@" + email_next;

    var userData = {
        "logname": username,
        "password": password,
        "name": name,
        "phone": phone,
        "email": email
    }

    var urlStr = "http://a349624222.6655.la:19347/trader/register";

    $.ajax({
        url: urlStr,
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        //        async: true,
        data: userData,
        xhrFields: {
            withCredentials: true
        },
        error: function (data) {
            alert(JSON.stringify(data));
        },
        success: function (data, status, e) {
            var Tdata = JSON.parse(data);
            if(Tdata.result == 1) {
                location.href = "index.html";
            }
        }
    });


}







