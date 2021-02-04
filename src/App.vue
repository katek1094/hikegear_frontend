<template>
  <div>
    <router-view :key="$route.fullPath"/>
  </div>
</template>

<script>

export default {
  name: 'App',
  beforeCreate() {
    if (this.$store.getters['auth/is_logged_in']) {
      this.$store.dispatch('auth/get_initial_data')
    }
  }
}
</script>

<style>
* {
  font-family: Arial, sans-serif;
}

html {
  font-size: 16px;
  min-width: 320px;
}

body {
  margin: 0;
}

@media (max-width: 479px) {
  /* smartphones, portrait iPhone, portrait 480x320 phones (Android) */
  html {
    font-size: 14px;
  }

}

@media (min-width: 480px) {
  /* smartphones, Android phones, landscape iPhone */
  html {
    font-size: 15px;
  }
}

@media (min-width: 600px) {
  /* portrait tablets, portrait iPad, e-readers (Nook/Kindle), landscape 800x480 phones (Android) */
  html {
    font-size: 16px;
  }
}

@media (min-width: 801px) {
  /* tablet, landscape iPad, lo-res laptops ands desktops */
  html {
    font-size: 17px;
  }
}

@media (min-width: 1025px) {
  /* big landscape tablets, laptops, and desktops */
  html {
    font-size: 18px;
  }
}

@media (min-width: 1281px) {
  /* hi-res laptops and desktops */
  html {
    font-size: 19px;
  }
}

</style>
