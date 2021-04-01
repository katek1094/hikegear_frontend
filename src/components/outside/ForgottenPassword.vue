<template>
  <OutsideBaseApp>
    <div class="wrapper">
      <h2>podaj email, aby zresetować hasło</h2>
      <input v-model="email" type="email" class="auth__input" placeholder="email">
      <button type="button" class="auth__submit" @click="submit">zatwierdź</button>
    </div>
  </OutsideBaseApp>
</template>

<script>
import OutsideBaseApp from "@/components/outside/OutsideBaseApp";
import {apiFetch} from "@/functions";

export default {
  name: "ForgottenPassword",
  components: {OutsideBaseApp},
  data() {
    return {
      email: ''
    }
  },
  methods: {
    submit() {
      apiFetch('users/reset_password_start/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: this.email,
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  @include flex-column-center;
}
</style>
