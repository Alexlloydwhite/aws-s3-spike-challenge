import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

// reducer to hold state of images
const imageReducer = (state = [], action) => {
    switch(action.type) {
        case 'SET_IMAGES':
            return action.payload;
        default:
            return state;
    }
};

// redux store
const store = createStore(
    imageReducer,
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
