import { EventEmitter } from 'events'
import { CastSession } from './CastSession'

async function iceHandshake(
  secure: boolean,
  baseUrl: string,
  streamKey: string,
  localDesc: RTCSessionDescription
) {
  const protocol = secure ? 'https' : 'http'

  const qsKey = streamKey.includes('://') ? 'rtmp' : 'streamKey'

  const answer = await fetch(
    `${protocol}://${baseUrl}/wrtc/offer?${qsKey}=${streamKey}`,
    {
      method: 'POST',
      body: JSON.stringify(localDesc),
      headers: {
        ['content-type']: 'application/json',
      },
    }
  )

  if (answer.status !== 200) {
    throw new Error(`Error response from server: ${answer.status}`)
  }

  const sessionInit = await answer.json()

  return new RTCSessionDescription(sessionInit)
}

function castViaWebRTC(
  secure: boolean,
  baseUrl: string,
  stream: MediaStream,
  streamKey: string
): CastSession {
  const pc = new RTCPeerConnection({
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
    ],
  })

  const emitter = new EventEmitter()
  const cast = new CastSession(emitter, () => {
    pc.close()
  })

  stream.getTracks().forEach((track) => pc.addTrack(track, stream))

  // pc.oniceconnectionstatechange = () => {}

  pc.onicegatheringstatechange = async () => {
    if (pc.iceGatheringState !== 'complete') {
      return
    }

    try {
      const remoteDesc = await iceHandshake(
        secure,
        baseUrl,
        streamKey,
        pc.localDescription
      )

      if (pc.signalingState !== 'closed') {
        await pc.setRemoteDescription(remoteDesc)
      }
    } catch (err) {
      emitter.emit('error', err)
    }
  }

  pc.onconnectionstatechange = () => {
    const state = pc.connectionState

    switch (state) {
      case 'connected':
        emitter.emit('open')
        break
      case 'closed':
        emitter.emit('closed')
        break
      case 'failed':
        emitter.emit('error', new Error('WebRTC connection failed.'))
        break
    }
  }

  const initPeerConn = async () => {
    try {
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
    } catch (err) {
      emitter.emit('error', err)
    }
  }

  initPeerConn()

  return cast
}

export default castViaWebRTC
