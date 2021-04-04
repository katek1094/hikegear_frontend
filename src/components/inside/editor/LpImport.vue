<template>
  <modal ref="modal" @close-modal="reset">
    <template v-slot:header>importuj plecak z lighterpack.com</template>
    <template v-slot:body>
      <div class="outer_div">
        <div class="inner_div">
          <input v-model="url" class="url_input" :class="{activated: activated, invalid: !url_validity}" maxlength="32"
                 placeholder="link do plecaka" type="url" @input="activate"/>
          <button v-show="!waiting_for_response" class="url_submit" type="submit" @click="submit">importuj</button>
          <div v-if="waiting_for_response" class="hg-spinner"></div>
          <p v-show="show_info">{{ info }}</p>
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "@/components/Modal";
import {apiFetch} from "@/functions";

export default {
  name: "LpImport",
  components: {Modal},
  data() {
    return {
      url: '',
      activated: false,
      show_info: false,
      info: '',
      waiting_for_response: false
    }
  },
  computed: {
    url_validity() {
      return this.url.slice(0, 26) === 'https://lighterpack.com/r/'
    },
  },
  methods: {
    openModal() {
      this.$refs.modal.openModal()
    },
    activate() {
      if (this.url_validity) this.show_info = false
      if (!this.activated) this.activated = true
    },
    reset() {
      this.url = ''
      this.activated = false
      this.waiting_for_response = false
      this.info = ""
      this.show_info = false
    },
    submit() {
      if (this.url_validity) {
        this.waiting_for_response = true
        this.show_info = false
        apiFetch('import_from_lp', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            url: this.url
          })
        })
            .then(response => {
              if (response.ok) response.json().then(data => {
                this.$store.dispatch('editor/addImportedBackpack', data)
                this.$refs.modal.closeModal()
                this.reset()
              })
              else {
                response.json().then(data => {
                  if (data['detail'] === 'Not found.') {
                    this.info = 'podany plecak nie istnieje'
                    this.show_info = true
                  } else console.log(response)
                })
                this.waiting_for_response = false
              }
            })
      } else {
        this.info = 'podany link jest nieprawidłowy'
        this.show_info = true
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.header {
  margin: 10px 0;
}

.outer_div {
  display: flex;
  justify-content: center;
}

.inner_div {
  display: flex;
  flex-wrap: wrap;
}

.url_input {
  @include form-input;
  width: 16rem;
  font-size: 1rem;
}

.url_input.activated.invalid {
  border-color: red;
}

.url_submit {
  @include form-submit;
  font-size: 1rem;
}

</style>
