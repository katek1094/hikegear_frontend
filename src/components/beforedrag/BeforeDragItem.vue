<template>
  <div class="item" :class="{first: first, last: last, middle: !last && !first}">
    <button :disabled="item.cant_move_up" class="up" type="button" @click="up">
      <font-awesome-icon class="fa-sm" icon="chevron-up"/>
    </button>
    <button :disabled="item.cant_move_down" class="down" type="button" @click="down">
      <font-awesome-icon class="fa-sm" icon="chevron-down"/>
    </button>
    <textarea v-model.trim="item_name" class="name autoresize field" placeholder="nazwa" rows="1" @input="autoresize"
              @keydown="preventEnter"/>
    <textarea v-model.trim="item_description" class="description autoresize field" placeholder="opis" rows="1"
              @input="autoresize"/>
    <button :class="{ checked: item.worn }" :disabled="item.consumable" class="worn" @click="markAsWorn">
      <font-awesome-icon class="fa-sm" icon="child"/>
    </button>
    <button :class="{ checked: item.consumable }" :disabled="item.worn" class="consumable" @click="markAsConsumable">
      <font-awesome-icon class="fa-sm" icon="sync-alt"/>
    </button>
    <input v-model.number="item_weight" class="weight field" type="number" @input="removeLeadingZero">
    <input v-model.number="item_quantity" :max="quantity_limit" class="quantity field" min="0" type="number"
           @input="removeLeadingZero">
    <button class="delete" type="button" @click="deleteItem">
      <font-awesome-icon class="fa-sm" icon="trash"/>
    </button>
  </div>
</template>

<script>
export default {
  name: "Item",
  props: {
    item: Object,
    first: Boolean,
    last: Boolean
  },
  data() {
    return {
      weight_limit: 99999,
      quantity_limit: 99
    }
  },
  computed: {
    item_name: {
      get() {
        return this.item.name
      },
      set(val) {
        this.$store.commit('editor/renameItem', {id: this.item.id, name: val})
      }
    },
    item_description: {
      get() {
        return this.item.description
      },
      set(val) {
        this.$store.commit('editor/changeItemDescription', {id: this.item.id, description: val})
      }
    },
    item_weight: {
      get() {
        return this.item.weight
      },
      set(val) {
        if ((val <= this.weight_limit) && (val >= 0)) {
          this.$store.commit('editor/changeItemWeight', {id: this.item.id, weight: val})
        } else {
          this.$forceUpdate()
        }
      }
    },
    item_quantity: {
      get() {
        return this.item.quantity
      },
      set(val) {
        if ((val <= this.quantity_limit) && (val >= 0)) {
          this.$store.commit('editor/changeItemQuantity', {id: this.item.id, quantity: val})
        } else {
          this.$forceUpdate()
        }
      }
    },
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
      }
    },
    resizeAll() {
      let a = this.$el.getElementsByClassName('autoresize')
      for (let i = 0; i < a.length; i++) {
        this.autoresize({target: a[i]})
      }
    },
    removeLeadingZero(e) {
      if ((String(e.target.value)[0] === '0') && (e.target.value.length > 1)) {
        e.target.value = String(e.target.value).slice(1)
      }
    }
  },
  mounted() {
    this.resizeAll()
    window.addEventListener("resize", this.resizeAll);
  },
}
</script>

<style scoped>
.item {
  padding: 3px 0;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.item.first, .item.middle {
  border-bottom: 1px dotted grey;
}

.item.first.last {
  border: none;
}

.item > * {
  margin: 0 2px;
}

input {
  font-size: 1em;
  border: none;
  padding: 5px;
}

textarea {
  font-size: 1em;
  padding: 5px;
}

.field {
  border-radius: 4px;
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
  cursor: text;
}

.name {
  width: 12em;
  min-width: 10em;
}

.description {
  width: 12em;
  min-width: 10em;
}

.weight {
  width: 3.5em;
}

.quantity {
  width: 3em;
}

.up:enabled {
  cursor: pointer;
}

.down:enabled {
  cursor: pointer;
}

.up, .down {
  visibility: hidden;
}

.item:hover .up, .item:hover .down {
  visibility: visible;
}

.item:hover .worn, .item:hover .consumable {
  visibility: visible;
}

.worn, .consumable {
  visibility: hidden;
  border-radius: 50%;
  border: 1px solid transparent;
  background-color: transparent;
  outline: none;
  color: grey;
}

.checked {
  visibility: visible;
  color: blue;
}

.worn:hover:enabled, .consumable:hover:enabled {
  color: black;
}

.worn:enabled {
  cursor: pointer;
}

.consumable:enabled {
  cursor: pointer;
}

.delete {
  visibility: hidden;
  outline: none;
  border: none;
  background-color: transparent;
  padding: 4px 6px;
}

.item:hover .delete {
  visibility: visible;
}

.delete:hover {
  color: red;
  cursor: pointer;
}

/*code below removes arrows from numeric inputs*/
.weight::-webkit-outer-spin-button,
.weight::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.weight[type=number] {
  -moz-appearance: textfield;
}

</style>