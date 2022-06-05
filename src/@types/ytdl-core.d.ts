import ytdl from "ytdl-core";

export default ytdl;

declare module "ytdl-core" {
  export interface VideoDetails {
    thumbnails: ytdl.thumbnail[];
  }
}
