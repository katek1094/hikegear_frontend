<template>
  <div class="category">
    <input class="category_name" type="text" :value="category.name" placeholder="nazwa kategorii" @input="changeName">
<!--    TODO: add category description-->
    <button :disabled="category.cant_move_up" type="button" @click="up">up</button>
    <button :disabled="category.cant_move_down" type="button" @click="down">down</button>
    <button type="button" @click="deleteCategory">usuń kategorię</button>
    <div class="items">
      <Item v-for="item in category.items" :key="item.id" :item="item"/>
    </div>
    <button type="button" @click="addItem">dodaj przedmiot</button>
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
  border: 1px solid black;
  padding: 2px;
  margin: 2px;
}
.category_name{
  font-size: 18px;
  margin: 4px;
}
</style>