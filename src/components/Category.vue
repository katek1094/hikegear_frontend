<template>
  <div class="category">
    <div class="category__header">
      <span class="handle cat"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
      <input class="name" type="text" v-model.trim="category_name" placeholder="nazwa kategorii" @input="changeName">
      <!--    TODO: add category description-->
      <button class="delete" type="button" @click="deleteCategory">
        <font-awesome-icon class="fa-sm" icon="trash"/>
      </button>
    </div>
    <draggable v-model="items" animation="500" group="items" item-key="id" @end="drag=false" @start="drag=true">
      <template #item="{element, index}">
        <Item :first="category.items.indexOf(element) === 0" :item="element" :index="index"
              :last="category.items.indexOf(element) === category.items.length - 1"/>
      </template>
    </draggable>
    <button class="add_item" type="button" @click="addItem">
      <font-awesome-icon class="fa-md" icon="plus"/>
      dodaj przedmiot
    </button>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Item from "@/components/Item";

export default {
  name: "Category",
  components: {Item, draggable},
  props: {
    category: Object,
    index: Number
  },
  computed: {
    items_amount() {
      return this.category.items.length
    },
    category_name: {
      get() {
        return this.category.name
      },
      set(val) {
        this.$store.commit('editor/renameCategory', {id: this.category.id, name: val})
      }
    },
    items: {
      get() {
        return this.category.items
      },
      set(val) {
        this.$store.dispatch('editor/moveItem', {new_category: val, category_unique_id: this.category.unique_id})
      }
    }
  },
  methods: {
    addItem() {
      this.$store.dispatch('editor/addItem', this.category.id)
    },
    deleteCategory() {
      this.$store.dispatch('editor/deleteCategory', this.category.id)
    },
  }
}
</script>

<style scoped>
.category {
  margin: 6px;
}

.category__header {
  display: flex;
  align-items: center;
  font-size: 16px;
}

.category__header > * {
  margin: 0 2px;
}

.name {
  border-radius: 4px;
  font-size: 1em;
  font-weight: bold;
  border: 1px solid var(--background);
  background-color: var(--background);
  outline: none;
  padding: 5px;
}

.name:focus {
  background-color: white;
  border: 1px solid grey;
}

.name:hover {
  background-color: white;
  cursor: text;
}


.category__header:hover .up, .category__header:hover .down {
  visibility: visible;
}

.delete {
  visibility: hidden;
  outline: none;
  border: none;
  background-color: transparent;
  padding: 4px 6px;
  margin-left: auto;
}

.category__header:hover .delete {
  visibility: visible;
}

.delete:hover {
  color: red;
  cursor: pointer;
}

.items {
  border-top: 1px solid grey;
  border-bottom: 1px solid grey;
}

.add_item {
  margin: 4px 0;
  border: none;
  background-color: transparent;
  outline: none;
  color: yellowgreen;
}

.add_item:hover {
  text-decoration: underline;
  cursor: pointer;
}


</style>

<style>
.handle {
  margin: 2px 12px 2px 2px;
  padding: 6px;
  cursor: move;
  border-radius: 6px;
  font-size: 14px;
  visibility: hidden;
}

.category__header:hover .handle, .item:hover .handle {
  visibility: visible;
}

.handle:hover {
  background-color: white;
}
</style>