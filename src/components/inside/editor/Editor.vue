<template>
  <BaseApp>
    <div v-if="editor_data_ready" class="wrapper">
      <div class="b_list_and_options">
        <div class="backpack__list">
          <div class="backpack__list__item" v-for="(backpack, index) in backpacks" :key="backpack.id"
               @click="changeBackpack(index)">
            <span v-if="backpack.name !== ''" :class="{active: backpack.id === backpack_id}">{{ backpack.name }}</span>
            <span v-if="backpack.name === ''" :class="{active: backpack.id === backpack_id}">bez nazwy</span>
            <button v-if="backpack.id === backpack_id" class="backpack__delete" type="button" @click="deleteBackpack">
              <font-awesome-icon class="fa-sm" icon="trash"/>
            </button>
          </div>
          <div class="backpack_buttons">
            <button class="add-backpack" type="button" @click="addBackpack">
              <font-awesome-icon class="fa-md" icon="plus"/>
              dodaj plecak
            </button>
            <button class="import-backpack" type="button" @click="$refs.lpImport.openModal()">
              <font-awesome-icon class="fa-md" icon="cloud-download-alt"/>
              importuj
            </button>
            <LpImport ref="lpImport"/>
          </div>
        </div>
        <div class="options">
          <router-link class="backpack__link" :to="{ name: 'backpack', params: { id: backpack_id }}">link do plecaka</router-link>
        </div>
      </div>
      <div class="editor">
        <AutoResizable ref="backpack_name_input" v-model.trim="backpack_name" :maxlength="max_backpack_name_length"
                       :prevent-enter="true" class="backpack__name" placeholder="nazwa plecaka"/>
        <Summary :summary_data="summary_data"/>
        <AutoResizable ref="backpack_description_input" v-model.trim="backpack_description"
                       :maxlength="max_backpack_description_length" class="backpack__description"
                       placeholder="opis plecaka"/>
        <div class="progress" :style="{width: save_time_passed * 100 / timeout_before_save + '%' }"></div>
        <draggable v-model="dynamic_list" animation="1000" class="categories" group="categories"
                   handle=".category__handle" item-key="id">
          <template #item="{element}">
            <Category :category="element" :ref="setCategoryRef"/>
          </template>
        </draggable>
        <button class="add-category" type="button" @click="addCategory">
          <font-awesome-icon class="fa-md" icon="plus"/>
          dodaj kategorię
        </button>
      </div>
      <MyGear/>
    </div>
    <div v-else>
      <p>nie masz żadnych plecaków</p>
      <button class="add-backpack" type="button" @click="addBackpack">
        <font-awesome-icon class="fa-md" icon="plus"/>
        dodaj plecak
      </button>
    </div>
  </BaseApp>
</template>

<script>
import draggable from 'vuedraggable'
import Category from "@/components/inside/editor/Category";
import Summary from "@/components/inside/editor/Summary";
import BaseApp from "@/components/inside/BaseApp";
import AutoResizable from "@/components/AutoResizable";
import MyGear from "@/components/inside/editor/MyGear";
import {ref, computed, onMounted, onBeforeUnmount} from 'vue';
import {useStore} from 'vuex';
import LpImport from "@/components/inside/editor/LpImport";

export default {
  name: "Editor",
  components: {LpImport, MyGear, AutoResizable, BaseApp, Summary, Category, draggable},
  setup() {
    const store = useStore()

    const edits_counter = ref(0) //every time some data in editor is changed, it increments, in handleDataChange()
    const timeout_before_save = ref(3000) //time between last change and saving data to the server
    const save_time_passed = ref(0) //how many time passed since last edit, edited in increaseSaveTimePassed()
    const resizes_counter = ref(0) //every time window is resized, it increments, in handleWindowResize()
    const max_backpack_name_length = ref(60)
    const max_backpack_description_length = ref(1000)
    const timer_function_id = ref(null) //id of interval settled in onMounted, cleared in onBeforeUnmount

    const categories_refs = ref([])  //array of template refs created with setCategoryRef()
    const backpack_name_input = ref(null)  //template ref
    const backpack_description_input = ref(null)  //template ref

    const backpack_id = computed(() => store.getters['editor/backpack_id'])
    const backpacks = computed(() => store.getters['editor/backpacks'])
    const editor_data_ready = computed(() => store.getters['editor/isEditorDataReady'])
    const are_changes = computed(() => store.getters['editor/are_any_changes'])
    const summary_data = computed(() => store.getters['editor/summary_data'])
    const dynamic_list = computed({
      get: () => store.getters['editor/dynamic_list'],
      set: (val) => store.dispatch('editor/moveCategory', val)
    })
    const backpack_name = computed({
      get: () => store.getters['editor/backpack_name'],
      set: (val) => store.dispatch('editor/renameBackpack', val)
    })
    const backpack_description = computed({
      get: () => store.getters['editor/backpack_description'],
      set: (val) => store.dispatch('editor/changeBackpackDescription', val)
    })
    const setCategoryRef = (el) => {
      if (el) categories_refs.value.push(el)
    }
    const addCategory = async () => {
      await store.dispatch('editor/addCategory')
      categories_refs.value[categories_refs.value.length - 1].focusName()
      window.scrollTo(0, document.body.scrollHeight)
    }
    const save = async (update_dynamic = true) => {
      if (are_changes.value) {
        edits_counter.value = 0
        await store.dispatch('editor/updateBackpack', {id: backpack_id.value, update_dynamic: update_dynamic})
      }
    }
    const changeBackpack = async (index) => {
      await save(false)
      await store.dispatch('editor/changeBackpack', index)
      resizeAll()
    }
    const addBackpack = () => store.dispatch('editor/addBackpack')
    const deleteBackpack = () => {
      let confirmation = confirm('na pewno chcesz usunąć ten plecak?')
      if (confirmation) store.dispatch('editor/deleteBackpack', backpack_id.value)
    }
    const resizeAll = () => {
      if (editor_data_ready.value) {
        for (const category_ref of categories_refs.value) category_ref.resizeAllItems()
        backpack_name_input.value.resize()
        backpack_description_input.value.resize()
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
      store.watch((state) => state.editor.dynamic, handleDataChange, {deep: true});
      timer_function_id.value = setInterval(increaseSaveTimePassed, 10)
    })
    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("keydown", handleCtrlS);
      clearInterval(timer_function_id.value)
    })

    return {
      timeout_before_save, save_time_passed, max_backpack_name_length, max_backpack_description_length,
      backpack_name_input, backpack_description_input,
      backpack_id, backpacks, editor_data_ready, summary_data, dynamic_list, backpack_name, backpack_description,
      setCategoryRef, addCategory, changeBackpack, addBackpack, deleteBackpack
    }
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
}

