import { musicControllerTick } from "./tasks/music-controller-tick";

export function initiateCronProcesses(): void {
  musicControllerTick();
}
