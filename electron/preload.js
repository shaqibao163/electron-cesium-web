"use strict";

// src/electron/preload.js
var { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, ...args) => {
    ipcRenderer.send(channel, ...args);
  },
  sendSync: (channel, ...args) => {
    return ipcRenderer.sendSync(channel, ...args);
  },
  on: (channel, listener) => {
    ipcRenderer.on(channel, listener);
  },
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    console.log("element", element);
    if (element)
      element.innerText = text;
  };
  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
