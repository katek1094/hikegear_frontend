<template>
  <div class="summary__wrapper">
    <Chart :data_array="summary_data.data" :data_labels="summary_data.labels" :colors_array="colors"/>
    <table class="summary__table">
      <tr v-for="(data, index) in summary_data.data" :key="data">
        <td><div class="color" :style="{backgroundColor: colors[index]}"></div>{{ summary_data.labels[index] }}</td>
        <td>{{ data }}</td>
      </tr>
      <tr>
        <td>total</td>
        <td>{{ summary_data.total_weight }}</td>
      </tr>
      <tr>
        <td>konsumpcyjne</td>
        <td>{{ summary_data.consumable_weight }}</td>
      </tr>
      <tr>
        <td>na sobie</td>
        <td>{{ summary_data.worn_weight }}</td>
      </tr>
      <tr>
        <td>waga bazowa</td>
        <td>{{ summary_data.base_weight }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import Chart from "@/components/Chart";

export default {
  name: "Summary",
  components: {Chart},
  data() {
    return {
      colors: ['rgb(53,77,232)', 'rgb(63,212,51)', 'rgb(212,32,32)', 'rgb(246,234,58)',
        'rgb(234,120,16)', 'rgb(130,125,109)', 'rgb(177,60,241)', 'rgb(46,227,172)',
        'rgb(73,66,66)', 'rgb(54,154,172)', 'rgb(236,31,167)', 'rgb(217,188,7)',
        'rgb(187,184,183)', 'rgb(206,102,102)', 'rgb(108,134,34)', 'rgb(173,115,208)']
    }
  },
  computed: {
    summary_data() {
      return this.$store.getters['editor/summary_data']
    }
  },
}
</script>

<style scoped>
.summary__wrapper {
  display: flex;
  margin-bottom: 15px;
}

.summary__table {
  border-spacing: 30px 5px;
}

.color {
  width: 25px;
  height: 10px;
  display: inline-block;
  margin-right: 4px;
}

td {
  margin-right: 4px;
  font-size: 0.8rem;
}




@media (min-width: 320px) and (max-width: 479px) {
  .summary__wrapper {
    flex-direction: column;
    align-items: center;
  }

}

@media (min-width: 480px) {

}

@media (min-width: 600px) {

}

@media (min-width: 801px) {

}

@media (min-width: 1025px) {

}

@media (min-width: 1281px) {

}
</style>