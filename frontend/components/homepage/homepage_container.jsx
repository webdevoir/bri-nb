import { connect } from 'react-redux';
import Homepage from './homepage';

const mapStateToProps = ({ session }) => ({
    currentUser: session.id
});

const mapDispatchToProps = dispatch => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);