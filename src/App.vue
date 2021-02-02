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
  min-width: 400px;
}

body {
  margin: 0;
}

@media (min-width:320px)  { /* smartphones, portrait iPhone, portrait 480x320 phones (Android) */ }
@media (min-width:480px)  { /* smartphones, Android phones, landscape iPhone */ }
@media (min-width:600px)  { /* portrait tablets, portrait iPad, e-readers (Nook/Kindle), landscape 800x480 phones (Android) */ }
@media (min-width:801px)  { /* tablet, landscape iPad, lo-res laptops ands desktops */ }
@media (min-width:1025px) { /* big landscape tablets, laptops, and desktops */ }
@media (min-width:1281px) { /* hi-res laptops and desktops */ }

</style>
