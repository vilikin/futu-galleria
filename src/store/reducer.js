import {
    SET_RESOURCE_ERROR,
    SET_RESOURCE_FETCHING,
    SET_RESOURCE_READY
} from "./actions";

export default (state = {}, action) => {
    switch (action.type) {
        case SET_RESOURCE_FETCHING:
            return {
                ...state,
                [action.id]: {
                    fetching: true,
                    data: null
                }
            };

        case SET_RESOURCE_READY:
            return {
                ...state,
                [action.id]: {
                    fetching: false,
                    data: action.data
                }
            };

        case SET_RESOURCE_ERROR:
            return {
                ...state,
                [action.id]: {
                    fetching: false,
                    data: null
                }
            };
        
        default:
            return {...state};
    }
}