import { renderToString } from 'react-dom/server'
import { createStore, applyMiddleware } from 'redux';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import express from 'express';
import React from 'react';
import thunk from 'redux-thunk';
import path from 'path';

/**
 * Set environment vars.
 */

var env = process.env.NODE_ENV;
var isDevelopment = 'development' === env;
var isProduction = 'production' === env;

/**
 * Import routes and reducers, then
 * set them to their actual variables
 * so we can potentially hot-reload.
 */

import __routes from './routes';
import __reducers from './reducers';
let routes = __routes;
let reducers = __reducers;

/**
 * Create a new instance of Express.
 */

const app = express();

/**
 * Set a route for assets.
 */

app.use('/static', express.static(path.join(__dirname, 'static')));

// function for rendering
function render(tree, store) {
  return (
    `<!DOCTYPE html>
    <html>
      <head></head>
      <body>
        <div id="react">${renderToString(tree)}</div>
        <script type="text/javascript">window.__init__=${JSON.stringify(store.getState())}</script>
        <script type="text/javascript" src="/static/client.js"></script>
      </body>
    </html>`
  );
}

app.use(function (request, response, next) {
  // create new store.
  const store = createStore(
    reducers,
    applyMiddleware(thunk)
  );

  // run the match thing.
  match({ routes, location: request.url, }, (error, redirect, props) => {
    // if error, go to next.
    if (error) return next(error);

    // if redirect, redirect!
    if (redirect) return response.redirect(`${redirect.pathname}${redirect.search}`);

    // if props, render!
    if (props) {

      // collect `before` dispatches on route methods.
      const initStates = [];
      for (var route of props.routes) {
        const initState = route.initState;
        if (initState) {
          initStates.push(initState(store, props.params));
        }
      }

      // return promise.
      return Promise.all(initStates).then(() => {
        // if there's no error, let's do it.
        response.end(render((
          <Provider store={store}>
            <RouterContext {...props} />
          </Provider>
        ), store));
      }).catch((error) => {
        // otherwise, move on.
        return next(error);
      });

    };

    // otherwise, render 404.
    return next();
  });
});

/**
 * Handle errors, elegantly.
 */

app.use((error, request, response, next) => {
  console.error(error.stack);
  return response.status(500).json({
    status: 500,
    error: error.message
  });
});

/**
 * Start the server.
 */

const port = process.env.PORT || 3333;
app.listen(port);

/**
 * Hot module reloading in development.
 */

if (module.hot && isDevelopment) {
  module.hot.accept(['./reducers', './routes'], function () {
    reducers = (require('./reducers')).default;
    routes = (require('./routes')).default;
  });
}
