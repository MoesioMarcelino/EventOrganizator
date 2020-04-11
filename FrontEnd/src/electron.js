const { app, BrowserWindow } = require('electron')
const path = require('path')
function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 })

  win.loadURL('http://localhost:3000/')

  // win.webContents.openDevTools()

}
app.on('ready', createWindow)
