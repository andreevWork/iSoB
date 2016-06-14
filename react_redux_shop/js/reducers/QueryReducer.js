import ActionsQuery from '../actions/ActionsTypes';
import {DEFAULT_SIZE_OBJECT, DEFAULT_COLLECTION_SIZE} from '../config/config';

export default function QueryReducer(query = {}, action) {
    if(action.type === ActionsQuery.CHANGE_QUERY){
        let {key, value} = action,
            new_value = value;
        //Есди значение - это массив, тогда это фильтр типа check, обрабатываем по своему
        if(value instanceof Array) {
            let query_array = query[key] || [];
            [value] = value;

            if(~query_array.indexOf(value)) {
                query_array.splice(query_array.indexOf(value), 1);
                query_array = [...query_array];
            } else {
                query_array = [...query_array, value];
            }

            new_value = query_array.filter(item => !!item).length > 0 ? query_array.filter(item => !!item) : false;
        }

        delete query[key];
        
        return new_value ? Object.assign({}, query, {[key]: new_value}, DEFAULT_SIZE_OBJECT) : Object.assign({}, query, DEFAULT_SIZE_OBJECT);
    }

    if(action.type === ActionsQuery.CHANGE_SORTING_FIELD){
        return Object.assign({}, query, {key_sort: action.key_sort, sort_direction: action.sort_direction}, DEFAULT_SIZE_OBJECT);
    }

    if(action.type === ActionsQuery.MOVE){
        return Object.assign({}, query, {page : action.page, skip : action.skip, limit: DEFAULT_COLLECTION_SIZE});
    }

    return query;
}