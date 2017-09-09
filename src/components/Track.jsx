import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withGoogleMap, GoogleMap } from 'react-google-maps';
import Paper from 'material-ui/Paper';
import Icon from 'material-ui/SvgIcon';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import track from '../utils/track';

import './styles/track.css';

const svgString = 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z';

const Track = props => (
  <div id="tracking-page" className="flex restrict-width grow">
    <div id="tracking-search-pane" className="flex">
      <Paper className="tracking-number-pane flex grow" zDepth={1}>
        <Icon className="magnify-icon">
          <path d={svgString} />
        </Icon>
        <TextField
          id="tracking-number"
          className="tracking-number-box grow"
          hintText="Tracking Number"
        />
      </Paper>
      <RaisedButton
        primary
        label="Search"
        className="tracking-search-button"
        onClick={() => {
          const trackingNumber = document.getElementById('tracking-number').value;
          const tracker = window.setInterval(() => {
            track(trackingNumber)
              .then(trackedPackage => (trackedPackage.status && trackedPackage.status === 'OK' ?
                props.updateTrackedPackage(trackedPackage) :
                clearInterval(tracker)));
          }, 1000);
        }}
      />
    </div>

    <div id="track-map" className="grow">
      <TrackMap
        containerElement={<div style={{ height: '100%', width: '100%' }} />}
        mapElement={<div style={{ height: '100%' }} />}
        mapCenter={props.mapCenter}
        mapStyle={props.mapStyle}
      />
    </div>
  </div>
);

const TrackMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={11}
    center={props.mapCenter}
    options={{ styles: props.mapStyle }}
  />
));

const mapStateToProps = state => ({
  mapCenter: state.mapCenter,
  mapStyle: state.mapStyle,
});

const mapDispatchToProps = dispatch => ({
  setMapCenter: center => dispatch({
    type: 'SET_MAP_CENTER',
    center,
  }),
  updateTrackedPackage: trackedPackage => dispatch({
    type: 'UPDATE_TRACKED_PACKAGE',
    trackedPackage,
  }),
});

Track.propTypes = {
  mapCenter: PropTypes.shape().isRequired,
  mapStyle: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Track);
