<template>
  <teleport to="body">
    <div class="modal" v-if="show" :class="{is_confirmation: is_confirmation}">
      <div class="modal__backdrop" @click="closeModal"/>
      <div class="modal__dialog" :class="{is_confirmation: is_confirmation}">
        <button type="button" class="modal__close" @click="closeModal">
          <font-awesome-icon class="fa-lg" icon="times"/>
        </button>
        <h2 class="modal__header">
          <slot name="header"/>
        </h2>
        <div class="modal__body">
          <slot name="body"/>
        </div>
        <div class="modal__footer">
          <slot name="footer"/>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>

export default {
  name: "Modal",
  emits: ['open-modal', 'close-modal'],
  props: {
    hide_on_outside_click: {type: Boolean, default: true},
    is_confirmation: {type: Boolean, default: false}
  },
  data() {
    return {
      show: false,
    }
  },
  methods: {
    closeModal(e) {
      if (!(!this.hide_on_outside_click && e && (e.target.className === "modal__backdrop"))) {
        this.show = false;
        this.$emit('close-modal')
        document.querySelector("body").classList.remove("modal_active");
        if (!this.is_confirmation)  document.querySelector("body").style.marginRight = '0'
      }
    },
    openModal() {
      this.show = true;
      this.$emit('open-modal')
      document.querySelector("body").classList.add("modal_active");
      if (!this.is_confirmation) document.querySelector("body").style.marginRight = '15px';
    },
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
  z-index: 10;

  &.is_confirmation {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  &__backdrop {
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    top: 0;
    right: 15px;
    bottom: 0;
    left: 0;
    z-index: 9;

    .is_confirmation & {
      right: 0;
    }
  }

  @media (hover: none) and (pointer: coarse) {
    &__backdrop {
      right: 0;
    }
  }

  &__dialog {
    background-color: $windows_color;
    position: relative;
    margin: 5vh auto;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    z-index: 11;
  }

  $close_size: 2.8rem;
  $close_distance: .3rem;

  &__close {
    border: none;
    border-radius: 50%;
    background-color: transparent;
    font-size: 1.6rem;
    width: $close_size;
    height: $close_size;
    outline: none;
    position: absolute;
    right: $close_distance;
    top: $close_distance;
    padding: 0;
    box-sizing: border-box;
  }

  @media (hover: hover) and (pointer: fine) {
    &__close:hover {
      cursor: pointer;
      color: red;
    }
  }

  $left_padding: 1.2rem;

  &__header {
    padding: 24px $close_size + $close_distance 20px $left_padding;
    text-align: center;
    border-bottom: 1px solid grey;
    margin: 0;
  }

  $footer_padding: 4px;

  &__body {
    padding: 10px + 2* $footer_padding $left_padding 10px;
  }

  &__footer {
    padding: $footer_padding $left_padding;
  }
}

@media (max-width: 479px) {
  /* smartphones, portrait iPhone, portrait 480x320 phones (Android) */
  .modal__dialog {
    width: 90%;
  }
}

@media (min-width: 480px) {
  /* smartphones, Android phones, landscape iPhone */
  .modal__dialog {
    width: 84%;

    &.is_confirmation {
      width: 66%;
    }
  }
}

@media (min-width: 600px) {
  /* portrait tablets, portrait iPad, e-readers (Nook/Kindle), landscape 800x480 phones (Android) */
  .modal__dialog {
    width: 80%;

    &.is_confirmation {
      width: 60%;
    }
  }
}

@media (min-width: 801px) {
  /* tablet, landscape iPad, lo-res laptops ands desktops */
  .modal__dialog {
    width: 66%;

    &.is_confirmation {
      max-width: 580px;
    }
  }
}

@media (min-width: 1025px) {
  /* big landscape tablets, laptops, and desktops */
  .modal__dialog {
    width: 54%;
  }
}

@media (min-width: 1281px) {
  /* hi-res laptops and desktops */
  .modal__dialog {
    width: 48%;
    max-width: 740px;
  }
}
</style>
