import { isObject, getorigin, parseUrl, factoryNewUrl, CONST_SEARCH, CONST_HASH, CONST_QUERY, joinUrlString, isString, replaceState, pushState } from "./utils";

export default function set(str, paramObj, typeObj) {
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
                replaceState(finalUrl);
            }
        } else {
            if (typeObj.reload) {
                window.location.href = finalUrl;
            } else {
                pushState(finalUrl);
            }
        }
    }
    return finalUrl;
}