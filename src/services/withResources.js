import React from 'react';
import {connect} from "react-redux";
import {fetchResource} from "../store/actions";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import ErrorScreen from "../components/ErrorScreen/ErrorScreen";

const defaultOptions = {
    // When set to true, passes 'loaded' and 'error' props to the wrapped component
    passStatusAsProps: false,
    // When set to true, renders loading component instead of the wrapped component
    // if resources are still being loaded
    showLoadingComponent: true,
    // When set to true, renders error component instead of the wrapped component
    // if error occurred during resource loading
    showErrorComponent: true
};

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
export const withResources = (requestedResources, options = defaultOptions) => {
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
                    console.log("modification!");
                    this.fetchRequestedResources();
                }
            }

            /**
             * Loads next page of all paginated resources.
             */
            loadNextPage = () => {
                this.forEachRequestedResource((resourceKey, resourceObject) => {
                    if (resourceObject.pagination) {
                        this.props.fetchResource(resourceObject);
                    }
                });
            };

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
             *
             * Can be toggled with options to not swap between components on resource state changes.
             */
            render() {
                let props = {...this.props},
                    errorOccurred = false,
                    fetching = false;

                // We do not want to leak these internal props to the wrapped component.

                delete props.availableResources;

                // Give WrappedComponent access to loadNextPage function
                props.loadNextPage = this.loadNextPage;

                this.forEachRequestedResource((resourceKey, resourceObject, resourceFromStore) => {
                    // Add resource to the props that will be passed on to the WrappedComponent
                    props[resourceKey] = resourceFromStore ? resourceFromStore.data : null;

                    if (resourceFromStore && resourceFromStore.error) {
                        // If there were any errors, set a flag that error occurred
                        errorOccurred = true;
                    }

                    if (!resourceFromStore || resourceFromStore.fetching) {
                        // If component is not yet available in store, set a flag that it is still fetching
                        fetching = true;
                    }
                });

                if (options.passStatusAsProps) {
                    props.fetching = fetching;
                    props.error = errorOccurred;
                }

                let componentToDisplay;

                if (errorOccurred && options.showErrorComponent) {
                    componentToDisplay = <ErrorComponent/>;
                } else if (fetching && options.showLoadingComponent) {
                    componentToDisplay = <LoadingComponent/>;
                } else {
                    componentToDisplay = <WrappedComponent {...props}/>
                }

                return componentToDisplay;
            }
        }

        // Give our WithResources component access to all available resources on the store
        const mapStateToProps = (state) => ({
            availableResources: state.resources
        });

        // We also give access to fetchResource action
        return connect(mapStateToProps, { fetchResource })(WithResources);
    }
};

export default withResources;