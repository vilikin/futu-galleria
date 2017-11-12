import React from 'react';
import {connect} from "react-redux";
import {fetchResource} from "../store/actions";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import ErrorScreen from "../components/ErrorScreen/ErrorScreen";

// TODO: Add documentation
// TODO: Make resources function to make it possible to determine resources by props


export const withResources = (resources) => {
    return (WrappedComponent, LoadingComponent = LoadingSpinner, ErrorComponent = ErrorScreen) => {
        class WithResources extends React.Component {
            componentWillMount() {
                Object.keys(resources).forEach(resourceKey => {
                    if (!this.props.withResources[resources[resourceKey].id]) {
                        this.props.fetchResource(resources[resourceKey]);
                    }
                });
            }

            render() {
                let props = {...this.props},
                    errorOccurred = false,
                    allLoaded = true;

                delete props.withResources;
                delete props.fetchResource;

                Object.keys(resources).forEach(resourceKey => {
                    const storeResource = this.props.withResources[resources[resourceKey].id];

                    if (storeResource && !storeResource.fetching && storeResource.data) {
                        props[resourceKey] = storeResource.data;
                    } else {
                        allLoaded = false;

                        if (storeResource && !storeResource.fetching && !storeResource.data) {
                            errorOccurred = true;
                        }
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

        const mapStateToProps = (state) => ({
            withResources: state
        });

        return connect(mapStateToProps, {fetchResource})(WithResources);
    }
};

export default withResources;