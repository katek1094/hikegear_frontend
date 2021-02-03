<template>
  <div class="base_app">
    <NavBar/>
    <slot></slot>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";

export default {
  name: "BaseApp",
  components: {NavBar}
}
</script>

<style scoped>
.base_app {
  overflow: hidden;
}
</style>