import { createSlice } from '@reduxjs/toolkit'


export const searchBarReducer = createSlice({
    name: 'searchBar',
    initialState: {
        isFocus: false,
        text: "",
    },
    reducers: {
        setFocus(state, action) {
            return { ...state, isFocus: action.payload };
        },
        setBlur(state, action) {
            return { ...state, isFocus: action.payload };
        },
        setText(state, action) {
            return { ...state, text: action.payload };
        },
    }
})



export default searchBarReducer.reducer