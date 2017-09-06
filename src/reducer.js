import mapStyle from './resources/mapStyle';

const initialState = {
  selectedPage: 'home',
  mapCenter: { lat: 35.6895, lng: 139.6917 },
  selectedDrone: null,
  settingPaneOpen: false,
  mapStyle,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MAP_CENTER':
      return Object.assign({}, state, { mapCenter: action.center });
    case 'CHANGE_PAGE':
      return Object.assign({}, state, { selectedPage: action.page });
    case 'TOGGLE_SETTING':
      return Object.assign({}, state, { settingPaneOpen: !state.settingPaneOpen });
    default:
      return state;
  }
};

export default reducer;
