<template>
  <div class="category">
    <div class="category__header">
      <span class="category__handle"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
      <input class="category__name" type="text" v-model.trim="category_name" placeholder="nazwa kategorii"
             @input="changeName">
      <!--    TODO: add category description-->
      <span class="category__weight__label">waga</span>
      <span class="category__quantity__label">ilość</span>
      <button class="category__delete" :class="{deletable: !is_the_only_category}" type="button" @click="deleteCategory">
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
      <button class="category__delete" type="button">
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
      itemRefs: []
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
      this.$store.dispatch('editor/deleteCategory', this.category.list_index)
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
  margin: 6px;
}

.category__header, .category__footer, >>> .item {
  display: flex;
  padding: 0 4px;
  align-items: center;
}

.category__header {
  font-size: 1rem;
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
  margin: 2px 6px 2px 2px;
  padding: 6px;
  cursor: move;
  border-radius: 6px;
  font-size: .875rem;
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
  margin: 0 3px;
}

.category__weight__label, .category__quantity__label, .category__quantity__total, .category__weight__total {
  font-size: .75rem;
}

.category__weight__label, >>> .item__weight, .category__weight__total {
  padding: 5px;
  width: 2.8rem;
  box-sizing: border-box;
}

.category__quantity__label, >>> .item__quantity, .category__quantity__total {
  padding: 5px;
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

  .item__worn:hover:enabled, .item__consumable:hover:enabled {
    color: grey;
  }

  .category__quantity__label, >>> .item__quantity, .category__quantity__total {
    width: 2rem;
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
