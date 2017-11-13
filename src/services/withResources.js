import React from 'react';
import {connect} from "react-redux";
import {fetchResource} from "../store/actions";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import ErrorScreen from "../components/ErrorScreen/ErrorScreen";

/**
 * Returns a function that returns higher order component (HOC).
 *
 * This HOC encapsulates logic of fetching requested resources and rendering
 * the given component with fetched resources as props. When resources are still loading,
 * displays given loading indicator. If errors occur during the loading, displays error component instead.
 *
 * Example usages:
 *
 * withResources({
 *     photos: pageOfPhotos(1)
 * })(PhotoList);
 *
 * Now the PhotoList is only rendered when pageOfPhotos(1) resource has been fetched,
 * and the resource is provided as 'photos' prop.
 *
 * withResources((props) => ({
 *     photo: singlePhoto(props.photoId)
 * }))(PhotoView, CustomLoadingIndicator, CustomErrorComponent);
 *
 * Requested resources can also be passed in as a function that resolves to an object
 * based on the current props of the component.
 *
 * You can also provide custom loading indicator and error component to be displayed when
 * the resource is not (yet) available.
 */
export const withResources = (requestedResources) => {
    return (WrappedComponent, LoadingComponent = LoadingSpinner, ErrorComponent = ErrorScreen) => {
        class WithResources extends React.Component {
            constructor(props) {
                super(props);

                // Set this.resources as the resources-object.

                // The resources-object has keys that determine by which prop the resource
                // should be available for the wrapped component.

                // Values hold resource objects that should be fetched for the wrapped component.

                this.resources = this.getRequestedResources(this.props);

                this.fetchRequestedResources();
            }

            /**
             * Determine if any of the requested resources are not yet available on the store,
             * and start fetching if so.
             */
            fetchRequestedResources = () => {
                this.forEachRequestedResource((resourceKey, resourceObject, resourceFromStore) => {
                    if (!resourceFromStore) {
                        this.props.fetchResource(resourceObject);
                    }
                });
            };

            /**
             * As requestedResources param can be a function that returns a resources-object
             * based on the props of the component, we should resolve it before doing anything else.
             *
             * Returns a plain resources-object.
             */
            getRequestedResources = (props) => {
                if (typeof requestedResources === 'function') {
                    return requestedResources(props);
                } else {
                    return requestedResources;
                }
            };

            /**
             * Loops through every requested resource, calling callback function on each iteration
             * with resource key, resource object and matching resource from the store (if found).
             *
             * @param callback  Function with thee arguments:
             *                  - resourceKey (string)
             *                  - resourceObject (object)
             *                  - resourceFromStore (any)
             */
            forEachRequestedResource = (callback) => {
                Object.keys(this.resources).forEach(resourceKey => {
                    const resourceObject = this.resources[resourceKey];
                    const resourceFromStore = this.props.availableResources[resourceObject.id];

                    callback(resourceKey, resourceObject, resourceFromStore);
                });
            };

            /**
             * Determine if props that affect requested resources have been changed.
             */
            componentWillReceiveProps(nextProps) {
                const nextRequestedResources = this.getRequestedResources(nextProps);
                const previousRequestedResources = this.resources;

                if (JSON.stringify(nextRequestedResources) !== JSON.stringify(previousRequestedResources)) {
                    this.resources = nextRequestedResources;

                    this.fetchRequestedResources();
                }
            }

            /**
             * Determines which of the three components to render:
             *      - WrappedComponent
             *      - LoadingComponent
             *      - ErrorComponent
             *
             * If all of the requested resources are available, renders the WrappedComponent
             * with all of the requested resources passed as props.
             *
             * Renders LoadingComponent if fetching is still in progress, or ErrorComponent if
             * any errors occurred while fetching.
             */
            render() {
                let props = {...this.props},
                    errorOccurred = false,
                    allLoaded = true;

                // We do not want to leak these internal props to the wrapped component.

                delete props.availableResources;
                delete props.fetchResource;

                this.forEachRequestedResource((resourceKey, resourceObject, resourceFromStore) => {
                    if (resourceFromStore && !resourceFromStore.fetching && resourceFromStore.data) {
                        // If resource is available in store, add it to the props that will be
                        // passed to the WrappedComponent
                        props[resourceKey] = resourceFromStore.data;
                    } else if (resourceFromStore && resourceFromStore.error) {
                        // If there were any errors, set a flag that all resources were not yet
                        // loaded and errors occurred
                        errorOccurred = true;
                        allLoaded = false;
                    } else {
                        // If component is not yet available in store, set a flag that all
                        // resources are not yet loaded
                        allLoaded = false;
                    }
                });

                return allLoaded ?
                    <WrappedComponent {...props}/>
                    :
                    errorOccurred ?
                        <ErrorComponent/>
                        :
                        <LoadingComponent/>;
            }
        }

        // Give our WithResources component access to all available resources on the store
        const mapStateToProps = (state) => ({
            availableResources: state.resources
        });

        // We also give access to fetchResource action
        return connect(mapStateToProps, {fetchResource})(WithResources);
    }
};

export default withResources;