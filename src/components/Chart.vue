<template>
  <div class="canvas__wrapper">
    <canvas id="summary-chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js';

export default {
  name: "Chart",
  props: {
    data_array: Array,
    data_labels: Array,
    colors_array: Array
  },
  data() {
    return {
      chart: {},
      chart_data: {
        datasets: [{
          data: this.data_array,
          backgroundColor: this.colors_array
        }],
        labels: this.data_labels
      },
      chart_options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          arc: {
            borderWidth: 0,
          }
        },
        legend: {
          display: false
        }
      }
    }
  },
  methods: {
    createChart() {
      this.chart = new Chart(document.getElementById('summary-chart'), {
        type: 'doughnut',
        data: this.chart_data,
        options: this.chart_options,
      });
    },
    updateChart() {
      this.chart.data.datasets[0].data = this.data_array
      this.chart.data.labels = this.data_labels
      this.chart.update()
    }
  },
  watch: {
    data_array: function () {
      this.updateChart()
    }
  },
  mounted() {
    this.createChart()
  }
}
</script>

<style scoped>
.canvas__wrapper {
  margin: 10px;
}
</style>