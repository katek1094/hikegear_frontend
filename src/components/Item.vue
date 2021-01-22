<template>
  <div class="item">
    <textarea v-model.trim="item_name" class="name autoresize field" placeholder="nazwa" rows="1" @input="autoresize"
              @keydown="preventEnter"/>
    <textarea v-model.trim="item_description" class="description autoresize field" placeholder="opis" rows="1" @input="autoresize"/>
    <input v-model="item_weight" class="weight field" max="99999" min=0 type="number">
    <input v-model="item_quantity" class="quantity field" max="99" min=0 type="number">

    <input :id="'worn-' + item.id" :checked="item.worn" :disabled="item.consumable" class="worn" type="checkbox"
           @click="markAsWorn">
    <label :for="'worn-' + item.id">na sobie</label>
    <input :id="'consumable-' + item.id" :checked="item.consumable" :disabled="item.worn" class="consumable"
           type="checkbox" @click="markAsConsumable">
    <label :for="'consumable-' + item.id">konsumpcyjne</label>




    <button :disabled="item.cant_move_up" class="up" type="button" @click="up">
      <font-awesome-icon class="fa-sm" icon="chevron-up"/>
    </button>
    <button :disabled="item.cant_move_down" class="down" type="button" @click="down">
      <font-awesome-icon class="fa-sm" icon="chevron-down"/>
    </button>
    <button class="delete" type="button" @click="deleteItem">
      <font-awesome-icon class="fa-sm" icon="trash"/>
    </button>
  </div>
</template>

<script>
export default {
  name: "Item",
  props: {
    item: Object
  },
  data() {
    return {}
  },
  computed: {
    item_name: {
      get() {return this.item.name},
      set(val) {this.$store.commit('editor/renameItem', {id: this.item.id, name: val})}
    },
    item_description: {
      get() {return this.item.description},
      set(val) {this.$store.commit('editor/changeItemDescription', {id: this.item.id, description: val})}
    },
    item_weight: {
      get() {return this.item.weight},
      set(val) {this.$store.commit('editor/changeItemWeight', {id: this.item.id, weight: val})}
    },
    item_quantity: {
      get() {return this.item.quantity},
      set(val) {this.$store.commit('editor/changeItemQuantity', {id: this.item.id, quantity: val})}
    },
  },
  methods: {
    up() {this.$store.dispatch('editor/moveUp', this.item.id)},
    down() {this.$store.dispatch('editor/moveDown', this.item.id)},
    markAsWorn() {this.$store.commit('editor/markAsWorn', this.item.id)},
    markAsConsumable() {this.$store.commit('editor/markAsConsumable', this.item.id)},
    deleteItem() {this.$store.commit('editor/deleteItem', this.item.id)},
    autoresize(event) {
      let padding = parseInt(getComputedStyle(event.target).padding.replace('px', ''))
      let font_size = parseInt(getComputedStyle(event.target).fontSize.replace('px', ''))
      event.target.style.height = font_size + 2 + 'px'  // default style.height = font size + 2
      event.target.style.height = event.target.scrollHeight - padding * 2 + 'px'  // scrollHeight = font size + 2 + padding * 2
    },
    preventEnter(e) {
      if (e.keyCode === 13) {e.preventDefault()}
    }
  },
}
</script>

<style scoped>
.item {
  border-top: 1px dotted grey;
  /*TODO: borders for first and last different*/
  padding: 3px;
  font-size: 12px;
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
  padding: 5px;
}
.field {
  border: 1px solid var(--background);
  background-color: var(--background);
  outline: none;
}
.field:focus {
  background-color: white;
  border: 1px solid grey;
}
.field:hover {
  background-color: white;
}
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
/*code below removes arrows from numeric inputs*/
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}

</style>