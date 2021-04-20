<template>
  <modal ref="modal_ref" @close-modal="reset" :hide_on_outside_click="false">
    <template v-slot:header>importuj sprzęt z pliku excel</template>
    <template v-slot:body>
      <form @submit.prevent="submitForm" class="import_form">
        <input type="file" name="excel" accept=".xlsx">
        <button type="submit" class="hg-button">zatwierdź</button>
      </form>
    </template>
  </modal>
</template>

<script>
import Modal from "@/components/Modal";
import {ref} from 'vue'
import {apiFetch} from "../../../functions";

export default {
  name: "ImportFromExcel",
  components: {Modal},
  setup() {
    const modal_ref = ref(null) // template ref

    const openModal = () => modal_ref.value.openModal()

    const reset = () => {
      //
    }

    const submitForm = (e) => {
      if (e.target.excel.files.length) {
        const fd = new FormData()
        fd.append('excel', e.target.excel.files[0])
        apiFetch('import_from_excel', {
          method: 'POST',
          body: fd
        })
        .then(response => {
          if (response.ok) {
            console.log('success')
          } else console.log(response)
        })
      }
    }

    return {modal_ref, openModal, reset, submitForm}
  }
}
</script>

<style scoped>

</style>