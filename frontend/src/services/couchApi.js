import axios from "axios";

const defaultCouchUrl = "http://192.168.1.88:5984/";

export const instance = axios.create({
    baseURL: process.env.REACT_APP_COUCHDB_URL || defaultCouchUrl
});
export const userName =
    process.env.REACT_APP_COUCHDB_USER || "COUCHDB_USER";
export const userPassword =
    process.env.REACT_APP_COUCHDB_PASSWORD || "COUCHDB_PASSWORD";
export const config = {
    headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`${userName}:${userPassword}`),
    },
};
