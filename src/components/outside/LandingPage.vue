<template>
  <OutsideBaseApp>
    <div class="landing_page_wrapper">
      <div class="description">
        <h2>hikegear.pl do narzędzie dla osób które chcą mieć pełną kontrolę nad wagą swojego plecaka</h2>
        <p>- zorganizuj swój sprzęt w jednym miejscu</p>
        <p>- twórz czytelne listy sprzętu w łatwy sposób</p>
        <p>- dziel się nimi z innymi</p>
      </div>
      <div class="buttons_wrapper">
        <button class="button" @click="loginRedirect">zaloguj się</button>
        <button class="button" @click="registerRedirect">zarejestruj się</button>
      </div>
    </div>
  </OutsideBaseApp>
</template>

<script>
import OutsideBaseApp from "@/components/outside/OutsideBaseApp";

export default {
  name: "LandingPage",
  components: {OutsideBaseApp},
  methods: {
    loginRedirect() {
      this.$router.push({name: 'login'})
    },
    registerRedirect() {
      this.$router.push({name: 'register'})
    }
  }
}
</script>

<style lang="scss" scoped>
.landing_page_wrapper {
  @include flex-column-center;
  padding: 10px;
}
.buttons_wrapper {
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  max-width: 700px;
}
.button {
  @include form-submit;
}

</style>
