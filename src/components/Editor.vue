<template>
  <BaseApp>
    <div class="editor" v-if="editor_data_ready">
      <span>twoje plecaki:</span>
      <div class="backpack__list">
        <div class="backpack__list__item" v-for="(backpack, index) in backpacks" :key="backpack.id"
             @click="changeBackpack(index)">
          <span>{{ backpack.name }}</span>
          <span v-if="backpack.name === ''">no name</span>
        </div>
        <button class="add-backpack" type="button" @click="addBackpack">
          <font-awesome-icon class="fa-md" icon="plus"/>
          dodaj plecak
        </button>
      </div>
      <input v-model.trim="pack_name" class="backpack__name" placeholder="nazwa listy" type="text">
      <Summary/>
      <div>
        <button class="delete-button" type="button" @click="deleteBackpack">usuń plecak</button>
        <button class="discard-button" type="button" :disabled="!are_changes" @click="discard">odrzuć zmiany</button>
        <button class="save-button" type="button" :disabled="!are_changes || pack_name === ''" @click="save">zapisz
        </button>
      </div>
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
    draggable
  },
  data() {
    return {
      categoryRefs: []
    }
  },
  computed: {
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
      if (this.$store.getters['editor/pack_id'] !== undefined) {
        this.$store.dispatch('editor/updateBackpack')
      } else this.$store.dispatch('editor/createBackpack')
    },
    discard() {
      this.$store.dispatch('editor/discardChanges')
    },
    deleteBackpack() {

    },
    changeBackpack(index) {
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
    setCategoryRef(el) {
      if (el) this.categoryRefs.push(el)
    }
  },
  mounted() {
    this.resizeAllItems()
    window.addEventListener("resize", this.resizeAllItems);
  }
}
</script>

<style scoped>
.backpack__list {
  background-color: #e5e1e1;
  border-radius: 4px;
  padding: 8px;
  margin: 10px;
}

.backpack__list__item {
  margin: 10px;
}

.backpack__list__item span:hover {
  cursor: pointer;
  text-decoration: underline;
}

.editor {
  padding: 20px 0.3rem;
  background-color: var(--background);
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
  padding: 5px;
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

.save-button, .discard-button, .delete-button {
  --disabled: lightgrey;
  --save_second: #75f61c;
  --save_third: #adff2f;
  --discard_second: #f8ec00;
  --discard_third: yellow;
  --delete_second: #d22626;
  --delete_third: red;
  outline: none;
  padding: 6px 7px;
  margin: 3px 20px;
  font-size: 1em;
  border-radius: 6px;
  background-color: var(--disabled);
  border: 1px solid var(--disabled);
}

.save-button:enabled {
  background-color: var(--save_second);
  border-color: var(--save_second);
}

.save-button:hover:enabled {
  background-color: var(--save_third);
  cursor: pointer;
}

.save-button:active:enabled {
  border-color: var(--save_third);
}

.discard-button:enabled {
  background-color: var(--discard_second);
  border-color: var(--discard_second);
}

.discard-button:hover:enabled {
  cursor: pointer;
  background-color: var(--discard_third);
}

.discard-button:active:enabled {
  border-color: var(--discard_third);
}

.delete-button:enabled {
  background-color: var(--delete_second);
  border-color: var(--delete_second);
}

.delete-button:hover:enabled {
  background-color: var(--delete_third);
  cursor: pointer;
  color: white;
}

.delete-button:active:enabled {
  border-color: var(--delete_third);
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