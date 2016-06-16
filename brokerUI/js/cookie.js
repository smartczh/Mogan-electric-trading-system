function setCookie(key, value){
	document.cookie = key + "=" + value;
}

function getCookieByKey(key){
    var cookie_array = document.cookie.split(";");
    for(var i = 0; i < cookie_array.length; ++i){
        if(cookie_array[i].split("=")[0] == key){
            return cookie_array[i].split("=")[1];
        }
        return "";
    }
}

function removeCookieByKey(key){
    setCookie(key, "");
}