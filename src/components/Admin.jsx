import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withGoogleMap, GoogleMap } from 'react-google-maps';

import Paper from 'material-ui/Paper';
import Icon from 'material-ui/SvgIcon';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import './styles/admin.css';

const svgString = 'M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z';

const Admin = props => (
  <div id="dashboard" className="grow">
    <AdminMap
      containerElement={<div style={{ height: '100%' }} />}
      mapElement={<div style={{ height: '100%' }} />}
      mapCenter={props.mapCenter}
      mapStyle={props.mapStyle}
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
        <path d={svgString} />
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
  </div>
);

const AdminMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={11}
    center={props.mapCenter}
    options={{ styles: props.mapStyle }}
  />
));

const mapStateToProps = state => ({
  mapCenter: state.mapCenter,
  mapStyle: state.mapStyle,
  selectedDrone: state.selectedDrone,
  settingPaneOpen: state.settingPaneOpen,
  showStations: state.showStations,
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
});

Admin.propTypes = {
  mapCenter: PropTypes.shape().isRequired,
  mapStyle: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedDrone: PropTypes.shape(),
  settingPaneOpen: PropTypes.bool.isRequired,
  toggleSettingPane: PropTypes.func.isRequired,
  showStations: PropTypes.bool.isRequired,
  toggleStations: PropTypes.func.isRequired,
};

Admin.defaultProps = {
  selectedDrone: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
