<template>
  <OutsideBaseApp>
    <div>
      <form class="hg-flx_col_ctr" @submit.prevent="submitForm">
        <h2 class="auth__title">Logowanie</h2>
        <input id="login-email"
               v-model.trim="inputs.email.value"
               :class="{ invalid: !email_validity, blurred: inputs.email.blurred, activated: inputs.email.activated}"
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
        <label v-if="info_display" for="login-email" class="hg-form_label">{{ info }}</label>
        <input id="login-password"
               v-model.trim="inputs.password.value"
               :class="{ invalid: !passwords_validation.password.is_valid, blurred: inputs.password.blurred, activated: inputs.password.activated}"
               :maxlength="max_password_length"
               class="hg-input"
               :name="inputs.password.name"
               placeholder="hasło"
               required
               type="password"
               @blur="markAsBlurred"
               @input="markAsActivated ">
        <label v-if="password_info_display" class="hg-form_label"
               for="login-password">{{ passwords_validation.password.info }}</label>
        <button v-if="!waiting_for_response" class="hg-button" type="submit" id="login-submit">zaloguj</button>
        <div v-else class="hg-spinner"></div>
        <router-link :to="{name: 'register'}" class="login__option login__register">nie mam konta (rejestracja)
        </router-link>
        <a :href="password_reset_url" class="login__option login__forgot_password">nie pamiętam hasła</a>
      </form>
    </div>
  </OutsideBaseApp>
</template>

<script>
import OutsideBaseApp from "@/components/outside/OutsideBaseApp";
import {computed, reactive, ref} from "vue";
import {useEmail, useForm, usePasswords} from "@/hooks";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

export default {
  name: "Login",
  components: {OutsideBaseApp},
  setup() {
    const store = useStore()
    const router = useRouter()

    const inputs = reactive({
      email: {
        name: 'email',
        value: '',
        blurred: false,
        activated: false,
      },
      password: {
        name: 'password',
        value: '',
        blurred: false,
        activated: false,
      }
    })
    const {markAsBlurred, markAsActivated} = useForm(inputs)
    const {email_validity} = useEmail(inputs.email)
    const {min_password_length, max_password_length, passwords_validation} = usePasswords(inputs, [inputs.password])

    const info = ref('')
    const waiting_for_response = ref(false)

    const password_info_display = computed(() => {
      return passwords_validation.value.password.is_valid !== '' && inputs.password.blurred && inputs.password.activated
    })
    const info_display = computed(() => {
      return info.value !== '' && inputs.email.blurred && inputs.email.activated
    })
    const is_form_valid = computed(() => {
      return email_validity.value && passwords_validation.value.all_valid
    })
    const password_reset_url = computed(() => {
      return process.env.VUE_APP_API_URL + '/accounts/password_reset/'
    })

    const submitForm = () => {
      info.value = ''
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
                info.value = 'błędny email lub hasło'
              } else if (status === 'activate your account') {
                await router.push({name: 'verify_email'})
              } else {
                throw 'something wrong with response'
              }
              waiting_for_response.value = false
            })
      }
    }

    return {
      inputs, min_password_length, max_password_length, info, waiting_for_response,
      email_validity, password_info_display, passwords_validation,
      info_display, password_reset_url,
      submitForm, markAsBlurred, markAsActivated
    }
  },

}
</script>

<style lang="scss" scoped>
.login__option {
  margin-top: 20px;
  color: black;
  text-decoration: none;
}

.login__option:hover {
  text-decoration: underline;
}

</style>
