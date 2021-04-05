<template>
  <modal ref="modal" :is_confirmation="true">
    <template v-slot:header>
      <slot name="header"/>
    </template>
    <template v-slot:body>
      <div class="body_wrapper">
        <span><slot name="body"/></span>
      </div>
      <div class="buttons_wrapper">
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
  emits: ['confirmed'],
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
.body_wrapper {
  width: 100%;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 25px;
}
.buttons_wrapper {
  display: flex;
  justify-content: space-evenly;
}

.confirm, .cancel {
  @include form-submit;
}
</style>
