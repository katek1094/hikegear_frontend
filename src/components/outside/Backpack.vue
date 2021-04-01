<template>
  <router-link to="/"><img alt="logo" src="@/assets/logo.png" class="logo"></router-link>
  <div class="wrapper">
    <div v-if="backpack" class="backpack">
      <router-link v-if="backpack.is_owner" :to="{name: 'editor'}" class="back_to_editor">
        <font-awesome-icon class="fa-md back_to_editor__icon" icon="share"/>
        wróć do edytora
      </router-link>
      <span class="backpack__name">{{ backpack.name }}</span>
      <Summary v-show="summary_data.total_weight !== 0" :summary_data="summary_data"/>
      <span class="backpack__description">{{ backpack.description }}</span>
      <div class="categories">
        <div class="category" v-for="category in backpack.list" :key="category.id">
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
                <Tooltip v-if="item.worn" text="przedmiot noszony na sobie" size="small">
                  <font-awesome-icon class="fa-md" icon="child"/>
                </Tooltip>
                <Tooltip v-if="item.consumable" text="przedmiot konsumpcyjny" size="small">
                  <font-awesome-icon class="fa-md" icon="sync-alt"/>
                </Tooltip>
                <font-awesome-icon v-if="!item.worn && !item.consumable" class="fa-md invisible" icon="sync-alt"/>
              </div>
              <span class="item__weight">{{ item.weight }}</span>
              <span class="item__quantity">{{ item.quantity }}</span>
            </div>
          </div>
          <div class="category__footer">
            <span></span>
            <span class="category__weight__total">{{ totalWeight(category.items) }}</span>
            <span class="category__quantity__total">{{ totalQuantity(category.items) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {apiFetch, summarize_elements_list, hashids} from "@/functions";
import Summary from "@/components/inside/editor/Summary";
import Tooltip from "@/components/Tooltip";

export default {
  name: "Backpack",
  components: {Tooltip, Summary},
  props: {
    hash: String
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
  },
  methods: {
    totalWeight(items) {
      let result = 0
      for (const item of items) result += item.weight * item.quantity
      return result
    },
    totalQuantity(items) {
      let result = 0
      for (const item of items) result += item.quantity
      return result
    },
  },
  beforeCreate() {
    const id = hashids.decode(this.hash)
    apiFetch('backpacks/' + id + '/', {
      method: 'GET',
    })
        .then(response => {
          if (response.ok) response.json().then(data => this.backpack = data)
          else console.log(response)
        })
  },
}
</script>

<style lang="scss" scoped>
.back_to_editor {
  color: black;
  text-decoration: none;
  margin: 10px 0;
  align-self: start;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      text-decoration: underline;
    }
  }

  &__icon {
    -moz-transform: scale(-1, 1);
    -webkit-transform: scale(-1, 1);
    -o-transform: scale(-1, 1);
    -ms-transform: scale(-1, 1);
    transform: scale(-1, 1);
  }
}

.logo:hover {
  background-color: white;
  border-radius: 8px;
}

.wrapper {
  @include flex-column-center;
}

.backpack {
  padding-bottom: 30px;
  @include flex-column-center;
  width: 96%;
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
  width: 85%;
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
  @include category-item_grid;
  font-size: 1rem;
  grid-template-columns: 1fr $weight_width $quantity_width;
}

.category__footer {
  @include category-item_grid;
  grid-template-columns: 1fr $weight_width $quantity_width;
}

.item {
  @include category-item_grid;
  grid-template-columns: 1fr 1fr auto $weight_width $quantity_width;
}

.items {
  @include editor-items;
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

@media (min-width: 480px) {
  /* smartphones, Android phones, landscape iPhone */
  .backpack {
    width: 96%;
  }
}

@media (min-width: 600px) {
  /* portrait tablets, portrait iPad, e-readers (Nook/Kindle), landscape 800x480 phones (Android) */

}

@media (min-width: $editor_enough_width + 60px) {
  .backpack {
    width: 92%;
  }
}

@media (min-width: 801px) {
  /* tablet, landscape iPad, lo-res laptops ands desktops */
  .backpack {
    width: 86%;
    max-width: 800px;
  }
}

@media (min-width: 1025px) {
  /* big landscape tablets, laptops, and desktops */

}

@media (min-width: 1281px) {
  /* hi-res laptops and desktops */

}
</style>
