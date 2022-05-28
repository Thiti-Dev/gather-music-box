import { IConfig } from "../../src/interfaces/common.interfaces";

export const CONFIGS: IConfig = {
  gatherCredential: {
    apiKey: process.env.GATHER_API_KEY!,
    spaceId: process.env.GATHER_SPACE_ID!,
    mapId: process.env.GATHER_MAP_ID!,
  },
};
