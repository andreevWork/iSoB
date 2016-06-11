import ActionsQuery from '../actions/ActionsTypes';

export default function SortReducer( sort_fields = {}, action) {
    if(action.type === ActionsQuery.CHANGE_SORTING_FIELD){
        return {
            key_sort: action.key_sort,
            sort_direction: action.sort_direction
        };
    }

    return sort_fields;
}