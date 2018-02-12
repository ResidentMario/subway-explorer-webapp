import { connect } from 'react-redux';
import Sidebar from '../components/Sidebar';
// import { sendPin } from '../actions';

const mapStateToProps = (state, ownProps) => {
    return {
        route_lookup_confirmed: state.route_selection.route_lookup_confirmed,
        route_lookup_response_status: state.route_selection.route_lookup_response_status,
        route_lookup_response: state.route_selection.route_lookup_response,
        start_pin: state.route_selection.start_pin,
        end_pin: state.route_selection.end_pin
    };
};

const mapDispatchToProps = (dispatch, ownProps) => { return {}; };

const SidebarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Sidebar);

export default SidebarContainer