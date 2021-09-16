import { useEffect, useRef } from 'react'
import './App.css'
import { Client } from '@livepeer/webrtmp-sdk'

function App() {
  const inputEl = useRef(null)

  const videoEl = useRef(null)

  let stream

  useEffect(async () => {
    videoEl.current.volume = 0

    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    videoEl.current.srcObject = stream
    videoEl.current.play()
  })

  const onButtonClick = async () => {
    const streamKey = inputEl.current.value

    if (!stream) {
      alert('Video stream was not started.')
    }

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
    })

    session.on('close', () => {
      console.log('Stream stopped.')
    })

    session.on('error', (err) => {
      console.log('Stream error.', err.message)
    })
  }

  return (
    <div className="App">
      <input
        className="App-input"
        ref={inputEl}
        type="text"
        placeholder="streamKey"
      />
      <video className="App-video" ref={videoEl} />
      <button className="App-button" onClick={onButtonClick}>
        Start
      </button>
    </div>
  )
}

export default App
