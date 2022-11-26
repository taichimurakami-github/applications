import { ipcRenderer, contextBridge } from "electron";

// const fs = require("fs");
contextBridge.exposeInMainWorld("electron", {
  // <-- ここでつけた名前でひもづく。ここでは"window.electron"

  // json5: require("json5"),//npmで取得したライブラリを渡す時の例。レンダラーにそのまま渡す

  ipcRenderer: ipcRenderer, //ipcRendererも渡せるのでやり取りできる

  // getSetting: () => {// fsも読み込める。レンダリングプロセスにそのまま渡さず、functionにしてできることを制限したほうがセキュリアそう。。。
  //   const setting_path = 'c:/appSetting.json5';
  //   return fs.existsSync(setting_path) ? fs.readFileSync(setting_path, 'utf8') : '{}'
  // }
});
