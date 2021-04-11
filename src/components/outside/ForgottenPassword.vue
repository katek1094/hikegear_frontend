<template>
  <OutsideBaseApp>
    <div v-if="request_sent" class="hg-flx_col_ctr hg-text-wrapper">
      <h2>Na podany adres został wysłany email</h2>
      <p>znajdziesz w nim link pozwalający zresetować twoje hasło</p>
      <p>link jest ważny przez 20 minut od jego wysłania</p>
    </div>
    <form v-else class="hg-flx_col_ctr hg-text-wrapper" @submit.prevent="submit">
      <h2>podaj swój email, aby zresetować hasło</h2>
      <input
          id="email"
          v-model="inputs.email.value"
          :class="{ marked: inputs.email.marked}"
          autofocus
          type="email"
          inputmode="email"
          maxlength="320"
          :name="inputs.email.name"
          class="hg-input"
          required
          placeholder="email"
          @blur="markAsBlurred"
          @input="markAsActivated">
      <label v-show="inputs.email.info" for="email" class="hg-form_label">{{ inputs.email.info }}</label>
      <button v-if="!waiting_for_response" type="submit" class="hg-button">zatwierdź</button>
      <div v-else class="hg-spinner"></div>
    </form>
  </OutsideBaseApp>
</template>

<script>
import OutsideBaseApp from "@/components/outside/OutsideBaseApp";
import {apiFetch} from "@/functions";
import {useEmail, useForm, useInputs} from "@/hooks";
import {reactive, ref} from "vue";

export default {
  name: "ForgottenPassword",
  components: {OutsideBaseApp},
  setup() {
    const {Input} = useInputs()
    const {isEmailValid} = useEmail()
    const inputs = reactive({
      email: new Input('email', isEmailValid)
    })
    const {waiting_for_response, markAsBlurred, markAsActivated} = useForm(inputs)

    const request_sent = ref(false)

    const submit = () => {
      if (inputs.email.is_valid) {
        waiting_for_response.value = true
        apiFetch('users/reset_password_start', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            email: inputs.email.value,
          })
        })
            .then(response => {
              waiting_for_response.value = false
              if (response.ok) request_sent.value = true
            })
      }
    }

    return {inputs, waiting_for_response, request_sent, markAsBlurred, markAsActivated, submit}
  }
}
</script>

<style lang="scss" scoped>

</style>
