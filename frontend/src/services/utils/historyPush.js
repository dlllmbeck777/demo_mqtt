import history from "../../routers/history";
import { setIsOpenConfirmation } from "../actions/confirmation/historyConfirmation";
export const myHistoryPush = (index, value) => {
    var pathnames = window.location.pathname.split("/").filter((x) => x);
    pathnames[index] = value.replaceAll("/", "U+002F")
    var routeTo = "";
    pathnames.map(e => {
        routeTo += `/${e}`
    });
    history.push(routeTo);
}


export const confirmationPushHistory = () => (dispatch, getState) => {
    const confirmation = getState().historyConfirmation
    if (confirmation.isActive) {
        dispatch(setIsOpenConfirmation(true))
    } else {
        confirmation.gofunction();
    }
}