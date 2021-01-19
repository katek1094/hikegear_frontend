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
    data_labels: Array
  },
  data() {
    return {
      chart: {},
      chart_data: {
        datasets: [{
          data: this.data_array,
          backgroundColor: ['rgb(25,42,144)', 'rgb(56,173,42)', 'rgba(156,24,24)', 'rgb(164,173,24)']
        }],
        labels: this.data_labels
      },
      chart_options: {
          responsive: true,
          maintainAspectRatio: false
      }
    }
  },
  methods: {
    createChart() {
      this.chart =  new Chart(document.getElementById('summary-chart'), {
        type: 'pie',
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
  height: 300px;
  width: 300px;
}
</style>