import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/Main.jsx';
import QueryReducer from './reducers/QueryReducer';
import CollectionReducer from './reducers/CollectionReducer';
import GeneratorMiddleware from './middlewares/GeneratorMiddleware';
import {sendCollectionRequest} from './actions/ActionsCreators';
import {DEFAULT_SORTING, DEFAULT_SIZE_OBJECT} from './config/config';
import {getQueryObjectFromRequest} from './utils/QueryString';
import Router from './utils/Router';
import {createStore, combineReducers, applyMiddleware} from 'redux';

/*
 * Диаграмма цикла работы
 * https://www.draw.io/#LRedux_shop
 */

window.onload = () => {
    /*
     * Создаем начальное состояние из строки запроса
     */
    var initialState = {
        // Сюда могут попасть ненужные серверу свойства из строки, но нас это не парит, сервер сам отметает не нужные поля,
        // нет надобности рулить это на клиенте.
        query: Object.assign(
            {}, 
            { key_sort : DEFAULT_SORTING.key_sort, sort_direction: DEFAULT_SORTING.sort_direction },
            getQueryObjectFromRequest(),
            DEFAULT_SIZE_OBJECT
        )
    };

    /*
     * Создаем хранилище
     */
    var store = createStore(combineReducers({
        query: QueryReducer,
        collection: CollectionReducer
    }), initialState, applyMiddleware(GeneratorMiddleware));

    /*
     * Создаем компонент роутинга для хранение и отдачи запросов
     */
    var router = new Router();

    /*
     * Подписываем на хранилище и при изменениях изменяем роутер
     */
    store.subscribe(() => {
        if(!router.isEqual(store.getState().query)){
            init();
        }
    });

    /*
     * Отрисовываем все в DOM
     */
    ReactDOM.render(React.createElement(Main, {store}), document.getElementById('conteiner'));

    init();

    function init() {
        router.set(store.getState().query);

        store.dispatch(sendCollectionRequest(router.get()));
    }
};