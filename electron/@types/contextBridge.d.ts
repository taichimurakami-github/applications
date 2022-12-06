import { TAppAutoUpdateProcessStatus } from "./main";
import contextBridgeAPI from "../preload/contextBridgeAPI";

export type TAppAutoUpdateProcessContent = {
  status: TAppAutoUpdateProcessStatus;
  message: string;
};

export type TContextBridgeAPI = typeof contextBridgeAPI;
