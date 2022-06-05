import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

const progressPercent: (
  currentTimeMark: string,
  lengthSeconds: string
) => number = (currentTimeMark: string, lengthSeconds: string) => {
  try {
    const convertToSeconds = (currentTimeMark: string) => {
      const [hours, minutes, seconds] = currentTimeMark.split(":");
      return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
    };

    const currentLengthSeconds = convertToSeconds(currentTimeMark);
    const percent = ((currentLengthSeconds / +lengthSeconds) * 100).toFixed(2);

    if (+percent > 100) {
      return 100;
    } else {
      return +percent;
    }
  } catch (e) {
    return 0;
  }
};

export function startDownloadProcess(
  vidDetail: ytdl.VideoDetails,
  onFinish?: (fileName: string) => any,
  onProgress?: (percent: number) => any,
  storePath: string = "public/temp"
): any {
  const { videoId, lengthSeconds } = vidDetail;
  let stream = ytdl(videoId, {
    quality: "highestaudio",
    filter: "audioonly",
  });

  let start = Date.now();
  const fileName: string = `${videoId}.mp3`;
  ffmpeg(stream)
    .audioBitrate(128)
    .on("progress", (p) => {
      const percent: number = progressPercent(
        p.timemark,
        vidDetail.lengthSeconds
      );
      onProgress?.(percent);
    })
    .on("end", () => {
      console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
      onFinish?.(fileName);
    })
    .on("error", function (err) {
      console.log(err);
    })
    .save(`${process.env.PWD}/${storePath}/${fileName}`); // .save() must be here otherwise the progress event will not be triggered anymore after the first use
}

export async function getVideoInfoFromURL(
  url: string
): Promise<ytdl.videoInfo> {
  return ytdl.getInfo(url);
}
