import { CastSession } from './CastSession'

export class WebSocketError extends Error {
  constructor(public code: number, message?: string) {
    super(message)
  }
}

export function getMimeType(): string | null {
  const types = [
    'video/webm;codecs=h264',
    'video/webm',
    'video/webm;codecs=opus',
    'video/webm;codecs=vp8',
    'video/webm;codecs=daala',
    'video/mpeg',
    'video/mp4',
  ]

  let mimeType: string | null = null
  for (const type of types) {
    const supported = MediaRecorder.isTypeSupported(type)
    if (supported) {
      mimeType = type
      break
    }
  }

  return mimeType
}

function querystring(params: Record<string, any>) {
  const escape = encodeURIComponent
  const raw = Object.keys(params)
    .filter((k) => !!params[k])
    .map((k) => escape(k) + '=' + escape(params[k].toString()))
    .join('&')
  return raw.length === 0 ? '' : '?' + raw
}

function connect(
  secure: boolean,
  baseUrl: string,
  streamKey: string,
  mimeType: string
) {
  const protocol = secure ? 'wss' : 'ws'

  const qsKey = streamKey.includes('://') ? 'rtmp' : 'streamKey'

  const query = querystring({ [qsKey]: streamKey, mimeType })

  const url = `${protocol}://${baseUrl}/ws${query}`

  const socket = new WebSocket(url)

  return socket
}

function stop_recording(media_recorder: MediaRecorder, socket: WebSocket) {
  stop_media_recorder(media_recorder)

  socket.close(1000)
}

const MEDIA_RECORDER_T = 2000

function start_media_recorder(media_recorder: MediaRecorder): void {
  if (media_recorder.state === 'recording') {
    return
  }
  media_recorder.start(MEDIA_RECORDER_T)
}

function stop_media_recorder(media_recorder: MediaRecorder): void {
  if (media_recorder.state === 'inactive') {
    return
  }
  media_recorder.ondataavailable = null
  media_recorder.stop()
}

function castViaWebSocket(
  secure: boolean,
  baseUrl: string,
  stream: MediaStream,
  streamKey: string
): CastSession {
  if (!window.MediaRecorder) {
    throw new Error('Media Recorder API is not supported in this browser.')
  }

  const mimeType = getMimeType()

  if (!mimeType) {
    throw new Error('Media Recorder does not support any valid MIME type.')
  }

  const socket = connect(secure, baseUrl, streamKey, mimeType)

  const recorder = new MediaRecorder(stream, {
    mimeType,
    audioBitsPerSecond: 128 * 1000,
    videoBitsPerSecond: 3 * 1024 * 1024,
  })

  const cast = new CastSession(() => stop_recording(recorder, socket))

  let connected = false

  recorder.ondataavailable = function (event) {
    const { data } = event

    if (connected) {
      socket.send(data)
    }
  }

  socket.addEventListener('open', () => {
    connected = true

    start_media_recorder(recorder)

    cast.emit('open')
  })

  socket.addEventListener('close', ({ code, reason }) => {
    connected = false

    stop_recording(recorder, socket)

    if (code !== 1000) {
      cast.emit('error', new WebSocketError(code, 'abnormal websocket closure'))
    }

    cast.emit('close')
  })

  return cast
}

export default castViaWebSocket
