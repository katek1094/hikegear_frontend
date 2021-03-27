<template>
  <div class="outside_base_app">
    <router-link to="/"><img alt="logo" src="@/assets/logo.png" class="logo"></router-link>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "OutsideBaseApp",
}
</script>

<style lang="scss" scoped>
.logo:hover {
  background-color: white;
  border-radius: 8px;
}

::v-deep(.auth__form) {
  @include flex-column-center;
}

::v-deep(.auth__input) {
@include form-input;
}

::v-deep(.auth__input.invalid.blurred.activated) {
  border-color: red;
}

::v-deep(.auth__label) {
  margin: 10px 4px;
}

::v-deep(.auth__submit) {
@include form-submit;
}

::v-deep(.login__option) {
  margin-top: 20px;
  color: black;
  text-decoration: none;
}

::v-deep(.login__option:hover) {
  text-decoration: underline;
}

</style>
