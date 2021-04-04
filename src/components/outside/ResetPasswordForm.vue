<template>
  <OutsideBaseApp>
    <div v-if="token_expired" class="hg-flx_col_ctr hg-text-wrapper">
      <h2>Czas na zresetowanie hasła minął</h2>
      <p>Aby zresetować hasło musisz ponownie wypełnić
        <router-link class="hg-link" :to="{name: 'forgotten_password'}">ten formularz</router-link>
      </p>
    </div>
    <form v-else class="hg-flx_col_ctr" @submit.prevent="submitForm">
      <h2>Ustaw nowe hasło</h2>
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
      <button v-if="!waiting_for_response" class="hg-button" type="submit">zatwierdź</button>
      <div v-else class="hg-spinner"></div>
    </form>
  </OutsideBaseApp>
</template>

<script>
import OutsideBaseApp from "@/components/outside/OutsideBaseApp";
import {useForm, useInputs, usePasswords} from "@/hooks";
import {computed, reactive, ref} from "vue";
import {apiFetch} from "@/functions";
import {useRouter} from "vue-router";

export default {
  name: "ResetPasswordForm",
  components: {OutsideBaseApp},
  props: ['uidb64', 'token'],
  setup(props) {
    const router = useRouter()
    const {Input} = useInputs()
    const {min_password_length, max_password_length, isPasswordValid, arePasswordsEqual} = usePasswords()

    const inputs = reactive({
      password1: new Input('password1', isPasswordValid),
    })
    inputs.password2 = new Input('password2', (value) => arePasswordsEqual(inputs.password1, value))

    const {waiting_for_response, markAsBlurred, markAsActivated} = useForm(inputs)

    const token_expired = ref(false)

    const is_form_valid = computed(() => inputs.password1.is_valid && inputs.password2.is_valid)

    const submitForm = () => {
      inputs.password2.blurred = true
      if (is_form_valid.value) {
        waiting_for_response.value = true
        apiFetch('users/reset_password', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            password: inputs.password1.value,
            uidb64: props.uidb64,
            token: props.token
          })
        })
            .then(response => {
              waiting_for_response.value = false
              if (response.ok) {
                router.push({name: 'editor'})
              } else {
                if (response.status === 400) {
                  response.json().then(dt => {
                    if (dt[0] === "['This password is too common.']") {
                      inputs.password1.response_info = 'to hasło jest zbyt popularne'
                    } else inputs.password1.response_info = dt[0]
                  })
                } else if (response.status === 410) token_expired.value = true
                else alert(response.status) // TODO: handle this later
              }
            })
      }
    }

    return {
      inputs, min_password_length, max_password_length, waiting_for_response, token_expired,
      submitForm, markAsBlurred, markAsActivated
    }
  }
}
</script>

<style lang="scss" scoped>
.hg-link {
  font-weight: bold;
}
</style>
