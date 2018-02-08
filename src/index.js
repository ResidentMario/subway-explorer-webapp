import React from 'react';
import { createStore } from 'redux';
import { render } from 'react-dom';
import App from './components/App';
import todoApp from "./reducers/index";

let store = createStore(todoApp);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// import { render } from 'react-dom'
// import { Provider } from 'react-redux'