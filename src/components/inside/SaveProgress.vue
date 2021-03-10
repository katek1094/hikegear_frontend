<template>
  <div class="outer">
    <div v-show="display_bar" class="progress">
      <div class="bar" :style="{width: progress_bar_width + '%'}"></div>
    </div>
    <div v-show="display_spinner" class="spinner"></div>
    <span v-show="display_info" class="info">zmiany zapisane</span>
  </div>
</template>

<script>
export default {
  name: "SaveProgress",
  props: {
    data_ready: Boolean,
    are_changes: Boolean
  },
  data() {
    return {
      refresh_time: 10,
      timeout: 3000,
      time_passed: 0,
      edits_counter: 0,
      interval_function_id: undefined,
      data_saved: true,
      display_spinner: false
    }
  },
  computed: {
    progress_bar_width() {
      return this.time_passed * 100 / this.timeout
    },
    display_bar() {
      return !this.data_saved
    },
    display_info() {
      return this.data_saved && !this.display_spinner
    }
  },
  methods: {
    handleEdit(are_changes) {
      this.time_passed = 0
      this.edits_counter += 1
      const x = this.edits_counter
      this.data_saved = !are_changes
      setTimeout(() => {
        if (x === this.edits_counter && this.are_changes) {
          this.$emit('save')
          this.display_spinner = true
        }
      }, this.timeout)
    },
    increaseTimePassed() {
      if (this.data_ready && this.are_changes) this.time_passed += this.refresh_time
    },
    handleSaveSuccess() {
      this.data_saved = true
      this.display_spinner = false
    },
    handleCtrlS() {
      this.display_spinner = true
    }

  },
  mounted() {
    this.interval_function_id = setInterval(this.increaseTimePassed, this.refresh_time)
  },
  beforeUnmount() {
    clearInterval(this.interval_function_id)
  }
}
</script>

<style scoped lang="scss">
.outer {
  width: 140px;
  height: 30px;
  border-radius: 4px;
  //background: $windows_color;
  margin: 4px 20px;
  display: flex;
  align-items: center;
}

.progress, .bar {
  width: 80%;
  border-radius: 2px;
}

.progress {
  height: 10px;
  background-color: white;
  margin-left: 10px;
  display: flex;
}

.bar {
  background-color: $windows_color;
}

.spinner {
  align-self: center;
  @include spinner;
}

.info {
  width: 100%;
  font-size: .8rem;
  text-align: center;
}
</style>
