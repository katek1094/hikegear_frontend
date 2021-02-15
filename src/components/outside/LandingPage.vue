<template>
  <div>
    <router-link to="/"><img alt="logo" src="@/assets/logo.png" class="logo"></router-link>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
}
</script>

<style lang="scss" scoped>
.logo:hover {
  background-color: white;
  border-radius: 8px;
}

::v-deep(.auth__form) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

::v-deep(.auth__input) {
  font-size: 1.2rem;
  margin: 4px;
  border-radius: 4px;
  outline: none;
  padding: 7px;
  border: 1px solid white;
}

::v-deep(.auth__input:hover) {

}

::v-deep(.auth__input:focus) {
  border: 1px solid black;
}

::v-deep(.auth__input.invalid.blurred.activated) {
  border-color: red;
}

::v-deep(.auth__label) {
  margin: 10px 4px;
}

::v-deep(.auth__submit) {
  outline: none;
  border-radius: 5px;
  font-size: 1.2rem;
  border: 1px solid grey;
  padding: 8px 12px;
  margin: 4px;
  background-color: white;
  transition: all .25s;
}

::v-deep(.auth__submit:hover) {
  cursor: pointer;
  transform: translate(0, -1px);
  box-shadow: grey 0 1px;
}

::v-deep(.auth__submit:active) {
  transition: all .1s;
  transform: none;
  box-shadow: none;
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
