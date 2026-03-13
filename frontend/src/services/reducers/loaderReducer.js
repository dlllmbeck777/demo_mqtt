import { createSlice } from '@reduxjs/toolkit'


export const loaderReducer = createSlice({
    name: 'loader',
    initialState: { loader: false },
    reducers: {
        setLoaderTrue(state, action) {
            return { ...state, loader: true };
        },
        setLoaderFalse(state, action) {
            return { ...state, loader: false };
        }
    }
})



export default loaderReducer.reducer