<template>
  <InsideBaseApp>
    <div class="hg-flx_col_ctr">
      <div class="new_product hg-wrapper">
        <h1 class="title">nowy produkt</h1>
        <form @submit.prevent="submit">
          <div class="section">
            <input v-model="product_name" class="hg-input" type="text" placeholder="nazwa (model)"
                   :maxlength="name_max_len">
          </div>
          <div class="section">
            <input v-model="product_url" class="hg-input" type="url"
                   placeholder="link do produktu na stronie producenta">
          </div>
          <div class="section grid">
            <label class="info" for="select_category">kategoria</label>
            <select id="select_category" class="hg-select" v-model="selected_category_id">
              <option disabled hidden selected value="">wybierz kategorię</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="section grid" v-if="subcategories">
            <label class="info" for="select_subcategory">podkategoria</label>
            <select id="select_subcategory" class="hg-select" v-model="selected_subcategory_id">
              <option disabled hidden selected value="">wybierz podkategorię</option>
              <option v-for="subcategory in subcategories"
                      :key="subcategory.id"
                      :value="subcategory.id">{{ subcategory.name }}
              </option>
            </select>
          </div>
          <div class="section grid">
            <label class="info">producent</label>
            <SearchSelectDropdown :values="brands" placeholder="wyszukaj lub wybierz" @selected="setBrandId"/>
          </div>
          <div class="hg-flx_col_ctr">
            <p v-if="invalid" class="invalid_info">podany produkt już istnieje </p>
            <div v-if="waiting_for_response" class="hg-spinner"></div>
            <button v-else class="hg-button" type="submit">zatwierdź</button>
          </div>
        </form>
      </div>
    </div>
  </InsideBaseApp>
</template>

<script>
import InsideBaseApp from "../InsideBaseApp";
import SearchSelectDropdown from "../../SearchSelectDropdown";
import {ref, computed} from "vue";
import {useFilters} from "../../../hooks";
import {apiFetch} from "../../../functions";
import {useRouter} from "vue-router";
import constants from "../../../constants";

export default {
  name: "NewProduct",
  components: {SearchSelectDropdown, InsideBaseApp},
  setup() {
    const router = useRouter()
    const name_max_len = constants.PRODUCT_NAME_MAX_LEN
    const product_name = ref("")
    const product_url = ref("")
    const waiting_for_response = ref(false)
    const invalid = ref(false)
    const {
      categories, brands, selected_category_id, selected_subcategory_id, selected_brand_id, subcategories,
      setBrandId
    } = useFilters()

    const is_form_valid = computed(() => {
      if (product_name.value !== "" && selected_brand_id.value !== null && selected_category_id.value !== null) {
        const sub = categories.value.find((el) => el.id === selected_category_id.value).subcategories
        if (sub.length === 1) return true
        else return selected_subcategory_id.value !== null
      } else return false
    })

    const submit = () => {
      if (is_form_valid.value) {
        let subcategory_id
        if (selected_subcategory_id.value === null) { // if category has only one subcategory
          subcategory_id = categories.value.find((el) => el.id === selected_category_id.value).subcategories[0].id
        } else subcategory_id = selected_subcategory_id.value
        let body = {
          name: product_name.value, url: product_url.value,
          subcategory: subcategory_id, brand: selected_brand_id.value
        }
        waiting_for_response.value = true
        apiFetch('products', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(body)
        }, [400])
            .then(response => {
              waiting_for_response.value = false
              if (response.ok) {
                console.log('ok')
                response.json().then(data => router.push({name: 'product_page', params: {id: data.id}}))
              }
              else if (response.status === 400) invalid.value = true
            })
      }
    }

    return {
      categories, brands, selected_category_id, selected_subcategory_id, selected_brand_id, subcategories,
      waiting_for_response, product_name, product_url, invalid, name_max_len,
      setBrandId, submit
    }
  }
}
</script>

<style lang="scss" scoped>
.hg-wrapper {
  max-width: 450px;
}

.section {
  display: flex;
  //grid-template-columns: ;

  &.grid {
    display: grid;
    grid-template-columns: 1fr auto;
  }
}

.hg-input {
  width: 100%;
  //box-sizing: border-box;
}

.info, .title {
  margin: 11px;
}

.hg-select {
  //width: 12rem;
}

.invalid_info {
  color: red;
}
</style>