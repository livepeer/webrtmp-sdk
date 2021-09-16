# webrtmp-sdk

JavaScript SDK for streaming media via RTMP from the Web.

## Installation

### CDN

Add the following script tag to the header of your HTML file:

```html
<script src="https://unpkg.com/@livepeer/webrtmp-sdk@0.1.0-rc/dist/index.js"></script>
```
### yarn

```sh
yarn add @livepeer/webrtmp-sdk
```

### npm
```sh
npm install @livepeer/webrtmp-sdk
```

## Import

If the library was loaded through an inline script, the API will be available as a global named `webRTMP`:
```js
const { Client } = webRTMP
```

If it was installed through npm or yarn:

```js
const { Client } = require('webrtmp-sdk')
```

## Usage

```js
const client = new Client({
  secure: true,
  baseUrl: 'origin.livepeer.com/webrtmp',
  transport: 'auto'
})

const streamKey = '{{STREAM_KEY}}'

async function start() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
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

start()
```

In order to stream through Livepeer, you are going to need a secret `streamKey`, which can be obtained by following these steps:

1) Create Livepeer Account at https://www.livepeer.com;
2) Go to Livepeer Dashboard;
3) Create a stream;
4) Grab the stream key and replace it in the example `{{STREAM_KEY}}` (note that if you have multiple users streaming you'll need a backend API to create the stream through Livepeer API and return stream key for each of them. Check out [Livepeer API Documentation](https://livepeer.com/docs/guides) on how to [create a stream](https://livepeer.com/docs/guides/start-live-streaming/create-a-stream));

For a full working example, checkout this awesome project: https://github.com/victorges/justcast.it

## Examples

The examples folder at the root of this repo contains two projects: [webrtmp-static](examples/webrtmp-static), implemented in HTML, CSS and JavaScript and [webrtmp-react](examples/webrtmp-react), implemented with React (created using [create-react-app](https://github.com/facebook/create-react-app)).

Check out this [webrtmp-static on CodePen](https://codepen.io/samuelmtimbo/pen/QWgaZGL).

## Contributing

Pull Requests are welcome.

## License

MIT

