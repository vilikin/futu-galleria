import React from 'react';
import {allPhotos, photosFromAlbum} from "../../store/resources";
import withResources from "../../services/withResources";
import {ImageCard} from "../ImageCard/ImageCard";
import PropTypes from 'prop-types';

import './Gallery.scss';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import {Link} from "react-router-dom";

class Gallery extends React.Component {
    componentDidMount() {
        this.possibleToLoadMore = true;

        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        const endPos = this.refs.end.getBoundingClientRect().top;

        if (this.possibleToLoadMore && endPos - 50 <= window.innerHeight) {
            this.props.loadNextPage();

            this.preventLoadingFor(1000);
        }
    };

    preventLoadingFor = (ms) => {
        this.possibleToLoadMore = false;

        setTimeout(() => {
            this.possibleToLoadMore = true;
        }, ms);
    };

    render() {
        return <div className="gallery">
            <TransitionGroup>
            {
                this.props.photos && this.props.photos.map(photo => (
                    <CSSTransition key={photo.id}
                                   timeout={1000}
                                   classNames="fade">
                        <Link to={"/photos/" + photo.id}>
                            <ImageCard {...photo}/>
                        </Link>
                    </CSSTransition>
                ))
            }
            </TransitionGroup>

            <div ref="end">
                {
                    this.props.fetching && <LoadingSpinner/>
                }
            </div>
        </div>
    }
}

Gallery.propTypes = {
    showAll: PropTypes.bool,
    photos: PropTypes.array,
    fetching: PropTypes.bool
};

const resources = (props) => ({
    photos: props.showAll ? allPhotos() : photosFromAlbum(props.match.params.albumId)
});

export default withResources(resources, {
    passStatusAsProps: true,
    showLoadingComponent: false
})(Gallery, null, null);