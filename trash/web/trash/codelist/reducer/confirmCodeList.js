import { createSlice } from '@reduxjs/toolkit'

export const confirmCodeList = createSlice({
    name: 'confirmCodeList',
    initialState: {
        dataGridItems: {},
    },
    reducers: {
        setConfirmDataGridItems: (state, payload) => {
            state.dataGridItems[payload.payload.key] = payload.payload.value
        },
        cleanConfirmDataGridItems: (state) => {
            state.dataGridItems = {}
        },


    },
})

// Action creators are generated for each case reducer function
export const { setConfirmDataGridItems, cleanConfirmDataGridItems } = confirmCodeList.actions

export default confirmCodeList.reducer