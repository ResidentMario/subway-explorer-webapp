import React from 'react';
import { createStore } from 'redux';
import { render } from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import subwayExplorer from "./reducers";


let store = createStore(subwayExplorer);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);