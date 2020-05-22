let currentImage = 0
let totalImages = 0

const changeImg = (img, mainWindow) => {
  currentImage = img
  mainWindow.webContents.executeJavaScript(
    `document.querySelector("img").src="../images/${img}.png";`
  )
}

const incrementTotalRegisteredImages = () => {
  totalImages++
}
const incrementImg = mainWindow => {
  currentImage++
  currentImage = currentImage % totalImages
  changeImg(currentImage, mainWindow)
}

const decrementImg = mainWindow => {
  currentImage--
  if (currentImage < 0) {
    currentImage = totalImages - 1
  } else {
    currentImage = currentImage % totalImages
  }
  changeImg(currentImage, mainWindow)
}

const toggleWindow = mainWindow => {
  if (mainWindow.isVisible()) {
    return mainWindow.hide()
  }
  mainWindow.show()
}

module.exports = {
  changeImg,
  toggleWindow,
  incrementTotalRegisteredImages,
  incrementImg,
  decrementImg
}
