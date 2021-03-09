<template>
  <modal ref="modal">
    <template v-slot:header>
      <h2>
        <slot name="header"></slot>
      </h2>
    </template>
    <template v-slot:body>
      <div class="wrapper">
        <button class="confirm" @click="confirm">tak</button>
        <button class="cancel" @click="closeModal">nie</button>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "@/components/Modal";

export default {
  name: "ConfirmationDialog",
  components: {Modal},
  methods: {
    openModal() {
      this.$refs.modal.openModal()
    },
    closeModal() {
      this.$refs.modal.closeModal()
    },
    confirm() {
      this.$emit('confirmed')
      this.$refs.modal.closeModal()
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  justify-content: space-evenly;
}

.confirm, .cancel {
  @include form-submit;
}
</style>
