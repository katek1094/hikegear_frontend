<template>
  <div class="category">
    <div class="category__header">
      <Tooltip text="naciśnij i przeciągnij w inne miejsce" direction="right">
        <span class="category__handle"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
      </Tooltip>
      <input ref="name_input" v-model.trim="category_name" :maxlength="max_name_length" :size="max_name_length"
             class="category__name" placeholder="nazwa kategorii" type="text">
      <span class="category__weight__label">waga</span>
      <span class="category__quantity__label">ilość</span>
      <Tooltip text="usuń kategorię" direction="left" size="small">
        <button :class="{deletable: !is_the_only_category, invisible: is_the_only_category}" class="category__delete"
                type="button"
                @click="displayConfirmationDialog">
          <font-awesome-icon class="fa-sm" icon="trash"/>
        </button>
      </Tooltip>
      <ConfirmationDialog ref="confirmation_dialog" @confirmed="deleteCategory">
        <template v-slot:header>na pewno chcesz usunąć tę kategorię?</template>
      </ConfirmationDialog>
    </div>
    <draggable v-model="items" animation="700" class="items" :group="{name: 'items', pull: pullPolicy, put: ['items']}"
               item-key="id" handle=".item__handle" emptyInsertThreshold="50" @choose="toggleNoDrag"
               @unchoose="toggleNoDrag" :class="{no_drag_item: no_drag, drag_item: !no_drag}">
      <template #item="{element}">
        <Item :item="element" :category_id="category.id" :ref="setItemRef"/>
      </template>
    </draggable>
    <div class="category__footer">
      <button class="category__add-item" type="button" @click="addItem">
        <font-awesome-icon class="fa-md" icon="plus"/>
        dodaj przedmiot
      </button>
      <span class="category__weight__total">{{ total_weight }}</span>
      <span class="category__quantity__total">{{ total_quantity }}</span>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Item from "@/components/inside/editor/Item";
import {computed} from 'vue';
import {useStore} from 'vuex';
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Tooltip from "@/components/Tooltip";
import {useConfirmationDialog, useNoDrag, useCategory} from "@/hooks.js";

export default {
  name: "Category",
  components: {Tooltip, ConfirmationDialog, Item, draggable},
  props: {
    category: Object,
  },
  setup(props) {
    const store = useStore()

    const category_name = computed({
      get: () => props.category.name,
      set: (val) => store.dispatch('editor/changeCategoryName', {
        category_id: props.category.id,
        new_value: val
      })
    })
    const is_the_only_category = computed(() => store.getters['editor/dynamic_list'].length === 1)
    const items = computed({
      get: () => props.category.items,
      set: (val) => store.dispatch('editor/moveItem', {
        new_category_items: val,
        category_id: props.category.id
      })
    })
    const total_weight = computed(() => {
      let result = 0
      for (const item of props.category.items) {
        result += item.weight * item.quantity
      }
      return result
    })
    const total_quantity = computed(() => {
      let result = 0
      for (const item of props.category.items) {
        result += item.quantity
      }
      return result
    })
    const pullPolicy = (to) => {
      if (to.el.className === 'my-gear_items') return false
      else if (to.el.className === 'items') return true
    }

    const deleteCategory = () => store.dispatch('editor/deleteCategory', props.category.id)

    const {
      max_name_length,
      name_input,
      addItem,
      setItemRef,
      resizeAllItems,
      focusName
    } = useCategory('editor/addItem', props.category.id)

    const are_any_items = computed(() => items.value.length !== 0)
    const {confirmation_dialog, displayConfirmationDialog} = useConfirmationDialog(are_any_items, deleteCategory)
    const {no_drag, toggleNoDrag} = useNoDrag()

    return {
      max_name_length,
      name_input,
      confirmation_dialog,
      no_drag,
      category_name,
      is_the_only_category,
      items,
      total_weight,
      total_quantity,
      addItem,
      displayConfirmationDialog,
      deleteCategory,
      setItemRef,
      resizeAllItems,
      pullPolicy,
      focusName,
      toggleNoDrag
    }
  }
}
</script>

<style lang="scss" scoped>
.category {
  @include editor-category;
}

$worn_consumable_width: auto;
$weight_width: $category-item_grid_weight_width;
$quantity_width: auto;  // <----------------------------------------------------------------------- check later
$delete_width: $category-item_grid_delete_width;

.category__header {
  grid-template-columns: $category-item_grid_handle_width 1fr $weight_width $quantity_width $delete_width;
}

.category__footer {
  grid-template-columns: 1fr $weight_width $quantity_width $delete_width;
}

::v-deep(.item) {
  @include category-item_grid;
  grid-template-columns: $category-item_grid_handle_width 3fr 4fr repeat(2, $worn_consumable_width) // <-------- check later
  $weight_width $quantity_width $delete_width;
}

.items {
  @include editor-items;
}

.sortable-chosen {
  @include sort-chosen;
}

.category__delete, ::v-deep(.item__delete) {
  @include editor-delete;
}

@media (hover: hover) and (pointer: fine) {
  .no_drag_cat .category__header:hover .category__delete.deletable, ::v-deep(.no_drag_item .item:hover .item__delete),
  .no_drag_cat .category__header:hover .category__handle, ::v-deep(.no_drag_item .item:hover .item__handle),
  .sortable-chosen .category__header .category__handle, ::v-deep(.sortable-chosen.item .item__handle) {
    visibility: visible;
  }
}

@media (hover: hover) and (pointer: fine) {
  .category__quantity__label, .category__quantity__total, ::v-deep(.item__quantity) {
    width: 2.8rem;
    box-sizing: border-box;
  }
}

//
//.category__weight__label, .category__quantity__label,
//.category__quantity__total, .category__weight__total, .item {
//  font-size: .8rem;
//}
//
//.category__weight__label, .category__quantity__label,
//.category__quantity__total, .category__weight__total {
//  @include editor-input_and_label;
//}
//
//.category__weight__label, .category__quantity__label {
//  align-self: flex-end;
//}
//
//@media (hover: none) and (pointer: coarse) {
//  .category__quantity__label, .category__quantity__total, ::v-deep(.item__quantity) {
//    width: 1.8rem;
//    box-sizing: border-box;
//  }
//  /*code below removes arrows from quantity input*/
//  ::v-deep(.item__quantity::-webkit-outer-spin-button),
//  ::v-deep(.item__quantity::-webkit-inner-spin-button) {
//    -webkit-appearance: none;
//  }
//  ::v-deep(.item__quantity[type=number]) {
//    -moz-appearance: textfield;
//  }
//}


</style>
