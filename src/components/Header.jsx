import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';

import './styles/header.css';

const Header = props => (
  <header className="restrict-width flex">
    <div id="menu" className="flex grow">
      <div id="logo-container">
        <img id="logo" src="/logo.png" alt="logo" />
      </div>
      <FlatButton
        label="Home"
        primary={props.selectedPage === 'home'}
        onClick={() => props.changePage(props.selectedPage, 'home')}
      />
      <FlatButton
        label="Send"
        primary={props.selectedPage === 'send'}
        onClick={() => props.changePage(props.selectedPage, 'send')}
      />
      <FlatButton
        label="Track"
        primary={props.selectedPage === 'track'}
        onClick={() => props.changePage(props.selectedPage, 'track')}
      />
      <div className="grow" />
      <FlatButton
        label="Admin"
        secondary={props.selectedPage === 'admin'}
        onClick={() => props.changePage(props.selectedPage, 'admin')}
      />
    </div>
    <Divider />
  </header>
);

const mapStateToProps = state => ({
  selectedPage: state.selectedPage,
});

const mapDispatchToProps = dispatch => ({
  changePage: (current, page) => {
    if (current !== page) {
      dispatch({
        type: 'CHANGE_PAGE',
        page,
      });
    }
  },
});

Header.propTypes = {
  selectedPage: PropTypes.string.isRequired,
  changePage: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
