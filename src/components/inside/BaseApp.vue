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
  name: "BaseApp",
  components: {NavBar}
}
</script>

<style lang="scss" scoped>
.base_app {
  overflow: hidden;
  background-color: var(--background);
  min-height: 100vh;
}

.slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 15px;
}

</style>
