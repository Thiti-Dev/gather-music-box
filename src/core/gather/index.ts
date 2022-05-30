import { IConfig } from "../../interfaces/common.interfaces";
import fetch, { Response } from "node-fetch";
import { URLSearchParams } from "url";
import {
  GATHER_GET_MAP_URL,
  GATHER_SET_MAP_URL,
  PREDEFINED_GATHER_SOUND_EMITTER_OBJ_STRINGIFIED,
} from "../../constants/vars";
export async function getMapContent(
  gatherConf: IConfig["gatherCredential"]
): Promise<any> {
  const params: URLSearchParams = new URLSearchParams();
  params.append("apiKey", gatherConf.apiKey);
  params.append("spaceId", gatherConf.spaceId);
  params.append("mapId", gatherConf.mapId);
  const response: Response = await fetch(
    `${GATHER_GET_MAP_URL}?` + params.toString(),
    {
      method: "GET",
    }
  );
  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function setMapContent(
  gatherConf: IConfig["gatherCredential"],
  mapContent: any
): Promise<void> {
  const response: Response = await fetch(GATHER_SET_MAP_URL, {
    method: "POST",
    body: JSON.stringify({
      ...gatherConf,
      mapContent,
    }),
    headers: { "Content-Type": "application/json" },
  });
  const jsonResponse: string = await response.text();
  console.log("[setMapContent]: " + jsonResponse);
}

export async function changeMusic(
  gatherConf: IConfig["gatherCredential"],
  musicURL: string,
  which: (target: any) => boolean
): Promise<any> {
  const mapContent = await getMapContent(gatherConf);
  let targetObj = mapContent.objects.find(which);
  let pushLater: boolean = false;
  if (!targetObj) {
    console.log("found obj got removed -> creating a new one");
    targetObj = JSON.parse(PREDEFINED_GATHER_SOUND_EMITTER_OBJ_STRINGIFIED);
    pushLater = true;
  }
  targetObj.sound.src = musicURL + "?" + new Date().getTime();
  targetObj.sound.loop = false;
  targetObj.sound.volume = 0.1;
  targetObj.sound.maxDistance = 12;
  console.log("[changeMusic]: found targetObj updating instance");
  pushLater && mapContent.objects.push(targetObj);
  await setMapContent(gatherConf, mapContent);
}
