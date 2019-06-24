import { parseUrl, factoryParamObject } from "./utils";

export default function get(str) {
    var urlObj;
    if (str) urlObj = parseUrl(str);
    else urlObj = { search: window.location.search.substring(1), hash: window.location.hash.substring(1) };
    return factoryParamObject(urlObj);
}