<template>
  <modal ref="modal_ref" @close-modal="reset">
    <template v-slot:header>Importuj listę sprzętu</template>
    <template v-slot:body>
      <form @submit.prevent="submitLp" class="import_form">
        <h3 class="header">lighterpack.com</h3>
        <input v-model="inputs.lp_url.value" class="hg-input" :class="{marked: inputs.lp_url.marked}"
               type="url" placeholder="link do listy z lighterpack.com" id="lp_url" :name="inputs.lp_url.name"
               @blur="markAsBlurred" @input="markAsActivated">
        <button v-if="!lp_waiting_for_response" type="submit" class="hg-button">importuj</button>
        <div v-else class="hg-spinner"></div>
        <label v-show="inputs.lp_url.info" for="lp_url" class="hg-form_label">{{ inputs.lp_url.info }}</label>
      </form>
      <form @submit.prevent="submitHg" class="import_form">
        <h3 class="header">hikegear.pl</h3>
        <input v-model="inputs.hg_url.value" class="hg-input" :class="{marked: inputs.hg_url.marked}"
               type="url" placeholder="link do listy z hikegear.pl" id="hg_url" :name="inputs.hg_url.name"
               @blur="markAsBlurred" @input="markAsActivated">
        <button v-if="!hg_waiting_for_response" type="submit" class="hg-button">importuj</button>
        <div v-else class="hg-spinner"></div>
        <label v-show="inputs.hg_url.info" for="hg_url" class="hg-form_label">{{ inputs.hg_url.info }}</label>
      </form>
    </template>
  </modal>
</template>

<script>
import Modal from "@/components/Modal";
import {ref, reactive} from "vue";
import {useForm, useInputs} from "@/hooks";
import {apiFetch, hashids} from "@/functions";
import {useStore} from "vuex";
import Constants from '@/constants'

export default {
  name: "ImportBackpack",
  components: {Modal},
  setup() {
    const store = useStore()
    const modal_ref = ref(null) // template ref
    const openModal = () => modal_ref.value.openModal()

    const {Input, ValidityInfo} = useInputs()

    const isLpUrlValid = (url_value) => {
      const hash_len = 6
      const www_url = 'https://www.lighterpack.com/r/'
      const url = 'https://lighterpack.com/r/'
      const with_www = url_value.slice(0, www_url.length) === www_url && url_value.length === www_url.length + hash_len
      const without_www = url_value.slice(0, url.length) === url && url_value.length === url.length + hash_len
      return new ValidityInfo(with_www || without_www, with_www || without_www ? '' : 'link jest niepoprawny')
    }

    const isHgUrlValid = (url_value) => {
      const hash_len = Constants.HASHIDS_HASH_LEN
      let www_url = 'https://www.hikegear.pl/lista/'
      let url = 'https://hikegear.pl/lista/'
      if (process.env.VUE_APP_INCLUDE_CREDENTIALS) {
        www_url = 'http://127.0.0.1:8081/lista/'
        url = 'http://127.0.0.1:8081/lista/'
      }
      const with_www = url_value.slice(0, www_url.length) === www_url && url_value.length === www_url.length + hash_len
      const without_www = url_value.slice(0, url.length) === url && url_value.length === url.length + hash_len
      return new ValidityInfo(with_www || without_www, with_www || without_www ? '' : 'link jest niepoprawny')
    }

    const inputs = reactive({
      lp_url: new Input('lp_url', isLpUrlValid),
      hg_url: new Input('hg_url', isHgUrlValid)
    })

    const {markAsBlurred, markAsActivated} = useForm(inputs)
    const lp_waiting_for_response = ref(false)
    const hg_waiting_for_response = ref(false)

    const reset = () => {
      inputs.lp_url.reset()
      inputs.hg_url.reset()
    }

    const submitLp = () => {
      if (inputs.lp_url.is_valid) {
        lp_waiting_for_response.value = true
        apiFetch('import_from_lp', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({url: inputs.lp_url.value})
        }, [404])
            .then(response => {
              lp_waiting_for_response.value = false
              if (response.ok) response.json().then(data => {
                store.dispatch('editor/addImportedBackpack', data)
                modal_ref.value.closeModal()
              })
              else if (response.status === 404) inputs.lp_url.response_info = 'podana lista sprzętu nie istnieje'
              else alert(response.status)
            })
      }
    }
    const submitHg = () => {
      if (inputs.hg_url.is_valid) {
        const backpack_id = hashids.decode(inputs.hg_url.value.slice(-Constants.HASHIDS_HASH_LEN))[0]
        if (backpack_id) {
          hg_waiting_for_response.value = true
          apiFetch('import_from_hg', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({backpack_id})
          }, [403, 404])
              .then(response => {
                hg_waiting_for_response.value = false
                if (response.ok) response.json().then(data => {
                  store.dispatch('editor/addImportedBackpack', data)
                  modal_ref.value.closeModal()
                })
                else if (response.status === 404) inputs.hg_url.response_info = 'podana lista sprzętu nie istnieje'
                else if (response.status === 403) inputs.hg_url.response_info = 'podana lista jest prywatna'
              })
        } else return inputs.hg_url.response_info = 'podana lista sprzętu nie istnieje'
      }
    }

    return {
      modal_ref, inputs, lp_waiting_for_response, hg_waiting_for_response,
      markAsActivated, markAsBlurred, submitLp, submitHg, openModal, reset
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
}

.import_form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.hg-input {
  width: 18rem;
  font-size: 1rem;
  max-width: 100%;
  box-sizing: border-box;
}

.hg-button {
  font-size: 1rem;
}

.hg-spinner {
  margin-left: 30px;
}

</style>


