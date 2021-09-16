import { EventEmitter } from 'events';
export declare class CastSession extends EventEmitter {
    private _onClose;
    constructor(_onClose: () => void);
    close(): void;
}
