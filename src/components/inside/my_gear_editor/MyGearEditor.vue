<template>
  <BaseApp>
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
                 handle=".my_category__handle" item-key="id">
        <template #item="{element}">
          <MyCategory :category="element" :ref="setCategoryRef"/>
        </template>
      </draggable>
      <button class="add-category" type="button" @click="addCategory">
        <font-awesome-icon class="fa-md" icon="plus"/>
        dodaj kategorię
      </button>
    </div>
  </BaseApp>
</template>

<script>
import BaseApp from "@/components/inside/BaseApp";
import draggable from 'vuedraggable'
import MyCategory from "@/components/inside/my_gear_editor/MyCategory";
import {useStore} from 'vuex'
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import ImportToMyGear from "@/components/inside/my_gear_editor/ImportToMyGear";
import SaveProgress from "@/components/inside/SaveProgress";

export default {
  name: "MyGearEditor",
  components: {SaveProgress, ImportToMyGear, MyCategory, BaseApp, draggable},
  setup() {
    const store = useStore()

    const resizes_counter = ref(0) //every time window is resized, it increments, in handleWindowResize()

    const categories_refs = ref([])  //array of template refs created with setCategoryRef()
    const save_progress = ref(null) //template ref

    const editor_data_ready = computed(() => store.getters['my_gear/is_my_gear_data_ready'])
    const are_changes = computed(() => store.getters['my_gear/are_any_changes'])
    const are_any_backpacks = computed(() => store.getters['editor/backpacks'].length !== 0)

    const categories = computed({
      get: () => store.getters['my_gear/dynamic_list'],
      set: (val) => store.dispatch('my_gear/changeMyGear', val)
    })
    const setCategoryRef = (el) => {
      if (el) categories_refs.value.push(el)
    }
    const addCategory = async () => {
      await store.dispatch('my_gear/addNewCategory')
      categories_refs.value[categories_refs.value.length - 1].focusName()
      window.scrollTo(0, document.body.scrollHeight)
    }
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
    const handleWindowResize = () => {
      resizes_counter.value += 1
      const x = resizes_counter.value
      setTimeout(() => {
        if (x === resizes_counter.value) resizeAll()
      }, 300)
    }
    const handleCtrlS = (e) => {
      if (e.key === 's' && e.ctrlKey === true) {
        e.preventDefault()
        if (are_changes.value) save_progress.value.handleCtrlS()
        save()
      }
    }
    const handleDataChange = () => {
      categories_refs.value = []
      save_progress.value.handleEdit(are_changes.value)
    }
    onMounted(() => {
      window.addEventListener('keydown', handleCtrlS);
      window.addEventListener("resize", handleWindowResize);
      store.watch((state) => state.my_gear.dynamic, handleDataChange, {deep: true});
    })
    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("keydown", handleCtrlS);
      save()
    })

    return {
      editor_data_ready, categories, save_progress, are_changes, are_any_backpacks,
      setCategoryRef, addCategory, save
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

.add-category, ::v-deep(.add-item) {
  @include editor-add;
}

::v-deep(.category__name), ::v-deep(.item__name), ::v-deep(.item__description), ::v-deep(.item__weight) {
  @include editor-input__field;
}

::v-deep(.category__name) {
  font-weight: bold;
}

@media (min-width: $editor_big_width + 20px) {
  .my-gear_editor, .my_categories {
    width: $editor_big_width;
  }
}

</style>
