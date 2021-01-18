<template>
  <div class="item">
    <input type="text" v-model="item_data.name">
    <input type="text" v-model="item_data.description">
    <input type="text" v-model="item_data.weight">
    <input type="text" v-model="item_data.quantity">
    <button type="button">usuń</button>
    <button type="button">+1</button>
    <button v-if="!item_data.cant_move_up" type="button" @click="up">up</button>
    <button v-if="!item_data.cant_move_down" type="button" @click="down">down</button>
    <input type="checkbox" :id="'worn-' + item_data.id" :checked="item_data.worn" @click="check">
    <label :for="'worn-' + item_data.id">na sobie</label>
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
    check() {
      this.$store.commit('editor/markAsWorn', this.item_data.id)
    }

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