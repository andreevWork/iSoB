import {getQueryStringFromObjects} from './QueryString';
import {isEqual} from './isEqual';

export default class Router {
    
    set(...args) {
        let {host, protocol, pathname} = window.location;
        this.route_object = Object.assign({}, ...args);
        this.route_string = getQueryStringFromObjects(this.route_object);
        history.replaceState(null, '', `${protocol}//${host}${pathname}?${this.route_string}`)
    }

    isEqual(...args) {
        return isEqual(Object.assign({}, ...args), this.route_object);
    }
    
    get() {
        return this.route_string;
    }
    
    route_object = {};
    route_string = '';

}