<template>
  <modal ref="modal_ref" @close-modal="reset">
    <template v-slot:header>Importuj listę sprzętu</template>
    <template v-slot:body>
      <div class="hg-flx_col_ctr">

        <form @submit.prevent="submitLp">
          <h2>Importuj z lighterpack.com</h2>
          <input v-model="inputs.lp_url.value" class="hg-input" :class="{marked: inputs.lp_url.marked}"
                 type="url" placeholder="link do listy z lighterpack.com" id="lp_url" :name="inputs.lp_url.name"
                 @blur="markAsBlurred" @input="markAsActivated">
          <label v-show="inputs.lp_url.info" for="lp_url" class="hg-form_label">{{ inputs.lp_url.info }}</label>
          <button v-if="!lp_waiting_for_response" type="submit" class="hg-button">importuj</button>
          <div v-else class="hg-spinner"></div>
        </form>

        <form @submit.prevent="submitHg">
          <h2>Importuj z hikegear.pl</h2>
          <input v-model="inputs.hg_url.value" class="hg-input" :class="{marked: inputs.hg_url.marked}"
                 type="url" placeholder="link do listy z hikegear.pl" id="hg_url" :name="inputs.hg_url.name"
                 @blur="markAsBlurred" @input="markAsActivated">
          <label v-show="inputs.hg_url.info" for="hg_url" class="hg-form_label">{{ inputs.hg_url.info }}</label>
          <button v-if="!hg_waiting_for_response" type="submit" class="hg-button">importuj</button>
          <div v-else class="hg-spinner"></div>
        </form>

      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "@/components/Modal";
import {ref, reactive} from "vue";
import {useForm, useInputs} from "@/hooks";
import {apiFetch, hashids} from "@/functions";
import {useStore} from "vuex";

export default {
  name: "ImportBackpack",
  components: {Modal},
  setup() {
    const store = useStore()
    const modal_ref = ref(null) // template ref
    const openModal = () => modal_ref.value.openModal()

    const {Input, ValidityInfo} = useInputs()

    const isLpUrlValid = (url_value) => {
      const with_www = url_value.slice(0, 30) === 'https://www.lighterpack.com/r/' && url_value.length === 36
      const without_www = url_value.slice(0, 26) === 'https://lighterpack.com/r/' && url_value.length === 32
      return new ValidityInfo(with_www || without_www, with_www || without_www ? '' : 'link jest niepoprawny')
    }

    const isHgUrlValid = (url_value) => {
      const valid = url_value.slice(0, 30) === 'https://www.hikegear.pl/lista/' && url_value.length === 36
      return new ValidityInfo(valid, valid ? '' : 'link jest niepoprawny')
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
        })
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
        hg_waiting_for_response.value = true
        apiFetch('import_from_hg', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({backpack_id: hashids.decode(inputs.hg_url.value.slice(-6))})
        })
            .then(response => {
              lp_waiting_for_response.value = false
              if (response.ok) response.json().then(data => {
                store.dispatch('editor/addImportedBackpack', data)
                modal_ref.value.closeModal()
              })
              else if (response.status === 404) inputs.hg_url.response_info = 'podana lista sprzętu nie istnieje'
              else alert(response.status)
            })
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


.hg-input {
  width: 16rem;
  font-size: 1rem;
}

.hg-button {
  font-size: 1rem;
}

</style>


<!--<template>-->
<!--  <modal ref="modal" @close-modal="reset">-->
<!--    <template v-slot:header>importuj plecak z lighterpack.com</template>-->
<!--    <template v-slot:body>-->
<!--      <div class="outer_div">-->
<!--        <div class="inner_div">-->
<!--          <input v-model="url" class="hg-input" :class="{activated: activated, invalid: !url_validity}" maxlength="32"-->
<!--                 placeholder="link do plecaka" type="url" @input="activate"/>-->
<!--          <button v-show="!waiting_for_response" class="hg-button" type="submit" @click="submit">importuj</button>-->
<!--          <div v-if="waiting_for_response" class="hg-spinner"></div>-->
<!--          <p v-show="show_info">{{ info }}</p>-->
<!--        </div>-->
<!--      </div>-->
<!--    </template>-->
<!--  </modal>-->
<!--</template>-->

<!--<script>-->
<!--import Modal from "@/components/Modal";-->
<!--import {apiFetch} from "@/functions";-->

<!--export default {-->
<!--  name: "ImportBackpack",-->
<!--  components: {Modal},-->
<!--  data() {-->
<!--    return {-->
<!--      url: '',-->
<!--      activated: false,-->
<!--      show_info: false,-->
<!--      info: '',-->
<!--      waiting_for_response: false-->
<!--    }-->
<!--  },-->
<!--  computed: {-->
<!--    url_validity() {-->
<!--      return this.url.slice(0, 26) === 'https://lighterpack.com/r/'-->
<!--    },-->
<!--  },-->
<!--  methods: {-->
<!--    openModal() {-->
<!--      this.$refs.modal.openModal()-->
<!--    },-->
<!--    activate() {-->
<!--      if (this.url_validity) this.show_info = false-->
<!--      if (!this.activated) this.activated = true-->
<!--    },-->
<!--    reset() {-->
<!--      this.url = ''-->
<!--      this.activated = false-->
<!--      this.waiting_for_response = false-->
<!--      this.info = ""-->
<!--      this.show_info = false-->
<!--    },-->
<!--    submit() {-->
<!--      if (this.url_validity) {-->
<!--        this.waiting_for_response = true-->
<!--        this.show_info = false-->
<!--        apiFetch('import_from_lp', {-->
<!--          method: 'POST',-->
<!--          headers: {'Content-Type': 'application/json'},-->
<!--          body: JSON.stringify({-->
<!--            url: this.url-->
<!--          })-->
<!--        })-->
<!--            .then(response => {-->
<!--              if (response.ok) response.json().then(data => {-->
<!--                this.$store.dispatch('editor/addImportedBackpack', data)-->
<!--                this.$refs.modal.closeModal()-->
<!--                this.reset()-->
<!--              })-->
<!--              else {-->
<!--                response.json().then(data => {-->
<!--                  if (data['detail'] === 'Not found.') {-->
<!--                    this.info = 'podany plecak nie istnieje'-->
<!--                    this.show_info = true-->
<!--                  } else console.log(response)-->
<!--                })-->
<!--                this.waiting_for_response = false-->
<!--              }-->
<!--            })-->
<!--      } else {-->
<!--        this.info = 'podany link jest nieprawidłowy'-->
<!--        this.show_info = true-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--}-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--.outer_div {-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--}-->

<!--.inner_div {-->
<!--  display: flex;-->
<!--  flex-wrap: wrap;-->
<!--}-->

<!--.hg-input {-->
<!--  width: 16rem;-->
<!--  font-size: 1rem;-->
<!--}-->

<!--.url_input.activated.invalid {-->
<!--  border-color: red;-->
<!--}-->

<!--.hg-button {-->
<!--  font-size: 1rem;-->
<!--}-->

<!--</style>-->
