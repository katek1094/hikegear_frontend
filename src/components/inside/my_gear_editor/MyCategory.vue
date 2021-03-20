<template>
  <div class="my_category">
    <div class="my_category__header">
      <Tooltip text="naciśnij i przeciągnij w inne miejsce" direction="right">
        <span class="my_category__handle"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
      </Tooltip>
      <input ref="name_input" v-model.trim="category_name" :maxlength="max_name_length" :size="max_name_length"
             class="category__name" placeholder="nazwa kategorii" type="text">
      <span class="category__weight__label">waga</span>
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
    <draggable v-model="items" animation="700" class="my_items" group="items" item-key="id" handle=".my_item__handle"
               emptyInsertThreshold="50" :class="{no_drag_item: no_drag, drag_item: !no_drag}" @choose="toggleNoDrag"
               @unchoose="toggleNoDrag">
      <template #item="{element}">
        <MyItem :item="element" :category_id="category.id" :ref="setItemRef"/>
      </template>
    </draggable>
    <div class="my_category__footer">
      <button class="add-item" type="button" @click="addItem">
        <font-awesome-icon class="fa-md" icon="plus"/>
        dodaj przedmiot
      </button>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import MyItem from "@/components/inside/my_gear_editor/MyItem";
import {useStore} from "vuex";
import {computed} from "vue";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Tooltip from "@/components/Tooltip";
import {useNoDrag, useConfirmationDialog, useCategory} from "@/hooks";

export default {
  name: "MyCategory",
  components: {Tooltip, ConfirmationDialog, MyItem, draggable},
  props: {category: Object},
  setup(props) {
    const store = useStore()

    const category_name = computed({
      get: () => props.category.name,
      set: (val) => store.dispatch('my_gear/changeCategoryName', {
        category_id: props.category.id,
        new_value: val
      })
    })
    const is_the_only_category = computed(() => store.getters['my_gear/dynamic_list'].length === 1)
    const items = computed({
      get: () => props.category.items,
      set: (val) => store.dispatch('my_gear/moveItem', {
        new_category_items: val,
        category_id: props.category.id
      })
    })
    const deleteCategory = () => store.dispatch('my_gear/deleteCategory', props.category.id)

    const {
      max_name_length,
      name_input,
      addItem,
      setItemRef,
      resizeAllItems,
      focusName
    } = useCategory('my_gear/addNewItem', props.category.id)

    const are_any_items = computed(() => items.value.length !== 0)
    const {confirmation_dialog, displayConfirmationDialog} = useConfirmationDialog(are_any_items, deleteCategory)
    const {no_drag, toggleNoDrag} = useNoDrag()

    return {
      max_name_length, name_input, confirmation_dialog, no_drag,
      category_name, is_the_only_category, items,
      addItem, deleteCategory, setItemRef, resizeAllItems, focusName, displayConfirmationDialog, toggleNoDrag
    }
  }
}
</script>

<style scoped lang="scss">
.my_category {
  margin-top: 10px;
}

.category__name {
  width: 100%;
  box-sizing: border-box;
}

$handle_width: auto;
$weight_width: 3rem;
$delete_width: 30px;

.my_category__header {
  @include editor-category_grid;
  font-size: 1rem;
  grid-template-columns: $handle_width 1fr $weight_width $delete_width;
}

.my_category__footer {
  @include editor-category_grid;
  grid-template-columns: 1fr;
}

::v-deep(.my_item) {
  @include editor-category_grid;
  grid-template-columns: $handle_width 3fr 4fr $weight_width $delete_width;
}

.my_items {
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
  .no_drag_cat .my_category__header:hover .category__delete.deletable, ::v-deep(.no_drag_item .my_item:hover .item__delete),
  .no_drag_cat .my_category__header:hover .my_category__handle, ::v-deep(.no_drag_item .my_item:hover .my_item__handle),
  .sortable-chosen .my_category__header .my_category__handle, ::v-deep(.sortable-chosen.my_item .my_item__handle) {
    visibility: visible;
  }
  .category__delete:hover, ::v-deep(.item__delete:hover) {
    color: red;
    cursor: pointer;
  }
}

.my_category__handle, ::v-deep(.my_item__handle) {
  @include sort-handle;
}

.category__weight__label, ::v-deep(.my_item) {
  font-size: .8rem;
}

.category__weight__label {
  @include editor-input_and_label;
  align-self: flex-end;
}
</style>
