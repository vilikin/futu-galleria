import config from '../config';

import {
    SET_RESOURCE_ERROR,
    SET_RESOURCE_FETCHING,
    SET_RESOURCE_READY
} from "./actions";

export const pageOfPhotos = (page) => ({
    path: `/photos?_limit=${config.photosPerPage}&_page=${page}`,
    id: `photos_page_${page}`
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
                    fetching: true,
                    data: null,
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