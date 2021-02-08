<template>
  <div>
    <form class="auth__form" @submit.prevent="submitForm">
      <h1>Register</h1>
      <input id="registration-email" ref="email" v-model.trim="email"
             :class="{ invalid: !emailValidity, blurred: email_blurred}" class="auth__input" inputmode="email"
             name="email"
             placeholder="e-mail" required type="email"
             @blur="markAsBlurred">
      <label v-show="emailInfoDisplay" for="registration-email">invalid email</label>
      <label v-if="email_info !== '' && emailValidity" for="registration-email">{{ email_info }}</label>
      <input id="registration-password1" ref="password1" v-model.trim="password1"
             :class="{ invalid: !password1Validity, blurred: password1_blurred}"
             :placeholder="'hasło (min. ' + min_password_length + ' znaków)'" class="auth__input" minlength="8"
             name="password1" required type="password"
             @blur="markAsBlurred">
      <label v-show="password1InfoDisplay" for="registration-password1">invalid password</label>
      <input id="registration-password2" ref="password2" v-model.trim="password2"
             :class="{ invalid: !password2Validity, blurred: password2_blurred}" class="auth__input" minlength="8"
             name="password2"
             placeholder="powtórz hasło" required type="password"
             @blur="markAsBlurred">
      <label v-show="password2InfoDisplay" for="registration-password2">passwords have to match</label>
      <button id="register-submit" class="auth__submit" type="submit">submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      email: '',
      password1: '',
      password2: '',
      email_blurred: false,
      password1_blurred: false,
      password2_blurred: false,
      min_password_length: 8,
      max_password_length: 30,
      email_info: '',
      password_info: '',
    }
  },
  computed: {
    emailValidity() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.email).toLowerCase());
    },
    password1Validity() {
      return this.password1.length >= this.min_password_length && this.password1.length <= this.max_password_length &&
          !(/^\d+$/.test(this.password1))
    },
    password2Validity() {
      return this.password2.length >= this.min_password_length && this.password2.length <= this.max_password_length &&
          !(/^\d+$/.test(this.password2)) && this.password2 === this.password1
    },
    emailInfoDisplay() {
      return !this.emailValidity && this.email_blurred
    },
    password1InfoDisplay() {
      return !this.password1Validity && this.password1_blurred
    },
    password2InfoDisplay() {
      return !this.password2Validity && this.password2_blurred
    },
    isFormValid() {
      return this.password1Validity && this.password2Validity && this.emailValidity
    },
  },
  methods: {
    submitForm() {
      if (this.isFormValid) {
        fetch(process.env.VUE_APP_API_URL + '/api/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password1
          })
        })
            .then(response => {
              if (response.ok) {
                this.handleSuccess(response.json())
              } else {
                this.handleFailure(response.json())
              }
            })
      }
    },
    handleSuccess(json) {
      json.then(dt => {
        dt.password = this.password1
        this.$store.dispatch('auth/login', dt)
            .then(status => {
              if (status === 'logged in') {
                this.$store.dispatch('editor/getInitialData')
                .then(() => this.$router.push('/editor'))
              } else {
                // this.info = status
                // TODO: line above
              }
            })
      })
    },
    handleFailure(json) {
      json.then(dt => {
        console.log(dt)
        if (dt.email) {
          this.email_info = dt.email[0]
        } else this.password_info = dt[0]
      })
    },
    markAsBlurred(e) {
      let name = e.target.getAttribute('name')
      this[name + '_blurred'] = true
    }
  }
}
</script>

<style scoped>

</style>