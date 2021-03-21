<template>
  <router-view :key="$route.fullPath"/>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style lang="scss">
//#app {
//  min-height: 100vh;
//}
* {
  font-family: Arial, sans-serif;
}

html {
  //min-width: 320px;
  //max-width: 100vw;
  overflow-x: hidden;
}

body {
  //margin: 0;
  //min-height: 100vh;
  background-color: $background;

  &.modal_active {
    overflow-y: hidden;
  }
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
  html, textarea {
    color: deepskyblue;
  }
}

@media (min-width: 600px) {
  /* portrait tablets, portrait iPad, e-readers (Nook/Kindle), landscape 800x480 phones (Android) */
  html {
    font-size: 16px;
  }
  html, textarea {
    color: green;
  }
}

@media (min-width: 801px) {
  /* tablet, landscape iPad, lo-res laptops ands desktops */
  html {
    font-size: 17px;
  }
  html, textarea {
    color: red;
  }
}

@media (min-width: 1025px) {
  /* big landscape tablets, laptops, and desktops */
  html {
    font-size: 17px;
  }
  html, textarea {
    color: blue;
  }
}

@media (min-width: 1281px) {
  /* hi-res laptops and desktops */
  html {
    font-size: 17px;
  }
  html, textarea {
    color: black;
  }
}
</style>
