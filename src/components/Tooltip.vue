<template>
  <div class="content">
    <slot/>
    <span class="tooltip" :class="classes">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: "Tooltip",
  props: {
    text: String,
    direction: {
      default: 'top',
      validator: (value) => ['top', 'bottom', 'right', 'left'].indexOf(value) !== -1
    },
    size: {
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].indexOf(value) !== -1
    }
  },
  computed: {
    classes() {
      return this.direction + ' ' + this.size
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  position: relative;
}

$arrow_width: 5px;
.tooltip {
  height: 0;
  visibility: hidden;
  opacity: 0;
  position: absolute;

  &.left {
    right: 105%; //to do not stick out while dragging
  }
}

.content:active .top {
  bottom: 0;
}

$small_width: 100px;
$medium_width: 220px;
$large_width: 360px;

@media (hover: hover) and (pointer: fine) {
  .content:hover:not(:active) .tooltip,
  .content:hover:not(:active) .tooltip {
    height: auto;
    visibility: visible;
    opacity: 1;
    transition: opacity 1s .6s, visibility 1s .6s, height 1s .6s;

    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    z-index: 1;
    font-size: .8rem;

    &.small {
      width: $small_width;
    }

    &.medium {
      width: $medium_width;
    }

    &.large {
      width: $large_width;
    }

    &::after {
      content: "";
      position: absolute;
      border-style: solid;
      border-width: $arrow_width;
    }

    &.top {
      bottom: 125%;
      left: 50%;

      &.small {
        margin-left: - $small_width / 2;
      }

      &.medium {
        margin-left: - $medium_width / 2;
      }

      &.large {
        margin-left: - $large_width / 2;
      }
    }

    &.top::after {
      top: 100%;
      left: 50%;
      margin-left: -2 * $arrow_width;
      border-color: #555 transparent transparent transparent;
    }

    &.bottom {
      top: 125%;
      left: 50%;

      &.small {
        margin-left: - $small_width / 2;
      }

      &.medium {
        margin-left: - $medium_width / 2;
      }

      &.large {
        margin-left: - $large_width / 2;
      }
    }

    &.bottom::after {
      bottom: 100%;
      left: 50%;
      margin-left: - 2 * $arrow_width;
      border-color: transparent transparent #555 transparent;
    }

    &.right {
      left: 105%;
      margin-top: $arrow_width / 5;
    }

    &.right::after {
      top: 50%;
      right: 100%;
      margin-top: -$arrow_width;
      border-color: transparent #555 transparent transparent;
    }

    &.left {
      right: 105%;
      margin-top: $arrow_width / 5;
    }

    &.left::after {
      top: 50%;
      left: 100%;
      margin-top: - $arrow_width;
      border-color: transparent transparent transparent #555;
    }
  }
  .drag_item .content:hover:not(:active) .tooltip,
  .drag_cat .category__header .content:hover:not(:active) .tooltip,
  .drag_cat .my_category__header .content:hover:not(:active) .tooltip {
    display: none;
  }

}
</style>
