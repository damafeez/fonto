<template>
  <div>
    <main ref="container">
      <canvas ref="canvas"></canvas>
    </main>
    <aside>
      <TextInput
        step="10"
        min="15"
        max="1000"
        v-model.number="config.fontSize"
        label="Font size"
      />
      <TextInput
        step="5"
        min="0"
        max="200"
        v-model.number="config.treshold"
        label="Treshold"
      />
      <TextInput
        step="5"
        min="0"
        max="100"
        v-model.number="config.marginRight"
        label="X-margin"
      />
      <TextInput
        step="5"
        min="0"
        max="100"
        v-model.number="config.marginBottom"
        label="Y-margin"
      />
      <TextInput
        step="250"
        min="1500"
        max="5000"
        v-model.number="config.width"
        label="Resolution"
      />
      <TextInput
        class="text"
        type="textarea"
        v-model="config.text"
        label="Text"
      />
      <input
        type="file"
        accept=".png, .jpg, .jpeg"
        @change="loadFile($event.target.files[0])"
      />
      <button @click="download">Download</button>
    </aside>
  </div>
</template>

<script>
import { randomFrom, debounce } from '@/utils'
import TextInput from '@/components/TextInput'

export default {
  name: 'Home',
  components: {
    TextInput,
  },
  data() {
    return {
      config: {
        text: 'Please wash your hands',
        fontSize: 25,
        marginRight: 15,
        marginBottom: 5,
        treshold: 20,
        width: 2500,
      },
      downloadName: 'fonto.jpg',
      image: null,
    }
  },
  computed: {
    text() {
      return this.config.text || 'Please wash your hands'
    },
    fontSize() {
      return this.minMax(this.config.fontSize, 15, 1000)
    },
    marginRight() {
      return this.minMax(this.config.marginRight)
    },
    marginBottom() {
      return this.minMax(this.config.marginBottom)
    },
    treshold() {
      return this.minMax(this.config.treshold, 0, 200)
    },
    width() {
      return this.minMax(this.config.width, 1000, 5000)
    },
    configWatcher() {
      return (
        this.text,
        this.fontSize,
        this.marginRight,
        this.marginBottom,
        this.treshold,
        this.canvasSize,
        this.image,
        new Date()
      )
    },
    canvasSize() {
      const { image, width } = this
      if (!image) return
      const aspect = image.width / image.height

      const height = width / aspect

      return { width, height }
    },
    textData() {
      const {
        text,
        fontSize: tHeight,
        marginRight,
        marginBottom,
        canvasSize,
      } = this
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
    },
  },
  async beforeMount() {
    const sample = randomFrom(this.$options.samples)
    this.image = await this.loadImage(sample)
  },
  watch: {
    configWatcher() {
      if (this.image) this.editImage()
    },
    canvasSize() {
      const { canvas } = this.$refs
      if (!canvas) return

      canvas.width = this.canvasSize.width
      canvas.height = this.canvasSize.height
    },
  },
  methods: {
    minMax(value, min = 0, max = 100) {
      const val = Number(value)

      if (val <= min) return min
      if (val >= max) return max
      return val
    },
    editImage: debounce(async function() {
      const { image, treshold, canvasSize, textData } = this
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

      const processedImageData = await this.$worker.run(
        function processImage({ imgData, textData, treshold }) {
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
              gray < treshold
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
            textData,
            imgData,
            treshold,
          },
        ],
      )

      const ctx = this.$refs.canvas.getContext('2d')
      ctx.putImageData(processedImageData, 0, 0)
    }, 500),
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
aside {
  position: fixed;
  width: 15rem;
  right: 2rem;
  top: 2.5rem;
  display: flex;
  flex-wrap: wrap;
  padding: 0.5rem;
  @include flex-gap(0.5rem);

  background: rgba(51, 51, 51, 0.6);
  border-radius: 5px;
  > * {
    width: calc(50% - 1rem);
    &.text {
      width: 100%;
    }
  }

  input[type='file'] {
    width: 40%;
  }
  button {
    @include flex-center;
    background: rgba(130, 130, 130, 0.25);
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.12);
    border-radius: 5px;
    color: white;
    width: 6rem;
    height: 2rem;
    cursor: pointer;
  }
}
</style>
