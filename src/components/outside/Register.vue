<template>
  <OutsideBaseApp>
    <form class="hg-flx_col_ctr" @submit.prevent="submitForm">
      <h2>Rejestracja</h2>
      <!--      {{ inputs }}-->

      <!--      {{ passwords_validation }}-->
      <input id="registration-email" v-model.trim="inputs.email.value"
             :class="{ invalid: !email_validity, blurred: inputs.email.blurred, activated: inputs.email.activated}"
             class="hg-input"
             inputmode="email" :name="inputs.email.name" placeholder="e-mail" required type="email"
             @blur="markAsBlurred"
             @input="markAsActivated ">
      <label v-if="email_info !== ''" for="registration-email" class="hg-form_label">{{ email_info }}</label>
      <input id="registration-password1" v-model.trim="inputs.password1.value" autocomplete="new-password"
             :class="{ invalid: !passwords_validation.password1.is_valid, blurred: inputs.password1.blurred, activated: inputs.password1.activated}"
             :maxlength="max_password_length" :minlength="min_password_length"
             :placeholder="'hasło (min. ' + min_password_length + ' znaków)'" class="hg-input"
             :name="inputs.password1.name" required type="password" @blur="markAsBlurred" @input="markAsActivated ">
      <label v-show="password1_info_display" for="registration-password1" class="hg-form_label">
        {{ passwords_validation.password1.info }}</label>
      <label v-show="password_info !== ''" class="hg-form_label">{{ password_info }}</label>
      <input id="registration-password2" v-model.trim="inputs.password2.value" autocomplete="new-password"
             :class="{ invalid: !passwords_validation.password2.is_valid, blurred: inputs.password2.blurred, activated: inputs.password2.activated}"
             :maxlength="max_password_length" :minlength="min_password_length" class="hg-input"
             :name="inputs.password2.name"
             placeholder="powtórz hasło" required type="password"
             @blur="markAsBlurred" @input="markAsActivated ">
      <label v-show="password2_info_display" for="registration-password2" class="hg-form_label">hasła nie są takie
        same</label>
      <button v-show="!waiting_for_response" id="register-submit" class="hg-button" type="submit">zarejestruj</button>
      <div v-if="waiting_for_response" class="hg-spinner"></div>
    </form>
  </OutsideBaseApp>
</template>

<script>
import OutsideBaseApp from "@/components/outside/OutsideBaseApp";
import {apiFetch} from "@/functions";
import {computed, ref, reactive} from "vue";
import {useRouter} from 'vue-router'
import {useForm, useEmail, usePasswords} from "@/hooks";

export default {
  name: "Register",
  components: {OutsideBaseApp},
  setup() {
    const router = useRouter()

    const inputs = reactive({
      email: {
        name: 'email',
        value: '',
        blurred: false,
        activated: false,
      },
      password1: {
        name: 'password1',
        value: '',
        blurred: false,
        activated: false,
      },
      password2: {
        name: 'password2',
        value: '',
        blurred: false,
        activated: false,
      },
    })
    const {markAsBlurred, markAsActivated} = useForm(inputs)
    const {email_validity} = useEmail(inputs.email)
    const {
      min_password_length,
      max_password_length,
      passwords_validation
    } = usePasswords(inputs, [inputs.password1, inputs.password2])

    const email_info = ref('')
    const password_info = ref('')
    const waiting_for_response = ref(false)

    const password1_info_display = computed(() => {
      return passwords_validation.value.password1.info !== '' && inputs.password1.blurred && inputs.password1.activated
    })
    const password2_info_display = computed(() => {
      return !passwords_validation.value.password2.is_valid && inputs.password2.blurred && inputs.password2.activated
    })
    const is_form_valid = computed(() => {
      return passwords_validation.value.password1.is_valid.value && passwords_validation.value.password2.is_valid.value && email_validity.value
    })
    const submitForm = () => {
      email_info.value = ''
      password_info.value = ''
      inputs.password2.blurred = true
      waiting_for_response.value = true
      if (is_form_valid.value) {
        apiFetch('users/', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            email: inputs.email.value,
            password: inputs.password1.value
          })
        })
            .then(response => {
              if (response.ok) {
                router.push({name: 'verify_email'})
              } else {
                alert(response.status)  // TODO: delete this later
                handleFailure(response.json())
              }
              waiting_for_response.value = false
            })
      }
    }
    const handleFailure = (json) => {
      json.then(dt => {
        if (dt.email) {
          email_info.value = 'konto powiązane z tym adresem email już istnieje'
        } else {
          if (dt[0] === "['This password is too common.']") {
            password_info.value = 'to hasło jest zbyt popularne'
          } else password_info.value = dt[0]
        }
      })
    }

    return {
      inputs, min_password_length, max_password_length, email_info, password_info, waiting_for_response,
      email_validity, password1_info_display,
      password2_info_display, passwords_validation,
      submitForm, markAsBlurred, markAsActivated
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
