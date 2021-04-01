<template>
  <Tooltip :text=tooltip_text size="large">
    <div class="outer">
      <div v-show="display_bar" class="progress">
        <div class="bar" :style="{width: progress_bar_width + '%'}"></div>
      </div>
      <div v-show="display_spinner" class="hg-spinner"></div>
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

const refresh_time = 40
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
      interval_function_id: undefined,
      display_spinner: false,
      saves_counter: 0
    }
  },
  computed: {
    progress_bar_width() {
      return this.time_passed * 100 / timeout
    },
    display_bar() {
      return this.time_passed
    },
    display_info() {
      return !this.display_spinner && this.saves_counter !== 0 && !this.time_passed
    },
    tooltip_text() {
      return 'zmiany są automatycznie zapisywane po ' + timeout / 1000 + ' sekundach od ostatniej edycji lub po ' +
          'wciśnięciu klawiszy Ctrl + S'
    }
  },
  methods: {
    handleEdit(are_changes) {
      if (are_changes) {
        if (this.display_spinner) this.display_spinner = false
        this.time_passed = 0
        if (!this.interval_function_id) this.startProgress()
      } else {
        this.stopProgress()
        this.time_passed = 0
      }
    },
    startProgress() {
      this.interval_function_id = setInterval(this.increaseTimePassed, refresh_time)
    },
    stopProgress() {
      clearInterval(this.interval_function_id)
      this.interval_function_id = undefined
    },
    increaseTimePassed() {
      if (this.time_passed === timeout) {
        this.$emit('save')
        this.startLoading()
      }
      else if (this.data_ready && this.are_changes) this.time_passed += refresh_time
    },
    handleSaveSuccess() {
      this.display_spinner = false
      this.saves_counter += 1
    },
    handleCtrlS() {
      this.startLoading()
    },
    startLoading() {
      this.stopProgress()
      this.time_passed = 0
      this.display_spinner = true
    }
  },
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

.check_icon {
  color: green;
}

.info {
  width: 100%;
  font-size: .9rem;
  text-align: center;
}
</style>
