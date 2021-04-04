<template>
  <OutsideBaseApp>
    <form class="hg-flx_col_ctr" @submit.prevent="submitForm">
      <h2>Rejestracja</h2>
      <input
          id="email" inputmode="email" placeholder="e-mail" required type="email"
          v-model.trim="inputs.email.value"
          :class="{ marked: inputs.email.marked }"
          :name="inputs.email.name"
          class="hg-input"
          @blur="markAsBlurred" @input="markAsActivated">
      <label v-show="inputs.email.info" for="email" class="hg-form_label">{{ inputs.email.info }}</label>
      <input
          id="password1" autocomplete="new-password" required type="password"
          v-model.trim="inputs.password1.value"
          :class="{ marked: inputs.password1.marked}"
          :minlength="min_password_length" :maxlength="max_password_length"
          :name="inputs.password1.name"
          :placeholder="'hasło (min. ' + min_password_length + ' znaków)'"
          class="hg-input"
          @blur="markAsBlurred" @input="markAsActivated">
      <label v-show="inputs.password1.info" for="password1" class="hg-form_label">{{ inputs.password1.info }}</label>
      <input
          id="password2" autocomplete="new-password" placeholder="powtórz hasło" required type="password"
          v-model.trim="inputs.password2.value"
          :class="{ marked: inputs.password2.marked}"
          :minlength="min_password_length" :maxlength="max_password_length"
          :name="inputs.password2.name"
          class="hg-input"
          @blur="markAsBlurred" @input="markAsActivated">
      <label v-show="inputs.password2.info" for="password2" class="hg-form_label">{{ inputs.password2.info }}</label>
      <button v-if="!waiting_for_response" class="hg-button" type="submit">zarejestruj</button>
      <div v-else class="hg-spinner"></div>
    </form>
  </OutsideBaseApp>
</template>

<script>
import OutsideBaseApp from "@/components/outside/OutsideBaseApp";
import {apiFetch} from "@/functions";
import {computed, reactive} from "vue";
import {useRouter} from 'vue-router'
import {useForm, useEmail, usePasswords, useInputs} from "@/hooks";

export default {
  name: "Register",
  components: {OutsideBaseApp},
  setup() {
    const router = useRouter()
    const {Input} = useInputs()
    const {isEmailValid} = useEmail()
    const {min_password_length, max_password_length, isPasswordValid, arePasswordsEqual} = usePasswords()

    const inputs = reactive({
      email: new Input('email', isEmailValid),
      password1: new Input('password1', isPasswordValid),
    })
    inputs.password2 = new Input('password2', (value) => arePasswordsEqual(inputs.password1, value))

    const {waiting_for_response, markAsBlurred, markAsActivated} = useForm(inputs)

    const is_form_valid = computed(() => inputs.email.is_valid && inputs.password1.is_valid && inputs.password2.is_valid)

    const submitForm = () => {
      inputs.password2.blurred = true
      if (is_form_valid.value) {
        waiting_for_response.value = true
        apiFetch('users', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            email: inputs.email.value,
            password: inputs.password1.value
          })
        }, [400])
            .then(response => {
              waiting_for_response.value = false
              if (response.ok) {
                router.push({name: 'verify_email'})
              } else {
                handleFailure(response)
              }
            })
      }
    }
    const handleFailure = (response) => {
      if (response.status === 400) {
        response.json().then(dt => {
          if (dt.email) {
            inputs.email.response_info = 'konto powiązane z tym adresem email już istnieje'
          } else {
            if (dt[0] === "['This password is too common.']") {
              inputs.password1.response_info = 'to hasło jest zbyt popularne'
            } else inputs.password1.response_info = dt[0]
          }
        })
      }
    }

    return {
      inputs, min_password_length, max_password_length, waiting_for_response,
      submitForm, markAsBlurred, markAsActivated
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
