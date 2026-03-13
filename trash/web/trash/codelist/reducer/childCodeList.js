import { createSlice } from '@reduxjs/toolkit'

export const childCodeList = createSlice({
    name: 'childCodeList',
    initialState: {
        dataGridItems: {},
        changedItems: [],
        deletedItems: {},
        newItems: {},
        loading: true,
        refreshDataGrid: true,
    },
    reducers: {
        setRefreshDataGrid: (state) => {
            state.refreshDataGrid = !state.refreshDataGrid
        },
        setDataGridItems: (state, payload) => {
            state.dataGridItems[payload.payload.key] = payload.payload.value
        },
        setNewItem: (state, payload) => {
            state.dataGridItems[payload.payload.uuid] = payload.payload.value
            state.newItems[payload.payload.uuid] = payload.payload.value
        },
        setDeletedItem: (state, payload) => {
            console.log(payload.payload.value);
            state.deletedItems[payload.payload.key] = payload.payload.value
            delete state.dataGridItems[payload.payload.key];
        },
        cleanDataGridItems: (state) => {
            state.dataGridItems = {}
            state.changedItems = []
            state.deletedItems = {}
            state.newItems = {}
        },
        changeDataGridItems: (state, payload) => {
            state.dataGridItems[payload.payload.id][payload.payload.field] = payload.payload.value;
            state.changedItems = [...new Set([...state.changedItems, payload.payload.id])]
        },
        setLoading: (state, payload) => {
            state.loading = payload.payload
        },

    },
})

// Action creators are generated for each case reducer function
export const { setRefreshDataGrid, cleanDataGridItems, setDataGridItems, setDeletedItem, setNewItem, changeDataGridItems, setLoading } = childCodeList.actions

export default childCodeList.reducer