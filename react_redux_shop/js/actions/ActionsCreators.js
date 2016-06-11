import ActionsQuery from './ActionsTypes';

export function changeQuery(key, value) {
    return {
        type: ActionsQuery.CHANGE_QUERY,
        key,
        value
    }
}

export function changeSortingField(key_sort, sort_direction) {
    return {
        type: ActionsQuery.CHANGE_SORTING_FIELD,
        key_sort,
        sort_direction
    }
}

export function startRequest() {
    return {
        type: ActionsQuery.START_REQUEST
    }
}

export function sendRequest(query) {
    return fetch(`http://localhost:3002/notebooks?${query}`)
        .then(res => res.json())
        .then(json => ({
            type: ActionsQuery.SET_COLLECTION,
            data: json.data,
            count: json.count
        }));
}