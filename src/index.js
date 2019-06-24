import get from "./get";
import set from "./set";

export default {
    get: get,
    set: set,
    get_url_params: function() {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1);
        r = r.match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    },
    set_url_params: function(obj, typeObj){
        var r = window.location.href,
            addSearch = window.location.search.length,
            key,
            type = typeObj && typeObj.type;
        for (key in obj) {
            var reg = new RegExp("([?&]" + key + "=)[^&]*(&|$)");
            if (reg.test(r)) {
                if (obj[key]) {
                    r = r.replace(reg, "$1" + encodeURIComponent(obj[key]) + "$2");
                } else {
                    r = r.replace(reg, "$2");
                }
            } else {
                addSearch = addSearch + 2;
                r = r + (addSearch > 1 ? "&" : "?") + key + "=" + obj[key];
            }
        }
        if (type) {
            if (type === "replace") {
                if (typeObj.reload) {
                    window.location.replace(r);
                } else {
                    replaceState(r);
                }
            } else {
                if (typeObj.reload) {
                    window.location.href = r;
                } else {
                    pushState(r);
                }
            }
        }
        return r;
    }
}