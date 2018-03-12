import { combineReducers } from 'redux'
import route_selection from './route_selection';
import info_pane_selection from './info_pane_selection';

const subwayExplorer = combineReducers({
    route_selection, info_pane_selection
});

export default subwayExplorer;