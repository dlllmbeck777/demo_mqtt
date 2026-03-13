import { createSlice } from '@reduxjs/toolkit'


export const themeReducer = createSlice({
    name: 'theme',
    initialState: { theme: "light", themeText: "Light" },
    reducers: {
        changeTheme(state, action) {
            return { ...state, theme: action.payload };
        },
        changeThemeText(state, action) {
            return { ...state, themeText: action.payload };
        }
    }
})



export default themeReducer.reducer