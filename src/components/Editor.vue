<template>
  <BaseApp>
    <div class="editor" v-if="editor_data_fetched">
      <input v-model.trim="pack_name" class="backpack__name" placeholder="nazwa listy" type="text">
      <Summary/>
      <button class="save-button" type="button" :disabled="!are_changes" @click="save">zapisz</button>
      <!--    TODO: add pack description-->
      <draggable v-model="packlist" animation="700" class="categories" group="categories" handle=".category__handle"
                 item-key="id" @end="drag=false" @start="drag=true">
        <template #item="{element, index}">
          <Category :category="element" :index="index"/>
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
    return {}
  },
  computed: {
    editor_data_fetched() {
      return this.$store.getters['editor/isDataFetched']
    },
    packlist: {
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
        this.$store.commit('editor/renamePack', val)
      }
    },
    are_changes() {
      return this.$store.getters['editor/are_any_changes']
    },
  },
  methods: {
    addCategory() {
      this.$store.commit('editor/createEmptyCategory')
    },
    save() {
      this.$store.dispatch('editor/updateBackpack')
    }
  },
  beforeCreate() {
    this.$store.dispatch('editor/fetchData', 4)
  }
}
</script>

<style scoped>
.editor {
  padding: 20px;
  background-color: var(--background);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.add-category, >>> .add-item {
  margin: 4px 0;
  border: none;
  background-color: transparent;
  outline: none;
  color: yellowgreen;
}

.add-category:hover, >>> .add-item:hover {
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
  max-width: 20rem;
  min-width: 10rem;
  width: 100%;
}

.backpack__name {
  text-align: center;
  margin: 10px 0;
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

.save-button {
  --first: lightgrey;
  --second: #75f61c;
  --third: greenyellow;
  outline: none;
  width: 70px;
  height: 35px;
  font-size: 1em;
  border-radius: 5px;
  background-color: var(--first);
  border: 1px solid var(--first);
}

.save-button:enabled {
  background-color: var(--second);
  cursor: pointer;
  border-color: var(--second);
}

.save-button:hover:enabled {
  background-color: var(--third);
}

.save-button:active:enabled {
  border-color: var(--third);
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