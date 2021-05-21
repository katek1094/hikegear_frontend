<template>
  <InsideBaseApp>
    <div v-if="editor_data_ready" class="editor__wrapper" :class="{my_gear_minimized: my_gear_minimized}">
      <!--      BACKPACKS LIST-->
      <div class="backpacks_list">
        <div class="backpacks_list__items">
          <div class="backpacks_list__item" v-for="(backpack, index) in backpacks" :key="backpack.id">
          <span v-if="backpack.name !== ''" :class="{active: backpack.id === backpack_id}"
                class="backpacks_list__item__name" @click="changeBackpack(index)">
            {{ backpack.name }}<font-awesome-icon v-if="backpack.shared" class="fa-sm is_shared" icon="share-alt"/>
          </span>
            <span v-else :class="{active: backpack.id === backpack_id}" class="backpacks_list__item__name"
                  @click="changeBackpack(index)">bez nazwy</span>
            <Tooltip text="usuń listę" direction="left" size="small">
              <button v-if="backpack.id === backpack_id" class="backpacks_list__delete" type="button"
                      @click="displayConfirmationDialogBackpackDelete">
                <font-awesome-icon class="fa-sm" icon="trash"/>
              </button>
            </Tooltip>
            <ConfirmationDialog ref="backpack_delete_confirmation_dialog" @confirmed="deleteBackpack">
              <template v-slot:header>na pewno chcesz usunąć tę listę?</template>
            </ConfirmationDialog>
          </div>
        </div>
        <div v-if="can_add_backpack" class="backpacks_list__buttons">
          <button class="add_backpack" type="button" @click="addBackpack">
            <font-awesome-icon class="fa-md" icon="plus"/>
            dodaj nową listę
          </button>
          <button class="import_backpack" type="button" @click="$refs.import_backpack.openModal">
            <font-awesome-icon class="fa-md" icon="cloud-download-alt"/>
            importuj
          </button>
        </div>
      </div>
      <!--      EDITOR-->
      <div class="editor">
        <div class="editor__options">
          <div class="editor__options__shared">
            <div class="editor__options__shared_input_and_info">
              <label class="hg-switch editor__options__shared_input"
                     @click.prevent="displayConfirmationDialogToggleShared">
                <input class="hg-switch__input" type="checkbox" :checked="is_shared">
                <span class="hg-switch__slider"></span>
              </label>
              <ConfirmationDialog v-if="is_shared" ref="toggle_shared_confirmation_dialog" @confirmed="toggleShared">
                <template v-slot:header>Na pewno chcesz przestać udostępniać tę listę?</template>
                <template v-slot:body>Link do twojej listy przestanie działać i nikt oprócz ciebie nie będzie miał do
                  niej dostępu.
                </template>
              </ConfirmationDialog>
              <ConfirmationDialog v-else ref="toggle_shared_confirmation_dialog" @confirmed="toggleShared">
                <template v-slot:header>Na pewno chcesz udostępnić tę listę?</template>
                <template v-slot:body>Każdy będzie mógł ją zobaczyć i importować</template>
              </ConfirmationDialog>
              <span v-if="is_shared" class="editor__options__shared_info shared">udostępnij</span>
              <span v-else class="editor__options__shared_info">udostępnij</span>
            </div>
            <router-link v-if="is_shared" class="editor__options__link hg-link"
                         :to="{ name: 'backpack', params: { hash: backpack_hash }}">
              <font-awesome-icon class="fa-md" icon="share"/>
              link do listy
            </router-link>
          </div>
          <div class="editor__options__progress_and_info">
            <SaveProgress :data_ready="editor_data_ready" :are_changes="are_changes" ref="save_progress" @save="save"/>
            <Tooltip text="jak korzystać z aplikacji?" size="small">
              <button class="editor__options__info" type="button" @click="$refs.instruction.openModal">
                <font-awesome-icon class="fa-md" icon="question"/>
              </button>
            </Tooltip>
          </div>
        </div>
        <AutoResizable ref="backpack_name_input" v-model.trim="backpack_name" :maxlength="max_backpack_name_length"
                       :prevent-enter="true" class="backpack__name" placeholder="nazwa listy"/>
        <Summary v-show="summary_data.total_weight !== 0" :summary_data="summary_data"/>
        <AutoResizable ref="backpack_description_input" v-model.trim="backpack_description"
                       :maxlength="max_backpack_description_length" class="backpack__description"
                       placeholder="opis listy / wyprawy"/>
        <draggable v-model="categories" animation="1000" class="categories" group="categories"
                   handle=".category__handle" item-key="id" @choose="toggleNoDrag" @unchoose="toggleNoDrag"
                   :class="{no_drag_cat: no_drag, drag_cat: !no_drag}">
          <template #item="{element}">
            <Category :category="element" :ref="setCategoryRef"/>
          </template>
        </draggable>
        <button v-if="can_add_category" class="add-category" type="button" @click="addCategory">
          <font-awesome-icon class="fa-md" icon="plus"/>
          dodaj kategorię
        </button>
      </div>
      <!--      MY GEAR-->
      <MyGear/>
    </div>
    <!--    NO BACKPACKS-->
    <div v-else class="no_backpacks">
      <p>nie masz żadnych list sprzętu</p>
      <div class="no_backpacks__buttons">
        <button class="add_backpack" type="button" @click="addBackpack">
          <font-awesome-icon class="fa-md" icon="plus"/>
          dodaj nową listę
        </button>
        <button class="import_backpack" type="button" @click="$refs.import_backpack.openModal">
          <font-awesome-icon class="fa-md" icon="cloud-download-alt"/>
          importuj
        </button>
      </div>
    </div>
    <!--    MODALS-->
    <ImportBackpack ref="import_backpack"/>
    <Instruction ref="instruction"/>
  </InsideBaseApp>
