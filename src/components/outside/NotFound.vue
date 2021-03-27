<template>
  <OutsideBaseApp>
    <div class="not_found">
      <h1>podany adres nie istnieje</h1>
    </div>
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

<style lang="scss" scoped>
.not_found {
  @include flex-column-center;
}
</style>
