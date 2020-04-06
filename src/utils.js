function removeNodes(parent) {
  const count = parent.children.length
  Array.from(parent.children).forEach(child => {
    parent.removeChild(child)
  })
  return count
}
function randomFrom(array) {
  const random = Math.floor(Math.random() * array.length)
  return array[random]
}

function processText(config) {
  const { text, fontSize: tHeight, marginRight, marginBottom, _canvas } = config
  const canvas = JSON.parse(_canvas)
  const ctx = canvas.getContext('2d')

  ctx.font = `${tHeight}px sans-serif`

  // background
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = 'white'
  const { width: tWidth } = ctx.measureText(text)
  let distx = 0
  let disty = 0

  while (disty < canvas.height) {
    ctx.fillText(text, distx, disty)
    distx += tWidth + marginRight
    if (distx >= canvas.width) {
      disty += tHeight + marginBottom
      distx = Math.random() * -100
    }
  }

  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

function processImage(textData, imgData) {
  const { data } = imgData
  for (let i = 0; i < imgData.data.length; i += 4) {
    const r = data[i + 0]
    const g = data[i + 1]
    const b = data[i + 2]
    const gray = 0.2 * r + 0.72 * g + 0.07 * b
    if (
      (textData[i + 0] === 0 &&
        textData[i + 1] === 0 &&
        textData[i + 2] === 0) ||
      gray < 20
    ) {
      data[i + 0] = 0
      data[i + 1] = 0
      data[i + 2] = 0
    } else {
      data[i + 0] = gray
      data[i + 1] = gray
      data[i + 2] = gray
    }
  }

  return imgData
}
export { removeNodes, randomFrom, processText, processImage }
