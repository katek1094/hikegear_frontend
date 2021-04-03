<template>
  <OutsideBaseApp>
    <form class="hg-flx_col_ctr" @submit.prevent="submitForm">
      <h2 class="auth__title">Logowanie</h2>
      <input id="email"
             v-model.trim="inputs.email.value"
             :class="{ marked: inputs.email.marked}"
             autofocus
             class="hg-input"
             inputmode="email"
             maxlength="320"
             :name="inputs.email.name"
             placeholder="e-mail"
             required
             type="email"
             @blur="markAsBlurred"
             @input="markAsActivated">
      <label v-show="response_info !== ''" class="hg-form_label">{{ response_info }}</label>
      <label v-show="inputs.email.info" for="email" class="hg-form_label">{{ inputs.email.info }}</label>
      <input id="password"
             v-model.trim="inputs.password.value"
             :class="{ marked: inputs.password.marked}"
             :maxlength="max_password_length"
             class="hg-input"
             :name="inputs.password.name"
             placeholder="hasło"
             required
             type="password"
             @blur="markAsBlurred"
             @input="markAsActivated ">
      <label v-show="inputs.password.info" class="hg-form_label" for="password">{{ inputs.password.info }}</label>
      <button v-if="!waiting_for_response" class="hg-button" type="submit">zaloguj</button>
      <div v-else class="hg-spinner"></div>
      <router-link :to="{name: 'register'}" class="login__option hg-link">nie mam konta (rejestracja)</router-link>
      <router-link :to="{name: 'forgotten_password'}" class="login__option hg-link">nie pamiętam hasła</router-link>
    </form>
  </OutsideBaseApp>
</template>

<script>
import OutsideBaseApp from "@/components/outside/OutsideBaseApp";
import {computed, reactive, ref} from "vue";
import {useEmail, useForm, useInputs, usePasswords} from "@/hooks";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

export default {
  name: "Login",
  components: {OutsideBaseApp},
  setup() {
    const store = useStore()
    const router = useRouter()
    const {Input} = useInputs()
    const {isEmailValid} = useEmail()
    const {min_password_length, max_password_length, isPasswordValid} = usePasswords()

    const inputs = reactive({
      email: new Input('email', isEmailValid),
      password: new Input('password', isPasswordValid)
    })
    const {waiting_for_response, markAsBlurred, markAsActivated} = useForm(inputs)

    const is_form_valid = computed(() => inputs.email.is_valid && inputs.password.is_valid)
    const response_info = ref('')

    const submitForm = () => {
      response_info.value = ''
      inputs.password.blurred = true
      if (is_form_valid.value) {
        waiting_for_response.value = true
        store.dispatch('auth/login', {
          email: inputs.email.value,
          password: inputs.password.value
        })
            .then(async status => {
              if (status === 200) {
                await store.dispatch('editor/getInitialData')
                    .then(() => router.push({name: 'editor'}))
              } else if (status === 'bad credentials') {
                response_info.value = 'błędny email lub hasło'
              } else if (status === 'activate your account') {
                await router.push({name: 'verify_email'})
              } else {
                throw 'something wrong with response' // TODO: update response handling
              }
              waiting_for_response.value = false
            })
      }
    }

    return {
      inputs, min_password_length, max_password_length, response_info, waiting_for_response,
      submitForm, markAsBlurred, markAsActivated
    }
  },

}
</script>

<style lang="scss" scoped>
.login__option {
  margin-top: 20px;
}
</style>
