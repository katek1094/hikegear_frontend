<template>
  <div class="content">
    <slot/>
    <span class="tooltip" :class="direction">{{ text }}</span>
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
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  position: relative;
}

.tooltip {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  opacity: 0;

  &::after {
    content: "";
    position: absolute;
    border-style: solid;
    border-width: 5px;
  }

  &.top {
    bottom: 125%;
    left: 50%;
    margin-left: -60px;
  }

  &.top::after {
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-color: #555 transparent transparent transparent;
  }

  &.bottom {
    top: 125%;
    left: 50%;
    margin-left: -60px;
  }

  &.bottom::after {
    bottom: 100%;
    left: 50%;
    margin-left: -5px;
    border-color: transparent transparent #555 transparent;
  }

  &.right {
    left: 105%;
    top: 5px;
  }

  &.right::after {
    top: 50%;
    right: 100%;
    margin-top: -5px;
    border-color: transparent #555 transparent transparent;
  }

  &.left {
    right: 105%;
    top: 5px;
  }

  &.left::after {
    top: 50%;
    left: 100%;
    margin-top: -5px;
    border-color: transparent transparent transparent #555;
  }




}

//TODO: add media query
.content:hover .tooltip {
  visibility: visible;
  opacity: 1;
  transition: opacity 1s .6s, visibility 1s .6s;
}

</style>
