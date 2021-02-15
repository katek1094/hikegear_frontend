<template>
  <div v-if="backpack" class="backpack">
    <p class="backpack__name">{{backpack.name}}</p>
    <Summary :summary_data="summary_data"/>
    <div v-for="category in organized_data" :key="category.id">
      <div class="category__header">
        <p class="category__name">{{category.name}}</p>
        <span class="category__weight__label">waga</span>
        <span class="category__quantity__label">ilość</span>
      </div>
      <div class="items">
        <div class="item" v-for="item in category.items" :key="item.id">
          <span class="item__name">{{item.name}}</span>
          <span class="item__description">{{item.description}}</span>
          <font-awesome-icon v-if="item.worn" class="fa-sm item__worn" icon="child"/>
          <font-awesome-icon v-if="item.consumable" class="fa-sm item__consumable" icon="sync-alt"/>
          <span class="item__weight">{{item.weight}}</span>
          <span class="item__quantity">{{item.quantity}}</span>
        </div>
      </div>
      <div class="category__footer">
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

<style scoped>
.backpack {
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.backpack__name, >>> .category__name, >>> .item__name, >>> .item__description,
>>> .item__weight, >>> .item__quantity {
  border-radius: 4px;
  font-size: 1em;
  border: 1px solid transparent;
  background-color: transparent;
  outline: none;
  padding: 3px;
}

.backpack__name, >>> .category__name {
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
  display: flex;
  padding: 0 3px;
  align-items: center;
}

.category__header {
  font-size: 1rem;
}

.category__name {
  width: 90%;
  box-sizing: border-box;
}

.items {
  border-top: 1px solid grey;
  border-bottom: 1px solid grey;
}

.category__delete, >>> .item__delete {
  visibility: hidden;
  outline: none;
  border: none;
  background-color: transparent;
  padding: 4px 6px;
}

.category__header:hover .category__delete.deletable, >>> .item:hover .item__delete {
  visibility: visible;
}

@media (hover: hover) and (pointer: fine) {
  .category__delete:hover, >>> .item__delete:hover {
    color: red;
    cursor: pointer;
  }
}

.category__handle, >>> .item__handle {
  margin: 0 4px 0 0;
  padding: 6px;
  cursor: move;
  border-radius: 6px;
  font-size: 1.15rem;
  visibility: hidden;
}

.category__header:hover .category__handle, >>> .item:hover .item__handle {
  visibility: visible;
}

.category__handle:hover, >>> .item__handle:hover {
  background-color: white;
}

.sortable-chosen {
  transform: scale(1.01);
  box-shadow: 4px 4px 4px grey;
}

.category__weight__label, .category__quantity__label, .category__delete, >>> .item__delete, >>> .item__worn,
>>> .item__consumable, >>> .item__description, >>> .item__name, >>> .item__weight, >>> .item__quantity,
.category__quantity__total, .category__weight__total {
  margin: 0 2px;
}

.category__weight__label, .category__quantity__label, .category__quantity__total, .category__weight__total {
  font-size: .8rem;
}

.category__weight__label, >>> .item__weight, .category__weight__total {
  padding: 5px 8px 5px 4px;
  width: 2.8rem;
  box-sizing: border-box;
}

.category__quantity__label, >>> .item__quantity, .category__quantity__total {
  padding: 5px 8px 5px 4px;
  width: 2.8rem;
  box-sizing: border-box;
}

.category__weight__label, .category__weight__total {
  margin-left: auto;
}

.category__weight__label, .category__quantity__label {
  align-self: flex-end;
}

@media (hover: none) and (pointer: coarse) {
  .category__handle, >>> .item__handle, .category__delete, >>> .item__delete, >>> .item__worn, >>> .item__consumable {
    visibility: visible;
  }

  .invisible {
    visibility: hidden;
  }

  .item__worn:hover:enabled, .item__consumable:hover:enabled {
    color: grey;
  }

  .category__quantity__label, >>> .item__quantity, .category__quantity__total {
    width: 1.8rem;
  }

  .category__delete, >>> .item__delete {
    margin: 0 2px 0 4px;
  }
  .category__handle, >>> .item__handle {
    margin-left: 2px;
  }


  >>> .item__quantity::-webkit-outer-spin-button,
  >>> .item__quantity::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  >>> .item__quantity[type=number] {
    -moz-appearance: textfield;
  }
}

.item {
  font-size: .8rem;
}

.item.first, .item.middle {
  border-bottom: 1px dotted grey;
}

.item.first.last {
  border: none;
}

.item__name {
  width: 100%;
}

.item__description {
  width: 100%;
}

.item:hover .item__worn, .item:hover .item__consumable {
  visibility: visible;
}

.item__worn, .item__consumable {
  border-radius: 50%;
  border: 1px solid transparent;
  background-color: transparent;
  outline: none;
  padding: 3px;
  font-size: 1.15em;
  color: blue;
}

.checked {
  visibility: visible;
}

</style>
