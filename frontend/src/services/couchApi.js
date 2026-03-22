import axios from "axios";

const browserHost =
    typeof window !== "undefined" && window.location?.hostname
        ? window.location.hostname
        : "localhost";
const defaultCouchUrl = `http://${browserHost}:5984/`;

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
