import Ymp3 from "ymp3d";
import { IDownloadProgress } from "./interfaces";

export function downloadMP3FromYoutubeURL(
  ytURL: string,
  outputLocation: string,
  onFinish?: (fileName: string) => any,
  onProgress?: (progress: IDownloadProgress) => any
): any {
  const y = new Ymp3();

  y.Download(ytURL, outputLocation)
    .then((videoInfo) => console.log(videoInfo))
    .catch((e) => console.log(e));

  y.on<IDownloadProgress>("progress", function (progress) {
    onProgress?.(progress);
  });

  y.on("finish", function (fileName) {
    onFinish?.(fileName);
  });
}
