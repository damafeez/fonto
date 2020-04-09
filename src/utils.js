function randomFrom(array) {
  const random = Math.floor(Math.random() * array.length)
  return array[random]
}
function debounce(func, interval = 200) {
  let timeout
  return function(...args) {
    return new Promise(resolve => {
      const later = () => {
        timeout = null
        resolve(func.apply(this, args))
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, interval)
    })
  }
}

function getTextData({
  text,
  fontSize: tHeight,
  marginRight,
  marginBottom,
  canvasSize,
}) {
  if (!canvasSize) return []
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = canvasSize.width
  canvas.height = canvasSize.height

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

  return Float32Array.from(
    ctx.getImageData(0, 0, canvas.width, canvas.height).data,
  )
}

function processImage({ imgData, textData, bTreshold, wTreshold }) {
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
      gray < bTreshold ||
      gray > 255 - wTreshold
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
export { randomFrom, debounce, getTextData, processImage }
