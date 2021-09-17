import { EventEmitter, Listener } from 'events'

export class CastSession extends EventEmitter {
  constructor(private _closeFunc: () => void) {
    super()
  }

  on(type: 'open', listener: () => void): this
  on(type: 'close', listener: () => void): this
  on(type: 'error', listener: (err: Error) => void): this
  on(type: 'open' | 'close' | 'error', listener: Listener): this {
    return super.on(type, listener)
  }

  close() {
    this._closeFunc()
  }
}
