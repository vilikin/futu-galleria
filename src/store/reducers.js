import {SET_RESOURCE_ERROR, SET_RESOURCE_FETCHING, SET_RESOURCE_READY} from "./actions";

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
            const previous = state[action.id];

            const reachedEnd = action.pagination && action.data.length === 0;

            const nextPage = action.pagination && previous.nextPage ?
                previous.nextPage + 1
                :
                2;

            const data = action.pagination && previous.data ?
                [...previous.data, ...action.data]
                :
                action.data;

            return {
                ...state,
                [action.id]: {
                    fetching: false,
                    error: false,
                    data,
                    nextPage,
                    reachedEnd
                }
            };

        case SET_RESOURCE_ERROR:
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    fetching: false,
                    error: true
                }
            };

        default:
            return {...state};
    }
};