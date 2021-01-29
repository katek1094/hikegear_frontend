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

html {
  font-size: 16px;
  min-width: 400px;
}

body {
  margin: 0;
}

@media (min-width:320px)  { /* smartphones, portrait iPhone, portrait 480x320 phones (Android) */ }
@media (min-width:480px)  { /* smartphones, Android phones, landscape iPhone */ }
@media (min-width:600px)  { /* portrait tablets, portrait iPad, e-readers (Nook/Kindle), landscape 800x480 phones (Android) */ }
@media (min-width:801px)  { /* tablet, landscape iPad, lo-res laptops ands desktops */ }
@media (min-width:1025px) { /* big landscape tablets, laptops, and desktops */ }
@media (min-width:1281px) { /* hi-res laptops and desktops */ }

</style>
