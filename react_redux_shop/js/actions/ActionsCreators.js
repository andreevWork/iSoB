import ActionsQuery from './ActionsTypes';
import {URL} from './../config/config';
import {createActionGenerator} from "../middlewares/GeneratorMiddleware";

export function changeQuery(key, value) {
    return {
        type: ActionsQuery.CHANGE_QUERY,
        key,
        value
    }
}

export function changeSkip(skip) {
    return {
        type: ActionsQuery.MOVE,
        skip
    }
}

export function changeSortingField(key_sort, sort_direction) {
    return {
        type: ActionsQuery.CHANGE_SORTING_FIELD,
        key_sort,
        sort_direction
    }
}

export function sendCollectionRequest(request){
    return createActionGenerator(
        startRequest(),
        sendRequest(request)
    );
}

function startRequest() {
    return {
        type: ActionsQuery.START_REQUEST
    }
}

function sendRequest(query) {
    return fetch(`${URL.base}?${query}`)
        .then(res => res.json())
        .then(json => ({
            type: ActionsQuery.SET_COLLECTION,
            data: json.data,
            count: json.count
        }));
}