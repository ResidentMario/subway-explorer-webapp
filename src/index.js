import React from 'react';
import { createStore } from 'redux';
import { render } from 'react-dom';
import App from './components/App';
import todoApp from "./reducers/index";
import { Provider } from 'react-redux';


let store = createStore(todoApp);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// render(
//     <h1>Hello, world!</h1>,
//     document.getElementById('root')
// );