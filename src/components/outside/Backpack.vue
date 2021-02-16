<template>
  <div v-if="backpack" class="backpack">
    <span class="backpack__name">{{ backpack.name }}</span>
    <Summary :summary_data="summary_data"/>
    <div class="categories">
      <div class="category" v-for="category in organized_data" :key="category.id">
        <div class="category__header">
          <span class="category__name">{{ category.name }}</span>
          <span class="category__weight__label">waga</span>
          <span class="category__quantity__label">ilość</span>
        </div>
        <div class="items">
          <div class="item" v-for="item in category.items" :key="item.id">
            <span class="item__name">{{ item.name }}</span>
            <span class="item__description">{{ item.description }}</span>
            <font-awesome-icon v-if="item.worn" class="fa-sm item__worn" icon="child"/>
            <font-awesome-icon v-else-if="item.consumable" class="fa-sm item__consumable" icon="sync-alt"/>
            <font-awesome-icon v-else class="fa-sm item__consumable invisible" icon="sync-alt"/>
            <span class="item__weight">{{ item.weight }}</span>
            <span class="item__quantity">{{ item.quantity }}</span>
          </div>
        </div>
        <div class="category__footer">
          <span></span>
          <span class="category__weight__total">{{ category.total_weight }}</span>
          <span class="category__quantity__total">{{ category.total_quantity }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {format_elements_list, getCookie, summarize_elements_list} from "@/store/functions";
import Summary from "@/components/inside/editor/Summary";

export default {
  name: "Backpack",
  components: {Summary},
  props: {
    id: String
  },
  data() {
    return {
      backpack: false
    }
  },
  computed: {
    summary_data() {
      return summarize_elements_list(this.backpack.list)
    },
    organized_data() {
      return format_elements_list(this.backpack.list)
    }
  },
  methods: {},
  beforeCreate() {
    fetch(process.env.VUE_APP_API_URL + '/api/backpacks/' + this.id + '/', {
      method: 'GET',
      headers: {
        'X-CSRFToken': getCookie('csrftoken')
      },
      credentials: 'include',
    })
        .then(response => {
          if (response.ok) {
            response.json().then(data => {
              this.backpack = data
            })
          } else console.log(response)
        })
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/backpack.scss";

.backpack {
  padding-bottom: 20px;
  @include flex-column-center;
  max-width: 100vw;
}

.backpack__name, .category__name, .item__name, .item__description,
.item__weight, .item__quantity, .category__weight__label, .category__quantity__label,
.category__quantity__total, .category__weight__total {
  padding: 3px;
}

.backpack__name, .category__name {
  font-weight: bold;
}

.backpack__name {
  text-align: center;
  margin: .4rem 0;
  font-size: 1.4rem;
}

.category {
  margin: 16px 0;
}

.category__name {
  width: 100%;
  box-sizing: border-box;
}

$weight_width: 2.8rem;
$quantity_width: 2rem;

.category__header {
  @include editor-category_grid;
  font-size: 1rem;
  grid-template-columns: 1fr $weight_width $quantity_width;
}

.category__footer {
  @include editor-category_grid;
  grid-template-columns: 1fr $weight_width $quantity_width;
}

.item {
  @include editor-category_grid;
  grid-template-columns: 1fr 1fr auto $weight_width $quantity_width;
}

.items {
  border-top: 1px solid grey;
  border-bottom: 1px solid grey;
}

.invisible {
  visibility: hidden;
}

.category__weight__label, .category__quantity__label,
.category__quantity__total, .category__weight__total, .item {
  font-size: .8rem;
}

.category__weight__label, .category__quantity__label {
  align-self: flex-end;
}

.item:not(:last-child) {
  border-bottom: 1px dotted grey;
}

.item__worn, .item__consumable {
  border-radius: 50%;
  border: none;
  background-color: transparent;
  outline: none;
  color: blue;
  padding: 4px;
  font-size: 1.15em;
  margin: 0 3px;
}

</style>
