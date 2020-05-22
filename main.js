const { app, screen, Tray, globalShortcut, BrowserWindow } = require('electron')
const ioHook = require('iohook')
const path = require('path')
const keyCodes = require('./keys')
const {
  changeImg,
  toggleWindow,
  incrementTotalRegisteredImages,
  incrementImg,
  decrementImg
} = require('./utils')
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
  const { width: displayWidth, height: displayHeight } = display.workAreaSize
  trays = new Tray(iconPath)

  const windowPosition = windowPositions().BOTTOM_RIGHT
  const windowWidth = 1200
  const windowHeight = 500

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: windowPosition.x,
    y: windowPosition.y,
    frame: false,
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

  registerToggleVisibilityKey('Alt+Backspace')
  registerKeyForImage('Alt+0', '0')
  registerKeyForImage('Alt+1', '1')
  registerKeyForImage('Alt+2', '2')
  registerKeyForImage('Alt+3', '3')
  registerKeyForImage('Alt+4', '4')
  registerKeyForImage('Alt+5', '5')
  registerIncrementImageKey('Alt+=')
  registerDecrementImageKey('Alt+-')

  ioHook.start()

  mainWindow.setAlwaysOnTop(true, 'floating')
  mainWindow.setVisibleOnAllWorkspaces(true)
  mainWindow.loadURL(`file://${__dirname}/html/index.html`)

  // Open the DevTools.---
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function() {
    mainWindow = null
  })

  function windowPositions() {
    const top = 0
    const left = 0
    const right = displayWidth - windowWidth
    const bottom = displayHeight - windowHeight

    const windowPositions = {
      TOP_LEFT: { y: top, x: left },
      TOP_RIGHT: { y: top, x: right },
      BOTTOM_RIGHT: { y: bottom, x: right },
      BOTTOM_LEFT: { y: bottom, x: left }
    }
    return windowPositions
  }
}

function registerToggleVisibilityKey(key) {
  globalShortcut.register(key, () => {
    toggleWindow(mainWindow)
  })
}
function registerIncrementImageKey(key) {
  globalShortcut.register(key, () => {
    incrementImg(mainWindow)
  })
}

function registerDecrementImageKey(key) {
  globalShortcut.register(key, () => {
    decrementImg(mainWindow)
  })
}

function registerKeyForImage(key, imageName) {
  globalShortcut.register(key, () => {
    if (mainWindow.isVisible()) {
      changeImg(imageName, mainWindow)
    }
  })
  incrementTotalRegisteredImages()
}
