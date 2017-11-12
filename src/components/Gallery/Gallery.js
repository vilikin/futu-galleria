import React from 'react';
import {pageOfPhotos} from "../../store/resources";

export class Gallery extends React.Component {
    componentWillMount() {
        this.props.fetchResource(pageOfPhotos(1));
    }

    render() {
        return <div>
            Hello, this is gallery.
            <div>
                {JSON.stringify(this.props.photos)}
            </div>
        </div>;
    }
}

export default Gallery;