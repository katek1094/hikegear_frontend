<template>
  <BaseApp>
    <div v-if="editor_data_ready" class="wrapper">
      <div class="editor">
        <div class="backpack__list">
          <div class="backpack__list__item" v-for="(backpack, index) in backpacks" :key="backpack.id"
               @click="changeBackpack(index)">
            <span v-if="backpack.name !== ''" :class="{active: backpack.id === backpack_id}">{{ backpack.name }}</span>
            <span v-if="backpack.name === ''" :class="{active: backpack.id === backpack_id}">bez nazwy</span>
            <button v-if="backpack.id === backpack_id" class="backpack__delete" type="button" @click="deleteBackpack">
              <font-awesome-icon class="fa-sm" icon="trash"/>
            </button>
          </div>
          <button class="add-backpack" type="button" @click="addBackpack">
            <font-awesome-icon class="fa-md" icon="plus"/>
            dodaj plecak
          </button>
        </div>
        <router-link class="backpack__link" :to="'/backpack/' + backpack_id">link do plecaka</router-link>
        <Autoresizing ref="backpack_name" v-model.trim="backpack_name" :maxlength="max_backpack_name_length"
                      :prevent-enter="true" class="backpack__name" placeholder="nazwa plecaka"/>
        <Summary :summary_data="summary_data"/>
        <Autoresizing ref="backpack_description" v-model.trim="backpack_description"
                      :maxlength="max_backpack_description_length" class="backpack__description"
                      placeholder="opis plecaka"/>
        <div class="progress" :style="{width: saveTimePassed * 100 / saveTimeout + '%' }"></div>
        <draggable v-model="organized_list" animation="1000" class="categories" group="categories"
                   handle=".category__handle" item-key="id">
          <template #item="{element}">
            <Category :category="element" :ref="'cat' + element.category_index"/>
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
import Autoresizing from "@/components/Autoresizing";
import {mapGetters} from 'vuex'
import MyGear from "@/components/inside/editor/MyGear";


export default {
  name: "Editor",
  components: {
    MyGear,
    Autoresizing,
    BaseApp,
    Summary,
    Category,
    draggable,
  },
  data() {
    return {
      edits: 0,
      saveTimeout: 3000,
      saveTimePassed: 0,
      resizes: 0,
      max_backpack_name_length: 60,
      interval: {},
      max_backpack_description_length: 1000
    }
  },
  computed: {
    ...mapGetters({
      backpack_id: 'editor/backpack_id',
      backpacks: 'editor/backpacks',
      editor_data_ready: 'editor/isEditorDataReady',
      are_changes: 'editor/are_any_changes',
      summary_data: 'editor/summary_data'
    }),
    organized_list: {
      get() {
        return this.$store.getters['editor/organized_list']
      },
      set(val) {
        this.$store.dispatch('editor/moveCategory', val)
      }
    },
    backpack_name: {
      get() {
        return this.$store.getters['editor/backpack_name']
      },
      set(val) {
        this.$store.dispatch('editor/renameBackpack', val)
      }
    },
    backpack_description: {
      get() {
        return this.$store.getters['editor/backpack_description']
      },
      set(val) {
        this.$store.dispatch('editor/changeBackpackDescription', val)
      }
    }
  },
  methods: {
    addCategory() {
      this.$store.dispatch('editor/addCategory')
    },
    save(update_dynamic = true) {
      if (this.are_changes) {
        this.edits = 0
        // TODO: add some kind of progress when data is fetching
        this.$store.dispatch('editor/updateBackpack', {id: this.backpack_id, update_dynamic: update_dynamic})
      }
    },
    changeBackpack(index) {
      this.save(false)
      this.$store.dispatch('editor/changeBackpack', index)
      this.$forceUpdate()
    },
    addBackpack() {
      this.$store.dispatch('editor/addBackpack')
    },
    deleteBackpack() {
      let confirmation = confirm('na pewno chcesz usunąć ten plecak?')
      if (confirmation) this.$store.dispatch('editor/deleteBackpack', this.backpack_id)
    },
    resizeAll() {
      if (this.editor_data_ready) {
        for (let i of this.organized_list) {
          this.$refs['cat' + i.category_index].resizeAllItems()
        }
        this.$refs.backpack_name.autoresize()
        this.$refs.backpack_description.autoresize()
      }
    },
    windowResized() {
      this.resizes += 1
      let x = this.resizes
      setTimeout(() => {
        if (x === this.resizes) this.resizeAll()
      }, 300)
    },
    ctrlS(e) {
      if (e.key === 's' && e.ctrlKey === true) {
        e.preventDefault()
        this.save()
      }
    },
  },
  mounted() {
    window.addEventListener('keydown', this.ctrlS);
    window.addEventListener("resize", this.windowResized);
    this.$store.watch(
        (state) => state.editor.dynamic,
        () => {
          this.saveTimePassed = 0
          this.edits += 1
          let x = this.edits
          setTimeout(() => {
            if (x === this.edits) this.save()
          }, this.saveTimeout)
        },
        {deep: true}
    );
    this.interval = setInterval(() => {
      if (this.editor_data_ready && this.are_changes) this.saveTimePassed += 10
      // TODO: bar loads after fetch because are_changes is waiting for response to change to false
    }, 10)
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.windowResized);
    window.removeEventListener("keydown", this.ctrlS);
    clearInterval(this.interval)
  },

}
</script>

<style lang="scss" scoped>
.wrapper {
  display: grid;
  grid-template-columns: auto auto;
}

.progress {
  height: 1px;
  background-color: grey;
}

.backpack__list {
  background-color: $windows_color;
  border-radius: 4px;
  padding: 4px;
  margin: 4px 10px;
  width: 300px;
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

.add-category, ::v-deep(.add-item), .add-backpack {
  @include editor-add;
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
}

@media (min-width: 480px) {
  /* smartphones, Android phones, landscape iPhone */

}

@media (min-width: 600px) {
  /* portrait tablets, portrait iPad, e-readers (Nook/Kindle), landscape 800x480 phones (Android) */

}

@media (min-width: 801px) {
  /* tablet, landscape iPad, lo-res laptops ands desktops */
  .editor, .categories {
    width: 660px;
  }
}

@media (min-width: 1025px) {
  /* big landscape tablets, laptops, and desktops */

}

@media (min-width: 1281px) {
  /* hi-res laptops and desktops */

}
</style>
