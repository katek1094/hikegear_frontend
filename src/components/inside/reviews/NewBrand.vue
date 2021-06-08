<template>
  <InsideBaseApp>
    <div class="hg-flx_col_ctr">
      <div class="hg-flx_col_ctr hg-wrapper">
        <h1 class="title">nowy producent</h1>
        <form @submit.prevent>
          <div class="section">
            <input type="text" v-model="name" class="hg-input" :class="{marked: invalid}" placeholder="nazwa">
          </div>
          <p class="info" v-if="invalid">podany producent jest już dodany</p>
          <div class="hg-spinner" v-if="waiting_for_response"></div>
          <p class="info" v-else-if="success">dodano producenta <b>{{ name }}</b></p>
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
    const invalid = ref(false)

    const submit = () => {
      if (name.value !== '') {
        waiting_for_response.value = true
        apiFetch('brands', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({name: name.value})
        }, [400])
            .then(response => {
              invalid.value = false
              waiting_for_response.value = false
              if (response.ok) {
                success.value = true
                setTimeout(() => router.push({name: 'reviews'}), 2500)
              } else if (response.status === 400) invalid.value = true
            })
      }
    }

    return {name, waiting_for_response, success, invalid, submit}
  }
}
</script>

<style lang="scss" scoped>
.info, .title {
  margin: 11px;
}
</style>
