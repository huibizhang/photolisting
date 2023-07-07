// main.js

const {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  dialog,
  session,
} = require("electron");
const fs = require("fs");
const path = require("path");
const { LocalFileData } = require("get-file-object-from-local-path");
const exec = require("child_process").exec;
const { default: axios } = require("axios");

let readinPath = undefined;

function createWindow() {
  // 創建瀏覽器窗口
  const mainWindow = new BrowserWindow({
    width: 350,
    height: 390,
    icon: path.join(__dirname, "/public/icon.ico"),
    // frame: false,
    skipTaskbar: false,
    transparent: false,
    backgroundColor: "#1C1917",

    resizable: true,
    maximizable: true,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      experimentalFeatures: true,
      nodeIntegration: true,
    },

    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "rgba(28,25,23,1)",
      // color: "transparent",
      symbolColor: "white",
    },
  });

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Create a window that fills the screen's available work area.
  let wWidth = Math.round(width * 0.6);
  let wHieght = Math.round(height * 0.8);
  mainWindow.setSize(wWidth, wHieght, true);
  mainWindow.setPosition(
    Math.round((width - wWidth) / 2),
    Math.round((height - wHieght) / 2),
    true
  );

  let appPath = app.getAppPath();

  ipcMain.on("selectDir", async (event, arg) => {
    try {
      const paths = await dialog.showOpenDialog({
        title: "選擇相片來源資料夾",
        properties: ["openDirectory"],
      });
      if (!paths.canceled) {
        readinPath = paths.filePaths[0];
      }

      event.returnValue = !paths.canceled;
    } catch (e) {
      console.log(e);
      event.returnValue = false;
    }
  });

  ipcMain.handle("preloadDirectory", async (event) => {
    try {
      // const d = "C:\\Users\\narut\\Desktop\\test";

      // console.log(appPath);

      console.log(`readinPath = ${readinPath}`);
      console.log(`appPath = ${appPath}`);

      const d = readinPath ?? appPath;
      const fileList = fs.readdirSync(d);
      const files = [];

      // console.log(fileList);

      for (filePath of fileList)
        if (filePath.split(".").pop() === "jpg")
          files.push(new LocalFileData(d + "\\" + filePath));

      if (files.length > 0) return [files, d];
      else return [null, undefined, "no photo"];
    } catch (e) {
      console.log(e);
      return [null, e];
    }
  });

  ipcMain.on("save", (evt, files) => {
    const dir = readinPath;

    const renamePromises = files.map((f) => {
      return new Promise((resolve) => {
        fs.rename(`${dir}/${f.oldName}`, `${dir}/${f.newName}`, () => {
          resolve();
        });
      });
    });

    Promise.all(renamePromises).then(() => {
      mainWindow.close();
    });
  });

  ipcMain.on("checkUpdate", (evt, arg) => {
    axios
      .get(
        "https://api.github.com/repos/huibizhang/photolisting/releases/latest"
      )
      .then((r) => {
        evt.reply("getUpdateInfo", {
          currentVersion: app.getVersion(),
          targetVersion: r.data.name,
          publishedAt: r.data.published_at,
          url: r.data.assets.find(
            (asset) => asset.name.split(".").pop() === "exe"
          ).browser_download_url,
        });
      })
      .catch((e) => {
        evt.reply("getUpdateInfo", null);
      });
  });

  let downloadItem = null;

  ipcMain.on("updating", (evt, url) => {
    if (downloadItem) if (downloadItem.getState() === "progressing") return;

    mainWindow.webContents.downloadURL(url);

    session.defaultSession.on("will-download", (event, item, webContents) => {
      downloadItem = item;

      try {
        fs.rmSync(appPath + "/update.exe");
      } catch (error) {
        console.error(error);
      }

      item.setSavePath(appPath + "/update.exe");
      item.on("updated", (event, state) => {
        console.log(
          "Downloading",
          item.getReceivedBytes() / item.getTotalBytes()
        );
        evt.reply("updatingProgress", {
          size: Number(item.getTotalBytes() / 1024 / 1024),
          progress: item.getReceivedBytes() / item.getTotalBytes(),
          done: false,
        });
      });
      item.on("done", (event, state) => {
        console.log(state);
        const workerProcess = exec("update.exe", { cwd: appPath });
      });
    });
  });

  if (process.env.NODE_ENV === "dev") {
    // mainWindow.loadURL("https://pccu-life-widget.vercel.app/");
    mainWindow.loadURL("http://127.0.0.1:3000");
  } else {
    // 加載 index.html
    mainWindow.loadFile("./dist/index.html"); // 此處跟electron官網路徑不同，需要註意
  }

  // 打開開發工具
  // mainWindow.webContents.openDevTools();
}

app.on("ready", function () {
  // console.log(" ==================== ready ====================");
  if (process.argv.length > 1) {
    const temp = process.argv[1];
    // const temp = "C:\\Users\\narut\\Desktop\\test2";

    if (fs.existsSync(temp) && fs.lstatSync(temp).isDirectory()) {
      readinPath = temp;
    }
  }
});

// 這段程序將會在 Electron 結束初始化
// 和創建瀏覽器窗口的時候調用
// 部分 API 在 ready 事件觸發後才能使用。

app.whenReady().then(() => {
  // if (process.argv.length > 1) {
  //   const temp = process.argv[1];

  //   if (fs.existsSync(temp) && fs.lstatSync(temp).isDirectory()) {
  //     readinPath = temp;
  //   }
  // }

  createWindow();

  app.on("activate", function () {
    // 通常在 macOS 上，當點擊 dock 中的應用程序圖標時，如果沒有其他
    // 打開的窗口，那麼程序會重新創建一個窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 除瞭 macOS 外，當所有窗口都被關閉的時候退出程序。 因此，通常對程序和它們在
// 任務欄上的圖標來說，應當保持活躍狀態，直到用戶使用 Cmd + Q 退出。
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// 在這個文件中，你可以包含應用程序剩餘的所有部分的代碼，
// 也可以拆分成幾個文件，然後用 require 導入。
