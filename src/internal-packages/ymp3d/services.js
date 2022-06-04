const ytdl = require('ytdl-core')

// video info
const getVideoInfo = async (url) => {
    try {
        let info = await ytdl.getInfo(url)
        let videoTitle = info.videoDetails.title
        let artist = ''
        let title = 'Unknown'

        if (videoTitle.indexOf('-') > -1) {
            let temp = videoTitle.split('-')
            if (temp.length >= 2) {
                artist = temp[0].trim();
                title = temp[1].trim();
            }
        } else {
            title = videoTitle
        }

        return {
            id: info.videoDetails.videoId,
            seconds: info.videoDetails.lengthSeconds,
            thumbnail: info.videoDetails.thumbnails[0].url,
            name: info.videoDetails.title,
            title: title,
            artist: artist
        }
    } catch (e) {
        console.log(e)
    }
}

// progress percentage
const progressPercent = (currentTimeMark, lengthSeconds) => {
    try {
        const convertToSeconds = (currentTimeMark) => {
            const [hours, minutes, seconds] = currentTimeMark.split(':');
            return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds)
        }

        const currentLengthSeconds = convertToSeconds(currentTimeMark)
        const percent = ((currentLengthSeconds / lengthSeconds) * 100).toFixed(2)

        if (percent > 100) {
            return 100
        } else {
            return percent
        }
    } catch (e) {
        return 0
    }
}

module.exports = {
    getVideoInfo: getVideoInfo,
    progressPercent: progressPercent
}