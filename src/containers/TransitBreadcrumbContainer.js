import { connect } from 'react-redux';
import TransitBreadcrumb from '../components/TransitBreadcrumb';
import { setUserSelectedRoute } from '../actions';

const mapStateToProps = (state, ownProps) => {
    return {
        route_lookup_response: state.route_selection.route_lookup_response,
        route_lookup_response_status: state.route_selection.route_lookup_response_status
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: () => dispatch(setUserSelectedRoute(ownProps.idx))
    }
};

const TransitBreadcrumbContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TransitBreadcrumb);

export default TransitBreadcrumbContainer