<template>
  <LandingPage>
    <h1>podany adres nie istnieje</h1>
    <p>{{data}}</p>
  </LandingPage>
</template>

<script>
import LandingPage from "@/components/outside/LandingPage";
export default {
name: "NotFound",
  components: {LandingPage},
  computed: {
    data() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>

</style>
