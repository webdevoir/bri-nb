import { connect } from 'react-redux';

// import { updateFilter } from '../../actions/filter_actions';
// import { asArray } from '../../reducers/selectors';
import fetchHomes from '../../actions/home_actions';
import Search from './search';

const mapStateToProps = state => ({
  homes: Object.values(state.entities.homes),
//   minSeating: state.ui.filters.minSeating,
//   maxSeating: state.ui.filters.maxSeating
});

const mapDispatchToProps = dispatch => ({
    fetchHomes: () => dispatch(fetchHomes())
//   updateFilter: (filter, value) => dispatch(updateFilter(filter, value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);