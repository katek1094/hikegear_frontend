<template>
  <form @submit.prevent="submit" class="hg-flx_col_ctr">
    <h3>zmiana hasła</h3>
    <input id="old_password" v-model.trim="inputs.old_password.value" class="hg-input"
           :class="{ marked: inputs.old_password.marked }"
           :maxlength="max_password_length" :minlength="min_password_length" :name="inputs.old_password.name"
           placeholder="obecne hasło" required type="password"
           @blur="markAsBlurred" @input="markAsActivated">
    <label v-show="inputs.old_password.info" for="old_password"
           class="hg-form_label">{{ inputs.old_password.info }}</label>
    <input id="new_password1" v-model.trim="inputs.new_password1.value" class="hg-input"
           :class="{ marked: inputs.new_password1.marked }"
           :maxlength="max_password_length" :minlength="min_password_length" :name="inputs.new_password1.name"
           placeholder="nowe hasło" required type="password"
           @blur="markAsBlurred" @input="markAsActivated">
    <label v-show="inputs.new_password1.info" for="new_password1"
           class="hg-form_label">{{ inputs.new_password1.info }}</label>
    <input id="new_password2" v-model.trim="inputs.new_password2.value" class="hg-input"
           :class="{ marked: inputs.new_password2.marked }"
           :maxlength="max_password_length" :minlength="min_password_length" :name="inputs.new_password2.name"
           placeholder="powtórz nowe hasło" required
           type="password"
           @blur="markAsBlurred" @input="markAsActivated">
    <label v-show="inputs.new_password2.info" for="new_password2"
           class="hg-form_label">{{ inputs.new_password2.info }}</label>
    <button v-if="!waiting_for_response" type="submit" class="hg-button">zmień hasło</button>
    <div v-else class="hg-spinner"></div>
    <p class="success" v-show="success">hasło zostało zmienione</p>
  </form>
</template>

<script>
import {apiFetch} from "@/functions";
import {useForm, useInputs, usePasswords} from "@/hooks";
import {ref, reactive, computed} from "vue";

export default {
  name: "ChangePassword",
  setup() {
    const {Input} = useInputs()
    const {min_password_length, max_password_length, isPasswordValid, arePasswordsEqual} = usePasswords()

    const inputs = reactive({
      old_password: new Input('old_password', isPasswordValid),
      new_password1: new Input('new_password1', isPasswordValid),
    })
    inputs.new_password2 = new Input('new_password2', (value) => arePasswordsEqual(inputs.new_password1, value))

    const {waiting_for_response, markAsBlurred, markAsActivated} = useForm(inputs)

    const success = ref(false)

    const is_form_valid = computed(() => inputs.old_password.is_valid && inputs.new_password1.is_valid && inputs.new_password2.is_valid)

    const submit = () => {
      inputs.new_password2.blurred = true
      if (is_form_valid.value) {
        waiting_for_response.value = true
        apiFetch('users/change_password/', {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            old_password: inputs.old_password.value,
            new_password: inputs.new_password1.value
          })
        })
            .then(response => {
              waiting_for_response.value = false
              if (response.ok) {
                success.value = true
                setTimeout(() => success.value = false, 6000)
                inputs.old_password.reset()
                inputs.new_password1.reset()
                inputs.new_password2.reset()
              } else {
                if (response.status === 400) {
                  response.json().then(data => {
                    if (data['info'] === 'provided wrong password!') {
                      inputs.old_password.response_info = 'podane hasło jest nieprawidłowe'
                    } else {
                      inputs.new_password1.response_info = 'to hasło jest zbyt popularne'
                    }
                  })
                } else alert(response.status)
              }
            })
      }
    }

    return {
      inputs, min_password_length, max_password_length, waiting_for_response, success,
      markAsBlurred, markAsActivated, submit
    }
  },
}
</script>

<style lang="scss" scoped>
.success {
  color: yellowgreen;
}
</style>

