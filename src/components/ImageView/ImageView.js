import React from 'react';
import { withResources } from "../../services/withResources";
import {singlePhoto} from "../../store/resources";

import './ImageView.scss';
import {Link} from "react-router-dom";

class ImageView extends React.Component {
    render() {
        return <div className="image-view">
            <div>
                <img src={this.props.photo.url}/>
            </div>

            <h2>{this.props.photo.title}</h2>

            <Link to="/" className="button">
                Back to gallery
            </Link>
        </div>;
    }
}

const resources = (props) => ({
    photo: singlePhoto(props.match.params.id)
});

export default withResources(resources)(ImageView);