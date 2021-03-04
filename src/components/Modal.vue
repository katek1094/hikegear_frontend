<template>
  <transition name="fade">
    <div class="modal" v-if="show">
      <div class="modal__backdrop" @click="closeModal"/>
      <div class="modal__dialog">
        <div class="modal__header">
          <slot name="header"/>
          <button type="button" class="modal__close" @click="closeModal">
            <font-awesome-icon class="fa-md" icon="times"/>
          </button>
        </div>
        <div class="modal__body">
          <slot name="body"/>
        </div>
        <div class="modal__footer">
          <slot name="footer"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  props: {hide_on_outside_click: {type: Boolean, default: true}},
  data() {
    return {
      show: false
    }
  },
  methods: {
    closeModal(e) {
      if (!this.hide_on_outside_click && (e.target.className === "modal__backdrop")) return false
      this.show = false;
      this.$emit('close-modal')
      document.querySelector("body").classList.remove("overflow-hidden");
    },
    openModal() {
      this.show = true;
      document.querySelector("body").classList.add("overflow-hidden");
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9;

  &__backdrop {
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
  }

  &__dialog {
    background-color: $windows_color;
    position: relative;
    width: 600px;
    margin: 15vh auto;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    z-index: 2;
    @media screen and (max-width: 992px) {
      width: 90%;
    }
  }

  &__close {
    border: none;
    border-radius: 50%;
    background-color: transparent;
    font-size: 1.8rem;
    width: 2.3rem;
    height: 2.3rem;
    outline: none;
  }

  &__close:hover {
    cursor: pointer;
    color: red;
  }

  &__header {
    padding: 20px 20px 10px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  &__body {
    padding: 10px 20px 10px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  &__footer {
    padding: 10px 20px 20px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

</style>
