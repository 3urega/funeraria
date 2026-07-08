import { getEnv } from "@/lib/config/env";

/** Funerària activa d'aquesta instància (una per desplegament). */
export function getFuneralHomeId(): string {
  return getEnv().FUNERAL_HOME_ID;
}
