<template>
  <div class="base_app">
    <NavBar/>
    <div class="slot">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/inside/NavBar";

export default {
  name: "InsideBaseApp",
  components: {NavBar},
}
</script>

<style lang="scss" scoped>
.base_app {
  min-height: 100vh;
}
.slot {
  display: flex;
  justify-content: center;
  padding-top: 10px;
  padding-bottom: 15px;
}
</style>
