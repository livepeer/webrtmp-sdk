# webrtmp-sdk

JavaScript SDK for streaming media via RTMP from the Web.

## Installation

### CDN

Add the following script tag to the header of your HTML file:

```html
<script src="https://unpkg.com/webrtmp-sdk"></script>
```
### yarn

```sh
yarn add webrtmp-sdk
```

### npm
```sh
npm install webrtmp-sdk
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

const streamKey = 'foo-bar-zaz-tar' // change to your secret stream key

async function start() {
  const stream = await getUserMedia({
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
```

## Examples

// TODO

## API

// TODO

## Contributing

Pull Requests are welcome.

## License

MIT

