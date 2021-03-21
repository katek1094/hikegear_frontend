<template>
  <Tooltip :text=tooltip_text size="large">
    <div class="outer">
      <div v-show="display_bar" class="progress">
        <div class="bar" :style="{width: progress_bar_width + '%'}"></div>
      </div>
      <div v-show="display_spinner" class="spinner"></div>
      <span v-show="display_info" class="info">
      <font-awesome-icon class="fa-sm check_icon" icon="check-circle"/>
      zmiany zapisane
    </span>
    </div>
  </Tooltip>
</template>

<script>
import Tooltip from "@/components/Tooltip";
import Constants from "@/constants"

const refresh_time = 10
const timeout = Constants.EDITOR_SAVE_TIMEOUT

export default {
  name: "SaveProgress",
  components: {Tooltip},
  props: {
    data_ready: Boolean,
    are_changes: Boolean
  },
  data() {
    return {
      time_passed: 0,
      edits_counter: 0,
      interval_function_id: undefined,
      data_saved: true,
      display_spinner: false,
      saves_counter: 0
    }
  },
  computed: {
    // TODO: it works bad, finishes to early, in mozilla in half
    progress_bar_width() {
      return this.time_passed * 100 / timeout
    },
    display_bar() {
      return !this.data_saved
    },
    display_info() {
      return this.data_saved && !this.display_spinner && this.saves_counter !== 0
    },
    tooltip_text() {
      return 'zmiany są automatycznie zapisywane po ' + timeout / 1000 + ' sekundach od ostatniej edycji lub po ' +
          'wciśnięciu klawiszy Ctrl + S'
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
      }, timeout)
    },
    increaseTimePassed() {
      if (this.data_ready && this.are_changes) this.time_passed += refresh_time
    },
    handleSaveSuccess() {
      this.data_saved = true
      this.display_spinner = false
      this.saves_counter += 1
    },
    handleCtrlS() {
      this.display_spinner = true
    }
  },
  mounted() {
    this.interval_function_id = setInterval(this.increaseTimePassed, refresh_time)
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
  margin: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress, .bar {
  border-radius: 2px;
}

.progress {
  width: 100%;
  height: 10px;
  background-color: white;
  margin-left: 10px;
  display: flex;
}

.bar {
  background-color: $nav_color;
}

.spinner {
  @include spinner;
}

.check_icon {
  color: green;
}

.info {
  width: 100%;
  font-size: .9rem;
  text-align: center;
}
</style>
