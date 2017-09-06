import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Route, BrowserRouter } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import App from './App';
import Admin from './Admin';
import Track from './Track'

import './styles/index.css';

import reducer from '../reducer';

const store = createStore(reducer);

const muiTheme = getMuiTheme({
  palette: {

  }
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={ muiTheme }>
      <BrowserRouter>
        <div id="router">
          <Route exact path="/" component={App} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/track" component={Track} />
        </div>
      </BrowserRouter>
    </MuiThemeProvider>
  </Provider>, document.getElementById('root'),
);