@media (min-width: $first_threshold) {
  .wrapper {
    display: grid;
    grid-template-columns: auto auto auto;
    justify-items: center;
    padding: 0 $grid_wrapper_padding;
    column-gap: $grid_gap;
  }
  .b_list_and_options {
    grid-column: 1;
  }
}

@media (min-width: $second_threshold) and (max-width: $first_threshold - 1px) {
  .wrapper {
    display: grid;
    justify-items: center;
    padding: 0 $grid_wrapper_padding;
    column-gap: $grid_gap;
  }
  .b_list_and_options {
    grid-column: 1;
  }
  .editor {
    grid-column: 1;
  }
  .my-gear_frame {
    grid-column: 2;
    grid-row: 1 / span 2;
  }
}

@media (max-width: $second_threshold - 1px) {
  .wrapper {
    @include flex-column-center;
  }
  .my-gear_frame {
    display: none;
  }
}

.progress {
  height: 1px;
  background-color: grey;
}

.backpack__list {
  background-color: $windows_color;
  border-radius: 4px;
  padding: 4px;
  width: $backpack_list_width;
  min-width: $backpack_list_width;
  box-sizing: border-box;
  align-self: flex-start;
}

.backpack__list__item {
  margin: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.backpack__list__item span {
  padding: 4px 8px;
  border-radius: 4px;
  word-wrap: anywhere;
}

.backpack__list__item span.active {
  background-color: white;
}

.backpack__list__item span:hover {
  cursor: pointer;
  text-decoration: underline;
}

.backpack__delete {
  outline: none;
  border: none;
  background-color: transparent;
  padding: 6px;
  font-size: 1em;
  margin-left: 10px;
}

.backpack__link {
  color: black;
  text-decoration: none;
  margin: 10px 0;

  &:hover {
    text-decoration: underline;
  }
}

.backpack_buttons {
  display: flex;
  justify-content: space-between;
}

.options {
  display: flex;
  justify-content: center;
}

@media (hover: hover) and (pointer: fine) {
  .backpack__delete:hover {
    color: red;
    cursor: pointer;
  }
}

.editor {
  padding-bottom: 30px;
  @include flex-column-center;
  max-width: 100vw;
}

.add-category, ::v-deep(.add-item), .add-backpack, .import-backpack {
  @include editor-add;
}

.add-backpack, .import-backpack {
  font-size: 1rem;
}

.backpack__name, .backpack__description, ::v-deep(.category__name), ::v-deep(.item__name), ::v-deep(.item__description),
::v-deep(.item__weight), ::v-deep(.item__quantity) {
  @include editor-input__field;
}

.backpack__name, ::v-deep(.category__name) {
  font-weight: bold;
}

.backpack__name {
  text-align: center;
  margin: .4rem 0;
  font-size: 1.4rem;
}

.backpack__description {
  width: 85%;
  font-size: .85rem;
  margin: 6px 0;
  padding: 5px;
}

@media (min-width: 480px) {
  /* smartphones, Android phones, landscape iPhone */

}

@media (min-width: 600px) {
  /* portrait tablets, portrait iPad, e-readers (Nook/Kindle), landscape 800x480 phones (Android) */

}

@media (min-width: $editor_big_width + 20px) {
  /* tablet, landscape iPad, lo-res laptops ands desktops */
  .editor, .categories {
    width: $editor_big_width;
  }
}

@media (min-width: 801px) {
  /* tablet, landscape iPad, lo-res laptops ands desktops */

}

@media (min-width: 1025px) {
  /* big landscape tablets, laptops, and desktops */

}

@media (min-width: 1281px) {
  /* hi-res laptops and desktops */

}
</style>
