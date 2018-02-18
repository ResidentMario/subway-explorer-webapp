import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { render } from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import subwayExplorer from "./reducers";
import thunk from 'redux-thunk';


let store = createStore(subwayExplorer, applyMiddleware(thunk));

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);