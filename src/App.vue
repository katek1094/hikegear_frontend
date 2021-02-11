<template>
  <router-view v-if="fetched" :key="$route.fullPath"/>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      fetched: false
    }
  },
  beforeCreate() {
    this.$store.dispatch('editor/getInitialData').then(status => {
      if (status === 'not logged in') {
        this.$store.dispatch('auth/changeLoggedIn', false)
        this.fetched = true
        this.$router.push('/login')
      } else {
        this.$store.dispatch('auth/changeLoggedIn', true)
        this.fetched = true
        this.$router.push('/editor')
      }
    })
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
  /*--background: #f6f6f6;*/
  --background: #efeded;
  /*--background: #e7e6e6;*/
}

body {
  margin: 0;
  min-height: 100vh;
  background-color: var(--background);
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
    font-size: 17px;
  }

  .category {
    width: 700px;
  }
}

@media (min-width: 1281px) {
  /* hi-res laptops and desktops */
  html {
    font-size: 17px;
  }
}

</style>
