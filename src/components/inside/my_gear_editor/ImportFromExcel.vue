<template>
  <modal ref="modal_ref" :hide_on_outside_click="false">
    <template v-slot:header>importuj sprzęt z pliku excel</template>
    <template v-slot:body>
      <div class="hg-flx_col_ctr">
        <form @submit.prevent="submitForm" class="import_form">
          <input type="file" name="excel" accept=".xlsx">
          <button type="submit" class="hg-button">importuj</button>
        </form>
        <span class="info">{{ info }}</span>
        <br>
        <div class="instruction">
          <span>Aby importować sprzęt z pliku arkusza kalkulacyjnego:</span>
          <span><b>1. plik musi mieć rozszerzenie .xlsx</b></span>
          <span>2. dane muszą być w aktywnym arkuszu (najlepiej jedynym)</span>
          <span>3. dane muszą znajdować się w 3 kolumnach A, B, C zgodnie poniższym przykładem - nazwa, opis i waga</span>
          <img class="image" src="@/assets/excel1.png">
          <span>
        4. Jeżeli chcesz zaimportować dane już podzielone na kategorie, dodaj pomiędzy przedmioty dodatkowe wiersze
        według poniższego przykładu - w kolumnie A wpisz 'kategoria', w B - nazwę kategorii, C - pozostaw pustą
        </span>
          <img class="image" src="@/assets/excel2.png">
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "@/components/Modal";
import {ref} from 'vue'
import {apiFetch} from "../../../functions";
import {useStore} from "vuex";

export default {
  name: "ImportFromExcel",
  components: {Modal},
  setup() {
    const store = useStore()
    const modal_ref = ref(null) // template ref
    const info = ref('')

    const openModal = () => modal_ref.value.openModal()

    const submitForm = (e) => {
      if (e.target.excel.files.length) {
        const name = e.target.excel.files[0].name.split('.')
        const ext = name[name.length - 1]
        if (ext === 'xlsx') {
          const fd = new FormData()
          fd.append('excel', e.target.excel.files[0])
          apiFetch('import_from_excel', {
            method: 'POST',
            body: fd
          }, [400])
              .then(response => {
                if (response.ok) {
                  console.log('success')
                  response.json().then(data => {
                    store.dispatch('my_gear/setMyGear', data['private_gear'])
                    modal_ref.value.closeModal()
                  })
                } else if (response.status === 400) {
                  info.value = 'plik jest niepoprawny'
                }
              })
        } else info.value = 'plik musi być w formacie .xlsx'
      }
    }

    return {modal_ref, info, openModal, submitForm}
  }
}
</script>

<style lang="scss" scoped>
.instruction {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.image {
  margin: 10px 0;
  max-width: 100%;
}

.info {
  color: red;
}
</style>