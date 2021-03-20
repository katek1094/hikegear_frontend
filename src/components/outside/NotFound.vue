<template>
  <OutsideBaseApp>
    <h1>podany adres nie istnieje</h1>
    <p>{{data}}</p>
  </OutsideBaseApp>
</template>

<script>
import OutsideBaseApp from "@/components/outside/OutsideBaseApp";
export default {
name: "NotFound",
  components: {OutsideBaseApp},
  computed: {
    data() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>

</style>
