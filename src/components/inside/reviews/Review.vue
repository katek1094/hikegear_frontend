<template>
  <div class="review">
    <router-link v-if="is_author" class="hg-link add"
                 :to="{name: 'edit_review', params: {product_id: review.product, review_id: review.id}}">
      <font-awesome-icon class="fa-md" icon="edit"/>edytuj recenzję
    </router-link>
      <p><b>{{ review.summary }}</b></p>
      <p>{{ review.text }}</p>
      <p v-if="review.weight_net">waga bez pokrowca: {{ review.weight_net }}g</p>
      <p v-if="review.weight_gross">waga z pokrowcem: {{ review.weight_gross }}g</p>
  </div>
</template>

<script>

export default {
  name: "Review",
  props: {review: Object, is_author: Boolean},
  setup() {
  }
}
</script>

<style lang="scss" scoped>
.review {
  //border: 1px solid black;
  border-radius: 8px;
  background-color: $grey3;
  padding: 8px;
  margin-top: 20px;
}

.hg-link.add {
  @include editor-add;
}
</style>