import $ from "jquery"
import ProfileService from "../api/profile"
import CodelistService from "../api/codeList"
export const changeTheme = (theme) => async (dispatch, getState) => {
    const CULTURE = getState().lang.cultur
    $("body").removeClass()
    $("body").addClass(localStorage.getItem('theme') ? `${localStorage.getItem('theme')}` : "theme-light")
    dispatch({
        type: "theme/changeTheme",
        payload: theme,
    })

    try {
        let val = await CodelistService.getByParentHierarchy({
            CULTURE,
            CODE: theme.toUpperCase(),
        });
        dispatch({
            type: "theme/changeThemeText",
            payload: val?.data?.[0]?.CODE_TEXT,
        })
    } catch (err) {
        console.log(err);
    }
}

export const applyTheme = () => async dispatch => {
    try {
        let res = await ProfileService.loadProfileSettings();
        $("body").removeClass()
        $("body").addClass(`theme-${res.data[0].thema}`)
        dispatch({
            type: "theme/changeTheme",
            payload: `${res.data[0].thema}`
        })
    } catch {
        $("body").removeClass()
        $("body").addClass(localStorage.getItem('theme') ? `${localStorage.getItem('theme')}` : "theme-light")
    }

}