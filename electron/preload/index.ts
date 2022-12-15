import { contextBridge } from "electron";
import contextBridgeAPI from "./contextBridgeAPI";

// const fs = require("fs");
contextBridge.exposeInMainWorld("electron", contextBridgeAPI);
