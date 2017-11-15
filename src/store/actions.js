import {makeActionCreator} from "../services/utils";
import {get} from '../services/api';

export const SET_RESOURCE_READY = 'SET_RESOURCE_READY';
export const SET_RESOURCE_FETCHING = 'SET_RESOURCE_FETCHING';
export const SET_RESOURCE_ERROR = 'SET_RESOURCE_ERROR';

const setResourceReady = makeActionCreator(SET_RESOURCE_READY, 'id', 'data', 'pagination');
const setResourceFetching = makeActionCreator(SET_RESOURCE_FETCHING, 'id');
const setResourceError = makeActionCreator(SET_RESOURCE_ERROR, 'id');

/**
 * Fetches the given resource and updates store with status of the fetching.
 * Each time this is called for resource with pagination, next page is fetched.
 *
 * @param resource object to be fetched
 */
export const fetchResource = (resource) => async (dispatch, getState) => {
    if (!resource.path || !resource.id) {
        console.error("Attempted to call fetchResource action without a valid resource object");
        return;
    }

    const resourceFromStore = getState().resources[resource.id];

    // If end of a paginated list is reached, we should not do anything
    if (resourceFromStore && resourceFromStore.reachedEnd) return;

    dispatch(setResourceFetching(resource.id));

    try {

        let path = resource.path;

        if (resource.pagination) {
            const nextPage = resourceFromStore && resourceFromStore.nextPage ? resourceFromStore.nextPage : 1;
            path = resource.path.replace('{page}', nextPage);
        }

        const response = await get(path);

        dispatch(setResourceReady(resource.id, response, resource.pagination));
    } catch (err) {
        console.error("Failed to fetch requested resource!", err);

        dispatch(setResourceError(resource.id));
    }
};