<template>
  <InsideBaseApp>
    <div class="hg-flx_col_ctr">
      <button class="hg-button" @click="logout">wyloguj</button>
      <ChangePassword/>
    </div>
  </InsideBaseApp>
</template>

<script>
import InsideBaseApp from "@/components/inside/InsideBaseApp";
import ChangePassword from "@/components/inside/ChangePassword";

export default {
  name: "Settings",
  components: {ChangePassword, InsideBaseApp},
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
