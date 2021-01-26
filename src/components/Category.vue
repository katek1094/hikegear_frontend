<template>
  <div class="category">
    <div class="category__header">
      <span class="handle cat"><font-awesome-icon class="fa-md" icon="grip-lines"/></span>
      <input class="name" type="text" v-model.trim="category_name" placeholder="nazwa kategorii" @input="changeName">
      <!--    TODO: add category description-->
      <span class="weight">waga</span>
      <span class="quantity">ilość</span>
      <button class="delete" type="button" @click="deleteCategory">
        <font-awesome-icon class="fa-sm" icon="trash"/>
      </button>
    </div>
    <draggable v-model="items" animation="500" class="items" group="items" item-key="id" @end="drag=false"
               @start="drag=true" handle=".handle.it">
      <template #item="{element, index}">
        <Item :first="category.items.indexOf(element) === 0" :item="element" :index="index"
              :last="category.items.indexOf(element) === category.items.length - 1"/>
      </template>
    </draggable>
    <div class="category__footer">
      <button class="add_item" type="button" @click="addItem">
        <font-awesome-icon class="fa-md" icon="plus"/>
        dodaj przedmiot
      </button>
    </div>
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
  padding: 3px 0;
}

.category__header {
  display: flex;
  align-items: center;
  font-size: 1rem;
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

>>> .category__header:hover .delete, >>> .item:hover .delete {
  visibility: visible;
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

>>> .delete:hover {
  color: red;
  cursor: pointer;
}

>>> .delete {
  visibility: hidden;
  outline: none;
  border: none;
  background-color: transparent;
  padding: 4px 6px;
  /*margin-left: auto;*/
}

>>> .handle {
  margin: 2px 6px 2px 2px;
  padding: 6px;
  cursor: move;
  border-radius: 6px;
  font-size: .875rem;
  visibility: hidden;
}

>>> .category__header:hover .handle, >>> .item:hover .handle {
  visibility: visible;
}

>>> .handle:hover {
  background-color: white;
}

span.weight, span.quantity {
  margin: 2px;
  padding: 6px;
  font-size: .75rem;
}

span.weight {
  margin-left: auto;
}

>>> .weight {
  width: 2.4rem;
}

>>> .quantity {
  width: 2.25rem;
}

</style>
