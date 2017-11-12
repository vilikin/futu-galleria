import React from 'react';
import {pageOfPhotos} from "../../store/resources";
import withResources from "../../services/withResources";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

class Gallery extends React.Component {
    render() {
        return <div>
            Hello, this is gallery.
            <div>
                {JSON.stringify(this.props)}
            </div>
        </div>;
    }
}

const resources = {
    photos: pageOfPhotos(1)
};

export default withResources(resources)(Gallery, LoadingSpinner);