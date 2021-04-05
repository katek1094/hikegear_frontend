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
      textarea.style.height = font_size + 'px'
      textarea.style.height = textarea.scrollHeight - padding * 2 + 2 + 'px'
    },
    prevent(e) {
      if (this.preventEnter && e.keyCode === 13) e.preventDefault()
    },
    focusTextarea() {
      this.$refs.textarea.focus()
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
