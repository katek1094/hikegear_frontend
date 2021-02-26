<template>
  <BaseApp>
    <div class="my-gear_editor">
      <div class="progress" :style="{width: save_time_passed * 100 / timeout_before_save + '%' }"></div>
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

export default {
  name: "MyGearEditor",
  components: {MyCategory, BaseApp, draggable},
  setup() {
    const store = useStore()

    const edits_counter = ref(0) //every time some data in editor is changed, it increments, in handleDataChange()
    const timeout_before_save = ref(3000) //time between last change and saving data to the server
    const save_time_passed = ref(0) //how many time passed since last edit, edited in increaseSaveTimePassed()
    const resizes_counter = ref(0) //every time window is resized, it increments, in handleWindowResize()
    const timer_function_id = ref(null) //id of interval settled in onMounted, cleared in onBeforeUnmount

    const categories_refs = ref([])  //array of template refs created with setCategoryRef()

    const editor_data_ready = computed(() => store.getters['my_gear/is_my_gear_data_ready'])
    const are_changes = computed(() => store.getters['my_gear/are_any_changes'])

    const categories = computed({
      get: () => store.getters['my_gear/organized_list'],
      set: (val) => store.dispatch('my_gear/moveCategory', val)
    })
    const setCategoryRef = (el) => {
      if (el) categories_refs.value.push(el)
    }
    const addCategory = async () => {
      await store.dispatch('my_gear/addCategory')
      categories_refs.value[categories_refs.value.length - 1].focusName()
      window.scrollTo(0, document.body.scrollHeight)
    }
    const save = async () => {
      if (are_changes.value) {
        edits_counter.value = 0
        await store.dispatch('my_gear/updateMyGear')
        resizeAll()
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
        save()
      }
    }
    const handleDataChange = () => {
      categories_refs.value = []
      save_time_passed.value = 0
      edits_counter.value += 1
      const x = edits_counter.value
      setTimeout(() => {
        if (x === edits_counter.value) save()
      }, timeout_before_save.value)
    }
    const increaseSaveTimePassed = () => {
      if (editor_data_ready.value && are_changes.value) save_time_passed.value += 10
    }
    onMounted(() => {
      window.addEventListener('keydown', handleCtrlS);
      window.addEventListener("resize", handleWindowResize);
      store.watch((state) => state.my_gear.dynamic, handleDataChange, {deep: true});
      timer_function_id.value = setInterval(increaseSaveTimePassed, 10)
    })
    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("keydown", handleCtrlS);
      clearInterval(timer_function_id.value)
    })

    return {
      timeout_before_save, save_time_passed,
      editor_data_ready, categories,
      setCategoryRef, addCategory
    }
  }
}
</script>

<style scoped lang="scss">
.progress {
  height: 1px;
  background-color: grey;
}

.my-gear_editor{
  padding-bottom: 30px;
  @include flex-column-center;
  max-width: 100vw;
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
  /* tablet, landscape iPad, lo-res laptops ands desktops */
  .my-gear_editor, .my_categories {
    width: $editor_big_width;
  }
}

</style>
