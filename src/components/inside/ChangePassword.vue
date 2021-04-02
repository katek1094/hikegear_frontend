<template>
  <form @submit.prevent="submit" class="hg-flx_col_ctr">
    <h3>zmiana hasła</h3>
    {{passwords_validation}}
    <input id="password" ref="old_password_ref" v-model.trim="inputs.old_password.value" class="hg-input"
           :class="{ invalid: !passwords_validation.old_password.is_valid, blurred: inputs.old_password.blurred , activated: inputs.old_password.activated }"
           :maxlength="max_password_length" :minlength="min_password_length" :name="inputs.old_password.name"
           placeholder="obecne hasło" required type="password"
           @blur="markAsBlurred" @input="activate">
    <label v-show="password_info_display" for="password" class="hg-form_label">{{
        passwords_validation.old_password.info
      }}</label>
    <input id="new_password1" ref="new_password1_ref" v-model.trim="inputs.new_password1.value" class="hg-input"
           :class="{ invalid: !passwords_validation.new_password1.is_valid, blurred: inputs.new_password1.blurred , activated: inputs.new_password1.activated }"
           :maxlength="max_password_length" :minlength="min_password_length" :name="inputs.new_password1.name"
           placeholder="nowe hasło" required type="password"
           @blur="markAsBlurred" @input="activate">
    <label v-show="new_password1_info_display" for="new_password1"
           class="hg-form_label">{{ passwords_validation.new_password1.info }}</label>
    <input id="new_password2" ref="new_password2_ref" v-model.trim="inputs.new_password2.value" class="hg-input"
           :class="{ invalid: !passwords_validation.new_password2.is_valid, blurred: inputs.new_password2.blurred, activated: inputs.new_password2.activated }"
           :maxlength="max_password_length" :minlength="min_password_length" :name="inputs.new_password2.name"
           placeholder="powtórz nowe hasło" required
           type="password"
           @blur="markAsBlurred" @input="activate">
    <label v-show="new_password2_info_display" for="new_password2" class="hg-form_label">{{
        passwords_validation.new_password2.info
      }}</label>
    <button v-if="!waiting_for_response" type="submit" class="hg-button">zmień hasło</button>
    <div v-else class="hg-spinner"></div>
    <p class="success" v-show="success">hasło zostało zmienione</p>
  </form>
</template>

<script>
// import {apiFetch} from "@/functions";
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
      passwords_validation
    } = usePasswords(inputs, [inputs.old_password, inputs.new_password1, inputs.new_password2])

    const waiting_for_response = ref(false)

    const old_password_info = ref('')
    const new_password_info = ref('')
    const new_password2_info = ref('hasła nie są takie same')
    const success = ref(false)

    const old_password_ref = ref(null) // template ref
    const new_password2_ref = ref(null) // template ref

    const password_info_display = computed(() => {
      return passwords_validation.value.old_password.info !== '' && inputs.old_password.blurred && inputs.old_password.activated
    })
    const new_password1_info_display = computed(() => {
      return passwords_validation.value.new_password1.info !== '' && inputs.new_password1.blurred && inputs.new_password1.activated
    })
    const new_password2_info_display = computed(() => {
      return !passwords_validation.value.new_password2.is_valid && inputs.new_password2.blurred && inputs.new_password2.activated
    })

    const activate = (e) => {
      markAsActivated(e)
      if (name === 'password' && old_password_info.value !== '') {
        old_password_info.value = ''
      } else if (name === 'new_password1' && new_password_info.value !== '') {
        new_password_info.value = ''
      }
    }
    const submit = () => {}
    // const submit = () => {
    //   new_password_info.value = ''
    //   old_password_info.value = ''
    //   inputs.new_password2.blurred = true
    //   waiting_for_response.value = true
    //   if (is_form_valid.value) {
    //     apiFetch('users/change_password/', {
    //       method: 'PATCH',
    //       headers: {'Content-Type': 'application/json'},
    //       body: JSON.stringify({
    //         old_password: inputs.old_password.value,
    //         new_password: inputs.new_password1.value
    //       })
    //     })
    //         .then(response => {
    //           inputs.old_password.value = ''
    //           inputs.new_password1.value = ''
    //           inputs.new_password2.value = ''
    //           waiting_for_response.value = false
    //           if (response.ok) {
    //             new_password2_ref.value.blur()
    //             success.value = true
    //             setTimeout(() => success.value = false, 6000)
    //             inputs.old_password.blurred = false
    //             inputs.new_password1.blurred = false
    //             inputs.new_password2.blurred = false
    //             inputs.old_password.activated = false
    //             inputs.new_password1.activated = false
    //             inputs.new_password2.activated = false
    //           } else {
    //             response.json().then(data => {
    //               old_password_ref.value.focus()
    //               if (data['info'] === 'provided wrong password!') {
    //                 old_password_info.value = 'podane hasło jest nieprawidłowe'
    //                 inputs.new_password1.blurred = false
    //                 inputs.new_password2.blurred = false
    //                 inputs.new_password1.activated = false
    //                 inputs.new_password2.activated = false
    //               } else {
    //                 new_password_info.value = 'to hasło jest zbyt popularne'
    //                 inputs.old_password.blurred = false
    //                 inputs.old_password.activated = false
    //                 inputs.new_password2.blurred = false
    //                 inputs.new_password2.activated = false
    //               }
    //             })
    //           }
    //         })
    //   }
    // }


    return {
      inputs, min_password_length, max_password_length, waiting_for_response, passwords_validation,
      old_password_info, new_password_info, new_password2_info, success, old_password_ref, new_password2_ref,
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
