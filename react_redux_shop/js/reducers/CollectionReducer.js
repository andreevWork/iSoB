import ActionsQuery from '../actions/ActionsTypes';

export default function CollectionReducer(collection = {}, action) {
    if(action.type === ActionsQuery.START_REQUEST){
        return Object.assign({}, collection, {pending_request: true})
    }

    if(action.type === ActionsQuery.SET_COLLECTION){
        return Object.assign({}, collection, {pending_request: false, data: action.data, count: action.count})
    }

    return collection;
}