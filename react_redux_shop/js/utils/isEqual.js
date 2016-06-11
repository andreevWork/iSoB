export function isEqual(obj1, obj2) {
    let keys1 = Object.keys(obj1);

    for(var i = 0, l = keys1.length; i < l; i++) {
        if(obj1[keys1[i]] !== obj2[keys1[i]]){
            return false;
        }
    }

    return keys1.length === Object.keys(obj2).length;
}