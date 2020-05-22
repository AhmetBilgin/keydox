const { app, screen, Tray, globalShortcut, BrowserWindow } = require('electron')
const ioHook = require('iohook')
const path = require('path')
const keyCodes = require('./keys')
const { changeImg, toggleWindow } = require('./utils')
const iconPath = path.join(__dirname, 'images/oval@2x.png')

let mainWindow
let trays
app.on('ready', createWindow)
app.on('window-all-closed', function() {
  ioHook.unregisterAllShortcuts()
  globalShortcut.unregisterAll()
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
  if (mainWindow === null) createWindow()
})

function createWindow() {
  let display = screen.getPrimaryDisplay()
  // let height = display.bounds.height
  const { width, height } = display.workAreaSize
  trays = new Tray(iconPath)

  mainWindow = new BrowserWindow({
    width: 800,
    height: 400,
    x: width - 800,
    y: height - 300,
    frame: false,
    opacity: 0.7,
    transparent: true
  })

  mainWindow.setIgnoreMouseEvents(true)

  ioHook.on('keydown', event => {
    trays.setTitle(keyCodes[event.rawcode] || '' + '')
  })

  // If you want to show something like 'CMD + C' (Copy)
  // ioHook.registerShortcut([3675, 42], (keys) => {
  //   trays.setTitle(`${keyCodes[55]} + ${keyCodes[56] }` || null)
  //   console.log('Shortcut called with keys:', keys)
  // });

  registerKeyForVisibilityToggle('Alt+Backspace')
  registerKeyForImage('Alt+0', '0')
  registerKeyForImage('Alt+1', '1')
  registerKeyForImage('Alt+2', '2')
  registerKeyForImage('Alt+3', '3')
  registerKeyForImage('Alt+4', '4')
  registerKeyForImage('Alt+5', '5')

  ioHook.start()

  mainWindow.setAlwaysOnTop(true, 'floating')
  mainWindow.setVisibleOnAllWorkspaces(true)
  mainWindow.loadURL(`file://${__dirname}/html/index.html`)

  // Open the DevTools.---
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function() {
    mainWindow = null
  })
}

function registerKeyForVisibilityToggle(key) {
  globalShortcut.register(key, () => {
    toggleWindow(mainWindow)
  })
}

function registerKeyForImage(key, imageName) {
  globalShortcut.register(key, () => {
    if (mainWindow.isVisible()) {
      changeImg(imageName, mainWindow)
    }
  })
}
