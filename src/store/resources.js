import config from '../config';
import { get } from '../services/api';
import {makeActionCreator} from "../services/utils";

// AVAILABLE RESOURCES

let nextPage = 1;

export const pageOfPhotos = () => ({
    // Path from which the resource should be loaded
    // Relative to the API URL specified in config
    path: `/photos?_limit=${config.photosPerPage}&_page=${nextPage}`,

    // Identifier for the resource, used in store
    id: 'photos',

    // Overrides default behavior of updating store.
    // Default behavior would be replacing previous data with
    // new data, which works in most cases.

    // With list of photos that are being loaded in chunks, we should
    // not just replace existing list with a new list, but add new items
    // at the end of the existing list. Also, we need to increment counter
    // which keeps track of which page we should load next.
    customSetter: (currentState, result)  => {
        nextPage += 1;

        if (!currentState) {
            return [...result];
        } else {
            return [...currentState, ...result];
        }
    }
});

export const singlePhoto = (id) => ({
    path: `/photos/${id}`,
    id: `photo_id_${id}`
});

export const albums = () => ({
    path: '/albums',
    id: 'albums'
});

export const users = () => ({
    path: '/users',
    id: 'users'
});

// ACTIONS

export const SET_RESOURCE_READY = 'SET_RESOURCE_READY';
export const SET_RESOURCE_FETCHING = 'SET_RESOURCE_FETCHING';
export const SET_RESOURCE_ERROR = 'SET_RESOURCE_ERROR';

const setResourceReady = makeActionCreator(SET_RESOURCE_READY, 'id', 'data');
const setResourceFetching = makeActionCreator(SET_RESOURCE_FETCHING, 'id');
const setResourceError = makeActionCreator(SET_RESOURCE_ERROR, 'id');

export const fetchResource = (resource) => async (dispatch, getState) => {
    if (!resource.path || !resource.id) {
        console.error("Attempted to call fetchResource action without a valid resource object");
        return;
    }

    dispatch(setResourceFetching(resource.id));

    try {
        const resourceFromStore = getState().resources[resource.id];

        const response = await get(resource.path);

        // Check if response data should be inserted to the store
        // using a custom setter function provided by resource
        const newData = resource.customSetter ?
            resource.customSetter(resourceFromStore.data, response)
            :
            response;

        dispatch(setResourceReady(resource.id, newData));
    } catch (err) {
        console.error("Failed to fetch requested resource!");

        dispatch(setResourceError(resource.id));
    }
};

// REDUCER

export const resourcesReducer = (state = {}, action) => {
    switch (action.type) {
        case SET_RESOURCE_FETCHING:
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    fetching: true,
                    error: false
                }
            };

        case SET_RESOURCE_READY:
            return {
                ...state,
                [action.id]: {
                    fetching: false,
                    data: action.data,
                    error: false
                }
            };

        case SET_RESOURCE_ERROR:
            return {
                ...state,
                [action.id]: {
                    fetching: false,
                    data: null,
                    error: true
                }
            };

        default:
            return {...state};
    }
};