<template>
  <aside>
    <TextInput
      v-for="(input, name) in config"
      :key="name"
      :name="name"
      :step="input.step"
      :min="input.min"
      :max="input.max"
      :type="input.type || 'number'"
      :label="input.label"
      :value="input.value"
      :class="{ text: input.type === 'textarea' }"
      @input="onInput($event, input.value)"
      @blur="onBlur($event, input.value)"
    />
    <input
      type="file"
      accept=".png, .jpg, .jpeg"
      @change="$emit('loadFile', $event.target.files[0])"
    />
    <button @click="$emit('download')">Download</button>
  </aside>
</template>
<script>
import TextInput from '@/components/TextInput'
import { debounce } from '@/utils'

export default {
  name: 'Controls',
  components: {
    TextInput,
  },
  props: {
    config: Object,
  },
  methods: {
    onInput: debounce(function(e, defaultValue) {
      const value = this.normalize(e.target, defaultValue)
      this.$emit('controlChange', [e.target.name, value])
    }),
    onBlur(e, defaultValue) {
      e.target.value = this.normalize(e.target, defaultValue)
    },
    normalize({ value, min, max, type }, defaultValue) {
      let val = value
      if (type === 'number') val = this.minMax(+value, +min, +max)
      else if (!value) val = defaultValue
      return val
    },
    minMax(value, min = 0, max = 100) {
      if (value <= min) return min
      if (value >= max) return max
      return value
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
