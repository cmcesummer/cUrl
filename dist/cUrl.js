(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.cUrl = factory());
}(this, function () { 'use strict';

    function isObject(val) {
        return Object.prototype.toString.call(val) === "[object Object]";
    }

    function isString(val) {
        return Object.prototype.toString.call(val) === "[object String]";
    }

    function isArray(val) {
        return Object.prototype.toString.call(val) === "[object Array]";
    }

    function pushState$1(url) {
        if (!("history" in window && "pushState" in window.history)) {
            window.location.href = url;
            return;
        }
        window.history.pushState({}, null, url);
    }

    function replaceState$1(url) {
        if (!("history" in window && "pushState" in window.history)) {
            window.location.replace(url);
            return;
        }
        window.history.replaceState({}, null, url);
    }

    function getorigin() {
        var location = window.location,
            locationOrigin = location.origin,
            port = location.port,
            origin = locationOrigin
                ? locationOrigin 
                : location.protocol + "//" + location.host + (port ? ":" + port : "");
        return origin + location.pathname;
    }

    function parseUrl(url) {
        var searchIndex = url.indexOf("?");
        if (searchIndex < 0) {
            return { search: "", hash: "", origin: url };
        }
        var hashIndex = url.indexOf("#"),
            search,
            hash,
            origin = url.substring(0, searchIndex);
        if (hashIndex < 0) {
            search = url.substring(searchIndex + 1);
            hash = "";
        } else {
            search = url.substring(searchIndex + 1, hashIndex);
            hash = url.substring(hashIndex + 1);
        }
        return { search: search, hash: hash, origin: origin };
    }

    var reg1 = /(^|&|\?|#)([^&#\?]*)=([^&#\?]*)/g;

    var reg2 = /(^|&|#|\?)([^&#\?]*)=([^&#\?]*)(&|$|#|\?)/;

    function parseParamToObject(array) {
        var i,
            length,
            target,
            haveItem,
            paramObj = {},
            value;
        i = 0;
        length = array.length;
        for (; i < length; i++) {
            target = array[i].match(reg2);
            haveItem = paramObj[target[2]];
            value = decodeURIComponent(target[3]);
            if (haveItem) {
                if (isArray(haveItem)) {
                    haveItem.push(value);
                } else {
                    paramObj[target[2]] = [haveItem, value];
                }
            } else {
                paramObj[target[2]] = value;
            }
        }
        return paramObj;
    }

    var CONST_SEARCH = "search";
    var CONST_HASH = "hash";
    var CONST_QUERY = "query";

    function factoryParamObject(obj) {
        var paramObj = {};
        var searchArray = obj.search.match(reg1);
        paramObj[CONST_SEARCH] = {};
        paramObj[CONST_HASH] = {};
        paramObj[CONST_QUERY] = {};
        if (searchArray) {
            paramObj[CONST_SEARCH] = parseParamToObject(searchArray);
        } else if (obj.search) {
            paramObj[CONST_SEARCH] = obj.search;
        }
        if (!obj.hash) {
            return paramObj;
        }
        var hashQueryIndex = obj.hash.indexOf("?"),
            pureHash,
            query;
        if (hashQueryIndex > -1) {
            pureHash = obj.hash.substring(0, hashQueryIndex);
            query = obj.hash.substring(hashQueryIndex + 1);
        } else {
            pureHash = obj.hash;
            query = "";
        }
        var pureHashArray = pureHash.match(reg1);
        if (pureHashArray) {
            paramObj[CONST_HASH] = parseParamToObject(pureHashArray);
        } else if (pureHash) {
            paramObj[CONST_HASH] = pureHash;
        }
        var queryArray = query.match(reg1);
        if (queryArray) {
            paramObj[CONST_QUERY] = parseParamToObject(queryArray);
        }
        return paramObj;
    }

    function factoryNewUrl(urlObj, paramObj) {
        var currentParam = factoryParamObject(urlObj),
            key,
            currentSearch = currentParam[CONST_SEARCH] || {},
            nextSearch = paramObj[CONST_SEARCH],
            currentHash = currentParam[CONST_HASH] || {},
            nextHash = paramObj[CONST_HASH],
            currentQuery = currentParam[CONST_QUERY] || {},
            nextQuery = paramObj[CONST_QUERY];
        if (nextSearch) {
            for (key in nextSearch) {
                currentSearch[key] = nextSearch[key];
            }
        }
        if (nextHash) {
            if (isString(nextHash)) {
                currentHash = nextHash;
            } else {
                for (key in nextHash) {
                    currentHash[key] = nextHash[key];
                }
            }
        }
        if (nextQuery) {
            for (key in nextQuery) {
                currentQuery[key] = nextQuery[key];
            }
        }
        var nextParamObj = {};
        nextParamObj[CONST_SEARCH] = currentSearch;
        nextParamObj[CONST_HASH] = currentHash;
        nextParamObj[CONST_QUERY] = currentQuery;
        return nextParamObj;
    }

    function joinUrlString(nextObj) {
        var string = "",
            key;
        for (key in nextObj) {
            if (!nextObj[key]) {
                continue;
            }
            string += key + "=" + encodeURIComponent(nextObj[key]) + "&";
        }
        return string.replace(/&$/, "");
    }

    function get(str) {
        var urlObj;
        if (str) urlObj = parseUrl(str);
        else urlObj = { search: window.location.search.substring(1), hash: window.location.hash.substring(1) };
        return factoryParamObject(urlObj);
    }

    function set(str, paramObj, typeObj) {
        var urlObj;
        if (isObject(str)) {
            urlObj = {
                search: window.location.search.substring(1),
                hash: window.location.hash.substring(1),
                origin: getorigin()
            };
            typeObj = paramObj;
            paramObj = str;
        } else {
            urlObj = parseUrl(str);
        }
        var nextParamObj = factoryNewUrl(urlObj, paramObj),
            nextSearch = nextParamObj[CONST_SEARCH],
            nextHash = nextParamObj[CONST_HASH],
            nextQuery = nextParamObj[CONST_QUERY],
            searchStr = "",
            hashStr = "",
            queryStr = "",
            type = typeObj && typeObj.type;
        if (nextSearch) searchStr = joinUrlString(nextSearch);
        if (nextHash) {
            if (isString(nextHash)) hashStr = nextHash;
            else hashStr = joinUrlString(nextHash);
        }
        if (nextQuery) queryStr = joinUrlString(nextQuery);
        var finalUrl = urlObj.origin;
        if (searchStr) {
            finalUrl += "?" + searchStr;
        }
        if (hashStr) {
            finalUrl += "#" + hashStr;
            if (queryStr) {
                finalUrl += "?" + queryStr;
            }
        } else {
            if (queryStr) {
                finalUrl += "#?" + queryStr;
            }
        }
        
        if (type) {
            if (type === "replace") {
                if (typeObj.reload) {
                    window.location.replace(finalUrl);
                } else {
                    replaceState$1(finalUrl);
                }
            } else {
                if (typeObj.reload) {
                    window.location.href = finalUrl;
                } else {
                    pushState$1(finalUrl);
                }
            }
        }
        return finalUrl;
    }

    var index = {
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
    };

    return index;

}));
