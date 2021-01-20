<template>
  <div>
    <Editor/>
  </div>
</template>

<script>
import Editor from "@/components/Editor";
export default {
  name: 'App',
  components: {
    Editor
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
