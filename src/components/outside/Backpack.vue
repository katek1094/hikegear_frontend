<template>
  <div class="wrapper">
    <div v-if="backpack" class="backpack">
      <span class="backpack__name">{{ backpack.name }}</span>
      <Summary :summary_data="summary_data"/>
      <span class="backpack__description">{{ backpack.description }}</span>
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
              <div class="item__worn item__consumable">
                <font-awesome-icon v-if="item.worn" class="fa-md" icon="child"/>
                <font-awesome-icon v-else-if="item.consumable" class="fa-md" icon="sync-alt"/>
                <font-awesome-icon v-else class="fa-md invisible" icon="sync-alt"/>
              </div>
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

.wrapper {
  @include flex-column-center;
}

.backpack {
  padding-bottom: 30px;
  @include flex-column-center;
  max-width: 100%;
}

.backpack__name, .category__name, .item__name, .item__description,
.item__weight, .item__quantity, .category__weight__label, .category__quantity__label,
.category__quantity__total, .category__weight__total {
  padding: 3px;
}

.item__name, .item__description {
  word-wrap: anywhere;
}

.backpack__name, .category__name {
  font-weight: bold;
}

.backpack__name {
  text-align: center;
  margin: .4rem 0;
  font-size: 1.4rem;
}

.backpack__description {
  max-width: 85%;
  overflow-wrap: break-word;
  font-size: .85rem;
}

.categories {
  width: 100%;
  padding: 0 2px;
  box-sizing: border-box;
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
  margin: 0 3px;
}

@media (max-width: 479px) {
  /* smartphones, portrait iPhone, portrait 480x320 phones (Android) */
  .backpack {
    width: 100%;
  }
}

@media (min-width: 480px) {
  /* smartphones, Android phones, landscape iPhone */
  .backpack {
    width: 480px;
  }
}

@media (min-width: 600px) {
  /* portrait tablets, portrait iPad, e-readers (Nook/Kindle), landscape 800x480 phones (Android) */
  .backpack {
    width: 560px;
  }
}

@media (min-width: 801px) {
  /* tablet, landscape iPad, lo-res laptops ands desktops */

}

@media (min-width: 1025px) {
  /* big landscape tablets, laptops, and desktops */
  .backpack {
    width: 640px;
  }
}

@media (min-width: 1281px) {
  /* hi-res laptops and desktops */

}

</style>
