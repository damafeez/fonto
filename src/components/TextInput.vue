<template>
  <div :title="label" class="text-input">
    <textarea
      v-if="type === 'textarea'"
      :id="id"
      v-bind="$attrs"
      @input="$emit('input', $event.target.value)"
    />
    <input
      v-else
      :id="id"
      :type="type"
      v-bind="$attrs"
      @blur="onBlur"
      @input="$emit('input', $event.target.value)"
    />
    <label v-if="label" :for="id">{{ label[0] }}</label>
  </div>
</template>
<script>
const allowedTypes = ['text', 'number', 'textarea']
export default {
  name: 'TextInput',
  props: {
    type: {
      type: String,
      validator: type => allowedTypes.includes(type),
      default: 'number',
    },
    label: String,
    id: {
      type: String,
      default: () => `text-input-${Math.floor(Math.random() * 1000)}`,
    },
  },
  methods: {
    onBlur(e) {
      const { type, value, min, max } = e.target
      if (type === 'number') {
        if (min !== '' && (!value || +value <= +min)) this.$emit('input', min)
        else if (max !== '' && (!value || +value >= +max))
          this.$emit('input', max)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.text-input {
  border: 1px solid rgba(130, 130, 130, 0.5);
  border-radius: 5px;
  color: white;
  display: flex;
  align-items: center;
  input[type='text'],
  input[type='email'],
  input[type='phone'],
  input[type='number'],
  input[type='password'],
  textarea {
    flex: 1;
    outline: none;
    background: transparent;
    padding: 0.6rem 0.7rem;
    border-radius: 0.4rem;
    border: 1px solid var(--gray);
    color: white;
    &:focus {
      border: 1px solid white;
    }
  }
  label {
    padding: 0 0.5rem;
    font-size: 0.8rem;
    cursor: pointer;
  }
}
</style>
