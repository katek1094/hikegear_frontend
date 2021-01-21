<template>
  <div class="item">
    <textarea class="name" :value="item.name" placeholder="nazwa" @input="[changeName($event), autoresize($event)]" @keydown="preventEnter" rows="1"/>
    <input class="description" type="text" :value="item.description" placeholder="opis" @input="changeDescription">
    <input class="weight" type="number" min=0 max="99999" :value="item.weight" @blur="changeWeight">
    <input class="quantity" type="number" min=0 max="99" :value="item.quantity">
    <button class="up" :disabled="item.cant_move_up" type="button" @click="up">up</button>
    <button class="down" :disabled="item.cant_move_down" type="button" @click="down">down</button>
    <input class="worn" type="checkbox" :id="'worn-' + item.id" :checked="item.worn" :disabled="item.consumable" @click="markAsWorn">
    <label :for="'worn-' + item.id">na sobie</label>
    <input class="consumable" type="checkbox" :id="'consumable-' + item.id" :checked="item.consumable"  :disabled="item.worn" @click="markAsConsumable">
    <label :for="'consumable-' + item.id">konsumpcyjne</label>
    <button class="delete" type="button" @click="deleteItem">usuń</button>
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

    }
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
    },
    autoresize(event) {
      let padding = parseInt(getComputedStyle(event.target).padding.replace('px', ''))
      let font_size = parseInt(getComputedStyle(event.target).fontSize.replace('px', ''))
      event.target.style.height = font_size + 2 + 'px'  // default style.height = font size + 2
      event.target.style.height = event.target.scrollHeight - padding * 2 + 'px'  // scrollHeight = font size + 2 + padding * 2
    },
    preventEnter(e) {
      if (e.keyCode === 13) {
        e.preventDefault()
        // TODO: only for name
      }
    }
  },
}
</script>

<style scoped>
.item {
  border: 1px solid black;
  margin: 2px;
  padding: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
}
input {
  font-size: 1em;
  border: none;
  padding: 3px;
}
textarea {
  font-size: 1em;
  padding: 3px;
  overflow: hidden;
  resize: none;
  border: none;
  outline: none;
}
/*input:focus {*/
/*  border: none;*/
/*}*/
/*input:active {*/
/*  border: none;*/
/*}*/
/*input:hover {*/
/*  border: none;*/
/*}*/

.name {
  width: 12em;
}
.description {

}
.weight {
  width: 4.5em;
}
.quantity {
  width: 3em;
}
.up {

}
.down {

}
.worn {

}
.consumable {

}
.delete {

}

</style>