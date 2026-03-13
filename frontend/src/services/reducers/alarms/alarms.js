import {
    TOGGLE_ALARMS,
} from '../../actions/types';

const initialState = {
    isOpen: false,
};

export default function (state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case TOGGLE_ALARMS:
            return {
                ...state,
                isOpen: payload
            }

        default:
            return state
    }
};
