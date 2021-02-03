<template>
  <div class="item" :class="{first: first, last: last, middle: !last && !first}">
    <span class="item__handle"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
    <textarea v-model.trim="item_name" class="item__name autoresize" placeholder="nazwa" rows="1" @input="autoresize"
              @keydown="preventEnter"/>
    <textarea v-model.trim="item_description" class="item__description autoresize" placeholder="opis" rows="1"
              @input="autoresize"/>
    <button :class="{ checked: item.worn }" :disabled="item.consumable" class="item__worn" @click="markAsWorn">
      <font-awesome-icon class="fa-sm" icon="child"/>
    </button>
    <button :class="{ checked: item.consumable }" :disabled="item.worn" class="item__consumable"
            @click="markAsConsumable">
      <font-awesome-icon class="fa-sm" icon="sync-alt"/>
    </button>
    <input v-model.number="item_weight" class="item__weight" type="number" @input="removeLeadingZero">
    <!--    TODO: add units-->
    <input v-model.number="item_quantity" :max="quantity_limit" class="item__quantity" min="0" type="number"
           @input="removeLeadingZero">
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
      quantity_limit: 99
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
          id: this.item.id,
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
          id: this.item.id,
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
        if ((val <= this.weight_limit) && (val >= 0)) {
          this.$store.dispatch('editor/changeElementProperty', {
            type: 'item',
            id: this.item.id,
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
            id: this.item.id,
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
      this.$store.dispatch('editor/switchWorn', this.item.id)
    },
    markAsConsumable() {
      this.$store.dispatch('editor/switchConsumable', this.item.id)
    },
    deleteItem() {
      this.$store.dispatch('editor/deleteItem', this.item.id)
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
  font-size: .75rem;
}

.item.first, .item.middle {
  border-bottom: 1px dotted grey;
}

.item.first.last {
  border: none;
}

.item__name {
  width: 100%;
  min-width: 4em;
}

.item__description {
  width: 100%;
  min-width: 4em;
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
  margin: 0;
}

.item__weight[type=number] {
  -moz-appearance: textfield;
}
</style>