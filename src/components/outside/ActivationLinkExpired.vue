<template>
  <OutsideBaseApp>
    <div class="hg-flx_col_ctr">
      <h1>Twój link aktywacyjny wygasł</h1>
      <h3>Twoje konto zostało usunięte</h3>
      <router-link :to="{name: 'register'}">zarejestruj się ponownie</router-link>
    </div>
  </OutsideBaseApp>
</template>

<script>
import OutsideBaseApp from "@/components/outside/OutsideBaseApp";

export default {
  name: "ActivationLinkExpired",
  components: {OutsideBaseApp}
}
</script>

<style lang="scss" scoped>
.hg-flx_col_ctr {
  padding: 0 14px;
}
</style>
