import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Home from './Home';
import Send from './Send';
import Track from './Track';
import Admin from './Admin';

import './styles/router.css';

const Router = props => (
  <div id="router" className="flex grow">
    {(() => {
      switch (props.selectedPage) {
        case 'home':
          return <Home />;
        case 'send':
          return <Send />;
        case 'track':
          return <Track />;
        case 'admin':
          return <Admin />;
        default:
          return <div>{'Uh oh, you shouldn\'t be here.'}</div>;
      }
    })()}
  </div>
);

const mapStateToProps = state => ({
  selectedPage: state.selectedPage,
});

Router.propTypes = {
  selectedPage: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, null)(Router);
