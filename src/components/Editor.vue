<template>
  <div class="editor">
    <p>are any changes: {{ are_changes }}</p>
    <Summary/>
    <input class="pack__name" type="text" v-model.trim="pack_name" placeholder="nazwa listy">
    <!--    TODO: add pack description-->
    <draggable v-model="packlist" animation="700" group="categories" item-key="id" @end="drag=false"
               @start="drag=true" handle=".handle.cat">
      <template #item="{element, index}">
        <Category :category="element" :index="index"/>
      </template>
    </draggable>
    <button class="add_category" type="button" @click="addCategory">
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

.add_category {
  margin: 4px 0;
  border: none;
  background-color: transparent;
  outline: none;
  color: yellowgreen;
}

.add_category:hover {
  text-decoration: underline;
  cursor: pointer;
}

.pack__name {
  border-radius: 4px;
  font-size: 1em;
  font-weight: bold;
  border: 1px solid var(--background);
  background-color: var(--background);
  outline: none;
  padding: 5px;
  text-align: center;
}

.pack__name:focus {
  background-color: white;
  border: 1px solid grey;
}

.pack__name:hover {
  background-color: white;
  cursor: text;
}


</style>

<style>
.editor {
  --background: #f6f6f6;
}

.autoresize {
  resize: none;
  overflow: hidden;
}

</style>