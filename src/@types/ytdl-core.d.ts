import { VideoDetails, thumbnail } from "ytdl-core";
declare module "ytdl-core" {
  export interface VideoDetails {
    thumbnails: thumbnail[];
  }
}
