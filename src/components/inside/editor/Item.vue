<template>
  <div class="item">
    <span class="item__handle"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
    <Autoresizing ref="name" v-model.trim="item_name" :maxlength="max_name_length" :prevent-enter="true"
                  class="item__name" placeholder="nazwa"/>
    <Autoresizing ref="description" v-model="item_description" :maxlength="max_description_length"
                  class="item__description" placeholder="opis"/>
    <button :class="{ checked: item.worn }" :disabled="item.consumable" class="item__worn" @click="markAsWorn">
      <font-awesome-icon class="fa-md" icon="child"/>
    </button>
    <button :class="{ checked: item.consumable }" :disabled="item.worn" class="item__consumable"
            @click="markAsConsumable">
      <font-awesome-icon class="fa-md" icon="sync-alt"/>
      <!--      TODO: check changing size with icon classes md/sm-->
    </button>
    <input v-model.number="item_weight" :max="weight_limit" class="item__weight" min="0" name="item_weight"
           type="number" @blur="fillWithZero" @input="removeLeadingZero" @keydown="preventNumericChars">
    <input v-model.number="item_quantity" :max="quantity_limit" class="item__quantity" min="0" name="item_quantity"
           type="number" @blur="fillWithZero" @input="removeLeadingZero" @keydown="preventNumericChars">
    <button class="item__delete" type="button" @click="deleteItem">
      <font-awesome-icon class="fa-sm" icon="trash"/>
    </button>
  </div>
</template>

<script>
import Autoresizing from "@/components/Autoresizing";

export default {
  name: "Item",
  components: {Autoresizing},
  props: {
    item: Object,
  },
  data() {
    return {
      weight_limit: 99999,
      quantity_limit: 99,
      max_name_length: 60,
      max_description_length: 700,
      name_ref: {},
      description_ref: {},
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
        } else this.$forceUpdate()
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
        } else this.$forceUpdate()
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
    preventNumericChars(e) {
      if ((e.keyCode === 69) || (e.keyCode === 189)) {
        e.preventDefault()
      }
      if ((e.target.className === 'item__quantity') && (e.keyCode === 190)) {
        e.preventDefault()
      }
    },
    resizeAll() {
      this.$refs.name.autoresize()
      this.$refs.description.autoresize()
    },
    removeLeadingZero(e) {
      if ((String(e.target.value)[0] === '0') && (e.target.value.length > 1)) {
        e.target.value = String(e.target.value).slice(1)
      }
    },
    fillWithZero(e) {
      if (e.target.value === '') {
        this[e.target.getAttribute('name')] = 0
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.item:not(:last-child) {
  border-bottom: 1px dotted grey;
}

.item__worn, .item__consumable {
  border-radius: 50%;
  border: none;
  background-color: transparent;
  outline: none;
  color: grey;
  padding: 4px;
  font-size: 1.15em;
  margin: 0 3px;
}

.checked {
  color: blue;
}

@media (hover: hover) and (pointer: fine) {
  .item__worn, .item__consumable {
    visibility: hidden;
  }
  .item:hover .item__worn, .item:hover .item__consumable {
    visibility: visible;
  }
  .item__worn:hover:enabled, .item__consumable:hover:enabled {
    color: black;
  }
  .checked {
    visibility: visible;
  }
}

.item__worn:enabled, .item__consumable:enabled {
  cursor: pointer;
}

/*code below removes arrows from weight input*/
.item__weight::-webkit-outer-spin-button,
.item__weight::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.item__weight[type=number] {
  -moz-appearance: textfield;
}
</style>