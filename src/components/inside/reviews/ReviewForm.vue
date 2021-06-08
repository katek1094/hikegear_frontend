<template>
  <InsideBaseApp>
    <div class="hg-flx_col_ctr">
      <div v-if="!product.name" class="hg-spinner"></div>
      <div v-else class="new_review hg-wrapper">
        <div>
          <div class="header">
            <h2 class="title">{{ title }}</h2>
            <h3>{{ product.full_name }}</h3>
          </div>
          <form class="hg-flx_col_ctr" @submit.prevent>
            <div class="section">
              <AutoResizable ref="summary_input" v-model="summary" :maxlength="summary_limit"
                             class="hg-input summary" placeholder="podsumowanie"/>
              <label class="info">krótkie (max {{ summary_limit }} znaków) podsumowanie recenzji - pole wymagane</label>
            </div>
            <div class="section">
              <AutoResizable ref="text_input" v-model="text" :maxlength="text_limit" class="hg-input text"
                             placeholder="recenzja"/>
              <label class="info">tekst recenzji (max {{ text_limit }} znaków) - pole wymagane</label>
            </div>
            <div class="section">
              <input v-model="weight_net" :max="weight_limit" class="hg-input weight" inputmode="decimal"
                     placeholder="waga" min="0" type="number" @keydown="charControl">
              <label class="info">waga bez pokrowca (w gramach) - pole opcjonalne</label>
            </div>
            <div class="section">
              <input v-model="weight_gross" :max="weight_limit" class="hg-input weight" inputmode="decimal"
                     placeholder="waga" min="0" type="number" @keydown="charControl">
              <label class="info">waga z pokrowcem (w gramach) - pole opcjonalne</label>
            </div>
            <div v-if="waiting_for_response" class="hg-spinner"></div>
            <button v-else class="hg-button" type="button" @click="submit">zatwierdź</button>
          </form>
        </div>
      </div>
    </div>
  </InsideBaseApp>
</template>

<script>
import InsideBaseApp from "../InsideBaseApp";
import {ref, toRef, watch} from "vue";
import {apiFetch} from "../../../functions";
import AutoResizable from "../../AutoResizable";
import constants from "../../../constants";
import {useRouter} from "vue-router";
import {useAutoresizeAll} from "../../../hooks";

export default {
  name: "ReviewForm",
  components: {AutoResizable, InsideBaseApp},
  props: {
    product: {type: Object, required: true},
    method: {
      type: String, required: true, validator(value) {
        return ['POST', "PATCH"].includes(value)
      }
    },
    review: Object,
  },
  setup(props) {
    const router = useRouter()
    const summary_limit = constants.REVIEW_SUMMARY_MAX_LEN
    const text_limit = constants.REVIEW_TEXT_MAX_LEN
    const weight_limit = constants.ITEM_MAX_WEIGHT
    const waiting_for_response = ref(false)
    const summary = ref('')
    const text = ref('')
    const weight_net = ref('')
    const weight_gross = ref('')
    const summary_input = ref('')
    const text_input = ref('')
    const review = toRef(props, 'review')

    watch(review, () => {
      summary.value = review.value['summary']
      text.value = review.value['text']
      weight_net.value = review.value['weight_net']
      weight_gross.value = review.value['weight_gross']
    })

    let title
    if (props.method === "PATCH") title = 'edycja recenzji'
    else if (props.method === 'POST') title = 'nowa recenzja'

    const submit = () => {
      if (summary.value && text.value) {
        waiting_for_response.value = true
        let body = {product: props.product.id, summary: summary.value, text: text.value}
        if (weight_net.value) body.weight_net = weight_net.value
        if (weight_gross.value) body.weight_gross = weight_gross.value
        let url = 'reviews'
        if (props.method === 'PATCH') url = url + '/' + review.value['id']
        apiFetch(url, {
          method: props.method,
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(body)
        })
            .then(response => {
              if (response.ok) router.push({name: 'product_page', params: {id: props.product.id}})
            })
      }
    }

    const resizeAll = () => {
      summary_input.value.resize()
      text_input.value.resize()
    }

    useAutoresizeAll(resizeAll)
    const charControl = (e) => {
      const allowed_codes = [8, 9, 13, 46, 37, 38, 39, 40, // backspace, tab, enter, delete, arrows
        17, 67, 86, 88, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105,    // ctrl, c, v, x,  numeric tab
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57] // 0-9 numbers
      if (!allowed_codes.includes(e.keyCode)) e.preventDefault()
    }

    return {
      summary_limit, text_limit, weight_limit, summary, text, weight_net, weight_gross,
      waiting_for_response, summary_input, text_input, title,
      submit, charControl
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  margin-left: 9px;

  & .title {
    text-align: center;
    margin-bottom: 50px;
  }
}

.section {
  width: 100%;
  margin-bottom: 20px;
}

.info {
  margin-left: 9px;
  font-size: .9rem;
  display: block;
}

.hg-input {
  width: 90%;
  font-size: 1.1rem;
  padding: 6px;

  &.weight {
    max-width: 6rem;
  }
}

</style>
