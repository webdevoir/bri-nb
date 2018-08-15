import { connect } from 'react-redux';
import { fetchHome, fetchHomes } from '../../actions/home_actions';
import {selectHome } from '../../reducers/selectors';
import HomeShow from './home_show';

const mapStateToProps = (state, ownProps) => ({
    homeId: parseInt(ownProps["ownProps"].match.params.homeId),
    home: state.entities.homes[parseInt(ownProps["ownProps"].match.params.homeId)]
});

const mapDispatchToProps = dispatch => ({
    fetchHome: (id) => dispatch(fetchHome(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeShow);