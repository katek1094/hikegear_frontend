<template>
  <InsideBaseApp>
    <div class="hg-flx_col_ctr">
      <div class="hg-wrapper">
        <div v-if="waiting_for_data" class="hg-spinner"></div>
        <div v-if="product">
          <h1>{{ product.full_name }}</h1>
          <div v-if="product.url && !display_url_form" class="url_options">
            <a class="hg-link url"  :href="product.url">
              <font-awesome-icon class="fa-md" icon="external-link-alt"/>
              link do produktu na stronie producenta</a>
            <button class="edit_url" @click="addUrl">
              <font-awesome-icon class="fa-md" icon="edit"/>
              edytuj link
            </button>
          </div>
          <button v-else-if="!product.url && !display_url_form" class="add_url" @click="addUrl">
            <font-awesome-icon class="fa-md" icon="link"/>
            dodaj link
          </button>
          <form v-else-if="display_url_form" @submit.prevent>
            <input v-model="product_url" class="hg-input" type="url"
                   placeholder="link do produktu na stronie producenta">
            <div v-if="waiting_for_response" class="hg-spinner"></div>
            <button v-else class="hg-button" type="submit" @click="submitUrlForm">zatwierdź</button>
          </form>
          <router-link v-if="can_add_review" class="hg-link add" :to="{name: 'new_review', params: {id: product.id}}">
            <font-awesome-icon class="fa-md" icon="comment"/>
            dodaj recenzję
          </router-link>
          <div v-if="product.reviews_amount" class="reviews">
            <!--            <p>recenzje</p>-->
            <div class="review" v-for="review in product.reviews" :key="review.id">
              <p><b>{{ review.summary }}</b></p>
              <p>{{ review.text }}</p>
              <p v-if="review.weight_net">waga bez pokrowca: {{ review.weight_net }}g</p>
              <p v-if="review.weight_gross">waga z pokrowcem: {{ review.weight_gross }}g</p>
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
    const waiting_for_data = ref(true)
    const user_id = store.getters['auth/user_id']
    const display_url_form = ref(false)
    const product_url = ref('')
    const waiting_for_response = ref(false)

    const can_add_review = computed(() => {
      if (product.value) {
        return !product.value.reviews.find((el) => el.author === user_id)
      } else return false
    })

    const addUrl = () => display_url_form.value = true
    const submitUrlForm = () => {
      if (product_url.value !== '') {
        waiting_for_response.value = true
        apiFetch('products/' + props.id, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({url: product_url.value})
        })
        .then(response => {
          if (response.ok) {
            waiting_for_response.value = false
            product.value.url = product_url.value
            display_url_form.value = false
          }
        })
      }
    }

    apiFetch('products/' + props.id, {
      method: 'GET'
    })
        .then(response => {
          if (response.ok) {
            response.json().then(data => {
              product.value = data
              waiting_for_data.value = false
              product_url.value = data.url
          })
          } else console.log(response)
        })

    return {product, waiting_for_data, waiting_for_response, product_url, can_add_review, display_url_form, addUrl, submitUrlForm}
  }
}
</script>

<style lang="scss" scoped>
.hg-input {
  min-width: 290px;
  width: 80%;
  max-width: 400px;
}

.add_url {
  @include editor-add;
  font-size: 1rem;
  padding: 0;
  margin: 0 10px;
}

.edit_url {
  @include editor-add;
  margin: 0 10px;
}
.url_options {
  display: flex;
}

.hg-link.url {
  display: block;
}

.hg-link.add {
  display: block;
  @include editor-add;
  font-size: 1rem;
  margin: 30px 10px;
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