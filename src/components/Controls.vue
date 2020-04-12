<template>
  <aside>
    <TextInput
      v-for="(input, name) in config"
      :key="name"
      :step="input.step"
      :min="input.min"
      :max="input.max"
      :type="input.type"
      :label="input.label"
      :value="input.value"
      :class="{ text: input.type === 'textarea' }"
      @input="
        $emit('controlChange', [name, minMax($event, input.min, input.max)])
      "
    />
    <input
      type="file"
      accept=".png, .jpg, .jpeg"
      @change="loadFile($event.target.files[0])"
    />
    <button @click="download">Download</button>
  </aside>
</template>
<script>
import TextInput from '@/components/TextInput'

export default {
  name: 'Controls',
  components: {
    TextInput,
  },
  props: {
    config: Object,
    canvas: Element,
  },
  methods: {
    minMax(value, min = 0, max = 100) {
      const val = Number(value)

      if (val <= min) return min
      if (val >= max) return max
      return val
    },
    download() {
      if (this.canvas) {
        const link = document.createElement('a')
        link.download = this.downloadName
        link.href = this.canvas.toDataURL()
        link.click()
      }
    },
  },
}
</script>
<style lang="scss" scoped>
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
