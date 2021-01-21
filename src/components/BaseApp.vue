<template>
  <div>
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

</style>