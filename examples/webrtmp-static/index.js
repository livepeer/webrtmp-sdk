const input = document.getElementById('input')
const video = document.getElementById('video')
const button = document.getElementById('button')

video.volume = 0

let stream

const { Client } = webRTMP

async function setup() {
  stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  })

  video.srcObject = stream
  video.play()
}

setup()

button.onclick = () => {
  if (!stream) {
    alert('Video stream was not started.')
  }

  const streamKey = input.value

  if (!streamKey) {
    alert('Invalid streamKey.')
    return
  }

  const client = new Client({
    baseUrl: 'fly.justcast.it'
  })

  const session = client.cast(stream, streamKey)

  session.on('open', () => {
    console.log('Stream started.')
    alert('Stream started; visit Livepeer Dashboard.')
  })

  session.on('close', () => {
    console.log('Stream stopped.')
  })

  session.on('error', (err) => {
    console.log('Stream error.', err.message)
  })
}