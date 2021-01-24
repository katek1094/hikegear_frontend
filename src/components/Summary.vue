<template>
  <div class="summary__wrapper">
    <Chart :data_array="summary_data.data" :data_labels="summary_data.labels"/>
    <table class="summary__table">
      <tr v-for="(data, index) in summary_data.data" :key="data">
        <td>{{ summary_data.labels[index] }}</td>
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
}

.summary__table {
  border: 1px solid black;
}
</style>