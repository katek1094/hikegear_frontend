<template>
  <textarea
      ref="textarea"
      v-model="value"
      :placeholder="placeholder"
      :maxlength="maxlength"
      @input="resize"
      @keydown="prevent"
  ></textarea>
</template>

<script>
export default {
  name: "AutoResizable",
  emits: ['update:modelValue'],
  props: {
    placeholder: String,
    maxlength: Number,
    modelValue: String,
    preventEnter: Boolean
  },
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    }
  },
  methods: {
    resize() {
      const textarea = this.$refs.textarea
      let padding = parseInt(getComputedStyle(textarea).paddingTop.replace('px', ''))
      let font_size = parseInt(getComputedStyle(textarea).fontSize.replace('px', ''))
      textarea.style.height = font_size + 2 + 'px'  // default style.height = font size + 2
      textarea.style.height = textarea.scrollHeight - padding * 2 + 'px'  // scrollHeight = font size + 2 + padding * 2
    },
    prevent(e) {
      if (this.preventEnter && e.keyCode === 13) e.preventDefault()
    }
  },
  mounted() {
    this.resize()
  }
}
</script>

<style lang="scss" scoped>
textarea {
  resize: none;
  overflow: hidden;
}
</style>
