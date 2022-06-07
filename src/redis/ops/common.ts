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
): Promise<T> {
  const list: Array<T> = await RedisInstance.getInstance().call(
    "LRANGE",
    key,
    0,
    -1
  );
  if (!parseEach) return list as unknown as T;
  return list.map((stringified) =>
    JSON.parse(stringified as unknown as string)
  ) as unknown as T;
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

export async function getListAtSpecificIndex<T = any>(
  key: string,
  index: number,
  parse: boolean = false
): Promise<T> {
  const item = await RedisInstance.getInstance().call("LINDEX", key, index);
  if (!parse) return item;
  return JSON.parse(item);
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
  return RedisInstance.getInstance().call(fromHead ? "LPOP" : "RPOP", key);
}

export async function getListCount(key: string): Promise<number> {
  return RedisInstance.getInstance().call("LLEN", key);
}

export async function removeAllListItem(key: string): Promise<void> {
  return RedisInstance.getInstance().call("DEL", key);
}

export async function findListItemIndexAndItsElement<T = any>(
  key: string,
  criteria: (listData: T) => boolean,
  parse: boolean = false
): Promise<[number, T | null]> {
  const lists: Array<T> = await getList(key, parse);
  const index = lists.findIndex(criteria);
  if (index === -1) return [index, null];
  return [index, lists[index]];
}
// ────────────────────────────────────────────────────────────────────────────────
