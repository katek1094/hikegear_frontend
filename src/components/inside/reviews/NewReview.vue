<template>
  <ReviewForm method="POST" :product="product"/>
</template>

<script>

import {ref} from "vue";
import {apiFetch} from "../../../functions";

import ReviewForm from "./ReviewForm";

export default {
  name: "NewReview",
  components: {ReviewForm},
  props: {product_id: String},
  setup(props) {
    const product = ref({})

    apiFetch('products/' + props.product_id, {
      method: 'GET'
    })
        .then(response => {
          if (response.ok) response.json().then(data => product.value = data)
        })

    return {product}
  }
}
</script>

<style lang="scss" scoped>

</style>