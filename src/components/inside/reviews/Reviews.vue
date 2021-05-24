<template>
  <InsideBaseApp>
    <div class="reviews hg-flx_col_ctr">
      <div>
        <h2>Recencje produktów</h2>
        <input type="text" placeholder="wyszukaj produkt">
        <h4>filtry</h4>
        <div>
          <label for="select_category">wybierz kategorię</label>
          <select id="select_category" v-model="selected_category_index">
            <option disabled hidden selected value="">{{ selected_category_index }}</option>
            <option v-for="(category, index) in categories" :key="index" :value="index">{{ category.name }}</option>
          </select>
        </div>
        <div v-if="selected_category_index != null">
          <label for="select_subcategory">wybierz podkategorię</label>
          <select id="select_subcategory" v-model="selected_subcategory_index">
            <option disabled hidden selected value="">wybierz podkategorię</option>
            <option v-for="(subcategory, index) in categories[selected_category_index].subcategories" :key="index"
                    :value="index">{{ subcategory }}
            </option>
          </select>
        </div>
        <div>
          <label for="select_brand">wybierz producenta</label>
          <select id="select_brand" v-model="selected_brand_index">
            <option disabled hidden selected value="">{{ selected_brand_index }}</option>
            <option v-for="(brand, index) in brands" :key="index" :value="index">{{ brand }}</option>
          </select>
        </div>



        <button>dodaj recenzję</button>

      </div>
    </div>
  </InsideBaseApp>
</template>

<script>
import InsideBaseApp from "../InsideBaseApp";
import {ref} from 'vue'

export default {
  name: "Reviews",
  components: {InsideBaseApp},
  setup() {
    const categories = [
      {name: 'obuwie', subcategories: ['trekkingowe', 'trailowe', 'wysokie', 'wodoodporne']},
      {name: 'ubrania', subcategories: ['kurtki', 'czapki', 'spodnie', 'koszulki']},
      {name: 'plecaki', subcategories: ['10-20l', '20-30l', '30-40l', '40l+']},
      {name: 'biwakowanie', subcategories: ['tarpy', 'namioty', 'śpiwory', 'hamaki']},
      {name: 'gotowanie', subcategories: ['palniki', 'naczynia', 'paliwo']},
      {name: 'elektronika', subcategories: ['czołówki', 'telefony', 'gps', 'powerbanki', 'ładowarki słoneczne']},
      {name: 'pozostałe', subcategories: ['kije trekkingowe', 'kompasy', 'noże', 'krzesiwa']}
    ]

    const brands = [
      'Cumulus', 'OnMyWay', 'Lesovik', 'Montano', 'Kwark', 'Salewa', 'Brooks', 'Black Diamond'
    ]

    const selected_category_index = ref(null)
    const selected_subcategory_index = ref(null)
    const selected_brand_index = ref(null)

    return {categories, brands, selected_category_index, selected_subcategory_index, selected_brand_index}
  }
}
</script>

<style lang="scss" scoped>

</style>