import { EventEmitter, Listener } from 'events'

export class CastSession {
  constructor(private _emitter: EventEmitter, private _closeFunc: () => void) {}

  on(type: 'open', listener: () => void): this
  on(type: 'close', listener: () => void): this
  on(type: 'error', listener: (err: Error) => void): this
  on(type: string, listener: Listener): this {
    this._emitter.on(type, listener)
    return this
  }

  off(type: string, listener: Listener): this {
    this._emitter.off(type, listener)
    return this
  }

  close() {
    this._closeFunc()
  }
}
