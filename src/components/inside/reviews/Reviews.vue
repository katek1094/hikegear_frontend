<template>
  <InsideBaseApp>
    <div class="reviews hg-flx_col_ctr">
      <div>
        <input class="hg-input search_product" type="text" placeholder="wyszukaj produkt"
               v-model="search_product_query">
        <div class="filters">
          <span><b>filtry</b></span>
          <div class="field">
            <label for="select_category">wybierz kategorię</label>
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
            <label for="select_subcategory">wybierz podkategorię</label>
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
            <label>wybierz producenta</label>
            <SearchSelectDropdown :values="brands" placeholder="wybierz producenta" @selected="setBrandId"
                                  ref="brand_select" class="brand_select"/>
            <button v-show="selected_brand_id" class="reset_button" @click="resetBrandFilter">
              <font-awesome-icon class="fa-lg" icon="times"/>
            </button>
          </div>
        </div>

        <button class="hg-button" @click="submitSearch">szukaj</button>

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
    const search_product_query = ref('')
    const brand_select = ref('null') //template ref

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

    const setBrandId = (payload) => selected_brand_id.value = payload.id

    const submitSearch = () => {
      apiFetch('search_for_product?' + new URLSearchParams({
        query: search_product_query.value
      }), {
        method: 'GET'
      })
          .then(response => {
            if (response.ok) {
              response.json().then(data => {
                console.log(data)
              })
            } else console.log(response)
          })
    }

    return {
      categories,
      subcategories,
      search_product_query,
      brand_select,
      brands,
      selected_category_id,
      selected_subcategory_id,
      selected_brand_id,
      resetCategoryFilter,
      resetSubcategoryFilter,
      resetBrandFilter,
      submitSearch,
      setBrandId
    }
  }
}
</script>

<style lang="scss" scoped>
.search_product {
  width: 30rem;
}

.hg-select {
  margin: 4px;
}

.field {
  display: flex;
  align-items: center;
}

.brand_select {
  width: 200px;
}

.reset_button {
  background-color: transparent;
  border: none;
  color: red;
  font-size: 1.1rem;

  &:hover {
    cursor: pointer;
    transform: scale(1.06);
  }

  &:active {
    transform: scale(1);
  }
}
</style>