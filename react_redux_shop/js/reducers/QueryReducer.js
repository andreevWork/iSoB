import ActionsQuery from '../actions/ActionsTypes';

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

            new_value = query_array;
        }

        delete query[key];

        return new_value ? Object.assign({}, query, {[key]: new_value}) : Object.assign({}, query);
    }

    return query;
}