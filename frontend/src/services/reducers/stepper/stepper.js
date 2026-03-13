import {
    FILL_STEPPER_MANDATORY
} from "../../actions/types"

const initialState = {
    isMandatoryFields: {}
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case FILL_STEPPER_MANDATORY:
            return {
                ...state,
                isMandatoryFields: payload
            }

        default:
            return {
                ...state
            }
    }
};
