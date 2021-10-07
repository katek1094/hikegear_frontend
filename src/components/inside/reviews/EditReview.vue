<template>
    <ReviewForm method="PATCH" :product="product" :review="review"/>
</template>

<script>
import ReviewForm from "./ReviewForm";
import {ref} from "vue";
import {apiFetch} from "../../../functions";

export default {
  name: "EditReview",
  components: {ReviewForm},
  props: {review_id: String, product_id: String},
  setup(props) {
    const product = ref({})
    const review = ref({})

    apiFetch('products/' + props.product_id, {
      method: 'GET'
    })
        .then(response => {
          if (response.ok) response.json().then(data => {
            product.value = data
            review.value = data.reviews.find((el) => el.id === parseInt(props.review_id))
          })
        })

    return {review, product}
  }
}
</script>

<style scoped>

</style>