import { connect } from 'react-redux';
import Webmap from '../components/Webmap';
// import { setStartPin } from '../actions';

const mapStateToProps = (state, ownProps) => {
    return state;
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: (e) => { console.log(e); }
    }
};

const WebmapContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Webmap);

export default WebmapContainer