import { EventEmitter } from 'events'

export class CastSession extends EventEmitter {
  constructor(private _onClose: () => void) {
    super()
  }

  close() {
    this._onClose()
  }
}
