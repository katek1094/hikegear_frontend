<template>
  <InsideBaseApp>
    <div class="reviews hg-flx_col_ctr">
      <div>
        <input class="hg-input" type="text" placeholder="wyszukaj produkt" v-model="search_input_value">
        <p><b>filtry</b></p>
        <div>
          <label for="select_category">wybierz kategorię</label>
          <select id="select_category" class="hg-select" v-model="selected_category_id">
            <option disabled hidden selected value="">wybierz kategorię</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
          </select>
          <button v-show="selected_category_id" class="reset_button" @click="resetCategoryFilter">
            <font-awesome-icon class="fa-lg" icon="times"/>
          </button>
        </div>
        <div v-if="selected_category_id != null">
          <label for="select_subcategory">wybierz podkategorię</label>
          <select id="select_subcategory" class="hg-select" v-model="selected_subcategory_id">
            <option disabled hidden selected value="">wybierz podkategorię</option>
            <option v-for="subcategory in subcategories"
                    :key="subcategory.id"
                    :value="subcategory.id">{{ subcategory.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="select_brand">wybierz producenta</label>
          <select id="select_brand" class="hg-select" v-model="selected_brand_id">
            <option disabled hidden selected value="">wybierz producenta</option>
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
          </select>
          <button v-show="selected_brand_id" class="reset_button" @click="resetBrandFilter">
            <font-awesome-icon class="fa-lg" icon="times"/>
          </button>
        </div>
        <button class="hg-button">szukaj</button>


      </div>
    </div>
  </InsideBaseApp>
</template>

<script>
import InsideBaseApp from "../InsideBaseApp";
import {ref, watch, computed} from 'vue'
import {useStore} from 'vuex'

export default {
  name: "Reviews",
  components: {InsideBaseApp},
  setup() {
    const store = useStore()
    const categories = computed(() => store.getters['reviews/categories'])
    const brands = computed(() => store.getters['reviews/brands'])

    const selected_category_id = ref(null)
    const selected_subcategory_id = ref(null)
    const selected_brand_id = ref(null)
    const search_input_value = ref('')

    const subcategories = computed(() => {
      return categories.value.find((el) => el.id === selected_category_id.value).subcategories
    })

    watch(selected_category_id, () => selected_subcategory_id.value = null)

    const resetCategoryFilter = () => selected_category_id.value = null
    const resetBrandFilter = () => selected_brand_id.value = null

    return {
      categories, subcategories, search_input_value, brands, selected_category_id, selected_subcategory_id,
      selected_brand_id, resetCategoryFilter, resetBrandFilter
    }
  }
}
</script>

<style lang="scss" scoped>
.hg-select {
  margin: 4px;
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