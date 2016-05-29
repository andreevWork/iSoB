import React from 'react';
import ReactDOM from 'react-dom';
import T from './t.jsx';

window.onload = () => {
    ReactDOM.render(React.createElement(T), document.getElementById('conteiner'));
};