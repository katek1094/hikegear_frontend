<template>
  <div class="editor">
    <p>are any changes: {{ are_changes }}</p>
    <Summary/>
    <input v-model.trim="pack_name" class="backpack__name" placeholder="nazwa listy" type="text">
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
</template>

<script>
import draggable from 'vuedraggable'
import Category from "@/components/Category";
import Summary from "@/components/Summary";


export default {
  name: "Editor",
  components: {
    Summary,
    Category,
    draggable
  },
  data() {
    return {}
  },
  computed: {
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
  },
}
</script>

<style scoped>
.editor {
  border: 2px solid black;
  padding: 2px;
  margin: 2px;
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
>>> .item__weight, >>> .item__quantity{
  border-radius: 4px;
  font-size: 1em;
  border: 1px solid transparent;
  background-color: transparent;
  outline: none;
  padding: 5px;
}

.backpack__name, >>> .category__name {
  font-weight: bold;
}

.backpack__name {
  text-align: center;
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

</style>

















<style>
/*GLOBAL STYLES*/
.editor {
  --background: #f6f6f6;
}

.autoresize {
  resize: none;
  overflow: hidden;
}
</style>