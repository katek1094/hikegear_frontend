<template>
  <div class="inside_base_app">
    <NavBar/>
    <div class="inside_base_app--slot">
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

.inside_base_app--slot {
  padding-top: 10px;
  padding-bottom: 15px;
}

</style>
