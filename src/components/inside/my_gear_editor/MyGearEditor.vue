<template>
  <InsideBaseApp>
    <div v-if="editor_data_ready" class="my-gear_editor">
      <div class="options">
        <button v-if="are_any_backpacks" type="button" class="import__gear" @click="$refs.importGear.openModal">
          <font-awesome-icon class="fa-lg" icon="arrow-alt-circle-down"/>
          dodaj sprzęt z plecaka
        </button>
        <ImportToMyGear ref="importGear"/>
        <SaveProgress :data_ready="editor_data_ready" :are_changes="are_changes" ref="save_progress" @save="save"/>
      </div>
      <draggable v-model="categories" animation="1000" class="my_categories" group="categories"
                 handle=".my_category__handle" item-key="id" :class="{no_drag_cat: no_drag, drag_cat: !no_drag}"
                 @choose="toggleNoDrag" @unchoose="toggleNoDrag">
        <template #item="{element}">
          <MyCategory :category="element" :ref="setCategoryRef"/>
        </template>
      </draggable>
      <button class="add-category" type="button" @click="addCategory">
        <font-awesome-icon class="fa-md" icon="plus"/>
        dodaj kategorię
      </button>
    </div>
  </InsideBaseApp>
</template>

<script>
import InsideBaseApp from "@/components/inside/InsideBaseApp";
import draggable from 'vuedraggable'
import MyCategory from "@/components/inside/my_gear_editor/MyCategory";
import {useStore} from 'vuex'
import {computed} from "vue";
import ImportToMyGear from "@/components/inside/my_gear_editor/ImportToMyGear";
import SaveProgress from "@/components/inside/SaveProgress";
import {useAutoresizeAll, useNoDrag, useCategories, useEditor} from "@/hooks";

export default {
  name: "MyGearEditor",
  components: {SaveProgress, ImportToMyGear, MyCategory, InsideBaseApp, draggable},
  setup() {
    const store = useStore()

    const editor_data_ready = computed(() => store.getters['my_gear/is_my_gear_data_ready'])
    const are_changes = computed(() => store.getters['my_gear/are_any_changes'])
    const are_any_backpacks = computed(() => store.getters['editor/backpacks'].length !== 0)

    const categories = computed({
      get: () => store.getters['my_gear/dynamic_list'],
      set: (val) => store.dispatch('my_gear/changeMyGear', val)
    })
    const save = async () => {
      if (are_changes.value) {
        await store.dispatch('my_gear/updateMyGear')
            .then(status => {
              if (status === 'success' && save_progress.value) save_progress.value.handleSaveSuccess()
            })
      }
    }
    const resizeAll = () => {
      if (editor_data_ready.value) {
        for (const category_ref of categories_refs.value) category_ref.resizeAllItems()
      }
    }
    const {categories_refs, addCategory, setCategoryRef} = useCategories('my_gear/addNewCategory')
    const save_progress = useEditor(are_changes, save, categories_refs, (state) => state.my_gear.dynamic)
    useAutoresizeAll(resizeAll)
    const {no_drag, toggleNoDrag} = useNoDrag()

    return {
      editor_data_ready, categories, save_progress, are_changes, are_any_backpacks, no_drag,
      setCategoryRef, addCategory, save, toggleNoDrag
    }
  }
}
</script>

<style scoped lang="scss">
.progress {
  height: 1px;
  background-color: grey;
}

.import__gear {
  @include editor-add;
  font-size: .9rem;
}

.my-gear_editor {
  padding-bottom: 30px;
  @include flex-column-center;
  max-width: 100vw;
}

.options {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}

.add-category {
  @include editor-add;
}

::v-deep(.item__name), ::v-deep(.item__description), ::v-deep(.item__weight) {
  @include editor-input__field;
}


@media (min-width: $editor_big_width + 20px) {
  .my-gear_editor, .my_categories {
    width: $editor_big_width;
  }
}

</style>
