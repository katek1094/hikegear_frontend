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
          backgroundColor: ['rgb(49,73,217)', 'rgb(63,212,51)', 'rgb(212,32,32)', 'rgb(246,234,58)',
            'rgb(234,120,16)', 'rgb(130,125,109)', 'rgb(177,60,241)', 'rgb(46,227,172)']
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