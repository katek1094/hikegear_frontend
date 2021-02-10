<template>
  <!--  <router-view :key="$route.fullPath"/>-->
  <h1></h1>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'App',
  beforeCreate() {
    // if (this.$store.getters['auth/is_logged_in']) {
    //   this.$store.dispatch('editor/getInitialData')
    // }
    fetch(process.env.VUE_APP_API_URL + '/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'X-CSRFToken': 'E1mwaKiIb7KT9cpeZLyKF349kYrHUhymb6asSuyFQwD9iRiThG4ke3OiBVmouAT3'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: 'lucjan@gmail.com',
        password: 'plokij09'
      })
    })
        .then(response => {
          console.log(response)
          response.json().then(data => console.log(data))
              .then(() => {
                fetch(process.env.VUE_APP_API_URL + '/api/get', {
                  method: 'GET',
                })
                    .then(response => {
                      console.log(response)
                      response.json().then(data => {
                        console.log(data)
                      })
                          .then(() => {
                            console.log('then')
                            console.log(Cookies.get())
                          })
                    })
              })
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
