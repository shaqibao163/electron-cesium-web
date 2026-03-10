"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/electron/background.ts
var import_electron4 = require("electron");

// src/electron/windows/MainWindow.ts
var import_electron = require("electron");
var import_path = __toESM(require("path"));
var MainWindow = class {
  window = null;
  vueHttpUrl;
  constructor(vueHttpUrl) {
    this.vueHttpUrl = vueHttpUrl;
  }
  create() {
    const primaryDisplay = import_electron.screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    this.window = new import_electron.BrowserWindow({
      width,
      height,
      minWidth: 400,
      minHeight: 300,
      autoHideMenuBar: true,
      webPreferences: {
        preload: import_path.default.join(__dirname, "./electron/preload.js"),
        nodeIntegration: false,
        contextIsolation: true,
        webSecurity: true
      }
    });
    this.window.maximize();
    this.window.on("resize", () => {
      if (this.window && !this.window.isMaximized() && !this.window.isMinimized()) {
        this.window.maximize();
      }
    });
    if (this.vueHttpUrl) {
      this.window.loadURL(this.vueHttpUrl);
    } else {
      this.window.loadFile("index.html");
    }
    return this.window;
  }
  getWindow() {
    return this.window;
  }
  exists() {
    return this.window !== null && !this.window.isDestroyed();
  }
  close() {
    if (this.window && !this.window.isDestroyed()) {
      this.window.close();
      this.window = null;
    }
  }
  focus() {
    if (this.window && !this.window.isDestroyed()) {
      if (this.window.isMinimized()) {
        this.window.restore();
      }
      this.window.focus();
    }
  }
};

// src/electron/windows/SecondaryWindow.ts
var import_electron2 = require("electron");
var import_path2 = __toESM(require("path"));
var _SecondaryWindow = class {
  window = null;
  vueHttpUrl;
  mainWebContents = null;
  type;
  constructor(type, vueHttpUrl, mainWebContents) {
    this.type = type;
    this.vueHttpUrl = vueHttpUrl;
    this.mainWebContents = mainWebContents || null;
  }
  static setVueHttpUrl(url) {
    this.vueHttpUrl = url;
  }
  static setMainWebContents(webContents) {
    this.mainWebContents = webContents;
  }
  static getSecondaryWindow(type) {
    return this.secondaryWindows.get(type)?.getWindow() || null;
  }
  static toggleSecondaryWindow(type, isOpen) {
    if (isOpen) {
      this.createSecondaryWindow(type);
    } else {
      this.closeSecondaryWindow(type);
    }
  }
  static createSecondaryWindow(type) {
    const existingWindow = this.secondaryWindows.get(type);
    if (existingWindow?.exists()) {
      existingWindow.focus();
      return;
    }
    const secondaryWindow = new _SecondaryWindow(type, this.vueHttpUrl, this.mainWebContents);
    secondaryWindow.create();
    this.secondaryWindows.set(type, secondaryWindow);
  }
  static closeSecondaryWindow(type) {
    const secondaryWindow = this.secondaryWindows.get(type);
    if (secondaryWindow) {
      secondaryWindow.close();
      this.secondaryWindows.delete(type);
    }
  }
  static isSecondaryWindowOpen(type) {
    const secondaryWindow = this.secondaryWindows.get(type);
    return secondaryWindow?.exists() || false;
  }
  static closeAllSecondaryWindows() {
    this.secondaryWindows.forEach((window) => {
      window.close();
    });
    this.secondaryWindows.clear();
  }
  static hasSecondaryWindows() {
    return this.secondaryWindows.size > 0;
  }
  create() {
    const displays = import_electron2.screen.getAllDisplays();
    const externalDisplay = displays.find((display) => {
      return display.bounds.x !== 0 || display.bounds.y !== 0;
    });
    const isPaintTable = this.type === "paintTable" /* PAINT_TABLE */;
    this.window = new import_electron2.BrowserWindow({
      width: 400,
      height: 600,
      x: externalDisplay ? externalDisplay.bounds.x + 50 : 800,
      y: externalDisplay ? externalDisplay.bounds.y + 50 : 0,
      autoHideMenuBar: true,
      alwaysOnTop: isPaintTable,
      minimizable: !isPaintTable,
      webPreferences: {
        preload: import_path2.default.join(__dirname, "./electron/preload.js"),
        nodeIntegration: false,
        contextIsolation: true,
        webSecurity: true
      }
    });
    const routePath = this.type === "paintTable" /* PAINT_TABLE */ ? "paintTable" : "tsTable";
    if (this.vueHttpUrl) {
      const tableUrl = this.vueHttpUrl + `#/${routePath}`;
      this.window.loadURL(tableUrl);
    } else {
      this.window.loadFile("index.html", { hash: routePath });
    }
    this.window.on("closed", () => {
      this.window = null;
      if (this.mainWebContents && !this.mainWebContents.isDestroyed()) {
        this.mainWebContents.send("secondary-window-closed" /* SECONDARY_WINDOW_CLOSED */, this.type);
      }
    });
    return this.window;
  }
  getWindow() {
    return this.window;
  }
  exists() {
    return this.window !== null && !this.window.isDestroyed();
  }
  close() {
    if (this.window && !this.window.isDestroyed()) {
      this.window.close();
      this.window = null;
    }
  }
  focus() {
    if (this.window && !this.window.isDestroyed()) {
      if (this.window.isMinimized()) {
        this.window.restore();
      }
      this.window.focus();
    }
  }
};
var SecondaryWindow = _SecondaryWindow;
__publicField(SecondaryWindow, "secondaryWindows", /* @__PURE__ */ new Map());
__publicField(SecondaryWindow, "vueHttpUrl");
__publicField(SecondaryWindow, "mainWebContents", null);