</template>

<script>
import draggable from 'vuedraggable'
import Category from "@/components/inside/editor/Category";
import Summary from "@/components/inside/editor/Summary";
import InsideBaseApp from "@/components/inside/InsideBaseApp";
import AutoResizable from "@/components/AutoResizable";
import MyGear from "@/components/inside/editor/MyGear";
import {ref, computed} from 'vue';
import {useStore} from 'vuex';
import ImportBackpack from "@/components/inside/editor/ImportBackpack";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import SaveProgress from "@/components/inside/SaveProgress";
import {hashids} from "@/functions";
import Tooltip from "@/components/Tooltip";
import {useNoDrag, useAutoresizeAll, useCategories, useEditor, useConfirmationDialog} from "@/hooks";
import Instruction from "@/components/inside/editor/Instruction";
import Constants from '@/constants'

export default {
  name: "Editor",
  components: {
    Instruction,
    Tooltip,
    SaveProgress,
    ConfirmationDialog,
    ImportBackpack,
    MyGear,
    AutoResizable,
    InsideBaseApp,
    Summary,
    Category,
    draggable
  },
  setup() {
    const store = useStore()

    const max_backpack_name_length = Constants.BACKPACK_MAX_NAME_LENGTH
    const max_backpack_description_length = Constants.BACKPACK_MAX_DESCRIPTION_LENGTH

    const backpack_name_input = ref(null)  //template ref
    const backpack_description_input = ref(null)  //template ref

    const backpack_id = computed(() => store.getters['editor/backpack_id'])
    const backpacks = computed(() => store.getters['editor/backpacks'])
    const editor_data_ready = computed(() => store.getters['editor/isEditorDataReady'])
    const are_changes = computed(() => store.getters['editor/are_any_changes'])
    const summary_data = computed(() => store.getters['editor/summary_data'])
    const can_add_backpack = computed(() => backpacks.value.length < Constants.MAX_BACKPACKS_AMOUNT)
    const categories = computed({
      get: () => store.getters['editor/dynamic_list'],
      set: (val) => store.dispatch('editor/moveCategory', val)
    })
    const is_shared = computed(() => store.getters['editor/is_shared'])
    const toggleShared = () => store.dispatch('editor/switchShared')
    const backpack_name = computed({
      get: () => store.getters['editor/backpack_name'],
      set: (val) => store.dispatch('editor/renameBackpack', val)
    })
    const backpack_description = computed({
      get: () => store.getters['editor/backpack_description'],
      set: (val) => store.dispatch('editor/changeBackpackDescription', val)
    })
    const backpack_hash = computed(() => hashids.encode(backpack_id.value))

    const save = async (update_dynamic = true) => {
      if (are_changes.value) {
        await store.dispatch('editor/updateBackpack', {id: backpack_id.value, update_dynamic: update_dynamic})
            .then(status => {
              if (status === 'success' && save_progress.value) save_progress.value.handleSaveSuccess()
            })
      }
    }
    const changeBackpack = async (index) => {
      await save(false)
      await store.dispatch('editor/changeBackpack', index)
      resizeAll()
    }
    const addBackpack = async () => {
      await save(false)
      await store.dispatch('editor/addBackpack')
      resizeAll()
    }
    const deleteBackpack = () => store.dispatch('editor/deleteBackpack', backpack_id.value)
    const {
      confirmation_dialog: backpack_delete_confirmation_dialog,
      displayConfirmationDialog: displayConfirmationDialogBackpackDelete
    } = useConfirmationDialog()
    const {
      confirmation_dialog: toggle_shared_confirmation_dialog,
      displayConfirmationDialog: displayConfirmationDialogToggleShared
    } = useConfirmationDialog()

    const resizeAll = () => {
      if (editor_data_ready.value) {
        for (const category_ref of categories_refs.value) category_ref.resizeAllItems()
        backpack_name_input.value.resize()
        backpack_description_input.value.resize()
      }
    }
    const {
      categories_refs,
      can_add_category,
      addCategory,
      setCategoryRef
    } = useCategories('editor/addCategory', categories)
    const save_progress = useEditor(are_changes, save, categories_refs, (state) => state.editor.dynamic)
    useAutoresizeAll(resizeAll)
    const {no_drag, toggleNoDrag} = useNoDrag()

    store.watch((state => state.my_gear_minimized), () => setTimeout(resizeAll, 50)
    )
    const my_gear_minimized = computed(() => store.getters['is_my_gear_minimized'])

    return {
      my_gear_minimized,
      max_backpack_name_length,
      max_backpack_description_length,
      no_drag,
      backpack_name_input,
      backpack_description_input,
      backpack_delete_confirmation_dialog,
      toggle_shared_confirmation_dialog,
      save_progress,
      is_shared,
      backpack_id,
      backpacks,
      editor_data_ready,
      summary_data,
      categories,
      backpack_name,
      backpack_description,
      can_add_category,
      can_add_backpack,
      are_changes,
      backpack_hash,
      setCategoryRef,
      addCategory,
      changeBackpack,
      addBackpack,
      deleteBackpack,
      toggleShared,
      displayConfirmationDialogBackpackDelete,
      displayConfirmationDialogToggleShared,
      save,
      toggleNoDrag,
    }
  },
}
</script>

