import { connect } from 'react-redux';
import Webmap from '../components/Webmap';
import { sendPin } from '../actions';

const mapStateToProps = (state, ownProps) => {
    return {start_pin: state.route_selection.start_pin, end_pin: state.route_selection.end_pin};
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: (e) => { dispatch(sendPin(e.latlng.lng, e.latlng.lat)) }
    }
};

const WebmapContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Webmap);

export default WebmapContainer