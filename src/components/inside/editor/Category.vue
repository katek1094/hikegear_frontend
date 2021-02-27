<template>
  <div class="category">
    <div class="category__header">
      <span class="category__handle"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
      <input ref="name_input" v-model.trim="category_name" :maxlength="max_name_length" :size="max_name_length"
             class="category__name" placeholder="nazwa kategorii" type="text">
      <span class="category__weight__label">waga</span>
      <span class="category__quantity__label">ilość</span>
      <button :class="{deletable: !is_the_only_category, invisible: is_the_only_category}" class="category__delete"
              type="button"
              @click="deleteCategory">
        <font-awesome-icon class="fa-sm" icon="trash"/>
      </button>
    </div>
    <draggable v-model="items" animation="700" class="items" :group="{name: 'items', pull: pullPolicy, put: ['items']}"
               item-key="id" handle=".item__handle" emptyInsertThreshold="50">
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
import {ref, computed, onBeforeUpdate} from 'vue';
import {useStore} from 'vuex';

export default {
  name: "Category",
  components: {Item, draggable},
  props: {
    category: Object,
  },
  setup(props) {
    const store = useStore()

    const items_refs = ref([]) //array of template refs created with setItemRef()
    const max_name_length = 30
    const name_input = ref(null) //template ref

    const category_name = computed({
      get: () => props.category.name,
      set: (val) => store.dispatch('editor/changeElementProperty', {
        type: 'category',
        list_index: props.category.list_index,
        property: 'name',
        new_value: val
      })
    })
    const is_the_only_category = computed(() => store.getters['editor/organized_list'].length === 1)
    const items = computed({
      get: () => props.category.items,
      set: (val) => store.dispatch('editor/moveItem', {
        new_category: val,
        category_index: props.category.category_index
      })
    })
    const addItem = async () => {
      await store.dispatch('editor/addItem', props.category.list_index)
      items_refs.value[items_refs.value.length - 1].focusName()
      const added_item = items_refs.value[items_refs.value.length - 1].$el
      window.scrollTo(0, added_item.scrollHeight + document.documentElement.scrollTop)
    }
    const deleteCategory = () => {
      if (items.value.length !== 0) {
        const confirmation = confirm("na pewno chcesz usunąć tę kategorię?")
        if (confirmation) store.dispatch('editor/deleteCategory', props.category.list_index)
      } else store.dispatch('editor/deleteCategory', props.category.list_index)
    }
    const setItemRef = (el) => {
      if (el) items_refs.value.push(el)
    }
    const resizeAllItems = () => {
      for (const item_ref of items_refs.value) item_ref.resizeAll()
    }
    const pullPolicy = (to) => {
      if (to.el.className === 'my-gear_items') return false
      else if (to.el.className === 'items') return true
    }
    const focusName = () => name_input.value.focus()

    onBeforeUpdate(() => items_refs.value = [])

    return {
      max_name_length, name_input,
      category_name, is_the_only_category, items,
      addItem, deleteCategory, setItemRef, resizeAllItems, pullPolicy, focusName
    }
  }
}
</script>

<style lang="scss" scoped>
.category {
  margin-top: 10px;
}

.category__name {
  width: 100%;
  box-sizing: border-box;
}

$handle_width: auto;
$worn_consumable_width: auto;
$weight_width: 3rem;
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
  grid-template-columns: $handle_width 3fr 4fr repeat(2, $worn_consumable_width)
  $weight_width $quantity_width $delete_width;
}

.items {
  @include editor-items;
}

.sortable-chosen {
  @include sort-chosen;
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
  .category__delete, ::v-deep(.item__delete) {
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
  .category__quantity__label, .category__quantity__total, ::v-deep(.item__quantity) {
    width: 2.8rem;
    box-sizing: border-box;
  }
}

.category__handle, ::v-deep(.item__handle) {
  @include sort-handle;
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
