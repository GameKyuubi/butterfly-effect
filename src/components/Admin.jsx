import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withGoogleMap, GoogleMap, Marker, Circle } from 'react-google-maps';

import Paper from 'material-ui/Paper';
import Icon from 'material-ui/SvgIcon';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import getStations from '../utils/getStations';

import './styles/admin.css';

const gearIconPath = 'M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z';

const stationIcon = {
  path: 'M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM18 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM8 18v-4.5H6L10 6v5h2l-4 7z',
  anchor: { x: 10, y: 10 },
  fillColor: '#FFD441',
  fillOpacity: 1.0,
};

const Admin = (props) => {
  if (!props.stationsLoaded) {
    getStations().then(stations => props.updateStations(stations));
  }

  return (<div id="dashboard" className="grow">
    <AdminMap
      containerElement={<div style={{ height: '100%' }} />}
      mapElement={<div style={{ height: '100%' }} />}
      mapCenter={props.mapCenter}
      mapStyle={props.mapStyle}
      stations={props.stations}
      showStations={props.showStations}
      selectStation={props.selectStation}
      selectedStation={props.selectedStation}
      drones={props.drones}
    />
    <Paper className="details-pane">
      {
        props.selectedDrone ?
          <div>drone data</div> :
          <div>No drone selected</div>
      }
    </Paper>
    <FloatingActionButton
      className="setting-button"
      onClick={props.toggleSettingPane}
    >
      <Icon className="gear-icon">
        <path d={gearIconPath} />
      </Icon>
    </FloatingActionButton>
    <Drawer
      docked={false}
      width={200}
      open={props.settingPaneOpen}
      onRequestChange={props.toggleSettingPane}
    >
      <Paper className="setting-pane">
        <p>Settings</p>
        <Divider className="setting-divider" />
        <Checkbox
          label="Show Stations"
          checked={props.showStations}
          onCheck={props.toggleStations}
        />
      </Paper>
    </Drawer>
  </div>);
};

const droneIcon = {
  path: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z',
  anchor: { x: 5, y: 5 },
  fillColor: '#40C4FF',
  fillOpacity: 1.0,
};

const AdminMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={13}
    center={props.mapCenter}
    options={{ styles: props.mapStyle }}
  >
    { props.showStations ?
      props.stations.map(station => (
        <Marker
          key={station.id}
          position={{ lat: station.lat, lng: station.lng }}
          icon={stationIcon}
          onClick={() => props.selectStation(station)}
        />)) :
      <div /> }
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
    { props.drones.map(drone =>
      <Marker key={drone.id} position={{ lat: drone.lat, lng: drone.lng }} icon={droneIcon} />,
    )}
  </GoogleMap>
));

const mapStateToProps = state => ({
  drones: state.drones,
  selectedDrone: state.selectedDrone,
  mapCenter: state.mapCenter,
  mapStyle: state.mapStyle,
  settingPaneOpen: state.settingPaneOpen,
  showStations: state.showStations,
  stations: state.stations,
  selectedStation: state.selectedStation,
  stationsLoaded: state.stationsLoaded,
});

const mapDispatchToProps = dispatch => ({
  setMapCenter: center => dispatch({
    type: 'SET_MAP_CENTER',
    center,
  }),
  toggleSettingPane: () => dispatch({
    type: 'TOGGLE_SETTING',
  }),
  toggleStations: () => dispatch({
    type: 'TOGGLE_STATIONS',
  }),
  updateStations: stations => dispatch({
    type: 'UPDATE_STATIONS',
    stations,
  }),
  selectStation: station => dispatch({
    type: 'SELECT_STATION',
    station,
  }),
});

Admin.propTypes = {
  selectedDrone: PropTypes.shape(),
  drones: PropTypes.arrayOf(PropTypes.object).isRequired,
  mapCenter: PropTypes.shape().isRequired,
  mapStyle: PropTypes.arrayOf(PropTypes.object).isRequired,
  stations: PropTypes.arrayOf(PropTypes.object).isRequired,
  settingPaneOpen: PropTypes.bool.isRequired,
  toggleSettingPane: PropTypes.func.isRequired,
  showStations: PropTypes.bool.isRequired,
  toggleStations: PropTypes.func.isRequired,
  stationsLoaded: PropTypes.bool.isRequired,
  updateStations: PropTypes.func.isRequired,
  selectStation: PropTypes.func.isRequired,
  selectedStation: PropTypes.shape(),
};

Admin.defaultProps = {
  selectedDrone: null,
  selectedStation: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
