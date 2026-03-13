import { wsBaseUrl } from "../../../../services/baseApi";

var W3CWebSocket = require("websocket").w3cwebsocket;

export class webSocket {
    constructor(refSec, tagName, func) {
        this.refSec = refSec;
        this.tagName = tagName;
        this.func = func;
        this.client = false
    }

    openWs = function () {
        this.client = new W3CWebSocket(
            `${wsBaseUrl}/ws/live/last_data/${this.refSec}/`
        )

        this.client.onerror = function () {
            console.log("Connection Error");
        };

        this.client.onopen = () => {
            console.log("WebSocket Client Connected Angular");
            this.client.send(JSON.stringify([this.tagName]));
        };

        this.client.onclose = function () {
            console.log("WebSocket Client Closed");
        };
        this.client.onmessage = (e) => {
            const sendNumber = () => {
                if (this.client.readyState === this.client.OPEN) {
                    if (typeof e.data === "string") {
                        let data = JSON.parse(e.data);
                        this.func(data)
                        return data;
                    }
                }
            }
            sendNumber();
        };
    }

    closeWs = function () {
        if (this.client) this.client.close()
    }

}