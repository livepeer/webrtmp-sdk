"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CastSession = exports.Client = void 0;
const webrtc_1 = require("./webrtc");
const websocket_1 = require("./websocket");
class Client {
    constructor(opt = {}) {
        this.secure = false;
        this.baseUrl = 'origin.livepeer.com/webrtmp';
        this.transport = 'ws';
        const { secure = true, baseUrl = 'origin.livepeer.com/webrtmp', transport = 'ws', } = opt;
        this.secure = secure;
        this.baseUrl = baseUrl;
        this.transport = transport;
    }
    cast(stream, streamKey) {
        if (!streamKey) {
            throw new Error('Invalid streamKey.');
        }
        if (this.transport === 'ws' || this.transport === 'auto') {
            return (0, websocket_1.default)(this.secure, this.baseUrl, stream, streamKey);
        }
        else if (this.transport === 'wrtc') {
            return (0, webrtc_1.default)(this.secure, this.baseUrl, stream, streamKey);
        }
        else {
            throw new Error(`Invalid transport; should be either 'ws', 'wrtc' or 'auto'.`);
        }
    }
}
exports.Client = Client;
var CastSession_1 = require("./CastSession");
Object.defineProperty(exports, "CastSession", { enumerable: true, get: function () { return CastSession_1.CastSession; } });
//# sourceMappingURL=index.js.map