// src/electron/ipc/ipcMain.ts
var import_electron3 = require("electron");
var IpcManager = class {
  mainWindow = null;
  constructor(mainWindow2) {
    this.mainWindow = mainWindow2;
    this.registerEvents();
  }
  registerEvents() {
    import_electron3.ipcMain.on("toggle-secondary-window" /* TOGGLE_SECONDARY_WINDOW */, (event, type, isOpen) => {
      SecondaryWindow.toggleSecondaryWindow(type, isOpen);
    });
    import_electron3.ipcMain.on("get-secondary-window-status" /* GET_SECONDARY_WINDOW_STATUS */, (event, type) => {
      event.returnValue = SecondaryWindow.isSecondaryWindowOpen(type);
    });
    import_electron3.ipcMain.on("plot-data-add" /* PLOT_DATA_ADD */, (event, data) => {
      const paintTableWindow = SecondaryWindow.getSecondaryWindow("paintTable" /* PAINT_TABLE */);
      if (paintTableWindow && !paintTableWindow.isDestroyed()) {
        paintTableWindow.webContents.send("plot-data-add" /* PLOT_DATA_ADD */, data);
      }
    });
    import_electron3.ipcMain.on("plot-data-remove-request" /* PLOT_DATA_REMOVE_REQUEST */, (event, id) => {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send("plot-data-remove" /* PLOT_DATA_REMOVE */, id);
      }
    });
    import_electron3.ipcMain.on("send-to-secondary" /* SEND_TO_SECONDARY */, (event, { data, target }) => {
      const targetWindow = SecondaryWindow.getSecondaryWindow(target);
      if (targetWindow && !targetWindow.isDestroyed()) {
        targetWindow.webContents.send("data-received" /* DATA_RECEIVED */, data);
      }
    });
  }
  cleanup() {
    import_electron3.ipcMain.removeAllListeners("toggle-secondary-window" /* TOGGLE_SECONDARY_WINDOW */);
    import_electron3.ipcMain.removeAllListeners("get-secondary-window-status" /* GET_SECONDARY_WINDOW_STATUS */);
    import_electron3.ipcMain.removeAllListeners("plot-data-add" /* PLOT_DATA_ADD */);
    import_electron3.ipcMain.removeAllListeners("plot-data-remove-request" /* PLOT_DATA_REMOVE_REQUEST */);
    import_electron3.ipcMain.removeAllListeners("send-to-secondary" /* SEND_TO_SECONDARY */);
  }
};

// src/electron/background.ts
var mainWindow = null;
var ipcManager = null;
function initializeApp() {
  const vueHttpUrl = process.argv[2];
  mainWindow = new MainWindow(vueHttpUrl);
  const mainWindowInstance = mainWindow.create();
  if (vueHttpUrl) {
    SecondaryWindow.setVueHttpUrl(vueHttpUrl);
  }
  SecondaryWindow.setMainWebContents(mainWindowInstance.webContents);
  ipcManager = new IpcManager(mainWindowInstance);
}
import_electron4.app.whenReady().then(() => {
  initializeApp();
  import_electron4.app.on("activate", () => {
    if (!mainWindow?.exists()) {
      mainWindow = new MainWindow();
      const mainWindowInstance = mainWindow.create();
      SecondaryWindow.setMainWebContents(mainWindowInstance.webContents);
      ipcManager = new IpcManager(mainWindowInstance);
    }
  });
});
import_electron4.app.on("window-all-closed", () => {
  if (process.platform !== "darwin")
    import_electron4.app.quit();
});
import_electron4.app.on("will-quit", () => {
  ipcManager?.cleanup();
  SecondaryWindow.closeAllSecondaryWindows();
  mainWindow?.close();
});
import_electron4.app.commandLine.appendSwitch("no-sandbox");
