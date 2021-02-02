<template>
  <div>
      <img alt="logo" src="@/assets/hikegear_logo.png">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
}
</script>

<style scoped>
img {
  margin: -70px 0;
  overflow: hidden;
}



>>> .auth__form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

>>> .auth__input {
  font-size: 1rem;
  margin: 4px;
  border-radius: 4px;
  outline: none;
  padding: 4px;
  border: 1px solid white
}

>>> .auth__input:focus {
  border: 1px solid black;
}

>>> .auth__input.invalid.blurred {
  border-color: red;
}







</style>