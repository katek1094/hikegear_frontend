<template>
  <div class="category">
    <h3>{{category.name}}</h3>
    <button type="button" @click="up">up</button>
    <button type="button" @click="down">down</button>
    <Item v-for="item in category.items" :key="item" :item="item"/>
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
  }
}
</script>

<style scoped>
.category {
  border: 1px solid black;
  padding: 2px;
  margin: 2px;
}
</style>