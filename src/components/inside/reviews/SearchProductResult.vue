<template>
  <div class="wrapper">
    <!--    <p>{{result}}</p>-->
    <p></p>
    <p>{{result.subcategory.name}} {{ result.brand.name }} {{ result.name }}</p>
    <p>{{reviews_amount_info}}</p>
    <router-link class="hg-link" :to="{name: 'new_review', params: {id: result.id}}">dodaj recenzję</router-link>
    <router-link class="hg-link" :to="{name: 'product_page', params: {id: result.id}}">zobacz recenzje</router-link>
  </div>
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
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  border-radius: 4px;
  margin: 4px;
  padding: 8px;
  background-color: $grey3;
}
.hg-link {
  display: block;
}
</style>