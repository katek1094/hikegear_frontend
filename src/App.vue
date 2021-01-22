<template>
  <div>
    <BaseApp>
      <Editor v-if="editor_data_fetched"/>
    </BaseApp>
  </div>
</template>

<script>
import Editor from "@/components/Editor";
import BaseApp from "@/components/BaseApp";
export default {
  name: 'App',
  components: {
    BaseApp,
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
* {
  font-family: Arial, sans-serif;
}
</style>
