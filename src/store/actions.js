import { get } from '../services/api';

const makeActionCreator = (type, ...argNames) => {
    return (...args) => {
        let action = {type};

        argNames.forEach((arg, index) => {
            action[argNames[index]] = args[index];
        });

        return action;
    };
};

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
        const response = await get(resource.path);

        const currentData = getState().resources[resource.id].data || [];

        const data = resource.customStateModifier ?
            resource.customStateModifier(currentData, response)
            :
            response;

        dispatch(setResourceReady(resource.id, data));
    } catch (err) {
        console.error("Failed to fetch requested resource!");

        dispatch(setResourceError(resource.id));
    }
};