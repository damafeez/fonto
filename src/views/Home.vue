<template>
  <div>
    <main ref="container">
      <canvas ref="canvas"></canvas>
    </main>
    <Controls
      :config="$options.config"
      @download="download"
      @loadFile="loadFile"
      @controlChange="modifyData(...$event)"
    />
  </div>
</template>

<script>
import Controls from '@/components/Controls'
import { randomFrom, getTextData, processImage } from '@/utils'
import { config } from '@/fixtures'

export default {
  name: 'Home',
  components: {
    Controls,
  },
  data() {
    return {
      text: '',
      fontSize: null,
      bThreshold: null,
      xMargin: null,
      yMargin: null,
      wThreshold: null,
      resolution: null,
      contrast: null,
      sepia: null,
      image: null,
      textData: null,
      processedImageData: null,
      downloadName: 'fonto.jpg',
    }
  },
  computed: {
    filter() {
      return `contrast(${this.contrast}) sepia(${this.sepia})`
    },
    editWatcher() {
      return this.textData, this.bThreshold, this.wThreshold, new Date()
    },
    imgRenderWatcher() {
      return this.processedImageData, this.filter, new Date()
    },
    textDataParams() {
      return {
        text: this.text,
        fontSize: this.fontSize,
        xMargin: this.xMargin,
        yMargin: this.yMargin,
        canvasSize: this.canvasSize,
      }
    },
    canvasSize() {
      const { image, resolution: width } = this
      if (!image) return
      const aspect = image.width / image.height

      const height = width / aspect
      return { width, height }
    },
  },
  async beforeMount() {
    const sample = randomFrom(this.$options.samples)
    this.image = await this.loadImage(sample)
  },
  created() {
    // set data from config
    const {
      $options: { config },
    } = this

    Object.entries(config).forEach(([name, obj]) =>
      this.modifyData(name, obj.value),
    )
  },
  watch: {
    editWatcher() {
      if (this.textData) {
        this.editImage()
      }
    },
    imgRenderWatcher() {
      if (this.processedImageData) {
        this.renderImage()
      }
    },
    async textDataParams(params) {
      if (this.canvasSize) {
        this.textData = await getTextData(params)
      }
    },
    canvasSize() {
      const { canvas } = this.$refs
      if (canvas) {
        canvas.width = this.canvasSize.width
        canvas.height = this.canvasSize.height
      }
    },
  },
  methods: {
    modifyData(name, value) {
      this.$data[name] = value
    },
    async renderImage() {
      const { processedImageData, filter } = this
      const bitmap = await createImageBitmap(processedImageData)
      const ctx = this.$refs.canvas.getContext('2d')
      ctx.filter = filter
      ctx.drawImage(bitmap, 0, 0)
    },
    editImage() {
      const { image, bThreshold, wThreshold, canvasSize, textData } = this
      if (!image) return
      const imgCanvas = document.createElement('canvas')
      imgCanvas.width = canvasSize.width
      imgCanvas.height = canvasSize.height

      const imgCtx = imgCanvas.getContext('2d')

      imgCtx.drawImage(image, 0, 0, imgCanvas.width, imgCanvas.height)
      const imgData = imgCtx.getImageData(
        0,
        0,
        imgCanvas.width,
        imgCanvas.height,
      )
      this.$worker
        .run(processImage, [
          {
            textData,
            imgData,
            bThreshold,
            wThreshold,
          },
        ])
        .then(processedImageData => {
          this.processedImageData = processedImageData
        })
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
    download() {
      const { canvas } = this.$refs
      if (canvas) {
        const link = document.createElement('a')
        link.download = this.downloadName
        link.href = canvas.toDataURL()
        link.click()
      }
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
  config,
}
</script>

<style lang="scss">
main {
  overflow: scroll;
  display: flex;
  min-height: 100vh;
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
