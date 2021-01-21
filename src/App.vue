<template>
  <div>
    <Editor v-if="editor_data_fetched"/>
  </div>
</template>

<script>
import Editor from "@/components/Editor";
export default {
  name: 'App',
  components: {
    Editor
  },
  computed: {
    editor_data_fetched() {
      return this.$store.getters['editor/isDataFetched']
    }
  },
  beforeCreate() {
    this.$store.dispatch('editor/fetchData', 4)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
