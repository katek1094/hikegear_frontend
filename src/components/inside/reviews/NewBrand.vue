<template>
  <InsideBaseApp>
    <div class="hg-flx_col_ctr">
      <div class="new_brand hg-wrapper">
        <h1 class="title">nowy producent</h1>
        <form @submit.prevent>
          <div class="section">
            <input type="text" v-model="name" class="hg-input" placeholder="nazwa">
          </div>
          <div class="hg-spinner" v-if="waiting_for_response"></div>
          <p v-else-if="success">dodano producenta {{ name }}</p>
          <button v-else class="hg-button" type="submit" @click="submit">dodaj</button>
        </form>
      </div>
    </div>
  </InsideBaseApp>
</template>

<script>
import InsideBaseApp from "../InsideBaseApp";
import {ref} from 'vue'
import {apiFetch} from "../../../functions";
import {useRouter} from "vue-router";

export default {
  name: "NewBrand",
  components: {InsideBaseApp},
  setup() {
    const router = useRouter()
    const name = ref('')
    const waiting_for_response = ref(false)
    const success = ref(false)

    const submit = () => {
      if (name.value !== '') {
        waiting_for_response.value = true
        apiFetch('brands', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({name: name.value})
        })
            .then(response => {
              if (response.ok) {
                waiting_for_response.value = false
                success.value = true
                setTimeout(() => router.push({name: 'reviews'}), 1500)
              } else console.log(response)
            })
      }
    }

    return {name, waiting_for_response, success, submit}
  }
}
</script>

<style lang="scss" scoped>
.info, .title {
  margin: 11px;
}
</style>
