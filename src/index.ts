import { CastSession } from './CastSession'
import castViaWebRTC from './webrtc'
import castViaWebSocket, { getMimeType } from './websocket'

export type Protocol = 'ws' | 'wrtc' | 'auto'

export class Client {
  private readonly secure: boolean
  private readonly baseUrl: string
  private readonly transport: Protocol

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

    let { transport } = this
    if (transport === 'auto') {
      transport = isSupported() ? 'ws' : 'wrtc'
    }
    if (transport === 'ws') {
      return castViaWebSocket(this.secure, this.baseUrl, stream, streamKey)
    } else if (transport === 'wrtc') {
      return castViaWebRTC(this.secure, this.baseUrl, stream, streamKey)
    } else {
      throw new Error(
        `Invalid transport; should be either 'ws', 'wrtc' or 'auto'.`
      )
    }
  }
}

// isSupported returns whether the default protocol works reliably in the
// current browser. Currently, the default protocol is WebSocket and is only
// supported in H.264 capable browsers. You can use the experimental `auto`
// protocol that switches to WebRTC in case H.264 is not available and ignore
// this function. WebRTC does not work reliably, do not use in production.
export function isSupported(): boolean {
  const mimeType = getMimeType()
  const supported = mimeType.includes('h264')
  return supported
}

export { CastSession } from './CastSession'
export { WebSocketError } from './websocket'
