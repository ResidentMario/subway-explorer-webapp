import { connect } from 'react-redux';
import InfoPane from '../components/InfoPane';

const mapStateToProps = (state, ownProps) => {
    return {
        route_lookup_response_status: state.route_selection.route_lookup_response_status,
        route_lookup_response: state.route_selection.route_lookup_response,
        route_selected_idx: state.route_selection.route_selected_idx,
        transit_explorer_response: state.route_selection.transit_explorer_response,
        transit_explorer_response_status: state.route_selection.transit_explorer_response_status,
        screen: state.info_pane_selection.screen
    };
};

const mapDispatchToProps = (dispatch, ownProps) => { return {}; };

const InfoPaneContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(InfoPane);

export default InfoPaneContainer