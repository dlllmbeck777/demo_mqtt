import { createSlice } from '@reduxjs/toolkit'

export const confirmation = createSlice({
    name: 'confirmation',
    initialState: {
        isOpen: false,
        agreefunction: () => { },
        title: "",
        body: "",
        extraBtn: false,
        extraBtnText: "",
        extrafunction: () => { },
    },
    reducers: {
        cleanConfirmationState: (state) => {
            state.agreefunction = () => { }
            state.title = ""
            state.body = ""
            state.isOpen = false
            state.extraBtn = false
            state.extraBtnText = ""
            state.extrafunction = () => { }
        },
        setConfirmation: (state, payload) => {
            state.isOpen = true
            state.title = payload.payload.title
            state.body = payload.payload.body
            state.agreefunction = payload.payload.agreefunction
        },
        setExtraBtn: (state, payload) => {
            state.extraBtn = true
            state.extraBtnText = payload.payload.extraBtnText
            state.extrafunction = payload.payload.extrafunction
        },
    },
})

// Action creators are generated for each case reducer function
export const { cleanConfirmationState, setConfirmation, setExtraBtn } = confirmation.actions

export default confirmation.reducer