export function getQueryStringFromObjects(...obj) {
    var query_array = [];
    obj.forEach(query => {
        return Object.keys(query).forEach((key) => {
            let val = query[key],
                e_key = encodeURIComponent(key);
            if(val instanceof Array) {
                query_array.push(`${e_key}[]=${val.map(encodeURIComponent).join(`&${e_key}[]=`)}`);
            } else {
                query_array.push(`${e_key}=${encodeURIComponent(val)}`);
            }
        })
    });

    return query_array.join('&');
}

export function getQueryStringFromRequest(query = window.location.search.substr(1)) {
    if (getQueryStringFromRequest.memoize) return getQueryStringFromRequest.memoize;
    
    var query_array = query && query.split('&'),
        key,
        val,
        is_arr;

    query = {};

    query_array && query_array.forEach(q => {
        [key, val] = q.split('=').map(decodeURIComponent);
        is_arr = !!(~key.indexOf('[]'));

        if(is_arr){
            key = (key.replace('[]', ''));
            query[key] = query[key] ? query[key].concat([val]) : [val];
        } else {
            query[key] = val;
        }
    });

    getQueryStringFromRequest.memoize = query;
    return query;
}