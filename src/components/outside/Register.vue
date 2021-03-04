<template>
  <LandingPage>
    <form class="auth__form" @submit.prevent="submitForm">
      <h2>Rejestracja</h2>
      <input id="registration-email" ref="email" v-model.trim="email"
             :class="{ invalid: !emailValidity, blurred: email_blurred, activated: email_activated}"
             class="auth__input"
             inputmode="email" name="email" placeholder="e-mail" required type="email" @blur="markAsBlurred"
             @input="activate">
      <label v-if="email_info !== ''" for="registration-email">{{ email_info }}</label>
      <input id="registration-password1" ref="password1" v-model.trim="password1"
             :class="{ invalid: !password1Validity, blurred: password1_blurred, activated: password1_activated}"
             :maxlength="max_password_length" :minlength="min_password_length"
             :placeholder="'hasło (min. ' + min_password_length + ' znaków)'" class="auth__input"
             name="password1" required type="password" @blur="markAsBlurred" @input="activate">
      <label v-show="password1_info_display" for="registration-password1">{{ password1_info }}</label>
      <label v-show="password_info !== ''">{{ password_info }}</label>
      <input id="registration-password2" ref="password2" v-model.trim="password2"
             :class="{ invalid: !password2Validity, blurred: password2_blurred, activated: password2_activated}"
             :maxlength="max_password_length" :minlength="min_password_length" class="auth__input" name="password2"
             placeholder="powtórz hasło" required type="password"
             @blur="markAsBlurred" @input="activate">
      <label v-show="password2_info_display" for="registration-password2">hasła nie są takie same</label>
      <button v-show="!waiting_for_response" id="register-submit" class="auth__submit" type="submit">zarejestruj</button>
      <div v-if="waiting_for_response" class="spinner"></div>
    </form>
  </LandingPage>
</template>

<script>
import LandingPage from "@/components/outside/LandingPage";
import {apiFetch} from "@/functions";

export default {
  name: "Register",
  components: {LandingPage},
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
      email_activated: false,
      password1_activated: false,
      password2_activated: false,
      waiting_for_response: false
    }
  },
  computed: {
    emailValidity() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.email).toLowerCase());
    },
    password1Validity() {
      return this.password1_long_enough && this.password1_not_too_long && this.password1_not_enitirely_numeric
    },
    password2Validity() {
      return this.password2 === this.password1
    },
    password1_long_enough() {
      return this.password1.length >= this.min_password_length
    },
    password1_not_too_long() {
      return this.password1.length <= this.max_password_length
    },
    password1_not_enitirely_numeric() {
      return !(/^\d+$/.test(this.password1))
    },
    password1_info() {
      if (!this.password1_long_enough) return 'hasło jest zbyt krótkie'
      if (!this.password1_not_too_long) return 'hasło jest zbyt długie'
      if (!this.password1_not_enitirely_numeric) return 'hasło nie może składać się tylko z cyfr'
      return ''
    },
    password1_info_display() {
      return this.password1_info !== '' && this.password1_blurred && this.password1_activated
    },
    password2_info_display() {
      return !this.password2Validity && this.password2_blurred && this.password2_activated
    },
    isFormValid() {
      return this.password1Validity && this.password2Validity && this.emailValidity
    },
  },
  methods: {
    submitForm() {
      this.email_info = ''
      this.password_info = ''
      this.password2_blurred = true
      this.waiting_for_response = true
      if (this.isFormValid) {
        apiFetch('users/', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            email: this.email,
            password: this.password1
          })
        })
            .then(response => {
              if (response.ok) {
                this.$router.push({name: 'verify_email'})
              } else {
                this.handleFailure(response.json())
              }
              this.waiting_for_response = false
            })
      }
    },
    handleFailure(json) {
      json.then(dt => {
        if (dt.email) {
          this.email_info = 'konto powiązane z tym adresem email już istnieje'
        } else {
          if (dt[0] === "['This password is too common.']") {
            this.password_info = 'to hasło jest zbyt popularne'
          } else this.password_info = dt[0]
        }
      })
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

<style lang="scss" scoped>
.spinner {
  align-self: center;
  @include spinner;
}
</style>
