<template>
  <div class="editor">
    <h1>are any changes: {{are_changes}}</h1>
    <Summary/>
    <input class="pack__name" type="text" v-model.trim="pack_name" placeholder="nazwa listy">
    <!--    TODO: add pack description-->
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
    },
    are_changes() {
      return this.$store.getters['editor/are_any_changes']
    }
  },
  methods: {
    addCategory() {
      this.$store.dispatch('editor/addCategory')
    },
  }
}
</script>

<style scoped>
.editor {
  border: 2px solid black;
  padding: 2px;
  margin: 2px;
  background-color: #eeeeee;
}
</style>