export const setFocus = () => ({
    type: "searchBar/setFocus",
    payload: true,
})

export const setBlur = () => ({
    type: "searchBar/setBlur",
    payload: false,
})

export const setText = (text) => ({
    type: "searchBar/setText",
    payload: text,
})