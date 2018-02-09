import { connect } from 'react-redux';
import Webmap from '../components/Webmap';
import { setStartPin, setEndPin } from '../actions';

const mapStateToProps = (state, ownProps) => {
    return {start_pin: state.start_pin, end_pin: state.end_pin};
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: (e) => {
            console.log(e);
            if (ownProps.start_pin) {
                // TODO: Reflect these state changes down in the Webmap object.
                dispatch(setEndPin([e.latlng.lng, e.latlng.lat]))
            } else {
                dispatch(setStartPin([e.latlng.lng, e.latlng.lat]))
            }
        }
    }
};

const WebmapContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Webmap);

export default WebmapContainer