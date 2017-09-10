import mapStyle from './resources/mapStyle';

const initialState = {
  selectedPage: 'home',
  mapCenter: { lat: 35.6895, lng: 139.6917 },
  drones: [],
  selectedDrone: null,
  stations: [],
  stationsLoaded: false,
  trackedPackage: { route: [] },
  settingPaneOpen: false,
  showStations: true,
  route: [],
  mapStyle,
  dialogOpen: false,
  dialogMessage: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MAP_CENTER':
      return Object.assign({}, state, { mapCenter: action.center });
    case 'CHANGE_PAGE':
      return Object.assign({}, state, { selectedPage: action.page });
    case 'TOGGLE_SETTING':
      return Object.assign({}, state, { settingPaneOpen: !state.settingPaneOpen });
    case 'TOGGLE_STATIONS':
      return Object.assign({}, state, { showStations: !state.showStations });
    case 'UPDATE_ROUTE':
      return Object.assign({}, state, { route: action.route, selectedStation: null });
    case 'UPDATE_STATIONS':
      return Object.assign({}, state, { stations: action.stations, stationsLoaded: true });
    case 'SELECT_STATION':
      return Object.assign({}, state, { selectedStation: action.station });
    case 'OPEN_DIALOG':
      return Object.assign({}, state, { dialogOpen: true, dialogMessage: action.dialogMessage });
    case 'CLOSE_DIALOG':
      return Object.assign({}, state, { dialogOpen: false });
    case 'UPDATE_TRACKED_PACKAGE':
      return Object.assign({}, state, { trackedPackage: action.trackedPackage });
    default:
      return state;
  }
};

export default reducer;
