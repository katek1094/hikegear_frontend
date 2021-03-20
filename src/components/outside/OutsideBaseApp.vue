<template>
  <div class="inside_base_app">
    <div class="slot">
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: "OutsideBaseApp",
}
</script>

<style lang="scss" scoped>
.inside_base_app {
  min-height: 100vh;
}

.slot {
  display: flex;
  justify-content: center;
  padding-top: 10px;
  padding-bottom: 15px;
}
</style>
