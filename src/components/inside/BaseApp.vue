<template>
  <div>
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

.slot {
  @include flex-column-center;
  padding-top: 10px;
  padding-bottom: 15px;
}

</style>
