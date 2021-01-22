<template>
  <div class="category">
    <div class="category__header">
      <button :disabled="category.cant_move_up" class="up" type="button" @click="up">
        <font-awesome-icon class="fa-sm" icon="chevron-up"/>
      </button>
      <button :disabled="category.cant_move_down" class="down" type="button" @click="down">
        <font-awesome-icon class="fa-sm" icon="chevron-down"/>
      </button>
      <input class="name" type="text" :value="category.name" placeholder="nazwa kategorii" @input="changeName">
      <!--    TODO: add category description-->

<!--      <button type="button" @click="deleteCategory">usuń kategorię</button>-->
      <button class="delete" type="button" @click="deleteCategory">
        <font-awesome-icon class="fa-sm" icon="trash"/>
      </button>
    </div>
    <div class="items">
      <Item v-for="item in category.items" :key="item.id" :first="category.items.indexOf(item) === 0" :item="item"
            :last="category.items.indexOf(item) === category.items.length - 1"/>
    </div>
    <button class="add_item" type="button" @click="addItem">dodaj przedmiot</button>
  </div>
</template>

<script>
import Item from "@/components/Item";
export default {
  name: "Category",
  components: {Item},
  props: {
    category: Object
  },
  methods: {
    up() {
      this.$store.dispatch('editor/moveUp', this.category.id)
    },
    down() {
      this.$store.dispatch('editor/moveDown', this.category.id)
    },
    addItem() {
      this.$store.dispatch('editor/addItem', this.category.id)
    },
    changeName(e) {
      this.$store.commit('editor/renameCategory', {id: this.category.id, name: e.target.value})
    },
    deleteCategory() {
      this.$store.dispatch('editor/deleteCategory', this.category.id)
    }
  }
}
</script>

<style scoped>
.category {
  /*border: 1px solid black;*/
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
.name{
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
}

.up, .down {
  visibility: hidden;
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
}
.items {
  border-top: 1px solid grey;
  border-bottom: 1px solid grey;
}
.add_item {
  margin: 4px 0;
}
</style>