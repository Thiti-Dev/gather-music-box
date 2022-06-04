//
// ─── HELPER ─────────────────────────────────────────────────────────────────────
//
export function shouldStringifyBeforeSave(element: any): boolean {
  return typeof element === "object" && element !== null;
}
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── LIST ───────────────────────────────────────────────────────────────────────
import { RedisInstance } from "../instance";
//
export async function getList<T = any>(
  key: string,
  parseEach: boolean = false
): Promise<any> {
  const list: Array<T> = await RedisInstance.getInstance().call(
    "LRANGE",
    key,
    0,
    -1
  );
  if (!parseEach) return list;
  return list.map((stringified) =>
    JSON.parse(stringified as unknown as string)
  );
}

export async function updateListAtSpecificIndex(
  key: string,
  index: number,
  updateElement: any
): Promise<void> {
  return await RedisInstance.getInstance().call(
    "LSET",
    key,
    index,
    shouldStringifyBeforeSave(updateElement)
      ? JSON.stringify(updateElement)
      : updateElement
  );
}

export async function addListItem(key: string, element: any): Promise<void> {
  await RedisInstance.getInstance().call(
    "RPUSH",
    key,
    shouldStringifyBeforeSave(element) ? JSON.stringify(element) : element
  );
}

export async function popFromList<T = any>(
  key: string,
  fromHead: boolean = true
): Promise<T> {
  return RedisInstance.getInstance().call(fromHead ? "LPUSH" : "RPUSH", key);
}

export async function getListCount(key: string): Promise<number> {
  return RedisInstance.getInstance().call("LLEN", key);
}
// ────────────────────────────────────────────────────────────────────────────────
