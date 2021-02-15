<template>
  <LandingPage>
    <div>
      <form class="auth__form" @submit.prevent="submitForm">
        <h2 class="auth__title">Logowanie</h2>
        <input id="login-email"
               v-model.trim="email"
               :class="{ invalid: !emailValidity, blurred: email_blurred, activated: email_activated}"
               autofocus
               class="auth__input"
               inputmode="email"
               maxlength="320"
               name="email"
               placeholder="e-mail"
               required
               type="email"
               @blur="markAsBlurred"
               @input="activate">
        <label v-if="info_display" for="login-email" class="auth__label">{{ info }}</label>
        <input id="login-password"
               v-model.trim="password"
               :class="{ invalid: !passwordValidity, blurred: password_blurred, activated: password_activated}"
               :maxlength="max_password_length"
               class="auth__input"
               name="password"
               placeholder="hasło"
               required
               type="password"
               @blur="markAsBlurred"
               @input="activate">
        <label v-if="password_info_display" class="auth__label" for="login-password">{{ password_info }}</label>
        <button class="auth__submit" type="submit" id="login-submit">zaloguj</button>
        <router-link to="/register" class="login__option login__register" type="button">nie mam konta (rejestracja)
        </router-link>
        <a :href="password_reset_url" class="login__option login__forgot_password" type="button">nie pamiętam hasła</a>
      </form>
    </div>
  </LandingPage>
</template>

<script>
import LandingPage from "@/components/outside/LandingPage";

export default {
  name: "Login",
  components: {LandingPage},
  data() {
    return {
      email: '',
      password: '',
      min_password_length: 8,
      max_password_length: 128,
      email_blurred: false,
      password_blurred: false,
      email_activated: false,
      password_activated: false,
      info: ''
    }
  },
  computed: {
    emailValidity() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.email).toLowerCase());
    },
    passwordValidity() {
      return this.password_long_enough && this.password_not_too_long && this.password_not_enitirely_numeric
    },
    password_long_enough() {
      return this.password.length >= this.min_password_length
    },
    password_not_too_long() {
      return this.password.length <= this.max_password_length
    },
    password_not_enitirely_numeric() {
      return !(/^\d+$/.test(this.password))
    },
    password_info() {
      if (!this.password_long_enough) return 'hasło jest zbyt krótkie'
      if (!this.password_not_too_long) return 'hasło jest zbyt długie'
      if (!this.password_not_enitirely_numeric) return 'hasło nie może składać się tylko z cyfr'
      return ''
    },
    password_info_display() {
      return this.password_info !== '' && this.password_blurred && this.password_activated
    },
    info_display() {
      return this.info !== '' && this.email_blurred && this.email_activated
    },
    isFormValid() {
      return this.emailValidity && this.passwordValidity
    },
    password_reset_url() {
      return process.env.VUE_APP_API_URL + '/accounts/password_reset/'
    }
  },
  methods: {
    submitForm() {
      this.info = ''
      this.password_blurred = true
      if (this.isFormValid) {
        this.$store.dispatch('auth/login', {
          email: this.email,
          password: this.password
        })
            .then(status => {
              if (status === 'logged in') {
                this.$store.dispatch('editor/getInitialData')
                    .then(() => this.$router.push('/editor'))
              } else if (status === 'bad credentials') {
                this.info = 'błędny email lub hasło'
              } else if (status === 'activate your account') {
                this.$router.push('/verify_email')
              } else {
                throw 'something wrong with response'
              }
            })
      }
    },
    markAsBlurred(e) {
      let name = e.target.getAttribute('name')
      if (this[name + '_activated'] === true) this[name + '_blurred'] = true
    },
    activate(e) {
      let name = e.target.getAttribute('name')
      this[name + '_activated'] = true
    }
  }
}
</script>

<style scoped>

</style>
