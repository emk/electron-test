import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import url = require('url');
import path = require('path');
import native = require('./native');

native.init()
console.log("From Rust:", native.hello())

// Global window object so it doesn't go out of scope and get GCed.
let win: Electron.BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({ width: 400, height: 300 })

  globalShortcut.register('F12', () => {
    if (win) {
      win.webContents.openDevTools()
    }
  })

  const indexUrl = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  })
  win.loadURL(indexUrl)

  win.on('closed', () => {
    win = null
  })
}

type Size = [number, number]

function constrainSize(desired: Size, max: Size): Size {
  const [desiredWidth, desiredHeight] = desired
  const [maxWidth, maxHeight] = max
  const aspectRatio = desiredWidth / desiredHeight
  if (aspectRatio < maxWidth / maxHeight) {
    // Too narrow and tall.
    const height = Math.min(desiredHeight, maxHeight)
    const width = height * aspectRatio
    return [width, height]
  } else {
    // Too wide and short.
    const width = Math.min(desiredWidth, maxWidth)
    const height = width / aspectRatio
    return [width, height]
  }
}

ipcMain.on('video-size', (event, width: number, height: number) => {
  console.log('video-size', win, width, height)
  if (win) {
    const [newWidth, newHeight] = constrainSize([width, height], [800, 600])
    console.log("Setting size:", newWidth, newHeight)
    win.setContentSize(newWidth, newHeight)
  }
})

app.on('ready', createWindow)
