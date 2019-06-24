export function isObject(val) {
    return Object.prototype.toString.call(val) === "[object Object]";
}

export function isString(val) {
    return Object.prototype.toString.call(val) === "[object String]";
}

export function isArray(val) {
    return Object.prototype.toString.call(val) === "[object Array]";
}

export function pushState(url) {
    if (!("history" in window && "pushState" in window.history)) {
        window.location.href = url;
        return;
    }
    window.history.pushState({}, null, url);
}

export function replaceState(url) {
    if (!("history" in window && "pushState" in window.history)) {
        window.location.replace(url);
        return;
    }
    window.history.replaceState({}, null, url);
}

export function getorigin() {
    var location = window.location,
        locationOrigin = location.origin,
        port = location.port,
        origin = locationOrigin
            ? locationOrigin 
            : location.protocol + "//" + location.host + (port ? ":" + port : "");
    return origin + location.pathname;
}

export function parseUrl(url) {
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

export var reg1 = /(^|&|\?|#)([^&#\?]*)=([^&#\?]*)/g

export var reg2 = /(^|&|#|\?)([^&#\?]*)=([^&#\?]*)(&|$|#|\?)/;

export function parseParamToObject(array) {
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

export var CONST_SEARCH = "search";
export var CONST_HASH = "hash";
export var CONST_QUERY = "query";

export function factoryParamObject(obj) {
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

export function factoryNewUrl(urlObj, paramObj) {
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

export function joinUrlString(nextObj) {
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