<template>
  <div class="editor">
<!--    <h1>Pack editor</h1>-->
    <Summary/>
    <input class="pack__name" type="text" v-model.trim="pack_name" placeholder="nazwa listy">
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
    },
    pack_name: {
      get() {
        return this.$store.getters['editor/pack_name']
      },
      set(val) {
        this.$store.commit('editor/renamePack', val)
      }
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