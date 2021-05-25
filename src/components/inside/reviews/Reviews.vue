<template>
  <InsideBaseApp>
    <div class="reviews hg-flx_col_ctr">
      <form class="form hg-flx_col_ctr" @submit.prevent>
        <input class="hg-input search_product" type="text" placeholder="wyszukaj produkt"
               v-model="search_product_query" @keydown.enter="submit">
        <div class="filters">
          <span><b>filtry</b></span>
          <div class="field">
            <label for="select_category">kategoria</label>
            <select id="select_category" class="hg-select" v-model="selected_category_id">
              <option disabled hidden selected value="">wybierz kategorię</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <button v-show="selected_category_id" class="reset_button" @click="resetCategoryFilter">
              <font-awesome-icon class="fa-lg" icon="times"/>
            </button>
          </div>
          <div class="field" v-if="selected_category_id != null">
            <label for="select_subcategory">podkategoria</label>
            <select id="select_subcategory" class="hg-select" v-model="selected_subcategory_id">
              <option disabled hidden selected value="">wybierz podkategorię</option>
              <option v-for="subcategory in subcategories"
                      :key="subcategory.id"
                      :value="subcategory.id">{{ subcategory.name }}
              </option>
            </select>
            <button v-show="selected_subcategory_id" class="reset_button" @click="resetSubcategoryFilter">
              <font-awesome-icon class="fa-lg" icon="times"/>
            </button>
          </div>
          <div class="field">
            <label>producent</label>
            <SearchSelectDropdown :values="brands" placeholder="wyszukaj lub wybierz" @selected="setBrandId"
                                  ref="brand_select" class="brand_select"/>
            <button v-show="selected_brand_id" class="reset_button" @click="resetBrandFilter">
              <font-awesome-icon class="fa-lg" icon="times"/>
            </button>
          </div>
        </div>
        <div class="hg-spinner" v-if="waiting_for_response"></div>
        <button class="hg-button" v-else @click="submit">szukaj</button>
      </form>
      <div v-if="no_matching_results">
        <p>brak wyników</p>
      </div>
      <div v-if="search_results">
        <div v-for="result in search_results" :key="result.id">
          <p>{{ result.name }}</p>
        </div>
      </div>
    </div>
  </InsideBaseApp>
</template>

<script>
import InsideBaseApp from "../InsideBaseApp";
import {ref, watch, computed} from 'vue'
import {useStore} from 'vuex'
import {apiFetch} from "@/functions";
import SearchSelectDropdown from "../../SearchSelectDropdown";

export default {
  name: "Reviews",
  components: {SearchSelectDropdown, InsideBaseApp},
  setup() {
    const store = useStore()
    const categories = computed(() => store.getters['reviews/categories'])
    const brands = computed(() => store.getters['reviews/brands'])

    const selected_category_id = ref(null)
    const selected_subcategory_id = ref(null)
    const selected_brand_id = ref(null)
    const search_product_query = ref('') // value of text input
    const brand_select = ref('null') //template ref
    const search_results = ref(null)
    const waiting_for_response = ref(false)
    const form_submitted = ref(false) // to know, when to show array of results, or "no matching results" info

    const subcategories = computed(() => {
      return categories.value.find((el) => el.id === selected_category_id.value).subcategories
    })

    watch(selected_category_id, () => selected_subcategory_id.value = null)

    const resetCategoryFilter = () => selected_category_id.value = null
    const resetSubcategoryFilter = () => selected_subcategory_id.value = null
    const resetBrandFilter = () => {
      selected_brand_id.value = null
      brand_select.value.reset()
    }
    const no_matching_results = computed(() => form_submitted.value && search_results.value.length === 0)

    const setBrandId = (payload) => selected_brand_id.value = payload.id

    const submit = () => {
      if (search_product_query.value !== '') {
        waiting_for_response.value = true
        let params = {query: search_product_query.value}
        if (selected_subcategory_id.value !== null) params.subcategory_id = selected_subcategory_id.value
        else if (selected_category_id.value !== null) params.category_id = selected_category_id.value
        if (selected_brand_id.value !== null) params.brand_id = selected_brand_id.value
        apiFetch('search_for_product?' + new URLSearchParams(params), {
          method: 'GET'
        })
            .then(response => {
              if (response.ok) {
                response.json().then(data => {
                  form_submitted.value = true
                  waiting_for_response.value = false
                  search_results.value = data
                })
              } else console.log(response)
            })
      }
    }

    return {
      categories, subcategories, search_product_query, brand_select, brands, selected_category_id,
      selected_subcategory_id, selected_brand_id, search_results, waiting_for_response, form_submitted,
      no_matching_results,
      resetCategoryFilter, resetSubcategoryFilter, resetBrandFilter, setBrandId, submit
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  padding: 2px;
}

.filters {
  margin: 4px;
  width: 100%;
  padding: 4px;
  box-sizing: border-box;
}

.search_product {
  width: 24rem;
}

.hg-select {
  margin: 4px;
  border: none;
  padding: 4px;
  width: 100%;
}

.field {
  display: grid;
  grid-template-columns: 7rem 14rem auto;
  align-items: center;
  justify-content: flex-start;
  grid-gap: 2px;
}

.brand_select {
  width: 100%;
}

.reset_button {
  background-color: transparent;
  border: none;
  color: red;
  font-size: 1rem;
  margin-left: 8px;

  &:hover {
    cursor: pointer;
  }
}
</style>