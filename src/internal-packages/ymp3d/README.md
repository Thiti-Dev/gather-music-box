# ymp3d
YouTube mp3 downloader

uses fluet-ffmpeg, ytld-core

ffmpeg is not needed as ffmpeg-installer is used

### My Telegram bot works on it - @YouTubeTmp3Bot (Ymp3 Bot)

# install

```javascript
npm install ymp3d
```

# usage
```javascript
const Ymp3 = require('ymp3d')

const y = new Ymp3()

y.Download('https://www.youtube.com/watch?v=vBGRz6s-1UA')
    .then(videoInfo => console.log(videoInfo))
    .catch(e => console.log(e))

y.on('start',  function (commandLine) {
    console.log(commandLine)
})

y.on('progress',  function (progress) {
    console.log(progress)
})

y.on('finish',  function (fileName) {
    console.log(fileName)
})

y.on('error', function (e) {
    console.log(e)
})
```
# In order to specify your name/path to the file (default is the title of the video):

```javascript

y.Download('https://www.youtube.com/watch?v=vBGRz6s-1UA', 'your/path/filename.mp3')
    .then(videoInfo => console.log(videoInfo))
    .catch(e => console.log(e))
```

# test 
```javascript
npm run test
```
