import { CastSession } from './CastSession'

async function iceHandshake(
  secure: boolean,
  baseUrl: string,
  streamKey: string,
  localDesc: RTCSessionDescription
) {
  const protocol = secure ? 'wss' : 'ws'

  const qsKey = streamKey.includes('://') ? 'rtmp' : 'streamKey'

  const answer = await fetch(
    `${protocol}://${baseUrl}/webrtc/offer?${qsKey}=${streamKey}`,
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

  const cast = new CastSession(() => {
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
      cast.emit('error', err)
    }
  }

  pc.onconnectionstatechange = () => {
    const state = pc.connectionState
    
    switch (state) {
      case 'connected':
        cast.emit('open')
        break
      case 'closed':
        cast.emit('closed')
        break
    }
  }

  const initPeerConn = async () => {
    try {
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
    } catch (err) {
      cast.emit('error', err)
    }
  }

  initPeerConn()

  return cast
}

export default castViaWebRTC
