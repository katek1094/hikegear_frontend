<template>
  <modal ref="modal">
    <template v-slot:header>
      <h2>
        <slot name="header"></slot>
      </h2>
    </template>
    <template v-slot:body>
      <div class="wrapper">
        <button class="confirm">tak</button>
        <button class="cancel">nie</button>
      </div>
    </template>
  </modal>
</template>

<script>
export default {
  name: "ConfirmationModal",
  methods: {
    openModal() {
      this.$refs.modal.openModal()
    },


  }
}
</script>

<style scoped>

</style>
