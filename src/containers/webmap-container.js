import { connect } from 'react-redux';
import Webmap from '../components/Webmap';
import { setStartPin } from '../actions';

const mapStateToProps = (state, ownProps) => {
    return state;
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onMouseOver: () => {
            dispatch(setStartPin(42, 42));
        }
    }
};

const WebmapContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Webmap);

export default WebmapContainer