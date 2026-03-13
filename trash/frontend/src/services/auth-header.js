export default function authHeader() {
    const user = JSON.parse(localStorage.getItem("user"));

    return { Authorization: "Token " + user.token };


}