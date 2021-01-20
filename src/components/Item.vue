<template>
  <div class="item">
    <input type="text" :value="item.name" placeholder="nazwa" @input="changeName">
    <input type="text" :value="item.description" placeholder="opis" @input="changeDescription">
    <input type="number" min=0 :value="item.weight" @blur="changeWeight">
    <input type="number" min=0 :value="item.quantity">
    <button :disabled="item.cant_move_up" type="button" @click="up">up</button>
    <button :disabled="item.cant_move_down" type="button" @click="down">down</button>
    <input type="checkbox" :id="'worn-' + item.id" :checked="item.worn" :disabled="item.consumable" @click="markAsWorn">
    <label :for="'worn-' + item.id">na sobie</label>
    <input type="checkbox" :id="'consumable-' + item.id" :checked="item.consumable"  :disabled="item.worn" @click="markAsConsumable">
    <label :for="'consumable-' + item.id">konsumpcyjne</label>
    <button type="button" @click="deleteItem">usuń</button>
  </div>
</template>

<script>
export default {
  name: "Item",
  props: {
    item: Object
  },
  methods: {
    up() {
      this.$store.dispatch('editor/moveUp', this.item.id)
    },
    down() {
      this.$store.dispatch('editor/moveDown', this.item.id)
    },
    markAsWorn() {
      this.$store.commit('editor/markAsWorn', this.item.id)
    },
    markAsConsumable() {
      this.$store.commit('editor/markAsConsumable', this.item.id)
    },
    changeName(e) {
      this.$store.commit('editor/renameItem', {id: this.item.id, name: e.target.value})
    },
    changeDescription(e) {
      this.$store.commit('editor/changeItemDescription', {id: this.item.id, description: e.target.value})
    },
    changeWeight(e) {
      this.$store.commit('editor/changeItemWeight', {id: this.item.id, weight: e.target.value})
    },
    deleteItem() {
      this.$store.commit('editor/deleteItem', this.item.id)
    }
  },
}
</script>

<style scoped>
.item {
  border: 1px solid black;
  padding: 2px;
  margin: 2px;
}
</style>