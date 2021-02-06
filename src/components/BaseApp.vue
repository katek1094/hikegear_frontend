<template>
  <div class="base_app">
    <NavBar/>
    <div class="slot">
      <slot></slot>
    </div>
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
  background-color: var(--background);
}

.slot {
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>