<style lang="scss" scoped>
.backpacks_list {
  box-sizing: border-box;
  background-color: $windows_color;
  border-radius: 4px;
  padding: 4px;
  width: 94%;
  max-width: $backpack_list_max_width; // <---------------------------------------------------- check later
  margin: 5px 0;

  & .is_shared {
    color: blue;
    margin-left: 10px;
  }

  &__items {
    box-sizing: border-box;
    max-height: 260px;
    overflow-y: auto;
  }

  &__item {
    padding: 4px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__name {
      padding: 4px 8px;
      border-radius: 4px;
      word-wrap: anywhere;

      &.active {
        background-color: white;
      }

      @media (hover: hover) and (pointer: fine) {
        &:hover {
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
  }

  &__delete {
    outline: none;
    border: none;
    background-color: transparent;
    padding: 6px;
    font-size: 1em;

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        color: red;
        cursor: pointer;
      }
    }
  }
}

.editor__options {
  &__shared {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
  }

  &__shared_input_and_info {
    display: flex;
    align-items: center;
  }

  &__shared__input {

  }

  &__shared_info {
    color: grey;
    margin: 0 6px;

    &.shared {
      color: initial;
    }
  }

  &__link {
    margin: 0 6px 0 10px;
  }

  &__progress_and_info {
    flex-grow: 3;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  &__info {
    color: black;
    border-radius: 50%;
    outline: none;
    border: none;
    $info_size: 36px;
    width: $info_size;
    height: $info_size;
    font-size: 1rem;
    background-color: transparent;

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        color: blue;
        cursor: pointer;
      }
    }
  }
}

