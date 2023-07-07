// preload.js

const { ipcRenderer, contextBridge } = require("electron");
const {
  constructFileFromLocalFileData,
} = require("get-file-object-from-local-path");

contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);

contextBridge.exposeInMainWorld("electronAPI", {
  preloadDirectory: async () => {
    const [data, dir, error] = await ipcRenderer.invoke("preloadDirectory");
    if (!data) {
      return [data, undefined, error];
    }
    return [
      data.map((f) => {
        // console.log(f);
        return constructFileFromLocalFileData(f);
      }),
      // data,
      dir,
      error,
    ];
  },
  checkUpdate: (f) => {
    ipcRenderer.on("getUpdateInfo", f);
    ipcRenderer.send("checkUpdate");
  },
  updating: (url, f) => {
    ipcRenderer.on("updatingProgress", f);
    ipcRenderer.send("updating", url);
  },
});

// 所有Node.js API都可以在預加載過程中使用。
// 它擁有與Chrome擴展一樣的沙盒。
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
