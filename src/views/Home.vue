<template>
  <div>
    <main ref="container">
      <canvas ref="canvas"></canvas>
    </main>
    <aside></aside>
  </div>
</template>

<script>
import { randomFrom } from '@/utils'

export default {
  name: 'App',
  data() {
    return {
      text: 'Please wash your hands',
      fontSize: 25,
      marginRight: 11,
      marginBottom: 5,
      tolerance: 20,
      downloadName: 'fonto.jpg',
      width: 2500,
      image: null,
    }
  },
  async mounted() {
    const sample = randomFrom(this.$options.samples)
    this.image = await this.loadImage(sample)
  },
  watch: {
    async image() {
      this.editImage()
    },
    canvasSize() {
      const { canvas } = this.$refs
      if (!canvas) return

      canvas.width = this.canvasSize.width
      canvas.height = this.canvasSize.height
    },
  },
  computed: {
    canvasSize() {
      if (!this.image) return { width: 0, height: 0 }
      const aspect = this.image.width / this.image.height
      const { width } = this

      const height = width / aspect

      return { width, height }
    },
    textData() {
      const canvas = document.createElement('canvas')
      canvas.width = this.canvasSize.width
      canvas.height = this.canvasSize.height
      const { text, fontSize: tHeight, marginRight, marginBottom } = this
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
    },
  },
  methods: {
    async editImage() {
      const { image, tolerance } = this
      if (!this.image) return
      const imgCanvas = document.createElement('canvas')
      imgCanvas.width = this.canvasSize.width
      imgCanvas.height = this.canvasSize.height

      const imgCtx = imgCanvas.getContext('2d')

      imgCtx.drawImage(image, 0, 0, imgCanvas.width, imgCanvas.height)
      const imgData = imgCtx.getImageData(
        0,
        0,
        imgCanvas.width,
        imgCanvas.height,
      )

      const processedImageData = await this.$worker.run(
        function processImage({ imgData, textData, tolerance }) {
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
              gray < tolerance
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
        },
        [
          {
            textData: Float32Array.from(this.textData.data),
            imgData,
            tolerance,
          },
        ],
      )

      const ctx = this.$refs.canvas.getContext('2d')
      ctx.putImageData(processedImageData, 0, 0)
    },
    loadFile(file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        this.image = await this.loadImage(reader.result)
        this.downloadName = this.generateName(file.name)
      }
      if (file) reader.readAsDataURL(file)
    },
    loadImage(imgURL) {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = imgURL
        image.onload = () => resolve(image)
        image.onerror = reject
      })
    },
    generateName(name) {
      const arr = name.split('.')
      arr.pop()
      return [...arr, '_fonto.jpg'].join('')
    },
  },
  samples: [
    require('@/assets/sample.jpg'),
    require('@/assets/sample1.jpg'),
    require('@/assets/sample2.jpg'),
    require('@/assets/sample3.jpg'),
    require('@/assets/sample4.jpg'),
    require('@/assets/sample5.jpg'),
  ],
}
</script>

<style lang="scss">
main {
  overflow: scroll;
  display: flex;
  canvas {
    margin: auto;
    max-height: 100vh;
    @media screen and (min-width: 800px) {
      max-width: 100vw;
      max-height: 130vh;
    }
  }
}
</style>
