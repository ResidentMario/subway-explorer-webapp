import { connect } from 'react-redux';
import InfoPane from '../components/InfoPane';

const mapStateToProps = (state, ownProps) => {
    return {
        route_lookup_response_status: state.route_selection.route_lookup_response_status,
        route_lookup_response: state.route_selection.route_lookup_response,
        route_selected_idx: state.route_selection.route_selected_idx
    };
};

const mapDispatchToProps = (dispatch, ownProps) => { return {}; };

const InfoPaneContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(InfoPane);

export default InfoPaneContainer