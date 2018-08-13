import { connect } from 'react-redux';
import HomeIndex from './home_index.jsx';
import { fetchHomes } from '../../actions/home_actions';

const mapStateToProps = (state) => ({
    homes: Object.values(state.entities.homes)
});

const mapDispatchToProps = dispatch => ({
    fetchHomes: () => dispatch(fetchHomes())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeIndex);