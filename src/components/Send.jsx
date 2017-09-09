import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withGoogleMap, GoogleMap, Marker, Circle, Polyline } from 'react-google-maps';

import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import getRoute from '../utils/getRoute';
import sendRoute from '../utils/sendRoute';

import './styles/send.css';

const Track = props => (
  <div id="sending-page" className="flex restrict-width grow">
    <div id="sending-search-pane" className="flex">
      <Paper className="sending-address-pane flex grow" zDepth={1}>
        <p>From:</p>
        <TextField
          id="from-address"
          className="sending-address-box grow"
          hintText="Address"
        />
      </Paper>
      <Paper className="sending-address-pane flex grow" zDepth={1}>
        <p>To:</p>
        <TextField
          id="dest-address"
          className="sending-address-box grow"
          hintText="Address"
        />
      </Paper>
      <RaisedButton
        primary
        label="Search"
        className="sending-search-button"
        onClick={() => {
          getRoute(document.getElementById('from-address').value, document.getElementById('dest-address').value)
            .then((response) => {
              props.updateRoute(response.path);
              if (response.message === 'Could not find location.') {
                props.openDialog('Could not find location.');
              } else if (response.message === 'Error occured while fetching from API.') {
                props.openDialog('Error occured while fetching from API.');
              } else if (response.status === 'ok' && response.path.length === 0) {
                props.openDialog('Sorry, this path is currently not available. For more information please contact us.');
              }
            });
        }}
      />
    </div>

    <div id="track-map" className="grow">
      <SendMap
        containerElement={<div style={{ height: '100%', width: '100%' }} />}
        mapElement={<div style={{ height: '100%' }} />}
        mapCenter={props.mapCenter}
        mapStyle={props.mapStyle}
        route={props.route}
        selectStation={props.selectStation}
        selectedStation={props.selectedStation}
      />
    </div>
    <RaisedButton
      primary
      label="Send Package"
      disabled={props.route.length === 0}
      className="send-route"
      onClick={() => {
        sendRoute(props.route).then((res) => {
          if (res.status === 'success') {
            props.openDialog(`Your package is on its way! Tracking number: ${res.tracknum}`);
          } else if (res.status === 'error') {
            props.openDialog(`Sending package failed: ${res.message}`);
          }
        });
      }}
    />

    <Dialog
      title="Airborne"
      actions={[
        <RaisedButton
          label="OK"
          primary
          onClick={props.closeDialog}
        />,
      ]}
      modal
      open={props.dialogOpen}
      onRequestClose={props.closeDialog}
    >
      {props.dialogMessage}
    </Dialog>
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

const SendMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={12}
    center={props.mapCenter}
    options={{ styles: props.mapStyle }}
  >
    {props.route.map(loc => (
      <Marker
        key={loc.name}
        position={{ lat: loc.lat, lng: loc.lng }}
        icon={loc.name === 'source' || loc.name === 'destination' ? icons[loc.name] : station}
        onClick={loc.name !== 'source' && loc.name !== 'destination' ? props.selectStation(loc) : {}}
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
    <Polyline path={props.route} strokeColor={'#1FBCD2'} />
  </GoogleMap>
));

const mapStateToProps = state => ({
  mapCenter: state.mapCenter,
  mapStyle: state.mapStyle,
  route: state.route,
  dialogOpen: state.dialogOpen,
  dialogMessage: state.dialogMessage,
  selectedStation: state.selectedStation,
});

const mapDispatchToProps = dispatch => ({
  setMapCenter: center => dispatch({
    type: 'SET_MAP_CENTER',
    center,
  }),
  updateRoute: route => dispatch({
    type: 'UPDATE_ROUTE',
    route,
  }),
  openDialog: dialogMessage => dispatch({
    type: 'OPEN_DIALOG',
    dialogMessage,
  }),
  closeDialog: () => dispatch({
    type: 'CLOSE_DIALOG',
  }),
  selectStation: selectedStation => dispatch({
    type: 'SELECT_STATION',
    station: selectedStation,
  }),
});

Track.propTypes = {
  mapCenter: PropTypes.shape().isRequired,
  mapStyle: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateRoute: PropTypes.func.isRequired,
  route: PropTypes.arrayOf(PropTypes.object).isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  openDialog: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,
  dialogMessage: PropTypes.string.isRequired,
  selectStation: PropTypes.func.isRequired,
  selectedStation: PropTypes.shape(),
};

Track.defaultProps = {
  selectedStation: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(Track);
