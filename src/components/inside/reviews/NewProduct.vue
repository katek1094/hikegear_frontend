<template>
  <InsideBaseApp>
    <div class="hg-flx_col_ctr">
      <div class="new_product hg-wrapper">
        <h1 class="title">nowy produkt</h1>
        <form @submit.prevent>
          <div class="section">
            <input v-model="product_name" class="hg-input" type="text" placeholder="nazwa (model)">
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
          <div v-if="waiting_for_response" class="hg-spinner"></div>
          <button v-else class="hg-button" type="submit" @click="submit">zatwierdź</button>
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

export default {
  name: "NewProduct",
  components: {SearchSelectDropdown, InsideBaseApp},
  setup() {
    const router = useRouter()
    const product_name = ref("")
    const product_url = ref("")
    const waiting_for_response = ref(false)
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
        })
            .then(response => {
              if (response.ok) response.json().then(data => router.push({name: 'product_page', params: {id: data.id}}))
              else console.log(response)
            })
      }
    }

    return {
      categories, brands, selected_category_id, selected_subcategory_id, selected_brand_id, subcategories,
      waiting_for_response, product_name, product_url,
      setBrandId, submit
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>