.backpacks_list__buttons, .no_backpacks__buttons {
  padding: 4px 0;
  display: flex;
  justify-content: space-around;
}

.no_backpacks {
  @include flex-column-center;
}

.add_backpack, .import_backpack, .add-category {
  @include editor-add;
}

.add_backpack, .import_backpack {
  font-size: 1rem;
}

.editor {
  @include editor;
}

.backpack__name {
  @include editor-input__field;
  font-weight: bold;
  text-align: center;
  margin: 5px 0;
  font-size: 1.4rem;
}

.backpack__description {
  @include editor-input__field;
  width: 85%;
  font-size: .85rem;
  margin: 6px 0;
  padding: 5px;
}

.categories {
  width: 100%;
}

@media (min-width: 480px) {
  /* smartphones, Android phones, landscape iPhone */
  .editor {
    width: 100%;
  }
  .my-gear_window {
    min-width: $my_gear_min_width;
  }
}

@media (min-width: 600px) {
  /* portrait tablets, portrait iPad, e-readers (Nook/Kindle), landscape 800x480 phones (Android) */
  .editor {
    width: 96%;
  }
}

@media (min-width: $editor_enough_width + 60px) {
  .editor {
    width: 92%;
  }
}

@media (min-width: 801px) {
  /* tablet, landscape iPad, lo-res laptops ands desktops */
  .editor {
    width: 86%;
    max-width: 800px;
  }
}

@media (min-width: $first_threshold) {
  .my-gear_window {
    @include flex-column-center;
  }
}

@media (min-width: $first_threshold) and (max-width: $third_threshold - 1px) {
  .editor__wrapper {
    display: grid;
    justify-items: center;
    align-items: start;
    padding: 0 $grid_wrapper_padding;
    column-gap: $grid_gap;
    grid-template-rows: auto 1fr;

    &.my_gear_minimized {
      grid-template-columns: 1fr $my_gear_minimized_width;
    }
  }
  .backpacks_list {
    grid-column: 1;
  }
  .editor {
    width: 100%;
    grid-column: 1;
    //background-color: red;
  }
  .my-gear_window {
    grid-column: 2;
    grid-row: 1 / span 2;
  }
}

@media (min-width: 1025px) {
  /* big landscape tablets, laptops, and desktops */

}

@media (min-width: 1281px) {
  /* hi-res laptops and desktops */

}

@media (min-width: $second_threshold) and (max-width: $third_threshold - 1px) {
  .editor__wrapper {
    grid-template-columns: 1fr $my_gear_max_width;
  }
  .editor {
    max-width: $editor_big_width;
    width: 100%;
  }
}

@media (min-width: $third_threshold) {
  .editor {
    width: 100%;
    max-width: 900px; // <------------ update also other fields
  }
  .editor__wrapper {
    display: grid;
    //grid-template-columns: auto auto auto;
    //grid-template-columns: auto auto fit-content(100%);
    grid-template-columns: auto auto $my_gear_max_width;
    justify-items: center;
    padding: 0 $grid_wrapper_padding;
    column-gap: $grid_gap;
    align-items: start;
  }
  .backpacks_list {
    grid-column: 1;
    position: -webkit-sticky;
    position: sticky;
    top: 5vh;

    &__items {
      max-height: 60vh;
    }
  }
}

</style>
