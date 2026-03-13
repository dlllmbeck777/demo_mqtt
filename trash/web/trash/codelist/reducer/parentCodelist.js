import { createSlice } from '@reduxjs/toolkit'

export const parentCodeList = createSlice({
    name: 'parentCodelist',
    initialState: {
        isUpdated: false,
        ROW_ID: "",
        LIST_TYPE: "",
        CULTURE: "",
        CODE: "",
        CODE_TEXT: "",
        PARENT: "",
        LEGACY_CODE: "",
        VAL1: "",
        VAL2: "",
        VAL3: "",
        VAL4: "",
        VAL5: "",
        VAL6: "",
        VAL7: "",
        VAL8: "",
        VAL9: "",
        VAL10: "",
        DATE1: "",
        DATE2: "",
        DATE3: "",
        DATE4: "",
        DATE5: "",
        CHAR1: "",
        CHAR2: "",
        CHAR3: "",
        CHAR4: "",
        CHAR5: "",
        LAYER_NAME: "",
        DESCRIPTION_ID: "",
        HIDDEN: "",
        LAST_UPDT_USER: "",
        LAST_UPDT_DATE: "",

    },
    reducers: {
        setParentCodeList: (state, payload) => {
            state.ROW_ID = payload.payload.ROW_ID
            state.LIST_TYPE = payload.payload.LIST_TYPE
            state.CULTURE = payload.payload.CULTURE
            state.CODE = payload.payload.CODE
            state.CODE_TEXT = payload.payload.CODE_TEXT
            state.PARENT = payload.payload.PARENT
            state.LEGACY_CODE = payload.payload.LEGACY_CODE
            state.VAL1 = payload.payload.VAL1
            state.VAL2 = payload.payload.VAL2
            state.VAL3 = payload.payload.VAL3
            state.VAL4 = payload.payload.VAL4
            state.VAL5 = payload.payload.VAL5
            state.VAL6 = payload.payload.VAL6
            state.VAL7 = payload.payload.VAL7
            state.VAL8 = payload.payload.VAL8
            state.VAL9 = payload.payload.VAL9
            state.VAL10 = payload.payload.VAL10
            state.DATE1 = payload.payload.DATE1
            state.DATE2 = payload.payload.DATE2
            state.DATE3 = payload.payload.DATE3
            state.DATE4 = payload.payload.DATE4
            state.DATE5 = payload.payload.DATE5
            state.CHAR1 = payload.payload.CHAR1
            state.CHAR2 = payload.payload.CHAR2
            state.CHAR3 = payload.payload.CHAR3
            state.CHAR4 = payload.payload.CHAR4
            state.CHAR5 = payload.payload.CHAR5
            state.LAYER_NAME = payload.payload.LAYER_NAME
            state.DESCRIPTION_ID = payload.payload.DESCRIPTION_ID
            state.HIDDEN = payload.payload.HIDDEN
            state.LAST_UPDT_USER = payload.payload.LAST_UPDT_USER
            state.LAST_UPDT_DATE = payload.payload.LAST_UPDT_DATE

        },
        setIsUpdated: (state, payload) => {
            state.isUpdated = payload.payload
        },
        changeTextParentCodeList: (state, payload) => {
            state[payload.payload.key] = payload.payload.value
        },
    },
})

// Action creators are generated for each case reducer function
export const { setParentCodeList, setIsUpdated, changeTextParentCodeList } = parentCodeList.actions

export default parentCodeList.reducer