import { connect } from 'react-redux';
import Card from '../components/Card';
import {sendInfoPane} from "../actions";

const mapStateToProps = (state, ownProps) => {
    return {
        screen: state.info_pane_selection.screen
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: () => { console.log(ownProps.screen); dispatch(sendInfoPane(ownProps.screen)) }
    }
};

const CardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Card);

export default CardContainer