<template>
  <div class="my_category">
    <div class="my_category__header">
      <span class="my_category__handle"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
      <input ref="name_input" v-model.trim="category_name" :maxlength="max_name_length" :size="max_name_length"
             class="category__name" placeholder="nazwa kategorii" type="text">
      <span class="category__weight__label">waga</span>
      <button :class="{deletable: !is_the_only_category, invisible: is_the_only_category}" class="category__delete"
              type="button"
              @click="deleteCategory">
        <font-awesome-icon class="fa-sm" icon="trash"/>
      </button>
    </div>
    <draggable v-model="items" animation="700" class="my_items" group="items" item-key="id" handle=".my_item__handle"
               emptyInsertThreshold="5  0">
      <template #item="{element}">
        <MyItem :item="element" :ref="setItemRef"/>
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
import {computed, onBeforeUpdate, ref} from "vue";

export default {
  name: "MyCategory",
  components: {MyItem, draggable},
  props: {category: Object},
  setup(props) {
    const store = useStore()

    const items_refs = ref([]) //array of template refs created with setItemRef()
    const max_name_length = 30
    const name_input = ref(null) //template ref

    const category_name = computed({
      get: () => props.category.name,
      set: (val) => store.dispatch('my_gear/changeElementProperty', {
        is_item: false,
        list_index: props.category.list_index,
        property: 'name',
        new_value: val
      })
    })
    const is_the_only_category = computed(() => store.getters['my_gear/organized_list'].length === 1)
    const items = computed({
      get: () => props.category.items,
      set: (val) => store.dispatch('my_gear/moveItem', {
        new_category: val,
        category_index: props.category.category_index
      })
    })
    const addItem = async () => {
      await store.dispatch('my_gear/addItem', props.category.list_index)
      items_refs.value[items_refs.value.length - 1].focusName()
      const added_item = items_refs.value[items_refs.value.length - 1].$el
      window.scrollTo(0, added_item.scrollHeight + document.documentElement.scrollTop)
    }
    const deleteCategory = () => {
      if (items.value.length !== 0) {
        const confirmation = confirm("na pewno chcesz usunąć tę kategorię?")
        if (confirmation) store.dispatch('my_gear/deleteCategory', props.category.list_index)
      } else store.dispatch('my_gear/deleteCategory', props.category.list_index)
    }
    const setItemRef = (el) => {
      if (el) items_refs.value.push(el)
    }
    const resizeAllItems = () => {
      for (const item_ref of items_refs.value) item_ref.resizeAll()
    }
    const focusName = () => name_input.value.focus()

    onBeforeUpdate(() => items_refs.value = [])

    return {
      max_name_length, name_input,
      category_name, is_the_only_category, items,
      addItem, deleteCategory, setItemRef, resizeAllItems, focusName
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
  //background-color: red;
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
  .my_category__header:hover .category__delete.deletable, ::v-deep(.my_item:hover .item__delete),
  .my_category__header:hover .my_category__handle, ::v-deep(.my_item:hover .my_item__handle), {
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
