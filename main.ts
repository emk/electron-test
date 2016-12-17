import { app, BrowserWindow } from 'electron';
import * as url from 'url';
import * as path from 'path';

// Global window object so it doesn't go out of scope and get GCed.
let win

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 })

  const indexUrl = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  })
  win.loadURL(indexUrl)

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)
