import { connect } from 'react-redux';
import Gallery from './Gallery';
import {fetchResource} from "../../store/actions";

const mapStateToProps = (state) => ({
    photos: state.photos_page_1
});

const Container = connect(mapStateToProps, { fetchResource })(Gallery);
export default Container;
