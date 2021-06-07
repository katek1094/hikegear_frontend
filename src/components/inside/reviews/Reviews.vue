<template>
  <InsideBaseApp>
    <div class="hg-flx_col_ctr">
      <div class="reviews hg-wrapper">
        <div class="add_options">
          <router-link class="hg-link" :to="{name: 'new_product'}">
            <font-awesome-icon class="fa-md" icon="plus"/>
            dodaj produkt
          </router-link>
          <router-link class="hg-link" :to="{name: 'new_brand'}">
            <font-awesome-icon class="fa-md" icon="plus"/>
            dodaj producenta
          </router-link>
        </div>
        <form class="form hg-flx_col_ctr" @submit.prevent>
          <input class="hg-input" type="text" placeholder="wpisz nazwę produktu (model)"
                 v-model="search_product_query" @keydown.enter="submit" autofocus ref="query_input">
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
            <div class="field" v-if="subcategories">
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
          <button class="hg-button" v-else @click="submit" type="button">szukaj</button>
        </form>
        <div v-if="no_matching_results">
          <p>brak wyników</p>
        </div>
        <div v-if="search_results" class="search_results">
          <SearchProductResult v-for="result in search_results" :key="result.id" :result="result"/>
        </div>
      </div>
    </div>
  </InsideBaseApp>
</template>

<script>
import InsideBaseApp from "../InsideBaseApp";
import {ref, watch, computed, onMounted} from 'vue'
import {apiFetch} from "@/functions";
import SearchSelectDropdown from "../../SearchSelectDropdown";
import SearchProductResult from "./SearchProductResult";
import {useRoute, useRouter} from 'vue-router'
import {useFilters} from "../../../hooks";

export default {
  name: "Reviews",
  components: {SearchProductResult, SearchSelectDropdown, InsideBaseApp},
  setup() {
    const route = useRoute()
    const router = useRouter()

    const search_product_query = ref('') // value of text input
    const brand_select = ref('null') //template ref
    const query_input = ref('null') //template ref
    const search_results = ref(null)
    const waiting_for_response = ref(false)
    const form_submitted = ref(false) // to know, when to show array of results, or "no matching results" info


    const {
      categories, brands, selected_category_id, selected_subcategory_id, selected_brand_id, subcategories,
      setBrandId
    } = useFilters()

    watch(selected_category_id, () => selected_subcategory_id.value = null)

    const resetCategoryFilter = () => selected_category_id.value = null
    const resetSubcategoryFilter = () => selected_subcategory_id.value = null
    const resetBrandFilter = () => {
      selected_brand_id.value = null
      brand_select.value.reset()
    }
    const no_matching_results = computed(() => form_submitted.value && search_results.value.length === 0)

    const search = () => {
      waiting_for_response.value = true
      apiFetch('search_for_product?' + new URLSearchParams(route.query), {
        method: 'GET'
      })
          .then(response => {
            if (response.ok) {
              response.json().then(data => {
                form_submitted.value = true
                waiting_for_response.value = false
                search_results.value = data
              })
            }
          })
    }

    onMounted(() => {
      if (route.query.query) {
        search()
        search_product_query.value = route.query.query
        if (route.query.category_id) selected_category_id.value = Number(route.query.category_id)
        if (route.query.subcategory_id) selected_subcategory_id.value = Number(route.query.subcategory_id)
        if (route.query.brand_id) {
          selected_brand_id.value = Number(route.query.brand_id)
          brand_select.value.setValue(brands.value.find((el) => el.id === Number(route.query.brand_id)).name)
        }
        query_input.value.focus()
      }
    })

    const submit = () => {
      if (search_product_query.value !== '') {
        let params = {query: search_product_query.value}
        if (selected_subcategory_id.value !== null) {
          params.subcategory_id = selected_subcategory_id.value
          params.category_id = selected_category_id.value
        } else if (selected_category_id.value !== null) params.category_id = selected_category_id.value
        if (selected_brand_id.value !== null) params.brand_id = selected_brand_id.value
        router.push({name: 'reviews', query: params})
      } else router.push({name: 'reviews'})
    }


    return {
      categories, subcategories, search_product_query, brand_select, query_input, brands, selected_category_id,
      selected_subcategory_id, selected_brand_id, search_results, waiting_for_response, form_submitted,
      no_matching_results,
      resetCategoryFilter, resetSubcategoryFilter, resetBrandFilter, setBrandId, submit
    }
  }
}
</script>

<style lang="scss" scoped>

.add_options {
  display: flex;
  justify-content: space-evenly;
  margin: 8px;

  & .hg-link {
    @include editor-add;
    font-size: 1.1rem;
  }
}

.form {
  padding: 2px;
}

.hg-input {
  width: 17rem;
}

.filters {
  margin: 4px;
  padding: 4px;
  box-sizing: border-box;
}

.field {
  display: grid;
  grid-template-columns: 1fr auto 3rem;
  align-items: center;
  grid-gap: 3px;
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