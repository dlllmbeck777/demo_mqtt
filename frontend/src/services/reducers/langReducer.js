import { createSlice } from '@reduxjs/toolkit'


export const langReducer = createSlice({
    name: 'language',
    initialState: { lang: "English", cultur: "en-US", languages: [] },
    reducers: {
        setLanguages(state, action) {
            return { ...state, languages: action.payload };
        },
        changeLang(state, action) {
            return { ...state, cultur: action.payload };
        },
        changeLangs(state, action) {
            return { ...state, lang: action.payload };
        }
    }
})



export default langReducer.reducer