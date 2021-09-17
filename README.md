# webrtmp-sdk [![npm version](https://badge.fury.io/js/@livepeer%2Fwebrtmp-sdk.svg)](https://badge.fury.io/js/@livepeer%2Fwebrtmp-sdk)

JavaScript SDK for streaming media via RTMP from the Web. Originally designed
for [Livepeer.com](livepeer.com), but can be used for any other service by
running your own [webrtmp-server](https://github.com/livepeer/webrtmp-server).

## Installation

### CDN

Add the following script tag to the header of your HTML file:

```html
<script src="https://unpkg.com/@livepeer/webrtmp-sdk@0.1.2/dist/index.js"></script>
```

The API will be available as a global named `webRTMP`:

```js
const { Client } = webRTMP
```

### Package Managers

#### yarn

```sh
yarn add @livepeer/webrtmp-sdk
```

#### npm
```sh
npm install @livepeer/webrtmp-sdk
```

The API can then be imported as a regular module:

```js
const { Client } = require('webrtmp-sdk')
```

## Usage

In order to stream through Livepeer, you are going to need a secret `streamKey`,
which can be obtained by following these steps:

1) Create Livepeer Account at [livepeer.com](https://www.livepeer.com);
2) Go to the Livepeer [Streams Dashboard](https://www.livepeer.com/dashboard/streams)
3) Create a stream;
4) Grab the stream key and replace the `{{STREAM_KEY}}` in the example below.


```js
const client = new Client()

async function start() {
  const streamKey = '{{STREAM_KEY}}'

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

> **NOTE:** If you have multiple streaming users you will need a separate
> `streamKey` for each of them. So you should have a backend service
> programmatically create a stream through Livepeer API and return the
> `streamKey` for your front-end. Check out [Livepeer API
> Documentation](https://livepeer.com/docs/guides) on how to [get an API
> key](https://livepeer.com/docs/guides/start-live-streaming/api-key) and then
> how to [create a stream](https://livepeer.com/docs/guides/start-live-streaming/create-a-stream).

## Examples

The `examples` folder at the root of this repository contains two projects:
 - [webrtmp-static](examples/webrtmp-static), implemented in vanilla HTML, CSS
   and JavaScript. Check it out on
   [CodePen](https://codepen.io/samuelmtimbo/pen/QWgaZGL).
 - [webrtmp-react](examples/webrtmp-react), implemented with React (created
   using [create-react-app](https://github.com/facebook/create-react-app)).

For a full working example, check out [justcast.it](https://justcast.it) ([source
code](https://github.com/victorges/justcast.it)).

## Contributing

Pull Requests are always welcome!

## License

MIT

