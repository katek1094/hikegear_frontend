<template>
  <form @submit.prevent="submit" class="hg-flx_col_ctr">
    <h3>zmiana hasła</h3>
    <input id="password" ref="password" v-model.trim="inputs.old_password.value" class="hg-input"
           :class="{ invalid: !password_validity, blurred: inputs.old_password.blurred , activated: inputs.old_password.activated }"
           :maxlength="max_password_length" :minlength="min_password_length" :name="inputs.old_password.name"
           placeholder="obecne hasło" required type="password"
           @blur="markAsBlurred" @input="activate">
    <label v-show="password_info_display" for="password" class="hg-form_label">{{ password_info }}</label>
    <input id="new_password1" ref="new_password1" v-model.trim="inputs.new_password1.value" class="hg-input"
           :class="{ invalid: !new_password1_validity, blurred: inputs.new_password1.blurred , activated: inputs.new_password1.activated }"
           :maxlength="max_password_length" :minlength="min_password_length" :name="inputs.new_password1.name"
           placeholder="nowe hasło" required type="password"
           @blur="markAsBlurred" @input="activate">
    <label v-show="new_password1_info_display" for="new_password1" class="hg-form_label">{{
        new_password1_info
      }}</label>
    <input id="new_password2" ref="new_password2" v-model.trim="inputs.new_password2.value" class="hg-input"
           :class="{ invalid: !new_password2_validity, blurred: inputs.new_password2.blurred, activated: inputs.new_password2.activated }"
           :maxlength="max_password_length" :minlength="min_password_length" :name="inputs.new_password2.value"
           placeholder="powtórz nowe hasło" required
           type="password"
           @blur="markAsBlurred" @input="activate">
    <label v-show="new_password2_info_display" for="new_password2" class="hg-form_label">{{
        new_password2_info
      }}</label>
    <button v-if="!waiting_for_response" type="submit" class="hg-button">zmień hasło</button>
    <div v-else class="hg-spinner"></div>
    <p class="success" v-show="success">hasło zostało zmienione</p>
  </form>
</template>

<script>
import {apiFetch} from "@/functions";
import {useForm, usePasswords} from "@/hooks";
import {reactive, ref, computed} from "vue";

export default {
  name: "ChangePassword",
  setup() {
    const inputs = reactive({
      old_password: {
        name: 'old_password',
        value: '',
        blurred: false,
        activated: false,
      },
      new_password1: {
        name: 'new_password1',
        value: '',
        blurred: false,
        activated: false,
      },
      new_password2: {
        name: 'new_password2',
        value: '',
        blurred: false,
        activated: false,
      },

    })
    const {markAsBlurred, markAsActivated} = useForm(inputs)
    const {
      min_password_length,
      max_password_length,
      // passwords_validation
    } = usePasswords(inputs, [[inputs.old_password, inputs.new_password1, inputs.new_password2]])
    const numeric_regex = /^\d+$/

    const waiting_for_response = ref(false)

    const old_password_info = ref('')
    const new_password_info = ref('')
    const new_password2_info = ref('hasła nie są takie same')
    const success = ref(false)

    const old_password_ref = ref(null) // template ref
    const new_password2_ref = ref(null) // template ref

    const password_validity = computed(() => {
      return long_enough(inputs.old_password.value) && not_too_long(inputs.old_password.value) && not_entirely_numeric(inputs.old_password.value)
    })
    const new_password1_validity = computed(() => {
      return long_enough(inputs.new_password1.value) && not_too_long(inputs.new_password1.value) && not_entirely_numeric(inputs.new_password1.value)
    })
    const new_password2_validity = computed(() => {
      return inputs.new_password1.value === inputs.new_password2.value
    })
    const password_info = computed(() => {
      if (old_password_info.value !== '') {
        return old_password_info
      } else return info(inputs.old_password.value)
    })
    const new_password1_info = computed(() => {
      if (new_password_info.value !== '') {
        return new_password_info
      } else return info(inputs.new_password1.value)
    })
    const password_info_display = computed(() => {
      return password_info.value !== '' && inputs.old_password.blurred && inputs.old_password.activated
    })
    const new_password1_info_display = computed(() => {
      return new_password1_info.value !== '' && inputs.new_password1.blurred && inputs.new_password1.activated
    })
    const new_password2_info_display = computed(() => {
      return !new_password2_validity.value && inputs.new_password2.blurred && inputs.new_password2.activated
    })
    const is_form_valid = computed(() => {
      return password_validity.value && new_password1_validity && new_password2_validity
    })

    const long_enough = (password) => {
      return password.length >= min_password_length
    }
    const not_too_long = (password) => {
      return password.length <= max_password_length
    }
    const not_entirely_numeric = (password) => {
      return !(numeric_regex.test(password))
    }
    const info = (password) => {
      if (!long_enough(password)) return 'hasło jest zbyt krótkie'
      if (!not_too_long(password)) return 'hasło jest zbyt długie'
      if (!not_entirely_numeric(password)) return 'hasło nie może składać się tylko z cyfr'
      return ''
    }
    const activate = (e) => {
      markAsActivated(e)
      if (name === 'password' && old_password_info.value !== '') {
        old_password_info.value = ''
      } else if (name === 'new_password1' && new_password_info.value !== '') {
        new_password_info.value = ''
      }
    }
    const submit = () => {
      new_password_info.value = ''
      old_password_info.value = ''
      inputs.new_password2.blurred = true
      waiting_for_response.value = true
      if (is_form_valid.value) {
        apiFetch('users/change_password/', {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            old_password: inputs.old_password.value,
            new_password: inputs.new_password1.value
          })
        })
            .then(response => {
              inputs.old_password.value = ''
              inputs.new_password1.value = ''
              inputs.new_password2.value = ''
              waiting_for_response.value = false
              if (response.ok) {
                new_password2_ref.value.blur()
                success.value = true
                setTimeout(() => success.value = false, 6000)
                inputs.old_password.blurred = false
                inputs.new_password1.blurred = false
                inputs.new_password2.blurred = false
                inputs.old_password.activated = false
                inputs.new_password1.activated = false
                inputs.new_password2.activated = false
              } else {
                response.json().then(data => {
                  old_password_ref.value.focus()
                  if (data['info'] === 'provided wrong password!') {
                    old_password_info.value = 'podane hasło jest nieprawidłowe'
                    inputs.new_password1.blurred = false
                    inputs.new_password2.blurred = false
                    inputs.new_password1.activated = false
                    inputs.new_password2.activated = false
                  } else {
                    new_password_info.value = 'to hasło jest zbyt popularne'
                    inputs.old_password.blurred = false
                    inputs.old_password.activated = false
                    inputs.new_password2.blurred = false
                    inputs.new_password2.activated = false
                  }
                })
              }
            })
      }
    }


    return {
      inputs, min_password_length, max_password_length, waiting_for_response,
      old_password_info, new_password_info, new_password2_info, success, old_password_ref, new_password2_ref,
      password_validity, new_password1_validity, new_password2_validity, password_info, new_password1_info,
      password_info_display, new_password1_info_display, new_password2_info_display,
      markAsBlurred, activate, submit
    }
  },


}
</script>

<style lang="scss" scoped>
.success {
  color: yellowgreen;
}

</style>
