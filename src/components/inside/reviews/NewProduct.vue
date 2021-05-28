<template>
  <InsideBaseApp>
    <div class="hg-flx_col_ctr">
      <div class="new_product_wrapper">
        <h1>nowy produkt</h1>
        <form @submit.prevent>
          <div class="section">
            <label for="select_category">kategoria</label>
            <select id="select_category" class="hg-select" v-model="selected_category_id">
              <option disabled hidden selected value="">wybierz kategorię</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="section" v-if="subcategories">
            <label for="select_subcategory">podkategoria</label>
            <select id="select_subcategory" class="hg-select" v-model="selected_subcategory_id">
              <option disabled hidden selected value="">wybierz podkategorię</option>
              <option v-for="subcategory in subcategories"
                      :key="subcategory.id"
                      :value="subcategory.id">{{ subcategory.name }}
              </option>
            </select>
          </div>
          <div class="section">
            <label>producent</label>
            <SearchSelectDropdown :values="brands" placeholder="wyszukaj lub wybierz" @selected="setBrandId"/>
            <router-link class="hg-link" :to="{name: 'new_brand'}">
              <font-awesome-icon class="fa-md" icon="plus"/>
              dodaj producenta
            </router-link>
          </div>


        </form>
      </div>
    </div>
  </InsideBaseApp>
</template>

<script>
import InsideBaseApp from "../InsideBaseApp";
import SearchSelectDropdown from "../../SearchSelectDropdown";
// import {useStore} from "vuex";
// import {computed, ref} from "vue";
import {useFilters} from "../../../hooks";

export default {
  name: "NewProduct",
  components: {SearchSelectDropdown, InsideBaseApp},
  setup() {
    const {
      categories, brands, selected_category_id, selected_subcategory_id, selected_brand_id, subcategories,
      setBrandId
    } = useFilters()

    return {
      categories, brands, selected_category_id, selected_subcategory_id, selected_brand_id, subcategories,
      setBrandId
    }
  }
}
</script>

<style lang="scss" scoped>
.new_product_wrapper {
  width: 600px;
}
.hg-link {
  @include editor-add;
}
</style>