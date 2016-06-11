import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main.jsx';
import Queue from 'triple-queue';
import QueryReducer from './reducers/QueryReducer';
import SortReducer from './reducers/SortReducer';
import CollectionReducer from './reducers/CollectionReducer';
import GeneratorMiddleware, {createActionGenerator} from './middlewares/GeneratorMiddleware';
import {startRequest, sendRequest} from './actions/ActionsCreators';
import {defaultSorting} from './config/config';
import {getQueryStringFromRequest} from './utils/QueryString';
import Router from './utils/Router';
import {createStore, combineReducers, applyMiddleware} from 'redux';

window.onload = () => {
    /*
     * Создаем начальное состояние из строки запроса
     */
    var initialState = {
        // Сюда могут попасть ненужные серверу свойства из строки, но нас это не парит, сервер сам отметает не нужные поля,
        // нет надобности рулить это на клиенте.
        query: getQueryStringFromRequest(),
        sort_fields: {
            key_sort : getQueryStringFromRequest().key_sort || defaultSorting.key_sort,
            sort_direction: +getQueryStringFromRequest().sort_direction || defaultSorting.sort_direction
        }
    };

    /*
     * Создаем хранилище
     */
    var store = createStore(combineReducers({
        query: QueryReducer,
        collection: CollectionReducer,
        sort_fields: SortReducer
    }), initialState, applyMiddleware(GeneratorMiddleware));

    /*
     * Создаем компонент роутинга для хранение и отдачи запросов
     */
    var router = new Router();

    /*
     * Подписываем на хранилище и при изменениях изменяем роутер
     */
    store.subscribe(() => {
        if(!router.isEqual(store.getState().query, store.getState().sort_fields)){
            router.set(store.getState().query, store.getState().sort_fields);
            store.dispatch(createActionGenerator(
                startRequest(),
                sendRequest(router.get())
            ));
        }
    });

    /*
     * Отрисовываем все в DOM
     */
    ReactDOM.render(React.createElement(Main, {store}), document.getElementById('conteiner'));

    store.dispatch(createActionGenerator(
        startRequest(),
        sendRequest(router.get())
    ));
};