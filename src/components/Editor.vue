<template>
  <div class="editor">
    <h1>Pack editor</h1>
    <Summary/>
    <Category v-for="category in packlist" :key="category" :category="category"/>
    <button type="button" @click="addCategory">dodaj kategorię</button>
  </div>
</template>

<script>
import Category from "@/components/Category";
import Summary from "@/components/Summary";
export default {
  name: "Editor",
  components: {Summary, Category},
  computed: {
    packlist() {
      return this.$store.getters['editor/organized_list']
    }
  },
  methods: {
    addCategory() {
      this.$store.dispatch('editor/addCategory')
    }
  }
}
</script>

<style scoped>
.editor {
  border: 2px solid black;
  padding: 2px;
  margin: 2px;
}
</style>