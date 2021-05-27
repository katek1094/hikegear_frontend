<template>
<!--  <router-link class="hg-link name" :to="{name: 'product_page', params: {id: result.id}}">-->
    <div class="wrapper" @click="routeToProduct">
      <span class="name">{{ product_name }}</span>
      <span class="info">{{ reviews_amount_info }}</span>
      <!--    <router-link class="hg-link" :to="{name: 'product_page', params: {id: result.id}}">zobacz recenzje</router-link>-->
      <!--    <router-link class="hg-link" :to="{name: 'new_review', params: {id: result.id}}">dodaj recenzję</router-link>-->
    </div>
<!--  </router-link>-->
</template>

<script>
export default {
  name: "SearchProductResult",
  props: {result: Object},
  computed: {
    reviews_amount_info() {
      let strings = {many: 'recenzji', one: 'recenzja', few: 'recenzje'}
      let pr = new Intl.PluralRules('pl-PL')
      return this.result.reviews_amount + ' ' + strings[pr.select(this.result.reviews_amount)]
    },
    product_name() {
      if (this.result.subcategory.name !== 'inne') {
        return this.result.subcategory.name + ' ' + this.result.brand.name + ' ' + this.result.name
      } else return this.result.brand.name + ' ' + this.result.name
    }
  },
  methods: {
    routeToProduct() {
      this.$router.push({name: 'product_page', params: {id: this.result.id}})
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  border-radius: 4px;
  margin: 16px 10px;
  padding: 16px 10px;
  background-color: $grey3;
  display: grid;
  grid-template-columns: 1fr auto;
  
  &:hover {
    cursor: pointer;
  }
}

.name {

}

.info {
  margin-left: 6px;
  font-size: .9rem;
}
</style>