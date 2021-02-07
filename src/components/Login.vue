<template>
  <div>
    <form class="auth__form" @submit.prevent="submitForm">
      <h1 class="auth__title">Login</h1>
      <input id="login-email"
             v-model.trim="email"
             :class="{ invalid: !emailValidity, blurred: email_blurred}"
             autofocus
             class="auth__input"
             inputmode="email"
             name="email"
             placeholder="e-mail"
             required
             type="email"
             @blur="markAsBlurred">
      <label for="login-password">{{ info }}</label>
      <input id="login-password"
             v-model.trim="password"
             :class="{ invalid: !passwordValidity, blurred: password_blurred}"
             class="auth__input"
             name="password"
             placeholder="password"
             required
             type="password"
             @blur="markAsBlurred">
      <div class="auth__options_div">
        <button class="login__option login__forgot_password" type="button">nie pamiętam hasła</button>
        <router-link to="/register">
          <button class="login__option login__register" type="button">nie mam konta (rejestracja)</button>
        </router-link>
      </div>
      <button class="auth__submit" type="submit" id="login-submit">zaloguj</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: '',
      password: '',
      min_password_length: 8,
      max_password_length: 30,
      email_blurred: false,
      password_blurred: false,
      info: ''
    }
  },
  computed: {
    emailValidity() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.email).toLowerCase());
    },
    passwordValidity() {
      return this.password.length >= this.min_password_length && this.password.length <= this.max_password_length &&
          !(/^\d+$/.test(this.password))
    },
    isFormValid() {
      return this.emailValidity && this.passwordValidity
    },
  },
  methods: {
    submitForm() {
      if (this.isFormValid) {
        this.$store.dispatch('auth/login', {
          email: this.email,
          password: this.password
        })
            .then(status => {
              if (status === 'logged in') {
                this.$store.dispatch('editor/getInitialData')
                    .then(() => this.$router.push('/editor'))
              } else {
                this.info = status
              }
            })
      }
    },
    markAsBlurred(e) {
      let name = e.target.getAttribute('name')
      this[name + '+blurred'] = true
    }
  }
}
</script>

<style scoped>

</style>