<template>
  <div v-if="backpack" class="backpack">
    <span class="backpack__name">{{ backpack.name }}</span>
    <Summary :summary_data="summary_data"/>
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
<!--          <font-awesome-icon v-if="item.worn" class="fa-sm item__worn" icon="child"/>-->
          <font-awesome-icon class="fa-sm item__worn" icon="child"/>
<!--          <font-awesome-icon v-if="item.consumable" class="fa-sm item__consumable" icon="sync-alt"/>-->
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

.category__header, .category__footer, .item {
  padding: 0 3px;
  width: 100%;
}
.category__header, .category__footer {
  display: grid;
  grid-template-columns: 1fr 2.8rem 2.8rem;
}

.item {
  display: grid;
  grid-template-columns: 1fr 1fr 20px 2.8rem 2.8rem;
  align-items: center;
}

.items {
  border-top: 1px solid grey;
  border-bottom: 1px solid grey;
}

.category__weight__label, .category__quantity__label, .category__quantity__total, .category__weight__total {
  font-size: .8rem;
}

.category__weight__label, .item__weight, .category__weight__total {
  padding: 5px 8px 5px 4px;
  width: 2.8rem;
  box-sizing: border-box;
}

.category__quantity__label, .item__quantity, .category__quantity__total {
  padding: 5px 8px 5px 4px;
  width: 2.8rem;
  box-sizing: border-box;
}

.category__weight__label, .category__quantity__label {
  align-self: flex-end;
}


.item {
  font-size: .8rem;
}

.item:not(:last-child) {
  border-bottom: 1px dotted grey;
}


.item__worn, .item__consumable {
  border-radius: 50%;
  border: 1px solid transparent;
  background-color: transparent;
  outline: none;
  padding: 3px;
  font-size: 1.15em;
  color: blue;
  box-sizing: initial;
}


</style>
