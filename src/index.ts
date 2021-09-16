import { CastSession } from './CastSession'
import castViaWebRTC from './webrtc'
import castViaWebSocket from './websocket'

export type Protocol = 'ws' | 'wrtc' | 'auto'

export class Client {
  private secure: boolean = false
  private baseUrl: string = 'origin.livepeer.com/webrtmp'
  private transport: Protocol = 'ws'

  constructor(
    opt: {
      secure?: boolean
      baseUrl?: string
      transport?: Protocol
    } = {}
  ) {
    const {
      secure = true,
      baseUrl = 'origin.livepeer.com/webrtmp',
      transport = 'ws',
    } = opt

    this.secure = secure
    this.baseUrl = baseUrl
    this.transport = transport
  }

  cast(stream: MediaStream, streamKey: string): CastSession {
    if (!streamKey) {
      throw new Error('Invalid streamKey.')
    }

    if (this.transport === 'ws' || this.transport === 'auto') {
      return castViaWebSocket(this.secure, this.baseUrl, stream, streamKey)
    } else if (this.transport === 'wrtc') {
      return castViaWebRTC(this.secure, this.baseUrl, stream, streamKey)
    } else {
      throw new Error(
        `Invalid transport; should be either 'ws', 'wrtc' or 'auto'.`
      )
    }
  }
}

export { CastSession } from './CastSession'
