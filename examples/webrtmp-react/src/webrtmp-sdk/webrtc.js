"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const CastSession_1 = require("./CastSession");
function iceHandshake(secure, baseUrl, streamKey, localDesc) {
    return __awaiter(this, void 0, void 0, function* () {
        const protocol = secure ? 'wss' : 'ws';
        const qsKey = streamKey.includes('://') ? 'rtmp' : 'streamKey';
        const answer = yield fetch(`${protocol}://${baseUrl}/webrtc/offer?${qsKey}=${streamKey}`, {
            method: 'POST',
            body: JSON.stringify(localDesc),
            headers: {
                ['content-type']: 'application/json',
            },
        });
        if (answer.status !== 200) {
            throw new Error(`Error response from server: ${answer.status}`);
        }
        const sessionInit = yield answer.json();
        return new RTCSessionDescription(sessionInit);
    });
}
function castViaWebRTC(secure, baseUrl, stream, streamKey) {
    const pc = new RTCPeerConnection({
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302',
            },
        ],
    });
    const cast = new CastSession_1.CastSession(() => {
        pc.close();
    });
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    // pc.oniceconnectionstatechange = () => {}
    pc.onicegatheringstatechange = () => __awaiter(this, void 0, void 0, function* () {
        if (pc.iceGatheringState !== 'complete') {
            return;
        }
        try {
            const remoteDesc = yield iceHandshake(secure, baseUrl, streamKey, pc.localDescription);
            if (pc.signalingState !== 'closed') {
                yield pc.setRemoteDescription(remoteDesc);
            }
        }
        catch (err) {
            cast.emit('error', err);
        }
    });
    pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        switch (state) {
            case 'connected':
                cast.emit('open');
                break;
            case 'closed':
                cast.emit('closed');
                break;
        }
    };
    const initPeerConn = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const offer = yield pc.createOffer();
            yield pc.setLocalDescription(offer);
        }
        catch (err) {
            cast.emit('error', err);
        }
    });
    initPeerConn();
    return cast;
}
exports.default = castViaWebRTC;
//# sourceMappingURL=webrtc.js.map