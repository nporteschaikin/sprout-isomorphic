import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { Router, browserHistory, match } from 'react-router'
import thunk from 'redux-thunk';

import routes from './routes';
import reducers from './reducers';

const state = window.__init__;
const store = createStore(
  reducers,
  state,
  applyMiddleware(thunk)
);

browserHistory.listenBefore((location, callback) => {
  match({ routes, location, }, (error, redirect, props) => {
    if (props) {
      const initStates = [];
      for (var route of props.routes) {
        const initState = route.initState;
        if (initState) initStates.push(initState(store, props.params));
      }
      return Promise.all(initStates).then(callback);
    }
  });
});

render(
  <Provider store={store}>
    <Router children={routes} history={browserHistory} onUpdate={(() => window.scrollTo(0, 0))} />
  </Provider>,
  document.getElementById('react')
);
