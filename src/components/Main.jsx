import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Header from './Header';
import Router from './Router';
import Footer from './Footer';

import './styles/main.css';

import reducer from '../reducer';

const store = createStore(reducer);

const muiTheme = getMuiTheme({
  palette: {

  },
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <div id="main" className="flex">
        <Header />
        <Router />
        <Footer />
      </div>
    </MuiThemeProvider>
  </Provider>, document.getElementById('root'),
);
