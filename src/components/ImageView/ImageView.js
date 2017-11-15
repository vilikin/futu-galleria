import React from 'react';
import { withResources } from "../../services/withResources";
import {singlePhoto} from "../../store/resources";
import PropTypes from 'prop-types';

import './ImageView.scss';
import {Link} from "react-router-dom";

class ImageView extends React.Component {
    render() {
        return <div className="image-view">
            <div>
                <img src={this.props.photo.url}/>
            </div>

            <h2>{this.props.photo.title}</h2>

            <a className="button"
               onClick={this.props.history.goBack}>
                Back to album
            </a>
        </div>;
    }
}

ImageView.propTypes = {
    photo: PropTypes.object.isRequired
};

const resources = (props) => ({
    photo: singlePhoto(props.match.params.photoId)
});

export default withResources(resources)(ImageView);