import { CastSession } from './CastSession';
declare function castViaWebRTC(secure: boolean, baseUrl: string, stream: MediaStream, streamKey: string): CastSession;
export default castViaWebRTC;
