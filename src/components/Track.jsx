/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withGoogleMap, GoogleMap, Marker, Polyline, Circle } from 'react-google-maps';
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
          track(trackingNumber)
            .then(response => props.updateTrackedPackage(response));
        }}
      />
    </div>

    <div id="track-map" className="grow">
      <TrackMap
        containerElement={<div style={{ height: '100%', width: '100%' }} />}
        mapElement={<div style={{ height: '100%' }} />}
        mapCenter={props.mapCenter}
        mapStyle={props.mapStyle}
        package={props.package}
      />
    </div>
  </div>
);

const station = {
  path: 'M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM18 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM8 18v-4.5H6L10 6v5h2l-4 7z',
  anchor: { x: 10, y: 10 },
  fillColor: '#FFD441',
  fillOpacity: 1.0,
};

const icons = {
  source: {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    anchor: { x: 12, y: 22 },
    fillColor: '#569536',
    fillOpacity: 1.0,
  },
  destination: {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    anchor: { x: 12, y: 22 },
    fillColor: '#DA4535',
    fillOpacity: 1.0,
  },
};

const TrackMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={12}
    center={props.mapCenter}
    options={{ styles: props.mapStyle }}
  >
    { props.package.route.length > 0 ?
      <Marker
        position={{ lat: props.package.route[0].sourceLat, lng: props.package.route[0].sourceLng }}
        icon={station}
        onClick={() => props.selectStation(props.package.route[0])}
      /> : <div />
    }
    {props.package.route.map(seg => (
      <Marker
        key={seg.id}
        position={{ lat: seg.destLat, lng: seg.destLng }}
        icon={seg.destType === 'source' || seg.destType === 'destination' ? icons[seg.destType] : station}
        onClick={seg.destType !== 'source' && seg.destType !== 'destination' ? () => props.selectStation(seg) : {}}
      />
    ))}
    { props.selectedStation ?
      <Circle
        key={props.selectedStation.id}
        center={{ lat: props.selectedStation.lat, lng: props.selectedStation.lng }}
        radius={2000}
        options={{
          strokeColor: 'grey',
          fillColor: 'grey',
          strokeWeight: 1,
        }}
      /> :
      <div />}
    { props.package.route.length ?
      <Polyline
        path={(() => {
          const array = props.package.route.map(route => ({ lat: route.destLat, lng: route.destLng }));
          array.unshift({ lat: props.package.route[0].sourceLat, lng: props.package.route[0].sourceLng });
          return array;
        })()}
        strokeColor={'#1FBCD2'}
      /> :
      <div />
    }
  </GoogleMap>
));

const mapStateToProps = state => ({
  mapCenter: state.mapCenter,
  mapStyle: state.mapStyle,
  package: state.trackedPackage,
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
  updateTrackedPackage: PropTypes.func.isRequired,
  package: PropTypes.shape().isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Track);
