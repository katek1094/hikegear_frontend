<template>
  <div :class="{first: first, last: last, middle: !last && !first}" class="item">
    <span class="item__handle"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
    <textarea ref="item_name" v-model.trim="item_name" :maxlength="max_name_length" class="item__name autoresize"
              placeholder="nazwa" @input="autoresize" @keydown="preventEnter"/>
    <textarea ref="item_description" v-model.trim="item_description" :maxlength="max_description_length"
              class="item__description autoresize" placeholder="opis" @input="autoresize"/>
    <button :class="{ checked: item.worn }" :disabled="item.consumable" class="item__worn" @click="markAsWorn">
      <font-awesome-icon class="fa-sm" icon="child"/>
    </button>
    <button :class="{ checked: item.consumable }" :disabled="item.worn" class="item__consumable"
            @click="markAsConsumable">
      <font-awesome-icon class="fa-sm" icon="sync-alt"/>
    </button>
    <div>
      <input v-model.number="item_weight" :max="weight_limit" class="item__weight" min="0" type="number"
             @input="removeLeadingZero" @keydown="preventNumericChars">
    </div>
    <div>
      <input v-model.number="item_quantity" :max="quantity_limit" class="item__quantity" min="0" type="number"
             @input="removeLeadingZero" @keydown="preventNumericChars">
    </div>
    <button class="item__delete" type="button" @click="deleteItem">
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
    last: Boolean,
    index: Number
  },
  data() {
    return {
      weight_limit: 99999,
      quantity_limit: 99,
      max_name_length: 60,
      max_description_length: 700,
    }
  },
  computed: {
    item_name: {
      get() {
        return this.item.name
      },
      set(val) {
        this.$store.dispatch('editor/changeElementProperty', {
          type: 'item',
          list_index: this.item.list_index,
          property: 'name',
          new_value: val
        })
      }
    },
    item_description: {
      get() {
        return this.item.description
      },
      set(val) {
        this.$store.dispatch('editor/changeElementProperty', {
          type: 'item',
          list_index: this.item.list_index,
          property: 'description',
          new_value: val
        })
      }
    },
    item_weight: {
      get() {
        return this.item.weight
      },
      set(val) {
        if ((val <= this.weight_limit) && (val >= 0) && (String(val).length <= String(this.weight_limit).length)) {
          this.$store.dispatch('editor/changeElementProperty', {
            type: 'item',
            list_index: this.item.list_index,
            property: 'weight',
            new_value: val
          })
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
          this.$store.dispatch('editor/changeElementProperty', {
            type: 'item',
            list_index: this.item.list_index,
            property: 'quantity',
            new_value: val
          })
        } else {
          this.$forceUpdate()
        }
      }
    },
  },
  methods: {
    markAsWorn() {
      this.$store.dispatch('editor/switchWorn', this.item.list_index)
    },
    markAsConsumable() {
      this.$store.dispatch('editor/switchConsumable', this.item.list_index)
    },
    deleteItem() {
      this.$store.dispatch('editor/deleteItem', this.item.list_index)
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
    preventNumericChars(e) {
      if ((e.keyCode === 69) || (e.keyCode === 189)) {
        e.preventDefault()
      }
      if ((e.target.className === 'item__quantity') && (e.keyCode === 190)) {
        e.preventDefault()
      }
    },
    resizeAll() {
      this.autoresize({target: this.$refs.item_name})
      this.autoresize({target: this.$refs.item_description})
    },
    removeLeadingZero(e) {
      if ((String(e.target.value)[0] === '0') && (e.target.value.length > 1)) {
        e.target.value = String(e.target.value).slice(1)
      }
    }
  },
  mounted() {
    this.resizeAll()
  },
}
</script>

<style scoped>
.item {
  font-size: .8rem;
}

.item.first, .item.middle {
  border-bottom: 1px dotted grey;
}

.item.first.last {
  border: none;
}

.item__name {
  width: 100%;
}

.item__description {
  width: 100%;
}

.item:hover .item__worn, .item:hover .item__consumable {
  visibility: visible;
}

.item__worn, .item__consumable {
  visibility: hidden;
  border-radius: 50%;
  border: 1px solid transparent;
  background-color: transparent;
  outline: none;
  color: grey;
  padding: 3px;
  font-size: 1.2em;
}

.checked {
  visibility: visible;
  color: blue;
}

@media (hover: hover) and (pointer: fine) {
  .item__worn:hover:enabled, .item__consumable:hover:enabled {
    color: black;
  }
}

.item__worn:enabled, .item__consumable:enabled {
  cursor: pointer;
}

/*code below removes arrows from numeric inputs*/
.item__weight::-webkit-outer-spin-button,
.item__weight::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.item__weight[type=number] {
  -moz-appearance: textfield;
}
</style>