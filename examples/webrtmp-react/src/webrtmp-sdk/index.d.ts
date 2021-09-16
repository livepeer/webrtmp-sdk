import { CastSession } from './CastSession';
export declare type Protocol = 'ws' | 'wrtc' | 'auto';
export declare class Client {
    private secure;
    private baseUrl;
    private transport;
    constructor(opt?: {
        secure?: boolean;
        baseUrl?: string;
        transport?: Protocol;
    });
    cast(stream: MediaStream, streamKey: string): CastSession;
}
export { CastSession } from './CastSession';
