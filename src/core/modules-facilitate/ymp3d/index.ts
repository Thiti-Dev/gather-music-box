import Ymp3 from "ymp3d";
import { IDownloadProgress } from "./interfaces";

export async function downloadMP3FromYoutubeURL(
  ytURL: string,
  outputLocation: string,
  onFinish?: (filePath: string) => any,
  onProgress?: (progress: IDownloadProgress) => any
): Promise<any> {
  const y = new Ymp3();

  y.on<IDownloadProgress>("progress", function (progress) {
    onProgress?.(progress);
  });

  y.on("finish", function (filePath) {
    onFinish?.(filePath);
  });

  return await y.Download(ytURL, outputLocation);
}
