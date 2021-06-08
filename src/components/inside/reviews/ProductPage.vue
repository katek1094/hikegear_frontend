<template>
  <InsideBaseApp>
    <div class="hg-flx_col_ctr">
      <div class="hg-wrapper">
        <div v-if="waiting_for_response" class="hg-spinner"></div>
        <div v-if="product">
          <h1>{{ product.full_name }}</h1>
          <p v-if="product.link">link do produktu: {{ product.link }}</p>
          <!--          <p v-else>dodaj link do produktu</p>-->
          <router-link v-if="can_add_review" class="hg-link" :to="{name: 'new_review', params: {id: product.id}}">
            <font-awesome-icon class="fa-md" icon="comment"/>
            dodaj recenzję
          </router-link>
          <div v-if="product.reviews_amount" class="reviews">
            <!--            <p>recenzje</p>-->
            <div class="review" v-for="review in product.reviews" :key="review.id">
              <p><b>{{ review.summary }}</b></p>
              <p>{{ review.text }}</p>
            </div>
          </div>
          <div v-else>
            <p>brak recenzji</p>
          </div>
        </div>
      </div>
    </div>
  </InsideBaseApp>
</template>

<script>
import InsideBaseApp from "../InsideBaseApp";
import {apiFetch} from "../../../functions";
import {ref, computed} from 'vue'
import {useStore} from 'vuex'

export default {
  name: "ProductPage",
  components: {InsideBaseApp},
  props: {id: String},
  setup(props) {
    const store = useStore()
    const product = ref(null)
    const waiting_for_response = ref(true)
    const user_id = store.getters['auth/user_id']

    const can_add_review = computed(() => {
      if (product.value) {
        return !product.value.reviews.find((el) => el.author === user_id)
      } else return false
    })

    apiFetch('products/' + props.id, {
      method: 'GET'
    })
        .then(response => {
          if (response.ok) {
            response.json().then(data => product.value = data)
            waiting_for_response.value = false
          } else console.log(response)
        })

    return {product, waiting_for_response, can_add_review}
  }
}
</script>

<style lang="scss" scoped>
.hg-link {
  @include editor-add;
  font-size: 1rem;
}

.reviews {
  margin-top: 30px;
}

.review {
  //border: 1px solid black;
  border-radius: 8px;
  background-color: $grey3;
  padding: 8px;
  margin-top: 20px;
}
</style>