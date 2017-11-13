import config from '../config';

import {
    SET_RESOURCE_ERROR,
    SET_RESOURCE_FETCHING,
    SET_RESOURCE_READY
} from "./actions";

let nextPage = 1;

export const pageOfPhotos = () => ({
    path: `/photos?_limit=${config.photosPerPage}&_page=${nextPage}`,
    id: `photos`,
    customStateModifier: (state, result)  => {
        nextPage += 1;
        return [...state, ...result];
    }
});

export const singlePhoto = (id) => ({
    path: `/photos/${id}`,
    id: `photo_id_${id}`
});

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