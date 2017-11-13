import React from 'react';
import { withResources } from "../../services/withResources";
import {singlePhoto} from "../../store/resources";

import './ImageView.scss';

class ImageView extends React.Component {
    render() {
        return <div className="image-view">
            <img src={this.props.photo.url}/>
        </div>;
    }
}

const resources = (props) => ({
    photo: singlePhoto(props.match.params.id)
});

export default withResources(resources)(ImageView);