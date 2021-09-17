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

export function isSupported(): boolean {
  const mimeType = getMimeType()
  const supported = mimeType.includes('h264')
  return supported
}

export { CastSession } from './CastSession'
export { WebSocketError } from './websocket'
