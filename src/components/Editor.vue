<template>
  <BaseApp>
    <div class="editor" v-if="editor_data_ready">
      <div class="backpack__list">
        <div class="backpack__list__item" v-for="(backpack, index) in backpacks" :key="backpack.id"
             @click="changeBackpack(index)">
          <span :class="{active: backpack.id === backpack_id}">{{ backpack.name }}</span>
          <span v-if="backpack.name === ''" :class="{active: backpack.id === backpack_id}">bez nazwy</span>
        </div>
        <button class="add-backpack" type="button" @click="addBackpack">
          <font-awesome-icon class="fa-md" icon="plus"/>
          dodaj plecak
        </button>
      </div>
      <input v-model.trim="pack_name" class="backpack__name" placeholder="nazwa listy" type="text">
      <Summary/>
      <div class="progress" :style="{width: saveTimePassed * 100 / saveTimeout + '%' }"></div>
      <!--    TODO: add pack description-->
      <draggable v-model="organized_list" animation="1000" class="categories" group="categories"
                 handle=".category__handle" item-key="id" @end="drag=false" @start="drag=true">
        <template #item="{element, index}">
          <Category :category="element" :index="index" :ref="setCategoryRef"/>
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
import Category from "@/components/Category";
import Summary from "@/components/Summary";
import BaseApp from "@/components/BaseApp";


export default {
  name: "Editor",
  components: {
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
    }
  },
  computed: {
    backpack_id() {
      return this.$store.getters['editor/pack_id']
    },
    backpacks() {
      return this.$store.getters['editor/backpacks']
    },
    editor_data_ready() {
      return this.$store.getters['editor/isEditorDataReady']
    },
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
    are_changes() {
      return this.$store.getters['editor/are_any_changes']
    },
  },
  methods: {
    addCategory() {
      this.$store.dispatch('editor/addCategory')
    },
    save() {
      this.edits = 0
      // TODO: add some kind of progress when data is fetching
      this.$store.dispatch('editor/updateBackpack')
    },
    changeBackpack(index) {
      if (this.are_changes) this.save()
      this.$store.dispatch('editor/changeBackpack', index)
    },
    addBackpack() {
      this.$store.dispatch('editor/addBackpack')
    },
    resizeAllItems() {
      for (let i = 0; i < this.categoryRefs.length; i++) {
        this.categoryRefs[i].resizeAllItems()
      }
    },
    windowResized() {
      this.resizes += 1
      let x = this.resizes
      setTimeout(() => {
        if (x === this.resizes) this.resizeAllItems()
      }, 400)
    },
    setCategoryRef(el) {
      if (el) this.categoryRefs.push(el)
    }
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
              this.save()
            }
          }, this.saveTimeout)
        },
        {deep: true}
    );
    setInterval(() => {
      if (this.editor_data_ready && this.are_changes) this.saveTimePassed += 10
    }, 10)
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.windowResized);
  }
}
</script>

<style scoped>
.progress {
  height: 1px;
  background-color: grey;
}

.backpack__list {
  background-color: #e5e1e1;
  border-radius: 4px;
  padding: 8px;
  margin: 10px;
}

.backpack__list__item {
  margin: 10px;
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

.editor {
  padding: 20px 0.3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.add-category, >>> .add-item, .add-backpack {
  margin: 4px 0;
  border: none;
  background-color: transparent;
  outline: none;
  color: yellowgreen;
}

.add-category:hover, >>> .add-item:hover, .add-backpack:hover {
  text-decoration: underline;
  cursor: pointer;
}

.backpack__name, >>> .category__name, >>> .item__name, >>> .item__description,
>>> .item__weight, >>> .item__quantity {
  border-radius: 4px;
  font-size: 1em;
  border: 1px solid transparent;
  background-color: transparent;
  outline: none;
  padding: 3px;
}

.backpack__name, >>> .category__name {
  font-weight: bold;
  max-width: 50vw;
  min-width: 10rem;
}

.backpack__name {
  text-align: center;
  margin: .2rem 0;
  font-size: 1.4rem;
}

.backpack__name:focus, >>> .category__name:focus, >>> .item__name:focus, >>> .item__description:focus,
>>> .item__weight:focus, >>> .item__quantity:focus {
  background-color: white;
  border: 1px solid grey;
}

.backpack__name:hover, >>> .category__name:hover, >>> .item__name:hover, >>> .item__description:hover,
>>> .item__weight:hover, >>> .item__quantity:hover {
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

<style>
/*GLOBAL STYLES*/
:root {
  --background: #f6f6f6;
}

.autoresize {
  resize: none;
  overflow: hidden;
}
</style>