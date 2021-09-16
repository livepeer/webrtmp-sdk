"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CastSession = void 0;
const events_1 = require("events");
class CastSession extends events_1.EventEmitter {
    constructor(_onClose) {
        super();
        this._onClose = _onClose;
    }
    close() {
        this._onClose();
    }
}
exports.CastSession = CastSession;
//# sourceMappingURL=CastSession.js.map