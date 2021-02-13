<template>
  <BaseApp>
    <div>
      <h1>settings page</h1>
      <button @click="logout">wyloguj</button>
    </div>
  </BaseApp>
</template>

<script>
import BaseApp from "@/components/BaseApp";

export default {
  name: "Settings",
  components: {BaseApp},
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      .then(() => this.$router.push('/'))
    }
  }
}
</script>

<style scoped>

</style>