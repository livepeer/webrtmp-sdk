import { CastSession } from './CastSession';
declare function castViaWebSocket(secure: boolean, baseUrl: string, stream: MediaStream, streamKey: string): CastSession;
export default castViaWebSocket;
