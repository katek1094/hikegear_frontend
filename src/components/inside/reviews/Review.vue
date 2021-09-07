<template>
  <div class="review">
    <router-link v-if="is_author" class="hg-link add"
                 :to="{name: 'edit_review', params: {product_id: review.product, review_id: review.id}}">
      <font-awesome-icon class="fa-md" icon="edit"/>
      edytuj recenzję
    </router-link>

    <Tooltip text="usuń recenzję" direction="left" size="small" class="tp">
      <button class="delete_review" v-if="is_author" type="button" @click="displayConfirmationDialog">
        <font-awesome-icon class="fa-sm" icon="trash"/>
      </button>
    </Tooltip>
    <ConfirmationDialog ref="confirmation_dialog" @confirmed="deleteReview">
      <template v-slot:header>na pewno chcesz usunąć tę recenzję?</template>
    </ConfirmationDialog>

    <p><b>{{ review.summary }}</b></p>
    <p>{{ review.text }}</p>
    <p v-if="review.weight_net">waga bez pokrowca: {{ review.weight_net }}g</p>
    <p v-if="review.weight_gross">waga z pokrowcem: {{ review.weight_gross }}g</p>
  </div>
</template>

<script>
import Tooltip from "@/components/Tooltip";
import ConfirmationDialog from "../../ConfirmationDialog";
import {useConfirmationDialog} from "@/hooks.js";
import {apiFetch} from "../../../functions";

export default {
  name: "Review",
  components: {ConfirmationDialog, Tooltip},
  props: {review: Object, is_author: Boolean},
  emits: {reviewDeleted: ({id}) => Number.isInteger(id)},
  setup(props, {emit}) {
    const deleteReview = () => {
      apiFetch('reviews/' + props.review.id, {
        method: 'DELETE'
      })
          .then(response => {
            if (response.ok) emit('reviewDeleted', {id: props.review.id})
          })
    }
    const {confirmation_dialog, displayConfirmationDialog} = useConfirmationDialog()

    return {deleteReview, confirmation_dialog, displayConfirmationDialog}
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

.delete_review {
  @include editor_delete;
  visibility: visible !important;
  font-size: 1rem;
}

.tp {
  float: right; // its not necessary after wrapping into div with grid or flex
}
</style>