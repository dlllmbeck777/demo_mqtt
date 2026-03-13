import { createSlice } from '@reduxjs/toolkit'

export const codeListChildReducer = createSlice({
    name: 'codeListChild',
    initialState: {
        currentChild: "",
        rowId: "",
        index: -3,
        lastItem: "",
        codeListItems: [],
        refreshTreeMenu: false
    },
    reducers: {
        setRefreshTreeMenu: (state, payload) => {
            state.refreshTreeMenu = !state.refreshTreeMenu
        },
        setCodeListChild: (state, payload) => {
            state.currentChild = payload.payload.currentChild
        },
        setRowId: (state, payload) => {
            state.rowId = payload.payload.rowId
        },
        setIndex: (state, payload) => {
            if (payload.payload.index === -2) {
                state.index = -2
                state.currentChild = "new"
                return;
            }
            if (payload.payload.index === -3) {
                state.index = -3
                state.currentChild = ""
                return;
            }
            if (payload.payload.index >= 0) {
                if (payload.payload.index < state.lastItem) {
                    state.index = payload.payload.index
                }
                else {
                    state.index = 0
                }
                state.rowId = state.codeListItems[state.index].ROW_ID
                state.currentChild = state.codeListItems[state.index].CODE
            }
            else {
                state.index = state.lastItem - 1
                state.rowId = state.codeListItems[state.index].ROW_ID
                state.currentChild = state.codeListItems[state.index].CODE
            }
        },
        setLastItemIndex: (state, payload) => {
            state.lastItem = payload.payload
        },
        setCodeListItems: (state, payload) => {
            state.codeListItems = [...new Set([...state.codeListItems, payload.payload])]
            //    state.lastItem = state.codeListItems.length
        },
        cleanCodeListItems: (state, payload) => {
            state.codeListItems = []

        },

    },
})

// Action creators are generated for each case reducer function
export const { setRefreshTreeMenu, setCodeListChild, setRowId, setIndex, setLastItemIndex, setCodeListItems, cleanCodeListItems } = codeListChildReducer.actions

export default codeListChildReducer.reducer