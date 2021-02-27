<template>
  <form @submit.prevent="submit">
    <h3>zmiana hasła</h3>
    <input id="password" ref="password" v-model.trim="password"
           :class="{ invalid: !password_validity, blurred: password_blurred, activated: password_activated}"
           :maxlength="max_password_length" :minlength="min_password_length" name="password"
           placeholder="obecne hasło" required type="password"
           @blur="markAsBlurred" @input="activate">
    <label v-show="password_info_display" for="password">{{ password_info }}</label>
    <input id="new_password1" ref="new_password1" v-model.trim="new_password1"
           :class="{ invalid: !new_password1_validity, blurred: new_password1_blurred, activated: new_password1_activated}"
           :maxlength="max_password_length" :minlength="min_password_length" name="new_password1"
           placeholder="nowe hasło" required type="password"
           @blur="markAsBlurred" @input="activate">
    <label v-show="new_password1_info_display" for="new_password1">{{ new_password1_info }}</label>
    <input id="new_password2" ref="new_password2" v-model.trim="new_password2"
           :class="{ invalid: !new_password2_validity, blurred: new_password2_blurred, activated: new_password2_activated}"
           :maxlength="max_password_length" :minlength="min_password_length" name="new_password2"
           placeholder="powtórz nowe hasło" required
           type="password"
           @blur="markAsBlurred" @input="activate">
    <label v-show="new_password2_info_display" for="new_password2">{{ new_password2_info }}</label>
    <button>zmień hasło</button>
    <p class="success" v-show="success">hasło zostało zmienione</p>
  </form>
</template>

<script>
import {apiFetch} from "@/functions";

export default {
  name: "ChangePassword",
  data() {
    return {
      password: '',
      new_password1: '',
      new_password2: '',
      min_password_length: 8,
      max_password_length: 30,
      password_blurred: false,
      new_password1_blurred: false,
      new_password2_blurred: false,
      password_activated: false,
      new_password1_activated: false,
      new_password2_activated: false,
      old_password_info: '',
      new_password_info: '',
      new_password2_info: 'hasła nie są takie same',
      success: false
    }
  },
  computed: {
    password_validity() {
      return this.long_enough(this.password) && this.not_too_long(this.password) && this.not_enitirely_numeric(this.password)
    },
    new_password1_validity() {
      return this.long_enough(this.new_password1) && this.not_too_long(this.new_password1) && this.not_enitirely_numeric(this.new_password1)
    },
    new_password2_validity() {
      return this.new_password1 === this.new_password2
    },
    password_info() {
      if (this.old_password_info !== '') {
        return this.old_password_info
      } else return this.info(this.password)
    },
    new_password1_info() {
      if (this.new_password_info !== '') {
        return this.new_password_info
      } else return this.info(this.new_password1)
    },
    password_info_display() {
      return this.password_info !== '' && this.password_blurred && this.password_activated
    },
    new_password1_info_display() {
      return this.new_password1_info !== '' && this.new_password1_blurred && this.new_password1_activated
    },
    new_password2_info_display() {
      return !this.new_password2_validity && this.new_password2_blurred && this.new_password2_activated
    },
    is_form_valid() {
      return this.password_validity && this.new_password1_validity && this.new_password2_validity
    }

  },
  methods: {
    long_enough(password) {
      return password.length >= this.min_password_length
    },
    not_too_long(password) {
      return password.length <= this.max_password_length
    },
    not_enitirely_numeric(password) {
      return !(/^\d+$/.test(password))
    },
    info(password) {
      if (!this.long_enough(password)) return 'hasło jest zbyt krótkie'
      if (!this.not_too_long(password)) return 'hasło jest zbyt długie'
      if (!this.not_enitirely_numeric(password)) return 'hasło nie może składać się tylko z cyfr'
      return ''
    },
    markAsBlurred(e) {
      let name = e.target.getAttribute('name')
      if (this[name + '_activated'] === true) this[name + '_blurred'] = true
    },
    activate(e) {
      let name = e.target.getAttribute('name')
      this[name + '_activated'] = true
      if (name === 'password' && this.old_password_info !== '') {
        this.old_password_info = ''
      } else if (name === 'new_password1' && this.new_password_info !== '') {
        this.new_password_info = ''
      }
    },
    submit() {
      this.new_password_info = ''
      this.old_password_info = ''
      this.new_password2_blurred = true
      if (this.is_form_valid) {
        apiFetch('users/change_password', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            old_password: this.password,
            new_password: this.new_password1
          })
        })
            .then(response => {
              this.password = ''
              this.new_password1 = ''
              this.new_password2 = ''
              if (response.ok) {
                this.$refs.new_password2.blur()
                this.success = true
                setTimeout(() => this.success = false, 6000)
                this.password_blurred = false
                this.new_password1_blurred = false
                this.new_password2_blurred = false
                this.password_activated = false
                this.new_password1_activated = false
                this.new_password2_activated = false
              } else {
                response.json().then(data => {
                  this.$refs.password.focus()
                  if (data['info'] === 'provided wrong password!') {
                    this.old_password_info = 'podane hasło jest nieprawidłowe'
                    this.new_password1_blurred = false
                    this.new_password2_blurred = false
                    this.new_password1_activated = false
                    this.new_password2_activated = false
                  } else {
                    this.new_password_info = 'to hasło jest zbyt popularne'
                    this.password_blurred = false
                    this.password_activated = false
                    this.new_password2_blurred = false
                    this.new_password2_activated = false
                  }
                })
              }
            })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.success {
  color: yellowgreen;
}

form {
  @include flex-column-center;
}

input {
  @include form-input;
}

input.invalid.blurred.activated {
  border-color: red;
}

label {
  margin: 10px 4px;
}

button {
  @include form-submit;
}

</style>
