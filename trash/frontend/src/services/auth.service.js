
import axios from "axios";


const register = (first_name, last_name, email, password) => {
    return axios.post("http://192.168.1.88:8000/api/v1/accounts/register/", {
        first_name,
        last_name,
        email,
        password,
    });
};

const login = (email, password) => {
    return axios
        .post("http://192.168.1.88:8000/api/v1/accounts/login/", {
            email,
            password,
        })
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user");
};


const changePassword = (old_password, new_password1, new_password2) => {
    return axios.patch()
};

export default {
    register,
    login,
    logout,
    changePassword
};