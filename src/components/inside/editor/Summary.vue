<template>
  <div class="summary__wrapper">
    <Chart :colors_array="colors" :data_array="summary_data.data"
           :data_labels="summary_data.labels"/>
    <table class="summary__table">
      <tr v-show="showChart" v-for="(data, index) in summary_data.data" :key="index">
        <td>
          <div class="color" :style="{backgroundColor: colors[index]}"></div>
          {{ summary_data.labels[index] }}
        </td>
        <td>{{ data }}</td>
      </tr>
      <tr>
        <td>waga całkowita</td>
        <td>{{ summary_data.total_weight }} g</td>
      </tr>
      <tr>
        <td>konsumpcyjne</td>
        <td>{{ summary_data.consumable_weight }} g</td>
      </tr>
      <tr>
        <td>na sobie</td>
        <td>{{ summary_data.worn_weight }} g</td>
      </tr>
      <tr>
        <Tooltip text="waga bazowa = waga całkowita - konsumpcyjne - na sobie" direction="top" size="large">
          <td>waga bazowa</td>
        </Tooltip>
        <td>{{ summary_data.base_weight }} g</td>
      </tr>
    </table>
  </div>
</template>

<script>
import Chart from "@/components/inside/editor/Chart";
import Tooltip from "@/components/Tooltip";

export default {
  name: "Summary",
  components: {Tooltip, Chart},
  props: {
    summary_data: Object,
  },
  data() {
    return {
      colors: ['rgb(53,77,232)', 'rgb(63,212,51)', 'rgb(212,32,32)', 'rgb(246,234,58)',
        'rgb(234,120,16)', 'rgb(130,125,109)', 'rgb(177,60,241)', 'rgb(46,227,172)',
        'rgb(73,66,66)', 'rgb(54,154,172)', 'rgb(236,31,167)', 'rgb(217,188,7)',
        'rgb(187,184,183)', 'rgb(206,102,102)', 'rgb(108,134,34)', 'rgb(173,115,208)']
    }
  },
  computed: {
    showChart() {
      return this.summary_data.total_weight !== 0
    }
  }
}
</script>

<style lang="scss" scoped>
.summary__wrapper {
  display: flex;
  margin-bottom: 15px;
  justify-content: space-between;
  align-items: center;
}

.summary__table {
  border-spacing: 30px 5px;
}

.color {
  width: 25px;
  height: 10px;
  display: inline-block;
  margin-right: 4px;
  border-radius: 2px;
}

td {
  margin-right: 4px;
  font-size: 0.8rem;
}

@media (max-width: 479px) {
  .summary__wrapper {
    flex-direction: column;
  }
}


</style>
