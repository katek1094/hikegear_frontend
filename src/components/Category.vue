<template>
  <div class="category">
    <div class="category__header">
      <span class="category__handle"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
      <div>
        <input v-model.trim="category_name" :maxlength="max_name_length" class="category__name" :size="max_name_length"
               placeholder="nazwa kategorii" type="text">
      </div>
      <span class="category__weight__label">waga</span>
      <span class="category__quantity__label">ilość</span>
      <button :class="{deletable: !is_the_only_category, invisible: is_the_only_category}" class="category__delete"
              type="button"
              @click="deleteCategory">
        <font-awesome-icon class="fa-sm" icon="trash"/>
      </button>
    </div>
    <draggable v-model="items" animation="700" class="items" group="category__items" item-key="id"
               handle=".item__handle" emptyInsertThreshold="30">
      <template #item="{element, index}">
        <Item :first="category.items.indexOf(element) === 0" :item="element" :index="index" :ref="setItemRef"
              :last="category.items.indexOf(element) === category.items.length - 1"/>
      </template>
    </draggable>
    <div class="category__footer">
      <button class="add-item" type="button" @click="addItem">
        <font-awesome-icon class="fa-md" icon="plus"/>
        dodaj przedmiot
      </button>
      <span class="category__weight__total">{{ category.total_weight }}</span>
      <span class="category__quantity__total">{{ category.total_quantity }}</span>
      <button class="category__delete invisible" type="button">
        <font-awesome-icon class="fa-sm" icon="trash"/>
      </button>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Item from "@/components/Item";

export default {
  name: "Category",
  components: {Item, draggable},
  props: {
    category: Object,
    index: Number
  },
  data() {
    return {
      itemRefs: [],
      max_name_length: 30
    }
  },
  computed: {
    is_the_only_category() {
      return this.category.category_index === 0 && this.$store.getters['editor/organized_list'].length === 1
    },
    category_name: {
      get() {
        return this.category.name
      },
      set(val) {
        this.$store.dispatch('editor/changeElementProperty', {
          type: 'category',
          list_index: this.category.list_index,
          property: 'name',
          new_value: val
        })
      }
    },
    items: {
      get() {
        return this.category.items
      },
      set(val) {
        this.$store.dispatch('editor/moveItem', {new_category: val, category_index: this.category.category_index})
      }
    },
  },
  methods: {
    addItem() {
      this.$store.dispatch('editor/addItem', this.category.list_index)
    },
    deleteCategory() {
      let confirmation = confirm("na pewno chcesz usunąć tę kategorię?")
      if (confirmation) this.$store.dispatch('editor/deleteCategory', this.category.list_index)
    },
    setItemRef(el) {
      if (el) this.itemRefs.push(el)
    },
    resizeAllItems() {
      for (let i = 0; i < this.itemRefs.length; i++) {
        this.itemRefs[i].resizeAll()
      }
    }
  },
  beforeUpdate() {
    this.itemRefs = []
  },
}
</script>

<style scoped>
.category {
  margin: 16px 0;
}

.category__header, .category__footer, >>> .item {
  display: flex;
  padding: 0 3px;
  align-items: center;
}

.category__header {
  font-size: 1rem;
}

.category__name {
  width: 90%;
  box-sizing: border-box;
}

.items {
  border-top: 1px solid grey;
  border-bottom: 1px solid grey;
}

.category__delete, >>> .item__delete {
  visibility: hidden;
  outline: none;
  border: none;
  background-color: transparent;
  padding: 4px 6px;
}

.category__header:hover .category__delete.deletable, >>> .item:hover .item__delete {
  visibility: visible;
}

@media (hover: hover) and (pointer: fine) {
  .category__delete:hover, >>> .item__delete:hover {
    color: red;
    cursor: pointer;
  }
}

.category__handle, >>> .item__handle {
  margin: 0 4px 0 0;
  padding: 6px;
  cursor: move;
  border-radius: 6px;
  font-size: 1.15rem;
  visibility: hidden;
}

.category__header:hover .category__handle, >>> .item:hover .item__handle {
  visibility: visible;
}

.category__handle:hover, >>> .item__handle:hover {
  background-color: white;
}

.sortable-chosen {
  transform: scale(1.01);
  box-shadow: 4px 4px 4px grey;
}

.category__weight__label, .category__quantity__label, .category__delete, >>> .item__delete, >>> .item__worn,
>>> .item__consumable, >>> .item__description, >>> .item__name, >>> .item__weight, >>> .item__quantity,
.category__quantity__total, .category__weight__total {
  margin: 0 2px;
}

.category__weight__label, .category__quantity__label, .category__quantity__total, .category__weight__total {
  font-size: .8rem;
}

.category__weight__label, >>> .item__weight, .category__weight__total {
  padding: 5px 8px 5px 4px;
  width: 2.8rem;
  box-sizing: border-box;
}

.category__quantity__label, >>> .item__quantity, .category__quantity__total {
  padding: 5px 8px 5px 4px;
  width: 2.8rem;
  box-sizing: border-box;
}

.category__weight__label, .category__weight__total {
  margin-left: auto;
}

.category__weight__label, .category__quantity__label {
  align-self: flex-end;
}

@media (hover: none) and (pointer: coarse) {
  .category__handle, >>> .item__handle, .category__delete, >>> .item__delete, >>> .item__worn, >>> .item__consumable {
    visibility: visible;
  }

  .invisible {
    visibility: hidden;
  }

  .item__worn:hover:enabled, .item__consumable:hover:enabled {
    color: grey;
  }

  .category__quantity__label, >>> .item__quantity, .category__quantity__total {
    width: 1.8rem;
  }

  .category__delete, >>> .item__delete {
    margin: 0 2px 0 4px;
  }
  .category__handle, >>> .item__handle {
    margin-left: 2px;
  }


  >>> .item__quantity::-webkit-outer-spin-button,
  >>> .item__quantity::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  >>> .item__quantity[type=number] {
    -moz-appearance: textfield;
  }
}

@media (max-width: 479px) {

}

@media (min-width: 480px) {

}

@media (min-width: 600px) {

}

@media (min-width: 801px) {

}

@media (min-width: 1025px) {

}

@media (min-width: 1281px) {

}
</style>
