<template>
  <BaseApp>
    <div v-if="!editor_data_ready">
      <p>nie masz żadnych plecaków</p>
      <button class="add-backpack" type="button" @click="addBackpack">
        <font-awesome-icon class="fa-md" icon="plus"/>
        dodaj plecak
      </button>
    </div>
    <div class="editor" v-if="editor_data_ready">
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
      <Autoresizing ref="backpack_name" v-model.trim="pack_name" :maxlength="max_backpack_name_length"
                    :prevent-enter="true" class="backpack__name" placeholder="nazwa listy"/>
      <Summary :summary_data="summary_data"/>
      <div class="progress" :style="{width: saveTimePassed * 100 / saveTimeout + '%' }"></div>
      <!--    TODO: add backpack description-->
      <draggable v-model="organized_list" animation="1000" class="categories" group="categories"
                 handle=".category__handle" item-key="id" @end="drag=false" @start="drag=true">
        <template #item="{element}">
          <Category :category="element" :ref="setCategoryRef"/>
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
import draggable from 'vuedraggable'
import Category from "@/components/inside/editor/Category";
import Summary from "@/components/inside/editor/Summary";
import BaseApp from "@/components/inside/BaseApp";
import Autoresizing from "@/components/Autoresizing";
import {mapGetters} from 'vuex'


export default {
  name: "Editor",
  components: {
    Autoresizing,
    BaseApp,
    Summary,
    Category,
    draggable,
  },
  data() {
    return {
      categoryRefs: [],
      edits: 0,
      saveTimeout: 3000,
      saveTimePassed: 0,
      resizes: 0,
      max_backpack_name_length: 60,
      interval: {}
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
    pack_name: {
      get() {
        return this.$store.getters['editor/pack_name']
      },
      set(val) {
        this.$store.dispatch('editor/renamePack', val)
      }
    },
  },
  methods: {
    addCategory() {
      this.$store.dispatch('editor/addCategory')
    },
    save(update_dynamic) {
      this.edits = 0
      // TODO: add some kind of progress when data is fetching
      this.$store.dispatch('editor/updateBackpack', {id: this.backpack_id, update_dynamic: update_dynamic})
    },
    changeBackpack(index) {
      if (this.are_changes) this.save(false)
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
    resizeAllItems() {
      if (this.editor_data_ready) {
        for (let i = 0; i < this.categoryRefs.length; i++) {
          this.categoryRefs[i].resizeAllItems()
        }
        this.$refs.backpack_name.autoresize()
      }
    },
    windowResized() {
      this.resizes += 1
      let x = this.resizes
      setTimeout(() => {
        if (x === this.resizes) this.resizeAllItems()
      }, 300)
    },
    setCategoryRef(el) {
      if (el) this.categoryRefs.push(el)
    },
  },
  beforeUpdate() {
    this.categoryRefs = []
  },
  mounted() {
    window.addEventListener("resize", this.windowResized);
    this.$store.watch(
        (state) => state.editor.dynamic,
        () => {
          this.saveTimePassed = 0
          this.edits += 1
          let x = this.edits
          setTimeout(() => {
            if (x === this.edits && this.are_changes) {
              this.save(true)
            }
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
    clearInterval(this.interval)
  },

}
</script>

<style lang="scss" scoped>
.progress {
  height: 1px;
  background-color: grey;
}

.backpack__list {
  background-color: #e5e1e1;
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

@media (hover: hover) and (pointer: fine) {
  .backpack__delete:hover {
    color: red;
    cursor: pointer;
  }
}

.editor {
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.add-category, ::v-deep(.add-item), .add-backpack {
  margin: 4px;
  border: none;
  background-color: transparent;
  outline: none;
  color: yellowgreen;
  font-size: .85rem;
}

.add-category:hover, ::v-deep(.add-item:hover), .add-backpack:hover {
  text-decoration: underline;
  cursor: pointer;
}

.backpack__name, ::v-deep(.category__name), ::v-deep(.item__name), ::v-deep(.item__description),
::v-deep(.item__weight), ::v-deep(.item__quantity) {
  border-radius: 4px;
  font-size: 1em;
  border: 1px solid transparent;
  background-color: transparent;
  outline: none;
  padding: 3px;
}

.backpack__name, ::v-deep(.category__name) {
  font-weight: bold;
}

.backpack__name {
  text-align: center;
  margin: .4rem 0;
  font-size: 1.4rem;
}

.backpack__name:focus, ::v-deep(.category__name:focus), ::v-deep(.item__name:focus), ::v-deep(.item__description:focus),
::v-deep(.item__weight:focus), ::v-deep(.item__quantity:focus) {
  background-color: white;
  border: 1px solid grey;
}

.backpack__name:hover, ::v-deep(.category__name:hover), ::v-deep(.item__name:hover), ::v-deep(.item__description:hover),
::v-deep(.item__weight:hover), ::v-deep(.item__quantity:hover) {
  background-color: white;
  cursor: text;
}

@media (min-width: 320px) {

}

@media (min-width: 480px) {

}

@media (min-width: 600px) {

}

@media (min-width: 801px) {

}

@media (min-width: 1025px) {

}

@media (min-width: 1281px) {

}
</style>
