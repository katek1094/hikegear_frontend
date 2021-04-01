<template>
  <div class="outside_base_app">
    <router-link to="/"><img alt="logo" src="@/assets/logo.png" class="logo"></router-link>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "OutsideBaseApp",
}
</script>

<style lang="scss" scoped>
.logo:hover {
  background-color: white;
  border-radius: 8px;
}

</style>
