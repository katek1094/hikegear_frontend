<template>
  <div class="item">
    <button type="button" @click="up">up</button>
    <button type="button" @click="down">down</button>
    <input type="text" v-model="item_data.name">
    <input type="text" v-model="item_data.description">
    <input type="text" v-model="item_data.weight">
    <input type="text" v-model="item_data.quantity">
    <button type="button">usuń</button>
    <button type="button">+1</button>
    id: {{item_data.id}}
  </div>
</template>

<script>
export default {
  name: "Item",
  props: {
    item: Object
  },
  data() {
    return {
      item_data: this.item
    }
  },
  methods: {
    up() {
      this.$store.dispatch('editor/moveUp', this.item_data.id)
    },
    down() {
      this.$store.dispatch('editor/moveDown', this.item_data.id)
    },

  }

}
</script>

<style scoped>
.item {
  border: 1px solid black;
  padding: 2px;
  margin: 2px;
}
</style>