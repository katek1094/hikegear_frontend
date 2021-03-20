<template>
  <InsideBaseApp>
    <div class="settings">
      <button class="logout" @click="logout">wyloguj</button>
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
          .then(() => this.$router.push('/'))
    }
  }
}
</script>

<style lang="scss" scoped>
.settings {
@include flex-column-center;
}

button {
  @include form-submit
}

</style>
