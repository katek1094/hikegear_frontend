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
      <template #item="{element}">
        <Item :item="element" :ref="setItemRef"/>
      </template>
    </draggable>
    <div class="category__footer">
      <button class="add-item" type="button" @click="addItem">
        <font-awesome-icon class="fa-md" icon="plus"/>
        dodaj przedmiot
      </button>
      <span class="category__weight__total">{{ category.total_weight }}</span>
      <span class="category__quantity__total">{{ category.total_quantity }}</span>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Item from "@/components/inside/editor/Item";

export default {
  name: "Category",
  components: {Item, draggable},
  props: {
    category: Object,
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

<style lang="scss" scoped>
.category {
  margin: 16px 0;
}

.category__name {
  width: 100%;
  box-sizing: border-box;
}

$handle_width: auto;
$worn_consumable_width: auto;
$weight_width: 2.8rem;
$quantity_width: auto;
$delete_width: 30px;

.category__header {
  @include editor-category_grid;
  font-size: 1rem;
  grid-template-columns: $handle_width 1fr $weight_width $quantity_width $delete_width;
}

.category__footer {
  @include editor-category_grid;
  grid-template-columns: 1fr $weight_width $quantity_width $delete_width;
}

::v-deep(.item) {
  @include editor-category_grid;
  grid-template-columns: $handle_width 1fr 1fr repeat(2, $worn_consumable_width)
  $weight_width $quantity_width $delete_width;
}

.items {
  border-top: 1px solid grey;
  border-bottom: 1px solid grey;
}

.sortable-chosen {
  transform: scale(1.01);
  box-shadow: 4px 4px 4px grey;
}

.category__delete, ::v-deep(.item__delete) {
  outline: none;
  border: none;
  font-size: 0.8rem;
  background-color: transparent;
  padding: 6px;
  width: $delete_width;
  box-sizing: border-box;
}

@media (hover: hover) and (pointer: fine) {
  .category__delete, ::v-deep(.item__delete), .category__handle, ::v-deep(.item__handle), {
    visibility: hidden;
  }
  .category__header:hover .category__delete.deletable, ::v-deep(.item:hover .item__delete),
  .category__header:hover .category__handle, ::v-deep(.item:hover .item__handle), {
    visibility: visible;
  }
  .category__delete:hover, ::v-deep(.item__delete:hover) {
    color: red;
    cursor: pointer;
  }
  .category__handle:hover, ::v-deep(.item__handle:hover) {
    background-color: white;
  }
  .category__quantity__label, .category__quantity__total, ::v-deep(.item__quantity) {
    width: 2.8rem;
    box-sizing: border-box;
  }
}

.category__handle, ::v-deep(.item__handle) {
  margin-right: 6px;
  padding: 7px 7px 3px 7px;
  cursor: move;
  border-radius: 6px;
  font-size: 1.15rem;
}

.category__weight__label, .category__quantity__label,
.category__quantity__total, .category__weight__total, .item {
  font-size: .8rem;
}

.category__weight__label, .category__quantity__label,
.category__quantity__total, .category__weight__total {
  @include editor-input_and_label;
}

.category__weight__label, .category__quantity__label {
  align-self: flex-end;
}

@media (hover: none) and (pointer: coarse) {
  .category__quantity__label, .category__quantity__total, ::v-deep(.item__quantity) {
    width: 1.8rem;
    box-sizing: border-box;
  }
  /*code below removes arrows from quantity input*/
  ::v-deep(.item__quantity::-webkit-outer-spin-button),
  ::v-deep(.item__quantity::-webkit-inner-spin-button) {
    -webkit-appearance: none;
  }
  ::v-deep(.item__quantity[type=number]) {
    -moz-appearance: textfield;
  }
}

</style>
